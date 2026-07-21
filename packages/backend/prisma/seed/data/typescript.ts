import type { CategorySeed } from "../types";

export const typescriptSeed: CategorySeed = {
  name: "TypeScript",
  slug: "typescript",
  description:
    "Type system, generics, and real-world TypeScript interview patterns.",
  icon: "typescript",
  questions: [
    {
      title:
        "What is the difference between `interface` and `type` in TypeScript?",
      prompt:
        "Explain the differences between interfaces and type aliases in TypeScript, and when you'd choose one over the other.",
      difficulty: "EASY",
      tags: ["types", "basics"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "Both `interface` and `type` can describe the shape of an object, and in most everyday cases they are interchangeable. The practical differences are:\n\n- **Declaration merging**: `interface` supports declaration merging — if you declare the same interface name twice, TypeScript merges the members. `type` aliases cannot be redeclared; doing so is a compile error.\n- **Extending**: Interfaces extend other interfaces (or types) with `extends`, which produces clearer error messages when the shapes conflict. Type aliases use intersections (`&`) to combine shapes, which can silently collapse to `never` on conflicting property types instead of erroring.\n- **What they can represent**: `type` can alias any type — unions, tuples, primitives, mapped types, conditional types — while `interface` is limited to object (and function/constructor) shapes.\n- **Mapped/conditional types**: Only `type` can be built from mapped types (`{ [K in Keys]: ... }`) or conditional types (`T extends U ? X : Y`).\n\nIn practice: use `interface` for public object/class shapes that might need to be extended or augmented (e.g. library definitions, React props), and use `type` for unions, tuples, function types, or when you need mapped/conditional type features. The TypeScript team's official recommendation is to use `interface` until you need a feature only `type` provides.",
        },
      ],
    },
    {
      title: "What is the difference between `unknown` and `any`?",
      prompt:
        "Compare the `unknown` and `any` types in TypeScript. Why is `unknown` generally considered safer, and how do you narrow a value typed as `unknown`?",
      difficulty: "EASY",
      tags: ["types", "type-safety"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "`any` opts a value out of type checking entirely — you can call methods on it, assign it to anything, and access arbitrary properties, all without the compiler complaining. This effectively disables type safety for that value and everything it flows into.\n\n`unknown` is the type-safe counterpart. A value typed `unknown` can hold anything, just like `any`, but the compiler will not let you operate on it (call it, index it, access properties) until you've narrowed it to a more specific type using `typeof`, `instanceof`, a custom type guard, or an assertion. This forces you to prove to the compiler what shape the value has before using it, which prevents a whole class of runtime errors that `any` would silently allow.\n\nA good rule of thumb: use `unknown` for values coming from outside your program's control (API responses, `JSON.parse`, `catch` clause errors) and narrow them before use; avoid `any` except as a deliberate, temporary escape hatch.",
          codeContent:
            "function processValue(value: unknown) {\n  // value.toUpperCase(); // Error: Object is of type 'unknown'\n\n  if (typeof value === \"string\") {\n    return value.toUpperCase(); // OK, narrowed to string\n  }\n\n  if (value instanceof Error) {\n    return value.message; // OK, narrowed to Error\n  }\n\n  return String(value);\n}\n\nfunction processAny(value: any) {\n  return value.toUpperCase(); // No compile error, but may throw at runtime\n}",
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "How do type guards and type narrowing work?",
      prompt:
        "Explain type narrowing in TypeScript and demonstrate at least two different ways to narrow a union type, including a user-defined type guard.",
      difficulty: "MEDIUM",
      tags: ["type-narrowing", "type-guards", "unions"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Type narrowing is the process by which TypeScript refines a broader type (usually a union) to a more specific one within a block of code, based on control-flow analysis. The compiler tracks checks like `typeof`, `instanceof`, `in`, equality comparisons, and array/`Array.isArray` checks, and narrows the type inside the branch where the check succeeds.\n\nWhen built-in checks aren't enough (e.g. narrowing a custom union of object shapes), you can write a **user-defined type guard**: a function whose return type is `arg is SomeType`. When such a function returns `true`, TypeScript narrows the argument to `SomeType` in the calling code's control flow.",
          codeContent:
            'type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; side: number };\n\n// Narrowing via discriminant property (`in` / literal comparison)\nfunction area(shape: Shape): number {\n  if (shape.kind === "circle") {\n    return Math.PI * shape.radius ** 2; // shape: { kind: "circle"; radius: number }\n  }\n  return shape.side ** 2; // shape: { kind: "square"; side: number }\n}\n\n// User-defined type guard\ninterface Cat {\n  meow(): void;\n}\ninterface Dog {\n  bark(): void;\n}\n\nfunction isCat(pet: Cat | Dog): pet is Cat {\n  return (pet as Cat).meow !== undefined;\n}\n\nfunction speak(pet: Cat | Dog) {\n  if (isCat(pet)) {\n    pet.meow();\n  } else {\n    pet.bark();\n  }\n}',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What are discriminated unions and why are they useful?",
      prompt:
        "Explain what a discriminated union is in TypeScript, and show how it makes handling a set of related but distinct shapes safer than using optional properties.",
      difficulty: "MEDIUM",
      tags: ["unions", "discriminated-unions", "type-narrowing"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "A discriminated union (also called a tagged union) is a union of object types that share a common literal-typed property — the *discriminant* or *tag* — whose value is unique to each member. Because each member's tag has a distinct literal type, TypeScript can narrow the union to the exact member just by checking that one property, typically in a `switch` or `if`.\n\nCompared to modeling the same data with a single type that has a bunch of optional properties, discriminated unions are safer because:\n\n- Each variant only carries the fields relevant to it — there's no risk of accessing a field that doesn't apply to the current variant.\n- The compiler can perform **exhaustiveness checking**: if you switch over the tag and assign the impossible case to a variable typed `never`, adding a new union member without handling it becomes a compile error.",
          codeContent:
            'type NetworkState =\n  | { status: "idle" }\n  | { status: "loading" }\n  | { status: "success"; data: string }\n  | { status: "error"; error: Error };\n\nfunction render(state: NetworkState): string {\n  switch (state.status) {\n    case "idle":\n      return "Waiting to start";\n    case "loading":\n      return "Loading...";\n    case "success":\n      return `Data: ${state.data}`;\n    case "error":\n      return `Error: ${state.error.message}`;\n    default: {\n      const exhaustiveCheck: never = state;\n      throw new Error(`Unhandled state: ${exhaustiveCheck}`);\n    }\n  }\n}',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What do the `Partial`, `Pick`, `Omit`, and `Record` utility types do?",
      prompt:
        "Describe what the `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, and `Record<K, V>` utility types do, and give a short example of each.",
      difficulty: "EASY",
      tags: ["utility-types", "generics"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "These are built-in generic utility types that transform other types:\n\n- **`Partial<T>`** makes every property of `T` optional. Useful for update/patch functions where only some fields change.\n- **`Pick<T, K>`** builds a new type containing only the properties in `K` (a union of keys of `T`).\n- **`Omit<T, K>`** builds a new type with all properties of `T` except those in `K`. It's effectively the inverse of `Pick`.\n- **`Record<K, V>`** builds an object type whose keys are `K` and whose values are all of type `V` — useful for dictionaries/maps and for ensuring an object has an entry for every value of a union/enum.",
          codeContent:
            'interface User {\n  id: string;\n  name: string;\n  email: string;\n  role: "admin" | "member";\n}\n\ntype UserUpdate = Partial<User>; // { id?: string; name?: string; email?: string; role?: ... }\n\ntype UserPreview = Pick<User, "id" | "name">; // { id: string; name: string }\n\ntype PublicUser = Omit<User, "email">; // User without the `email` field\n\ntype RolePermissions = Record<User["role"], string[]>;\n// { admin: string[]; member: string[] }\nconst permissions: RolePermissions = {\n  admin: ["read", "write", "delete"],\n  member: ["read"],\n};',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "How do generics work in TypeScript functions?",
      prompt:
        "Explain how generic type parameters work in TypeScript functions, why they're preferable to `any` for reusable utilities, and write a generic `firstElement` function.",
      difficulty: "EASY",
      tags: ["generics", "functions"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Generics let a function, interface, or class be written once and work correctly across many types while preserving the type relationship between inputs and outputs. Instead of hardcoding a specific type (or giving up type safety with `any`), you introduce a type parameter (conventionally `T`) that is inferred from the arguments at the call site, and the compiler substitutes it wherever it appears in the signature.\n\nThe key advantage over `any` is that generics keep the connection between input and output types: `any` erases that information (so the caller gets `any` back, losing all safety), whereas a generic function's return type is derived from the actual argument type passed in, so the caller still gets precise autocomplete and type checking.",
          codeContent:
            'function firstElement<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst num = firstElement([1, 2, 3]); // number | undefined\nconst str = firstElement(["a", "b"]); // string | undefined\n\n// Constrained generic: T must have a `length` property\nfunction logLength<T extends { length: number }>(value: T): T {\n  console.log(value.length);\n  return value;\n}\n\nlogLength("hello"); // OK, strings have length\nlogLength([1, 2, 3]); // OK, arrays have length\n// logLength(42); // Error: number has no `length`',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What is structural typing and how does it differ from nominal typing?",
      prompt:
        "TypeScript is described as a structurally typed language. Explain what that means, contrast it with nominal typing, and give an example where it produces a surprising result.",
      difficulty: "MEDIUM",
      tags: ["type-system", "structural-typing"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "In a **structurally typed** system, two types are considered compatible if their members (shape) match, regardless of the type's name or where it was declared. TypeScript checks compatibility by comparing shapes, not identities. This is sometimes called \"duck typing\" at compile time: if it has the properties a type requires, it's assignable to that type.\n\nThis contrasts with **nominal typing** (used by languages like Java or C#), where two types are only compatible if one explicitly declares that it implements or extends the other — matching structure alone isn't enough.\n\nA common surprise: two unrelated interfaces with identical shapes are freely interchangeable, and a type with *extra* properties is still assignable to a type expecting fewer properties (as long as it has at least the required ones), because structurally it's a superset.",
          codeContent:
            "interface Point2D {\n  x: number;\n  y: number;\n}\n\ninterface Vector2D {\n  x: number;\n  y: number;\n}\n\nfunction printPoint(p: Point2D) {\n  console.log(`${p.x}, ${p.y}`);\n}\n\nconst v: Vector2D = { x: 1, y: 2 };\nprintPoint(v); // OK — Vector2D has the same shape as Point2D, no relation needed\n\nconst point3D = { x: 1, y: 2, z: 3 };\nprintPoint(point3D); // OK — extra `z` is fine for a direct variable (not object literal)",
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What does TypeScript's `strict` compiler flag actually enable?",
      prompt:
        "The `strict` flag in tsconfig.json is commonly recommended. What does it actually turn on, and name a few of the individual flags it bundles.",
      difficulty: "MEDIUM",
      tags: ["tsconfig", "compiler", "strict-mode"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "`strict: true` in `tsconfig.json` is a shorthand that enables a whole family of stricter type-checking flags at once, rather than a single behavior. It's the recommended baseline for new projects because each individual flag catches a category of bugs that looser settings let slip through.\n\nFlags bundled under `strict` include:\n\n- **`noImplicitAny`** — disallows variables/parameters whose type would otherwise implicitly fall back to `any`, forcing explicit typing.\n- **`strictNullChecks`** — `null` and `undefined` are no longer assignable to every type; they must be explicitly included in a type's union, which eliminates a huge class of \"cannot read property of undefined\" bugs.\n- **`strictFunctionTypes`** — checks function parameter types contravariantly, catching unsound function assignments.\n- **`strictBindCallApply`** — checks the arguments to `.bind()`, `.call()`, and `.apply()` against the function's actual signature.\n- **`strictPropertyInitialization`** — class properties must be initialized in the constructor (or explicitly marked optional/definite-assignment), preventing use of uninitialized fields.\n- **`noImplicitThis`** — flags `this` when its type can't be inferred.\n- **`alwaysStrict`** — emits `\"use strict\"` and parses files in ECMAScript strict mode.\n- **`useUnknownInCatchVariables`** — types `catch` clause variables as `unknown` instead of `any`.\n\nYou can enable `strict` and then selectively disable individual sub-flags if needed, but most teams keep the full set on for maximum safety.",
        },
      ],
    },
    {
      title: "What are mapped types and how do you build one?",
      prompt:
        "Explain mapped types in TypeScript and write a mapped type `Nullable<T>` that makes every property of `T` accept `null` in addition to its original type.",
      difficulty: "MEDIUM",
      tags: ["mapped-types", "advanced-types"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "A mapped type produces a new object type by iterating over the keys of an existing type (or a union of string/number/symbol literals) and applying a transformation to each property. The syntax `{ [K in Keys]: SomeTransform<K> }` is the mapped-type equivalent of a `for...in` loop, but at the type level. Built-in utility types like `Partial`, `Required`, and `Readonly` are all implemented as mapped types under the hood.\n\nModifiers `readonly` and `?` can be added or removed (`-readonly`, `-?`) while mapping, and `as` clauses (key remapping) let you rename or filter keys during the mapping.",
          codeContent:
            "type Nullable<T> = {\n  [K in keyof T]: T[K] | null;\n};\n\ninterface User {\n  id: string;\n  age: number;\n}\n\ntype NullableUser = Nullable<User>;\n// { id: string | null; age: number | null }\n\n// Bonus: reimplementing Readonly and Partial as mapped types\ntype MyReadonly<T> = { readonly [K in keyof T]: T[K] };\ntype MyPartial<T> = { [K in keyof T]?: T[K] };\n\n// Key remapping with `as`\ntype Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\ntype UserGetters = Getters<User>;\n// { getId: () => string; getAge: () => number }",
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What are conditional types and the `infer` keyword?",
      prompt:
        "Explain conditional types in TypeScript, and describe what `infer` does. Write a type `UnwrapPromise<T>` that extracts the resolved type from a `Promise<T>`, and leaves other types unchanged.",
      difficulty: "HARD",
      tags: ["conditional-types", "infer", "advanced-types"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "A conditional type has the form `T extends U ? X : Y` — it picks `X` or `Y` depending on whether `T` is assignable to `U`, evaluated at the type level. This lets you build types that branch based on the shape of another type, similar to a ternary but for types.\n\n`infer` can only be used inside the `extends` clause of a conditional type. It introduces a new type variable that TypeScript will attempt to infer from the structure being matched, letting you \"pull out\" a piece of a complex type (like a function's return type, an array's element type, or — as below — a Promise's resolved type) without knowing it in advance.\n\nWhen a conditional type's checked type is a naked union type parameter, the conditional distributes over each member of the union — this is called a distributive conditional type.",
          codeContent:
            'type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;\n\ntype A = UnwrapPromise<Promise<string>>; // string\ntype B = UnwrapPromise<number>; // number (unchanged)\n\n// Built-in examples that work the same way\ntype ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;\nfunction greet() {\n  return "hi";\n}\ntype Greeting = ReturnOf<typeof greet>; // string\n\n// Distributive conditional type example\ntype ToArray<T> = T extends any ? T[] : never;\ntype Result = ToArray<string | number>; // string[] | number[]',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What are template literal types used for?",
      prompt:
        'Explain template literal types in TypeScript and show how you\'d use one to type CSS-like properties such as `"10px"` or `"50%"`, or to derive event handler names from a set of event names.',
      difficulty: "HARD",
      tags: ["template-literal-types", "advanced-types"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Template literal types let you build new string literal types by interpolating other types (usually unions of string/number literals) inside a template-literal-like syntax, e.g. `` `prefix-${T}` ``. When `T` is a union, the result is the union of every combination — TypeScript expands it exhaustively at the type level, similarly to how mapped types iterate over keys.\n\nThey're commonly combined with intrinsic string manipulation types (`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`) and with `infer` in conditional types to parse or validate string shapes at compile time.",
          codeContent:
            'type CSSUnit = "px" | "%" | "em" | "rem";\ntype CSSValue = `${number}${CSSUnit}`;\n\nconst width: CSSValue = "10px"; // OK\nconst height: CSSValue = "50%"; // OK\n// const bad: CSSValue = "large"; // Error\n\n// Deriving event handler prop names from event names\ntype EventName = "click" | "hover" | "focus";\ntype EventHandlerName = `on${Capitalize<EventName>}`;\n// "onClick" | "onHover" | "onFocus"\n\ntype Handlers = {\n  [K in EventHandlerName]: (event: Event) => void;\n};',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What is the difference between union and intersection types?",
      prompt:
        "Explain the difference between union types (`A | B`) and intersection types (`A & B`) in TypeScript, with an example of each.",
      difficulty: "EASY",
      tags: ["types", "unions", "intersections"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "A **union type** (`A | B`) describes a value that could be *either* `A` or `B`. You can only access members that are common to all members of the union unless you narrow it first — the value could be any one of the constituents.\n\nAn **intersection type** (`A & B`) describes a value that must satisfy *both* `A` and `B` simultaneously — it combines all members of both types into one. For object types, this means the resulting type has all properties from both.",
          codeContent:
            '// Union: value is one of these\ntype ID = string | number;\nconst id1: ID = "abc123";\nconst id2: ID = 42;\n\n// Intersection: value must satisfy both\ninterface Named {\n  name: string;\n}\ninterface Aged {\n  age: number;\n}\ntype Person = Named & Aged; // { name: string; age: number }\n\nconst person: Person = { name: "Alex", age: 30 };',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "How do TypeScript enums work, and how do they compare to union literal types?",
      prompt:
        "Explain how `enum` works in TypeScript (including numeric vs string enums), and discuss why many teams prefer union-of-string-literal types instead.",
      difficulty: "MEDIUM",
      tags: ["enums", "unions"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            'An `enum` declares a named set of constants. **Numeric enums** auto-increment from 0 by default and, unlike string enums, support *reverse mapping* (looking up the member name from its numeric value) because the compiler emits both directions into the generated object. **String enums** must have every member explicitly initialized with a string literal and don\'t get reverse mappings.\n\nEnums are not purely a type-level construct — they generate real runtime JavaScript objects, and by default that includes extra emitted code the bundler can\'t tree-shake as easily as a plain object.\n\nMany teams prefer a union of string literals (`type Status = "active" | "inactive"`) instead, because it:\n\n- Compiles away to nothing at runtime (purely a compile-time construct).\n- Is directly compatible with plain string values from JSON/APIs without a conversion step.\n- Avoids numeric-enum pitfalls like accidentally comparing to a raw number.\n\n`const enum` avoids the extra runtime object by inlining values at compile time, but it has compatibility issues with certain build tools (isolatedModules) and is generally discouraged for that reason.',
          codeContent:
            'enum Direction {\n  Up, // 0\n  Down, // 1\n  Left, // 2\n  Right, // 3\n}\n\nenum Status {\n  Active = "ACTIVE",\n  Inactive = "INACTIVE",\n}\n\n// Preferred lightweight alternative:\ntype StatusLiteral = "ACTIVE" | "INACTIVE";\n\nfunction setStatus(status: StatusLiteral) {\n  // no runtime object needed, just string comparisons\n}',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What is the `keyof` operator and how is it used with generics?",
      prompt:
        "Explain what `keyof` does in TypeScript, and write a generic `getProperty` function that safely accesses a property of an object by key, fully type-checked.",
      difficulty: "MEDIUM",
      tags: ["keyof", "generics"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            '`keyof` is a type operator that produces a union of the property-name literal types of a given object type. For example, `keyof { a: string; b: number }` is `"a" | "b"`. It\'s commonly combined with a generic constrained by `keyof` to write functions that access a property by a key that\'s guaranteed to actually exist on the object, and whose return type reflects the specific property\'s type.',
          codeContent:
            'function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { id: 1, name: "Alex", active: true };\n\nconst name = getProperty(user, "name"); // string\nconst active = getProperty(user, "active"); // boolean\n// getProperty(user, "email"); // Error: "email" is not a key of user',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What is the difference between `readonly` arrays/properties and `Object.freeze`?",
      prompt:
        "Compare TypeScript's `readonly` modifier (on properties and arrays) with JavaScript's `Object.freeze`. Does `readonly` provide any runtime guarantee?",
      difficulty: "MEDIUM",
      tags: ["readonly", "immutability"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "TypeScript's `readonly` is a **compile-time-only** construct. Marking a property `readonly`, or typing an array as `readonly T[]` / `ReadonlyArray<T>`, tells the compiler to reject any code that tries to reassign the property or call mutating array methods (`push`, `pop`, `splice`, etc.) on it. It has zero effect at runtime — once compiled to JavaScript, the `readonly` annotation is erased entirely, and nothing stops the object from being mutated through an untyped reference, `any` cast, or plain JS code.\n\n`Object.freeze` is the opposite: a **runtime** guarantee. It actually prevents (silently, in non-strict mode; via throwing, in strict mode) any additions, deletions, or reassignments to an object's own properties. It only performs a shallow freeze though — nested objects remain mutable unless frozen individually.\n\nFor genuine immutability you typically want both: `readonly` for compile-time safety and developer intent, and `Object.freeze` for a runtime guarantee — TypeScript's `Readonly<T>` utility type pairs naturally with `Object.freeze<T>()`, whose return type is `Readonly<T>`.",
        },
      ],
    },
    {
      title: "Implement a type-safe `pick` function",
      prompt:
        'Write a generic `pick` function in TypeScript that takes an object and an array of keys, and returns a new object containing only those keys — fully type-checked, with no `any`. Example: `pick({ a: 1, b: 2, c: 3 }, ["a", "c"])` returns `{ a: 1, c: 3 }` typed as `{ a: number; c: number }`.',
      difficulty: "MEDIUM",
      tags: ["generics", "utility-types", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function pick<T extends object, K extends keyof T>(\n  obj: T,\n  keys: K[]\n): Pick<T, K> {\n  const result = {} as Pick<T, K>;\n  for (const key of keys) {\n    if (key in obj) {\n      result[key] = obj[key];\n    }\n  }\n  return result;\n}\n\nconst source = { a: 1, b: 2, c: 3 };\nconst picked = pick(source, ["a", "c"]); // { a: number; c: number }\nconsole.log(picked); // { a: 1, c: 3 }',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "Implement a `DeepReadonly<T>` mapped type",
      prompt:
        "Write a recursive mapped type `DeepReadonly<T>` that makes every property of an object type readonly, including properties of nested objects.",
      difficulty: "HARD",
      tags: ["mapped-types", "recursive-types", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'type DeepReadonly<T> = T extends (infer U)[]\n  ? ReadonlyArray<DeepReadonly<U>>\n  : T extends object\n  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }\n  : T;\n\ninterface Config {\n  name: string;\n  server: {\n    host: string;\n    port: number;\n    tags: string[];\n  };\n}\n\ntype ReadonlyConfig = DeepReadonly<Config>;\n\nconst config: ReadonlyConfig = {\n  name: "api",\n  server: { host: "localhost", port: 8080, tags: ["prod"] },\n};\n\n// config.name = "other"; // Error\n// config.server.port = 9090; // Error\n// config.server.tags.push("x"); // Error',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "Write a generic `debounce` function with full type inference",
      prompt:
        "Implement a generic, type-safe `debounce<T extends (...args: any[]) => void>` higher-order function in TypeScript that preserves the parameter types of the wrapped function.",
      difficulty: "MEDIUM",
      tags: ["generics", "functions", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function debounce<T extends (...args: any[]) => void>(\n  fn: T,\n  delayMs: number\n): (...args: Parameters<T>) => void {\n  let timeoutId: ReturnType<typeof setTimeout> | undefined;\n\n  return (...args: Parameters<T>) => {\n    if (timeoutId !== undefined) {\n      clearTimeout(timeoutId);\n    }\n    timeoutId = setTimeout(() => {\n      fn(...args);\n    }, delayMs);\n  };\n}\n\nfunction search(query: string, limit: number) {\n  console.log(`Searching for "${query}" (limit ${limit})`);\n}\n\nconst debouncedSearch = debounce(search, 300);\ndebouncedSearch("typescript", 10); // args are type-checked against `search`',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "How does function overloading work in TypeScript?",
      prompt:
        "Explain how overload signatures work in TypeScript and write an overloaded `createElement` function that returns a different, specific type depending on the string literal argument passed in.",
      difficulty: "HARD",
      tags: ["function-overloads", "advanced-types"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "TypeScript allows you to declare multiple **overload signatures** for a function — each describing a specific combination of argument and return types — followed by a single **implementation signature** that must be general enough to cover every overload but is never visible to callers. When you call the function, the compiler picks the first overload signature that matches the given arguments and uses its return type; the implementation signature itself only governs the function body's internal type checking.\n\nThis is useful when a function's return type varies in a way that generics can't express cleanly — usually because it depends on a specific literal-value argument rather than on an input type.",
          codeContent:
            'function createElement(tag: "a"): HTMLAnchorElement;\nfunction createElement(tag: "img"): HTMLImageElement;\nfunction createElement(tag: "div"): HTMLDivElement;\nfunction createElement(tag: string): HTMLElement {\n  return document.createElement(tag);\n}\n\nconst link = createElement("a"); // HTMLAnchorElement\nconst img = createElement("img"); // HTMLImageElement\nconst generic = createElement("span"); // HTMLElement (falls through to string overload)',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What is type assertion (`as`) and how does it differ from type casting?",
      prompt:
        "Explain what the `as` type assertion does in TypeScript, why it's not a runtime conversion, and when it's appropriate to use versus a genuine runtime check.",
      difficulty: "EASY",
      tags: ["type-assertions", "type-safety"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "`as` (or the older `<T>value` syntax) tells the compiler \"trust me, treat this value as type `T`\" without performing any actual runtime conversion or check. It's purely a compile-time instruction that changes how subsequent code is type-checked — the underlying JavaScript value is completely unchanged. This differs from an actual cast/conversion (like `Number(value)` or `String(value)`), which does real work at runtime.\n\nBecause `as` bypasses the type checker's inference, it can be used to lie to the compiler and introduce runtime bugs if the asserted type doesn't match reality — TypeScript will only stop you if the assertion is between clearly unrelated types (in which case you'd need a double assertion through `as unknown as T`).\n\nAppropriate uses: narrowing a value you know more about than the compiler can infer (e.g. `document.getElementById(\"app\") as HTMLDivElement`), or working around limitations of the type checker. It's not appropriate as a substitute for actual validation of untrusted data (e.g. API responses) — for that, use a runtime check or a validation library (Zod, io-ts) instead.",
          codeContent:
            'const input = document.getElementById("email") as HTMLInputElement;\nconsole.log(input.value); // OK after assertion\n\n// Dangerous: no runtime guarantee this is actually true\nconst data = JSON.parse(\'{"a":1}\') as { a: number; b: string };\nconsole.log(data.b.toUpperCase()); // compiles fine, crashes at runtime (b is undefined)',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What are index signatures and when do you need them?",
      prompt:
        "Explain index signatures in TypeScript, and write a type for a dictionary of numeric scores keyed by arbitrary string usernames.",
      difficulty: "EASY",
      tags: ["index-signatures", "types"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "An index signature lets you type an object whose exact property names aren't known ahead of time, but whose value types follow a consistent pattern for any given key type (`string`, `number`, or `symbol`). It's written as `{ [key: string]: ValueType }` and tells the compiler that any property access with a key of that type returns `ValueType`.\n\nIndex signatures are the right tool for dictionary/map-like objects with dynamic keys; `Record<K, V>` is a shorthand utility type built on the same idea, and is generally preferred when `K` is a known finite union.",
          codeContent:
            'interface Scores {\n  [username: string]: number;\n}\n\nconst scores: Scores = {\n  alice: 95,\n  bob: 88,\n};\n\nscores.carol = 100; // OK\n// scores.dave = "A"; // Error: value must be a number',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What is the difference between `never` and `void`?",
      prompt:
        "Explain the difference between the `never` and `void` types in TypeScript, and give an example function signature for each.",
      difficulty: "MEDIUM",
      tags: ["types", "never", "void"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "`void` describes the return type of a function that doesn't return a meaningful value — it completes normally but the return value (typically `undefined`) shouldn't be used by the caller.\n\n`never` describes a function that **never returns at all**: it either always throws, always loops forever, or otherwise never reaches its end (e.g. `process.exit()`). `never` is also the type of a variable that has been narrowed down to have no possible remaining values — it's the \"empty set\" of types, and it's a subtype of every other type, which is what makes it useful for exhaustiveness checks in switch statements.",
          codeContent:
            "function log(message: string): void {\n  console.log(message);\n  // implicitly returns undefined\n}\n\nfunction fail(message: string): never {\n  throw new Error(message);\n}\n\nfunction infiniteLoop(): never {\n  while (true) {\n    // never returns\n  }\n}",
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "Implement a type-safe event emitter",
      prompt:
        "Design a generic `TypedEventEmitter<Events>` class in TypeScript where `Events` is a map of event names to listener argument tuples, so that `on`/`emit` calls are fully type-checked against the declared event map.",
      difficulty: "HARD",
      tags: ["generics", "coding-exercise", "advanced-types"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'type EventMap = Record<string, unknown[]>;\n\nclass TypedEventEmitter<Events extends EventMap> {\n  private listeners: {\n    [K in keyof Events]?: Array<(...args: Events[K]) => void>;\n  } = {};\n\n  on<K extends keyof Events>(\n    event: K,\n    listener: (...args: Events[K]) => void\n  ): void {\n    const existing = this.listeners[event] ?? [];\n    existing.push(listener);\n    this.listeners[event] = existing;\n  }\n\n  off<K extends keyof Events>(\n    event: K,\n    listener: (...args: Events[K]) => void\n  ): void {\n    const existing = this.listeners[event];\n    if (!existing) return;\n    this.listeners[event] = existing.filter((l) => l !== listener) as Events[K] extends unknown[]\n      ? Array<(...args: Events[K]) => void>\n      : never;\n  }\n\n  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {\n    const existing = this.listeners[event];\n    if (!existing) return;\n    for (const listener of existing) {\n      listener(...args);\n    }\n  }\n}\n\ninterface AppEvents {\n  login: [userId: string];\n  logout: [];\n  error: [error: Error, retryable: boolean];\n}\n\nconst emitter = new TypedEventEmitter<AppEvents>();\nemitter.on("login", (userId) => console.log(userId)); // userId: string\nemitter.emit("error", new Error("boom"), true); // fully type-checked',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What is the difference between `T[]` and `Array<T>`?",
      prompt:
        "Is there any functional difference between writing `T[]` versus `Array<T>` in TypeScript? When would you have to use one form over the other?",
      difficulty: "EASY",
      tags: ["types", "arrays", "syntax"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "No functional difference — `T[]` is simply shorthand syntax for the generic type `Array<T>`; they compile to identical type information and can be used interchangeably for simple element types.\n\nThe generic form `Array<T>` becomes necessary (or at least clearer) for more complex element types where the shorthand syntax gets ambiguous or awkward to read, for example a union type as the element: `(string | number)[]` needs the parentheses to avoid being misread, whereas `Array<string | number>` is unambiguous. For most codebases this is purely a style choice enforced by a linter rule (e.g. ESLint's `array-type`) rather than a technical requirement.",
        },
      ],
    },
    {
      title:
        "How do you type a React functional component's props with children?",
      prompt:
        "Show how to define a TypeScript `interface` for a React component's props that includes optional `children`, and explain why you generally shouldn't use `React.FC` anymore.",
      difficulty: "MEDIUM",
      tags: ["react", "types", "generics"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Component props are typically typed with a plain `interface` (or `type`), including `children` typed as `React.ReactNode` (the broadest type that covers strings, numbers, elements, fragments, arrays of nodes, `null`, and `undefined`) when the component can render arbitrary children.\n\nMany teams now avoid `React.FC` (and its alias `React.FunctionComponent`) because it used to implicitly add a `children` prop to every component, even ones that don't accept children, which was misleading in the type signature. It also makes generic components and default props awkward to express. Typing the props explicitly and just annotating the return value (or letting it be inferred) is more precise and is what most current React + TypeScript style guides recommend.",
          codeContent:
            "interface ButtonProps {\n  label: string;\n  onClick: () => void;\n  children?: React.ReactNode;\n}\n\nfunction Button({ label, onClick, children }: ButtonProps) {\n  return (\n    <button aria-label={label} onClick={onClick}>\n      {children}\n    </button>\n  );\n}",
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What is variance, and are TypeScript's function parameters bivariant or contravariant?",
      prompt:
        "Explain covariance and contravariance in the context of TypeScript function types, and describe how `strictFunctionTypes` changes parameter checking for methods vs standalone function types.",
      difficulty: "HARD",
      tags: ["type-system", "variance", "advanced-types"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            "Variance describes how subtyping between compound types (like function types, arrays, or generics) relates to subtyping between their component types.\n\n- **Covariant**: a compound type's subtyping goes in the *same* direction as its component's — e.g. return types are covariant, so a function returning `Dog` is assignable to a function-type expecting a return of `Animal`, because `Dog` is a subtype of `Animal`.\n- **Contravariant**: subtyping goes in the *opposite* direction — this is the theoretically sound rule for function parameters. A function that accepts `Animal` can safely stand in for a function-type expecting a parameter of `Dog`, because it can handle anything a `Dog`-accepting function could (and more), but not the reverse.\n- **Bivariant**: allowed in *either* direction, which is technically unsound but more convenient in practice.\n\nBy default (and specifically for **method syntax**, e.g. `interface X { method(arg: Dog): void }`), TypeScript checks parameters **bivariantly** for backward compatibility with common patterns and looser event-handler-style code. With `strictFunctionTypes` enabled, **standalone function type expressions** (e.g. `type Handler = (arg: Dog) => void`, or `const fn: (arg: Dog) => void`) are checked **contravariantly** instead, which is stricter and catches more unsound assignments — but method-shorthand signatures on interfaces/classes are deliberately left bivariant even under `strictFunctionTypes`, since that's a common enough safe-in-practice pattern that tightening it would break too much idiomatic code.",
        },
      ],
    },
    {
      title:
        "How does TypeScript infer types for `const` vs `let` declarations?",
      prompt:
        'Explain why `const x = "hello"` gets a narrower inferred type than `let x = "hello"` in TypeScript, and how `as const` extends this idea.',
      difficulty: "MEDIUM",
      tags: ["type-inference", "literal-types", "const-assertions"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            'For `const x = "hello"`, TypeScript infers the narrowest possible type — the literal type `"hello"` — because `x` can never be reassigned, so it\'s safe (and more precise) for the compiler to treat it as exactly that value. For `let x = "hello"`, TypeScript widens the inferred type to the general `string`, because `x` could later be reassigned to any other string, so pinning it to the literal `"hello"` would be overly restrictive and reject valid reassignments.\n\n`as const` extends this literal-narrowing behavior to more complex values: appending it to an object or array literal makes every property `readonly` and infers literal types (rather than widened types) for every value recursively, and infers array literals as fixed-length readonly tuples instead of general arrays. It\'s a common trick to get precise, immutable literal types out of a plain-looking value.',
          codeContent:
            'let a = "hello"; // type: string\nconst b = "hello"; // type: "hello"\n\nconst point = { x: 1, y: 2 };\n// type: { x: number; y: number }\n\nconst pointConst = { x: 1, y: 2 } as const;\n// type: { readonly x: 1; readonly y: 2 }\n\nconst tuple = [1, "a"] as const;\n// type: readonly [1, "a"] instead of (string | number)[]',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "Implement a type-safe `compose` function for unary functions",
      prompt:
        "Write a generic `compose(f, g)` function in TypeScript that composes two unary functions (`g` then `f`) so that the resulting function's parameter and return types are fully inferred and type-checked.",
      difficulty: "MEDIUM",
      tags: ["generics", "functions", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function compose<A, B, C>(\n  f: (arg: B) => C,\n  g: (arg: A) => B\n): (arg: A) => C {\n  return (arg: A) => f(g(arg));\n}\n\nconst toUpper = (s: string) => s.toUpperCase();\nconst exclaim = (s: string) => `${s}!`;\n\nconst shout = compose(exclaim, toUpper);\nconsole.log(shout("hello")); // "HELLO!"\n\nconst length = (s: string) => s.length;\nconst double = (n: number) => n * 2;\nconst doubledLength = compose(double, length); // (arg: string) => number\nconsole.log(doubledLength("abcd")); // 8',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What is a satisfies operator and how does it differ from a type annotation?",
      prompt:
        "Explain what the `satisfies` operator does in TypeScript, and why it can produce more precise inference than annotating a value's type directly.",
      difficulty: "HARD",
      tags: ["satisfies", "type-inference"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "`satisfies` (introduced in TypeScript 4.9) checks that a value conforms to a given type — just like a type annotation would — but *without* widening the value's inferred type to that annotation. With a normal annotation (`const x: T = value`), the variable's static type becomes exactly `T`, discarding any more specific information TypeScript could have inferred. With `value satisfies T`, TypeScript still validates the value against `T` (erroring on excess/incompatible properties) but keeps the narrower, more specific inferred type for the variable afterward.\n\nThis is especially useful for object literals where you want both validation against a broader shape and to retain literal/narrow types for downstream use, such as indexing with a specific known key or getting more precise autocomplete.",
          codeContent:
            'type Colors = Record<string, string | [number, number, number]>;\n\n// With a normal annotation, `palette.red` is typed `string | [number, number, number]`\nconst paletteAnnotated: Colors = {\n  red: "#ff0000",\n  green: [0, 255, 0],\n};\n// paletteAnnotated.red.toUpperCase(); // Error: might be a tuple\n\n// With `satisfies`, the literal shape is preserved\nconst palette = {\n  red: "#ff0000",\n  green: [0, 255, 0],\n} satisfies Colors;\n\npalette.red.toUpperCase(); // OK — inferred as string, not the union\npalette.green[1]; // OK — inferred as the tuple',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "How does declaration merging work for interfaces and namespaces?",
      prompt:
        "Explain TypeScript's declaration merging feature with interfaces. Give a practical example of when you'd rely on it, such as augmenting a third-party library's types.",
      difficulty: "HARD",
      tags: ["declaration-merging", "interfaces", "module-augmentation"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Declaration merging is a TypeScript feature where multiple declarations sharing the same name are combined by the compiler into a single definition, rather than the later one overwriting the earlier one (as would happen with `let`/`const`/`type`). It applies to `interface` declarations, `namespace` declarations, and combinations of a class/function/enum with a namespace of the same name.\n\nFor interfaces specifically, if you declare `interface Foo { a: string }` and later `interface Foo { b: number }` (even in different files), TypeScript merges them into a single `Foo` with both `a` and `b`.\n\nA very common real-world use is **module augmentation**: extending a third-party library's exported interface with extra fields your application adds, without modifying the library's source. For example, adding a custom `user` property to Express's `Request` type, or extending Node's `ProcessEnv` for typed environment variables.",
          codeContent:
            '// Augmenting Express\'s Request interface with a custom `user` field\ndeclare global {\n  namespace Express {\n    interface Request {\n      user?: { id: string; role: string };\n    }\n  }\n}\n\n// Augmenting Node\'s process.env typing\ndeclare global {\n  namespace NodeJS {\n    interface ProcessEnv {\n      DATABASE_URL: string;\n      NODE_ENV: "development" | "production" | "test";\n    }\n  }\n}\n\nexport {};',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "Implement a `once` higher-order function with correct typing",
      prompt:
        "Write a generic `once` function in TypeScript that wraps another function so it only actually executes on the first call, caching and returning that result on all subsequent calls, with the wrapped function's parameter and return types fully preserved.",
      difficulty: "MEDIUM",
      tags: ["generics", "closures", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function once<T extends (...args: any[]) => any>(fn: T): T {\n  let called = false;\n  let result: ReturnType<T>;\n\n  const wrapped = (...args: Parameters<T>): ReturnType<T> => {\n    if (!called) {\n      result = fn(...args);\n      called = true;\n    }\n    return result;\n  };\n\n  return wrapped as T;\n}\n\nlet initCount = 0;\nfunction initialize(config: string) {\n  initCount++;\n  console.log(`Initializing with ${config}`);\n  return { config, initCount };\n}\n\nconst initOnce = once(initialize);\ninitOnce("prod"); // runs, logs "Initializing with prod"\ninitOnce("dev"); // does NOT run again, returns cached result from first call',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What are abstract classes and how do they differ from interfaces?",
      prompt:
        "Explain abstract classes in TypeScript, how `abstract` methods work, and when you'd choose an abstract class over an interface.",
      difficulty: "MEDIUM",
      tags: ["classes", "abstract-classes", "oop"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "An `abstract class` is a class that cannot be instantiated directly (`new AbstractClass()` is a compile error) and is meant to be extended by concrete subclasses. It can declare `abstract` methods/properties — signatures with no implementation that subclasses are required to provide — alongside fully implemented, shared methods and constructor logic that concrete subclasses inherit for free.\n\nThe key difference from an `interface` is that an abstract class can carry actual implementation (shared behavior, state, constructor logic), while an interface is purely a shape with no runtime representation at all. A class can only `extend` one (abstract or concrete) class but can `implement` multiple interfaces.\n\nChoose an abstract class when subclasses need to share concrete implementation or state in addition to a contract; choose an interface when you only need to describe a shape/contract that multiple unrelated classes might satisfy.",
          codeContent:
            "abstract class Shape {\n  abstract area(): number; // must be implemented by subclasses\n\n  describe(): string {\n    // shared, concrete implementation\n    return `This shape has an area of ${this.area()}`;\n  }\n}\n\nclass Circle extends Shape {\n  constructor(private radius: number) {\n    super();\n  }\n  area(): number {\n    return Math.PI * this.radius ** 2;\n  }\n}\n\n// const s = new Shape(); // Error: cannot instantiate an abstract class\nconst c = new Circle(2);\nconsole.log(c.describe());",
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "How do you type a Promise-based function and chain async operations?",
      prompt:
        "Write a typed async function `fetchUser(id: string): Promise<User>` that fetches a user from an API and safely handles errors, and explain how TypeScript infers the resolved type through `await`.",
      difficulty: "EASY",
      tags: ["async-await", "promises", "types"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "An `async` function's declared or inferred return type is always wrapped in `Promise<T>`, where `T` is whatever the function body returns (TypeScript adds the wrapping automatically). When you `await` a `Promise<T>` inside another `async` function, the expression's type is unwrapped back to `T` — TypeScript tracks this unwrapping through arbitrary chains of `async`/`await`, including nested promises, which it flattens per the `Promise` spec (a `Promise<Promise<T>>` behaves as `Promise<T>`).",
          codeContent:
            'interface User {\n  id: string;\n  name: string;\n}\n\nasync function fetchUser(id: string): Promise<User> {\n  const response = await fetch(`/api/users/${id}`);\n  if (!response.ok) {\n    throw new Error(`Failed to fetch user ${id}: ${response.status}`);\n  }\n  const data: User = await response.json();\n  return data;\n}\n\nasync function main() {\n  try {\n    const user = await fetchUser("123"); // user: User\n    console.log(user.name);\n  } catch (err) {\n    console.error("Failed to load user", err);\n  }\n}',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What is the purpose of the `tsconfig.json` `paths` and `baseUrl` options?",
      prompt:
        "Explain what `baseUrl` and `paths` do in tsconfig.json, and note the important caveat that they only affect the type checker, not runtime module resolution.",
      difficulty: "MEDIUM",
      tags: ["tsconfig", "module-resolution"],
      answers: [
        {
          contentType: "TEXT",
          textContent:
            '`baseUrl` sets the root directory that non-relative module specifiers are resolved against, allowing imports like `import x from "utils/helpers"` instead of `"../../../utils/helpers"`. `paths` builds on `baseUrl` to define custom module-name aliases (mapping patterns like `"@app/*"` to `["src/app/*"]`), commonly used to create short, stable import paths that don\'t break when files move.\n\nThe important caveat is that `paths`/`baseUrl` only affect **TypeScript\'s type checker and IDE tooling** (module resolution during compilation and editor autocomplete) — they do **not** rewrite the import paths in the emitted JavaScript, and Node.js / most bundlers don\'t understand them natively. At runtime, those aliased imports will fail to resolve unless something else also maps them: a bundler alias config (webpack, Vite), a runtime resolver (`tsconfig-paths`), or a build step that rewrites the paths (e.g. via `tsc-alias`). This mismatch between compile-time and runtime resolution is a very common source of "works when I run tsc, breaks in production" bugs.',
        },
      ],
    },
    {
      title: "Implement `Promise.all` type inference for a tuple of promises",
      prompt:
        "Explain how `Promise.all` preserves the individual result types of a tuple of differently-typed promises, and show a short example demonstrating the inferred type of the result.",
      difficulty: "HARD",
      tags: ["promises", "generics", "tuples"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "TypeScript's built-in typings for `Promise.all` are overloaded/generic over a tuple type, using variadic tuple types so that when you pass a fixed-length array (tuple) literal of promises with different element types, the result type is a tuple where each position's type is the resolved type of the corresponding input promise, in order — rather than collapsing everything to a single union like `(A | B | C)[]`.\n\nThis relies on TypeScript inferring array literals passed directly to `Promise.all` as tuples rather than as a general array, which works automatically because the lib types constrain the parameter to a tuple-like generic.",
          codeContent:
            'async function loadDashboardData() {\n  const [user, posts, notificationCount] = await Promise.all([\n    fetchUser("1"), // Promise<User>\n    fetchPosts(), // Promise<Post[]>\n    fetchNotificationCount(), // Promise<number>\n  ]);\n\n  // user: User, posts: Post[], notificationCount: number\n  // (not a union of all three types)\n  return { user, posts, notificationCount };\n}\n\ndeclare function fetchUser(id: string): Promise<{ id: string; name: string }>;\ndeclare function fetchPosts(): Promise<{ id: string; title: string }[]>;\ndeclare function fetchNotificationCount(): Promise<number>;',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What does `noUncheckedIndexedAccess` do and why would you enable it?",
      prompt:
        "Explain the `noUncheckedIndexedAccess` tsconfig option and what class of bugs it helps prevent.",
      difficulty: "HARD",
      tags: ["tsconfig", "compiler", "type-safety"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "By default, indexing into an array or an object typed with an index signature (e.g. `arr[i]` or `record[key]`) returns the element type directly (`T`), even though at runtime the index might be out of bounds or the key might not exist, in which case you'd actually get `undefined`. This is a known unsoundness in TypeScript's default behavior — the type system assumes the access always succeeds.\n\n`noUncheckedIndexedAccess` closes that gap: with it enabled, indexed access expressions return `T | undefined` instead of just `T`, forcing you to handle the possibility of a missing value (via a narrowing check, a default, or a non-null assertion if you're confident it's safe) before using the result. It catches a real and common class of runtime bugs — reading past the end of an array, or looking up a key that doesn't exist in a dictionary — that the default settings (even with `strict` on) do not catch.",
          codeContent:
            '// Without noUncheckedIndexedAccess:\nfunction getFirst(arr: string[]): string {\n  return arr[0]; // typed as `string`, but could be `undefined` if arr is empty\n}\n\n// With noUncheckedIndexedAccess:\nfunction getFirstSafe(arr: string[]): string | undefined {\n  return arr[0]; // now correctly typed as `string | undefined`\n}\n\nfunction getFirstChecked(arr: string[]): string {\n  const first = arr[0];\n  if (first === undefined) {\n    throw new Error("Array is empty");\n  }\n  return first; // narrowed to string\n}',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "Write a type-safe `groupBy` utility function",
      prompt:
        "Implement a generic `groupBy` function in TypeScript that groups an array of items into a `Record` keyed by the result of a key-selector function. Example: grouping a list of users by their `role` field.",
      difficulty: "MEDIUM",
      tags: ["generics", "utility-types", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function groupBy<T, K extends string | number | symbol>(\n  items: T[],\n  keySelector: (item: T) => K\n): Record<K, T[]> {\n  const result = {} as Record<K, T[]>;\n\n  for (const item of items) {\n    const key = keySelector(item);\n    if (!result[key]) {\n      result[key] = [];\n    }\n    result[key].push(item);\n  }\n\n  return result;\n}\n\ninterface User {\n  name: string;\n  role: "admin" | "member";\n}\n\nconst users: User[] = [\n  { name: "Alex", role: "admin" },\n  { name: "Sam", role: "member" },\n  { name: "Jo", role: "member" },\n];\n\nconst byRole = groupBy(users, (u) => u.role);\n// { admin: [{ name: "Alex", ... }], member: [{ name: "Sam", ... }, { name: "Jo", ... }] }',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What is the difference between a generic constraint and a default type parameter?",
      prompt:
        "Explain the difference between constraining a generic type parameter with `extends` and giving it a default with `=`. Show both in a single generic function or type.",
      difficulty: "MEDIUM",
      tags: ["generics", "type-parameters"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "A **constraint** (`T extends SomeType`) restricts *which types are legal* for the type parameter — the compiler rejects any call/instantiation where the supplied type doesn't satisfy the constraint, and within the generic's body you can rely on the constrained members being present.\n\nA **default** (`T = SomeType`) doesn't restrict what's allowed — it only supplies a fallback type to use *when the caller doesn't explicitly specify or TypeScript can't infer* a type argument. Constraints and defaults are independent and commonly combined: the default must itself satisfy the constraint.",
          codeContent:
            'interface ApiResponse<T extends object = Record<string, unknown>> {\n  data: T;\n  status: number;\n}\n\n// Explicit type argument\nconst typed: ApiResponse<{ id: string }> = { data: { id: "1" }, status: 200 };\n\n// No type argument supplied — falls back to the default\nconst untyped: ApiResponse = { data: { anything: true }, status: 200 };\n\n// ApiResponse<string> // Error: string doesn\'t satisfy `extends object`',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "How does TypeScript handle excess property checks on object literals?",
      prompt:
        "Explain excess property checking in TypeScript — why does assigning an object literal with an extra property directly to a typed variable fail, while assigning the same shape via an intermediate variable succeeds?",
      difficulty: "MEDIUM",
      tags: ["structural-typing", "object-literals", "type-checking"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Structural typing normally allows a value with *extra* properties to be assigned wherever a type expecting *fewer* properties is required, since it's still a valid superset. However, TypeScript makes an exception for **object literals assigned or passed directly** (as opposed to through a variable): it performs *excess property checking*, flagging any property in the literal that doesn't exist on the target type as an error.\n\nThis exists because object literals are usually a one-time construction where a typo'd or unexpected property is almost always a genuine mistake (e.g. misspelling a config key), and the structural-typing escape hatch would otherwise silently swallow that mistake. Once the literal is assigned to an intermediately-typed (or untyped) variable first, TypeScript falls back to normal structural compatibility rules, and the excess property is no longer flagged, because now it's checking an actual value with a known, already-inferred type rather than a fresh literal.",
          codeContent:
            "interface Config {\n  host: string;\n  port: number;\n}\n\n// Error: Object literal may only specify known properties,\n// and 'timeout' does not exist in type 'Config'\nconst c1: Config = { host: \"localhost\", port: 80, timeout: 30 };\n\n// OK: no excess property check on an intermediate variable\nconst intermediate = { host: \"localhost\", port: 80, timeout: 30 };\nconst c2: Config = intermediate;",
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "Write a generic `memoize` function that caches based on argument identity",
      prompt:
        "Implement a type-safe `memoize` higher-order function in TypeScript for a single-argument pure function, caching results in a `Map` keyed by the argument, and preserving the original function's parameter and return types.",
      difficulty: "MEDIUM",
      tags: ["generics", "coding-exercise", "closures"],
      answers: [
        {
          contentType: "CODE",
          codeContent:
            'function memoize<Arg, Result>(\n  fn: (arg: Arg) => Result\n): (arg: Arg) => Result {\n  const cache = new Map<Arg, Result>();\n\n  return (arg: Arg): Result => {\n    if (cache.has(arg)) {\n      return cache.get(arg) as Result;\n    }\n    const result = fn(arg);\n    cache.set(arg, result);\n    return result;\n  };\n}\n\nfunction expensiveSquare(n: number): number {\n  console.log(`Computing square of ${n}`);\n  return n * n;\n}\n\nconst memoizedSquare = memoize(expensiveSquare);\nmemoizedSquare(4); // logs "Computing square of 4", returns 16\nmemoizedSquare(4); // no log, returns cached 16\nmemoizedSquare(5); // logs "Computing square of 5", returns 25',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "What are branded (nominal-like) types and why would you use them?",
      prompt:
        'TypeScript\'s type system is structural, but sometimes you want nominal-style type safety — e.g. to prevent mixing up a `UserId` and an `OrderId` that are both just strings. Explain the "branded type" pattern and show how to implement it.',
      difficulty: "HARD",
      tags: ["type-safety", "branded-types", "advanced-types"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "Because TypeScript is structurally typed, two type aliases for the same primitive (e.g. `type UserId = string` and `type OrderId = string`) are completely interchangeable — nothing stops you from accidentally passing an `OrderId` where a `UserId` is expected, since both are just `string` underneath. The **branded type** (or \"nominal typing\") pattern works around this by intersecting the base type with a unique, otherwise-unused marker property (often via a `unique symbol` or a literal tag). This marker doesn't exist at runtime — it's purely a compile-time-only phantom property — but it makes the two types structurally incompatible with each other, so the compiler now rejects mixing them up, while an actual `string` still needs to be explicitly cast/constructed into the branded type at the boundary (e.g. after validation).",
          codeContent:
            'type Brand<T, B extends string> = T & { readonly __brand: B };\n\ntype UserId = Brand<string, "UserId">;\ntype OrderId = Brand<string, "OrderId">;\n\nfunction createUserId(id: string): UserId {\n  return id as UserId;\n}\n\nfunction createOrderId(id: string): OrderId {\n  return id as OrderId;\n}\n\nfunction getUser(id: UserId) {\n  /* ... */\n}\n\nconst userId = createUserId("u_123");\nconst orderId = createOrderId("o_456");\n\ngetUser(userId); // OK\n// getUser(orderId); // Error: OrderId is not assignable to UserId\n// getUser("u_123"); // Error: plain string is not assignable to UserId',
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "How do you correctly type a React `useState` hook with a union of states?",
      prompt:
        'Show how to type a `useState` hook holding a discriminated union (e.g. `"idle" | "loading" | "success" | "error"` states with associated data), and explain why annotating the generic explicitly is sometimes necessary.',
      difficulty: "MEDIUM",
      tags: ["react", "generics", "type-inference"],
      answers: [
        {
          contentType: "BOTH",
          textContent:
            "`useState<T>(initialValue)` infers `T` from the initial value by default. That works fine for simple values, but if the state is a discriminated union of several possible shapes, TypeScript would infer the type from *just the initial value's shape*, not the full union you actually intend to allow. In that case you must explicitly supply the generic type argument so all the possible variants are considered legal, not just the initial one.",
          codeContent:
            'type FetchState<T> =\n  | { status: "idle" }\n  | { status: "loading" }\n  | { status: "success"; data: T }\n  | { status: "error"; error: string };\n\nfunction useUserData() {\n  // Without the explicit generic, TS would infer the type as just\n  // `{ status: "idle" }`, and setting any other variant would error.\n  const [state, setState] = React.useState<FetchState<{ id: string }>>({\n    status: "idle",\n  });\n\n  const load = async () => {\n    setState({ status: "loading" });\n    try {\n      const data = { id: "123" };\n      setState({ status: "success", data });\n    } catch (err) {\n      setState({ status: "error", error: String(err) });\n    }\n  };\n\n  return { state, load };\n}',
          codeLanguage: "typescript",
        },
      ],
    },
  ],
};
