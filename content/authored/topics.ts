import type { SourceRef, Topic } from "@/lib/types";

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

export const authoredTopics: Topic[] = [
  {
    id: "react-rendering",
    slug: "react-rendering-and-reconciliation",
    track: "react",
    difficulty: "3-6y",
    title: "React Rendering and Reconciliation",
    summary: "Know when React renders, why it re-renders, and how reconciliation updates the real DOM.",
    simpleExplanation:
      "React keeps a light picture of the UI in memory. When props or state change, React compares the new picture with the old one and updates only the parts that changed.",
    analogy:
      "A teacher compares two answer sheets and only corrects the lines that changed instead of rewriting the whole page.",
    interviewAnswer:
      "Render means React runs component functions to produce the next UI tree. Reconciliation is the diffing step where React compares previous and next trees, keeps elements with stable identity, and applies minimal DOM changes during commit. Parent renders, state updates, context changes, and store subscriptions are the usual triggers. Keys help preserve identity inside lists.",
    codeSnippet: `function ProductList({ products }: { products: { id: string; name: string }[] }) {\n  return (\n    <ul>\n      {products.map((product) => (\n        <li key={product.id}>{product.name}</li>\n      ))}\n    </ul>\n  );\n}`,
    pitfalls: [
      "Saying React updates the full DOM every time.",
      "Using unstable keys in dynamic lists.",
      "Treating every render like a bug.",
    ],
    tags: ["rendering", "reconciliation", "keys", "virtual-dom"],
    oneMinuteAnswer: [
      "Render calculates the next UI tree.",
      "Reconciliation compares old and new trees.",
      "Commit applies DOM updates.",
      "Stable keys preserve identity.",
    ],
    cheatSheet: [
      "Render is calculation, not always DOM work.",
      "Commit is when the DOM changes.",
      "Parent renders can trigger child renders.",
      "Keys matter for lists with change.",
    ],
    sourceRefs: [
      ref("react-ebook", "React interview questions ebook", "context/React interview questions- Ebook.docx"),
      ref("react-pdf", "React questions PDF", "context/ReactJS-Questions-and-answers.pdf"),
    ],
    relatedTopicIds: ["react-hooks", "react-performance"],
  },
  {
    id: "react-hooks",
    slug: "use-effect-without-regret",
    track: "react",
    difficulty: "3-6y",
    title: "Hooks, Especially useEffect",
    summary: "Explain hooks clearly and use useEffect only for real side effects.",
    simpleExplanation:
      "useState stores local data. useEffect is for work outside render, like fetching, subscriptions, timers, or syncing to browser APIs.",
    analogy:
      "Render is writing homework. useEffect is stepping outside to submit it, listen for updates, or clean the board later.",
    interviewAnswer:
      "Hooks let function components use stateful behavior. useEffect runs after render and should be reserved for side effects, not for values that can be derived during render. The dependency list describes which reactive values the effect reads, and cleanup removes subscriptions, timers, or stale async work.",
    codeSnippet: `function Profile({ userId }: { userId: string }) {\n  const [user, setUser] = useState<{ name: string } | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    fetch('/api/users/' + userId, { signal: controller.signal })\n      .then((response) => response.json())\n      .then(setUser)\n      .catch((error) => {\n        if (error.name !== 'AbortError') console.error(error);\n      });\n\n    return () => controller.abort();\n  }, [userId]);\n\n  return <p>{user?.name ?? 'Loading...'}</p>;\n}`,
    pitfalls: [
      "Using useEffect for derived values.",
      "Skipping dependencies to silence the linter.",
      "Forgetting cleanup for timers or subscriptions.",
    ],
    tags: ["hooks", "useEffect", "cleanup", "stale-closures"],
    oneMinuteAnswer: [
      "useEffect is for side effects after render.",
      "Dependencies should match the values read inside.",
      "Cleanup runs before re-run or unmount.",
      "Derived display values usually belong in render.",
    ],
    cheatSheet: [
      "useState for local data.",
      "useEffect for network, subscriptions, timers, DOM sync.",
      "Abort async work on change.",
      "Keep effect scope narrow.",
    ],
    sourceRefs: [
      ref("react-ebook", "React interview questions ebook", "context/React interview questions- Ebook.docx"),
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
    ],
    relatedTopicIds: ["react-state", "react-performance"],
  },
  {
    id: "react-state",
    slug: "state-modeling-and-data-flow",
    track: "react",
    difficulty: "3-6y",
    title: "State Modeling and Data Flow",
    summary: "Choose between local state, lifted state, reducers, context, and server state cleanly.",
    simpleExplanation:
      "Keep state as close as possible to where it is used, but high enough for every component that needs the same truth.",
    analogy:
      "Keep a notebook on the desk that needs it. Move it to the class cupboard only if many students truly share it.",
    interviewAnswer:
      "I separate UI state, form state, server state, and derived values first. Local state is the default when ownership is obvious. I lift state only when siblings need a shared source of truth. useReducer helps when multiple transitions affect the same workflow. Context is a transport mechanism, not a reason to move every value globally.",
    codeSnippet: `type Action =\n  | { type: 'start' }\n  | { type: 'success'; payload: string[] }\n  | { type: 'error'; message: string };\n\nfunction reducer(state: { status: string; data: string[]; error: string | null }, action: Action) {\n  switch (action.type) {\n    case 'start':\n      return { status: 'loading', data: [], error: null };\n    case 'success':\n      return { status: 'ready', data: action.payload, error: null };\n    case 'error':\n      return { status: 'error', data: [], error: action.message };\n  }\n}`,
    pitfalls: [
      "Using global state for everything.",
      "Duplicating the same truth in many places.",
      "Storing values that can be derived safely.",
    ],
    tags: ["state", "useReducer", "context", "architecture"],
    oneMinuteAnswer: [
      "Local first, shared only when needed.",
      "Lift state when siblings need one truth.",
      "useReducer helps with workflow-heavy transitions.",
      "Server cache and UI state are different.",
    ],
    cheatSheet: [
      "State needs ownership.",
      "Avoid duplicate truth.",
      "Context distributes data but can widen render scope.",
      "Model around workflows, not only components.",
    ],
    sourceRefs: [
      ref("react-pdf", "React questions PDF", "context/100-React-interview-questions.pdf"),
      ref("patterns-doc", "JS and React patterns", "context/JS and React Patterns and Solid principles.docx"),
    ],
    relatedTopicIds: ["react-hooks", "system-design"],
  },
  {
    id: "react-performance",
    slug: "react-performance-toolkit",
    track: "react",
    difficulty: "3-6y",
    title: "React Performance Toolkit",
    summary: "Measure first, then reduce render surface, expensive work, and bundle cost.",
    simpleExplanation:
      "Performance means doing less work, later work, or cheaper work. Find the slow part before fixing it.",
    analogy:
      "Do not buy a faster school bus if the real problem is that every student is carrying three extra bags.",
    interviewAnswer:
      "The right process is profile first, identify whether the bottleneck is render cost, bundle size, network cost, or repeated state updates, then apply a targeted fix. Common tools are React DevTools profiler, list virtualization, route splitting, lazy loading, stable props for memoized children, and reducing context churn. I also mention when not to memoize because unnecessary memoization adds complexity.",
    codeSnippet: `const Row = React.memo(function Row({ label }: { label: string }) {\n  return <li>{label}</li>;\n});\n\nfunction SearchResults({ items }: { items: string[] }) {\n  return <ul>{items.map((item) => <Row key={item} label={item} />)}</ul>;\n}`,
    pitfalls: [
      "Adding memoization without profiling.",
      "Ignoring bundle and network cost.",
      "Assuming fewer renders always means better UX.",
    ],
    tags: ["performance", "memoization", "profiling", "bundle"],
    oneMinuteAnswer: [
      "Measure before optimizing.",
      "Reduce expensive render work and large list cost.",
      "Memoize only when it blocks real repeated work.",
      "Bundle strategy matters too.",
    ],
    cheatSheet: [
      "Profiler before fix.",
      "Window big lists.",
      "Split heavy code by route or feature.",
      "Do not over-memoize.",
    ],
    sourceRefs: [
      ref("performance-doc", "Web performance notes", "context/Web perfomance and security.docx"),
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
    ],
    relatedTopicIds: ["react-rendering", "performance-security"],
  },
  {
    id: "event-loop",
    slug: "javascript-event-loop-and-async-thinking",
    track: "javascript",
    difficulty: "3-6y",
    title: "JavaScript Event Loop and Async Thinking",
    summary: "Explain call stack, Web APIs, microtasks, macrotasks, and visible scheduling behavior.",
    simpleExplanation:
      "JavaScript does one main thing at a time on the stack. Finished async work waits in queues. Promise callbacks run before timers after the current stack clears.",
    analogy:
      "A teacher finishes the current student first, then checks urgent sticky notes before moving to the next student in line.",
    interviewAnswer:
      "The call stack runs synchronous code. Web APIs handle timers and network work outside the stack. When async work completes, callbacks are queued. After the current stack empties, the event loop processes microtasks such as resolved promise callbacks before the next macrotask like setTimeout. That ordering explains many output questions and many responsiveness issues.",
    codeSnippet: `console.log('start');\nsetTimeout(() => console.log('timer'), 0);\nPromise.resolve().then(() => console.log('microtask'));\nconsole.log('end');\n// start, end, microtask, timer`,
    pitfalls: [
      "Saying setTimeout with 0 runs immediately.",
      "Forgetting that promises use the microtask queue.",
      "Ignoring that rendering still needs a free main thread.",
    ],
    tags: ["event-loop", "promises", "microtasks", "async"],
    oneMinuteAnswer: [
      "Sync code first.",
      "Then microtasks like promise callbacks.",
      "Then the next macrotask like setTimeout.",
      "Blocked main thread blocks UX.",
    ],
    cheatSheet: [
      "Stack first.",
      "Then microtasks.",
      "Then next task.",
      "Main-thread time is user experience.",
    ],
    sourceRefs: [
      ref("mock-guide", "Frontend self mock guide", "context/Frontend Interview_ Topic-Wise Self Mock Interview Guide.docx"),
      ref("js-questions", "JS interview preparation", "context/JS Interview Preparation Questions.docx"),
    ],
    relatedTopicIds: ["dom-events", "machine-coding"],
  },
  {
    id: "dom-events",
    slug: "dom-events-and-event-delegation",
    track: "browser",
    difficulty: "1-3y",
    title: "DOM Events and Event Delegation",
    summary: "Cover bubbling, capturing, target vs currentTarget, and scalable event handling.",
    simpleExplanation:
      "When you click a child element, the event can move up to parents. Event delegation uses one parent listener to handle many children.",
    analogy:
      "Instead of giving every student a separate bell, the class monitor listens once and checks which student raised a hand.",
    interviewAnswer:
      "The DOM supports capture, target, and bubbling phases. Most handlers run during bubbling. Event delegation attaches a single listener to a stable ancestor and checks event.target or closest() to handle child interactions efficiently. It reduces listener count and works well for dynamic lists or machine-coding rounds.",
    codeSnippet: `list.addEventListener('click', (event) => {\n  const target = event.target as HTMLElement;\n  const item = target.closest('[data-item-id]');\n  if (!item) return;\n  console.log(item.getAttribute('data-item-id'));\n});`,
    pitfalls: [
      "Confusing target with currentTarget.",
      "Forgetting some events behave differently for bubbling.",
      "Ignoring keyboard support while handling clicks.",
    ],
    tags: ["dom", "event-bubbling", "delegation", "browser"],
    oneMinuteAnswer: [
      "Events flow through capture, target, and bubble.",
      "Delegation means one parent listener handles many children.",
      "Use closest() to find the intended element.",
      "Pair click behavior with keyboard behavior.",
    ],
    cheatSheet: [
      "target is origin.",
      "currentTarget is where the listener sits.",
      "Delegation reduces listener count.",
      "Check semantics and keyboard access too.",
    ],
    sourceRefs: [
      ref("js-questions", "JS interview preparation", "context/JS Interview Preparation Questions.docx"),
      ref("html-css-questions", "HTML CSS interview questions", "context/HTML CSS interview question.docx"),
    ],
    relatedTopicIds: ["accessibility-foundations", "machine-coding"],
  },
  {
    id: "html-css-layout",
    slug: "html-css-layout-and-responsive-thinking",
    track: "html-css",
    difficulty: "1-3y",
    title: "HTML and CSS Layout Fundamentals",
    summary: "Answer layout, semantics, responsive design, and specificity questions with clean interview language.",
    simpleExplanation:
      "HTML gives the page structure. CSS decides how things look and sit on the screen. Good layout means the page stays readable on different screen sizes.",
    analogy:
      "HTML is the room structure and furniture labels. CSS is how you arrange the furniture so people can walk comfortably in every room size.",
    interviewAnswer:
      "For HTML and CSS interviews I explain semantics first, then layout tools like flexbox and grid, then responsive thinking, spacing systems, and CSS maintainability. I talk about choosing the right layout primitive for the job instead of forcing one tool everywhere, and I keep accessibility connected to markup decisions.",
    codeSnippet: `.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n}\n\n.card {\n  display: flex;\n  flex-direction: column;\n  padding: 1rem;\n}`,
    pitfalls: [
      "Using divs without semantic structure.",
      "Choosing layout tools by habit instead of problem shape.",
      "Adding too many hard-coded breakpoints without a clear spacing system.",
    ],
    tags: ["html", "css", "responsive-design", "flexbox", "grid"],
    oneMinuteAnswer: [
      "Use semantic HTML first.",
      "Flexbox is strong for one-dimensional layout.",
      "Grid is strong for two-dimensional layout.",
      "Responsive design should protect readability and flow.",
    ],
    cheatSheet: [
      "Semantics before styling.",
      "Flexbox for rows or columns.",
      "Grid for page sections and card grids.",
      "Responsive UI should adapt, not break.",
    ],
    sourceRefs: [
      ref("html-css-questions", "HTML CSS interview questions", "context/HTML CSS interview question.docx"),
      ref("frontend-questions", "HTML CSS JS questions", "context/100 important HTML, CSS, and JavaScript interview questions.pdf"),
    ],
    relatedTopicIds: ["accessibility-foundations", "dom-events"],
  },
  {
    id: "accessibility-foundations",
    slug: "html-css-and-accessibility-foundations",
    track: "accessibility",
    difficulty: "3-6y",
    title: "HTML, CSS, and Accessibility Foundations",
    summary: "Explain semantics, keyboard support, focus, labels, and contrast like a product engineer.",
    simpleExplanation:
      "Accessible UI means more people can use the app with keyboard, screen reader, zoom, and different visual or motor needs.",
    analogy:
      "A good school building has stairs, but it also has a ramp, signs, and enough space for everyone to enter safely.",
    interviewAnswer:
      "Accessibility starts with semantic HTML because native elements already provide roles, keyboard behavior, and focus rules. CSS should preserve visible focus and readable contrast. For forms and widgets I talk about labels, focus order, headings, status messages, and ARIA only when semantics alone are not enough.",
    codeSnippet: `<label htmlFor="email">Email</label>\n<input id="email" name="email" type="email" autoComplete="email" />\n<button type="submit">Save</button>`,
    pitfalls: [
      "Using divs for buttons and links.",
      "Removing focus outlines without a replacement.",
      "Using ARIA to patch bad semantics instead of fixing markup.",
    ],
    tags: ["accessibility", "semantic-html", "forms", "keyboard"],
    oneMinuteAnswer: [
      "Use semantic HTML first.",
      "Keyboard and focus states are mandatory.",
      "Labels and accessible names matter.",
      "ARIA supports semantics, it does not replace them blindly.",
    ],
    cheatSheet: [
      "Prefer button, link, input, form, nav, main.",
      "Every interactive element needs keyboard access.",
      "Focus must stay visible.",
      "Contrast and hierarchy matter.",
    ],
    sourceRefs: [
      ref("html-css-questions", "HTML CSS interview questions", "context/HTML CSS interview question.docx"),
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
    ],
    relatedTopicIds: ["dom-events", "testing"],
  },
  {
    id: "performance-security",
    slug: "web-performance-and-security-basics",
    track: "performance-security",
    difficulty: "3-6y",
    title: "Web Performance and Browser Security Basics",
    summary: "Know web vitals, bundle cost, rendering cost, XSS, and safe frontend data handling.",
    simpleExplanation:
      "Performance means the site feels fast and stable. Security means the browser should not trust the wrong content.",
    analogy:
      "A good school gate should be wide enough for quick entry and strict enough to stop strangers from entering the classrooms.",
    interviewAnswer:
      "For performance I focus on core web vitals, bundle size, image strategy, caching, and main-thread work. For security I focus on escaping untrusted content, sanitizing user HTML, careful token handling, and understanding the browser trust boundary. I present both as user-trust problems, not only technical scores.",
    codeSnippet: `const safeMessage = DOMPurify.sanitize(userHtml);\nreturn <div dangerouslySetInnerHTML={{ __html: safeMessage }} />;`,
    pitfalls: [
      "Talking only about Lighthouse scores.",
      "Injecting unsanitized HTML.",
      "Speaking about security only in backend terms.",
    ],
    tags: ["web-vitals", "security", "xss", "bundle-size"],
    oneMinuteAnswer: [
      "Measure loading, responsiveness, and layout stability.",
      "Reduce JS cost and expensive rendering work.",
      "Never trust raw user HTML.",
      "Security and performance both affect user trust.",
    ],
    cheatSheet: [
      "LCP-style thinking: main content speed.",
      "Responsiveness depends on main-thread availability.",
      "Avoid layout shift.",
      "Sanitize untrusted HTML.",
    ],
    sourceRefs: [
      ref("performance-doc", "Web performance and security", "context/Web perfomance and security.docx"),
      ref("frontend-questions", "HTML CSS JS questions", "context/100 important HTML, CSS, and JavaScript interview questions.pdf"),
    ],
    relatedTopicIds: ["react-performance", "system-design"],
  },
  {
    id: "testing",
    slug: "testing-frontend-with-confidence",
    track: "frontend",
    difficulty: "3-6y",
    title: "Testing Frontend with Confidence",
    summary: "Frame testing around user behavior, confidence, and product risk rather than only syntax.",
    simpleExplanation:
      "Good tests check behavior that users care about. The closer the test is to real usage, the more confidence it gives.",
    analogy:
      "Do not only check if the school bell wire exists. Also check that students really hear the bell and move at the right time.",
    interviewAnswer:
      "My default testing strategy is behavior first. Unit tests cover pure logic and reducers. Component and integration tests verify rendering, interactions, loading, and error states. End-to-end tests protect core journeys. I avoid brittle implementation-detail assertions and include accessibility checks where possible.",
    codeSnippet: `it('shows an error state', async () => {\n  render(<ProfileCard />);\n  await userEvent.click(screen.getByRole('button', { name: /load profile/i }));\n  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();\n});`,
    pitfalls: [
      "Testing implementation details instead of behavior.",
      "Snapshotting everything.",
      "Ignoring accessibility and error states.",
    ],
    tags: ["testing", "integration", "e2e", "quality"],
    oneMinuteAnswer: [
      "Test behavior, not private implementation details.",
      "Use unit, integration, and e2e where they fit best.",
      "Cover loading, success, error, and accessibility states.",
      "Protect the critical flows that break the business.",
    ],
    cheatSheet: [
      "Pure logic: unit tests.",
      "User interaction: component tests.",
      "Critical flows: e2e tests.",
      "Prefer accessible queries.",
    ],
    sourceRefs: [
      ref("mock-guide", "Frontend self mock guide", "context/Frontend Interview_ Topic-Wise Self Mock Interview Guide.docx"),
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
    ],
    relatedTopicIds: ["accessibility-foundations", "react-hooks"],
  },
  {
    id: "dsa-patterns",
    slug: "dsa-patterns-for-frontend-interviews",
    track: "dsa",
    difficulty: "3-6y",
    title: "DSA Patterns for Frontend Interviews",
    summary: "Focus on maps, windows, pointers, stacks, traversal, and complexity discussion.",
    simpleExplanation:
      "Frontend DSA rounds usually test clean thinking, not advanced math tricks. Recognize the pattern first, then pick the right data structure.",
    analogy:
      "Do not memorize every road in the city. Learn the main road types so you can choose the right route quickly.",
    interviewAnswer:
      "For frontend roles I prioritize practical patterns: hash maps for lookups and counts, sliding window for substring and range problems, two pointers for arrays, stacks for parser-like tasks, traversal for tree-shaped data, and sorting or heaps for ranking. In the interview I explain brute force first, then the optimized version and its time-space tradeoff.",
    codeSnippet: `function longestUniqueSubstring(input: string) {\n  let left = 0;\n  let best = 0;\n  const seen = new Map<string, number>();\n\n  for (let right = 0; right < input.length; right += 1) {\n    const char = input[right];\n    if (seen.has(char) && (seen.get(char) ?? 0) >= left) {\n      left = (seen.get(char) ?? 0) + 1;\n    }\n    seen.set(char, right);\n    best = Math.max(best, right - left + 1);\n  }\n\n  return best;\n}`,
    pitfalls: [
      "Jumping to code without explaining the pattern.",
      "Skipping complexity discussion.",
      "Practicing only hard problems disconnected from frontend interviews.",
    ],
    tags: ["dsa", "sliding-window", "maps", "frontend-rounds"],
    oneMinuteAnswer: [
      "Pattern recognition beats memorized solutions.",
      "Explain brute force first, optimize second.",
      "Use maps, windows, stacks, and traversal often.",
      "Always discuss complexity clearly.",
    ],
    cheatSheet: [
      "Map for counts and quick lookup.",
      "Sliding window for contiguous ranges.",
      "Stack for nested structure or parser behavior.",
      "Traversal for trees and graph-like UI data.",
    ],
    sourceRefs: [
      ref("dsa-doc", "DSA for frontend", "context/DSA for frontend.docx"),
      ref("top-150-dsa", "Top 150 frontend DSA questions", "context/Top 150 DSA Questions for Frontend Developers - Geeky Frontend.pdf"),
    ],
    relatedTopicIds: ["machine-coding", "system-design"],
  },
  {
    id: "machine-coding",
    slug: "machine-coding-round-approach",
    track: "machine-coding",
    difficulty: "3-6y",
    title: "Machine Coding Round Approach",
    summary: "Show how to scope, structure, and narrate your work in the practical frontend round.",
    simpleExplanation:
      "Machine coding is not only writing code fast. It is showing that you can choose a clean structure, deliver the important parts first, and explain tradeoffs while building.",
    analogy:
      "If you have one hour for a school project, you build the working model first and decorate it later.",
    interviewAnswer:
      "My machine-coding flow is: clarify requirements, separate must-have from nice-to-have, sketch the component and state model, ship the happy path first, then add polish like keyboard support, edge cases, and tests if time remains. I narrate state ownership, data flow, and what I would improve with more time so the interviewer sees judgment, not just speed.",
    codeSnippet: `type Task = { id: string; title: string; done: boolean };\n\nfunction useTasks(initialTasks: Task[]) {\n  const [tasks, setTasks] = useState(initialTasks);\n  const toggleTask = (taskId: string) => {\n    setTasks((current) =>\n      current.map((task) =>\n        task.id === taskId ? { ...task, done: !task.done } : task,\n      ),\n    );\n  };\n\n  return { tasks, toggleTask };\n}`,
    pitfalls: [
      "Starting to code without clarifying scope.",
      "Building fancy styling before functionality.",
      "Putting all logic in one giant component.",
    ],
    tags: ["machine-coding", "component-design", "communication", "time-management"],
    oneMinuteAnswer: [
      "Clarify scope before code.",
      "Model data and state before UI polish.",
      "Ship the happy path early.",
      "Narrate tradeoffs and next steps clearly.",
    ],
    cheatSheet: [
      "Requirements first.",
      "Data model second.",
      "Happy path third.",
      "Polish last if time remains.",
    ],
    sourceRefs: [
      ref("machine-coding-sheet", "Frontend machine coding cheat sheet", "context/Frontend Machine Coding Cheat Sheet.pdf"),
      ref("mock-guide", "Frontend self mock guide", "context/Frontend Interview_ Topic-Wise Self Mock Interview Guide.docx"),
    ],
    relatedTopicIds: ["dom-events", "dsa-patterns"],
  },
  {
    id: "system-design",
    slug: "frontend-system-design-search-and-dashboard",
    track: "system-design",
    difficulty: "3-6y",
    title: "Frontend System Design: Search and Dashboard Thinking",
    summary: "Structure answers around data flow, rendering boundaries, caching, resilience, and UX quality.",
    simpleExplanation:
      "Frontend system design means deciding how the screen gets data, stores it, updates it, and stays understandable as the app grows.",
    analogy:
      "A school timetable works because subjects, teachers, rooms, and timings are organized. Random paper notes do not scale.",
    interviewAnswer:
      "For frontend system design I structure the answer around user flows, major screens, state ownership, async loading strategy, cache boundaries, error handling, performance risks, accessibility, and observability. For search or dashboards I also cover debouncing, request cancellation, pagination or virtualization, design tokens, and reusable component strategy.",
    codeSnippet: `type SearchState = {\n  query: string;\n  results: string[];\n  status: 'idle' | 'loading' | 'ready' | 'error';\n};\n\n// Keep request orchestration separate from presentational components.`,
    pitfalls: [
      "Turning frontend design into only backend API talk.",
      "Ignoring loading, retry, or partial failure behavior.",
      "Skipping shared component or design-token strategy.",
    ],
    tags: ["system-design", "search", "dashboard", "architecture"],
    oneMinuteAnswer: [
      "Start from users and screens.",
      "Explain state ownership and async flow.",
      "Cover performance, accessibility, and failure modes.",
      "Mention reusable components and design tokens.",
    ],
    cheatSheet: [
      "Users and screens first.",
      "State and data flow second.",
      "Performance and resilience third.",
      "Accessibility and observability last.",
    ],
    sourceRefs: [
      ref("system-design-pdf", "Frontend system design guide", "context/Geeky Frontend_ The Ultimate Guide to Frontend System Design.pdf"),
      ref("performance-doc", "Performance and security notes", "context/Web perfomance and security.docx"),
    ],
    relatedTopicIds: ["react-state", "performance-security"],
  },
  {
    id: "resume-storytelling",
    slug: "resume-storytelling-and-project-deep-dives",
    track: "resume-behavioral",
    difficulty: "3-6y",
    title: "Resume Storytelling and Project Deep Dives",
    summary: "Turn your experience into strong stories for recruiter, manager, and project deep-dive rounds.",
    simpleExplanation:
      "A good resume answer is not a full life story. It is a short, clear story with the problem, your work, the impact, and the learning.",
    analogy:
      "Do not read the whole textbook when the teacher asks one question. Give the right chapter and the strongest example.",
    interviewAnswer:
      "For resume questions I use: context, challenge, my specific contribution, the decision or tradeoff, measurable impact, and learning. I avoid vague team-only language and quickly clarify what I personally owned. The goal is to sound credible, concrete, and calm.",
    codeSnippet: `Story frame:\n1. Problem\n2. My ownership\n3. Decision or tradeoff\n4. Result\n5. Learning`,
    pitfalls: [
      "Giving generic answers without ownership or impact.",
      "Talking only about tools, not the problem or result.",
      "Hiding your exact contribution behind 'we'.",
    ],
    tags: ["resume", "behavioral", "storytelling", "ownership"],
    oneMinuteAnswer: [
      "Use context, action, impact, and learning.",
      "Be specific about your own contribution.",
      "Tie technical work to user or business outcome.",
      "Keep the first answer short, then expand.",
    ],
    cheatSheet: [
      "Problem, ownership, tradeoff, impact, learning.",
      "Use one metric when possible.",
      "Be honest about responsibility.",
      "Prepare 4 to 6 strong stories.",
    ],
    sourceRefs: [
      ref("resume-pdf", "Resume PDF", "SANDEEP_LAMTURE_-_React_ats_resume.pdf", "Manual profile onboarding is part of v1.", "manual"),
      ref("cold-email-doc", "Cold email and outreach templates", "context/Cold Email Templates and How to cold email.docx"),
    ],
    relatedTopicIds: ["machine-coding", "system-design"],
  },
  {
    id: "browser-render-pipeline",
    slug: "browser-render-pipeline-and-main-thread-thinking",
    track: "browser",
    difficulty: "3-6y",
    title: "Browser Render Pipeline and Main Thread Thinking",
    summary: "Explain parsing, style, layout, paint, compositing, and what makes the browser feel janky.",
    simpleExplanation:
      "The browser reads HTML and CSS, calculates sizes and positions, paints pixels, and finally shows the page. If we force too much work on the main thread, the page feels slow or jumpy.",
    analogy:
      "It is like setting up a classroom: first read the seating plan, then place desks, then paint the labels, and only then let students enter. If you keep moving desks while painting, everything becomes messy and slow.",
    interviewAnswer:
      "I explain browser work as parse, style calculation, layout, paint, and compositing. Performance problems often happen when JavaScript repeatedly reads layout-sensitive values and writes styles in a loop, causing extra reflow work. I connect that to main-thread availability, animation smoothness, and user-perceived responsiveness rather than only saying the pipeline names.",
    codeSnippet: `const width = card.offsetWidth;\ncard.style.width = width + 24 + 'px';\n// Repeated layout reads and writes inside a loop can create layout thrashing.`,
    pitfalls: [
      "Memorizing pipeline words without connecting them to user-visible lag.",
      "Reading layout and writing styles repeatedly in tight loops.",
      "Assuming every animation should be JavaScript-driven.",
    ],
    tags: ["browser", "render-pipeline", "layout", "paint", "main-thread"],
    oneMinuteAnswer: [
      "The browser parses markup and styles first.",
      "Layout decides sizes and positions.",
      "Paint and compositing draw the final result.",
      "Extra main-thread work directly hurts smoothness.",
    ],
    cheatSheet: [
      "Parse, style, layout, paint, composite.",
      "Avoid layout thrashing.",
      "Measure first when animations feel janky.",
      "Main-thread time is UX time.",
    ],
    sourceRefs: [
      ref("performance-doc", "Web performance and security", "context/Web perfomance and security.docx"),
      ref("frontend-questions", "HTML CSS JS questions", "context/100 important HTML, CSS, and JavaScript interview questions.pdf"),
    ],
    relatedTopicIds: ["dom-events", "performance-loading", "react-performance"],
  },
  {
    id: "browser-storage-network",
    slug: "browser-storage-caching-and-networking",
    track: "browser",
    difficulty: "3-6y",
    title: "Browser Storage, Caching, and Networking",
    summary: "Cover localStorage, sessionStorage, cookies, cache behavior, and request lifecycle tradeoffs.",
    simpleExplanation:
      "Browsers can remember data in different places. Each option has a purpose, a size limit, and a security or lifetime tradeoff.",
    analogy:
      "Think of browser storage like school storage spaces: a desk drawer for this class, a locker for your own items, and an office register for things that must travel with every form.",
    interviewAnswer:
      "I compare browser storage by scope, lifetime, and sensitivity. localStorage is easy but synchronous and inappropriate for sensitive secrets. sessionStorage is tab-scoped. Cookies are small, automatically sent with matching requests, and useful when server communication matters. I then connect this to caching headers, stale data, retry logic, and how frontend apps should avoid mixing persistence, cache, and auth concerns carelessly.",
    codeSnippet: `localStorage.setItem('theme', 'dark');\nsessionStorage.setItem('draft-tab', 'billing');\ndocument.cookie = 'locale=en; Path=/; Secure; SameSite=Lax';`,
    pitfalls: [
      "Using localStorage for sensitive auth data without understanding risk.",
      "Treating cookies and browser storage as interchangeable.",
      "Ignoring cache invalidation and stale data behavior.",
    ],
    tags: ["browser", "storage", "cookies", "caching", "network"],
    oneMinuteAnswer: [
      "Choose storage by scope, lifetime, and security need.",
      "Cookies are request-aware, localStorage is not.",
      "Cache strategy matters for freshness and speed.",
      "Persistence and auth should not be mixed blindly.",
    ],
    cheatSheet: [
      "localStorage is persistent but synchronous.",
      "sessionStorage is per-tab.",
      "Cookies travel with requests.",
      "Cache rules shape perceived speed.",
    ],
    sourceRefs: [
      ref("js-questions", "JS interview preparation", "context/JS Interview Preparation Questions.docx"),
      ref("performance-doc", "Web performance and security", "context/Web perfomance and security.docx"),
    ],
    relatedTopicIds: ["frontend-security", "system-design-realtime", "performance-loading"],
  },
  {
    id: "accessibility-widgets",
    slug: "accessible-widgets-dialogs-and-aria",
    track: "accessibility",
    difficulty: "3-6y",
    title: "Accessible Widgets, Dialogs, and ARIA",
    summary: "Go beyond basic semantics and explain modals, tabs, menus, announcements, and ARIA decisions clearly.",
    simpleExplanation:
      "Some UI pieces are more complex than buttons and forms. They still need keyboard support, focus control, and good screen-reader meaning.",
    analogy:
      "A school auditorium needs more than just a door. It also needs signs, guided seating, and clear rules so everyone can enter, move, and exit safely.",
    interviewAnswer:
      "For advanced accessibility questions I talk about focus management, keyboard interaction, visible state, and accessible names before I mention ARIA attributes. Native semantics come first. ARIA helps when building custom widgets like dialogs, tabs, or menus, but it should mirror the expected interaction pattern, not patch over broken markup. I also mention announcements for async updates and returning focus after modal close.",
    codeSnippet: `<button aria-expanded={open} aria-controls="help-panel">Help</button>\n<section id="help-panel" hidden={!open}>\n  <h2>Keyboard tips</h2>\n</section>`,
    pitfalls: [
      "Using ARIA roles without matching keyboard behavior.",
      "Opening dialogs without trapping or restoring focus.",
      "Hiding important state changes from assistive technology.",
    ],
    tags: ["accessibility", "aria", "dialog", "focus-management", "widgets"],
    oneMinuteAnswer: [
      "Custom widgets need correct focus rules.",
      "ARIA should support, not replace, semantics.",
      "Keyboard behavior must match the pattern.",
      "Async updates should be announced clearly.",
    ],
    cheatSheet: [
      "Focus in, focus out, focus return.",
      "Match ARIA to interaction.",
      "Keep state names clear.",
      "Test with keyboard first.",
    ],
    sourceRefs: [
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
      ref("html-css-questions", "HTML CSS interview questions", "context/HTML CSS interview question.docx"),
    ],
    relatedTopicIds: ["accessibility-foundations", "testing", "dom-events"],
  },
  {
    id: "performance-loading",
    slug: "loading-strategy-caching-and-core-web-vitals",
    track: "performance-security",
    difficulty: "3-6y",
    title: "Loading Strategy, Caching, and Core Web Vitals",
    summary: "Answer LCP, CLS, INP, image strategy, caching, and bundle questions with product-level clarity.",
    simpleExplanation:
      "Fast apps load important content quickly, stay stable while loading, and respond without delay when the user interacts.",
    analogy:
      "A good shop opens the front door first, keeps the shelves from moving around, and serves the first customer quickly instead of making everyone wait for every room to be cleaned.",
    interviewAnswer:
      "I frame performance around what the user feels: how quickly the main content appears, whether the layout jumps, and how fast interactions respond. Then I connect that to concrete fixes like route splitting, image optimization, caching policy, preloading critical assets, reducing third-party script cost, and keeping the main thread free for interaction. I also distinguish static asset caching from API freshness strategies.",
    codeSnippet: `const image = <img src={heroUrl} width={960} height={540} loading="eager" alt="Dashboard preview" />;\n// Use stable dimensions and prioritize only truly critical media.`,
    pitfalls: [
      "Reciting metric names without explaining user impact.",
      "Preloading too many assets and hurting network priority.",
      "Treating asset caching and API caching as the same problem.",
    ],
    tags: ["performance", "core-web-vitals", "caching", "loading", "bundle"],
    oneMinuteAnswer: [
      "LCP is about major content arriving quickly.",
      "CLS is about layout staying stable.",
      "INP is about responsive interactions.",
      "Caching and priority decisions shape all three.",
    ],
    cheatSheet: [
      "Prioritize critical content.",
      "Keep dimensions stable.",
      "Ship less JavaScript upfront.",
      "Cache with freshness in mind.",
    ],
    sourceRefs: [
      ref("performance-doc", "Web performance and security", "context/Web perfomance and security.docx"),
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
    ],
    relatedTopicIds: ["performance-security", "browser-render-pipeline", "system-design-realtime"],
  },
  {
    id: "frontend-security",
    slug: "frontend-security-auth-and-trust-boundaries",
    track: "performance-security",
    difficulty: "3-6y",
    title: "Frontend Security, Auth, and Trust Boundaries",
    summary: "Explain XSS, CSRF, token storage, CSP, sanitization, and what frontend can and cannot guarantee.",
    simpleExplanation:
      "Frontend code runs in the user's browser, so it should never trust unsafe input and should never pretend it can hide secrets perfectly.",
    analogy:
      "A classroom monitor can check who enters, but the master key should still stay in the office, not under the desk.",
    interviewAnswer:
      "I explain security by trust boundaries. The browser UI can reduce risk, but the client is not a trusted secret store. I discuss escaping dynamic content, sanitizing allowed HTML, understanding token tradeoffs, CSRF implications with cookies, CSP as defense in depth, and avoiding dangerous assumptions like hiding sensitive logic only in the frontend. I also separate authentication, authorization, and UI convenience concerns.",
    codeSnippet: `function SafePreview({ html }: { html: string }) {\n  const safeHtml = DOMPurify.sanitize(html);\n  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;\n}`,
    pitfalls: [
      "Storing secrets in the client and calling it secure.",
      "Using dangerouslySetInnerHTML without sanitization.",
      "Talking about auth and authorization as the same thing.",
    ],
    tags: ["security", "xss", "csrf", "tokens", "csp"],
    oneMinuteAnswer: [
      "Frontend should reduce risk, not invent trust.",
      "Escape or sanitize untrusted content.",
      "Token storage has tradeoffs, not magic answers.",
      "Client checks help UX but server checks protect data.",
    ],
    cheatSheet: [
      "Never trust raw HTML.",
      "Know cookie versus token tradeoffs.",
      "Use CSP as extra protection.",
      "Server remains the source of truth.",
    ],
    sourceRefs: [
      ref("performance-doc", "Web performance and security", "context/Web perfomance and security.docx"),
      ref("frontend-questions", "HTML CSS JS questions", "context/100 important HTML, CSS, and JavaScript interview questions.pdf"),
    ],
    relatedTopicIds: ["performance-security", "browser-storage-network", "system-design"],
  },
  {
    id: "frontend-design-systems",
    slug: "component-libraries-and-design-system-workflow",
    track: "frontend",
    difficulty: "3-6y",
    title: "Component Libraries and Design System Workflow",
    summary: "Prepare for questions about reusable UI, tokens, API consistency, accessibility, and adoption across teams.",
    simpleExplanation:
      "A design system is a shared toolbox of styles and components so many teams can build faster without making every screen look different.",
    analogy:
      "Instead of each class bringing random chairs, the school uses one standard furniture system so every room stays familiar and easier to maintain.",
    interviewAnswer:
      "I describe a design system as shared primitives, tokens, accessibility rules, documentation, and team workflow, not only a component folder. I cover component API consistency, slot or composition patterns, versioning, migration strategy, designer-developer collaboration, and how to keep the library flexible without letting every product team fork the rules. I also mention measuring adoption and support cost.",
    codeSnippet: `export const tokens = {\n  color: { surface: '#fff6ec', accent: '#ff6a3d' },\n  space: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },\n};`,
    pitfalls: [
      "Treating a design system like only a UI kit.",
      "Making component APIs inconsistent across similar controls.",
      "Ignoring documentation, migration, and ownership.",
    ],
    tags: ["frontend", "design-system", "components", "tokens", "platform"],
    oneMinuteAnswer: [
      "Design systems are product workflow tools, not only code.",
      "Tokens create consistency in spacing, color, and type.",
      "Reusable components still need accessible APIs.",
      "Ownership and adoption matter as much as implementation.",
    ],
    cheatSheet: [
      "Tokens first, components second.",
      "Document usage and edge cases.",
      "Consistency beats one-off cleverness.",
      "Measure adoption and maintenance cost.",
    ],
    sourceRefs: [
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
      ref("html-css-questions", "HTML CSS interview questions", "context/HTML CSS interview question.docx"),
    ],
    relatedTopicIds: ["testing", "accessibility-widgets", "system-design-platform"],
  },
  {
    id: "dsa-recursion",
    slug: "trees-recursion-and-ui-data-transforms",
    track: "dsa",
    difficulty: "3-6y",
    title: "Trees, Recursion, and UI Data Transforms",
    summary: "Handle nested menus, comments, file explorers, flattening, and traversal questions like a frontend engineer.",
    simpleExplanation:
      "Frontend data is often nested, like comments inside comments or folders inside folders. Recursion and traversal help you move through that shape cleanly.",
    analogy:
      "It is like exploring rooms inside rooms in a building. You need a clear rule for when to go deeper and when to come back.",
    interviewAnswer:
      "I explain recursion as a clean way to solve repeated nested structure, but I also mention iterative versions when stack depth or clarity matters. In frontend interviews I connect it to trees like menus, nested comments, routing, file explorers, and transform pipelines. I talk through traversal order, base conditions, and how to keep the solution readable for UI-driven data rather than only algorithmic theory.",
    codeSnippet: `function flattenLabels(nodes: { label: string; children?: { label: string; children?: any[] }[] }[]) {\n  return nodes.flatMap((node) => [node.label, ...(node.children ? flattenLabels(node.children) : [])]);\n}`,
    pitfalls: [
      "Forgetting the base condition in recursion.",
      "Using recursion without explaining the shape of the data first.",
      "Optimizing too early before the traversal logic is clear.",
    ],
    tags: ["dsa", "recursion", "trees", "traversal", "ui-data"],
    oneMinuteAnswer: [
      "Nested UI data often behaves like a tree.",
      "Recursion is a readable fit when the data shape repeats.",
      "Traversal order depends on the output you need.",
      "Explain the base case before the recursive step.",
    ],
    cheatSheet: [
      "Name the tree shape first.",
      "Define the base case.",
      "Describe what each call returns.",
      "Consider iterative fallback if depth is risky.",
    ],
    sourceRefs: [
      ref("dsa-doc", "DSA for frontend", "context/DSA for frontend.docx"),
      ref("top-150-dsa", "Top 150 frontend DSA questions", "context/Top 150 DSA Questions for Frontend Developers - Geeky Frontend.pdf"),
    ],
    relatedTopicIds: ["dsa-patterns", "machine-coding-architecture", "system-design-realtime"],
  },
  {
    id: "machine-coding-architecture",
    slug: "machine-coding-component-boundaries-and-state",
    track: "machine-coding",
    difficulty: "3-6y",
    title: "Machine Coding: Component Boundaries and State",
    summary: "Prepare for the part of the round where structure, state shape, and communication matter more than typing speed.",
    simpleExplanation:
      "A machine coding round becomes easier when you split the app into simple parts and keep one clear owner for each important piece of data.",
    analogy:
      "If one student handles the chart, another handles the model, and another handles the labels, the project gets built faster than if one person holds every tool at once.",
    interviewAnswer:
      "Beyond requirement scoping, the next high-signal skill is choosing component boundaries and state ownership. I explain what should stay local, what needs a shared parent, how to keep updates predictable, and how to leave space for keyboard handling and testing. Interviewers usually reward clear structure and calm narration more than fancy patterns used too early.",
    codeSnippet: `function TaskBoard() {\n  const [tasks, setTasks] = useState<Task[]>([]);\n  return <BoardLayout tasks={tasks} onToggle={(id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task))} />;\n}`,
    pitfalls: [
      "Creating one giant component with UI and logic mixed together.",
      "Duplicating state in parent and child during rush time.",
      "Skipping explanation of why a boundary was chosen.",
    ],
    tags: ["machine-coding", "state", "components", "architecture", "time-boxing"],
    oneMinuteAnswer: [
      "Choose state owners before polishing UI.",
      "Split components by responsibility, not by random file count.",
      "Keep updates predictable and easy to explain.",
      "Leave room for keyboard and error states.",
    ],
    cheatSheet: [
      "One source of truth per concern.",
      "Prefer simple component contracts.",
      "Narrate tradeoffs while coding.",
      "Happy path first, structure close behind.",
    ],
    sourceRefs: [
      ref("machine-coding-sheet", "Frontend machine coding cheat sheet", "context/Frontend Machine Coding Cheat Sheet.pdf"),
      ref("mock-guide", "Frontend self mock guide", "context/Frontend Interview_ Topic-Wise Self Mock Interview Guide.docx"),
    ],
    relatedTopicIds: ["machine-coding", "dsa-recursion", "frontend-design-systems"],
  },
  {
    id: "system-design-platform",
    slug: "design-systems-and-frontend-platform-thinking",
    track: "system-design",
    difficulty: "3-6y",
    title: "Design Systems and Frontend Platform Thinking",
    summary: "Answer frontend system design questions about shared components, versioning, tokens, governance, and adoption.",
    simpleExplanation:
      "Frontend platform work means making life easier for many teams, not just one feature. Shared rules and tools help teams move faster with less confusion.",
    analogy:
      "It is like building a school library and timetable system so every class can work better, instead of helping only one classroom for one day.",
    interviewAnswer:
      "When asked about design systems or frontend platforms, I discuss primitives, tokens, accessibility guarantees, documentation, versioning, release strategy, and migration support. I also cover governance: who owns the system, how teams request new components, how breaking changes are handled, and how adoption is measured. This shows I understand that platform success depends on developer experience and product consistency, not only code reuse.",
    codeSnippet: `type ButtonProps = {\n  variant: 'primary' | 'secondary';\n  size?: 'sm' | 'md' | 'lg';\n  children: React.ReactNode;\n};`,
    pitfalls: [
      "Talking about a design system like only a Figma file or npm package.",
      "Ignoring versioning and migration planning.",
      "Skipping accessibility guarantees in shared primitives.",
    ],
    tags: ["system-design", "design-system", "platform", "governance", "tokens"],
    oneMinuteAnswer: [
      "Platform work is about many teams, not one screen.",
      "Shared primitives need strong APIs and documentation.",
      "Versioning and migration strategy are design decisions too.",
      "Accessibility should be built into the base layer.",
    ],
    cheatSheet: [
      "Tokens, primitives, patterns, docs.",
      "Ownership matters.",
      "Migration cost matters.",
      "Adoption is a success metric.",
    ],
    sourceRefs: [
      ref("system-design-pdf", "Frontend system design guide", "context/Geeky Frontend_ The Ultimate Guide to Frontend System Design.pdf"),
      ref("resources-goldmine", "Frontend resources gold mine", "context/Resources to learn Frontend (Gold Mine)- eBook .docx"),
    ],
    relatedTopicIds: ["system-design", "frontend-design-systems", "accessibility-widgets"],
  },
  {
    id: "system-design-realtime",
    slug: "realtime-dashboard-and-resilient-data-flow",
    track: "system-design",
    difficulty: "3-6y",
    title: "Realtime Dashboards and Resilient Data Flow",
    summary: "Prepare for questions about polling, websockets, partial failure, stale data, and resilient UI updates.",
    simpleExplanation:
      "Realtime screens are hard because the data keeps changing. The UI must stay useful even when some updates are slow, missing, or out of order.",
    analogy:
      "A school scoreboard must keep showing the latest result, but it should not go blank just because one volunteer is late with a score update.",
    interviewAnswer:
      "For realtime frontend design I cover the update model first: polling, websockets, SSE, or hybrid fallback. Then I explain cache boundaries, optimistic or stale UI states, reconnection strategy, event ordering, partial failure handling, and how the screen communicates freshness to the user. I also mention performance techniques like batching updates, virtualization, and keeping expensive charts from rerendering unnecessarily.",
    codeSnippet: `type WidgetState = {\n  status: 'fresh' | 'stale' | 'reconnecting';\n  updatedAt: number;\n  data: number[];\n};`,
    pitfalls: [
      "Assuming realtime always means websockets.",
      "Ignoring stale or partially failed widget states.",
      "Updating every widget eagerly without render boundaries.",
    ],
    tags: ["system-design", "realtime", "dashboard", "polling", "resilience"],
    oneMinuteAnswer: [
      "Choose the update model based on product need.",
      "Show freshness and failure states clearly.",
      "Keep cache and rerender boundaries explicit.",
      "Protect the UI when some data is stale.",
    ],
    cheatSheet: [
      "Polling is acceptable when simple.",
      "Realtime still needs fallback states.",
      "Batch updates when possible.",
      "Users need freshness signals.",
    ],
    sourceRefs: [
      ref("system-design-pdf", "Frontend system design guide", "context/Geeky Frontend_ The Ultimate Guide to Frontend System Design.pdf"),
      ref("performance-doc", "Performance and security notes", "context/Web perfomance and security.docx"),
    ],
    relatedTopicIds: ["system-design", "performance-loading", "browser-storage-network"],
  },
  {
    id: "behavioral-ownership",
    slug: "ownership-conflict-and-growth-stories",
    track: "resume-behavioral",
    difficulty: "3-6y",
    title: "Ownership, Conflict, and Growth Stories",
    summary: "Prepare for the behavioral questions that decide trust: disagreement, leadership, mistakes, and growth.",
    simpleExplanation:
      "Behavioral interviews check whether people can trust how you work with others, not only whether you can write code.",
    analogy:
      "It is like a class project review. The teacher wants to know not only if the poster looks good, but also whether you helped the team, solved problems, and learned from mistakes.",
    interviewAnswer:
      "For behavioral rounds I keep answers structured around context, tension, action, result, and learning. I make my ownership clear without pretending to have done everything alone. I talk openly about tradeoffs, disagreements, and mistakes because mature interviews reward reflection, honesty, and clear communication more than perfect stories.",
    codeSnippet: `Story frame:\n1. Context\n2. Tension or conflict\n3. My action\n4. Result\n5. Learning`,
    pitfalls: [
      "Telling only polished success stories with no tension.",
      "Speaking in vague team-only language without ownership.",
      "Giving long stories before answering the actual question.",
    ],
    tags: ["behavioral", "ownership", "conflict", "growth", "leadership"],
    oneMinuteAnswer: [
      "Keep the story short, specific, and honest.",
      "Name the conflict or tension clearly.",
      "Explain your action and judgment.",
      "Close with result and learning.",
    ],
    cheatSheet: [
      "Context, tension, action, result, learning.",
      "Use first person for ownership.",
      "Do not hide the difficult part of the story.",
      "Learning shows maturity.",
    ],
    sourceRefs: [
      ref("resume-pdf", "Resume PDF", "SANDEEP_LAMTURE_-_React_ats_resume.pdf", "Manual profile onboarding is part of v1.", "manual"),
      ref("cold-email-doc", "Cold email and outreach templates", "context/Cold Email Templates and How to cold email.docx"),
    ],
    relatedTopicIds: ["resume-storytelling", "system-design-platform", "machine-coding-architecture"],
  },
];
