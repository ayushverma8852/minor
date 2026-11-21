// Comprehensive Realistic Interview Question Bank for Technical & HR Preparation
// Covers: Java, Python, JavaScript, React, SQL, and HR (Behavioral) across Beginner, Intermediate, and Advanced

export const ALL_INTERVIEW_QUESTIONS = [
  // ==========================================
  // 1. JAVA QUESTIONS
  // ==========================================
  {
    id: 'java-b-01',
    technology: 'Java',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'OOP Principles (Polymorphism & Inheritance)',
    question: 'Explain the four core principles of Object-Oriented Programming in Java. How do method overloading and method overriding differ?',
    hint: 'Mention Encapsulation, Abstraction, Inheritance, and Polymorphism. Compare compile-time vs runtime binding.',
    keywords: ['encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'overloading', 'overriding', 'compile-time', 'runtime', 'signature'],
    evaluationCriteria: [
      'Defines the 4 pillars (Encapsulation, Abstraction, Inheritance, Polymorphism)',
      'Explains compile-time polymorphism (overloading) with same method name but different parameter list',
      'Explains runtime polymorphism (overriding) where subclass provides specific implementation with identical signature',
      'Mentions use of @Override annotation and super keyword'
    ],
    sampleIdealAnswer: 'The four core pillars of Java OOP are: 1) Encapsulation (bundling data and methods with private fields and public getters/setters), 2) Abstraction (hiding implementation details using abstract classes and interfaces), 3) Inheritance (code reuse via the extends keyword), and 4) Polymorphism (ability of an object to take many forms). Method Overloading occurs in the same class at compile time when methods share the same name but differ in parameter count or types. Method Overriding occurs at runtime when a child class provides a specialized implementation of an inherited parent method using the exact same signature and return type.'
  },
  {
    id: 'java-b-02',
    technology: 'Java',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'Java Memory Architecture (Heap vs Stack)',
    question: 'What is the fundamental difference between Heap memory and Stack memory in Java? How are primitives and object references handled?',
    hint: 'Consider method frame lifecycles, garbage collection, and OutOfMemoryError vs StackOverflowError.',
    keywords: ['heap', 'stack', 'primitives', 'references', 'garbage collection', 'lifespan', 'stack overflow', 'out of memory'],
    evaluationCriteria: [
      'Explains Stack stores method execution frames, local primitive variables, and references to objects',
      'Explains Heap stores actual object instances and class data',
      'Discusses lifecycle: stack memory is freed automatically upon method return, heap is cleaned by the Garbage Collector',
      'Mentions StackOverflowError vs OutOfMemoryError'
    ],
    sampleIdealAnswer: 'In the Java Virtual Machine, Stack memory is allocated per thread and stores local variables, primitive data types, and references to objects. When a method finishes execution, its stack frame is instantly popped and reclaimed. In contrast, Heap memory is a shared memory space used for dynamic allocation of actual objects (created via the new keyword) and JRE classes. Objects on the heap are not freed immediately; they remain until the Garbage Collector identifies them as unreferenced and reclaims their memory.'
  },
  {
    id: 'java-i-01',
    technology: 'Java',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'Collections Framework (HashMap Internal Working)',
    question: 'How does Java HashMap work internally? What happens when a hash collision occurs, and how did Java 8 improve HashMap collision resolution?',
    hint: 'Discuss hashCode(), equals(), buckets, linked lists, and balanced red-black trees when threshold is reached.',
    keywords: ['hashmap', 'hashcode', 'equals', 'bucket', 'collision', 'linked list', 'red-black tree', 'treeify', 'o(1)', 'o(log n)'],
    evaluationCriteria: [
      'Explains hashing: key.hashCode() is calculated to determine the array bucket index',
      'Describes handling collisions: multiple keys landing in the same bucket form a LinkedList',
      'Explains key uniqueness check using equals() method',
      'Highlights Java 8 optimization: converts LinkedList to Red-Black Tree when bucket exceeds TREEIFY_THRESHOLD (8 items), reducing worst-case lookup from O(n) to O(log n)'
    ],
    sampleIdealAnswer: 'A Java HashMap is backed by an array of Node buckets. When put(key, value) is called, it computes key.hashCode(), applies a hash function, and maps it to a bucket index. If multiple keys hash to the same bucket (collision), they are chained together in a linked list and differentiated via the equals() method. In Java 8+, if a single bucket reaches a threshold of 8 elements (TREEIFY_THRESHOLD) and the array capacity is at least 64, the linked list is transformed into a balanced Red-Black Tree. This guarantees lookup performance degrades to O(log n) rather than O(n) under heavy collision attacks.'
  },
  {
    id: 'java-i-02',
    technology: 'Java',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'Concurrency & Thread Safety (volatile vs synchronized)',
    question: 'Explain the difference between the `volatile` keyword and the `synchronized` block in Java multi-threading. What is the Java Memory Model (JMM) visibility problem?',
    hint: 'Think about CPU caching, atomic operations, happens-before relationship, and mutual exclusion.',
    keywords: ['volatile', 'synchronized', 'visibility', 'atomicity', 'cpu cache', 'main memory', 'lock', 'thread safety', 'happens-before'],
    evaluationCriteria: [
      'Explains volatile ensures visibility across CPU thread caches by forcing reads/writes directly to main memory',
      'Clarifies volatile does not provide atomicity (e.g. count++ is not atomic with volatile)',
      'Explains synchronized provides both mutual exclusion (atomicity) and visibility through monitor locks',
      'Mentions overhead differences and when to use each'
    ],
    sampleIdealAnswer: 'In modern multi-core processors, each thread keeps a local CPU cache of variables. The volatile keyword guarantees visibility: any write to a volatile variable is immediately flushed to main RAM, and any read bypasses CPU caches to fetch the freshest value, establishing a happens-before relationship. However, volatile does not guarantee atomicity for compound actions like incrementation (i++). The synchronized keyword provides both mutual exclusion (only one thread holds the monitor lock) and visibility guarantees, ensuring atomic execution of code blocks at the cost of higher locking overhead.'
  },
  {
    id: 'java-a-01',
    technology: 'Java',
    difficulty: 'Advanced',
    type: 'Technical',
    topic: 'JVM Garbage Collection & Memory Tuning',
    question: 'Describe JVM Garbage Collection generations (Young, Old, Metaspace) and compare GC algorithms such as G1GC vs ZGC. How would you diagnose a memory leak?',
    hint: 'Discuss Eden, Survivor spaces, tenuring threshold, stop-the-world pauses, heap dumps, and JVisualVM/Memory Analyzer.',
    keywords: ['garbage collection', 'eden', 'survivor', 'young generation', 'old generation', 'g1gc', 'zgc', 'stop-the-world', 'heap dump', 'memory leak'],
    evaluationCriteria: [
      'Breaks down Heap generations: Eden, Survivor S0/S1, Tenured/Old generation, and Metaspace',
      'Explains object promotion based on surviving minor GC cycles up to tenuring threshold',
      'Compares G1GC (region-based, predictable pauses) with low-latency collectors like ZGC or Shenandoah (<1ms STW)',
      'Outlines memory leak diagnostics: heap dumps (jcmd/jmap), MAT analysis, detecting unclosed resources or static collections'
    ],
    sampleIdealAnswer: 'The JVM heap is split into the Young Generation (Eden and two Survivor spaces S0/S1) and Old Generation, based on the weak generational hypothesis that most objects die young. Objects are allocated in Eden; survivors of Minor GCs are copied between S0 and S1 until reaching a tenuring threshold, where they are promoted to the Old Generation. G1GC divides the heap into equal-sized regions and collects regions with the highest garbage ratio to meet target pause times. ZGC is a concurrent, low-latency GC using colored pointers and load barriers with sub-millisecond pauses. To diagnose leaks, take a heap dump (jcmd GC.heap_dump), inspect retained heap in Eclipse MAT, and check for unremoved static collection references, unclosed streams, or thread-local leaks.'
  },

  // ==========================================
  // 2. PYTHON QUESTIONS
  // ==========================================
  {
    id: 'py-b-01',
    technology: 'Python',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'Data Types & Mutability',
    question: 'Explain the difference between mutable and immutable data types in Python. Give three examples of each and explain what happens when passing them to functions.',
    hint: 'Consider lists vs tuples, dictionaries vs strings, and pass-by-object-reference semantics.',
    keywords: ['mutable', 'immutable', 'list', 'tuple', 'dict', 'string', 'pass by reference', 'id', 'memory'],
    evaluationCriteria: [
      'Defines mutable: objects whose state/value can be altered in-place without changing memory ID (list, dict, set)',
      'Defines immutable: objects that cannot be modified after creation; modifications create a new object (int, float, string, tuple)',
      'Explains function argument passing: mutating a list inside a function affects the caller, whereas reassigning an immutable variable creates a local copy'
    ],
    sampleIdealAnswer: 'In Python, an object is mutable if its state or content can be changed in-place without changing its memory address (id). Examples of mutable types include lists, dictionaries, and sets. Immutable types cannot be modified in-place; any operation creates a new object in memory. Examples include integers, strings, and tuples. Python uses "pass-by-object-reference": if you pass a mutable list to a function and call .append(), the caller sees the change. But if you modify an immutable string, Python creates a new object in the local scope leaving the original untouched.'
  },
  {
    id: 'py-b-02',
    technology: 'Python',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'List Comprehensions & Generator Expressions',
    question: 'What are list comprehensions and generator expressions in Python? When would you prefer a generator expression over a list comprehension?',
    hint: 'Think about syntax brackets vs parentheses, memory consumption, and lazy evaluation with next().',
    keywords: ['list comprehension', 'generator', 'lazy evaluation', 'memory efficiency', 'yield', 'brackets', 'parentheses'],
    evaluationCriteria: [
      'Shows syntax of list comprehension [x for x in iterable if condition]',
      'Contrasts with generator expression (x for x in iterable if condition)',
      'Highlights memory efficiency: list comprehension creates entire collection in memory at once, generator yields items one at a time on demand',
      'Recommends generators for streaming large datasets or infinite sequences'
    ],
    sampleIdealAnswer: 'A list comprehension provides a concise syntax for creating new lists by evaluating an expression over an iterable, e.g., [x*2 for x in data if x > 0]. It eagerly evaluates and allocates memory for the entire list immediately. A generator expression uses parentheses (x*2 for x in data if x > 0) and employs lazy evaluation: it computes items on-the-fly only when iterated over using next() or in a loop. Generator expressions are preferred when processing massive files or large datasets because they consume virtually constant O(1) memory instead of allocating gigabytes in RAM.'
  },
  {
    id: 'py-i-01',
    technology: 'Python',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'Python Decorators & Closures',
    question: 'How do Python decorators work under the hood? Write or explain a decorator that measures and logs the execution time of a function.',
    hint: 'Recall first-class functions, inner wrapper functions, *args and **kwargs, and functools.wraps.',
    keywords: ['decorator', 'closure', 'wrapper', 'functools.wraps', 'args', 'kwargs', 'higher order function', 'timing'],
    evaluationCriteria: [
      'Explains that functions are first-class citizens in Python and can be passed as arguments and returned',
      'Defines decorator syntax @my_decorator as syntactic sugar for func = my_decorator(func)',
      'Shows inner wrapper receiving *args and **kwargs to handle arbitrary signatures',
      'Mentions using @functools.wraps(func) to preserve original docstring and function metadata'
    ],
    sampleIdealAnswer: 'A Python decorator is a higher-order function that takes another function as input, extends its behavior without modifying its source code, and returns a callable wrapper. Under the hood, @timing_decorator above def my_func() is equivalent to my_func = timing_decorator(my_func). The decorator defines an inner wrapper function that accepts (*args, **kwargs), records start_time = time.time(), calls the original function result = func(*args, **kwargs), logs elapsed time, and returns the result. Decorators use @functools.wraps(func) to preserve the original function name and docstrings.'
  },
  {
    id: 'py-i-02',
    technology: 'Python',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'Global Interpreter Lock (GIL) & Concurrency',
    question: 'What is the Python Global Interpreter Lock (GIL)? How does it affect CPU-bound versus I/O-bound multi-threaded programs, and how do you achieve true parallelism in Python?',
    hint: 'Discuss CPython reference counting, threading module vs multiprocessing module, and asyncio.',
    keywords: ['gil', 'global interpreter lock', 'cpython', 'cpu-bound', 'io-bound', 'multiprocessing', 'threading', 'asyncio', 'parallelism'],
    evaluationCriteria: [
      'Defines GIL as a mutex in CPython that prevents multiple native threads from executing Python bytecodes simultaneously',
      'Explains why it exists: thread-safe memory management and reference counting in CPython',
      'Clarifies that multi-threading works well for I/O-bound tasks (network, disk) because the GIL is released during I/O',
      'Explains that CPU-bound operations require the multiprocessing module or process pools to bypass the GIL with multiple OS processes'
    ],
    sampleIdealAnswer: 'The Global Interpreter Lock (GIL) is a mutual-exclusion lock used by the CPython interpreter to ensure only one thread executes Python bytecode at a time, protecting CPython memory management and reference counts from race conditions. For I/O-bound tasks (like web scraping, API calls, or database queries), standard multi-threading or asyncio is very effective because threads release the GIL while waiting on network or disk I/O. However, for CPU-bound tasks (like matrix multiplication or image processing), threads cannot utilize multiple CPU cores concurrently. True CPU parallelism requires the multiprocessing module, ProcessPoolExecutor, or C-extensions like NumPy.'
  },
  {
    id: 'py-a-01',
    technology: 'Python',
    difficulty: 'Advanced',
    type: 'Technical',
    topic: 'Metaclasses, Descriptors & Memory Management',
    question: 'What are Python descriptors and metaclasses? Explain the `__get__`, `__set__`, and `__new__` vs `__init__` hooks and give a practical use case for either.',
    hint: 'Mention how properties work, ORM field validation, type creation with type(name, bases, attrs), and custom class construction.',
    keywords: ['descriptor', 'metaclass', '__get__', '__set__', '__new__', 'type', 'orm', 'validation', 'attribute lookup'],
    evaluationCriteria: [
      'Defines descriptor as an object attribute with binding behavior, implementing __get__, __set__, or __delete__',
      'Connects descriptors to @property, staticmethod, and ORM columns (e.g. Django/SQLAlchemy model fields)',
      'Defines metaclass as the class of a class (type is the default metaclass)',
      'Contrasts __new__ (creates and returns class/object instance) with __init__ (initializes instance)'
    ],
    sampleIdealAnswer: 'A descriptor is a Python object that defines __get__(), __set__(), or __delete__() methods, overriding default attribute lookup. Python properties, methods, and ORM column definitions (like in SQLAlchemy or Django) are implemented as descriptors, providing encapsulated validation when reading or assigning attributes. Metaclasses are the "blueprints" that construct classes themselves: just as an object is an instance of a class, a class is an instance of a metaclass (inheriting from type). Metaclasses override __new__ to intercept class creation, dynamically validating methods, auto-registering plugins, or injecting schema definitions at import time before __init__ initializes the class.'
  },

  // ==========================================
  // 3. JAVASCRIPT QUESTIONS
  // ==========================================
  {
    id: 'js-b-01',
    technology: 'JavaScript',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'Scope, Hoisting & Var vs Let vs Const',
    question: 'Explain the differences between `var`, `let`, and `const` in JavaScript. What is the Temporal Dead Zone (TDZ) and how does hoisting behave for each?',
    hint: 'Discuss function scope vs block scope, re-declaration, re-assignment, and variable declaration lifecycle.',
    keywords: ['var', 'let', 'const', 'hoisting', 'temporal dead zone', 'tdz', 'block scope', 'function scope', 'reassignment'],
    evaluationCriteria: [
      'Explains var is function-scoped (or globally scoped) and can be re-declared and updated',
      'Explains let and const are block-scoped (bounded by {}) and cannot be re-declared in the same scope',
      'Clarifies const requires initialization and prevents reassignment of the variable binding',
      'Explains hoisting: var is hoisted and initialized to undefined; let and const are hoisted but remain uninitialized in the Temporal Dead Zone (TDZ) until execution reaches their declaration'
    ],
    sampleIdealAnswer: 'var is function-scoped and allows re-declaration and reassignment. When hoisted to the top of its scope, var is initialized with undefined, which can introduce silent runtime bugs. In ES6, let and const introduced block scoping (enclosed within curly braces {}). let allows reassignment, while const binds a constant reference that cannot be reassigned. Both let and const are hoisted by the JavaScript engine, but they are not initialized; accessing them before their line of declaration throws a ReferenceError because they reside in the Temporal Dead Zone (TDZ).'
  },
  {
    id: 'js-b-02',
    technology: 'JavaScript',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'Closures & Practical Applications',
    question: 'What is a closure in JavaScript? Explain how lexical scope enables closures and describe a real-world scenario where closures are useful.',
    hint: 'Think about functions retaining access to outer variables, data privacy (encapsulation), and factory functions or debouncing.',
    keywords: ['closure', 'lexical scope', 'outer function', 'inner function', 'data privacy', 'encapsulation', 'garbage collection'],
    evaluationCriteria: [
      'Defines closure: a function bundled with references to its surrounding lexical environment',
      'Explains that inner functions retain access to outer function variables even after the outer function has returned',
      'Identifies practical use cases: private variables/modules, function factories, event listeners, or memoization/debounce'
    ],
    sampleIdealAnswer: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment). In JavaScript, whenever a function is created, it maintains access to variables declared in its outer scope. Even after the outer function finishes executing and returns, the inner function retains access to those outer variables in memory because the engine keeps the scope chain alive. Common real-world applications include creating private variables and methods (encapsulation), implementing function currying and factory functions, and managing state in asynchronous event handlers or timers.'
  },
  {
    id: 'js-i-01',
    technology: 'JavaScript',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'The Event Loop, Microtasks & Macrotasks',
    question: 'How does the JavaScript Event Loop work? In what order will synchronous code, Promises (microtasks), and setTimeout (macrotasks) execute?',
    hint: 'Mention the call stack, Web APIs, Microtask Queue (job queue), Macrotask Queue (task queue), and single-threaded execution.',
    keywords: ['event loop', 'call stack', 'microtask', 'macrotask', 'promises', 'settimeout', 'queue', 'single threaded'],
    evaluationCriteria: [
      'Explains JavaScript is single-threaded and executes code on the Call Stack',
      'Distinguishes Web APIs from task queues',
      'Differentiates Microtask Queue (Promise reactions, queueMicrotask, MutationObserver) from Macrotask Queue (setTimeout, setInterval, I/O)',
      'Explains execution order: Stack drains completely -> Microtask queue drains completely -> One Macrotask is picked from task queue -> repeat'
    ],
    sampleIdealAnswer: 'JavaScript runs in a single-threaded runtime using the Call Stack and Event Loop. Synchronous statements execute sequentially on the Call Stack. Asynchronous tasks (like timers or fetch requests) are handed off to browser Web APIs. When they resolve, callbacks enter either the Microtask Queue (Promise .then/.catch callbacks, queueMicrotask) or the Macrotask Queue (setTimeout, setInterval, I/O events). The Event Loop constantly checks if the Call Stack is empty. Once empty, it completely drains all pending jobs in the Microtask Queue before executing the next single Macrotask. Therefore, a resolved Promise always executes before a 0ms setTimeout.'
  },
  {
    id: 'js-i-02',
    technology: 'JavaScript',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'Prototypal Inheritance & The Prototype Chain',
    question: 'How does prototypal inheritance work in JavaScript? How does the `prototype` property differ from `__proto__`, and what happens during property lookup?',
    hint: 'Discuss constructor functions, Object.create, prototype chain traversal, and Object.prototype.',
    keywords: ['prototype', '__proto__', 'prototypal inheritance', 'prototype chain', 'constructor', 'object.create', 'null'],
    evaluationCriteria: [
      'Explains that every JavaScript object has an internal hidden link to another object called its prototype (__proto__)',
      'Explains .prototype is a property on constructor functions used as the prototype for instances created with new',
      'Describes the lookup chain: if a property is not found on the instance, engine traverses up the prototype chain until found or reaching null (Object.prototype.__proto__)',
      'Mentions modern ES6 classes are syntactical sugar over prototypes'
    ],
    sampleIdealAnswer: 'Unlike class-based languages like Java, JavaScript uses prototypal inheritance, where objects inherit directly from other objects. Every object has an internal link, [[Prototype]] (accessible via Object.getPrototypeOf(obj) or __proto__), pointing to its parent prototype. The .prototype property belongs to constructor functions and defines the shared blueprint that instances will inherit when instantiated with the new keyword. When accessing obj.prop, the engine checks obj directly; if not found, it traverses up the prototype chain step-by-step until reaching Object.prototype, and finally null, returning undefined if still unfound.'
  },
  {
    id: 'js-a-01',
    technology: 'JavaScript',
    difficulty: 'Advanced',
    type: 'Technical',
    topic: 'Debouncing vs Throttling & Memory Leaks',
    question: 'Explain the difference between Debounce and Throttle techniques in JavaScript. Also describe three common causes of memory leaks in single-page applications and how to prevent them.',
    hint: 'Think about search auto-suggest vs window scroll/resize, detached DOM nodes, uncleared intervals, and global variables.',
    keywords: ['debounce', 'throttle', 'memory leak', 'detached dom', 'setinterval', 'event listeners', 'closure leak'],
    evaluationCriteria: [
      'Differentiates Debounce (delays execution until inactivity period has elapsed, ideal for search typeaheads) from Throttle (ensures execution at most once every interval, ideal for scrolling/resizing)',
      'Identifies common SPA memory leaks: uncleared setInterval/setTimeout timers',
      'Identifies detached DOM nodes retained by closure references',
      'Identifies forgotten window event listeners or global variable pollution and discusses cleanup strategies'
    ],
    sampleIdealAnswer: 'Debouncing delays invoking a function until a specified idle period has elapsed since the last time it was triggered, making it ideal for search inputs and auto-complete queries. Throttling guarantees a function is executed at most once per defined time window, making it ideal for high-frequency events like window scrolling, mouse movement, or resizing. Common JavaScript memory leaks include: 1) Uncleared timers (setInterval) retaining referenced variables, 2) Event listeners attached to window or DOM elements that are never removed when views unmount, and 3) Detached DOM trees where references to removed elements remain stored in arrays or closures, preventing Garbage Collection.'
  },

  // ==========================================
  // 4. REACT QUESTIONS
  // ==========================================
  {
    id: 'react-b-01',
    technology: 'React',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'State vs Props & Component Lifecycle',
    question: 'What is the difference between `props` and `state` in React? Why should you never mutate state directly?',
    hint: 'Discuss unidirectional data flow, immutability, re-renders, and setState / useState.',
    keywords: ['props', 'state', 'immutability', 'mutation', 're-render', 'usestate', 'unidirectional data flow'],
    evaluationCriteria: [
      'Explains props are read-only inputs passed from parent to child to configure components',
      'Explains state is internal, mutable data managed within the component that can change over time',
      'Explains why direct mutation (e.g. state.count = 5) fails: React relies on shallow reference comparison (Object.is) to trigger re-renders; mutating state in-place will not trigger a UI update and breaks memoization'
    ],
    sampleIdealAnswer: 'In React, props (short for properties) are read-only inputs passed downward from a parent component to configure child components, adhering to unidirectional data flow. In contrast, state is private, local data managed within the component using hooks like useState. You must never mutate state directly (e.g., this.state.items.push(x) or myObj.name = "new") because React checks state changes using shallow reference equality (Object.is). In-place mutation keeps the memory reference identical, so React assumes nothing changed and skips re-rendering the UI. Instead, always use setter functions with immutable updates (e.g., setItems([...items, x])).'
  },
  {
    id: 'react-b-02',
    technology: 'React',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'Virtual DOM & Keys in Lists',
    question: 'What is the Virtual DOM and how does React Reconciliation work? Why are unique `key` props necessary when rendering dynamic lists in React?',
    hint: 'Think about diffing heuristic O(n), index as key pitfalls, browser reflow costs, and DOM reordering.',
    keywords: ['virtual dom', 'reconciliation', 'fiber', 'keys', 'diffing', 'reflow', 'repaint', 'index as key'],
    evaluationCriteria: [
      'Defines Virtual DOM as an in-memory lightweight JavaScript representation of real DOM',
      'Explains reconciliation compares new VDOM tree with previous snapshot using heuristic O(n) diffing to apply batch real DOM updates',
      'Explains keys give elements a stable identity across renders, allowing React to match existing DOM nodes when items are added, removed, or reordered',
      'Warns against using array index as key when list order can change'
    ],
    sampleIdealAnswer: 'The Virtual DOM is an in-memory representation of the actual DOM nodes. When state changes, React constructs a new Virtual DOM tree and diffs it against the previous one using its reconciliation algorithm (Fiber). Rather than recalculating layout and repainting pixels on the real browser DOM for every micro-update, React calculates the minimal required diff and updates the real DOM in a batched pass. The key prop gives each list element a stable, unique identity. During reconciliation, keys allow React to track which items were added, deleted, or merely reordered. Using array index as keys causes subtle UI bugs, incorrect form inputs, and poor rendering performance when sorting or filtering.'
  },
  {
    id: 'react-i-01',
    technology: 'React',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'useEffect Hook & Cleanup Lifecycle',
    question: 'Explain the purpose and execution order of `useEffect` dependencies and cleanup functions. Provide an example of how omitting dependencies causes stale closures or bugs.',
    hint: 'Discuss mount, dependency changes, unmount, AbortController, and timers.',
    keywords: ['useeffect', 'dependency array', 'cleanup function', 'stale closure', 'abortcontroller', 'unmount', 'infinite loop'],
    evaluationCriteria: [
      'Explains dependency array configurations: empty [] (runs on mount), with deps [a, b] (runs on mount and when deps change), no array (runs after every render)',
      'Explains cleanup function timing: executes right before the effect re-runs with new dependencies, and when the component unmounts',
      'Describes stale closures: effects referencing outdated variables from a previous render frame when left out of the dependency array',
      'Mentions AbortController for cleaning up active network requests'
    ],
    sampleIdealAnswer: 'The useEffect hook manages side effects in functional components. Its dependency array controls execution: omitting it runs the effect after every render; an empty array [] runs it once on mount; providing dependencies [foo, bar] re-runs it only when their shallow references change. If a variable is referenced inside the effect but omitted from the dependency array, it creates a "stale closure" that reads frozen, outdated values from previous render cycles. The cleanup function returned by useEffect runs right before the effect re-executes with new values and immediately before component unmounting. It is essential for clearing timers, removing event listeners, and canceling in-flight fetch calls using AbortController.'
  },
  {
    id: 'react-i-02',
    technology: 'React',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'Performance Optimization (useMemo, useCallback, React.memo)',
    question: 'When should you use `React.memo`, `useMemo`, and `useCallback`? When might overusing these optimization techniques actually harm application performance?',
    hint: 'Discuss reference equality, shallow props comparisons, calculation caching, and memory overhead.',
    keywords: ['react.memo', 'usememo', 'usecallback', 'memoization', 'reference equality', 'props comparison', 'overhead'],
    evaluationCriteria: [
      'Explains React.memo wraps a component to skip re-rendering if its props are shallowly equal',
      'Explains useCallback returns a memoized callback function instance across renders to prevent unnecessary child re-renders',
      'Explains useMemo caches the result of an expensive calculation',
      'Highlights trade-offs: every hook has memory and CPU costs to evaluate dependency arrays; for cheap computations or non-memoized children, it adds unnecessary overhead'
    ],
    sampleIdealAnswer: 'React.memo is a higher-order component that prevents a functional component from re-rendering if its props have not changed by shallow comparison. useCallback caches a function definition between renders, preserving reference equality so child components wrapped in React.memo do not unnecessarily re-render when passed that function. useMemo caches the computed result of an expensive calculation. Overusing these hooks indiscriminately can degrade performance because comparing dependency arrays on every render and retaining functions in memory requires CPU and RAM overhead. If an operation is fast (e.g. simple filtering of 20 items) or child components are not memoized, adding useMemo/useCallback wastes resources.'
  },
  {
    id: 'react-a-01',
    technology: 'React',
    difficulty: 'Advanced',
    type: 'Technical',
    topic: 'React 18 Concurrent Features & Server Components',
    question: 'What are React 18 Concurrent Mode features such as `useTransition` and `useDeferredValue`? How do React Server Components (RSC) differ from traditional Client Components and SSR?',
    hint: 'Discuss non-blocking rendering, interruptible tasks, bundle size reduction, and client vs server execution boundaries.',
    keywords: ['concurrent mode', 'usetransition', 'usedeferredvalue', 'react server components', 'rsc', 'bundle size', 'suspense', 'ssr'],
    evaluationCriteria: [
      'Explains Concurrent React enables interruptible rendering so urgent updates (typing) are not blocked by heavy background rendering',
      'Explains useTransition marks state updates as non-urgent transitions',
      'Explains useDeferredValue defers re-rendering non-critical UI parts based on latest data',
      'Differentiates Server Components: execute exclusively on the server, zero client bundle footprint, direct database access, rendered to a special streamable JSON format'
    ],
    sampleIdealAnswer: 'React 18 Concurrent Mode allows React to pause, resume, or discard rendering work to keep the browser responsive during CPU-intensive updates. useTransition lets developers classify state updates as non-urgent transitions (e.g., rendering large search results), giving priority to urgent user interactions like typing in inputs. useDeferredValue defers updating a secondary value until higher-priority renders complete. React Server Components (RSC) represent a paradigm shift: unlike traditional SSR which sends HTML that still requires full client-side JavaScript hydration, RSCs execute exclusively on the server. They have direct access to backends and databases, and their dependencies are never bundled into the client JavaScript bundle, achieving zero-bundle-size gains.'
  },

  // ==========================================
  // 5. SQL QUESTIONS
  // ==========================================
  {
    id: 'sql-b-01',
    technology: 'SQL',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'SQL Joins (Inner, Left, Right, Full)',
    question: 'Explain the differences between `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN` with examples. When will `NULL` values appear in query results?',
    hint: 'Visualize Venn diagrams of table records, matching keys, and unmatched rows.',
    keywords: ['inner join', 'left join', 'right join', 'full outer join', 'null', 'matching keys', 'venn diagram'],
    evaluationCriteria: [
      'Explains INNER JOIN returns only records with matching keys in both tables',
      'Explains LEFT JOIN returns all records from left table and matched records from right table (filling with NULL if no match)',
      'Explains RIGHT JOIN returns all records from right table and matched from left',
      'Explains FULL OUTER JOIN returns all rows from both tables, filling with NULL wherever match is absent'
    ],
    sampleIdealAnswer: 'SQL Joins combine rows from two or more tables based on a related column. 1) INNER JOIN returns only records where the join predicate matches in both tables. 2) LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table; if there is no match in the right table, columns from the right table are filled with NULLs. 3) RIGHT JOIN is the symmetrical inverse, returning all rows from the right table and matching left rows. 4) FULL OUTER JOIN returns all rows from both tables, pairing matching rows together and inserting NULLs on whichever side lacks a matching foreign key.'
  },
  {
    id: 'sql-b-02',
    technology: 'SQL',
    difficulty: 'Beginner',
    type: 'Technical',
    topic: 'Aggregation, GROUP BY & HAVING vs WHERE',
    question: 'What is the difference between the `WHERE` clause and the `HAVING` clause in SQL? Why can you not use aggregate functions like `COUNT()` in a `WHERE` clause?',
    hint: 'Consider query execution order: filtering rows before aggregation vs filtering grouped rows after aggregation.',
    keywords: ['where', 'having', 'group by', 'aggregate functions', 'count', 'sum', 'execution order', 'filtering'],
    evaluationCriteria: [
      'Explains WHERE filters individual rows before any grouping or aggregation takes place',
      'Explains HAVING filters groups after GROUP BY aggregation is computed',
      'Explains why aggregates cannot be in WHERE: WHERE executes prior to the calculation of aggregate functions like COUNT() or SUM()',
      'Provides query order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY'
    ],
    sampleIdealAnswer: 'In SQL, WHERE filters individual records before any grouping or aggregation occurs. It cannot contain aggregate functions like COUNT() or AVG() because rows have not yet been grouped at that stage of query evaluation. In contrast, HAVING filters the aggregated summary groups after the GROUP BY clause has compiled them. The logical SQL execution order is: FROM -> WHERE (filter raw rows) -> GROUP BY (create groups) -> HAVING (filter aggregated groups) -> SELECT (project expressions) -> ORDER BY (sort final set).'
  },
  {
    id: 'sql-i-01',
    technology: 'SQL',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'Database Indexing & B-Trees',
    question: 'How do database indexes work? What is the difference between a Clustered and a Non-Clustered index, and why does having too many indexes slow down `INSERT` and `UPDATE` operations?',
    hint: 'Mention B-Tree structures, physical row sorting, pointer lookups, and write amplification.',
    keywords: ['index', 'b-tree', 'clustered', 'non-clustered', 'primary key', 'pointer', 'insert', 'update', 'overhead'],
    evaluationCriteria: [
      'Explains index as a B-Tree data structure enabling logarithmic O(log n) lookups instead of full table scans O(n)',
      'Explains Clustered Index dictates the physical on-disk storage order of table data (only 1 per table, typically Primary Key)',
      'Explains Non-Clustered Index stores sorted key columns alongside row locators/pointers back to the actual data rows',
      'Explains write overhead: every INSERT, UPDATE, or DELETE must recalculate and balance all indexes on that table, causing write amplification'
    ],
    sampleIdealAnswer: 'A database index is a data structure (typically a self-balancing B+ Tree) that enables the storage engine to locate rows in O(log n) time without scanning the entire table. A Clustered Index determines the physical order of data on the disk; because data can only be physically sorted one way, a table can have only one clustered index (usually on the primary key). Non-clustered indexes are auxiliary structures containing sorted index keys and pointers (row IDs or clustered keys) pointing back to the data. While indexes drastically accelerate SELECT queries, having too many indexes harms write performance because every INSERT, UPDATE, or DELETE requires updating and re-balancing each corresponding B-Tree.'
  },
  {
    id: 'sql-i-02',
    technology: 'SQL',
    difficulty: 'Intermediate',
    type: 'Technical',
    topic: 'ACID Properties & Transaction Isolation Levels',
    question: 'Explain the ACID properties of relational databases. What are the four SQL transaction isolation levels and what concurrency anomalies (Dirty Read, Non-repeatable Read, Phantom Read) do they prevent?',
    hint: 'Discuss Atomicity, Consistency, Isolation, Durability. Compare Read Uncommitted, Read Committed, Repeatable Read, and Serializable.',
    keywords: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'read committed', 'repeatable read', 'serializable', 'dirty read', 'phantom read'],
    evaluationCriteria: [
      'Defines ACID: Atomicity (all or nothing), Consistency (preserves constraints), Isolation (concurrent operations do not interfere), Durability (committed data survives crashes)',
      'Lists 4 isolation levels in order: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
      'Explains Dirty Read (reading uncommitted changes)',
      'Explains Non-repeatable Read (re-reading a row gets updated values) and Phantom Read (re-querying returns newly inserted rows)'
    ],
    sampleIdealAnswer: 'ACID ensures reliable database transactions: Atomicity (all operations succeed or roll back completely), Consistency (database transitions between valid constraint states), Isolation (transactions execute without conflicting interference), and Durability (committed changes persist permanently to disk). The four standard isolation levels are: 1) Read Uncommitted (prone to Dirty Reads of uncommitted data), 2) Read Committed (prevents Dirty Reads by reading only committed rows), 3) Repeatable Read (prevents Dirty and Non-repeatable Reads by locking or snapshotting read rows), and 4) Serializable (highest level, strictly orders transactions to prevent Phantom Reads at the cost of concurrency throughput).'
  },
  {
    id: 'sql-a-01',
    technology: 'SQL',
    difficulty: 'Advanced',
    type: 'Technical',
    topic: 'Window Functions & Query Optimization (EXPLAIN)',
    question: 'What are SQL Window Functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`) and how do they differ from `GROUP BY`? How do you use `EXPLAIN ANALYZE` to diagnose slow queries?',
    hint: 'Discuss the OVER (PARTITION BY ... ORDER BY ...) clause, retaining row granularity, table scans vs index seeks, and execution plan costs.',
    keywords: ['window function', 'row_number', 'rank', 'dense_rank', 'partition by', 'explain analyze', 'table scan', 'index seek'],
    evaluationCriteria: [
      'Explains window functions perform calculations across a set of rows related to the current row without collapsing them into a single row like GROUP BY',
      'Contrasts ROW_NUMBER (unique sequence 1,2,3), RANK (ties share rank, skips next rank 1,2,2,4), and DENSE_RANK (ties share rank, does not skip 1,2,2,3)',
      'Explains OVER (PARTITION BY ... ORDER BY ...)',
      'Explains EXPLAIN ANALYZE: inspects execution plan (Sequential Scan vs Index Scan/Seek, hash joins, temporary disk spills, actual run time vs estimated cost)'
    ],
    sampleIdealAnswer: 'Window functions perform calculations across a subset of rows defined by the OVER (PARTITION BY ... ORDER BY ...) clause while preserving individual row granularity, unlike GROUP BY which collapses rows into summary records. ROW_NUMBER assigns a strictly unique sequential integer to each row. RANK assigns identical numbers to ties and skips subsequent ranks (1, 2, 2, 4), while DENSE_RANK assigns identical numbers to ties without skipping (1, 2, 2, 3). To diagnose slow queries, running EXPLAIN ANALYZE reveals the engine execution plan and actual runtime timings, showing whether the optimizer used full Sequential Scans instead of Index Seeks, inefficient nested loops, or excessive sorting in memory.'
  },

  // ==========================================
  // 6. HR & BEHAVIORAL QUESTIONS
  // ==========================================
  {
    id: 'hr-b-01',
    technology: 'HR',
    difficulty: 'Beginner',
    type: 'HR',
    topic: 'Self Introduction & Career Motivations',
    question: 'Tell me about yourself. What motivated you to pursue software engineering and why are you interested in our organization?',
    hint: 'Use the Present-Past-Future structure: who you are today, key academic/project experiences, and why this role fits your future career goals.',
    keywords: ['present', 'past', 'future', 'passion', 'projects', 'skills', 'alignment', 'growth', 'impact'],
    evaluationCriteria: [
      'Structures answer clearly using Present-Past-Future framework',
      'Highlights key technical skills, completed projects, and computer science foundation',
      'Articulates genuine passion for software engineering and problem solving',
      'Demonstrates research into company engineering culture or domain and explains personal alignment'
    ],
    sampleIdealAnswer: 'I am a final-year Computer Science student passionate about building scalable web applications and solving real-world software challenges. Over the past three years, I have built full-stack projects using React, Java, and SQL, including an interview preparation platform and an automated task tracker. I love understanding how systems work under the hood, from database indexing to front-end rendering performance. I am excited about joining your organization because of your reputation for engineering excellence and collaborative culture, where I can contribute to mission-critical products while growing into a well-rounded software engineer.'
  },
  {
    id: 'hr-i-01',
    technology: 'HR',
    difficulty: 'Intermediate',
    type: 'HR',
    topic: 'Conflict Resolution & Team Collaboration (STAR Method)',
    question: 'Describe a situation where you had a disagreement with a team member or technical peer regarding a design choice or task deadline. How did you handle it and what was the outcome?',
    hint: 'Structure using STAR: Situation, Task, Action, Result. Emphasize empathy, data-driven decisions, and objective evaluation.',
    keywords: ['star method', 'situation', 'task', 'action', 'result', 'communication', 'compromise', 'data driven', 'collaboration'],
    evaluationCriteria: [
      'Follows STAR framework clearly (Situation, Task, Action, Result)',
      'Frames disagreement professionally without placing blame on teammates',
      'Focuses on constructive communication, prototyping, or data-driven evaluation',
      'Shares concrete positive outcome and what was learned from the experience'
    ],
    sampleIdealAnswer: 'Situation: During a capstone project, our team disagreed on state management architecture: one developer wanted Redux Toolkit while another advocated React Context. Task: As the project was on a tight timeline, we needed to reach a consensus without blocking development. Action: I scheduled a short 30-minute sync where we listed requirements: application scale, team familiarity, and bundle size. Instead of debating theoretically, we built a small prototype of both approaches. We found Context was simpler and met all our immediate needs with zero extra dependencies. Result: The team aligned on Context, completed the module three days ahead of schedule, and maintained strong mutual trust.'
  },
  {
    id: 'hr-i-02',
    technology: 'HR',
    difficulty: 'Intermediate',
    type: 'HR',
    topic: 'Handling Failure, Deadlines & Pressure',
    question: 'Tell me about a time when a project or feature did not go according to plan or you missed a deadline. How did you react, what steps did you take, and what did you learn?',
    hint: 'Acknowledge responsibility, explain proactive stakeholder communication, root cause analysis, and mitigation steps.',
    keywords: ['accountability', 'proactive', 'communication', 'root cause', 'mitigation', 'learning', 'post-mortem'],
    evaluationCriteria: [
      'Demonstrates accountability rather than making excuses',
      'Communicates proactively with stakeholders or mentors before the crisis escalates',
      'Explains mitigation actions taken to salvage the project deliverables',
      'Shares a meaningful learning lesson incorporated into subsequent projects'
    ],
    sampleIdealAnswer: 'Situation: During an internship project, I underestimated the complexity of integrating a third-party payment gateway with legacy webhook authentication. Task: I was responsible for delivering the module by Friday, but by Wednesday I realized authentication discrepancies would require significant refactoring. Action: Rather than staying silent, I proactively alerted my mentor with a clear assessment of the blocker and a proposed two-day revised timeline. I worked extended hours, created unit tests for each webhook event, and paired with a senior engineer. Result: We shipped the feature with zero security vulnerabilities. I learned to build buffer time into third-party integrations and break tasks into verifiable milestones early.'
  },
  {
    id: 'hr-a-01',
    technology: 'HR',
    difficulty: 'Advanced',
    type: 'HR',
    topic: 'Strengths, Weaknesses & Self-Development',
    question: 'What do you consider your greatest technical strength, and what is a genuine area of improvement you are actively working on?',
    hint: 'Avoid cliché fake weaknesses (like "I work too hard"). Choose an authentic technical skill you are improving and provide concrete steps taken.',
    keywords: ['strength', 'weakness', 'growth mindset', 'self-awareness', 'improvement', 'learning', 'actionable'],
    evaluationCriteria: [
      'Shares a genuine technical or professional strength backed by practical evidence',
      'Selects a real, self-aware weakness rather than a disguised brag',
      'Explains active, tangible steps currently taken to address the weakness',
      'Demonstrates a continuous learning and growth mindset'
    ],
    sampleIdealAnswer: 'My greatest technical strength is my curiosity and methodical approach to debugging: when faced with complex production issues, I analyze logs, isolate root causes systematically, and write regression tests rather than guessing quick patches. A genuine area I am actively improving is balancing perfectionism with delivery velocity. Earlier, I would spend excessive time refactoring code before it was functionally validated. To improve, I adopted the "Make it work, make it right, make it fast" principle, setting strict time-boxes for prototypes before iterating on deeper optimization.'
  }
];

// Helper to get questions based on user setup
export function getQuestionsForInterview({
  technology = 'Java',
  difficulty = 'Intermediate',
  questionCount = 5,
  interviewType = 'Technical'
}) {
  let pool = [];

  if (interviewType === 'HR') {
    pool = ALL_INTERVIEW_QUESTIONS.filter(q => q.type === 'HR');
  } else if (interviewType === 'Technical') {
    pool = ALL_INTERVIEW_QUESTIONS.filter(
      q => q.type === 'Technical' && q.technology.toLowerCase() === technology.toLowerCase()
    );
  } else {
    // Mixed: blend target technology + HR
    const techPool = ALL_INTERVIEW_QUESTIONS.filter(
      q => q.type === 'Technical' && q.technology.toLowerCase() === technology.toLowerCase()
    );
    const hrPool = ALL_INTERVIEW_QUESTIONS.filter(q => q.type === 'HR');
    pool = [...techPool, ...hrPool];
  }

  // Filter or prioritize by difficulty
  const matchedDifficulty = pool.filter(
    q => q.difficulty.toLowerCase() === difficulty.toLowerCase()
  );

  // If we have enough for exact difficulty, use them, otherwise supplement from same tech/type
  let combined = matchedDifficulty;
  if (combined.length < questionCount) {
    const remaining = pool.filter(q => !matchedDifficulty.includes(q));
    combined = [...combined, ...remaining];
  }

  // If still not enough (e.g. user selected 15 questions), supplement with other high quality questions
  if (combined.length < questionCount) {
    const others = ALL_INTERVIEW_QUESTIONS.filter(q => !combined.includes(q));
    combined = [...combined, ...others];
  }

  return combined.slice(0, questionCount);
}

// Convenient alias for positional parameters
export function getInterviewQuestions(technology = 'Java', difficulty = 'Intermediate', questionCount = 5) {
  return getQuestionsForInterview({ technology, difficulty, questionCount });
}
