import type { CategorySeed } from "../types";

export const reactSeed: CategorySeed = {
  name: "React",
  slug: "react",
  description:
    "Component model, hooks, rendering behavior, and real-world React interview patterns.",
  icon: "react",
  questions: [
    {
      title: "What is JSX and how does it differ from HTML?",
      prompt:
        "Explain what JSX is, how it relates to JavaScript, and how it differs from plain HTML.",
      difficulty: "EASY",
      tags: ["fundamentals", "jsx"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `JSX (JavaScript XML) is a syntax extension for JavaScript that lets you write markup that looks like HTML directly inside JavaScript files. It is not a template language executed at runtime; instead, tools like Babel compile JSX into plain JavaScript function calls, typically React.createElement(type, props, ...children), which produce lightweight objects describing the UI (React elements).

Key differences from HTML:

- JSX expressions must evaluate to a single root element (or a Fragment) because they compile to a single function call.
- JSX uses camelCase for most attributes (className instead of class, onClick instead of onclick, tabIndex instead of tabindex) because it maps to JavaScript object properties and DOM APIs, not HTML attribute names.
- You can embed any JavaScript expression inside curly braces, e.g. {user.name} or {isLoggedIn && <Avatar />}, which HTML cannot do natively.
- Self-closing tags are required for elements without children, such as <img /> or <br />.
- Inline styles are passed as an object of camelCased CSS properties rather than a CSS string, e.g. style={{ color: "red" }}.
- Because it is just JavaScript under the hood, JSX benefits from type checking (with TypeScript), linting, and the full expressive power of the language, rather than being a separate templating DSL.

Ultimately JSX is syntactic sugar; React does not require it, but it makes describing UI trees far more readable than nested createElement calls.`,
        },
      ],
    },
    {
      title: "What is the difference between state and props?",
      prompt:
        "Explain the difference between state and props in React, including who owns each and how updates flow through a component tree.",
      difficulty: "EASY",
      tags: ["fundamentals", "state", "props"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Props and state are both plain JavaScript objects that hold data influencing what a component renders, but they differ in ownership and mutability.

Props (short for properties):
- Passed from a parent component to a child component, similar to function arguments.
- Read-only from the child's perspective; a component must never mutate its own props.
- Changes to props come from the parent re-rendering with new values, not from the child.
- Used to configure and customize a reusable component.

State:
- Owned and managed internally by the component itself (via useState, useReducer, or class-based this.state).
- Mutable through the component's own setter functions (setState, the updater returned by useState), which schedule a re-render.
- Local to that component instance unless explicitly lifted up or shared through context or an external store.
- Used for values that change over time as a result of user interaction, network responses, timers, etc.

The typical data flow in React is unidirectional: state lives in some component, gets passed down as props to children, and children communicate back up by invoking callback functions (also passed as props) that the parent uses to update its own state. This "one-way data flow" makes it much easier to reason about where data changes originate and keeps rendering predictable.`,
        },
      ],
    },
    {
      title: "What is the virtual DOM and why does React use it?",
      prompt:
        "Explain what the virtual DOM is, how it relates to the real DOM, and why React's rendering model is built around it.",
      difficulty: "EASY",
      tags: ["rendering", "virtual-dom", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `The virtual DOM is an in-memory, lightweight JavaScript representation of the real DOM tree. Every time a component renders, React builds a tree of plain JavaScript objects (React elements) describing what the UI should look like, rather than touching the real DOM directly.

Why this matters:

- Direct DOM manipulation is comparatively expensive: reflows, repaints, and layout recalculations are costly browser operations.
- On every update, React builds a new virtual DOM tree and compares it (diffs it) against the previous virtual DOM tree using an algorithm called reconciliation.
- From that diff, React computes the minimal set of real DOM mutations required and applies them in a single batch, rather than re-rendering the entire page.
- Because the virtual DOM is just JavaScript objects, creating and comparing them is cheap relative to real DOM operations, so React can afford to re-render "generously" (e.g., re-render a whole subtree) and still only touch the DOM where something actually changed.

It is worth noting the virtual DOM is not primarily a raw performance silver bullet compared to hand-optimized direct DOM code; its real value is developer ergonomics: you can write declarative code that says "here is what the UI should look like given this state" without manually tracking and applying each individual DOM mutation yourself, while React efficiently figures out the minimal update on your behalf.`,
        },
      ],
    },
    {
      title: "What are keys in React lists and why are they important?",
      prompt:
        "When rendering a list of elements in React, why does React ask for a key prop, and what happens if you use array indexes or omit keys entirely?",
      difficulty: "EASY",
      tags: ["rendering", "lists", "reconciliation"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Keys are special string (or number) props that help React identify which items in a list have changed, been added, or been removed between renders. When React reconciles a list, it uses keys to match elements in the new tree with elements in the old tree instead of comparing them purely by position.

Why keys matter:

- Without stable keys, React falls back to comparing children by index, which can cause it to reuse the wrong DOM node and its associated component state for a different logical item, leading to bugs like form inputs retaining the wrong value, animations glitching, or unnecessary re-mounting of components.
- With a stable, unique key (typically a database ID or another value that uniquely and consistently identifies an item), React can correctly detect that an item moved, was inserted, or was deleted, and it can preserve component state and DOM nodes for unchanged items.

Using the array index as a key is a common anti-pattern when the list can be reordered, filtered, or have items inserted/removed in the middle, because the index does not travel with the item; it is generally acceptable only for static lists that never reorder and never have items added/removed.

Keys must be unique among siblings (not globally unique across the whole app) and stable across renders. Omitting keys entirely still works but React will warn in development and default to index-based matching, with the same pitfalls described above.`,
        },
      ],
    },
    {
      title:
        "What is the difference between controlled and uncontrolled components?",
      prompt:
        "Explain the difference between controlled and uncontrolled form components in React, and when you might choose one over the other.",
      difficulty: "EASY",
      tags: ["forms", "controlled-components"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A controlled component has its form value driven entirely by React state: the input's value prop is set from state, and every change goes through an onChange handler that updates that state, making React the single source of truth. An uncontrolled component instead keeps its value in the DOM itself; React does not track it on every keystroke, and you read the current value imperatively via a ref (or from FormData on submit) when you need it.

Controlled components are generally preferred because they make validation, conditional disabling, formatting, and syncing with other UI trivial, since the value is always available in state. The tradeoff is an extra re-render on every keystroke, which rarely matters but can add up in very large forms.

Uncontrolled components are useful for simple forms where you only need the value on submit, for integrating with non-React code, or for file inputs, whose value cannot be set programmatically and must be uncontrolled.`,
          codeContent: `// Controlled
function ControlledInput() {
  const [value, setValue] = useState("");
  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  );
}

// Uncontrolled
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };

  return (
    <>
      <input ref={inputRef} defaultValue="" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What does the useState hook do?",
      prompt:
        "Explain how the useState hook works, what it returns, and how updates are batched and scheduled.",
      difficulty: "EASY",
      tags: ["hooks", "usestate"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `useState is the primary hook for adding local state to a function component. Calling useState(initialValue) returns a two-element tuple: the current state value, and a setter function used to update it and trigger a re-render.

Important behaviors:

- The initial value is only used on the very first render; on subsequent renders React returns the current stored value and ignores the argument. If computing the initial value is expensive, you can pass a function (lazy initialization) so it only runs once.
- Calling the setter schedules a re-render; it does not mutate the variable synchronously in place, so reading the state variable immediately after calling the setter in the same function body still shows the old value.
- React batches multiple setState calls that happen within the same event handler (and, since React 18, within promises, timeouts, and other async contexts too) into a single re-render for performance.
- If the new state depends on the previous state, you should pass an updater function, e.g. setCount(prev => prev + 1), rather than referencing the outer variable directly, to avoid stale-closure bugs, especially when multiple updates happen before a re-render.
- React uses Object.is comparison to bail out of a re-render if the new state value is identical to the current one.`,
          codeContent: `function Counter() {
  const [count, setCount] = useState(0);

  const incrementTwice = () => {
    // Correct: uses updater form, both increments apply
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  return (
    <button onClick={incrementTwice}>Count: {count}</button>
  );
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What are the rules of hooks?",
      prompt: "What are the rules of hooks in React, and why do they exist?",
      difficulty: "EASY",
      tags: ["hooks", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `React hooks come with two fundamental rules, enforced in development by the eslint-plugin-react-hooks linter:

1. Only call hooks at the top level. Never call hooks inside loops, conditions, nested functions, or after an early return. They must run in the exact same order on every single render of a component.

2. Only call hooks from React function components or from custom hooks. Do not call them from regular JavaScript functions, class components, or outside the render phase (e.g., in event handlers directly, though hooks can set up handlers that are called later).

Why these rules exist: React does not track hooks by name; it tracks them by call order using an internal linked list (or array) associated with the component's fiber. On each render, React walks through that list assuming the Nth call to useState/useEffect/etc. corresponds to the same piece of state or effect as the Nth call in the previous render. If a hook call is conditionally skipped, every hook after it shifts position in the list, and React ends up associating the wrong stored state or effect with the wrong hook call, causing subtle and hard-to-debug bugs (state appearing to "swap" between values, effects firing with stale dependencies, etc.).

If you need conditional behavior, the fix is to always call the hook unconditionally and put the condition inside the hook's body (e.g., inside useEffect, check a flag before doing work), or to split the conditional logic into a separate component that mounts/unmounts entirely.`,
        },
      ],
    },
    {
      title: "What is useEffect and when does it run?",
      prompt:
        "Explain what the useEffect hook is used for, how its dependency array controls when it runs, and how cleanup functions work.",
      difficulty: "EASY",
      tags: ["hooks", "useeffect", "side-effects"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `useEffect lets you run side effects in a function component — code that reaches outside of pure rendering, such as data fetching, subscriptions, manually interacting with the DOM, timers, or logging. It runs after the browser has painted the updated DOM, so it does not block visual updates.

How the dependency array controls execution:

- No dependency array: the effect runs after every render.
- Empty array []: the effect runs once, after the initial mount only.
- Array with values [a, b]: the effect runs after the initial mount and again any time any value in the array changes between renders (compared with Object.is).

Cleanup: if the function passed to useEffect returns another function, React calls that returned function before running the effect again (on dependency change) and when the component unmounts. This is used to cancel subscriptions, clear timers, abort in-flight requests, or remove event listeners, preventing memory leaks and stale updates.

A common pitfall is omitting values used inside the effect from the dependency array, which causes the effect to close over stale variables. The exhaustive-deps ESLint rule helps catch this.`,
          codeContent: `function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]); // re-run whenever roomId changes

  return <div>Connected to {roomId}</div>;
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title:
        "What is the difference between function components and class components?",
      prompt:
        "Compare function components with hooks to class components in React. Why has the ecosystem largely moved toward function components?",
      difficulty: "EASY",
      tags: ["fundamentals", "class-components", "hooks"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Class components define UI as a class extending React.Component, with state stored on this.state, updated via this.setState, and lifecycle behavior expressed through named methods like componentDidMount, componentDidUpdate, and componentWillUnmount. Function components are plain JavaScript functions that return JSX, and since React 16.8 they can hold state and side effects via hooks (useState, useEffect, etc.) instead of lifecycle methods and instance fields.

Reasons the ecosystem shifted to function components:

- Less boilerplate: no constructor, no binding this in event handlers, no class syntax overhead.
- Better logic reuse: custom hooks let you extract and share stateful logic between components directly, whereas classes relied on higher-order components or render props, both of which tend to create deeply nested "wrapper hell."
- Related logic stays together: with hooks, code for a single concern (e.g., subscribing and unsubscribing to a data source) lives in one useEffect block, whereas in classes it was split across componentDidMount and componentWillUnmount.
- this-binding foot-guns disappear entirely since functions don't have an instance this the way classes do.
- The React team has focused new features (concurrent rendering, Suspense for data fetching, hooks-based APIs like useTransition and useDeferredValue) primarily around function components.

Class components still work and are not deprecated, and error boundaries currently still require a class component (componentDidCatch/getDerivedStateFromError have no hook equivalent), but virtually all new React code is written as function components with hooks.`,
        },
      ],
    },
    {
      title: "How do you conditionally render UI in React?",
      prompt:
        "Write examples of the common patterns used to conditionally render JSX in React, and note pitfalls with each.",
      difficulty: "EASY",
      tags: ["jsx", "rendering", "patterns"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `function Notifications({ count, isLoading, error }: { count: number; isLoading: boolean; error?: string }) {
  // 1. Early return for a whole alternate UI state
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* 2. && for "render only if truthy" -- careful with 0/NaN, they'd render literally */}
      {count > 0 && <Badge>{count}</Badge>}

      {/* 3. Ternary for either/or rendering */}
      {count > 0 ? <span>You have unread notifications</span> : <span>All caught up</span>}

      {/* 4. Variable assignment for more complex branching, readable in JSX */}
      {(() => {
        if (count === 0) return null;
        if (count > 99) return <span>99+</span>;
        return <span>{count}</span>;
      })()}
    </div>
  );
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What are React fragments and why use them?",
      prompt:
        "What problem do React fragments solve, and how do you use them, including the keyed fragment syntax?",
      difficulty: "EASY",
      tags: ["jsx", "fragments"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `// Without a fragment, returning multiple siblings requires an extra wrapper
// element (like a <div>), which can break CSS layouts (flex/grid) or add
// meaningless nodes to the DOM.

function Row() {
  return (
    <>
      <td>First</td>
      <td>Last</td>
    </>
  );
}

// The shorthand <>...</> cannot take a key. When rendering a list of
// fragments, use the explicit React.Fragment form with a key:

function List({ items }: { items: { id: string; a: string; b: string }[] }) {
  return (
    <table>
      <tbody>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <tr><td>{item.a}</td></tr>
            <tr><td>{item.b}</td></tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What is the difference between useMemo and useCallback?",
      prompt:
        "Explain the difference between useMemo and useCallback, what problems each solves, and when using them is actually worthwhile.",
      difficulty: "MEDIUM",
      tags: ["hooks", "usememo", "usecallback", "performance"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Both hooks memoize a value across renders so it is only recomputed when its dependencies change, but they memoize different things:

- useMemo(fn, deps) memoizes the return value of fn — a computed value, such as a filtered array or an expensive calculation.
- useCallback(fn, deps) memoizes the function reference itself, so the same function identity is returned across renders as long as dependencies are unchanged. It is functionally equivalent to useMemo(() => fn, deps).

Why this matters: in JavaScript, functions and objects are recreated with a new reference on every render by default. That is usually harmless, but it becomes a problem when:

- The value is a dependency of another hook (useEffect, useMemo, useCallback), where a new reference on every render would cause that hook to re-run every time even though the "logical" value didn't change.
- The function or object is passed as a prop to a child wrapped in React.memo; a new reference defeats the memoization and causes the child to re-render anyway.

When it is not worthwhile: memoization itself has a cost (storing the previous deps and value, comparing them each render), and for cheap computations or components that render fine either way, useMemo/useCallback can add complexity and even slightly hurt performance without measurable benefit. They should be reached for when profiling shows an actual expensive recomputation or unnecessary re-render, not applied reflexively to everything.`,
          codeContent: `function ProductList({ products, query }: { products: Product[]; query: string }) {
  // Recomputed only when products or query change
  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(query)),
    [products, query]
  );

  // Stable function identity passed to a memoized child
  const handleSelect = useCallback((id: string) => {
    console.log("selected", id);
  }, []);

  return <MemoizedRow items={filtered} onSelect={handleSelect} />;
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "How does useRef differ from useState?",
      prompt:
        "Explain what useRef is used for, how it differs from useState, and common use cases such as accessing DOM nodes and storing mutable values.",
      difficulty: "MEDIUM",
      tags: ["hooks", "useref", "dom"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `useRef(initialValue) returns a mutable object with a single .current property, initialized to the value you passed in. That object persists for the entire lifetime of the component across re-renders, just like state, but with two key differences from useState:

- Mutating ref.current does not trigger a re-render. React has no idea when a ref changes.
- Reading and writing ref.current is synchronous and immediate, unlike state updates which are scheduled and only reflected on the next render.

Common use cases:

1. Accessing DOM nodes imperatively: pass a ref to a JSX element's ref attribute (e.g., <input ref={inputRef} />) and React sets .current to the underlying DOM node after mount, letting you call methods like .focus() or measure layout.
2. Storing any mutable value that should persist across renders but should not cause re-renders when it changes, such as a timer ID, a previous value for comparison, an instance of a third-party library, or a flag like "has this effect already run."

A ref should not be read or written during rendering (except for lazy initialization patterns); it is meant for imperative code inside event handlers or effects, since mutating it during render is not tracked by React and can produce inconsistent UI.`,
          codeContent: `function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);
  renderCount.current += 1; // does not cause a re-render

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What is the Context API and when would you use it?",
      prompt:
        "Explain how React's Context API works and when it's an appropriate tool versus passing props down or reaching for an external state management library.",
      difficulty: "MEDIUM",
      tags: ["context", "state-management"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Context provides a way to pass data through the component tree without manually threading props through every intermediate level ("prop drilling"). You create a context with createContext(defaultValue), wrap part of the tree in a <SomeContext.Provider value={...}>, and any descendant can read the current value with useContext(SomeContext), regardless of how deeply nested it is.

Good use cases: data that many components across the tree need, but that changes relatively infrequently — theming, the current authenticated user, locale/i18n settings, or feature flags.

Caveats and when to reach for something else:

- Every component that consumes a context re-renders whenever the provider's value changes, with no built-in way to subscribe to just a slice of it. Passing a large object with many independent pieces of state through one context can cause widespread unnecessary re-renders.
- Context is not itself a state management solution; it is a dependency-injection mechanism for passing values down. The state itself typically still lives in useState/useReducer in some ancestor component.
- For state that changes frequently, has complex update logic, needs fine-grained subscriptions, time-travel debugging, or middleware, a dedicated library like Redux, Zustand, or Jotai is usually a better fit, since they offer selector-based subscriptions so components only re-render when the specific slice they read changes.

A common mitigation for the re-render problem is splitting context into multiple, more granular providers, or memoizing the provider value with useMemo.`,
          codeContent: `const ThemeContext = createContext<"light" | "dark">("light");

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What is a custom hook and why write one?",
      prompt:
        "Explain what a custom hook is, the naming convention, and why you would extract logic into one instead of duplicating it across components.",
      difficulty: "MEDIUM",
      tags: ["hooks", "custom-hooks", "code-reuse"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A custom hook is simply a JavaScript function whose name starts with "use" and that calls one or more built-in hooks internally. It lets you extract stateful logic — state, effects, refs — out of a component and reuse it across multiple components, without duplicating code and without the nesting problems of older patterns like higher-order components or render props.

Key points:

- The "use" prefix is a convention that the linter and React itself rely on to know that rules-of-hooks checks apply to the function.
- Each component that calls a custom hook gets its own independent instance of the underlying state; the hook shares logic, not state, unless you also introduce something like context.
- Custom hooks compose naturally: a custom hook can call other custom hooks.
- They are React's primary answer to "how do I reuse logic," replacing patterns that were common before hooks existed.

Typical examples: useFetch (data fetching with loading/error state), useLocalStorage (sync state to localStorage), useDebounce (delay updating a value), useWindowSize (subscribe to resize events), useToggle (boolean state with a toggler).`,
          codeContent: `function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

// Usage in any component:
function Layout() {
  const width = useWindowWidth();
  return <div>{width < 768 ? <MobileNav /> : <DesktopNav />}</div>;
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "When should you use React.memo?",
      prompt:
        "Explain what React.memo does, how it decides whether to skip a re-render, and situations where it does not help.",
      difficulty: "MEDIUM",
      tags: ["performance", "memoization", "rendering"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `React.memo is a higher-order component that wraps a component and skips re-rendering it if its props are shallowly equal to the props from the previous render. It performs a shallow comparison of each prop with Object.is by default, or you can pass a custom comparison function as the second argument.

When it helps:

- A component renders relatively expensive output (large lists, complex layout/calculations) and its parent re-renders often for reasons unrelated to that component's props.
- The component's props are primitives, or stable references (memoized with useMemo/useCallback upstream), so the shallow comparison can actually succeed and skip work.

When it does not help, or can even hurt:

- If the component receives new object/array/function references on every render (e.g., an inline arrow function or object literal passed as a prop) without the parent memoizing them, React.memo's shallow comparison always finds a difference and re-renders anyway — the wrapper's comparison cost is pure overhead.
- For cheap components that render quickly regardless, the memoization bookkeeping (storing previous props, comparing them) can cost more than just re-rendering.
- It only prevents re-renders caused by the parent re-rendering; it does not prevent re-renders triggered by the component's own state or context changes.

In practice, React.memo is most effective when paired with useMemo/useCallback for any non-primitive props, and should be applied based on profiling (e.g., React DevTools Profiler) rather than by default on every component.`,
        },
      ],
    },
    {
      title: "What is 'lifting state up' and when is it necessary?",
      prompt:
        "Explain the 'lifting state up' pattern in React with an example scenario where it's needed.",
      difficulty: "MEDIUM",
      tags: ["state", "patterns", "component-design"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Lifting state up means moving state from a component where it currently lives up to the closest common ancestor of all the components that need to read or modify it. Because React data flow is one-directional (state flows down as props, changes flow up via callbacks), two sibling components cannot directly share or synchronize state with each other; the only way for them to stay in sync is for a shared parent to own that state and pass it down to both.

A concrete example: imagine a TemperatureInput component in Celsius and another in Fahrenheit that need to stay in sync — changing one should update the other. If each input manages its own local state independently, they cannot influence each other. The fix is to remove the state from both inputs and instead store a single source-of-truth temperature value in their common parent component. The parent passes the current value down to both inputs as props (converting units as needed) and passes down an onChange callback that each input calls to notify the parent of a change; the parent updates its state, which re-renders both children with the new, consistent value.

Lifting state up is necessary any time two or more components need to reflect the same changing data, or when a parent needs to coordinate behavior based on a child's state (e.g., disabling a submit button based on validation state living in a form field). The tradeoff is that as more components need shared state, lifting it too far up can lead to a large, monolithic parent passing many props down multiple levels — at that point, context or an external store is often a better fit.`,
        },
      ],
    },
    {
      title: "Context API vs a state management library like Redux or Zustand",
      prompt:
        "When would you reach for React's built-in Context API versus an external state management library such as Redux or Zustand? Compare their tradeoffs.",
      difficulty: "MEDIUM",
      tags: ["state-management", "context", "redux", "zustand"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `React Context is built into React and is well suited for passing relatively static or infrequently-changing values down the tree — theme, current user, locale — without prop drilling. It has no built-in mechanism for selective subscriptions: any component consuming a context re-renders whenever that context's value changes, even if it only cares about part of it. It also has no built-in async middleware, devtools, or persistence.

External state management libraries solve problems that appear as an app's shared state grows in size and update frequency:

- Redux (with Redux Toolkit) provides a single, centralized store, strict unidirectional updates through reducers and actions, and powerful devtools (time-travel debugging, action logs). Components subscribe via selectors, so a component only re-renders when the specific slice of state it selects actually changes, which scales much better than context for frequently-updated state consumed by many components. The tradeoff is more boilerplate and a steeper learning curve, though Redux Toolkit reduced this significantly.
- Zustand is a much lighter-weight store: you define state and actions in a single hook-like store, and components subscribe with selectors similar to Redux, giving fine-grained re-render control without reducers/actions boilerplate. It has less structure/opinion than Redux, which is good for smaller apps but can lead to inconsistency in larger teams without discipline.

Rule of thumb: use Context for simple, low-frequency, broadly-needed values, especially when you don't want a new dependency. Reach for Zustand/Redux/Jotai when state updates frequently, is read by many components that would otherwise all re-render together via context, needs middleware (logging, persistence, undo), or benefits from devtools for debugging complex state transitions.`,
        },
      ],
    },
    {
      title: "What causes a React component to re-render?",
      prompt:
        "List and explain the situations that cause a React function component to re-render.",
      difficulty: "MEDIUM",
      tags: ["rendering", "performance", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A function component re-renders (React calls the function again to compute new JSX) in these situations:

1. Its own state changes — calling a useState setter or useReducer dispatch with a value that is not Object.is-equal to the current value.
2. Its parent re-renders — by default, when a parent component re-renders, React re-renders all of its children too, regardless of whether their props actually changed, unless the child is wrapped in React.memo and its props are shallowly equal.
3. A context value it consumes (via useContext) changes — every consumer of that context re-renders when the provider's value prop changes, even if the consumer only uses part of that value.
4. Its props change, in the sense that a re-render is initiated by the parent passing new prop values — though technically this is really a special case of #2, since the child re-renders regardless of whether the specific prop values it reads actually differ, unless memoized.
5. A force update mechanism, such as calling the updater from useState with a new object/array reference even if the logical content is "the same" (e.g., setState([...items]) creates a new array reference, which is different by Object.is even if items are equal by value).

Notably, re-rendering a component does not necessarily mean the DOM is updated — React still diffs the new virtual DOM output against the previous one and only commits actual DOM mutations where something changed. "Re-render" refers to React calling your component function again and reconciling the result, not necessarily to a visible DOM change.`,
        },
      ],
    },
    {
      title: "Build a useToggle hook",
      prompt:
        "Implement a reusable useToggle custom hook that manages a boolean value with functions to toggle it, and explicitly set it true or false.",
      difficulty: "MEDIUM",
      tags: ["hooks", "custom-hooks", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import { useCallback, useState } from "react";

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse } as const;
}

// Usage
function Modal() {
  const { value: isOpen, toggle, setFalse } = useToggle(false);

  return (
    <>
      <button onClick={toggle}>Open modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={setFalse}>Close</button>
        </div>
      )}
    </>
  );
}

export default useToggle;`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "Build a useDebounce hook",
      prompt:
        "Implement a useDebounce custom hook that returns a debounced version of a value, updating only after the value has been stable for a given delay. Use it to debounce a search input.",
      difficulty: "MEDIUM",
      tags: ["hooks", "custom-hooks", "coding-exercise", "debounce"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

// Usage: only fire the search request 300ms after the user stops typing
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(\`/api/search?q=\${encodeURIComponent(debouncedQuery)}\`);
  }, [debouncedQuery]);

  return (
    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
  );
}

export default useDebounce;`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "Build a controlled form component with validation",
      prompt:
        "Implement a controlled sign-up form component with email and password fields, inline validation errors, and a disabled submit button until the form is valid.",
      difficulty: "MEDIUM",
      tags: ["forms", "controlled-components", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import { useMemo, useState, FormEvent } from "react";

interface FormValues {
  email: string;
  password: string;
}

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {};
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  return errors;
}

function SignUpForm({ onSubmit }: { onSubmit: (values: FormValues) => void }) {
  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field: keyof FormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
        />
        {touched.email && errors.email && <span className="error">{errors.email}</span>}
      </label>

      <label>
        Password
        <input
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
        />
        {touched.password && errors.password && <span className="error">{errors.password}</span>}
      </label>

      <button type="submit" disabled={!isValid}>
        Sign up
      </button>
    </form>
  );
}

export default SignUpForm;`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "Explain React's reconciliation algorithm",
      prompt:
        "Describe how React's reconciliation (diffing) algorithm works, including the heuristics it uses to keep diffing fast.",
      difficulty: "HARD",
      tags: ["reconciliation", "rendering", "internals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Reconciliation is the process React uses to determine what changed between two virtual DOM trees (before and after a state/prop update) and to compute the minimal set of real DOM mutations required. A naive tree-diffing algorithm would be O(n^3) for arbitrary trees, which is far too slow for UI updates, so React uses a heuristic O(n) algorithm based on two assumptions:

1. Different element types produce different trees. If an element's type changes between renders (e.g., a <div> becomes a <span>, or ComponentA becomes ComponentB), React does not try to diff their children — it tears down the old subtree entirely (unmounting components, running cleanup effects) and builds a brand new subtree from scratch, rather than trying to reconcile them. This is a deliberate simplification: cross-type diffing is rare in practice and not worth the complexity/cost of supporting.

2. Elements of the same type are compared by their attributes/props, and their children are diffed recursively. If the type stays the same (same DOM tag or same component), React keeps the underlying instance/DOM node and just updates its changed attributes, then recurses into the children.

For lists of children, React uses keys to match elements across renders rather than relying purely on index position (see the "keys" question) — this lets it detect insertions, removals, and reorders efficiently and preserve state/DOM nodes for items that persisted.

React 18's fiber architecture also makes reconciliation interruptible: work is broken into units (fibers) that can be paused, resumed, or abandoned, allowing React to yield to the browser for higher-priority work (like input handling) during a large render, and to support concurrent features like useTransition. The overall process is split into a "render phase" (computing what changed, interruptible) and a "commit phase" (applying DOM mutations, synchronous and non-interruptible).`,
        },
      ],
    },
    {
      title: "What are error boundaries and how do you implement one?",
      prompt:
        "Explain what error boundaries are in React, what kinds of errors they do and don't catch, and implement a basic one.",
      difficulty: "HARD",
      tags: ["error-boundaries", "error-handling"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `An error boundary is a component that catches JavaScript errors thrown during rendering, in lifecycle methods, and in constructors of its child component tree, logs them, and displays a fallback UI instead of letting the error crash the entire application (a blank white screen).

What they catch: errors thrown while React is rendering, in lifecycle methods, and in constructors anywhere below the boundary in the tree.

What they do NOT catch:
- Errors inside event handlers (use a regular try/catch there instead).
- Errors in asynchronous code, such as setTimeout callbacks or promise rejections outside of render (again, handle these locally, e.g., catch fetch errors and set error state).
- Errors during server-side rendering.
- Errors thrown in the error boundary component itself.

Implementation requirement: error boundaries currently must be class components, because they rely on two class-only lifecycle APIs: static getDerivedStateFromError(error), which updates state to trigger the fallback UI on the next render, and componentDidCatch(error, info), used for side effects like logging the error to a reporting service. There is no hook equivalent as of React 18/19, though libraries like react-error-boundary provide a hook-friendly wrapper around a class boundary internally.

In practice, you place error boundaries strategically around independent sections of the UI (e.g., around a single widget, or around each route) so that one section crashing doesn't take down the whole page, rather than wrapping the absolute top of the app in only one giant boundary.`,
          codeContent: `class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <Dashboard />
</ErrorBoundary>;`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What is useTransition and how does it help concurrency?",
      prompt:
        "Explain the useTransition hook introduced in React 18, what problem it solves, and how it interacts with concurrent rendering.",
      difficulty: "HARD",
      tags: ["react-18", "concurrent-rendering", "usetransition"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `useTransition lets you mark a state update as a low-priority "transition," telling React it can be interrupted by more urgent updates (like typing in an input) and rendered in the background without blocking the UI. It returns [isPending, startTransition]: isPending is a boolean indicating whether the transition is still in progress, and startTransition is a function you wrap a state update in to mark it as non-urgent.

The problem it solves: previously, all state updates within an event handler had the same priority, so a single setState call that triggers an expensive re-render (e.g., re-filtering a huge list on every keystroke) would block the browser from updating the input field itself, making typing feel laggy. With useTransition, you can update the input's own state urgently (so typing stays responsive) while marking the expensive derived state update (the filtered list) as a transition. React's concurrent renderer then works on the expensive update in the background, can pause it if a more urgent update comes in (like the next keystroke), and only commits it when ready, all without blocking the main thread from responding to input.

This only works because React 18's rendering is concurrent/interruptible (thanks to the fiber architecture): the render phase for a transition update can be paused, thrown away, or restarted if something more urgent needs to happen first, whereas the commit phase (actual DOM mutation) is still synchronous.`,
          codeContent: `function FilterableList({ items }: { items: string[] }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filtered, setFiltered] = useState(items);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // urgent: keep the input responsive

    startTransition(() => {
      // low priority: can be interrupted by the next keystroke
      setFiltered(items.filter((i) => i.includes(value)));
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating...</span>}
      <ul>{filtered.map((i) => <li key={i}>{i}</li>)}</ul>
    </>
  );
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "What is useDeferredValue and how does it differ from debouncing?",
      prompt:
        "Explain the useDeferredValue hook, how it works, and how it compares to manually debouncing a value with a timer.",
      difficulty: "HARD",
      tags: ["react-18", "concurrent-rendering", "usedeferredvalue"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `useDeferredValue(value) returns a version of the value that "lags behind" the real value during urgent updates, letting React defer re-rendering the expensive part of the UI that depends on it until there's spare time, while allowing more urgent updates (like keystrokes) to render immediately with the current value everywhere else.

How it differs from debouncing/throttling with a timer:

- A fixed-delay debounce always waits a set amount of time (e.g., 300ms) before updating, regardless of the device's actual performance — on a fast machine this adds unnecessary latency, and on a very slow machine 300ms might still not be enough for a heavy render to keep up, causing jank anyway.
- useDeferredValue has no fixed delay. React updates the deferred value as soon as it has spare rendering capacity, which adapts automatically to the device: on fast hardware the deferred value catches up almost immediately, and on slow hardware React continues deferring it and prioritizing urgent updates as needed.
- Deferred value updates are interruptible/concurrent renders, just like transitions — if a new urgent update comes in while React is working on rendering with the deferred value, that in-progress render can be abandoned and restarted, whereas a debounced setState is just a normal, non-interruptible update once the timer fires.

useDeferredValue and useTransition solve a similar underlying problem (keep the UI responsive during expensive updates) but from different angles: useTransition marks a state update itself as low priority (you control when the update happens), whereas useDeferredValue takes an existing, already-changing value (often one you don't own, like a prop) and produces a deferred copy of it for use in an expensive part of the tree.`,
          codeContent: `function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // ExpensiveList re-renders based on deferredQuery, which lags
  // behind query during rapid typing, keeping the input itself snappy.
  return (
    <div style={{ opacity: isStale ? 0.6 : 1 }}>
      <ExpensiveList query={deferredQuery} />
    </div>
  );
}`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title:
        "What is Suspense and how is it used for data fetching and code splitting?",
      prompt:
        "Explain how React Suspense works, its use for lazy-loaded components via React.lazy, and its role in data fetching frameworks.",
      difficulty: "HARD",
      tags: ["react-18", "suspense", "code-splitting"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Suspense lets a component "wait" for something asynchronous (loading code, loading data) before rendering, showing a fallback UI in the meantime. You wrap part of the tree in <Suspense fallback={<Spinner />}>...</Suspense>; if any descendant "suspends" (throws a special promise React catches internally), React shows the fallback until that promise resolves, then re-renders the real content.

Code splitting: the most stable, widely-used case is React.lazy(() => import("./Component")), which returns a component that suspends while its JS chunk is being fetched over the network. Wrapping it in Suspense shows a fallback (e.g., a spinner or skeleton) while the bundle loads, then renders the real component once loaded. This lets you split your bundle so users only download the code for the routes/features they actually visit.

Data fetching: Suspense also has a designed role for data fetching in frameworks that support it (such as Next.js App Router / React Server Components, or libraries like React Query's/Relay's Suspense integration): a component can "suspend" while it's fetching data, and Suspense shows a fallback for that whole section without you needing to manually track and check isLoading flags scattered through the tree. This composes naturally: you can nest multiple Suspense boundaries so different parts of the page can each show their own loading state and reveal independently and progressively as their data arrives, rather than blocking the entire page on the slowest fetch.

Suspense on its own is a mechanism, not a full data-fetching solution — you need a library or framework that knows how to throw/resolve the right promises (React alone doesn't fetch data for you); using plain useEffect-based fetching does not automatically integrate with Suspense.`,
        },
      ],
    },
    {
      title: "Explain automatic batching in React 18",
      prompt:
        "What is automatic batching in React 18, how does it differ from React 17's batching behavior, and how can you opt out if needed?",
      difficulty: "HARD",
      tags: ["react-18", "batching", "rendering", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Batching is React grouping multiple state updates into a single re-render for performance, instead of re-rendering once per setState call. Before React 18, batching only happened inside React-controlled event handlers (e.g., onClick); state updates inside promises, setTimeout callbacks, native event handlers, or any other non-React-triggered async code were each applied synchronously and caused a separate re-render.

React 18 introduced automatic batching: as long as you're using createRoot (the new root API), state updates are batched no matter where they originate from — inside timeouts, promises, native event handlers, or any other callback — not just inside React event handlers. This means code like:

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);

now triggers only a single re-render in React 18 with createRoot, whereas in React 17 it would have triggered two separate re-renders, one for each call.

Why this matters: fewer re-renders means less wasted work and more consistent behavior — previously developers had to reason about whether they were inside a React event handler to predict how many renders a piece of code would cause, which was a common source of confusion and inconsistent bugs (e.g., a callback firing multiple renders when only one was expected).

Opting out: on the rare occasion you need an update to be applied synchronously/immediately rather than batched — for example, to read a DOM measurement right after a state change within the same tick — you can wrap the update in flushSync from react-dom, which forces React to flush and apply that update before continuing, though this should be used sparingly since it defeats the performance benefit of batching.`,
        },
      ],
    },
    {
      title: "Build a useFetch hook",
      prompt:
        "Implement a reusable useFetch custom hook that tracks loading, error, and data state for a GET request, and properly cancels stale requests when the URL changes or the component unmounts.",
      difficulty: "HARD",
      tags: ["hooks", "custom-hooks", "coding-exercise", "data-fetching"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: null, isLoading: true });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed with status \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then((data) => {
        setState({ data, error: null, isLoading: false });
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return; // ignore cancellations
        setState({ data: null, error: err, isLoading: false });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useFetch<{ name: string }>(\`/api/users/\${userId}\`);

  if (isLoading) return <Spinner />;
  if (error) return <p>Failed to load: {error.message}</p>;
  return <h1>{data?.name}</h1>;
}

export default useFetch;`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title: "Build an infinite scroll list component",
      prompt:
        "Implement a React component that loads more items automatically as the user scrolls near the bottom of a list, using an IntersectionObserver.",
      difficulty: "HARD",
      tags: ["coding-exercise", "performance", "intersection-observer"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import { useCallback, useEffect, useRef, useState } from "react";

interface Item {
  id: string;
  label: string;
}

function InfiniteList({ fetchPage }: { fetchPage: (page: number) => Promise<Item[]> }) {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextItems = await fetchPage(page);
    setItems((prev) => [...prev, ...nextItems]);
    setHasMore(nextItems.length > 0);
    setPage((p) => p + 1);
    setIsLoading(false);
  }, [fetchPage, page, isLoading, hasMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
      {hasMore && <div ref={sentinelRef}>{isLoading ? "Loading..." : ""}</div>}
      {!hasMore && <p>No more items.</p>}
    </div>
  );
}

export default InfiniteList;`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title:
        "Implement the compound component pattern (e.g., a Tabs component)",
      prompt:
        "Implement a Tabs component using the compound component pattern, sharing state implicitly through context so consumers can compose Tabs.List, Tabs.Tab, and Tabs.Panel freely.",
      difficulty: "HARD",
      tags: ["coding-exercise", "compound-components", "patterns", "context"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import { createContext, useContext, useState, ReactNode } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* components must be used within <Tabs>");
  return ctx;
}

function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;
  return (
    <button role="tab" aria-selected={isActive} onClick={() => setActiveTab(id)}>
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabsContext();
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage: consumers compose the pieces freely, no prop drilling required
function Example() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="profile">Profile content</Tabs.Panel>
      <Tabs.Panel id="settings">Settings content</Tabs.Panel>
    </Tabs>
  );
}

export default Tabs;`,
          codeLanguage: "tsx",
        },
      ],
    },
    {
      title:
        "What are stale closures in React hooks and how do you avoid them?",
      prompt:
        "Explain what a stale closure bug is in the context of React hooks, why it happens, and the common ways to fix it.",
      difficulty: "HARD",
      tags: ["hooks", "closures", "debugging", "useeffect"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A stale closure bug happens when a function created during one render (an event handler, an effect callback, a timer callback) captures a variable's value from that render's scope, and that value later turns out to be outdated because a newer render produced a fresher value that the old, still-referenced function never sees.

Why it happens: each render of a function component is a completely independent call to that function, with its own local variables, including state values obtained from useState. Any function defined inside that render (including hooks' callbacks) closes over that specific render's variables. If that function is stored somewhere that outlives the render — inside a useEffect with an empty dependency array, in a setTimeout/setInterval, in an event listener registered once — it keeps referencing the state values from the render in which it was created, not the latest ones, unless something causes it to be re-created.

Classic example: a useEffect(() => { const id = setInterval(() => console.log(count), 1000); return () => clearInterval(id); }, []) captures count from the very first render; even as count updates on screen, the interval callback keeps logging the initial value, because the effect (and its closure) only ran once due to the empty dependency array.

Common fixes:

- Add the actual dependencies to the dependency array so the effect (and its closure) is recreated with fresh values whenever they change (accepting that the effect/timer will be torn down and re-created).
- Use the functional updater form of setState (setCount(prev => prev + 1)) which receives the latest state directly from React rather than relying on a captured variable, sidestepping the staleness for update logic.
- Store the latest value in a ref (useRef) that is mutated on every render outside of state; since refs are read at call-time and are not part of a closure over a specific render, reading ref.current inside the stale callback gives the current value without needing to recreate the callback.
- Use the exhaustive-deps ESLint rule to catch missing dependencies automatically.`,
        },
      ],
    },
    {
      title: "Build a Modal component using a portal",
      prompt:
        "Implement a reusable Modal component that renders into a portal outside the normal component tree, traps focus reasonably, and closes on Escape or backdrop click.",
      difficulty: "HARD",
      tags: ["coding-exercise", "portals", "accessibility"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") ?? document.body
  );
}

export default Modal;`,
          codeLanguage: "tsx",
        },
      ],
    },
  ],
};
