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
  {
    id: "q-browser-pipeline-1",
    topicId: "browser-render-pipeline",
    track: "browser",
    prompt: "What happens in the browser from receiving HTML to showing pixels on the screen?",
    answerShort:
      "The browser parses HTML and CSS, builds structures for them, calculates layout, paints pixels, and composites layers to show the final screen.",
    answerDeep:
      "A strong answer covers parsing, style calculation, layout, paint, and compositing. I also connect those stages to real frontend behavior: layout-sensitive reads can trigger extra work, frequent style changes can create jank, and heavy main-thread JavaScript delays rendering and interaction. Interviewers care more about whether you can connect the pipeline to actual performance decisions than whether you only recite the stage names.",
    followUps: ["What is layout thrashing?", "Which CSS properties are cheaper to animate?"],
    roundType: "theory",
    tags: ["browser", "rendering", "layout", "paint"],
  },
  {
    id: "q-browser-pipeline-2",
    topicId: "browser-render-pipeline",
    track: "browser",
    prompt: "What is layout thrashing and how do you avoid it in frontend code?",
    answerShort:
      "Layout thrashing happens when code repeatedly reads layout values and writes styles in a pattern that forces extra recalculation work.",
    answerDeep:
      "This usually happens when JavaScript mixes layout reads like offsetWidth with style writes inside loops or repeated update cycles. The browser has to stop and recalculate layout more often than necessary. I avoid it by batching reads before writes, reducing DOM churn, using transform or opacity for animation when possible, and keeping expensive updates away from tight interaction loops.",
    followUps: ["Why are transform and opacity preferred for many animations?", "How would you detect this in DevTools?"],
    roundType: "coding",
    tags: ["browser", "performance", "layout-thrashing"],
  },
  {
    id: "q-browser-storage-1",
    topicId: "browser-storage-network",
    track: "browser",
    prompt: "What is the difference between localStorage, sessionStorage, and cookies?",
    answerShort:
      "localStorage is persistent and browser-side, sessionStorage is tab-scoped, and cookies are small values sent with matching HTTP requests.",
    answerDeep:
      "I compare them by lifetime, scope, and request behavior. localStorage survives reloads and browser restarts but is synchronous and unsuitable for secrets. sessionStorage is scoped to one tab session. Cookies are smaller, can be sent automatically with requests, and matter when server communication or auth behavior is involved. A good answer also mentions that these tools solve different problems and should not be chosen only because they are familiar.",
    followUps: ["Why is localStorage risky for sensitive data?", "When would cookies be preferable?"],
    roundType: "screening",
    tags: ["browser", "storage", "cookies"],
  },
  {
    id: "q-browser-storage-2",
    topicId: "browser-storage-network",
    track: "browser",
    prompt: "How do browser caching and stale data affect frontend design?",
    answerShort:
      "Caching can make apps feel fast, but the UI must still handle old data, refresh timing, and clear signals about what is fresh or stale.",
    answerDeep:
      "I separate static asset caching from API data freshness. Long-lived caching is great for hashed assets because the content changes with the filename. API data is different because the same endpoint can return updated information. Frontend design has to decide whether to revalidate in the background, show stale content while refreshing, or block until fresh data arrives. Interviewers want to hear that speed and correctness are both product decisions.",
    followUps: ["What is stale-while-revalidate in simple words?", "How would you show stale state in the UI?"],
    roundType: "design",
    tags: ["browser", "caching", "network", "data-fetching"],
  },
  {
    id: "q-a11y-widgets-1",
    topicId: "accessibility-widgets",
    track: "accessibility",
    prompt: "How do you build an accessible modal dialog?",
    answerShort:
      "Use the right dialog semantics, move focus into the dialog, keep keyboard users inside it while open, and return focus when it closes.",
    answerDeep:
      "A good dialog answer includes an accessible name, visible close action, focus movement into the dialog, keyboard escape behavior when appropriate, and focus return to the trigger after close. It should also prevent the background from acting like the main interaction target while the dialog is open. I mention semantic HTML first and then ARIA support when the chosen implementation needs it.",
    followUps: ["How do you trap focus?", "What should happen when the dialog closes?"],
    roundType: "coding",
    tags: ["accessibility", "dialog", "focus"],
  },
  {
    id: "q-a11y-widgets-2",
    topicId: "accessibility-widgets",
    track: "accessibility",
    prompt: "When should you use ARIA and when should you avoid it?",
    answerShort:
      "Use ARIA when native HTML is not enough for a complex widget. Avoid it when native elements already provide the correct semantics and behavior.",
    answerDeep:
      "The best answer is 'native first'. A button already behaves like a button, so adding role='button' to a div is usually a downgrade, not an upgrade. ARIA becomes useful when building patterns like tabs, dialogs, comboboxes, or live regions, but it must match the expected keyboard and announcement behavior. ARIA should describe a real interaction model, not patch over weak markup decisions.",
    followUps: ["Why is a div button usually worse than a real button?", "What does aria-live solve?"],
    roundType: "theory",
    tags: ["accessibility", "aria", "semantics"],
  },
  {
    id: "q-perf-loading-1",
    topicId: "performance-loading",
    track: "performance-security",
    prompt: "How would you improve LCP on a slow React or frontend page?",
    answerShort:
      "Focus on the main content first: reduce heavy JavaScript, optimize the hero asset, improve server response, and prioritize only critical resources.",
    answerDeep:
      "I explain LCP as the time for the main visible content to appear. Then I mention concrete levers: smaller bundles, route splitting, reducing render-blocking assets, compressing and sizing the hero image, preloading only key resources, and improving server or CDN response. I also mention that third-party scripts and unnecessary client-side work often hurt LCP more than teams expect.",
    followUps: ["How can image dimensions help performance?", "Why can too much preloading backfire?"],
    roundType: "design",
    tags: ["performance", "lcp", "loading"],
  },
  {
    id: "q-perf-loading-2",
    topicId: "performance-loading",
    track: "performance-security",
    prompt: "How do you think about caching strategy for frontend assets and API data?",
    answerShort:
      "Static assets can usually be cached very aggressively when filenames are versioned, but API data needs freshness rules and user-visible fallback behavior.",
    answerDeep:
      "I explain that asset caching and data caching are different. Build assets with content hashes can be cached for a long time because new content produces a new URL. API data needs freshness decisions like polling, revalidation, optimistic updates, or stale-while-refresh patterns. A good answer also mentions how the UI communicates loading, staleness, and retry behavior instead of hiding those states.",
    followUps: ["When would you revalidate in the background?", "How do you prevent users from trusting stale numbers?"],
    roundType: "design",
    tags: ["performance", "caching", "api", "ux"],
  },
  {
    id: "q-security-2",
    topicId: "frontend-security",
    track: "performance-security",
    prompt: "How do you think about token storage in frontend applications?",
    answerShort:
      "There is no perfect client-side answer. You choose based on threat model, UX, and server design, while keeping sensitive logic on the server.",
    answerDeep:
      "A mature answer avoids pretending one storage option is universally safe. localStorage is convenient but exposed to XSS if the app is compromised. Cookies can reduce some manual handling but bring CSRF considerations and server coupling. I explain the tradeoffs, mention defense in depth like CSP and sanitization, and stress that frontend storage decisions cannot replace server-side authorization and session design.",
    followUps: ["Why is 'never use localStorage' too simplistic?", "How do cookies change the CSRF discussion?"],
    roundType: "design",
    tags: ["security", "auth", "tokens"],
  },
  {
    id: "q-security-3",
    topicId: "frontend-security",
    track: "performance-security",
    prompt: "What are the main frontend security risks you mention in interviews?",
    answerShort:
      "XSS, unsafe HTML rendering, weak token handling assumptions, exposed client logic, and insecure third-party integrations are high-frequency frontend risks.",
    answerDeep:
      "I begin with XSS because it directly affects how browsers execute untrusted content. Then I mention unsafe HTML injection, token and session handling tradeoffs, trusting the client too much, insecure third-party scripts, and the role of CSP and validation. I also clarify that frontend can reduce risk but cannot become the final authority for access control or sensitive business rules.",
    followUps: ["When is dangerouslySetInnerHTML acceptable?", "What does CSP help with?"],
    roundType: "screening",
    tags: ["security", "xss", "csp", "frontend"],
  },
  {
    id: "q-frontend-design-1",
    topicId: "frontend-design-systems",
    track: "frontend",
    prompt: "How do you structure a reusable component library or design system?",
    answerShort:
      "Start with tokens and primitives, then build higher-level components with consistent APIs, documentation, accessibility rules, and versioning.",
    answerDeep:
      "I describe the system in layers: design tokens for shared visual language, primitives for layout and interactive foundations, and composed components for common product patterns. I also mention API consistency, accessibility guarantees, documentation, release management, and how teams adopt or request changes. That shows the library is part codebase, part workflow, and part platform.",
    followUps: ["What belongs in a primitive versus a product component?", "How do you avoid over-engineering shared components?"],
    roundType: "design",
    tags: ["frontend", "design-system", "components"],
  },
  {
    id: "q-frontend-design-2",
    topicId: "frontend-design-systems",
    track: "frontend",
    prompt: "How do you keep a design system flexible without becoming inconsistent?",
    answerShort:
      "Allow composition and clear extension points, but keep tokens, accessibility rules, and core APIs strict enough to protect consistency.",
    answerDeep:
      "A good design system is not rigid everywhere and not free-form everywhere. I keep the base decisions strong, like tokens, spacing, accessible defaults, and component contracts, while giving teams composition hooks or well-documented variants for real product needs. Governance, usage examples, and review guidance matter because inconsistency usually appears through workflow gaps, not only code gaps.",
    followUps: ["How do you decide when to add a new variant?", "Who should approve shared-component changes?"],
    roundType: "design",
    tags: ["frontend", "design-system", "governance"],
  },
  {
    id: "q-dsa-recursion-1",
    topicId: "dsa-recursion",
    track: "dsa",
    prompt: "Where do recursion and tree traversal show up in frontend interviews?",
    answerShort:
      "They appear in nested comments, file explorers, menus, route trees, and any UI that has repeating child structures.",
    answerDeep:
      "I connect recursion to real UI data, not only textbook trees. Menus, nested comments, permission trees, and file explorers are all natural frontend examples. I explain the base case, how each recursive call handles one node, and when I would switch to an iterative approach if the data is extremely deep or if the interviewer prefers explicit stack-based logic.",
    followUps: ["What is the base case in a nested comment tree?", "When would you avoid recursion?"],
    roundType: "coding",
    tags: ["dsa", "recursion", "trees"],
  },
  {
    id: "q-dsa-recursion-2",
    topicId: "dsa-recursion",
    track: "dsa",
    prompt: "How would you flatten nested menu or comment data for easier rendering?",
    answerShort:
      "Walk the tree, collect the fields you need, and return a flat list while preserving enough metadata like depth or parent id for the UI.",
    answerDeep:
      "I first ask what the rendered UI needs. If the screen needs indentation or expand and collapse behavior, I often keep depth or ancestry metadata while flattening. Then I describe a traversal strategy, usually DFS, that visits each node once, pushes a transformed item into the result list, and continues through children. I finish by giving the time complexity and how I would test edge cases like empty children arrays.",
    followUps: ["Would you choose DFS or BFS here and why?", "What metadata helps the UI after flattening?"],
    roundType: "coding",
    tags: ["dsa", "flattening", "ui-data"],
  },
  {
    id: "q-machine-arch-1",
    topicId: "machine-coding-architecture",
    track: "machine-coding",
    prompt: "How do you decide component boundaries and state ownership during a machine-coding round?",
    answerShort:
      "Keep one clear owner for each changing concern, split components by responsibility, and avoid duplicating state just to make the code look distributed.",
    answerDeep:
      "I start with the data model and the main user actions. Then I decide which component needs to own each state value so updates stay predictable. I keep presentational pieces separate when it improves readability, but I avoid creating many layers too early. In interviews, a clear explanation of ownership and data flow usually matters more than building the fanciest component tree.",
    followUps: ["When would you use useReducer here?", "What state should stay local?"],
    roundType: "machine-coding",
    tags: ["machine-coding", "state", "components"],
  },
  {
    id: "q-machine-arch-2",
    topicId: "machine-coding-architecture",
    track: "machine-coding",
    prompt: "After the happy path works in a machine-coding round, what do you prioritize next?",
    answerShort:
      "I improve correctness and usability first: validation, error states, keyboard or accessibility support, and only then visual polish.",
    answerDeep:
      "The best next steps depend on the round, but I usually add the things that reduce risk: edge cases, empty and error states, keyboard interaction, and code organization that makes future changes safer. If time remains, I improve styling and small UX polish. I also tell the interviewer what I would do next so they can see prioritization even when time ends.",
    followUps: ["What do you intentionally leave for later?", "How do you communicate unfinished work well?"],
    roundType: "machine-coding",
    tags: ["machine-coding", "prioritization", "accessibility"],
  },
  {
    id: "q-system-platform-1",
    topicId: "system-design-platform",
    track: "system-design",
    prompt: "How would you design a frontend design system or platform for multiple product teams?",
    answerShort:
      "Define shared tokens and primitives first, then build documented components, versioning rules, and a clear ownership model for adoption across teams.",
    answerDeep:
      "I begin with the user of the platform: product engineers and designers. Then I describe tokens, foundational components, documentation, testing, accessibility standards, release/versioning strategy, and support workflow. I also mention migration, analytics on usage, and how teams request new patterns. The key idea is that platform success depends on trust, documentation, and change management, not just shipping npm packages.",
    followUps: ["How do you prevent breaking teams with changes?", "How do you measure adoption?"],
    roundType: "design",
    tags: ["system-design", "platform", "design-system"],
  },
  {
    id: "q-system-platform-2",
    topicId: "system-design-platform",
    track: "system-design",
    prompt: "How do you handle versioning, migration, and ownership in a shared component library?",
    answerShort:
      "Use clear ownership, semantic versioning, migration guides, and a path that lets product teams adopt changes gradually instead of forcing surprise upgrades.",
    answerDeep:
      "I treat versioning and migration as product design for internal users. A platform team should communicate breaking changes early, provide examples or codemods when useful, and keep ownership visible so teams know where to ask for help. I also prefer telemetry or adoption dashboards when possible, because a component library that nobody upgrades becomes a long-term maintenance risk.",
    followUps: ["When would you use a codemod?", "How do you handle teams that lag far behind?"],
    roundType: "design",
    tags: ["system-design", "versioning", "migration"],
  },
  {
    id: "q-system-realtime-1",
    topicId: "system-design-realtime",
    track: "system-design",
    prompt: "How would you design the frontend of a realtime dashboard?",
    answerShort:
      "Start with the user decisions the dashboard supports, then define the update model, cache boundaries, freshness indicators, and render boundaries for each widget.",
    answerDeep:
      "I structure the answer by screen sections and data criticality. Some widgets may need near-realtime updates, while others can be refreshed less often. I explain polling versus websockets, request cancellation or reconnection, stale states, error recovery, batching updates, and how to prevent every incoming message from triggering expensive rerenders across the whole page. I also include accessibility and observability because dashboards often fail under operational stress.",
    followUps: ["When is polling enough?", "How do you keep charts from rerendering too much?"],
    roundType: "design",
    tags: ["system-design", "realtime", "dashboard"],
  },
  {
    id: "q-system-realtime-2",
    topicId: "system-design-realtime",
    track: "system-design",
    prompt: "How do you handle partial failure and stale data in a data-heavy frontend?",
    answerShort:
      "Do not let one broken widget collapse the whole screen. Show freshness, isolate failures, and let healthy parts keep working.",
    answerDeep:
      "I prefer resilient screens where each area can show its own loading, stale, retry, or degraded state. I explain which data must block rendering and which data can remain visible while being refreshed. I also discuss user trust: timestamps, stale badges, and retry affordances matter because users need to know whether they are looking at current information or a fallback snapshot.",
    followUps: ["How do you show stale-but-usable data?", "When would you retry automatically versus manually?"],
    roundType: "design",
    tags: ["system-design", "resilience", "stale-data"],
  },
  {
    id: "q-behavioral-2",
    topicId: "behavioral-ownership",
    track: "resume-behavioral",
    prompt: "How do you answer a conflict or disagreement question without sounding defensive?",
    answerShort:
      "Explain the situation calmly, name the tradeoff, show how you listened, and focus on the resolution and learning instead of trying to look perfect.",
    answerDeep:
      "A strong conflict answer does not blame the other person. I describe the context, what the disagreement was really about, how I clarified goals, what options were considered, and how the team reached a decision. I end with the outcome and what I learned about communication or tradeoffs. Interviewers usually care more about maturity and honesty than about whether you 'won' the discussion.",
    followUps: ["What if the decision you wanted was not chosen?", "How do you keep the story from sounding negative?"],
    roundType: "behavioral",
    tags: ["behavioral", "conflict", "communication"],
  },
  {
    id: "q-behavioral-3",
    topicId: "behavioral-ownership",
    track: "resume-behavioral",
    prompt: "How do you answer questions about ownership, mentoring, or growth as a mid-level frontend engineer?",
    answerShort:
      "Use concrete examples that show you improved quality, unblocked others, or made decisions responsibly, even if you were not the formal team lead.",
    answerDeep:
      "I avoid inflating my role, but I also avoid underselling real ownership. I describe moments where I improved standards, guided implementation choices, reviewed code carefully, helped teammates, or took responsibility for a problem until it was solved. For growth questions, I connect my learning to better future decisions so the answer feels real and forward-looking.",
    followUps: ["How do you show leadership without a manager title?", "What growth area would you mention honestly right now?"],
    roundType: "behavioral",
    tags: ["behavioral", "ownership", "growth"],
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
  {
    id: "cp-file-explorer",
    track: "machine-coding",
    difficulty: "3-6y",
    title: "Build a file explorer",
    scenario: "Implement a nested file explorer with expand and collapse behavior, clear state ownership, and scalable rendering.",
    requirements: [
      "Render nested folders and files from tree data.",
      "Allow expand and collapse for folders.",
      "Keep state predictable as the tree grows.",
      "Explain what you would add for keyboard support and search if time remains.",
    ],
    hints: [
      "Model expanded folder ids instead of mutating the input tree.",
      "Recursion is often the cleanest rendering approach.",
      "Keep the node row and tree container separate if it improves clarity.",
    ],
    solutionOutline: [
      "Define the tree shape and the expanded-id state.",
      "Render one node row at a time and recurse through children.",
      "Toggle expansion from a stable parent-owned state model.",
    ],
    evaluationChecklist: [
      "Clear recursive rendering logic.",
      "No duplicated expansion state.",
      "Good explanation of tradeoffs and next steps.",
    ],
    sourceRefs: [
      ref("machine-coding-sheet", "Machine coding cheat sheet", "context/Frontend Machine Coding Cheat Sheet.pdf"),
      ref("dsa-doc", "DSA for frontend", "context/DSA for frontend.docx"),
    ],
  },
  {
    id: "cp-nested-comments",
    track: "dsa",
    difficulty: "3-6y",
    title: "Flatten or render nested comments",
    scenario: "Solve a frontend-style DSA problem where comments can have deeply nested replies and the UI needs either a flat list or recursive rendering.",
    requirements: [
      "Traverse nested comment data correctly.",
      "Return either a flat list or a rendered tree depending on the interviewer's ask.",
      "Explain the traversal order and time complexity.",
      "Handle missing or empty children safely.",
    ],
    hints: [
      "Ask whether depth metadata is needed in the output.",
      "DFS is often the simplest first solution.",
      "Say the base case out loud before coding.",
    ],
    solutionOutline: [
      "Describe the node shape and the output shape.",
      "Implement traversal with a base case for empty children.",
      "Record each node in the required order and discuss complexity.",
    ],
    evaluationChecklist: [
      "Correct base case.",
      "Traversal order explained clearly.",
      "Time and space complexity discussed.",
    ],
    sourceRefs: [
      ref("dsa-doc", "DSA for frontend", "context/DSA for frontend.docx"),
      ref("top-150-dsa", "Top 150 frontend DSA questions", "context/Top 150 DSA Questions for Frontend Developers - Geeky Frontend.pdf"),
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
