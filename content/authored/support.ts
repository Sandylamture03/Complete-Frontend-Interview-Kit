import type { CodingPrompt, Question, ResumePrompt, SourceRef, UserProfile } from "@/lib/types";

const ref = (
  sourceId: string,
  label: string,
  path: string,
  notes?: string,
  kind: SourceRef["kind"] = "curated",
): SourceRef => ({
  sourceId,
  label,
  path,
  notes,
  kind,
});

export const authoredQuestions: Question[] = [
  {
    id: "q-render-1",
    topicId: "react-rendering",
    track: "react",
    prompt: "What is the difference between rendering and reconciliation in React?",
    answerShort:
      "Rendering calculates the next UI tree. Reconciliation compares previous and next trees and decides minimal DOM updates.",
    answerDeep:
      "A render is React calling component functions to produce the next element tree. Reconciliation is the diffing step where React compares previous and next output, preserves stable identity, and updates the real DOM only where needed during commit.",
    followUps: ["What role do keys play?", "Can a component render without a DOM change?"],
    roundType: "theory",
    tags: ["react", "rendering", "reconciliation"],
    timerSeconds: 90,
    mcq: {
      question: "Which statement is correct?",
      options: [
        "Rendering always means a full DOM rewrite.",
        "Reconciliation compares previous and next UI trees.",
        "Keys are only for CSS styling.",
      ],
      correctAnswer: "Reconciliation compares previous and next UI trees.",
      explanation: "React renders first, then reconciles trees to minimize real DOM work.",
    },
  },
  {
    id: "q-render-2",
    topicId: "react-rendering",
    track: "react",
    prompt: "Why are keys important in React lists?",
    answerShort:
      "Keys help React track identity between renders so it can reuse the right item and preserve state correctly.",
    answerDeep:
      "Stable keys tell React which list item is the same logical item across renders. Good keys preserve child state and prevent broken reuse. Dynamic lists should avoid array index unless the order never changes.",
    followUps: ["When is index acceptable?", "How can wrong keys break form state?"],
    roundType: "screening",
    tags: ["keys", "lists", "react"],
  },
  {
    id: "q-hooks-1",
    topicId: "react-hooks",
    track: "react",
    prompt: "When should you use useEffect and when should you avoid it?",
    answerShort:
      "Use it for side effects like fetches, subscriptions, timers, or syncing with external systems. Avoid it for values you can derive during render.",
    answerDeep:
      "useEffect runs after render and is appropriate for work outside the render phase. If a value can be derived directly from props and state, keeping it in render is simpler and avoids extra state, extra effects, and stale behavior.",
    followUps: ["How do you prevent race conditions?", "What should cleanup do?"],
    roundType: "theory",
    tags: ["hooks", "useEffect", "react"],
  },
  {
    id: "q-hooks-2",
    topicId: "react-hooks",
    track: "react",
    prompt: "What is a stale closure bug in React?",
    answerShort:
      "It happens when a callback or effect keeps an old value from a previous render and later uses outdated state or props.",
    answerDeep:
      "Function components create new closures on every render. If an effect, timer, or handler reads values that are not kept current through dependencies, refs, or safe updater functions, it can run later with outdated values. That is a stale closure bug.",
    followUps: ["How can functional state updates help?", "When would you use a ref?"],
    roundType: "coding",
    tags: ["hooks", "closures", "bug-hunting"],
  },
  {
    id: "q-state-1",
    topicId: "react-state",
    track: "react",
    prompt: "How do you decide whether state should be local, lifted, or global?",
    answerShort:
      "Keep it local by default, lift it when multiple siblings need the same truth, and go wider only when many distant consumers truly need it.",
    answerDeep:
      "The choice depends on ownership and usage. Local state keeps components simpler. Lifting state helps sibling coordination. Context or a store helps when data is broadly shared, but it should not become a dumping ground. I also separate server cache from UI state because they solve different problems.",
    followUps: ["When is context a bad choice?", "How do you separate server state from UI state?"],
    roundType: "design",
    tags: ["state", "architecture", "context"],
  },
  {
    id: "q-performance-1",
    topicId: "react-performance",
    track: "react",
    prompt: "What is your process for fixing a slow React screen?",
    answerShort: "Measure first, identify the bottleneck, apply a targeted fix, and verify the UX improved.",
    answerDeep:
      "I start with profiling and browser metrics to separate render cost, network cost, and bundle cost. Then I narrow the hot path: expensive computation, repeated child renders, large lists, unnecessary store updates, or oversized bundles. After the smallest useful fix, I re-measure.",
    followUps: ["When would you use React.memo?", "How would you optimize a long list?"],
    roundType: "design",
    tags: ["performance", "profiling", "react"],
  },
  {
    id: "q-event-loop-1",
    topicId: "event-loop",
    track: "javascript",
    prompt: "Why do promise callbacks run before setTimeout callbacks after synchronous code finishes?",
    answerShort:
      "Because resolved promise callbacks go into the microtask queue, and microtasks run before the next macrotask like setTimeout.",
    answerDeep:
      "Once the call stack is empty, the event loop processes microtasks first. Promise callbacks are microtasks. Timers schedule macrotasks, so they wait until the microtask queue finishes before running.",
    followUps: ["Can too many microtasks hurt responsiveness?", "What else is a microtask?"],
    roundType: "theory",
    tags: ["event-loop", "promises", "microtasks"],
  },
  {
    id: "q-dom-1",
    topicId: "dom-events",
    track: "browser",
    prompt: "What is event delegation and why is it useful?",
    answerShort:
      "Event delegation puts one listener on a parent and handles child interactions by checking the event target.",
    answerDeep:
      "It uses bubbling so a stable parent can manage many dynamic child elements. It reduces listener count, works well for changing lists, and is common in practical DOM interactions like menus, tables, and autocomplete results.",
    followUps: ["What is the difference between target and currentTarget?", "Which events do not bubble the way you expect?"],
    roundType: "coding",
    tags: ["dom", "events", "browser"],
  },
  {
    id: "q-html-css-1",
    topicId: "html-css-layout",
    track: "html-css",
    prompt: "When would you choose flexbox and when would you choose grid?",
    answerShort:
      "Use flexbox for one-dimensional alignment in a row or column. Use grid when both rows and columns matter together.",
    answerDeep:
      "Flexbox is strongest when the content flows mainly in one direction and alignment within that axis matters most. Grid is better when the full page or component layout depends on both rows and columns together, such as dashboards, card layouts, or structured page sections.",
    followUps: ["Can flexbox still build a full page layout?", "How do you decide between auto-fit and media queries?"],
    roundType: "screening",
    tags: ["html", "css", "flexbox", "grid"],
  },
  {
    id: "q-html-css-2",
    topicId: "html-css-layout",
    track: "html-css",
    prompt: "How do you build responsive UI without creating messy CSS?",
    answerShort:
      "Start with fluid layout, reusable spacing rules, and content-based breakpoints instead of piling on random media queries.",
    answerDeep:
      "I begin with semantic markup and flexible layout primitives like flexbox or grid, then I use relative sizing, consistent spacing tokens, and only a few meaningful breakpoints where the content actually needs to adapt. I also prefer component-level responsiveness and avoid one-off overrides that become hard to maintain.",
    followUps: ["What CSS units do you prefer for spacing?", "How do you keep typography readable across devices?"],
    roundType: "design",
    tags: ["responsive-design", "css", "maintainability"],
  },
  {
    id: "q-a11y-1",
    topicId: "accessibility-foundations",
    track: "accessibility",
    prompt: "What are the accessibility basics you check in any UI feature?",
    answerShort:
      "Semantic HTML, keyboard support, visible focus, labels, contrast, and screen-reader-friendly names.",
    answerDeep:
      "I first use the right native elements. Then I check tab order, focus visibility, accessible names, form labels, contrast, heading structure, and whether status or error messages are announced properly. Complex widgets may need ARIA, but semantic HTML comes first.",
    followUps: ["Why is a div button a problem?", "How do you test keyboard navigation?"],
    roundType: "theory",
    tags: ["a11y", "html", "css"],
  },
  {
    id: "q-security-1",
    topicId: "performance-security",
    track: "performance-security",
    prompt: "What frontend performance and security topics do you consider must-know for interviews?",
    answerShort:
      "Performance: web vitals, bundle size, rendering cost, caching. Security: XSS, safe HTML rendering, token handling, and browser trust boundaries.",
    answerDeep:
      "For performance I talk about loading speed, responsiveness, layout stability, bundle strategy, and heavy main-thread work. For security I talk about sanitizing untrusted HTML, escaping dynamic content, understanding client-side token risks, and keeping browser trust boundaries explicit.",
    followUps: ["How would you reduce LCP?", "When is dangerouslySetInnerHTML acceptable?"],
    roundType: "screening",
    tags: ["performance", "security", "web-vitals"],
  },
  {
    id: "q-testing-1",
    topicId: "testing",
    track: "frontend",
    prompt: "What is your frontend testing strategy for a product feature?",
    answerShort:
      "I test pure logic with unit tests, user behavior with component or integration tests, and business-critical flows with e2e tests.",
    answerDeep:
      "My strategy follows confidence and cost. Pure utilities and reducers get unit tests. Component tests verify user-visible states and async behavior. Critical journeys get end-to-end coverage. I avoid brittle implementation-detail assertions and include accessibility checks where possible.",
    followUps: ["What should not be snapshot-tested?", "Why prefer role-based queries?"],
    roundType: "design",
    tags: ["testing", "quality", "frontend"],
  },
  {
    id: "q-dsa-1",
    topicId: "dsa-patterns",
    track: "dsa",
    prompt: "Which DSA patterns matter most for frontend interviews?",
    answerShort:
      "Hash maps, sliding window, two pointers, stacks, sorting, and traversal patterns matter most.",
    answerDeep:
      "Frontend rounds often target clean thinking around strings, arrays, event data, trees, and ranking. That means lookup tables, sliding windows, pointer movement, stacks, queues, BFS or DFS, and complexity analysis are usually more useful than advanced niche structures.",
    followUps: ["How do you explain brute force before optimizing?", "Which pattern helps autocomplete ranking problems?"],
    roundType: "coding",
    tags: ["dsa", "frontend-rounds", "patterns"],
  },
  {
    id: "q-machine-1",
    topicId: "machine-coding",
    track: "machine-coding",
    prompt: "How do you approach a machine-coding round when time is short?",
    answerShort:
      "Clarify scope, define the data model, ship the happy path, then add polish and edge cases in priority order.",
    answerDeep:
      "I begin with requirements and constraints, then I outline components and state ownership. I implement the main use case first, keeping logic and UI reasonably separated. With time left, I add accessibility, validation, and small refinements. I narrate tradeoffs so the interviewer sees judgment, not just code.",
    followUps: ["What do you deliberately postpone?", "How do you structure folders quickly?"],
    roundType: "machine-coding",
    tags: ["machine-coding", "time-management", "ui-architecture"],
  },
  {
    id: "q-system-1",
    topicId: "system-design",
    track: "system-design",
    prompt: "How would you structure a frontend system design answer for an autocomplete feature?",
    answerShort:
      "Start with user flows, then cover input handling, debouncing, cancellation, result rendering, accessibility, caching, and failure states.",
    answerDeep:
      "I would talk through the UX first, then the state model: input state, request state, cached results, highlighted item, and selection state. I would include debouncing, abortable requests, keyboard navigation, latency handling, empty states, analytics, and how results are virtualized or paginated if large.",
    followUps: ["Where does caching live?", "How do you keep it accessible?"],
    roundType: "design",
    tags: ["system-design", "autocomplete", "frontend"],
  },
  {
    id: "q-resume-1",
    topicId: "resume-storytelling",
    track: "resume-behavioral",
    prompt: "How do you answer 'Tell me about a project you are proud of' without sounding generic?",
    answerShort:
      "Use a short structure: problem, your ownership, decision, measurable impact, and learning.",
    answerDeep:
      "Start with the business or user problem, state your exact responsibility, explain one or two key technical decisions, give a measurable result if possible, and close with what you learned or would improve next time. This keeps the answer specific and believable.",
    followUps: ["How do you handle missing metrics?", "How do you explain team work honestly?"],
    roundType: "behavioral",
    tags: ["resume", "behavioral", "projects"],
  },
];

export const codingPrompts: CodingPrompt[] = [
  {
    id: "cp-debounce",
    track: "javascript",
    difficulty: "1-3y",
    title: "Implement debounce",
    scenario: "Build a debounce utility for search input so the API is not called on every key press.",
    requirements: [
      "Return a function that delays execution until the user stops triggering it.",
      "Preserve the latest arguments.",
      "Preserve the calling context.",
      "Support re-triggering before the timer finishes.",
    ],
    hints: [
      "Keep a timer reference in a closure.",
      "Clear the previous timer before creating a new one.",
      "Use apply or call if you want to preserve this.",
    ],
    solutionOutline: [
      "Store timer id outside the returned function.",
      "Clear the old timer on each call.",
      "Start a new timer and invoke the original function with latest args.",
    ],
    evaluationChecklist: [
      "Correct closure usage.",
      "No orphan timers.",
      "Readable naming and edge-case thinking.",
    ],
    starterCode: `function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {\n  let timer: ReturnType<typeof setTimeout> | undefined;\n  return function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {\n    // TODO\n  };\n}`,
    sourceRefs: [
      ref("mock-guide", "Frontend self mock guide", "context/Frontend Interview_ Topic-Wise Self Mock Interview Guide.docx"),
      ref("js-questions", "JS interview preparation", "context/JS Interview Preparation Questions.docx"),
    ],
  },
  {
    id: "cp-promise-all",
    track: "javascript",
    difficulty: "3-6y",
    title: "Polyfill Promise.all",
    scenario: "Implement Promise.all behavior for an interview round focused on asynchronous JavaScript fundamentals.",
    requirements: [
      "Resolve only when all promises resolve.",
      "Preserve result order by input index.",
      "Reject immediately on the first rejection.",
      "Handle non-promise values too.",
    ],
    hints: [
      "Count resolved items.",
      "Wrap each item with Promise.resolve.",
      "Pre-size the result array to preserve order.",
    ],
    solutionOutline: [
      "Create a new Promise wrapper.",
      "Handle the empty input case.",
      "Resolve each item and store result by index.",
      "Reject on the first failure.",
    ],
    evaluationChecklist: [
      "Correct empty-array handling.",
      "Order preserved.",
      "First rejection rejects the outer promise.",
    ],
    sourceRefs: [
      ref("mock-guide", "Frontend self mock guide", "context/Frontend Interview_ Topic-Wise Self Mock Interview Guide.docx"),
      ref("400-js-pdf", "400 JS interview questions", "context/400- JS Interview Questions.pdf"),
    ],
  },
  {
    id: "cp-tabs",
    track: "machine-coding",
    difficulty: "1-3y",
    title: "Build accessible tabs",
    scenario: "Create an interview-ready tabs component with keyboard support and a clean state boundary.",
    requirements: [
      "One active tab at a time.",
      "Keyboard navigation with arrow keys.",
      "Accessible roles and labels.",
      "Keep state easy to follow.",
    ],
    hints: [
      "Use button elements for triggers.",
      "Track active tab id in one place.",
      "Map ids to panel and tab relationships.",
    ],
    solutionOutline: [
      "Model the active id in parent state.",
      "Render a tablist with buttons and associated panels.",
      "Handle focus movement separately from rendering.",
    ],
    evaluationChecklist: [
      "Accessible semantics.",
      "Readable component boundaries.",
      "No duplicated state.",
    ],
    sourceRefs: [
      ref("machine-coding-sheet", "Machine coding cheat sheet", "context/Frontend Machine Coding Cheat Sheet.pdf"),
      ref("html-css-questions", "HTML CSS interview questions", "context/HTML CSS interview question.docx"),
    ],
  },
  {
    id: "cp-autocomplete",
    track: "machine-coding",
    difficulty: "3-6y",
    title: "Build autocomplete with debounced search",
    scenario: "Implement an autocomplete widget with request cancellation, keyboard support, and stable loading states.",
    requirements: [
      "Debounce API calls.",
      "Cancel outdated requests.",
      "Support arrow keys and enter.",
      "Show loading, empty, and error states.",
    ],
    hints: [
      "Separate input state from async state.",
      "AbortController helps with stale requests.",
      "Keep highlighted index independent from network state.",
    ],
    solutionOutline: [
      "Model query, status, results, and highlighted item.",
      "Debounce query changes before requests.",
      "Abort stale requests when query changes.",
      "Use semantic list or combobox behavior.",
    ],
    evaluationChecklist: [
      "Clear async state management.",
      "Keyboard accessibility.",
      "No race condition between requests.",
      "Reasonable separation of logic and view.",
    ],
    sourceRefs: [
      ref("machine-coding-sheet", "Machine coding cheat sheet", "context/Frontend Machine Coding Cheat Sheet.pdf"),
      ref("system-design-pdf", "Frontend system design guide", "context/Geeky Frontend_ The Ultimate Guide to Frontend System Design.pdf"),
    ],
  },
  {
    id: "cp-infinite-scroll",
    track: "frontend",
    difficulty: "3-6y",
    title: "Design or implement infinite scroll feed",
    scenario: "Explain and optionally code a feed that loads more items while keeping UI smooth and predictable.",
    requirements: [
      "Fetch next page only when needed.",
      "Prevent duplicate requests.",
      "Show loading and end states.",
      "Consider virtualization for large feeds.",
    ],
    hints: [
      "IntersectionObserver is often cleaner than scroll listeners.",
      "Separate page cursor from visible items.",
      "Think about retry and end-of-list behavior.",
    ],
    solutionOutline: [
      "Track items, cursor, status, and hasMore.",
      "Observe a sentinel near the bottom.",
      "Fetch next page when visible and guard duplicate calls.",
    ],
    evaluationChecklist: [
      "No repeated fetch loop.",
      "Loading and empty states handled.",
      "Performance discussion includes virtualization.",
    ],
    sourceRefs: [
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
      ref("performance-doc", "Performance and security notes", "context/Web perfomance and security.docx"),
    ],
  },
  {
    id: "cp-kanban",
    track: "machine-coding",
    difficulty: "3-6y",
    title: "Kanban board or task manager",
    scenario: "Build a board with columns, task movement, and a clean state model under interview time pressure.",
    requirements: [
      "Support adding and moving tasks.",
      "Maintain stable ids and a clear state shape.",
      "Prefer clarity over over-engineering.",
      "Mention what you would add with more time.",
    ],
    hints: [
      "Model columns and task ids separately.",
      "Avoid deeply nested updates if possible.",
      "A reducer can make movement logic easier to reason about.",
    ],
    solutionOutline: [
      "Normalize the state enough for clean updates.",
      "Separate move logic from rendering.",
      "Deliver the happy path first, then add polish or persistence.",
    ],
    evaluationChecklist: [
      "State is easy to update.",
      "UI remains readable.",
      "Tradeoffs are explained clearly.",
    ],
    sourceRefs: [
      ref("machine-coding-sheet", "Machine coding cheat sheet", "context/Frontend Machine Coding Cheat Sheet.pdf"),
      ref("dsa-doc", "DSA for frontend", "context/DSA for frontend.docx"),
    ],
  },
];

export const defaultProfile: UserProfile = {
  name: "Sandeep Lamture",
  title: "React Developer",
  yearsExperience: "4 years",
  targetBand: "Mid-level React / Frontend Engineer",
  coreStack: [
    "React.js",
    "Redux",
    "React Hooks",
    "JavaScript ES6+",
    "TypeScript",
    "HTML5",
    "CSS3",
    "TailwindCSS",
    "Jest",
    "React Testing Library",
  ],
  projectHighlights: [
    "Reusable React components and custom hooks that reduced development time by 30% at TCS.",
    "Performance work using code splitting, lazy loading, and profiling that reduced load time by 35%.",
    "Testing and bug-reduction story using Jest and React Testing Library that cut production bugs by 70%.",
    "Cross-functional delivery story with designers, backend developers, and product managers across browsers and devices.",
  ],
  weakAreas: ["Frontend system design", "Machine coding speed", "Behavioral answers", "DSA recall"],
  targetCompanies: ["Product companies", "React-heavy teams", "Frontend platform teams"],
  elevatorPitch:
    "I am a React developer with 4 years of experience building responsive web applications, reusable component systems, performance improvements, and testable frontend features across cross-functional product teams.",
  resumeNotes: [
    "Current experience detected: Tata Consultancy Services from October 2022 to present, with prior frontend experience at Randstad India from September 2021 to September 2022.",
    "Resume strengths to emphasize: reusable components, performance optimization, testing quality, responsive UI, code review, accessibility, and cross-browser delivery.",
  ],
};

export const resumePrompts: ResumePrompt[] = [
  {
    id: "rp-proud-project",
    title: "Project you are proud of",
    question: "Tell me about a project you are proud of and why it matters.",
    whyItMatters: "Interviewers want clarity, ownership, and impact rather than a long story.",
    answerFrame: ["Context", "Problem", "Your ownership", "Key decision", "Outcome", "Learning"],
  },
  {
    id: "rp-scale",
    title: "Scale story",
    question: "Describe a time you improved performance, scale, or maintainability in a frontend application.",
    whyItMatters: "Mid-level interviews test whether you can move beyond feature delivery into product quality.",
    answerFrame: ["Before state", "Pain point", "Investigation", "Fix", "Metric or outcome", "Tradeoff"],
  },
  {
    id: "rp-conflict",
    title: "Conflict or tradeoff",
    question: "Describe a disagreement or tradeoff discussion with design, backend, or product and how you handled it.",
    whyItMatters: "This shows maturity, communication, and decision-making.",
    answerFrame: ["Situation", "Stakeholders", "Tradeoff", "Your approach", "Resolution", "Learning"],
  },
  {
    id: "rp-mistake",
    title: "Mistake and recovery",
    question: "Tell me about a mistake you made and how you handled it.",
    whyItMatters: "The interviewer is checking honesty, ownership, and recovery behavior.",
    answerFrame: ["What happened", "Root cause", "Immediate fix", "Prevention", "Learning"],
  },
];
