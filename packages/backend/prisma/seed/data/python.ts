import type { CategorySeed } from "../types";

export const pythonSeed: CategorySeed = {
  name: "Python",
  slug: "python",
  description:
    "Core language, standard library, and common interview patterns in Python.",
  icon: "python",
  questions: [
    {
      title: "What is the difference between a list and a tuple?",
      prompt:
        "Explain the differences between Python lists and tuples, including mutability, performance, and typical use cases.",
      difficulty: "EASY",
      tags: ["data-structures", "basics"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Lists and tuples are both ordered, indexable sequences, but they differ in a few important ways:

- **Mutability**: Lists (\`[1, 2, 3]\`) are mutable — you can append, remove, or reassign elements after creation. Tuples (\`(1, 2, 3)\`) are immutable — once created, their contents cannot change.
- **Syntax**: Lists use square brackets, tuples use parentheses (though the parentheses are technically optional; it's the comma that makes a tuple).
- **Performance**: Because tuples are immutable, Python can make some optimizations — they generally have a smaller memory footprint and can be slightly faster to create and iterate over than lists. CPython also caches small tuples for reuse.
- **Hashability**: Tuples of hashable elements are themselves hashable, so they can be used as dictionary keys or set members. Lists cannot, since they're mutable.
- **Semantics / use cases**: Tuples are often used for fixed collections of heterogeneous data (e.g. a coordinate \`(x, y)\` or a database row), signaling "this data won't change." Lists are used for homogeneous collections that grow, shrink, or get reordered (e.g. a list of user IDs).
- **Methods**: Lists have many mutating methods (\`append\`, \`extend\`, \`sort\`, \`remove\`, ...). Tuples only expose non-mutating methods like \`count\` and \`index\`.

A useful mental model: use a tuple when the *position* of each element has a distinct meaning (like a struct), and a list when all elements represent the same kind of thing in a sequence that may change.`,
        },
      ],
    },
    {
      title: "What is the difference between == and is in Python?",
      prompt:
        "Explain how the == operator differs from the is operator in Python, and give an example where they produce different results.",
      difficulty: "EASY",
      tags: ["operators", "basics", "identity"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `\`==\` and \`is\` test different kinds of equality:

- \`==\` calls the \`__eq__\` method and checks **value equality** — whether two objects represent the same data.
- \`is\` checks **identity equality** — whether two names refer to the exact same object in memory (equivalent to comparing \`id(a) == id(b)\`).

Example:

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
a == b  # True, same contents
a is b  # False, two different list objects
c = a
c is a  # True, c and a point to the same object
\`\`\`

A common gotcha involves small integers and short strings. CPython caches small integers (typically -5 to 256) and interns some string literals, so \`a = 5; b = 5; a is b\` may evaluate to \`True\` even though you never explicitly checked identity — but this is an implementation detail you should never rely on. The correct, portable way to compare values is always \`==\`; \`is\` should be reserved for identity checks such as \`x is None\`, \`x is True\`, or comparing against sentinel objects, where the language guarantees singleton behavior.`,
        },
      ],
    },
    {
      title: "What are mutable and immutable types in Python?",
      prompt:
        "Explain the difference between mutable and immutable objects in Python, and list examples of each.",
      difficulty: "EASY",
      tags: ["data-structures", "basics", "memory"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `An object is **mutable** if its internal state can change after creation without changing its identity (its \`id()\`). It's **immutable** if it cannot be modified in place — any "change" actually creates a new object.

**Immutable built-in types**: \`int\`, \`float\`, \`bool\`, \`complex\`, \`str\`, \`tuple\`, \`frozenset\`, \`bytes\`, and \`None\`.

**Mutable built-in types**: \`list\`, \`dict\`, \`set\`, \`bytearray\`, and most user-defined classes by default.

Why it matters:

- Immutable objects are safe to share and use as dictionary keys / set elements, because their hash value never changes.
- Mutable default arguments are a classic pitfall — a mutable object passed as a default value is created once and shared across all calls:

\`\`\`python
def append_item(item, bucket=[]):  # bug: bucket is created once
    bucket.append(item)
    return bucket

append_item(1)  # [1]
append_item(2)  # [1, 2]  <-- surprising, same list reused
\`\`\`

The fix is to default to \`None\` and create a new mutable object inside the function body.

- Mutability also affects how variables are passed to functions: Python passes references by value, so mutating a mutable argument inside a function affects the caller's object, while reassigning an immutable argument does not.`,
        },
      ],
    },
    {
      title: "What is a dictionary comprehension?",
      prompt:
        "Explain what a dictionary comprehension is in Python and provide an example that builds a dictionary from two lists.",
      difficulty: "EASY",
      tags: ["comprehensions", "dictionaries"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A dictionary comprehension is a concise syntax for building a \`dict\` in a single expression, analogous to a list comprehension but producing key-value pairs. The general form is:

\`\`\`python
{key_expr: value_expr for item in iterable if condition}
\`\`\`

It's more readable and typically faster than building an empty dict and populating it in a loop, because the looping happens in optimized C code rather than through repeated Python-level \`dict.__setitem__\` calls.`,
          codeContent: `names = ["alice", "bob", "carol"]
ages = [30, 25, 35]

# Build a dict mapping name -> age
name_to_age = {name: age for name, age in zip(names, ages)}
# {'alice': 30, 'bob': 25, 'carol': 35}

# With a filter condition
adults_only = {name: age for name, age in zip(names, ages) if age >= 30}
# {'alice': 30, 'carol': 35}

# Transforming keys/values
upper_names = {name.upper(): age for name, age in zip(names, ages)}
# {'ALICE': 30, 'BOB': 25, 'CAROL': 35}`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is the difference between *args and **kwargs?",
      prompt:
        "Explain what *args and **kwargs mean in a Python function signature and show an example of a function that uses both.",
      difficulty: "EASY",
      tags: ["functions", "basics"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `\`*args\` and \`**kwargs\` let a function accept a variable number of arguments:

- \`*args\` collects any extra **positional** arguments into a tuple. The name \`args\` is just convention — the meaningful part is the single \`*\`.
- \`**kwargs\` collects any extra **keyword** arguments into a dict. The meaningful part is the double \`**\`.

They're commonly used for writing wrapper functions/decorators that forward arguments, for APIs that need flexible signatures, and for building things like \`*args\` unpacking when calling a function (\`f(*my_list)\`) or \`**kwargs\` unpacking (\`f(**my_dict)\`).

Order matters in a signature: regular positional params, then \`*args\`, then keyword-only params, then \`**kwargs\`.`,
          codeContent: `def describe(name, *args, **kwargs):
    print(f"name={name}")
    print(f"extra positional args={args}")
    print(f"keyword args={kwargs}")

describe("widget", 1, 2, 3, color="red", in_stock=True)
# name=widget
# extra positional args=(1, 2, 3)
# keyword args={'color': 'red', 'in_stock': True}

# Unpacking when calling
values = [1, 2, 3]
options = {"color": "red", "in_stock": True}
describe("widget", *values, **options)  # same result as above`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is PEP 8 and why does it matter?",
      prompt:
        "What is PEP 8, and why is following a style guide important when writing Python code in a team?",
      difficulty: "EASY",
      tags: ["style", "best-practices"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `PEP 8 is the official Python Enhancement Proposal that defines the style guide for writing Python code, covering things like:

- Naming conventions: \`snake_case\` for functions/variables, \`PascalCase\` for classes, \`UPPER_SNAKE_CASE\` for constants.
- Layout rules: 4 spaces per indentation level, a soft limit of 79 characters per line, blank line conventions between top-level definitions.
- Whitespace guidance: how to space around operators, commas, and inside brackets.
- Recommendations on imports (one per line, grouped by standard library / third-party / local), comparisons (\`is None\` instead of \`== None\`), and more.

It matters because:

- **Readability**: Python's philosophy ("code is read more often than it is written") is embodied by PEP 8 — consistent style reduces the cognitive overhead of reading someone else's code.
- **Team consistency**: In a shared codebase, a single agreed-upon style avoids bikeshedding and diff noise from purely stylistic changes.
- **Tooling**: Linters and formatters like \`flake8\`, \`pylint\`, \`black\`, and \`ruff\` enforce (or auto-fix) PEP 8 conventions, catching issues automatically in CI rather than in code review.

PEP 8 is a guideline, not a strict law — the document itself says consistency within a project or module can outweigh strict adherence, and tools like \`black\` deliberately deviate from a few PEP 8 recommendations in favor of an unambiguous, automated format.`,
        },
      ],
    },
    {
      title: "What is the difference between a shallow copy and a deep copy?",
      prompt:
        "Explain the difference between shallow and deep copies in Python, and show how copy.copy() and copy.deepcopy() behave differently on a nested list.",
      difficulty: "EASY",
      tags: ["copying", "memory", "data-structures"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A **shallow copy** creates a new outer container, but the elements inside it are still references to the *same* objects as the original — nested mutable objects are shared, not duplicated. A **deep copy** recursively copies every nested object, so the result is fully independent of the original.

- \`copy.copy(obj)\` (or \`list(obj)\`, \`obj[:]\`, \`dict(obj)\`) performs a shallow copy.
- \`copy.deepcopy(obj)\` performs a deep copy, recursively.

The difference only matters when the container holds mutable elements (like lists inside a list); copying a list of immutable ints/strings behaves the same either way.`,
          codeContent: `import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)
deep = copy.deepcopy(original)

shallow[0].append(99)
print(original)  # [[1, 2, 99], [3, 4]]  <- inner list was shared, so it changed too
print(shallow)   # [[1, 2, 99], [3, 4]]

deep[1].append(100)
print(original)  # [[1, 2, 99], [3, 4]]  <- unaffected, deep copy is fully independent
print(deep)       # [[1, 2], [3, 4, 100]]`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What are Python's built-in data types?",
      prompt: "List and briefly describe Python's main built-in data types.",
      difficulty: "EASY",
      tags: ["basics", "data-types"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Python's commonly used built-in types fall into a few categories:

**Numeric**
- \`int\` — arbitrary-precision integers.
- \`float\` — double-precision floating point.
- \`complex\` — complex numbers with real/imaginary parts.
- \`bool\` — subclass of \`int\` with values \`True\`/\`False\`.

**Sequence types**
- \`str\` — immutable sequence of Unicode characters.
- \`list\` — mutable, ordered sequence of any objects.
- \`tuple\` — immutable, ordered sequence.
- \`range\` — an immutable sequence of numbers, generated lazily.
- \`bytes\` / \`bytearray\` — sequences of raw bytes (immutable / mutable respectively).

**Mapping type**
- \`dict\` — mutable mapping of hashable keys to values, insertion-ordered since Python 3.7.

**Set types**
- \`set\` — mutable, unordered collection of unique hashable elements.
- \`frozenset\` — immutable version of \`set\`.

**Other**
- \`NoneType\` — the type of the singleton \`None\`, used to represent "no value."

All of these are objects — even integers and functions — since everything in Python is an instance of some class.`,
        },
      ],
    },
    {
      title: "What is string interning in Python?",
      prompt:
        "Explain what string interning is in CPython, why it exists, and how it can affect the behavior of the is operator on strings.",
      difficulty: "EASY",
      tags: ["strings", "memory", "cpython"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `String interning is an optimization where CPython stores only one copy of certain immutable strings and reuses that same object wherever an identical string is needed, instead of allocating a new string object every time.

CPython automatically interns:
- String literals that look like identifiers (letters, digits, underscores) and are known at compile time, e.g. \`"hello"\`, variable names, most short strings used as dict keys or attribute names.
- Strings created via \`sys.intern()\` explicitly.

Because of interning, two separately written literals that are interned can end up being the exact same object:

\`\`\`python
a = "hello"
b = "hello"
a is b  # True in CPython, because both are interned

c = "hello world!"
d = "hello world!"
c is d  # not guaranteed — may be False, especially for strings built at runtime
\`\`\`

Why it matters in interviews: it explains a common source of confusion when people use \`is\` to compare strings and get inconsistent results depending on how the string was constructed (e.g. literal vs. \`str.join\`, slicing, or concatenation at runtime). The takeaway is: interning is a CPython implementation detail for performance and memory savings — it should never be relied upon for correctness. Always compare string *values* with \`==\`, not \`is\`.`,
        },
      ],
    },
    {
      title: "Write a function to check if a string is a palindrome.",
      prompt:
        "Write a Python function is_palindrome(s) that returns True if the input string reads the same forwards and backwards, ignoring case and non-alphanumeric characters.",
      difficulty: "EASY",
      tags: ["strings", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `def is_palindrome(s: str) -> bool:
    cleaned = [ch.lower() for ch in s if ch.isalnum()]
    return cleaned == cleaned[::-1]


# Examples
print(is_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_palindrome("race a car"))                       # False
print(is_palindrome(""))                                 # True (empty string is a palindrome)


# Alternative O(1)-extra-space approach using two pointers on the cleaned string
def is_palindrome_two_pointer(s: str) -> bool:
    cleaned = [ch.lower() for ch in s if ch.isalnum()]
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is the difference between list.append() and list.extend()?",
      prompt:
        "Explain how append() and extend() differ when adding elements to a Python list, with an example.",
      difficulty: "EASY",
      tags: ["lists", "methods"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Both methods add elements to the end of a list in place and return \`None\`, but they differ in what they add:

- \`list.append(x)\` adds \`x\` as a single new element, no matter what \`x\` is (even if \`x\` is itself a list).
- \`list.extend(iterable)\` iterates over \`iterable\` and appends each of its elements individually, effectively concatenating the two sequences.

A common bug is calling \`.append()\` when \`.extend()\` was intended, which nests a list inside another list instead of merging them.`,
          codeContent: `nums = [1, 2, 3]

nums.append([4, 5])
print(nums)  # [1, 2, 3, [4, 5]]  <- the whole list is added as one element

nums = [1, 2, 3]
nums.extend([4, 5])
print(nums)  # [1, 2, 3, 4, 5]  <- each element is added individually

# extend also works with any iterable, not just lists
nums.extend(range(6, 8))
print(nums)  # [1, 2, 3, 4, 5, 6, 7]`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is slicing and how does it work on sequences?",
      prompt:
        "Explain Python's slice syntax (start:stop:step) and show a few examples of how it can be used on lists and strings, including negative indices.",
      difficulty: "EASY",
      tags: ["slicing", "lists", "strings"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Slicing extracts a sub-sequence from any sequence type (\`list\`, \`tuple\`, \`str\`, etc.) using the syntax \`seq[start:stop:step]\`:

- \`start\` — index to begin at (inclusive), defaults to \`0\`.
- \`stop\` — index to end before (exclusive), defaults to the sequence length.
- \`step\` — how many indices to advance each time, defaults to \`1\`. A negative step reverses direction.

All three parameters are optional and out-of-range indices are clamped rather than raising an error, which makes slicing very forgiving compared to plain indexing. Negative indices count from the end of the sequence (\`-1\` is the last element).

Slicing a list or string always returns a *new* object (a copy of that sub-sequence) — it does not mutate the original.`,
          codeContent: `s = "hello world"
s[0:5]     # 'hello'
s[:5]      # 'hello'      (start defaults to 0)
s[6:]      # 'world'      (stop defaults to len(s))
s[-5:]     # 'world'      (last 5 characters)
s[::-1]    # 'dlrow olleh' (reversed string)
s[::2]     # 'hlowrd'      (every other character)

nums = [0, 1, 2, 3, 4, 5]
nums[1:4]    # [1, 2, 3]
nums[:-2]    # [0, 1, 2, 3]   (all but the last two)
nums[::-1]   # [5, 4, 3, 2, 1, 0]

# Slicing can also be used for assignment (lists only)
nums[1:3] = [10, 20, 30]
print(nums)  # [0, 10, 20, 30, 3, 4, 5]`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is a decorator in Python?",
      prompt:
        "Explain what a decorator is in Python and write a simple decorator that logs the execution time of the function it wraps.",
      difficulty: "MEDIUM",
      tags: ["decorators", "closures", "functions"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A decorator is a callable (usually a function) that takes another function (or class) as input and returns a new callable that typically wraps the original with extra behavior, without modifying the original function's source code. Decorators are applied with the \`@decorator_name\` syntax placed above a function definition, which is syntactic sugar for \`func = decorator_name(func)\`.

Decorators rely on two language features: functions being first-class objects (they can be passed around and returned like any value), and closures (an inner function can "remember" variables from its enclosing scope, like the original function reference).

It's good practice to use \`functools.wraps\` inside the wrapper so the decorated function keeps its original \`__name__\`, \`__doc__\`, and other metadata — otherwise tools like debuggers and \`help()\` will show the wrapper's identity instead of the original function's.`,
          codeContent: `import time
import functools


def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.6f}s")
        return result
    return wrapper


@timed
def slow_sum(n):
    return sum(range(n))


slow_sum(10_000_000)
# slow_sum took 0.123456s`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is a generator and how does yield work?",
      prompt:
        "Explain how generator functions work in Python, how yield differs from return, and why generators are memory-efficient. Provide a short example.",
      difficulty: "MEDIUM",
      tags: ["generators", "iterators", "memory"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A generator function is a function that contains at least one \`yield\` statement. Calling it doesn't run the function body immediately — instead it returns a **generator object**, which is an iterator that executes the function body lazily, one step at a time, each time you call \`next()\` on it (which \`for\` loops do implicitly).

Key differences from \`return\`:
- \`return\` exits a function and discards its local state.
- \`yield\` pauses the function, sends a value out to the caller, and preserves all local variables and the exact point of execution. The next call to \`next()\` resumes right after the \`yield\`.
- When the function eventually returns (falls off the end, or hits a \`return\`), the generator raises \`StopIteration\` to signal completion.

Why generators are memory-efficient: they produce values on demand instead of building an entire collection in memory up front. For example, a generator that processes a huge file line-by-line only ever holds one line in memory at a time, whereas \`[line for line in file]\` would hold the whole file. This makes generators ideal for streaming/pipeline-style processing and for representing infinite or very large sequences.`,
          codeContent: `def countdown(n):
    print("starting countdown")
    while n > 0:
        yield n
        n -= 1
    print("done")


gen = countdown(3)   # nothing has run yet
print(next(gen))     # prints "starting countdown", then yields 3
print(next(gen))     # yields 2
print(next(gen))     # yields 1
# print(next(gen))   # prints "done", then raises StopIteration

# Typical usage is via a for loop, which handles StopIteration automatically
for value in countdown(3):
    print(value)  # 3, 2, 1

# Generator expressions are the lazy analog of list comprehensions
squares = (x * x for x in range(1_000_000))  # no memory allocated for all values yet`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is the Global Interpreter Lock (GIL)?",
      prompt:
        "Explain what the GIL is in CPython, why it exists, and how it affects multi-threaded CPU-bound versus I/O-bound programs.",
      difficulty: "MEDIUM",
      tags: ["concurrency", "gil", "cpython"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `The Global Interpreter Lock (GIL) is a mutex in CPython (the reference implementation of Python) that ensures only one thread executes Python bytecode at a time, even on a multi-core machine. It exists primarily because CPython's memory management (reference counting for garbage collection) is not thread-safe by default; the GIL avoids race conditions on reference counts without requiring fine-grained locking around every object.

Effects on concurrency:

- **CPU-bound work** (tight Python loops, number crunching in pure Python): threads do **not** get a speedup from multiple cores, because only one thread runs Python bytecode at any instant — threads just take turns. For true parallelism on CPU-bound work, you need the \`multiprocessing\` module (separate processes, each with its own interpreter and GIL) or push the work into C extensions/libraries that release the GIL (e.g. NumPy, or using \`concurrent.futures.ProcessPoolExecutor\`).
- **I/O-bound work** (network calls, file I/O, waiting on a database): the GIL is released while a thread is blocked on I/O, so threading is still effective here — one thread can wait on a socket while another runs Python code. This is why \`threading\` (or \`asyncio\`) is a good fit for I/O-bound concurrency even in the presence of the GIL.

A few caveats worth mentioning in an interview: the GIL is a CPython implementation detail, not a language requirement — other implementations like Jython or IronPython don't have one, and there is active work (PEP 703, "free-threaded" CPython, shipped experimentally starting with 3.13) to make the GIL optional. Also, C extensions that do heavy computation (like NumPy) can explicitly release the GIL during their internal work, allowing real parallelism even from threads.`,
        },
      ],
    },
    {
      title:
        "What is the difference between multiprocessing and threading in Python?",
      prompt:
        "Compare Python's multiprocessing and threading modules. When would you choose one over the other?",
      difficulty: "MEDIUM",
      tags: ["concurrency", "multiprocessing", "threading"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Both modules provide a similar high-level API (\`Thread\`/\`Process\`, \`Pool\`, queues, locks), but they achieve concurrency very differently:

**threading**
- Runs multiple threads within a single OS process, sharing the same memory space.
- Subject to the GIL, so only one thread executes Python bytecode at a time — no real parallel speedup for CPU-bound Python code.
- Lightweight to create; communication between threads is easy since they share memory directly (but this also means you need locks/semaphores to avoid race conditions on shared mutable state).
- Great fit for I/O-bound concurrency (network requests, file/database I/O), where threads spend most of their time waiting and the GIL is released during blocking calls.

**multiprocessing**
- Spawns separate OS processes, each with its own Python interpreter and memory space, and therefore its own GIL — this gives true parallel execution across CPU cores.
- Higher overhead to start a process than a thread, and inter-process communication requires serialization (pickling) via \`Queue\`, \`Pipe\`, or shared memory (\`multiprocessing.shared_memory\`), since processes don't share memory by default.
- Best fit for CPU-bound work — numerical computation, image/data processing, anything that keeps the CPU busy rather than waiting on I/O.

**Rule of thumb**: I/O-bound → \`threading\` (or better, \`asyncio\` for very high concurrency) because the bottleneck is waiting, not computing. CPU-bound → \`multiprocessing\` (or delegate to a library like NumPy that releases the GIL) because you need actual parallel CPU cycles. Also worth mentioning \`concurrent.futures\`, which offers \`ThreadPoolExecutor\` and \`ProcessPoolExecutor\` behind a unified, simpler interface for both.`,
        },
      ],
    },
    {
      title: "What is monkey patching?",
      prompt:
        "Explain what monkey patching means in Python, give an example use case, and discuss its risks.",
      difficulty: "MEDIUM",
      tags: ["dynamic-typing", "best-practices"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Monkey patching is modifying or extending a module, class, or object at runtime — for example, replacing a method on a class after it's already defined, without touching the original source code. Python allows this because classes, modules, and objects are all mutable, dynamic objects at runtime.

Common legitimate use cases:
- **Testing**: replacing a function that hits the network or a database with a fake/mock in unit tests (this is essentially what \`unittest.mock.patch\` automates).
- **Patching third-party bugs**: temporarily fixing or working around a bug in a library you don't control, until an upstream fix ships.
- **Adding compatibility shims**: e.g. adding a method to an older library's class so it behaves like a newer version.

Risks:
- It can make code very hard to reason about, since a function's behavior may not match what's written in its defining module — the patch could be applied anywhere in the codebase.
- Patches can silently break when the underlying library is upgraded and its internals change.
- It bypasses encapsulation and can introduce subtle bugs if the patch doesn't fully replicate the original semantics (e.g. missing an edge case the original handled).

Because of these risks, monkey patching is best reserved for tests and small, well-documented compatibility shims — not as a general design tool in production code.`,
          codeContent: `# Example: monkey patching in tests using unittest.mock
from unittest.mock import patch
import requests


def get_status(url):
    return requests.get(url).status_code


with patch("requests.get") as mock_get:
    mock_get.return_value.status_code = 200
    print(get_status("https://example.com"))  # 200, no real network call made

# Manual monkey patching example (less common in production code)
class Dog:
    def speak(self):
        return "Woof"

def new_speak(self):
    return "Woof! (patched)"

Dog.speak = new_speak
print(Dog().speak())  # "Woof! (patched)"`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What is a context manager and how do you implement one?",
      prompt:
        "Explain what a context manager is, what the with statement does under the hood, and show two ways to implement a custom context manager in Python.",
      difficulty: "MEDIUM",
      tags: ["context-managers", "resource-management"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A context manager is an object that defines the setup and teardown logic to run around a block of code, most commonly used to guarantee that resources (files, locks, network connections, database transactions) are properly released even if an exception occurs. It's used with the \`with\` statement.

Under the hood, \`with EXPR as x:\` does roughly:

1. Evaluate \`EXPR\` to get the context manager object, and call its \`__enter__()\` method; the return value is bound to \`x\`.
2. Run the indented block.
3. Regardless of whether the block succeeded or raised an exception, call the context manager's \`__exit__(exc_type, exc_value, traceback)\` method. If an exception occurred, \`__exit__\` can return \`True\` to suppress it, or return \`False\`/\`None\` to let it propagate.

Two ways to write one:

1. **Class-based**, implementing \`__enter__\`/\`__exit__\` directly.
2. **Generator-based**, using \`@contextlib.contextmanager\` — you write a generator function with exactly one \`yield\`; code before the \`yield\` is the setup, code after (typically in a \`finally\`) is the teardown.`,
          codeContent: `# 1. Class-based context manager
class FileOpener:
    def __init__(self, path, mode):
        self.path = path
        self.mode = mode

    def __enter__(self):
        self.file = open(self.path, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_value, traceback):
        self.file.close()
        return False  # don't suppress exceptions


with FileOpener("data.txt", "w") as f:
    f.write("hello")


# 2. Generator-based context manager
from contextlib import contextmanager

@contextmanager
def file_opener(path, mode):
    f = open(path, mode)
    try:
        yield f
    finally:
        f.close()


with file_opener("data.txt", "w") as f:
    f.write("hello")`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title:
        "What is the difference between @staticmethod, @classmethod, and an instance method?",
      prompt:
        "Explain the differences between a regular instance method, a @classmethod, and a @staticmethod in Python, and when you would use each.",
      difficulty: "MEDIUM",
      tags: ["oop", "methods", "decorators"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `All three are functions defined inside a class, but they differ in what gets passed implicitly as the first argument:

- **Instance method** (no decorator): receives the instance as the first argument, conventionally named \`self\`. Use it when the method needs to read or modify instance state.
- **\`@classmethod\`**: receives the class itself as the first argument, conventionally named \`cls\`, regardless of whether it's called on the class or an instance. Commonly used for alternative constructors (factory methods) or for methods that need to know about the class (e.g. to support subclassing correctly, since \`cls\` reflects the actual subclass the method was called on).
- **\`@staticmethod\`**: receives no implicit first argument at all — it behaves like a plain function that just happens to live in the class's namespace, usually because it's logically related to the class. Use it when the method doesn't need access to either instance or class state.`,
          codeContent: `class Pizza:
    def __init__(self, toppings):
        self.toppings = toppings

    def describe(self):  # instance method: needs self.toppings
        return f"Pizza with {', '.join(self.toppings)}"

    @classmethod
    def margherita(cls):  # alternative constructor, returns cls(...)
        return cls(["tomato", "mozzarella", "basil"])

    @staticmethod
    def is_valid_topping(topping):  # doesn't need self or cls
        return topping.lower() in {"tomato", "mozzarella", "basil", "pepperoni"}


p = Pizza.margherita()
print(p.describe())                          # Pizza with tomato, mozzarella, basil
print(Pizza.is_valid_topping("pepperoni"))    # True
print(p.is_valid_topping("pineapple"))        # False, can also be called on an instance`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "How does Python's garbage collection work?",
      prompt:
        "Explain how CPython manages memory for objects, including reference counting and the generational garbage collector for cyclic references.",
      difficulty: "MEDIUM",
      tags: ["memory", "garbage-collection", "cpython"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `CPython's memory management has two layers:

**1. Reference counting (primary mechanism)**
Every object has a reference count that tracks how many references point to it. It's incremented when a new reference is created (assignment, passing as an argument, adding to a container) and decremented when a reference goes out of scope or is deleted. The moment an object's reference count hits zero, CPython immediately and deterministically deallocates it. This is why closing a file or releasing a resource inside \`__del__\` often "just works" in CPython without an explicit \`with\` block — though relying on that is not recommended since it's an implementation detail.

**2. Generational cycle-detecting garbage collector (backup mechanism)**
Reference counting alone can't reclaim objects that reference each other in a cycle (e.g. two objects that hold references to each other, or a self-referencing linked list node) — their counts never reach zero even though nothing outside the cycle can reach them. The \`gc\` module solves this with a separate, generational garbage collector that periodically scans for and collects unreachable reference cycles.

It's generational: objects are grouped into three generations (0, 1, 2) based on how many collection passes they've survived. New objects start in generation 0, which is collected most frequently (young objects tend to die young, so this is efficient); objects that survive a collection get promoted to older generations, which are scanned less often. This is a common optimization pattern also seen in JVM-style garbage collectors.

Practical takeaways:
- You rarely need to call \`gc.collect()\` manually.
- You can disable the cyclic collector with \`gc.disable()\` for a slight performance boost in latency-sensitive code that avoids creating cycles, but reference counting still runs regardless.
- Objects with a \`__del__\` method involved in a cycle used to be uncollectable in Python 2; Python 3.4+ (PEP 442) fixed this so such cycles can be collected too.`,
        },
      ],
    },
    {
      title: "What is duck typing?",
      prompt:
        "Explain the concept of duck typing in Python and how it relates to Python's approach to polymorphism, contrasting it with interface-based typing in statically typed languages.",
      difficulty: "MEDIUM",
      tags: ["oop", "typing", "polymorphism"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Duck typing is a style of dynamic typing summarized by the phrase "if it walks like a duck and quacks like a duck, it's a duck." Instead of checking an object's declared type or class hierarchy, Python code typically just calls the method or attribute it needs and trusts that it will work — the object's suitability is determined by whether it *behaves* correctly at runtime, not by what it explicitly claims to be.

Example: a function that calls \`.read()\` on its argument will happily accept a real file object, an \`io.StringIO\`, a network socket wrapper, or any custom object that implements \`.read()\` — there's no need for these to share a common base class or explicitly implement an "interface."

This contrasts with statically typed, interface-driven languages (like Java or C#, pre-generics-era style), where a class typically must explicitly declare that it implements a given interface, and the compiler checks type compatibility before the program runs.

Python does offer ways to formalize expectations without abandoning duck typing:
- **Abstract Base Classes** (\`abc\` module, e.g. \`collections.abc.Iterable\`) let you define and check for expected behavior, including via \`isinstance()\` checks against "virtual subclasses" that never explicitly inherited from the ABC.
- **Structural typing with \`typing.Protocol\`** (PEP 544) allows static type checkers like mypy to verify duck-typed code — a class satisfies a \`Protocol\` simply by having the right methods/attributes, with no explicit inheritance required, combining the flexibility of duck typing with static type checking.

The tradeoff: duck typing gives great flexibility and reduces boilerplate, but errors from an incompatible object are only caught at runtime (typically an \`AttributeError\`), rather than at compile/type-check time.`,
        },
      ],
    },
    {
      title: "Write a function to solve the two-sum problem.",
      prompt:
        "Given a list of integers nums and a target integer, write a function that returns the indices of the two numbers that add up to target. Assume exactly one solution exists and aim for better than O(n^2) time.",
      difficulty: "MEDIUM",
      tags: ["algorithms", "coding-exercise", "hash-map"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    raise ValueError("No two sum solution found")


# Example
print(two_sum([2, 7, 11, 15], 9))   # [0, 1]  (2 + 7 == 9)
print(two_sum([3, 2, 4], 6))         # [1, 2]  (2 + 4 == 6)
print(two_sum([3, 3], 6))            # [0, 1]

# Runs in O(n) time and O(n) extra space, by trading the naive O(n^2)
# nested-loop brute force for a single pass with a hash map lookup.`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title:
        "What is the difference between __eq__ and __hash__, and why must they be consistent?",
      prompt:
        "Explain the relationship between the __eq__ and __hash__ methods in Python, and why overriding one usually requires overriding the other, especially for objects used in sets or as dict keys.",
      difficulty: "MEDIUM",
      tags: ["oop", "dunder-methods", "hashing"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `\`__eq__\` defines what makes two objects "equal" when compared with \`==\`. \`__hash__\` returns an integer used to place the object into a hash-based bucket for containers like \`set\` and \`dict\`.

The contract Python (and hash tables in general) requires is: **if two objects are equal (\`a == b\`), they must have the same hash (\`hash(a) == hash(b)\`)**. The reverse isn't required — two unequal objects can share a hash (a "hash collision"), which is handled internally, just less efficiently.

Why this matters: a \`dict\`/\`set\` uses \`hash()\` first to find the right bucket, then uses \`__eq__\` to confirm an exact match among objects in that bucket. If \`__hash__\` and \`__eq__\` are inconsistent, lookups silently break — you can insert an object into a set and then fail to find it via an "equal" key, because it hashed to a different bucket than expected.

By default, every object inherits \`__eq__\` (identity comparison) and \`__hash__\` (based on \`id()\`) from \`object\`, which are trivially consistent. But **if you override \`__eq__\` without overriding \`__hash__\`, Python automatically sets \`__hash__\` to \`None\`** on that class, making instances unhashable (you'll get a \`TypeError\` if you try to put them in a set or use them as dict keys). This is Python being defensive: it can't guess a correct hash implementation that stays consistent with your custom equality logic, so it refuses to guess wrong.

The fix is to implement both together, deriving the hash from the same fields used for equality:

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))
\`\`\`

One more rule of thumb: if a class is mutable (its equality-relevant fields can change after creation), it's often best to leave it unhashable (or hash only on truly immutable identity fields), since mutating an object after inserting it into a set/dict can corrupt the container by changing its hash while its bucket placement stays fixed.`,
        },
      ],
    },
    {
      title:
        "Explain Python's Method Resolution Order (MRO) and C3 linearization.",
      prompt:
        "In the context of multiple inheritance, explain what Method Resolution Order is, how Python computes it using C3 linearization, and how super() uses it.",
      difficulty: "HARD",
      tags: ["oop", "inheritance", "mro"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Method Resolution Order (MRO) is the linear order in which Python searches base classes when resolving an attribute or method lookup on an instance, especially relevant under multiple inheritance where the same method name might exist in more than one ancestor.

Since Python 2.3, the MRO is computed using the **C3 linearization** algorithm (the same approach used by languages like Dylan). C3 guarantees three properties:

1. **Local precedence order** is preserved — a class always appears before its own base classes.
2. **Monotonicity** — the relative order of classes as they appear in one class's MRO is preserved in the MRO of any of its subclasses.
3. A **consistent linearization** must exist, combining a class's own bases (in the order they're listed) with the merge of each base's own MRO. If no consistent order can be found (contradictory inheritance declarations), Python raises \`TypeError: Cannot create a consistent method resolution order\` at class definition time rather than silently picking an arbitrary/ambiguous order.

The classic motivating example is "diamond inheritance":

\`\`\`python
class A:
    def greet(self):
        return "A"

class B(A):
    def greet(self):
        return "B -> " + super().greet()

class C(A):
    def greet(self):
        return "C -> " + super().greet()

class D(B, C):
    pass

print(D.__mro__)
# (D, B, C, A, object)
print(D().greet())
# "B -> C -> A"
\`\`\`

Naive depth-first left-to-right resolution (as older Python or C++ might use) would visit \`A\` twice and go \`D -> B -> A -> C -> A\`, which would call \`B\`'s and then jump straight to \`A\`, skipping \`C\` entirely — breaking cooperative multiple inheritance. C3 linearization instead produces \`D -> B -> C -> A -> object\`, ensuring each class in the diamond is visited exactly once, in a consistent order.

\`super()\` doesn't literally mean "my direct parent class" — it means "the next class in the MRO after the current class," which is what makes cooperative multiple inheritance (where each class's method calls \`super()\` and trusts the MRO to chain correctly) work. You can inspect any class's computed order via \`ClassName.__mro__\` or \`ClassName.mro()\`.`,
        },
      ],
    },
    {
      title: "What is asyncio and how does the event loop work?",
      prompt:
        "Explain how Python's asyncio module achieves concurrency with a single-threaded event loop, and show a short example using async/await and asyncio.gather.",
      difficulty: "HARD",
      tags: ["asyncio", "concurrency", "event-loop"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `\`asyncio\` provides cooperative, single-threaded concurrency built around an **event loop**. Instead of using OS threads or processes, it runs many *coroutines* (functions defined with \`async def\`) that voluntarily yield control back to the event loop whenever they hit an \`await\` on something that would block (I/O, a timer, another coroutine). While one coroutine is "waiting," the event loop is free to run other ready coroutines — this is why it works well for highly concurrent I/O-bound workloads (thousands of open network connections, for example) with far less overhead than one OS thread per connection.

Key pieces:
- **Coroutine**: created by calling an \`async def\` function; it does nothing until it's awaited or scheduled.
- **Task**: a coroutine wrapped and scheduled to run on the event loop concurrently (via \`asyncio.create_task\` or \`asyncio.gather\`); this is what actually enables *concurrent* progress, since just \`await\`-ing coroutines directly, one after another, runs them sequentially.
- **Event loop**: the scheduler that keeps track of pending tasks and I/O callbacks (using OS-level mechanisms like \`epoll\`/\`kqueue\`/\`IOCP\` under the hood) and resumes each coroutine when the thing it's waiting on is ready.
- **await**: suspends the current coroutine, handing control back to the event loop, until the awaited thing completes.

Because everything runs on a single thread, there's no need for locks to protect shared state between coroutines the way you would with \`threading\` — but a single coroutine that runs a long CPU-bound computation without ever \`await\`-ing will block the entire event loop, starving every other task. CPU-bound work should be offloaded to a thread/process pool via \`loop.run_in_executor\`.`,
          codeContent: `import asyncio
import time


async def fetch_data(name, delay):
    print(f"{name}: starting")
    await asyncio.sleep(delay)  # simulates a non-blocking I/O wait
    print(f"{name}: done after {delay}s")
    return f"{name}-result"


async def main():
    start = time.perf_counter()

    # Sequential await: total time ~= sum of delays (2 + 1 = 3s)
    # r1 = await fetch_data("A", 2)
    # r2 = await fetch_data("B", 1)

    # Concurrent execution: total time ~= max of delays (2s)
    results = await asyncio.gather(
        fetch_data("A", 2),
        fetch_data("B", 1),
    )
    print(results)  # ['A-result', 'B-result']
    print(f"elapsed: {time.perf_counter() - start:.2f}s")  # ~2.00s


asyncio.run(main())`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "What are metaclasses in Python?",
      prompt:
        "Explain what a metaclass is in Python, how type relates to class creation, and show an example of a custom metaclass that enforces something about the classes it creates.",
      difficulty: "HARD",
      tags: ["metaclasses", "oop", "advanced"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `In Python, "everything is an object" applies even to classes themselves — a class is an instance of its **metaclass**, just like an ordinary object is an instance of its class. By default, every class's metaclass is \`type\`. Calling \`type(SomeClass)\` returns \`<class 'type'>\` for most classes, showing that \`type\` is itself the default metaclass that constructs classes.

A metaclass is created by subclassing \`type\` and overriding \`__new__\` and/or \`__init__\` (which run when the *class* is being created, not when instances of the class are created) to customize what happens whenever a class using that metaclass is defined — e.g. validating the class body, auto-registering the class somewhere, injecting methods, or enforcing naming conventions.

You apply a custom metaclass with the \`metaclass=\` keyword in a class definition:

\`\`\`python
class MyClass(metaclass=MyMeta):
    ...
\`\`\`

Metaclasses are a fairly advanced, rarely-needed tool — the community mantra (often attributed to Tim Peters) is "metaclasses are deeper magic than 99% of users should ever worry about." In practice, class decorators or \`__init_subclass__\` (a simpler hook added in Python 3.6 that runs whenever a subclass is created, without needing a full metaclass) can solve many of the same problems with less complexity. Real-world uses of metaclasses include ORMs (e.g. Django models use a metaclass to turn class-level field declarations into database schema machinery) and frameworks that need a plugin registry of all subclasses.`,
          codeContent: `class EnforceUpperAttrsMeta(type):
    def __new__(mcs, name, bases, namespace):
        # Enforce that no class attribute name is lowercase (contrived example
        # of validating/transforming a class at definition time).
        uppercase_namespace = {
            (key.upper() if not key.startswith("__") else key): value
            for key, value in namespace.items()
        }
        return super().__new__(mcs, name, bases, uppercase_namespace)


class Config(metaclass=EnforceUpperAttrsMeta):
    debug = True
    max_connections = 10


print(Config.DEBUG)            # True  (renamed at class-creation time)
print(Config.MAX_CONNECTIONS)  # 10
print(type(Config))            # <class '__main__.EnforceUpperAttrsMeta'>
print(type(EnforceUpperAttrsMeta))  # <class 'type'>, the metaclass of metaclasses`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title:
        "What are descriptors and how do @property and classmethod use them?",
      prompt:
        "Explain the descriptor protocol in Python (__get__, __set__, __delete__), and show a custom descriptor example. Mention how property is implemented using this protocol.",
      difficulty: "HARD",
      tags: ["descriptors", "oop", "advanced"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A descriptor is any object that defines one or more of \`__get__\`, \`__set__\`, or \`__delete__\`, and is stored as a *class* attribute. When you access that attribute on an instance, Python's attribute lookup machinery detects the descriptor and delegates to its methods instead of returning the raw object directly.

- \`__get__(self, obj, objtype=None)\` — called on attribute read.
- \`__set__(self, obj, value)\` — called on attribute assignment; defining this (or \`__delete__\`) makes it a **data descriptor**.
- \`__delete__(self, obj)\` — called on \`del obj.attr\`.

**Data descriptors** (defining \`__set__\` and/or \`__delete__\`) take priority over instance \`__dict__\` entries during lookup. **Non-data descriptors** (only \`__get__\`) can be shadowed by an instance attribute of the same name. This distinction is exactly why regular methods work as bound methods (functions are non-data descriptors whose \`__get__\` returns a bound method), while \`property\` (a data descriptor) can't be overridden by simply assigning to \`self.attr\` in \`__init__\`.

\`property\` is itself implemented as a descriptor: \`property(fget, fset, fdel)\` stores your getter/setter/deleter functions and its \`__get__\`/\`__set__\`/\`__delete__\` call them. \`classmethod\` and \`staticmethod\` are also descriptors — their \`__get__\` is what produces a bound method with \`cls\` pre-filled (for \`classmethod\`) or the plain unbound function (for \`staticmethod\`) when accessed.

Custom descriptors are useful for reusable attribute logic — validation, type-checking, lazy computation, logging access — that would otherwise be duplicated across many \`@property\` definitions.`,
          codeContent: `class PositiveNumber:
    """A reusable data descriptor that validates values are positive."""

    def __set_name__(self, owner, name):
        self.name = "_" + name  # where the actual value is stored per-instance

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.name)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.name[1:]} must be positive, got {value}")
        setattr(obj, self.name, value)


class Order:
    quantity = PositiveNumber()
    price = PositiveNumber()

    def __init__(self, quantity, price):
        self.quantity = quantity  # goes through PositiveNumber.__set__
        self.price = price


order = Order(3, 9.99)
print(order.quantity)  # 3, goes through PositiveNumber.__get__

order.quantity = -5    # raises ValueError: quantity must be positive, got -5`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title:
        "Explain reference counting and cycle-detecting garbage collection in CPython.",
      prompt:
        "Describe how CPython uses reference counting for memory management, why reference counting alone cannot free all objects, and how the generational garbage collector handles reference cycles.",
      difficulty: "HARD",
      tags: ["memory", "garbage-collection", "cpython", "advanced"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `CPython uses **reference counting** as its primary memory management strategy. Every Python object has a hidden counter (\`ob_refcnt\`) tracking how many references currently point to it. Operations like assignment, passing arguments, appending to a list, or entering a new scope increment the count; deletion, reassignment, or leaving scope decrement it. As soon as the count reaches zero, CPython deallocates the object immediately and deterministically — you can observe this by defining \`__del__\` and watching it fire the instant the last reference disappears (in CPython specifically; this is not guaranteed by the language spec).

**Why reference counting alone isn't enough**: it cannot reclaim **reference cycles** — groups of objects that reference each other (directly or indirectly) but are unreachable from anywhere else in the program. A classic example is a doubly linked list or a tree with parent pointers, where a child references its parent and the parent references the child; even after all external references are dropped, each object in the cycle still has a nonzero refcount because the cycle members keep each other "alive."

**The generational cyclic garbage collector** (the \`gc\` module) exists specifically to find and collect these cycles. It only needs to track *container* objects (things that can hold references to other objects — lists, dicts, class instances, etc.), since only containers can participate in a cycle. Periodically, it performs a variant of a mark-and-sweep / trial-deletion algorithm: for a set of candidate objects, it temporarily subtracts internal (intra-group) references from each object's refcount; if what remains is zero, the object is only being kept alive by the cycle itself and is therefore garbage, and the whole cycle can be collected.

It's **generational** for performance: objects are grouped into 3 generations. New objects start in generation 0; if they survive a collection pass they get promoted to generation 1, and then generation 2. Generation 0 is collected most frequently (since the empirical "weak generational hypothesis" — most objects die young — holds for typical Python programs), while generation 2 is scanned much less often, since objects that have survived many collections are statistically likely to keep living. Collections are triggered automatically based on allocation/deallocation thresholds (\`gc.get_threshold()\`), not on a fixed timer.

Practical implications: this hybrid approach gives you the low-latency, deterministic cleanup of reference counting for the common case, plus a periodic safety net (the cyclic GC) for the cycle case — so most Python code never has to think about memory management at all, at some CPU cost for the periodic scans, which can be tuned or disabled via the \`gc\` module in performance-sensitive applications that are careful to avoid creating cycles.`,
        },
      ],
    },
    {
      title: "Implement an LRU cache from scratch.",
      prompt:
        "Implement an LRUCache class with get(key) and put(key, value) methods that both run in O(1) time, evicting the least recently used entry when the cache exceeds its capacity. You may use collections.OrderedDict or implement it manually with a hash map and doubly linked list.",
      difficulty: "HARD",
      tags: ["algorithms", "data-structures", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `from collections import OrderedDict


class LRUCache:
    """O(1) get/put LRU cache using OrderedDict, which maintains insertion
    order and supports moving an existing key to the end in O(1)."""

    def __init__(self, capacity: int):
        self.capacity = capacity
        self._data: OrderedDict[int, int] = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self._data:
            return -1
        self._data.move_to_end(key)  # mark as most recently used
        return self._data[key]

    def put(self, key: int, value: int) -> None:
        if key in self._data:
            self._data.move_to_end(key)
        self._data[key] = value
        if len(self._data) > self.capacity:
            self._data.popitem(last=False)  # evict least recently used (front)


# --- Manual implementation without relying on OrderedDict, for interviews
#     that want the underlying hash map + doubly linked list mechanics ---

class _Node:
    __slots__ = ("key", "value", "prev", "next")

    def __init__(self, key=None, value=None):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCacheManual:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.map: dict[int, _Node] = {}
        # sentinel head/tail simplify edge cases (empty list, single node)
        self.head = _Node()
        self.tail = _Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: "_Node") -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node: "_Node") -> None:
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._add_to_front(node)
        return node.value

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            self._remove(self.map[key])
        node = _Node(key, value)
        self.map[key] = node
        self._add_to_front(node)
        if len(self.map) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "Implement a decorator that accepts arguments.",
      prompt:
        "Write a Python decorator @retry(times=3, exceptions=(Exception,)) that retries the decorated function up to `times` times if it raises one of the specified exceptions.",
      difficulty: "HARD",
      tags: ["decorators", "coding-exercise", "error-handling"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import functools
import time


def retry(times=3, exceptions=(Exception,), delay=0.0):
    """A decorator factory: retry(...) returns the actual decorator, which
    is then applied to the target function."""

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exc = None
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as exc:
                    last_exc = exc
                    print(f"{func.__name__} failed on attempt {attempt}/{times}: {exc}")
                    if attempt < times and delay:
                        time.sleep(delay)
            raise last_exc
        return wrapper
    return decorator


@retry(times=3, exceptions=(ValueError,))
def flaky():
    import random
    if random.random() < 0.7:
        raise ValueError("transient failure")
    return "success"


# flaky()  # retries up to 3 times before propagating the final ValueError


# Note the three layers of nesting: retry(times=3, ...) returns "decorator",
# decorator(func) returns "wrapper", and wrapper is what actually replaces
# the original function. This is what lets @retry(times=3) work, as opposed
# to a plain decorator like @retry which only takes the function itself.`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "Write a generator function for the Fibonacci sequence.",
      prompt:
        "Write a Python generator function fibonacci() that lazily yields an infinite sequence of Fibonacci numbers, and show how to take the first 10 values from it.",
      difficulty: "HARD",
      tags: ["generators", "coding-exercise", "iterators"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `from itertools import islice


def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b


# Take the first 10 values without ever materializing an infinite list
first_10 = list(islice(fibonacci(), 10))
print(first_10)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Or iterate manually, stopping on some condition
gen = fibonacci()
for value in gen:
    if value > 50:
        break
    print(value)`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "Implement a context manager class that times a block of code.",
      prompt:
        "Write a class-based context manager Timer that measures and prints the elapsed wall-clock time of the code inside a with block, and also exposes the elapsed time as an attribute afterward.",
      difficulty: "HARD",
      tags: ["context-managers", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `import time


class Timer:
    def __init__(self, label="block"):
        self.label = label
        self.elapsed = None

    def __enter__(self):
        self._start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self._start
        print(f"{self.label} took {self.elapsed:.6f}s")
        return False  # let any exception raised inside the block propagate


with Timer("expensive computation") as t:
    total = sum(i * i for i in range(1_000_000))

print(f"recorded elapsed time: {t.elapsed:.6f}s")


# Even if the block raises, __exit__ still runs and elapsed is still recorded,
# demonstrating the guaranteed-cleanup property of context managers:
try:
    with Timer("failing block") as t2:
        raise RuntimeError("boom")
except RuntimeError:
    print(f"failed after {t2.elapsed:.6f}s")`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "Write a function to flatten an arbitrarily nested list.",
      prompt:
        "Write a Python function flatten(nested) that takes a list which may contain arbitrarily deeply nested lists and returns a single flat list of all the non-list elements, in order.",
      difficulty: "HARD",
      tags: ["recursion", "coding-exercise", "data-structures"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `def flatten(nested: list) -> list:
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result


print(flatten([1, [2, 3, [4, 5, [6]], 7], 8]))
# [1, 2, 3, 4, 5, 6, 7, 8]

print(flatten([]))
# []

print(flatten([1, [], [2, [3]]]))
# [1, 2, 3]


# Iterative version using an explicit stack, avoiding Python's recursion
# limit for extremely deeply nested input:
def flatten_iterative(nested: list) -> list:
    result = []
    stack = list(reversed(nested))
    while stack:
        item = stack.pop()
        if isinstance(item, list):
            stack.extend(reversed(item))
        else:
            result.append(item)
    return result


print(flatten_iterative([1, [2, [3, [4, [5]]]]]))
# [1, 2, 3, 4, 5]`,
          codeLanguage: "python",
        },
      ],
    },
    {
      title: "Reverse a singly linked list.",
      prompt:
        "Given the head of a singly linked list, write a function to reverse it in place and return the new head. Implement both an iterative and a recursive version.",
      difficulty: "HARD",
      tags: ["linked-list", "algorithms", "coding-exercise"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_iterative(head: ListNode | None) -> ListNode | None:
    prev = None
    current = head
    while current is not None:
        next_node = current.next  # save before overwriting
        current.next = prev       # reverse the pointer
        prev = current
        current = next_node
    return prev  # prev is the new head


def reverse_recursive(head: ListNode | None) -> ListNode | None:
    # Base case: empty list or single node is already "reversed"
    if head is None or head.next is None:
        return head

    new_head = reverse_recursive(head.next)
    # head.next is currently the last node of the reversed sublist;
    # point it back at head, and clear head's old forward pointer.
    head.next.next = head
    head.next = None
    return new_head


def to_list(head):
    values = []
    while head:
        values.append(head.val)
        head = head.next
    return values


def from_list(values):
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


head = from_list([1, 2, 3, 4, 5])
print(to_list(reverse_iterative(head)))  # [5, 4, 3, 2, 1]

head2 = from_list([1, 2, 3, 4, 5])
print(to_list(reverse_recursive(head2)))  # [5, 4, 3, 2, 1]

# Iterative: O(n) time, O(1) extra space.
# Recursive: O(n) time, O(n) extra space due to the call stack.`,
          codeLanguage: "python",
        },
      ],
    },
  ],
};
