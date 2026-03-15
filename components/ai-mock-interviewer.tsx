"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  MOCK_INTERVIEW_FOCUS_DESCRIPTIONS,
  MOCK_INTERVIEW_FOCUS_LABELS,
} from "@/lib/mock-config";
import { loadProfile } from "@/lib/storage/profile-store";
import { saveSessionResult } from "@/lib/storage/session-store";
import type {
  MockInterviewCoachFeedback,
  MockInterviewFocus,
  MockInterviewRequest,
  MockInterviewResponse,
  MockInterviewTranscriptTurn,
  UserProfile,
} from "@/lib/types";
import { MOCK_INTERVIEW_FOCUSES } from "@/lib/types";
import { clampScore, plusDays } from "@/lib/utils";

type AiMockInterviewerProps = {
  aiConfigured: boolean;
  defaultProfile: UserProfile;
};

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = Event & {
  error?: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
type WindowWithSpeechRecognition = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

async function parseError(response: Response) {
  const fallback = "The AI interviewer could not reply right now. Please try again.";

  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? fallback;
  } catch {
    return fallback;
  }
}

function calculateAverage(feedbackMap: Record<string, MockInterviewCoachFeedback>) {
  const feedbackList = Object.values(feedbackMap);

  if (feedbackList.length === 0) {
    return 0;
  }

  const total = feedbackList.reduce((sum, feedback) => sum + feedback.score, 0);
  return total / feedbackList.length;
}

function speakWithBrowser(text: string, enabled: boolean) {
  if (typeof window === "undefined" || !enabled || !text.trim()) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.98;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function AiMockInterviewer({ aiConfigured, defaultProfile }: AiMockInterviewerProps) {
  const [profile] = useState(() => loadProfile(defaultProfile));
  const [focusTrack, setFocusTrack] = useState<MockInterviewFocus>("react");
  const [totalTurns, setTotalTurns] = useState(5);
  const [transcript, setTranscript] = useState<MockInterviewTranscriptTurn[]>([]);
  const [feedbackByQuestionId, setFeedbackByQuestionId] = useState<Record<string, MockInterviewCoachFeedback>>({});
  const [session, setSession] = useState<MockInterviewResponse | null>(null);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const lastSpokenSignatureRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const browserWindow = window as WindowWithSpeechRecognition;
    const Recognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    setSpeechSynthesisSupported("speechSynthesis" in window);
    setSpeechRecognitionSupported(Boolean(Recognition));

    if (!Recognition) {
      return () => {
        window.speechSynthesis.cancel();
      };
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let finalText = finalTranscriptRef.current;
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript?.trim() ?? "";

        if (!transcript) {
          continue;
        }

        if (result.isFinal) {
          finalText = [finalText, transcript].filter(Boolean).join(" ").trim();
        } else {
          interimText = [interimText, transcript].filter(Boolean).join(" ").trim();
        }
      }

      finalTranscriptRef.current = finalText;
      setDraftAnswer([finalText, interimText].filter(Boolean).join(" ").trim());
    };
    recognition.onerror = (event) => {
      const message = event.error === "not-allowed"
        ? "Microphone permission was blocked. Please allow microphone access and try again."
        : "Voice input stopped unexpectedly. You can try the microphone again or keep typing.";
      setVoiceError(message);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setDraftAnswer((current) => current.trim());
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!autoSpeak || !session) {
      return;
    }

    const spokenText = [session.interviewerMessage, session.done ? "" : session.nextQuestion?.prompt ?? ""]
      .filter(Boolean)
      .join(". ");
    const nextSignature = `${session.answeredCount}:${spokenText}`;

    if (!spokenText || nextSignature === lastSpokenSignatureRef.current) {
      return;
    }

    lastSpokenSignatureRef.current = nextSignature;
    speakWithBrowser(spokenText, speechSynthesisSupported);
  }, [autoSpeak, session, speechSynthesisSupported]);

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function startListening() {
    if (!speechRecognitionSupported || !recognitionRef.current) {
      setVoiceError("Voice input needs a browser with speech-recognition support.");
      return;
    }

    try {
      finalTranscriptRef.current = draftAnswer.trim();
      setVoiceError(null);
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setVoiceError("The microphone is already in use. Stop the current recording, then try again.");
    }
  }

  function speakCurrentPrompt() {
    if (!session) {
      return;
    }

    const spokenText = [session.interviewerMessage, session.done ? "" : session.nextQuestion?.prompt ?? ""]
      .filter(Boolean)
      .join(". ");
    speakWithBrowser(spokenText, speechSynthesisSupported);
  }

  async function callInterviewer(nextTranscript: MockInterviewTranscriptTurn[]) {
    const payload: MockInterviewRequest = {
      focusTrack,
      totalTurns,
      transcript: nextTranscript,
      profile,
    };

    const response = await fetch("/api/ai/run-mock-interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return (await response.json()) as MockInterviewResponse;
  }

  async function startSession() {
    stopListening();
    setIsLoading(true);
    setError(null);
    setVoiceError(null);
    setTranscript([]);
    setFeedbackByQuestionId({});
    setDraftAnswer("");

    try {
      const nextSession = await callInterviewer([]);
      setSession(nextSession);
    } catch (nextError) {
      setSession(null);
      setError(nextError instanceof Error ? nextError.message : "Unable to start the AI interview.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitAnswer() {
    if (!session?.nextQuestion || !draftAnswer.trim()) {
      return;
    }

    stopListening();
    const answeredTurn: MockInterviewTranscriptTurn = {
      questionId: session.nextQuestion.id,
      question: session.nextQuestion.prompt,
      answer: draftAnswer.trim(),
    };
    const nextTranscript = [...transcript, answeredTurn];

    setIsLoading(true);
    setError(null);

    try {
      const nextSession = await callInterviewer(nextTranscript);
      const nextFeedbackByQuestionId = nextSession.feedback
        ? {
            ...feedbackByQuestionId,
            [answeredTurn.questionId]: nextSession.feedback,
          }
        : feedbackByQuestionId;

      setTranscript(nextTranscript);
      setFeedbackByQuestionId(nextFeedbackByQuestionId);
      setSession(nextSession);
      setDraftAnswer("");

      if (nextSession.done) {
        const weakTags = Array.from(
          new Set([
            ...nextTranscript.flatMap((turn) => nextFeedbackByQuestionId[turn.questionId]?.nextFocus ?? []),
            ...Object.values(nextFeedbackByQuestionId).flatMap((feedback) => feedback.nextFocus),
            ...nextSession.weakTags,
          ]),
        );

        await saveSessionResult({
          id: crypto.randomUUID(),
          mode: "mock",
          questionIds: nextTranscript.map((turn) => turn.questionId),
          score: clampScore(calculateAverage(nextFeedbackByQuestionId)),
          weakTags,
          reviewedAt: new Date().toISOString(),
          nextReviewAt: plusDays(1),
        });
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to evaluate your answer.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="stack-lg">
      <div className="panel stack-md">
        <div className="split">
          <div>
            <span className="eyebrow">AI-guided mock interviewer</span>
            <h2>Practice one question at a time with feedback in two layers</h2>
          </div>
          <span className={`pill ${aiConfigured ? "" : "warn"}`}>
            {aiConfigured ? "AI provider configured" : "Set AI_API_KEY to enable"}
          </span>
        </div>
        <p>
          This mode uses your local question bank, offline packs, and saved resume profile to run an interview round.
          After every answer, it gives a plain-English rewrite first and an interview-ready rewrite second.
        </p>
        <div className="callout">
          <strong>Voice practice</strong>
          <p>
            Your browser can read the interviewer aloud and fill the answer box from your microphone. That lets you
            practice speaking first, not only typing.
          </p>
          <div className="pill-row">
            <span className="pill">{speechSynthesisSupported ? "Speech playback ready" : "Speech playback unavailable"}</span>
            <span className="pill">{speechRecognitionSupported ? "Microphone dictation ready" : "Microphone dictation unavailable"}</span>
            <button type="button" className="button-secondary" onClick={() => setAutoSpeak((value) => !value)}>
              {autoSpeak ? "Auto-read on" : "Auto-read off"}
            </button>
          </div>
        </div>
        <div className="grid-2">
          <label className="field">
            <span>Round focus</span>
            <select
              className="select"
              value={focusTrack}
              onChange={(event) => setFocusTrack(event.target.value as MockInterviewFocus)}
              disabled={isLoading}
            >
              {MOCK_INTERVIEW_FOCUSES.map((option) => (
                <option key={option} value={option}>
                  {MOCK_INTERVIEW_FOCUS_LABELS[option]}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Question count</span>
            <select
              className="select"
              value={String(totalTurns)}
              onChange={(event) => setTotalTurns(Number(event.target.value))}
              disabled={isLoading}
            >
              <option value="3">3 questions</option>
              <option value="4">4 questions</option>
              <option value="5">5 questions</option>
            </select>
          </label>
        </div>
        <div className="callout">
          <strong>{MOCK_INTERVIEW_FOCUS_LABELS[focusTrack]}</strong>
          <p>{MOCK_INTERVIEW_FOCUS_DESCRIPTIONS[focusTrack]}</p>
        </div>
        {!aiConfigured ? (
          <div className="callout">
            <strong>How to enable it</strong>
            <p>
              Create a <code>.env.local</code> file from <code>.env.example</code>, add <code>AI_API_KEY</code>, and
              restart the app. You can also set <code>AI_BASE_URL</code> and <code>AI_MODEL</code> for an
              OpenAI-compatible provider. The self-scored mock below will still work even without AI.
            </p>
          </div>
        ) : (
          <button type="button" className="button-primary" onClick={startSession} disabled={isLoading}>
            {session ? "Restart AI round" : "Start AI round"}
          </button>
        )}
        {error ? <p className="subtle">{error}</p> : null}
        {voiceError ? <p className="subtle">{voiceError}</p> : null}
      </div>

      {session ? (
        <div className="panel stack-md">
          <span className="eyebrow">
            Answered {session.answeredCount} / {session.totalTurns}
          </span>
          <p className="lede">{session.interviewerMessage}</p>
          {session.weakTags.length > 0 ? (
            <div className="tag-row">
              {session.weakTags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {session.recommendedTopics.length > 0 ? (
            <div className="pill-row">
              {session.recommendedTopics.map((topic) => (
                <Link key={topic.slug} href={`/topics/${topic.slug}`} className="text-link">
                  Review {topic.title}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {transcript.length > 0 ? (
        <section className="stack-md">
          <div>
            <span className="eyebrow">Answered so far</span>
            <h3>Transcript with coaching</h3>
          </div>
          {transcript.map((turn, index) => {
            const feedback = feedbackByQuestionId[turn.questionId];

            return (
              <article key={turn.questionId} className="panel stack-md">
                <span className="eyebrow">Question {index + 1}</span>
                <h3>{turn.question}</h3>
                <div className="callout">
                  <strong>Your answer</strong>
                  <p>{turn.answer}</p>
                </div>
                {feedback ? (
                  <>
                    <div className="split">
                      <strong>Coach score</strong>
                      <span className="pill warn">{feedback.score} / 100</span>
                    </div>
                    <p>{feedback.verdict}</p>
                    <div className="grid-2">
                      <div className="callout">
                        <strong>What worked</strong>
                        <ul className="plain-list subtle">
                          {feedback.whatWentWell.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="callout">
                        <strong>What to improve</strong>
                        <ul className="plain-list subtle">
                          {feedback.missingPoints.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="callout">
                        <strong>Plain-English rewrite</strong>
                        <p>{feedback.beginnerRewrite}</p>
                      </div>
                      <div className="callout">
                        <strong>Interview-ready rewrite</strong>
                        <p>{feedback.interviewRewrite}</p>
                      </div>
                    </div>
                    <div className="callout">
                      <strong>Practice next</strong>
                      <ul className="plain-list subtle">
                        {feedback.nextFocus.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : null}

      {session?.done ? (
        <section className="panel stack-md">
          <span className="eyebrow">Round complete</span>
          <h3>AI feedback saved into your revision flow</h3>
          <p>
            Your weak areas from this round are now stored locally, so the revision page can turn them into the next
            focused study block.
          </p>
        </section>
      ) : null}

      {session?.nextQuestion && !session.done ? (
        <section className="panel stack-md">
          <div className="split">
            <div>
              <span className="eyebrow">Current question</span>
              <h3>{session.nextQuestion.prompt}</h3>
            </div>
            <span className="pill">{session.nextQuestion.roundType}</span>
          </div>
          <p className="subtle">{session.nextQuestion.answerHint}</p>
          <div className="split">
            <div className="pill-row">
              <button
                type="button"
                className="button-secondary"
                onClick={speakCurrentPrompt}
                disabled={!speechSynthesisSupported || isLoading}
              >
                Read aloud
              </button>
              <button
                type="button"
                className={isListening ? "button-danger" : "button-secondary"}
                onClick={isListening ? stopListening : startListening}
                disabled={!speechRecognitionSupported || isLoading}
              >
                {isListening ? "Stop microphone" : "Start microphone"}
              </button>
            </div>
            {isListening ? <span className="pill warn">Listening now</span> : null}
          </div>
          <textarea
            className="textarea"
            rows={7}
            value={draftAnswer}
            onChange={(event) => setDraftAnswer(event.target.value)}
            placeholder="Say your answer aloud first. The microphone can fill this box for you, or you can type."
            disabled={isLoading}
          />
          <div className="split">
            <Link href={`/topics/${session.nextQuestion.topicSlug}`} className="text-link">
              Review {session.nextQuestion.topicTitle}
            </Link>
            <button
              type="button"
              className="button-primary"
              onClick={submitAnswer}
              disabled={isLoading || !draftAnswer.trim()}
            >
              {isLoading ? "Checking answer..." : "Submit answer"}
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}
