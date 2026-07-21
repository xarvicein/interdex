import type { CategorySeed } from "../types";

export const javascriptSeed: CategorySeed = {
  name: "JavaScript",
  slug: "javascript",
  description:
    "Core language mechanics, async patterns, and hands-on JavaScript coding exercises.",
  icon: "javascript",
  questions: [
    {
      title: "What is a closure and how does it work?",
      prompt:
        "Explain what a closure is in JavaScript, why it's useful, and write a small example that demonstrates a function retaining access to a variable from its enclosing scope.",
      difficulty: "EASY",
      tags: ["closures", "scope"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            'A closure is formed when a function "remembers" the variables from the lexical scope in which it was defined, even after that outer scope has finished executing. In JavaScript, every function forms a closure over its surrounding scope at the time it\'s created — this is a natural consequence of lexical scoping, not something you opt into.\n\nClosures are useful for creating private state (variables not directly accessible from outside), factory functions that produce customized functions, and patterns like memoization, currying, and event handler callbacks that need to retain context.',
          codeContent:
            "function makeCounter() {\n  let count = 0; // private variable, captured by the closure\n\n  return function increment() {\n    count += 1;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3\n// `count` is not accessible directly; only through the closure",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "What is hoisting in JavaScript?",
      prompt:
        "Explain hoisting in JavaScript for `var`, `let`/`const`, and function declarations. Why does accessing a `let` variable before its declaration throw, while a `var` does not?",
      difficulty: "EASY",
      tags: ["hoisting", "scope", "var-let-const"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "Hoisting describes how variable and function declarations are processed before code actually executes: the JavaScript engine scans a scope during compilation and registers declared names in advance, rather than only when execution reaches that line.\n\n- **`var`** declarations are hoisted to the top of their enclosing function (or global) scope and initialized with `undefined` immediately. This is why you can reference a `var` before its declaration line without a `ReferenceError` — you just get `undefined` instead of the eventual value.\n- **`function` declarations** are hoisted along with their full implementation, so they can be called before the line where they're written.\n- **`let` and `const`** are also hoisted (their names are registered in the scope), but they are not initialized. They remain in the **temporal dead zone (TDZ)** — the region from the start of the scope to the actual declaration line — where any access throws a `ReferenceError`. This is intentional: it catches use-before-declaration bugs that `var`'s silent `undefined` would otherwise hide.",
        },
      ],
    },
    {
      title: "What is the difference between `var`, `let`, and `const`?",
      prompt:
        "Compare `var`, `let`, and `const` in terms of scoping, redeclaration, and reassignment.",
      difficulty: "EASY",
      tags: ["var-let-const", "scope", "basics"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "- **`var`**: function-scoped (or globally scoped if declared outside any function) — it ignores block boundaries like `if` or `for`. It can be redeclared in the same scope without error and is hoisted with an initial value of `undefined`.\n- **`let`**: block-scoped — confined to the nearest enclosing `{}`. Cannot be redeclared in the same scope, but can be reassigned. Subject to the temporal dead zone.\n- **`const`**: block-scoped like `let`, cannot be redeclared, and cannot be reassigned after initialization. Note that `const` only prevents *reassigning the binding* — if the value is an object or array, its contents can still be mutated (`const obj = {}; obj.x = 1;` is legal).\n\nModern style guides generally recommend `const` by default, `let` when reassignment is genuinely needed, and avoiding `var` entirely because its function-scoping and hoisting behavior is a common source of bugs (e.g. loop-variable capture issues).",
        },
      ],
    },
    {
      title: "What is the difference between `==` and `===`?",
      prompt:
        "Explain the difference between loose equality (`==`) and strict equality (`===`) in JavaScript, and give an example where they produce different results.",
      difficulty: "EASY",
      tags: ["equality", "basics", "type-coercion"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            '`===` (strict equality) compares both value and type, without performing any type conversion — if the operands are different types, it immediately returns `false`. `==` (loose equality) first applies a set of type-coercion rules to convert the operands to a common type before comparing, which can produce results that surprise people unfamiliar with the coercion table (e.g. `"" == 0` is `true`, `null == undefined` is `true` but `null === undefined` is `false`).\n\nBest practice is to use `===` (and `!==`) by default to avoid the implicit coercion pitfalls, reserving `==` only for the rare deliberate case of treating `null` and `undefined` as equivalent.',
          codeContent:
            'console.log(1 == "1"); // true  (string coerced to number)\nconsole.log(1 === "1"); // false (different types)\n\nconsole.log(0 == false); // true  (boolean coerced to number)\nconsole.log(0 === false); // false\n\nconsole.log(null == undefined); // true\nconsole.log(null === undefined); // false\n\nconsole.log(NaN == NaN); // false (NaN is never equal to anything, including itself)',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "How does `this` binding work in JavaScript?",
      prompt:
        "Explain the four main ways `this` gets bound in JavaScript (default, implicit, explicit, `new`), and how arrow functions differ from regular functions with respect to `this`.",
      difficulty: "MEDIUM",
      tags: ["this", "functions", "scope"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "For a regular function, `this` isn't determined by where the function is defined — it's determined by **how the function is called**:\n\n- **Default binding**: a bare function call (`foo()`) sets `this` to the global object in non-strict mode, or `undefined` in strict mode.\n- **Implicit binding**: calling a function as a method of an object (`obj.foo()`) sets `this` to that object.\n- **Explicit binding**: `call`, `apply`, or `bind` let you set `this` directly regardless of how the function is later invoked.\n- **`new` binding**: calling a function with `new` creates a fresh object, sets `this` to it, and (implicitly) returns it.\n\n**Arrow functions** don't have their own `this` at all — they don't participate in any of the above rules. Instead they lexically inherit `this` from the enclosing (non-arrow) scope at the time they're defined, exactly like a normal variable lookup, and that binding can't be changed later even with `call`/`apply`/`bind`. This makes arrow functions especially convenient for callbacks that need to preserve the surrounding `this`, such as inside class methods or event handlers.",
          codeContent:
            'const obj = {\n  name: "widget",\n  regularMethod() {\n    console.log(this.name); // "widget" — implicit binding\n\n    setTimeout(function () {\n      console.log(this.name); // undefined — `this` is not `obj` here\n    }, 0);\n\n    setTimeout(() => {\n      console.log(this.name); // "widget" — arrow function inherits `this`\n    }, 0);\n  },\n};\n\nobj.regularMethod();',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "How does prototypal inheritance work in JavaScript?",
      prompt:
        "Explain how prototypal inheritance works, including the prototype chain and how `Object.create` and `class extends` relate to it.",
      difficulty: "MEDIUM",
      tags: ["prototypes", "inheritance", "oop"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Every JavaScript object has an internal link (`[[Prototype]]`, exposed via `Object.getPrototypeOf()` or the legacy `__proto__`) to another object, its prototype. When you access a property on an object and it isn't found directly on that object, the engine walks up this chain of prototypes — checking the prototype, then the prototype's prototype, and so on — until it finds the property or reaches `null` at the top of the chain (`Object.prototype`'s prototype). This is the **prototype chain**, and it's the mechanism behind method inheritance: methods defined once on a shared prototype are available to every object that links to it, without being copied onto each instance.\n\n`Object.create(proto)` creates a new object with `proto` set directly as its prototype — the most explicit way to set up prototypal inheritance. `class` and `extends` are largely syntactic sugar over the same mechanism: a class's methods live on its `prototype` object, and `extends` sets up the prototype chain between the subclass's prototype and the superclass's prototype automatically, alongside `super()` handling constructor chaining.",
          codeContent:
            'const animal = {\n  speak() {\n    return `${this.name} makes a sound.`;\n  },\n};\n\nconst dog = Object.create(animal); // dog\'s prototype is `animal`\ndog.name = "Rex";\nconsole.log(dog.speak()); // "Rex makes a sound." (found via the prototype chain)\n\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound.`;\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    return `${this.name} barks.`;\n  }\n}\n\nconst rex = new Dog("Rex");\nconsole.log(rex.speak()); // "Rex barks."\nconsole.log(rex instanceof Animal); // true — via the prototype chain',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is the event loop, and what's the difference between microtasks and macrotasks?",
      prompt:
        "Explain how the JavaScript event loop works, and describe the difference between the microtask queue (e.g. Promises) and the macrotask/task queue (e.g. `setTimeout`). What order does this code log in?",
      difficulty: "MEDIUM",
      tags: ["event-loop", "async", "microtasks"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            'JavaScript runs on a single thread with a **call stack**, a **task (macrotask) queue**, and a **microtask queue**, coordinated by the **event loop**. The engine runs code on the call stack to completion; once the stack is empty, the event loop checks the microtask queue and drains it *completely* (running any microtasks that get queued during that drain too) before moving on. Only after the microtask queue is fully empty does the event loop pull a single task from the macrotask queue, run it, and repeat the whole cycle — draining microtasks again before the next macrotask.\n\n- **Microtasks**: Promise `.then`/`.catch`/`.finally` callbacks, `queueMicrotask`, `async`/`await` continuations.\n- **Macrotasks**: `setTimeout`, `setInterval`, I/O callbacks, UI rendering steps, `setImmediate` (Node).\n\nBecause the entire microtask queue is drained before any macrotask runs, promise callbacks always run before a `setTimeout(fn, 0)`, even though both were "scheduled" around the same time.',
          codeContent:
            'console.log("1: sync start");\n\nsetTimeout(() => console.log("2: setTimeout (macrotask)"), 0);\n\nPromise.resolve().then(() => console.log("3: promise (microtask)"));\n\nconsole.log("4: sync end");\n\n// Logs in order:\n// 1: sync start\n// 4: sync end\n// 3: promise (microtask)\n// 2: setTimeout (macrotask)',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "What is the difference between `null` and `undefined`?",
      prompt:
        "Explain the difference between `null` and `undefined` in JavaScript, including when each typically appears.",
      difficulty: "EASY",
      tags: ["basics", "types"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            '`undefined` means a variable has been declared but not yet assigned a value, or that something expected to produce a value doesn\'t have one — a missing function argument, a nonexistent object property, or a function with no explicit `return`, all default to `undefined`. It\'s the value JavaScript assigns automatically when no value has been provided.\n\n`null` is an explicit, intentional assignment representing "no value" or "empty" — a programmer sets a variable to `null` deliberately to signal the absence of an object/value, unlike `undefined` which usually happens implicitly. `typeof null` famously returns `"object"` (a long-standing quirk/bug in the language kept for backward compatibility), while `typeof undefined` returns `"undefined"`. They are loosely equal (`null == undefined`) but not strictly equal (`null === undefined` is `false`).',
        },
      ],
    },
    {
      title:
        "What are Promises and how do `.then`, `.catch`, and `.finally` work?",
      prompt:
        "Explain what a Promise is, its three states, and how chaining `.then()` calls works. Write a short example.",
      difficulty: "EASY",
      tags: ["promises", "async"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "A Promise represents the eventual result (or failure) of an asynchronous operation. It exists in one of three states: **pending** (not yet resolved or rejected), **fulfilled** (completed successfully, with a value), or **rejected** (failed, with a reason/error) — once fulfilled or rejected, a promise is *settled* and can never change state again.\n\n`.then(onFulfilled, onRejected)` registers callbacks for the fulfilled/rejected cases and returns a **new** Promise, which lets you chain further `.then()` calls — each one receives the previous handler's return value (or, if that handler returned a promise, waits for it to settle first). `.catch(onRejected)` is shorthand for `.then(undefined, onRejected)`, and it also catches errors thrown anywhere earlier in the chain, not just from the immediately preceding step. `.finally(callback)` runs regardless of whether the promise fulfilled or rejected, useful for cleanup, and passes the original result/error through unchanged.",
          codeContent:
            'function fetchData(shouldFail) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (shouldFail) {\n        reject(new Error("Failed to fetch"));\n      } else {\n        resolve({ id: 1, name: "Widget" });\n      }\n    }, 100);\n  });\n}\n\nfetchData(false)\n  .then((data) => {\n    console.log("Got data:", data);\n    return data.id;\n  })\n  .then((id) => console.log("ID was:", id))\n  .catch((err) => console.error("Error:", err.message))\n  .finally(() => console.log("Done"));',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "What is the difference between `async`/`await` and raw Promises?",
      prompt:
        "Explain how `async`/`await` relates to Promises under the hood, and rewrite a `.then()` chain using `async`/`await`, including error handling.",
      difficulty: "MEDIUM",
      tags: ["async-await", "promises"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "`async`/`await` is syntactic sugar over Promises, not a different concurrency model — an `async` function always returns a Promise, and `await` pauses execution *within that function* (without blocking the rest of the program) until the awaited Promise settles, then either returns its resolved value or throws its rejection as a catchable exception. Under the hood, the engine transforms the `async` function into something equivalent to a chain of `.then()` calls.\n\nThe main practical benefits are readability (asynchronous code reads top-to-bottom like synchronous code) and the ability to use ordinary `try`/`catch` for error handling instead of `.catch()` chains, which especially helps when mixing async logic with loops or conditionals that are awkward to express with chained `.then()`.",
          codeContent:
            '// Promise chain\nfunction loadUserThen(id) {\n  return fetchUser(id)\n    .then((user) => fetchPosts(user.id))\n    .then((posts) => posts.length)\n    .catch((err) => {\n      console.error("Failed:", err);\n      throw err;\n    });\n}\n\n// Equivalent async/await\nasync function loadUserAwait(id) {\n  try {\n    const user = await fetchUser(id);\n    const posts = await fetchPosts(user.id);\n    return posts.length;\n  } catch (err) {\n    console.error("Failed:", err);\n    throw err;\n  }\n}',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is the difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`?",
      prompt:
        "Compare `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any` — what does each return, and how does each handle rejections?",
      difficulty: "MEDIUM",
      tags: ["promises", "async"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            '- **`Promise.all(promises)`**: resolves when *all* input promises fulfill, with an array of their values in order. If *any* promise rejects, it immediately rejects with that first rejection reason — it\'s "fail fast."\n- **`Promise.allSettled(promises)`**: always waits for *every* promise to settle (fulfilled or rejected) and resolves with an array of result objects (`{ status: "fulfilled", value }` or `{ status: "rejected", reason }`) — it never rejects itself, making it useful when you want the outcome of every operation regardless of individual failures.\n- **`Promise.race(promises)`**: settles as soon as the *first* promise settles, whether it fulfills or rejects — you get that single result/error, and the rest are ignored (though they still run to completion in the background).\n- **`Promise.any(promises)`**: resolves as soon as the *first* promise fulfills, ignoring rejections along the way. It only rejects if *all* promises reject, in which case it rejects with an `AggregateError` containing all the individual rejection reasons.',
        },
      ],
    },
    {
      title: "What are optional chaining and nullish coalescing?",
      prompt:
        "Explain the `?.` (optional chaining) and `??` (nullish coalescing) operators, and how `??` differs from `||` for default values.",
      difficulty: "EASY",
      tags: ["es6", "syntax", "operators"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            '**Optional chaining (`?.`)** short-circuits a property access, method call, or array index to `undefined` instead of throwing, if the value immediately before the `?.` is `null` or `undefined`. It lets you safely read deeply nested properties without a chain of manual `&&` checks.\n\n**Nullish coalescing (`??`)** returns its right-hand operand only when the left-hand operand is specifically `null` or `undefined` — unlike `||`, which falls through for *any* falsy value (`0`, `""`, `false`, `NaN` included). This matters whenever a legitimate falsy value (like `0` or an empty string) should be treated as valid and not replaced by the default.',
          codeContent:
            'const user = { profile: { address: null } };\n\nconsole.log(user.profile?.address?.city); // undefined, no error\nconsole.log(user.profile?.age?.toFixed?.()); // undefined, method call is also optional\n\nfunction getQuantity(options) {\n  return options.quantity ?? 10; // default only if quantity is null/undefined\n}\n\nconsole.log(getQuantity({ quantity: 0 })); // 0 — correctly preserved\nconsole.log(getQuantity({ quantity: 0 } ).toString() === "0" ? getQuantity({}) : null);\n\n// Contrast with ||\nfunction getQuantityWrong(options) {\n  return options.quantity || 10; // BUG: 0 is falsy, so this returns 10 instead of 0\n}',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "How does destructuring work with default values and renaming?",
      prompt:
        "Show how to use object and array destructuring with default values, renaming, and nested patterns, in a single example.",
      difficulty: "EASY",
      tags: ["destructuring", "es6"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'const response = {\n  data: { userId: 42, displayName: "Alex" },\n  meta: { page: 1 },\n};\n\nconst {\n  data: { userId, displayName: name = "Anonymous" }, // nested + rename + default\n  meta: { page = 1, pageSize = 20 } = {}, // default for the whole `meta` object\n} = response;\n\nconsole.log(userId, name, page, pageSize); // 42 "Alex" 1 20\n\n// Array destructuring with defaults and skipping\nconst coordinates = [10];\nconst [x, y = 0, z = 0] = coordinates;\nconsole.log(x, y, z); // 10 0 0\n\nconst [, second, ...rest] = [1, 2, 3, 4];\nconsole.log(second, rest); // 2 [3, 4]',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "What is the difference between spread and rest syntax?",
      prompt:
        "Explain the difference between the spread operator and rest parameters, even though both use `...`. Give one example of each.",
      difficulty: "EASY",
      tags: ["spread-rest", "es6"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Both use the `...` syntax but do opposite things depending on context:\n\n- **Spread** expands an iterable (array, string, Set, etc.) or an object's own enumerable properties into individual elements — used in array/object literals, and in function calls to spread arguments.\n- **Rest** does the reverse: it collects multiple individual elements/arguments into a single array — used in destructuring patterns and function parameter lists to gather the remaining items.",
          codeContent:
            "// Spread: expand into individual elements\nconst nums = [1, 2, 3];\nconst combined = [...nums, 4, 5]; // [1, 2, 3, 4, 5]\n\nconst base = { a: 1, b: 2 };\nconst extended = { ...base, c: 3 }; // { a: 1, b: 2, c: 3 }\n\nMath.max(...nums); // spreads array into individual arguments\n\n// Rest: collect into an array\nfunction sum(...args) {\n  return args.reduce((total, n) => total + n, 0);\n}\nsum(1, 2, 3); // 6\n\nconst [first, ...others] = [1, 2, 3];\nconsole.log(first, others); // 1 [2, 3]",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is the difference between `Object.freeze`, shallow copy, and deep copy?",
      prompt:
        "Explain what `Object.freeze` actually prevents, and the difference between a shallow copy (e.g. spread or `Object.assign`) and a deep copy of an object.",
      difficulty: "MEDIUM",
      tags: ["objects", "immutability"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "`Object.freeze(obj)` prevents adding, removing, or reassigning `obj`'s own top-level properties (silently in non-strict mode, throwing in strict mode). It's a **shallow** freeze — any nested object referenced by one of `obj`'s properties is unaffected and remains fully mutable, since freezing only locks the immediate property bindings, not the objects they point to.\n\nA **shallow copy** (via `{ ...obj }`, `Object.assign({}, obj)`, or `Array.prototype.slice`) creates a new top-level object/array, but any nested objects/arrays are still shared references with the original — mutating a nested property on the copy also mutates the original.\n\nA **deep copy** recursively clones every nested level so the copy shares no object references with the original at any depth. Common ways to deep-copy include `structuredClone(obj)` (built into modern JS runtimes and generally preferred), `JSON.parse(JSON.stringify(obj))` (simple but loses functions, `undefined`, `Date` objects become strings, and breaks on circular references), or a hand-written recursive clone function.",
        },
      ],
    },
    {
      title:
        "What are the different ways to iterate over an array, and how do they differ?",
      prompt:
        "Compare `for`, `for...of`, `forEach`, `map`, and `for...in` for iterating collections in JavaScript, noting pitfalls of each.",
      difficulty: "EASY",
      tags: ["arrays", "iteration"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "- **`for` (classic index loop)**: full control over indices, supports `break`/`continue`, works on array-likes, but verbose.\n- **`for...of`**: iterates over the *values* of any iterable (arrays, strings, Maps, Sets, generators). Supports `break`/`continue`. This is the general-purpose modern choice for arrays.\n- **`forEach`**: an array method that calls a callback per element. Cannot be stopped early with `break` (returning from the callback just skips to the next iteration, it doesn't exit the loop), and doesn't support `await` pausing the outer function meaningfully since it doesn't wait for the callback's returned promise.\n- **`map`**: transforms each element and returns a **new array** of the same length — meant for producing a derived array, not for side effects alone.\n- **`for...in`**: iterates over **enumerable property keys** (as strings), including inherited enumerable properties from the prototype chain unless filtered with `hasOwnProperty`. It's meant for plain objects, not arrays — on arrays it iterates indices as strings (with the associated risk of picking up unexpected enumerable properties) and doesn't guarantee numeric order across all engines/edge cases, so `for...of` or array methods are strongly preferred for arrays.",
        },
      ],
    },
    {
      title: "Implement a `debounce` function",
      prompt:
        "Implement a `debounce(fn, delayMs)` function in JavaScript so that repeated rapid calls only invoke `fn` once, after `delayMs` has passed since the *last* call. Example: typing quickly in a search box should only fire one API call after the user stops typing.",
      difficulty: "MEDIUM",
      tags: ["coding-exercise", "closures", "timers"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function debounce(fn, delayMs) {\n  let timeoutId;\n\n  return function debounced(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => {\n      fn.apply(this, args);\n    }, delayMs);\n  };\n}\n\n// Usage\nconst logSearch = (query) => console.log("Searching for:", query);\nconst debouncedSearch = debounce(logSearch, 300);\n\ndebouncedSearch("a");\ndebouncedSearch("ap");\ndebouncedSearch("app"); // only this call actually fires logSearch, after 300ms of silence',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "Implement a `throttle` function",
      prompt:
        "Implement a `throttle(fn, intervalMs)` function so that `fn` executes at most once per `intervalMs`, no matter how frequently the throttled function is called. Explain how this differs from debounce.",
      difficulty: "MEDIUM",
      tags: ["coding-exercise", "closures", "timers"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            'Throttling guarantees a function runs at a regular maximum rate (e.g. "at most once every 300ms") regardless of how many times it\'s triggered, executing on a steady cadence during continuous activity. Debouncing instead waits for a pause in activity and only fires once *after* calls stop for a given duration — it can be delayed indefinitely by continuous triggering. Throttle suits things like scroll/resize handlers where you want periodic updates during continuous activity; debounce suits things like search-as-you-type where you only care about the final state.',
          codeContent:
            'function throttle(fn, intervalMs) {\n  let lastCallTime = 0;\n  let timeoutId = null;\n\n  return function throttled(...args) {\n    const now = Date.now();\n    const remaining = intervalMs - (now - lastCallTime);\n\n    if (remaining <= 0) {\n      lastCallTime = now;\n      fn.apply(this, args);\n    } else if (!timeoutId) {\n      timeoutId = setTimeout(() => {\n        lastCallTime = Date.now();\n        timeoutId = null;\n        fn.apply(this, args);\n      }, remaining);\n    }\n  };\n}\n\nconst logScroll = () => console.log("scroll position handled");\nconst throttledScroll = throttle(logScroll, 200);\nwindow.addEventListener("scroll", throttledScroll);',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "Implement a deep clone function",
      prompt:
        "Write a `deepClone(value)` function that recursively deep-clones plain objects and arrays (nested to any depth) without using `structuredClone` or `JSON.stringify`. Handle at least objects, arrays, and primitives.",
      difficulty: "MEDIUM",
      tags: ["coding-exercise", "recursion", "objects"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function deepClone(value, seen = new WeakMap()) {\n  // Primitives (including null) are returned as-is\n  if (value === null || typeof value !== "object") {\n    return value;\n  }\n\n  // Handle circular references\n  if (seen.has(value)) {\n    return seen.get(value);\n  }\n\n  if (value instanceof Date) {\n    return new Date(value.getTime());\n  }\n\n  if (Array.isArray(value)) {\n    const clonedArray = [];\n    seen.set(value, clonedArray);\n    for (const item of value) {\n      clonedArray.push(deepClone(item, seen));\n    }\n    return clonedArray;\n  }\n\n  const clonedObj = {};\n  seen.set(value, clonedObj);\n  for (const key of Object.keys(value)) {\n    clonedObj[key] = deepClone(value[key], seen);\n  }\n  return clonedObj;\n}\n\nconst original = { a: 1, nested: { b: [1, 2, { c: 3 }] } };\nconst clone = deepClone(original);\nclone.nested.b[2].c = 999;\nconsole.log(original.nested.b[2].c); // 3 (unaffected)',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "Implement a simple event emitter",
      prompt:
        "Implement an `EventEmitter` class in JavaScript with `on(event, listener)`, `off(event, listener)`, and `emit(event, ...args)` methods, supporting multiple listeners per event.",
      difficulty: "MEDIUM",
      tags: ["coding-exercise", "oop", "design-patterns"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'class EventEmitter {\n  constructor() {\n    this.listeners = new Map(); // event name -> array of listener fns\n  }\n\n  on(event, listener) {\n    if (!this.listeners.has(event)) {\n      this.listeners.set(event, []);\n    }\n    this.listeners.get(event).push(listener);\n    return this;\n  }\n\n  off(event, listener) {\n    const eventListeners = this.listeners.get(event);\n    if (!eventListeners) return this;\n    this.listeners.set(\n      event,\n      eventListeners.filter((l) => l !== listener)\n    );\n    return this;\n  }\n\n  emit(event, ...args) {\n    const eventListeners = this.listeners.get(event);\n    if (!eventListeners) return false;\n    // copy so listeners removing themselves mid-emit don\'t break iteration\n    [...eventListeners].forEach((listener) => listener(...args));\n    return true;\n  }\n\n  once(event, listener) {\n    const wrapper = (...args) => {\n      this.off(event, wrapper);\n      listener(...args);\n    };\n    return this.on(event, wrapper);\n  }\n}\n\nconst emitter = new EventEmitter();\nconst onData = (data) => console.log("received:", data);\nemitter.on("data", onData);\nemitter.emit("data", { id: 1 }); // "received: { id: 1 }"\nemitter.off("data", onData);\nemitter.emit("data", { id: 2 }); // nothing logged',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "Implement your own `Promise.all`",
      prompt:
        "Write a `myPromiseAll(promises)` function that replicates the behavior of `Promise.all` — it should resolve with an array of results in the original order once every promise resolves, or reject immediately with the first rejection.",
      difficulty: "HARD",
      tags: ["coding-exercise", "promises", "async"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            "function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    const results = new Array(promises.length);\n    let remaining = promises.length;\n\n    if (remaining === 0) {\n      resolve(results);\n      return;\n    }\n\n    promises.forEach((p, index) => {\n      Promise.resolve(p)\n        .then((value) => {\n          results[index] = value; // preserve original order\n          remaining -= 1;\n          if (remaining === 0) {\n            resolve(results);\n          }\n        })\n        .catch(reject); // fail fast on first rejection\n    });\n  });\n}\n\nconst p1 = new Promise((res) => setTimeout(() => res(1), 100));\nconst p2 = new Promise((res) => setTimeout(() => res(2), 50));\nconst p3 = Promise.resolve(3);\n\nmyPromiseAll([p1, p2, p3]).then((results) => console.log(results)); // [1, 2, 3]",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "Implement a `curry` function",
      prompt:
        "Write a generic `curry(fn)` function that transforms a function of arity N into a curried version that can be called either as `f(a)(b)(c)` or with any partial grouping of arguments like `f(a, b)(c)`, invoking the original once enough arguments have been supplied.",
      difficulty: "HARD",
      tags: ["coding-exercise", "closures", "functional-programming"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return (...moreArgs) => curried.apply(this, [...args, ...moreArgs]);\n  };\n}\n\nfunction add3(a, b, c) {\n  return a + b + c;\n}\n\nconst curriedAdd3 = curry(add3);\n\nconsole.log(curriedAdd3(1)(2)(3)); // 6\nconsole.log(curriedAdd3(1, 2)(3)); // 6\nconsole.log(curriedAdd3(1, 2, 3)); // 6\nconsole.log(curriedAdd3(1)(2, 3)); // 6",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "Implement a `memoize` function",
      prompt:
        "Write a `memoize(fn)` higher-order function that caches results of a pure function based on its arguments, so repeated calls with the same arguments return the cached result instead of recomputing.",
      difficulty: "MEDIUM",
      tags: ["coding-exercise", "closures", "performance"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            "function memoize(fn) {\n  const cache = new Map();\n\n  return function memoized(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\nfunction slowFib(n) {\n  if (n <= 1) return n;\n  return slowFib(n - 1) + slowFib(n - 2);\n}\n\nconst memoFib = memoize(slowFib);\nconsole.log(memoFib(30)); // computed\nconsole.log(memoFib(30)); // returned instantly from cache",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "What are the differences between `map`, `filter`, and `reduce`?",
      prompt:
        "Explain what `Array.prototype.map`, `filter`, and `reduce` each do, and show how `map` and `filter` could both be implemented in terms of `reduce`.",
      difficulty: "EASY",
      tags: ["arrays", "higher-order-functions"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "- **`map`** transforms every element and returns a new array of the *same length*, where each output element corresponds to one input element.\n- **`filter`** tests every element with a predicate and returns a new array containing only the elements that passed (`length <= original`).\n- **`reduce`** folds the entire array down to a single accumulated value (which could be a number, object, array, or anything), by repeatedly applying a reducer function that combines the running accumulator with each element. Because it's the most general of the three, both `map` and `filter` can be expressed in terms of `reduce`.",
          codeContent:
            "const nums = [1, 2, 3, 4, 5];\n\nconst doubled = nums.map((n) => n * 2); // [2, 4, 6, 8, 10]\nconst evens = nums.filter((n) => n % 2 === 0); // [2, 4]\nconst sum = nums.reduce((acc, n) => acc + n, 0); // 15\n\n// map implemented with reduce\nfunction mapViaReduce(arr, fn) {\n  return arr.reduce((acc, item) => {\n    acc.push(fn(item));\n    return acc;\n  }, []);\n}\n\n// filter implemented with reduce\nfunction filterViaReduce(arr, predicate) {\n  return arr.reduce((acc, item) => {\n    if (predicate(item)) acc.push(item);\n    return acc;\n  }, []);\n}",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "What is event delegation and why is it useful?",
      prompt:
        "Explain event delegation in the DOM, how it relies on event bubbling, and why it's more efficient than attaching a listener to every child element.",
      difficulty: "MEDIUM",
      tags: ["dom", "events", "performance"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Event delegation exploits **event bubbling**: when an event fires on a DOM element, it also fires (in the bubbling phase) on each of that element's ancestors, up to the document root, unless bubbling is stopped. Instead of attaching a separate listener to every individual child element, you attach a single listener to a common ancestor and inspect `event.target` (the actual element the event originated from) inside the handler to decide what to do.\n\nThis is more efficient for two reasons: far fewer listener objects need to be created and kept in memory (especially important for long lists), and it automatically handles elements added to the DOM *after* the listener was attached — since the listener lives on the stable parent, not on each dynamic child, there's no need to re-bind listeners whenever the list changes.",
          codeContent:
            '// Instead of adding a click listener to every <li>...\ndocument.getElementById("list").addEventListener("click", (event) => {\n  if (event.target.matches("li")) {\n    console.log("Clicked item:", event.target.textContent);\n  }\n});\n\n// Works even for <li> elements added to the list later,\n// because the listener lives on the stable parent <ul>.',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is the difference between shallow and deep equality when comparing objects?",
      prompt:
        "Why does `{ a: 1 } === { a: 1 }` return `false` in JavaScript? Explain reference vs value equality for objects, and write a simple `shallowEqual` function.",
      difficulty: "EASY",
      tags: ["equality", "objects"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Objects (including arrays and functions) are compared by **reference**, not by structural value, in JavaScript. `{ a: 1 } === { a: 1 }` is `false` because each object literal creates a distinct object in memory — even though their contents look identical, `===` checks whether both operands point to the *exact same* object, and they don't. Two variables are only `===` equal if they reference the same underlying object.\n\nA **shallow equal** check compares an object's top-level keys/values pairwise (using `===` for each value) without recursing into nested objects — this is what libraries like React use to decide if props/state \"changed\" cheaply.",
          codeContent:
            'function shallowEqual(objA, objB) {\n  if (objA === objB) return true;\n  if (typeof objA !== "object" || objA === null) return false;\n  if (typeof objB !== "object" || objB === null) return false;\n\n  const keysA = Object.keys(objA);\n  const keysB = Object.keys(objB);\n  if (keysA.length !== keysB.length) return false;\n\n  return keysA.every((key) => objA[key] === objB[key]);\n}\n\nshallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true\nshallowEqual({ a: 1 }, { a: 1, b: 2 }); // false\nshallowEqual({ a: { x: 1 } }, { a: { x: 1 } }); // false — nested objects are different references',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is currying and how does it differ from partial application?",
      prompt:
        "Explain the difference between currying and partial application in JavaScript, and give a short example of each.",
      difficulty: "MEDIUM",
      tags: ["functional-programming", "closures"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "**Currying** transforms a function that takes multiple arguments into a sequence of functions that each take exactly *one* argument, returning a new function until all arguments have been supplied, at which point the original function finally runs.\n\n**Partial application** is more general: it fixes some subset (any number) of a function's arguments up front, returning a new function that accepts the *remaining* arguments, however many there are, all at once rather than strictly one at a time. Currying is really a specific, disciplined form of partial application where each step supplies exactly one argument.",
          codeContent:
            "// Curried: exactly one argument per call\nconst curriedAdd = (a) => (b) => (c) => a + b + c;\ncurriedAdd(1)(2)(3); // 6\n\n// Partial application: fix some args, supply the rest together\nfunction partial(fn, ...fixedArgs) {\n  return (...remainingArgs) => fn(...fixedArgs, ...remainingArgs);\n}\n\nfunction add3(a, b, c) {\n  return a + b + c;\n}\n\nconst add1And2 = partial(add3, 1, 2);\nadd1And2(3); // 6 — remaining args supplied together, not one at a time",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "What are generator functions and how do they work?",
      prompt:
        "Explain how generator functions (`function*`) and `yield` work in JavaScript, and write a generator that produces an infinite sequence of Fibonacci numbers.",
      difficulty: "HARD",
      tags: ["generators", "iterators"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "A generator function (declared with `function*`) returns a special **iterator** object when called, rather than running its body immediately. Each call to the iterator's `.next()` method resumes execution from where it last left off, runs until the next `yield` expression, pauses there, and returns `{ value, done }` — `value` being the yielded expression's value and `done` indicating whether the generator has finished. This makes it possible to represent lazy, potentially infinite sequences, since values are only produced on demand rather than computed all at once. Generators are also iterable themselves (they implement `Symbol.iterator`), so they work directly with `for...of` and spread syntax.",
          codeContent:
            "function* fibonacci() {\n  let [a, b] = [0, 1];\n  while (true) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\n\nconst fib = fibonacci();\nconsole.log(fib.next().value); // 0\nconsole.log(fib.next().value); // 1\nconsole.log(fib.next().value); // 1\nconsole.log(fib.next().value); // 2\nconsole.log(fib.next().value); // 3\n\n// Take the first n values using for...of with a break\nfunction take(iterable, n) {\n  const result = [];\n  for (const value of iterable) {\n    if (result.length >= n) break;\n    result.push(value);\n  }\n  return result;\n}\n\nconsole.log(take(fibonacci(), 8)); // [0, 1, 1, 2, 3, 5, 8, 13]",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is the difference between synchronous and asynchronous JavaScript execution regarding blocking?",
      prompt:
        "JavaScript is single-threaded. Explain how it still handles asynchronous operations like network requests without blocking, and what happens if a synchronous operation takes a long time.",
      difficulty: "MEDIUM",
      tags: ["event-loop", "async", "concurrency"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "JavaScript itself runs on a single thread, so only one piece of JS code executes at any given instant — there's no true parallel execution of JS callbacks. Asynchronous operations like network requests, file I/O, or timers aren't actually performed by that single JS thread; they're delegated to the surrounding runtime environment (the browser's Web APIs, or Node's libuv thread pool/OS-level async I/O), which handles the waiting outside of JS entirely. When the operation completes, the environment queues the associated callback onto the task or microtask queue, and the event loop picks it up and runs it on the main thread only once the thread is free (call stack empty).\n\nBecause of this single-threaded model, a long-running **synchronous** operation (a tight CPU-bound loop, a huge JSON.parse, a blocking computation) fully occupies the one thread and blocks everything else — no other callbacks, timers, UI rendering/repaints, or user input handling can run until that synchronous code finishes. This is why CPU-intensive work is generally offloaded to Web Workers (browser) or worker threads/child processes (Node), which run on separate threads and communicate back via message passing.",
        },
      ],
    },
    {
      title: "What is the temporal dead zone?",
      prompt:
        "Explain the temporal dead zone (TDZ) for `let` and `const` declarations, and why it exists.",
      difficulty: "MEDIUM",
      tags: ["hoisting", "scope", "var-let-const"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "The temporal dead zone is the span of code between the start of a block scope and the actual line where a `let` or `const` variable is declared. The variable's name is technically hoisted (registered in the scope) but not initialized, and any attempt to read or write it during that span throws a `ReferenceError` instead of silently returning `undefined` (as `var` would).\n\nIt exists to catch a class of bugs where code accidentally relies on a variable before it's meaningfully assigned — with `var`, such a bug would silently produce `undefined` and fail later in a confusing way; with `let`/`const`, it fails loudly and immediately at the point of the mistake, which is far easier to debug.",
          codeContent:
            "console.log(typeof x); // \"undefined\" — var is hoisted and initialized\nvar x = 1;\n\ntry {\n  console.log(y); // ReferenceError: Cannot access 'y' before initialization\n} catch (err) {\n  console.log(err.message);\n}\nlet y = 2;",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "How do you flatten a nested array without using `Array.prototype.flat`?",
      prompt:
        "Write a function `flatten(arr)` that flattens an arbitrarily nested array into a single flat array, without using the built-in `.flat()` method.",
      difficulty: "MEDIUM",
      tags: ["coding-exercise", "recursion", "arrays"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            "function flatten(arr) {\n  const result = [];\n\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      result.push(...flatten(item));\n    } else {\n      result.push(item);\n    }\n  }\n\n  return result;\n}\n\nconsole.log(flatten([1, [2, 3], [4, [5, [6, 7]], 8]]));\n// [1, 2, 3, 4, 5, 6, 7, 8]\n\n// Iterative alternative using a stack\nfunction flattenIterative(arr) {\n  const stack = [...arr];\n  const result = [];\n\n  while (stack.length) {\n    const next = stack.shift();\n    if (Array.isArray(next)) {\n      stack.unshift(...next);\n    } else {\n      result.push(next);\n    }\n  }\n\n  return result;\n}",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "Implement a basic Promise from scratch",
      prompt:
        "Implement a simplified `MyPromise` class supporting `resolve`, `reject`, and a `.then(onFulfilled, onRejected)` method that returns a new chainable promise, following the pending/fulfilled/rejected state machine.",
      difficulty: "HARD",
      tags: ["coding-exercise", "promises", "async"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'class MyPromise {\n  constructor(executor) {\n    this.state = "pending";\n    this.value = undefined;\n    this.callbacks = [];\n\n    const resolve = (value) => {\n      if (this.state !== "pending") return;\n      this.state = "fulfilled";\n      this.value = value;\n      this.callbacks.forEach((cb) => cb.onFulfilled(value));\n    };\n\n    const reject = (reason) => {\n      if (this.state !== "pending") return;\n      this.state = "rejected";\n      this.value = reason;\n      this.callbacks.forEach((cb) => cb.onRejected(reason));\n    };\n\n    try {\n      executor(resolve, reject);\n    } catch (err) {\n      reject(err);\n    }\n  }\n\n  then(onFulfilled, onRejected) {\n    return new MyPromise((resolve, reject) => {\n      const handleFulfilled = (value) => {\n        try {\n          if (typeof onFulfilled === "function") {\n            resolve(onFulfilled(value));\n          } else {\n            resolve(value);\n          }\n        } catch (err) {\n          reject(err);\n        }\n      };\n\n      const handleRejected = (reason) => {\n        try {\n          if (typeof onRejected === "function") {\n            resolve(onRejected(reason));\n          } else {\n            reject(reason);\n          }\n        } catch (err) {\n          reject(err);\n        }\n      };\n\n      if (this.state === "fulfilled") {\n        queueMicrotask(() => handleFulfilled(this.value));\n      } else if (this.state === "rejected") {\n        queueMicrotask(() => handleRejected(this.value));\n      } else {\n        this.callbacks.push({ onFulfilled: handleFulfilled, onRejected: handleRejected });\n      }\n    });\n  }\n}\n\nnew MyPromise((resolve) => setTimeout(() => resolve(5), 50))\n  .then((v) => v * 2)\n  .then((v) => console.log(v)); // 10',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "How do ES modules differ from CommonJS modules?",
      prompt:
        "Compare ES modules (`import`/`export`) with CommonJS (`require`/`module.exports`) — consider static vs dynamic resolution, synchronous vs asynchronous loading, and `this` at the top level.",
      difficulty: "MEDIUM",
      tags: ["modules", "es6", "node"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "**CommonJS** (`require`/`module.exports`), Node's original module system, resolves and loads modules **synchronously** and dynamically at runtime — `require()` is a normal function call that can appear conditionally or anywhere in code, and each module gets a fresh `module.exports` object (a mutable, live reference you attach exports to).\n\n**ES modules** (`import`/`export`), the standardized JS module system, are **statically** analyzed — import/export declarations must appear at the top level (not inside conditionals or functions) so tooling can determine the module graph before running any code, which is what enables **tree-shaking** (removing unused exports at build time) and static analysis/autocomplete. ESM loading is asynchronous by specification (even though bundlers/Node can resolve local files quickly), which is why top-level `await` is possible in ESM but not CommonJS. ESM exports are **live bindings** — importing modules see updates to an exported variable's value over time — whereas CommonJS exports are effectively a snapshot copy of the values at the time of `require` (for primitive values) unless you're careful to mutate the exports object itself.\n\nNode.js supports both today, distinguishing them via the `.mjs`/`.cjs` extensions or the `\"type\"` field in `package.json`, with some interop rules for mixing the two.",
        },
      ],
    },
    {
      title: "What is the difference between `call`, `apply`, and `bind`?",
      prompt:
        "Explain the differences between `Function.prototype.call`, `apply`, and `bind`, and give an example of when you'd use `bind`.",
      difficulty: "EASY",
      tags: ["this", "functions"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "All three let you explicitly control what `this` refers to when a function runs:\n\n- **`call(thisArg, arg1, arg2, ...)`** invokes the function immediately, with `this` set to `thisArg` and the remaining arguments passed individually.\n- **`apply(thisArg, argsArray)`** does the same but takes the arguments as a single array (or array-like) instead of listed individually.\n- **`bind(thisArg, arg1, ...)`** does **not** invoke the function immediately — it returns a **new function** with `this` permanently bound to `thisArg` (and optionally some leading arguments pre-filled), which you call later.\n\n`bind` is commonly used to lock in `this` for a callback passed elsewhere (e.g. an event handler using a class method), so that when the callback is eventually invoked by someone else, it still refers to the intended object rather than whatever calls it.",
          codeContent:
            'function greet(greeting) {\n  return `${greeting}, ${this.name}`;\n}\n\nconst user = { name: "Alex" };\n\nconsole.log(greet.call(user, "Hello")); // "Hello, Alex"\nconsole.log(greet.apply(user, ["Hi"])); // "Hi, Alex"\n\nconst boundGreet = greet.bind(user);\nconsole.log(boundGreet("Hey")); // "Hey, Alex", `this` locked to `user`\n\nsetTimeout(boundGreet.bind(null, "Later"), 100); // still works even detached from `user` at call time',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What causes a memory leak in JavaScript, and how do closures contribute to one?",
      prompt:
        "Describe a few common causes of memory leaks in JavaScript applications, and explain how an unintentionally retained closure can prevent garbage collection.",
      difficulty: "HARD",
      tags: ["memory-management", "closures", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "JavaScript uses (mostly mark-and-sweep) garbage collection: an object is eligible for collection once nothing reachable from the program's roots still references it. A memory leak happens when references linger longer than intended, keeping otherwise-unused objects reachable forever. Common causes:\n\n- **Forgotten timers/intervals**: `setInterval` callbacks that reference large objects keep those objects alive as long as the interval runs, even if nothing else needs them; the interval must be explicitly `clearInterval`'d.\n- **Detached DOM references**: keeping a JS reference to a DOM node after it's removed from the document prevents that node (and everything it references) from being collected.\n- **Uncleared event listeners**: attaching listeners to long-lived objects (like `window`) without removing them when the associated component/data is done keeps that data's closure alive indefinitely.\n- **Growing caches/collections** with no eviction policy — e.g. a plain object or `Map` used as a cache that never removes old entries.\n\nClosures contribute to leaks specifically because a closure keeps its *entire* enclosing scope alive, not just the variables it actually uses — if a long-lived closure (e.g. an event handler that's never removed) closes over a scope that also happens to contain a reference to something large (even unintentionally, just by being declared in the same scope), that large object can't be collected for as long as the closure itself is reachable. The fix is generally to be deliberate about what scope a long-lived callback captures, and to explicitly clean up timers/listeners/subscriptions when they're no longer needed.",
        },
      ],
    },
    {
      title:
        "What is the difference between `Object.assign` and the spread operator for merging objects?",
      prompt:
        "Compare `Object.assign({}, a, b)` and `{ ...a, ...b }` for merging two objects. Do they behave differently in any case?",
      difficulty: "EASY",
      tags: ["objects", "es6"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "Functionally, `Object.assign({}, a, b)` and `{ ...a, ...b }` behave almost identically for plain object merging: both copy own enumerable properties from `a` and then `b` into a new object, with later sources overwriting earlier ones on key conflicts, and both are shallow (nested objects are still shared references, not cloned).\n\nThe differences are subtler: `Object.assign` *also* invokes setters on the target object if the target has any defined via `Object.defineProperty` (since it performs an actual assignment `target[key] = value`), whereas object spread creates properties directly without triggering existing setters, effectively defining new own properties. `Object.assign` also mutates and returns its first argument (`{}` here, so a new object either way, but if you called `Object.assign(a, b)` directly it would mutate `a` in place) whereas spread always creates a brand-new object and never mutates its sources. In everyday usage merging plain data objects, the two are interchangeable, and spread syntax has become the more idiomatic choice.",
        },
      ],
    },
    {
      title:
        "Implement an `Array.prototype.flat` polyfill supporting a depth argument",
      prompt:
        "Write a polyfill for `Array.prototype.flat(depth)` that flattens nested arrays up to the given depth (default 1), matching the native method's behavior.",
      difficulty: "HARD",
      tags: ["coding-exercise", "arrays", "recursion"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            "function myFlat(arr, depth = 1) {\n  if (depth < 1) {\n    return arr.slice();\n  }\n\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item)) {\n      acc.push(...myFlat(item, depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}\n\nconsole.log(myFlat([1, [2, [3, [4]]]])); // [1, 2, [3, [4]]] (default depth 1)\nconsole.log(myFlat([1, [2, [3, [4]]]], 2)); // [1, 2, 3, [4]]\nconsole.log(myFlat([1, [2, [3, [4]]]], Infinity)); // [1, 2, 3, 4]",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is the difference between synchronous exceptions and unhandled Promise rejections?",
      prompt:
        "Explain why wrapping an `async` function call in a `try`/`catch` doesn't catch a rejection if you forget to `await` it, and how to detect unhandled rejections globally.",
      difficulty: "HARD",
      tags: ["promises", "error-handling", "async"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            'A `try`/`catch` block only catches errors that are thrown synchronously *during that block\'s own execution*, or, for `async` functions, errors from promises you actually `await` inside the block (since `await` re-throws a rejection as a catchable synchronous-looking exception at that point). If you call an async function but don\'t `await` its returned promise (or otherwise attach a `.catch()`), the `try`/`catch` around the call has already finished executing by the time the promise rejects later — the rejection has nowhere to be caught synchronously, and becomes an **unhandled promise rejection**.\n\nTo catch these globally (as a last resort / logging safety net, not a substitute for proper handling), both browsers and Node expose an event: `window.addEventListener("unhandledrejection", handler)` in browsers, and `process.on("unhandledRejection", handler)` in Node.',
          codeContent:
            'async function risky() {\n  throw new Error("boom");\n}\n\nasync function caller() {\n  try {\n    risky(); // BUG: missing `await` — the rejection escapes this try/catch\n  } catch (err) {\n    console.log("caught:", err.message); // never runs\n  }\n}\ncaller(); // logs an unhandled rejection instead\n\n// Correct version\nasync function callerFixed() {\n  try {\n    await risky(); // now the rejection is caught here\n  } catch (err) {\n    console.log("caught:", err.message); // "caught: boom"\n  }\n}\ncallerFixed();\n\nprocess.on("unhandledRejection", (reason) => {\n  console.error("Unhandled rejection:", reason);\n});',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "Implement a `pipe` function for composing multiple functions left-to-right",
      prompt:
        "Write a `pipe(...fns)` utility that composes an arbitrary number of unary functions, applying them left to right, so `pipe(f, g, h)(x)` is equivalent to `h(g(f(x)))`.",
      difficulty: "MEDIUM",
      tags: ["coding-exercise", "functional-programming"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            "function pipe(...fns) {\n  return function piped(initialValue) {\n    return fns.reduce((value, fn) => fn(value), initialValue);\n  };\n}\n\nconst addOne = (n) => n + 1;\nconst double = (n) => n * 2;\nconst square = (n) => n * n;\n\nconst transform = pipe(addOne, double, square);\nconsole.log(transform(3)); // ((3 + 1) * 2) ^ 2 = 64",
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What are WeakMap and WeakSet, and why would you use them over Map and Set?",
      prompt:
        "Explain what makes `WeakMap` and `WeakSet` different from `Map` and `Set`, and describe a scenario where using a `WeakMap` avoids a memory leak.",
      difficulty: "HARD",
      tags: ["weakmap", "memory-management", "es6"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "`WeakMap` and `WeakSet` hold their object keys (WeakMap) or object members (WeakSet) **weakly** — meaning those references don't count toward keeping the referenced object reachable for garbage collection purposes. If nothing else in the program references an object used as a `WeakMap` key, the garbage collector is free to reclaim both that object and its associated entry, even though the `WeakMap` technically still \"contains\" it up until that point. Regular `Map`/`Set`, by contrast, hold **strong** references — an entry stays in the collection (and keeps its key/value objects alive) until you explicitly delete it, even if nothing else in the program still needs that object.\n\nBecause of this, `WeakMap`/`WeakSet` only accept objects (not primitives) as keys/members, and they're deliberately non-enumerable — you can't iterate, get the size, or list all keys, since the contents can silently change at any time as garbage collection runs.\n\nA classic use case: attaching metadata to an object (e.g. caching a computed value per DOM node, or storing private class fields in older engines) without preventing that object from being garbage collected once the rest of the application is done with it. If you used a regular `Map` for this, every object you'd ever associated data with would be kept alive forever just by being a key, which is a memory leak in any long-running application (like a DOM-node-to-data cache in a single-page app).",
        },
      ],
    },
    {
      title:
        "How does JavaScript's automatic type coercion work in arithmetic and string contexts?",
      prompt:
        'Explain the coercion rules for the `+` operator when operands are mixed types, and predict the output of a few tricky expressions like `1 + "2"`, `"5" - 2`, and `[] + []`.',
      difficulty: "MEDIUM",
      tags: ["type-coercion", "operators"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            '`+` is overloaded for both numeric addition and string concatenation, so its coercion behavior depends on the operand types: if **either** operand is (or converts to) a string, `+` performs string concatenation, converting the other operand to a string first. For every other arithmetic operator (`-`, `*`, `/`), there\'s no string-concatenation meaning, so JavaScript always attempts to coerce both operands to numbers.\n\nObjects (including arrays) are first converted via their `[Symbol.toPrimitive]`/`valueOf`/`toString` methods before the above rules apply — arrays convert to a string via joining their elements with commas (an empty array becomes `""`).',
          codeContent:
            'console.log(1 + "2"); // "12" — number coerced to string, concatenation\nconsole.log("5" - 2); // 3 — no string meaning for `-`, both coerced to number\nconsole.log("5" + 2); // "52" — string concatenation\nconsole.log([] + []); // "" — both arrays convert to "", concatenated\nconsole.log([] + {}); // "[object Object]" — "" + "[object Object]"\nconsole.log(1 + true); // 2 — true coerced to 1\nconsole.log("3" * "2"); // 6 — both coerced to numbers, no string meaning for `*`',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title: "How would you implement a simple LRU cache in JavaScript?",
      prompt:
        "Implement an `LRUCache` class with a fixed capacity, supporting `get(key)` and `put(key, value)` in O(1) time, evicting the least recently used entry when the capacity is exceeded.",
      difficulty: "HARD",
      tags: ["coding-exercise", "data-structures", "algorithms"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    // Map preserves insertion order, which we use as recency order\n    this.cache = new Map();\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) {\n      return -1;\n    }\n    const value = this.cache.get(key);\n    // Refresh recency: delete and re-insert so it becomes most-recent\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      // Map iteration order is insertion order, so the first key is the LRU one\n      const leastRecentKey = this.cache.keys().next().value;\n      this.cache.delete(leastRecentKey);\n    }\n    this.cache.set(key, value);\n  }\n}\n\nconst lru = new LRUCache(2);\nlru.put(1, "a");\nlru.put(2, "b");\nconsole.log(lru.get(1)); // "a" (1 is now most recently used)\nlru.put(3, "c"); // evicts key 2 (least recently used)\nconsole.log(lru.get(2)); // -1 (evicted)\nconsole.log(lru.get(3)); // "c"',
          codeLanguage: "javascript",
        },
      ],
    },
    {
      title:
        "What is the difference between a shallow copy created by `Array.prototype.slice` and mutating methods like `splice`?",
      prompt:
        "Explain which common array methods mutate the original array in place versus which return a new array, and why this distinction matters for state management (e.g. in React/Redux).",
      difficulty: "MEDIUM",
      tags: ["arrays", "immutability"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "**Mutating methods** modify the array in place and typically return either the removed elements, the new length, or the array itself: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, and `copyWithin`.\n\n**Non-mutating methods** leave the original array untouched and return a new array (or value) derived from it: `slice`, `map`, `filter`, `reduce`, `concat`, `flat`, spread syntax (`[...arr]`), and the newer `toSorted`/`toReversed`/`toSpliced`/`with` (ES2023 immutable counterparts to the mutating versions).\n\nThis distinction matters a lot in state-management patterns (React, Redux, and generally anywhere state changes are expected to be detected by reference comparison) because updates are typically expected to produce a **new** array/object reference rather than mutating the existing one in place. If you call a mutating method directly on state, the reference stays the same even though the contents changed, so frameworks relying on `===` checks to detect changes (like React's shallow prop/state comparison, or Redux's reference-equality selectors) will fail to notice the update and skip re-rendering. The safe pattern is to always produce a new array/object via non-mutating operations (or `structuredClone`/spread) when updating managed state.",
        },
      ],
    },
    {
      title:
        "How would you detect and prevent a race condition in async JavaScript code?",
      prompt:
        "Describe a scenario where two async operations race and produce an inconsistent UI result (e.g. a search box firing overlapping API calls), and explain a technique to prevent the stale response from winning.",
      difficulty: "HARD",
      tags: ["async", "race-conditions", "promises"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            'A classic race condition: a user types quickly in a search box, firing an API request on every keystroke. Because network latency varies, the response for an earlier, now-stale query can arrive *after* the response for a later query, overwriting the UI with outdated results even though a newer, more relevant response already arrived first.\n\nCommon mitigation techniques:\n\n- **Request identity/versioning**: track a counter or token for the "latest" request; when a response arrives, only apply it to the UI if it still matches the latest request identifier, discarding stale ones.\n- **`AbortController`**: cancel the in-flight `fetch` request when a new one starts, so the stale request never resolves at all (and any `.then` handling is skipped via the resulting `AbortError`).\n- **Debouncing the trigger**: reduce how often requests fire in the first place (e.g. only search after the user pauses typing), which reduces but doesn\'t fully eliminate the possibility of overlap.\n\nIn practice, combining debounce (to reduce request volume) with request-versioning or `AbortController` (to guarantee correctness even if overlap still happens) is the most robust approach.',
          codeContent:
            'let latestRequestId = 0;\n\nasync function search(query) {\n  const requestId = ++latestRequestId;\n  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);\n  const results = await response.json();\n\n  if (requestId !== latestRequestId) {\n    // A newer search has started since this one was fired; discard this stale result\n    return;\n  }\n\n  renderResults(results);\n}\n\n// AbortController alternative\nlet controller = null;\n\nasync function searchWithAbort(query) {\n  if (controller) controller.abort(); // cancel any in-flight request\n  controller = new AbortController();\n\n  try {\n    const response = await fetch(`/api/search?q=${query}`, { signal: controller.signal });\n    const results = await response.json();\n    renderResults(results);\n  } catch (err) {\n    if (err.name !== "AbortError") throw err;\n  }\n}\n\nfunction renderResults(results) {\n  /* update UI */\n}',
          codeLanguage: "javascript",
        },
      ],
    },
  ],
};
