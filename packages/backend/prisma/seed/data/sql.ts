import type { CategorySeed } from "../types";

export const sqlSeed: CategorySeed = {
  name: "SQL",
  slug: "sql",
  description:
    "Relational database fundamentals, query writing, schema design, and performance/concurrency topics, primarily using PostgreSQL syntax.",
  icon: "database",
  questions: [
    {
      title: "What is the difference between INNER JOIN and LEFT JOIN?",
      prompt:
        "Explain the difference between an INNER JOIN and a LEFT JOIN in SQL, and give an example using an employees table and a departments table.",
      difficulty: "EASY",
      tags: ["joins", "fundamentals"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `- An **INNER JOIN** returns only rows that have a matching row in both tables based on the join condition. If a row on either side has no match, it's excluded from the result entirely.
- A **LEFT JOIN** (LEFT OUTER JOIN) returns every row from the left table, and the matching row(s) from the right table if one exists; when there's no match, the right table's columns are filled with \`NULL\`.

A common use case for LEFT JOIN is finding rows in one table that have *no* corresponding row in another (e.g. employees with no department), which you can detect by filtering for \`NULL\` on the right side after the join.`,
          codeContent: `-- employees(id, name, department_id)
-- departments(id, name)

-- INNER JOIN: only employees that have a valid, matching department
SELECT e.name, d.name AS department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- LEFT JOIN: all employees, department_name is NULL if unassigned
SELECT e.name, d.name AS department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;

-- Find employees with no department at all
SELECT e.name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
WHERE d.id IS NULL;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is the difference between WHERE and HAVING?",
      prompt:
        "Explain the difference between the WHERE clause and the HAVING clause in SQL, including the order in which they're evaluated relative to GROUP BY.",
      difficulty: "EASY",
      tags: ["fundamentals", "aggregation", "group-by"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Both clauses filter rows, but at different stages of query evaluation:

- \`WHERE\` filters individual rows **before** any grouping/aggregation happens. It cannot reference aggregate functions like \`COUNT()\` or \`SUM()\` because those haven't been computed yet at that point.
- \`HAVING\` filters **groups** produced by \`GROUP BY\`, evaluated **after** aggregation. It's used specifically to filter on the result of an aggregate function.

Conceptual evaluation order: \`FROM\` → \`WHERE\` → \`GROUP BY\` → \`HAVING\` → \`SELECT\` → \`ORDER BY\` → \`LIMIT\`. This is why you can reference a \`SELECT\`-list alias in \`ORDER BY\` but generally not in \`WHERE\`.`,
          codeContent: `-- employees(id, name, department_id, salary)

-- WHERE filters rows before grouping (only high earners are grouped/counted)
SELECT department_id, COUNT(*) AS headcount
FROM employees
WHERE salary > 50000
GROUP BY department_id;

-- HAVING filters groups after aggregation (only departments with > 5 people)
SELECT department_id, COUNT(*) AS headcount
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;

-- They can be combined
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
WHERE salary > 30000
GROUP BY department_id
HAVING AVG(salary) > 80000;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is a primary key vs a foreign key?",
      prompt:
        "Explain the difference between a primary key and a foreign key in a relational database, and what constraints each enforces.",
      difficulty: "EASY",
      tags: ["schema-design", "constraints", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `- A **primary key** is a column (or set of columns) that uniquely identifies each row in a table. It enforces two constraints: **uniqueness** (no two rows can share the same value) and **NOT NULL** (every row must have a value). A table can have only one primary key, though that key can be composite (span multiple columns). Most databases automatically create a unique index backing the primary key, which also makes primary-key lookups fast.
- A **foreign key** is a column (or columns) in one table that references the primary key (or a unique key) of another table, establishing a relationship between the two. It enforces **referential integrity**: the database won't allow a foreign key value that doesn't exist in the referenced table's key column (with the exception of \`NULL\`, if the column is nullable, meaning "no relationship").

Foreign keys also let you define behavior for when the referenced row is deleted or updated, via \`ON DELETE\`/\`ON UPDATE\` clauses (\`CASCADE\`, \`SET NULL\`, \`RESTRICT\`, \`NO ACTION\`). For example, \`ON DELETE CASCADE\` on \`orders.customer_id\` referencing \`customers.id\` would automatically delete a customer's orders if the customer row is deleted, whereas \`ON DELETE RESTRICT\` would prevent deleting a customer that still has orders.

A simple example: in an \`orders\` table, \`id\` is the primary key, and \`customer_id\` is a foreign key referencing \`customers.id\` — this ensures every order is tied to a customer that actually exists.`,
        },
      ],
    },
    {
      title: "What is the difference between DELETE, TRUNCATE, and DROP?",
      prompt:
        "Explain the differences between the DELETE, TRUNCATE, and DROP statements in SQL, including their effect on table structure, performance, and transaction rollback behavior.",
      difficulty: "EASY",
      tags: ["ddl", "dml", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `All three remove data, but they operate at different levels:

- **DELETE** (DML) removes rows from a table one at a time based on an optional \`WHERE\` clause, firing any row-level triggers and writing each deletion to the transaction log/WAL. It's the slowest of the three for removing large amounts of data but is fully transactional — it can be rolled back, and without a \`WHERE\` clause it deletes all rows while leaving the table structure intact.
- **TRUNCATE** (DDL in most databases, though transactional in PostgreSQL) deallocates entire data pages at once instead of deleting row by row, making it much faster than an unqualified \`DELETE\` for clearing a whole table. It typically resets auto-increment/identity counters and doesn't fire per-row triggers. In PostgreSQL specifically, \`TRUNCATE\` can be rolled back within a transaction, but in many other databases it cannot be. It cannot take a \`WHERE\` clause — it always removes all rows.
- **DROP** (DDL) removes the entire table (or other object) definition from the database, including its structure, indexes, constraints, and data. After a \`DROP\`, the table no longer exists at all — to get any data back you'd need to restore from a backup.

Rule of thumb: use \`DELETE\` when you need to remove a subset of rows or need trigger/rollback behavior on specific rows; use \`TRUNCATE\` to quickly empty an entire table while keeping its schema; use \`DROP\` to remove the table (or database object) entirely.`,
        },
      ],
    },
    {
      title: "What is normalization and what are the first three normal forms?",
      prompt:
        "Explain database normalization and describe what 1NF, 2NF, and 3NF each require, with a brief example of a violation being fixed.",
      difficulty: "EASY",
      tags: ["schema-design", "normalization"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Normalization is the process of organizing a relational schema to reduce data redundancy and avoid update/insert/delete anomalies, typically by splitting a table into smaller, related tables.

- **1NF (First Normal Form)**: every column must hold atomic (indivisible) values, and each row must be uniquely identifiable — no repeating groups or multi-valued columns. Example violation: a \`phone_numbers\` column storing \`"555-1234, 555-5678"\` as a single comma-separated string. Fix: move phone numbers into a separate \`phone_numbers\` table with a foreign key back to the owner.

- **2NF (Second Normal Form)**: must already be in 1NF, and every non-key column must depend on the *entire* primary key, not just part of it (this only matters for tables with a composite primary key). Example violation: a table \`order_items(order_id, product_id, product_name, quantity)\` with a composite key \`(order_id, product_id)\` — \`product_name\` depends only on \`product_id\`, not on the full key. Fix: move \`product_name\` into a separate \`products\` table.

- **3NF (Third Normal Form)**: must already be in 2NF, and there should be no *transitive* dependencies — non-key columns must depend only on the primary key, not on other non-key columns. Example violation: an \`employees\` table with \`(id, department_id, department_name)\`, where \`department_name\` depends on \`department_id\`, not directly on \`id\`. Fix: move \`department_name\` into a separate \`departments\` table.

Higher forms exist (BCNF, 4NF, 5NF) but 1NF–3NF cover the vast majority of practical interview discussion. The tradeoff of normalization is that highly normalized schemas minimize redundancy and anomalies but require more joins to reassemble data, which is why some systems deliberately denormalize for read performance (see: denormalization).`,
        },
      ],
    },
    {
      title: "What is a NULL value and how does it behave in comparisons?",
      prompt:
        "Explain what NULL represents in SQL and describe how it behaves differently from a normal value in comparisons, arithmetic, and aggregate functions.",
      difficulty: "EASY",
      tags: ["null", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `\`NULL\` represents the absence of a known value — "unknown" or "not applicable" — rather than an empty string, zero, or false. It's not equal to anything, including itself, which trips up a lot of people writing SQL for the first time.

Key behaviors:

- \`NULL = NULL\` evaluates to \`NULL\` (not \`TRUE\`), because SQL uses three-valued logic (\`TRUE\`, \`FALSE\`, \`UNKNOWN\`) rather than plain boolean logic. To check for a null value you must use \`IS NULL\` / \`IS NOT NULL\`, never \`= NULL\`.
- Any arithmetic expression involving \`NULL\` produces \`NULL\` (e.g. \`5 + NULL\` is \`NULL\`).
- In a \`WHERE\` clause, a row is only included if the condition evaluates to \`TRUE\` — rows where the condition is \`UNKNOWN\` (because of a \`NULL\`) are excluded, which is a common source of "missing rows" bugs, especially with \`NOT IN\` subqueries that return a \`NULL\`.
- Most aggregate functions (\`SUM\`, \`AVG\`, \`COUNT(column)\`, \`MAX\`, \`MIN\`) ignore \`NULL\` values rather than treating them as zero. \`COUNT(*)\`, however, counts all rows regardless of \`NULL\`s.
- \`ORDER BY\` treats \`NULL\`s as either the lowest or highest possible value depending on the database (PostgreSQL sorts \`NULL\` last by default in ascending order); you can control this explicitly with \`NULLS FIRST\` / \`NULLS LAST\`.
- Functions like \`COALESCE(a, b, c)\` return the first non-null argument, commonly used to substitute a default value for a potential \`NULL\`.`,
        },
      ],
    },
    {
      title: "Write a query to find all employees earning more than $80,000.",
      prompt:
        "Given an employees table with columns (id, name, department_id, salary), write a query to return the name and salary of every employee earning more than $80,000, ordered by salary descending.",
      difficulty: "EASY",
      tags: ["select", "filtering", "fundamentals"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `SELECT name, salary
FROM employees
WHERE salary > 80000
ORDER BY salary DESC;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is the difference between UNION and UNION ALL?",
      prompt:
        "Explain the difference between UNION and UNION ALL when combining the results of two queries, including their impact on performance.",
      difficulty: "EASY",
      tags: ["set-operations", "fundamentals"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Both \`UNION\` and \`UNION ALL\` combine the result rows of two or more \`SELECT\` statements that have the same number of columns with compatible types, stacking them into a single result set.

- \`UNION\` removes duplicate rows from the combined result, which requires the database to sort or hash the entire result set to identify and eliminate duplicates — this adds overhead.
- \`UNION ALL\` keeps every row from every query as-is, including duplicates, and is therefore faster since no deduplication work is needed.

Rule of thumb: use \`UNION ALL\` whenever you know the result sets won't overlap or you don't care about duplicates (e.g. combining events from two different, non-overlapping sources) — it's the better default for performance. Only reach for \`UNION\` when you specifically need duplicate rows removed.`,
          codeContent: `-- Current employees and archived (former) employees, deduplicated
SELECT name, email FROM employees
UNION
SELECT name, email FROM archived_employees;

-- Same idea, but keep duplicates and skip the dedup cost
SELECT name, email FROM employees
UNION ALL
SELECT name, email FROM archived_employees;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is an index and why does it speed up queries?",
      prompt:
        "Explain what a database index is, how it typically speeds up query performance, and what tradeoffs come with adding one.",
      difficulty: "EASY",
      tags: ["indexing", "performance", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `An index is an auxiliary data structure — most commonly a B-tree — built on one or more columns of a table that lets the database find rows matching a condition without scanning every row in the table (a "sequential scan" or "full table scan").

Without an index, looking up \`WHERE email = 'x@example.com'\` requires checking every row, an \`O(n)\` operation. A B-tree index on \`email\` keeps values in sorted order with pointers to the corresponding rows, so the database can binary-search down the tree in roughly \`O(log n)\` to find matches, then follow pointers to fetch the actual row data.

Indexes speed up:
- Equality and range lookups (\`WHERE\`, \`JOIN ON\`) on indexed columns.
- Sorting (\`ORDER BY\`) on indexed columns, since the index is already sorted.
- Some aggregate queries (\`MIN\`/\`MAX\` on an indexed column can often be answered directly from the index).

Tradeoffs:
- **Write overhead**: every \`INSERT\`, \`UPDATE\`, or \`DELETE\` must also update every index on the affected columns, which slows down writes and uses extra disk space.
- **Storage cost**: each index is a separate structure that needs to be stored and kept in memory/cache to be effective.
- **Diminishing or negative returns**: an index on a low-cardinality column (e.g. a boolean \`is_active\` flag) often doesn't help much, since the query planner may still prefer a sequential scan if a large fraction of rows match.

In short, indexes trade write performance and storage for read performance — you generally index columns that are frequently used in \`WHERE\`, \`JOIN\`, and \`ORDER BY\` clauses on tables that are read far more often than written.`,
        },
      ],
    },
    {
      title: "Write a query to count employees per department.",
      prompt:
        "Given an employees table (id, name, department_id) and a departments table (id, name), write a query that returns each department's name along with the number of employees in it, including departments with zero employees.",
      difficulty: "EASY",
      tags: ["group-by", "aggregation", "joins"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `SELECT d.name AS department_name, COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.name
ORDER BY employee_count DESC;

-- Note: LEFT JOIN from departments (not employees) ensures departments
-- with no employees still appear, with a count of 0.
-- COUNT(e.id) (not COUNT(*)) is used so that unmatched rows (NULL e.id)
-- are correctly counted as 0 rather than 1.`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title:
        "What is the difference between CHAR, VARCHAR, and TEXT data types?",
      prompt:
        "Explain the differences between the CHAR, VARCHAR, and TEXT column types, including how they store data and when you'd choose each.",
      difficulty: "EASY",
      tags: ["data-types", "schema-design"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `- **CHAR(n)** is a fixed-length string type — values shorter than \`n\` are padded with trailing spaces to always occupy \`n\` characters of storage. It's rarely used today except for genuinely fixed-width codes (e.g. a 2-letter country code, a fixed-length hash).
- **VARCHAR(n)** is a variable-length string type with an enforced maximum length of \`n\` characters; it only uses as much storage as the actual content requires (plus a small length prefix), and does not pad shorter values.
- **TEXT** is a variable-length string type with no (or a very large, effectively unbounded) length limit.

In PostgreSQL specifically, \`CHAR(n)\`, \`VARCHAR(n)\`, and \`TEXT\` are all stored the same way under the hood and have essentially identical performance — PostgreSQL's documentation itself recommends just using \`TEXT\` (or \`VARCHAR\` without a length limit) unless you have a genuine reason to enforce a maximum length at the database layer, since a length constraint mainly serves as a data-validation guardrail rather than a performance optimization. This differs from some other databases (e.g. older MySQL storage engines), where \`VARCHAR\` vs \`TEXT\` had more significant storage/indexing implications, so the "best" choice can be slightly database-specific.

Practical guidance: use \`VARCHAR(n)\` when you want the database to enforce a specific max length (e.g. a username capped at 50 characters), and \`TEXT\` for open-ended content like descriptions or comments.`,
        },
      ],
    },
    {
      title:
        "What are window functions and how do they differ from GROUP BY aggregation?",
      prompt:
        "Explain what window functions are in SQL, how the OVER clause works, and how they differ from using GROUP BY to aggregate rows.",
      difficulty: "MEDIUM",
      tags: ["window-functions", "aggregation"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A window function computes a value across a set of related rows (a "window") for each individual row, **without collapsing those rows into a single output row** the way \`GROUP BY\` aggregation does. Every input row still appears in the output, each annotated with a computed value based on its window.

The window is defined with the \`OVER (...)\` clause, which can specify:
- \`PARTITION BY\` — splits rows into independent groups, similar to \`GROUP BY\`, but each row still appears individually in the output.
- \`ORDER BY\` — defines the order used for rank-, offset-, and running-total-style functions within each partition.
- An optional frame clause (\`ROWS BETWEEN ...\`) to further restrict which rows within the partition are considered (e.g. only the preceding 3 rows, for a rolling average).

Common window functions: \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`, \`LAG()\`/\`LEAD()\` (access a previous/next row's value), \`SUM()\`/\`AVG()\` used as a window function (e.g. for running totals), \`FIRST_VALUE()\`/\`LAST_VALUE()\`.

The key difference from \`GROUP BY\`: \`GROUP BY\` reduces N rows into fewer summary rows (one per group), losing the individual row detail unless you join back to it. A window function keeps all N rows and adds a computed column to each, which is exactly what you need for tasks like "show every employee's salary alongside their department's average salary" or "rank every order without losing the order-level detail."`,
          codeContent: `-- employees(id, name, department_id, salary)

-- Show every employee alongside their department's average salary,
-- without collapsing rows (unlike GROUP BY)
SELECT
  name,
  department_id,
  salary,
  AVG(salary) OVER (PARTITION BY department_id) AS dept_avg_salary
FROM employees;

-- Running total of salary within each department, ordered by hire_date
SELECT
  name,
  department_id,
  hire_date,
  salary,
  SUM(salary) OVER (
    PARTITION BY department_id
    ORDER BY hire_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM employees;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "Write a query to find the second-highest salary per department.",
      prompt:
        "Given an employees table (id, name, department_id, salary), write a query to find the second-highest salary in each department.",
      difficulty: "MEDIUM",
      tags: ["window-functions", "ranking", "subqueries"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `The cleanest approach is to rank salaries within each department using \`DENSE_RANK()\` (so tied top salaries are handled sensibly) in a subquery/CTE, then filter for rank 2 in the outer query. \`DENSE_RANK\` is preferred over \`ROW_NUMBER\` here because if two employees tie for the highest salary, \`ROW_NUMBER\` would arbitrarily call one of them rank 1 and the other rank 2, incorrectly treating the tied top salary as "second highest"; \`DENSE_RANK\` correctly gives both rank 1, and the true second-highest distinct salary gets rank 2.`,
          codeContent: `WITH ranked_salaries AS (
  SELECT
    department_id,
    name,
    salary,
    DENSE_RANK() OVER (
      PARTITION BY department_id
      ORDER BY salary DESC
    ) AS salary_rank
  FROM employees
)
SELECT department_id, name, salary
FROM ranked_salaries
WHERE salary_rank = 2;

-- Alternative without window functions, using a correlated subquery:
SELECT e1.department_id, e1.name, e1.salary
FROM employees e1
WHERE 1 = (
  SELECT COUNT(DISTINCT e2.salary)
  FROM employees e2
  WHERE e2.department_id = e1.department_id
    AND e2.salary > e1.salary
);`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is a self-join and when would you use one?",
      prompt:
        "Explain what a self-join is in SQL and give an example, such as finding employees who earn more than their manager.",
      difficulty: "MEDIUM",
      tags: ["joins", "self-join"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A self-join is simply a regular join where a table is joined to itself, typically used when a table has a relationship to another row in the *same* table — for example, an \`employees\` table where each row has a \`manager_id\` that references another row's \`id\` in the same table.

Since you're referencing the same table twice in one query, you must alias it with two different names (e.g. \`e\` for employee and \`m\` for manager) so the database — and you — can tell which occurrence a given column reference belongs to.

Common use cases: employee/manager hierarchies, finding pairs of rows with some relationship (e.g. products in the same category, people with the same birthday), or comparing consecutive rows (though window functions like \`LAG()\`/\`LEAD()\` often replace self-joins for that specific case).`,
          codeContent: `-- employees(id, name, salary, manager_id)

-- Find employees who earn more than their manager
SELECT e.name AS employee, e.salary AS employee_salary,
       m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;

-- Find pairs of employees in the same department (avoiding duplicate pairs
-- and an employee pairing with themselves)
SELECT e1.name AS employee_1, e2.name AS employee_2, e1.department_id
FROM employees e1
JOIN employees e2
  ON e1.department_id = e2.department_id
 AND e1.id < e2.id;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is a Common Table Expression (CTE)?",
      prompt:
        "Explain what a CTE (WITH clause) is in SQL, why you might use one instead of a subquery, and whether it's materialized.",
      difficulty: "MEDIUM",
      tags: ["cte", "query-structure"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A Common Table Expression, written with a \`WITH name AS (...)\` clause, defines a named, temporary result set that you can reference like a table within the rest of the query. It exists only for the duration of that single statement.

Why use a CTE instead of a nested subquery:
- **Readability**: breaking a complex query into named, logical steps (\`WITH active_customers AS (...), recent_orders AS (...)\`) reads top-to-bottom rather than nesting subqueries inside subqueries.
- **Reusability within the query**: a CTE can be referenced multiple times in the same statement without repeating its SQL, whereas a subquery would need to be duplicated (or the query restructured) to reuse it.
- **Recursive queries**: \`WITH RECURSIVE\` is the standard way to write recursive queries (e.g. traversing a tree/hierarchy), which isn't possible with a plain subquery.

On materialization: historically in PostgreSQL (before version 12), CTEs were always materialized — computed once as an "optimization fence" that the planner could not see through or push filters into. Since PostgreSQL 12, non-recursive CTEs are inlined by default (like a subquery) unless they're referenced multiple times, are recursive, or you explicitly force materialization with the \`MATERIALIZED\` keyword (and you can opt out with \`NOT MATERIALIZED\`). This matters for performance: a materialized CTE is computed once and reused, which is good if you reference it many times, but bad if the outer query only needs a small filtered slice of it, since filters can't be pushed down into a materialized CTE.`,
          codeContent: `-- Basic CTE for readability
WITH department_totals AS (
  SELECT department_id, SUM(salary) AS total_salary
  FROM employees
  GROUP BY department_id
)
SELECT d.name, dt.total_salary
FROM department_totals dt
JOIN departments d ON d.id = dt.department_id
ORDER BY dt.total_salary DESC;

-- Multiple CTEs referencing each other
WITH high_earners AS (
  SELECT * FROM employees WHERE salary > 100000
),
high_earner_departments AS (
  SELECT DISTINCT department_id FROM high_earners
)
SELECT * FROM departments WHERE id IN (SELECT department_id FROM high_earner_departments);`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What are ACID properties in the context of transactions?",
      prompt:
        "Explain the ACID properties (Atomicity, Consistency, Isolation, Durability) that database transactions provide, with a brief example for each.",
      difficulty: "MEDIUM",
      tags: ["transactions", "acid", "concurrency"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `ACID is a set of guarantees that relational database transactions provide to keep data correct even in the presence of concurrent access, crashes, or errors:

- **Atomicity**: a transaction's operations are all-or-nothing. If a transaction contains multiple statements (e.g. debit one account, credit another), either every statement's effects are committed, or none are — a crash or error midway triggers a full rollback, so you never end up with only the debit applied.
- **Consistency**: a transaction takes the database from one valid state to another, respecting all defined constraints, triggers, and rules (e.g. foreign keys, \`CHECK\` constraints, uniqueness). If committing a transaction would violate a constraint, it's rejected instead of leaving the database in an invalid state.
- **Isolation**: concurrently running transactions should not see each other's uncommitted intermediate state, and (depending on the isolation level chosen) should behave as if they ran one after another rather than interleaved. This is what prevents anomalies like one transaction reading a partially-updated row from another still-in-progress transaction (a "dirty read").
- **Durability**: once a transaction is committed, its effects are permanent, surviving even a subsequent crash or power loss — typically guaranteed by writing changes to a write-ahead log (WAL) on durable storage before acknowledging the commit.

A classic example tying it together: transferring $100 from account A to account B involves two updates (debit A, credit B) wrapped in a transaction. Atomicity ensures both happen or neither does; consistency ensures neither account goes negative if that's a constraint; isolation ensures another transaction reading account balances mid-transfer doesn't see a state where the money has left A but not yet arrived in B; durability ensures that once the transfer is committed, it survives a server crash immediately afterward.`,
        },
      ],
    },
    {
      title:
        "What is the difference between a clustered and non-clustered index?",
      prompt:
        "Explain the difference between a clustered index and a non-clustered (secondary) index, and how this concept applies to PostgreSQL specifically.",
      difficulty: "MEDIUM",
      tags: ["indexing", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `- A **clustered index** determines the actual physical order in which rows are stored on disk — the table data itself is organized as the index. Because of this, a table can have at most one clustered index (data can only be physically sorted one way), and lookups on the clustered key are extremely fast since the index leaf nodes *are* the row data.
- A **non-clustered (secondary) index** is a separate structure from the table data. It stores indexed column values along with a pointer back to the actual row (in SQL Server, a pointer to the row via the clustering key; in a heap-organized table, a direct row locator). A table can have many non-clustered indexes. Looking up via a non-clustered index typically means: search the index to find the pointer, then perform an extra lookup ("bookmark lookup" / "heap fetch") to retrieve the full row, unless the index alone contains all needed columns (a "covering index").

**How this applies to PostgreSQL**: PostgreSQL tables are fundamentally **heap-organized** — there is no true clustered index concept where data is continuously kept in index order. Every index in PostgreSQL, including the primary key's index, behaves like a "non-clustered" index elsewhere: it's a separate structure pointing to row locations (ctids) in the heap. PostgreSQL does offer a one-time \`CLUSTER\` command that physically reorders the table's rows on disk to match a chosen index, but this ordering is not automatically maintained as the table changes — you'd need to re-run \`CLUSTER\` periodically to keep the physical ordering in sync, so it's very different from SQL Server's continuously-maintained clustered index.

Interview takeaway: the "clustered vs non-clustered" distinction is most directly relevant to databases like SQL Server or MySQL/InnoDB (where the primary key *is* the clustered index by default). In PostgreSQL, all indexes are effectively secondary/non-clustered, and physical row order is a one-off, manually-triggered operation rather than a continuously maintained property.`,
        },
      ],
    },
    {
      title:
        "Write a query using RANK, DENSE_RANK, and ROW_NUMBER to rank employees by salary.",
      prompt:
        "Given an employees table (id, name, department_id, salary), write a query that shows each employee's salary rank within their department using ROW_NUMBER, RANK, and DENSE_RANK side by side, and explain how the three differ when there are ties.",
      difficulty: "MEDIUM",
      tags: ["window-functions", "ranking"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `All three assign a rank to each row within a window ordered by some column, but they treat ties (equal values) differently:

- \`ROW_NUMBER()\` assigns a strictly increasing, unique number to every row (\`1, 2, 3, 4, ...\`) regardless of ties — two rows with the same salary still get different, arbitrary-among-themselves numbers.
- \`RANK()\` gives tied rows the same rank, then **skips** the next rank(s) accordingly (\`1, 2, 2, 4\` — two rows tied for 2nd, so nobody gets rank 3).
- \`DENSE_RANK()\` also gives tied rows the same rank, but does **not** skip the next rank (\`1, 2, 2, 3\` — the next distinct value picks up right after).`,
          codeContent: `SELECT
  name,
  department_id,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS row_num,
  RANK()       OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_num,
  DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dense_rank_num
FROM employees
ORDER BY department_id, salary DESC;

-- Example output for a department with salaries [90000, 90000, 85000, 80000]:
-- salary  | row_num | rank_num | dense_rank_num
-- 90000   |    1    |    1     |       1
-- 90000   |    2    |    1     |       1
-- 85000   |    3    |    3     |       2
-- 80000   |    4    |    4     |       3`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is a correlated subquery?",
      prompt:
        "Explain what a correlated subquery is, how it differs from a regular subquery, and why it can be a performance concern.",
      difficulty: "MEDIUM",
      tags: ["subqueries", "performance"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A correlated subquery is a subquery that references a column from the outer query, which means it cannot be evaluated independently — its result depends on the current row being processed by the outer query. This is in contrast to an uncorrelated subquery, which can be evaluated once, on its own, regardless of the outer query's rows.

Performance concern: naively, a correlated subquery must be re-executed once for every row of the outer query (conceptually a nested-loop pattern), which can be very slow on large tables — O(n × m) in the worst case. Modern query planners (including PostgreSQL's) are often smart enough to rewrite common correlated subquery patterns (especially those used with \`EXISTS\`/\`IN\`) into a semi-join or hash join that avoids literally re-running the subquery per row, but this isn't guaranteed for every query shape — it's always worth checking \`EXPLAIN ANALYZE\` rather than assuming. In general, an equivalent \`JOIN\` or window function is often (though not always) more efficient and clearer than a correlated subquery.`,
          codeContent: `-- Correlated subquery: references e.department_id from the outer query,
-- so it conceptually re-evaluates per outer row
SELECT e.name, e.salary, e.department_id
FROM employees e
WHERE e.salary > (
  SELECT AVG(e2.salary)
  FROM employees e2
  WHERE e2.department_id = e.department_id  -- correlation to outer query
);

-- Equivalent, often more efficient, rewrite using a window function
SELECT name, salary, department_id
FROM (
  SELECT
    name, salary, department_id,
    AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
  FROM employees
) sub
WHERE salary > dept_avg;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title:
        "Write a query to find employees who earn more than their manager.",
      prompt:
        "Given an employees table (id, name, salary, manager_id), where manager_id references another row's id in the same table, write a query to list employees who earn a higher salary than their direct manager.",
      difficulty: "MEDIUM",
      tags: ["self-join", "filtering"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `SELECT
  e.name AS employee_name,
  e.salary AS employee_salary,
  m.name AS manager_name,
  m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary
ORDER BY e.salary DESC;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is the difference between EXISTS and IN?",
      prompt:
        "Explain the difference between using EXISTS and IN with a subquery in SQL, including how each handles NULLs and their typical performance characteristics.",
      difficulty: "MEDIUM",
      tags: ["subqueries", "performance"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Both are used to filter rows based on whether a related row exists in another table/subquery, but they behave differently in a couple of important ways:

- **NULL handling**: \`IN\` can behave surprisingly when the subquery returns any \`NULL\` values — \`x NOT IN (SELECT ...)\` will return zero rows (not the rows you expect) if the subquery's result set contains even one \`NULL\`, because of SQL's three-valued logic (comparing against an unknown value makes the whole condition \`UNKNOWN\` rather than \`TRUE\`/\`FALSE\`). \`NOT EXISTS\`, on the other hand, is unaffected by \`NULL\`s in the subquery's selected column, since \`EXISTS\` only cares about row presence, not the specific value(s) selected. This makes \`NOT EXISTS\` the safer default for "not in" style checks.
- **Evaluation style**: \`EXISTS\` short-circuits — the database can stop as soon as it finds one matching row, since it only needs a yes/no answer. \`IN\` conceptually needs the subquery's full result set to compare against (though query planners often optimize both into equivalent semi-join plans, so real-world performance is frequently similar for well-indexed queries).

General guidance: prefer \`EXISTS\`/\`NOT EXISTS\` for correlated existence checks, especially for "not in" logic where \`NULL\`s might sneak into the subquery's result — it's both safer and, in many databases, comparably or more efficient.`,
          codeContent: `-- IN: risky if department_id can be NULL in the subquery's result
SELECT name FROM employees
WHERE department_id NOT IN (
  SELECT id FROM departments WHERE budget < 100000
);
-- If any department.id is NULL, this returns ZERO rows unexpectedly.

-- NOT EXISTS: safe regardless of NULLs, and expresses intent clearly
SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM departments d
  WHERE d.id = e.department_id AND d.budget < 100000
);`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "Write a query to find duplicate rows in a table.",
      prompt:
        "Given a customers table (id, email, name), write a query to find every email address that appears more than once, along with how many times it appears.",
      difficulty: "MEDIUM",
      tags: ["group-by", "aggregation", "data-cleaning"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Group the rows by the column(s) that define a "duplicate," then use \`HAVING COUNT(*) > 1\` to keep only groups that occur more than once. To also see the actual duplicate row IDs (e.g. to decide which to delete), join back to the original table or use a window function.`,
          codeContent: `-- Find duplicate emails and how many times each appears
SELECT email, COUNT(*) AS occurrences
FROM customers
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY occurrences DESC;

-- List every row involved in a duplicate, with its own row's info
SELECT c.*
FROM customers c
JOIN (
  SELECT email
  FROM customers
  GROUP BY email
  HAVING COUNT(*) > 1
) dupes ON c.email = dupes.email
ORDER BY c.email, c.id;

-- Using ROW_NUMBER to identify which duplicate rows to delete,
-- keeping only the earliest row (lowest id) per email
DELETE FROM customers
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM customers
  ) ranked
  WHERE rn > 1
);`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title:
        "Explain transaction isolation levels and what anomalies each prevents.",
      prompt:
        "Describe the four standard SQL transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies (dirty read, non-repeatable read, phantom read) each one prevents or allows.",
      difficulty: "HARD",
      tags: ["transactions", "isolation-levels", "concurrency"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Isolation levels control how much one transaction can be affected by concurrently running transactions, trading off consistency guarantees against concurrency/performance. The SQL standard defines four levels, each preventing progressively more anomalies:

- **Dirty read**: reading a row that another transaction has modified but not yet committed (which could later be rolled back).
- **Non-repeatable read**: re-reading the same row twice within one transaction and getting different data, because another transaction committed an update to it in between.
- **Phantom read**: re-running the same range query twice within one transaction and getting a different set of rows, because another transaction inserted or deleted rows matching the condition in between.

**Read Uncommitted**: allows dirty reads, non-repeatable reads, and phantom reads. The weakest level — rarely used in practice, and PostgreSQL actually treats it identically to Read Committed (it doesn't implement true dirty reads at all).

**Read Committed**: prevents dirty reads (you only ever see committed data), but still allows non-repeatable reads and phantom reads — each individual statement within the transaction sees a fresh snapshot of committed data, so two \`SELECT\`s in the same transaction can see different results if another transaction commits in between. This is PostgreSQL's (and most databases') default isolation level.

**Repeatable Read**: prevents dirty reads and non-repeatable reads — once a transaction reads a row, it will see the same value for that row for the rest of the transaction, typically implemented by taking a consistent snapshot at the start of the transaction (as PostgreSQL does via MVCC). The SQL standard still permits phantom reads at this level, though PostgreSQL's actual implementation of Repeatable Read also prevents phantom reads (it's stricter than the standard requires, though not fully serializable — it can still exhibit certain write-skew anomalies).

**Serializable**: the strongest level — transactions behave as if they were executed one at a time, in some serial order, preventing all three anomalies including write skew. PostgreSQL implements this via Serializable Snapshot Isolation (SSI), which monitors for dependency patterns that could break serializability and aborts one of the conflicting transactions (requiring the application to retry) rather than physically locking everything.

Practical guidance: Read Committed is a reasonable default for most applications. Reach for Repeatable Read or Serializable when you have logic that reads-then-writes based on invariants that must hold across the whole transaction (e.g. "only insert this row if the count is still below some limit"), where a concurrent transaction could otherwise violate that invariant between your read and your write.`,
        },
      ],
    },
    {
      title:
        "What is the difference between optimistic and pessimistic locking?",
      prompt:
        "Explain the difference between optimistic and pessimistic locking strategies for handling concurrent updates to the same row, and when you'd choose each.",
      difficulty: "HARD",
      tags: ["locking", "concurrency", "transactions"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Both strategies address the same problem — preventing two concurrent transactions from clobbering each other's changes to the same data — but with opposite assumptions about how often conflicts happen.

**Pessimistic locking** assumes conflicts are likely, so it acquires a lock on a row *before* modifying it, blocking any other transaction from reading (in some modes) or writing that row until the lock is released. In SQL this is typically done with \`SELECT ... FOR UPDATE\`, which locks the selected rows until the current transaction commits or rolls back. This guarantees no other transaction can interfere, but at the cost of reduced concurrency — other transactions wanting the same row simply wait, and a long-held lock (or a forgotten commit) can cause contention or even deadlocks.

**Optimistic locking** assumes conflicts are rare, so it doesn't take any lock up front. Instead, it lets the read happen freely, and detects conflicts only at write time — typically by storing a version number or timestamp column on the row, reading it along with the rest of the data, and including a check like \`WHERE id = ? AND version = ?\` in the \`UPDATE\`. If another transaction updated the row (and bumped the version) in the meantime, the \`UPDATE\` affects zero rows, signaling a conflict that the application must detect and handle (usually by retrying with fresh data). This maximizes concurrency for the common case where conflicts are rare, at the cost of needing explicit conflict-handling logic in the application.

**When to choose which**: pessimistic locking fits scenarios with high contention on the same rows and where retry logic would be complex or costly (e.g. financial ledger updates, seat reservation systems where you'd rather block briefly than risk overselling). Optimistic locking fits scenarios with low contention and where you want to maximize throughput and avoid lock waits (e.g. a user editing their own profile, where two people editing the exact same record at the same instant is rare).`,
          codeContent: `-- Pessimistic locking: lock the row until the transaction ends
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- other transactions trying to SELECT ... FOR UPDATE the same row now wait
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Optimistic locking: version column detects conflicting concurrent writes
-- accounts(id, balance, version)
UPDATE accounts
SET balance = balance - 100, version = version + 1
WHERE id = 1 AND version = 5;  -- the version read earlier in this transaction
-- If 0 rows are affected, someone else updated the row first (version
-- moved on) -- the application should re-read and retry.`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title:
        "How does a query planner decide between a sequential scan and an index scan?",
      prompt:
        "Explain the factors a query planner (e.g. in PostgreSQL) considers when deciding whether to use a sequential scan or an index scan for a given query, and why an index isn't always used even when one exists on the filtered column.",
      difficulty: "HARD",
      tags: ["query-planning", "indexing", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A cost-based query planner (like PostgreSQL's) doesn't just use an index because one exists — it estimates the cost of several candidate execution plans and picks the cheapest one, where "cost" is a weighted estimate combining disk I/O and CPU work, based on table/column statistics gathered by \`ANALYZE\` (row counts, value distribution/histograms, distinct value counts, correlation between physical row order and column values).

Key factors in the decision:

- **Selectivity**: how large a fraction of the table the condition is expected to match, estimated from column statistics. If a query will match a large percentage of rows (say, more than roughly 5–15%, though the exact threshold depends on the specific cost model and data), a sequential scan reading the whole table sequentially can actually be cheaper than an index scan, because index scans involve extra random-access I/O — jumping between the index and the underlying heap for every matching row — which is slower per-row than sequential reads, especially on spinning disks (less pronounced but still real on SSDs due to cache-line/page effects).
- **Table/data size**: for a small table, the entire thing may fit in a few disk pages, so a sequential scan is trivially cheap and an index lookup's overhead isn't worth it.
- **Column correlation**: if the indexed column's values happen to be stored in roughly the same order as the index (high physical correlation), an index scan is cheaper because the resulting heap fetches are closer to sequential rather than random.
- **Covering indexes / index-only scans**: if every column the query needs is present in the index itself, PostgreSQL can do an "index-only scan" that avoids visiting the heap at all (subject to the visibility map being up to date), which is much cheaper and makes the planner more likely to choose the index.
- **Stale statistics**: if \`ANALYZE\` hasn't run recently after significant data changes, the planner's row-count/selectivity estimates can be wrong, leading it to pick a suboptimal plan (e.g. a sequential scan when an index scan would actually be much faster, or vice versa).

Practical takeaway: seeing a sequential scan in \`EXPLAIN\` output isn't automatically a bug — it can be the objectively correct choice for large-selectivity queries or small tables. When investigating a slow query, always check \`EXPLAIN (ANALYZE, BUFFERS)\` to compare the planner's row estimates against actual row counts; a large mismatch is usually the real root cause (stale statistics, missing extended statistics for correlated columns, etc.) rather than "the planner is being dumb."`,
        },
      ],
    },
    {
      title: "Explain deadlocks and how a database detects/resolves them.",
      prompt:
        "Explain what a deadlock is in the context of database transactions, give a simple two-transaction example, and describe how a database typically detects and resolves one.",
      difficulty: "HARD",
      tags: ["deadlocks", "locking", "concurrency"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A deadlock occurs when two (or more) transactions are each waiting on a lock held by the other, so neither can ever proceed — a cycle of dependencies with no way out on its own.

Classic example: Transaction A locks row 1 then tries to lock row 2; Transaction B locks row 2 then tries to lock row 1. Each is now waiting for a lock the other holds, forever, unless something intervenes.

Detection and resolution: databases don't just let this hang indefinitely. Most (including PostgreSQL) periodically run a **deadlock detection** algorithm that builds a wait-for graph among transactions holding and waiting on locks, and looks for cycles. When a cycle is found, the database picks one of the transactions involved (often the one that would be "cheapest" to abort, or simply the one that triggered the detection) and forcibly rolls it back with an error (e.g. PostgreSQL raises \`ERROR: deadlock detected\`), releasing its locks so the other transaction(s) can proceed. The aborted transaction's application code is expected to catch this error and retry.

How to avoid deadlocks in application code:
- **Consistent lock ordering**: always acquire locks on multiple rows/tables in the same, agreed-upon order across all code paths (e.g. always lock the lower ID first) — this alone eliminates the classic circular-wait pattern.
- **Keep transactions short**: the shorter a transaction holds its locks, the smaller the window for a conflicting deadlock to form.
- **Use lower isolation/locking strength when possible**: don't take a stronger lock (e.g. \`SELECT ... FOR UPDATE\`) than the operation actually needs.
- **Have retry logic**: since deadlocks can still occasionally happen even with careful design under high concurrency, application code that performs multi-row updates should be prepared to catch a deadlock error and retry the transaction.`,
          codeContent: `-- Transaction A                      -- Transaction B
BEGIN;                                BEGIN;
UPDATE accounts SET balance = balance - 50
  WHERE id = 1;                       UPDATE accounts SET balance = balance - 50
                                         WHERE id = 2;
-- A now holds a lock on row 1        -- B now holds a lock on row 2

UPDATE accounts SET balance = balance + 50
  WHERE id = 2;   -- A waits for B's lock on row 2
                                       UPDATE accounts SET balance = balance + 50
                                         WHERE id = 1;   -- B waits for A's lock on row 1
-- Deadlock: A waits on B, B waits on A.
-- PostgreSQL's deadlock detector will abort one transaction, e.g.:
-- ERROR:  deadlock detected
-- DETAIL: Process 123 waits for ShareLock on transaction 456; blocked by process 456.
--         Process 456 waits for ShareLock on transaction 123; blocked by process 123.

-- Fix: always lock rows in a consistent order (e.g. by ascending id)
-- in every transaction that touches both rows, so the circular wait
-- pattern can never form.`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "Write a query to compute a running total of sales by month.",
      prompt:
        "Given a sales table (id, sale_date, amount), write a query that returns each month's total sales alongside a running (cumulative) total across months, ordered chronologically.",
      difficulty: "HARD",
      tags: ["window-functions", "aggregation", "time-series"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `WITH monthly_sales AS (
  SELECT
    date_trunc('month', sale_date) AS sale_month,
    SUM(amount) AS monthly_total
  FROM sales
  GROUP BY date_trunc('month', sale_date)
)
SELECT
  sale_month,
  monthly_total,
  SUM(monthly_total) OVER (
    ORDER BY sale_month
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM monthly_sales
ORDER BY sale_month;`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "Write a recursive CTE to traverse an employee-manager hierarchy.",
      prompt:
        "Given an employees table (id, name, manager_id), write a recursive CTE that returns every employee along with their reporting depth (0 for top-level employees with no manager) and the full chain of names from the top of the hierarchy down to them.",
      difficulty: "HARD",
      tags: ["cte", "recursion", "hierarchical-data"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `A recursive CTE has two parts, combined with \`UNION\` or \`UNION ALL\`:

1. The **base case** (also called the "anchor member") — selects the starting rows, here the top-level employees with no manager.
2. The **recursive case** — joins the CTE back to itself, each iteration finding the next level down (employees whose manager was found in the previous iteration), until no more matching rows are found.

PostgreSQL executes this iteratively: it runs the anchor query once, then repeatedly runs the recursive query using only the rows produced in the *previous* iteration, unioning all the results together, stopping automatically when an iteration produces zero new rows.`,
          codeContent: `WITH RECURSIVE org_chart AS (
  -- Base case: top-level employees (no manager)
  SELECT
    id,
    name,
    manager_id,
    0 AS depth,
    name::text AS path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive case: find direct reports of everyone already in org_chart
  SELECT
    e.id,
    e.name,
    e.manager_id,
    oc.depth + 1,
    oc.path || ' > ' || e.name
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT id, name, depth, path
FROM org_chart
ORDER BY path;

-- Example output:
-- id | name  | depth | path
-- 1  | Alice |   0   | Alice
-- 2  | Bob   |   1   | Alice > Bob
-- 4  | Dana  |   2   | Alice > Bob > Dana
-- 3  | Carol |   1   | Alice > Carol`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is denormalization and when is it appropriate?",
      prompt:
        "Explain what denormalization means in database design, give an example, and discuss the tradeoffs involved in deliberately denormalizing a schema.",
      difficulty: "HARD",
      tags: ["schema-design", "normalization", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Denormalization is the deliberate introduction of redundancy into a normalized schema — duplicating data across tables, or pre-computing/storing aggregated values — in order to reduce the number of joins or computations needed for common read queries, at the cost of the data integrity and storage benefits normalization provides.

**Example**: in a fully normalized schema, an \`orders\` table might only store \`customer_id\`, requiring a join to \`customers\` every time you need the customer's name on an order confirmation or report. A denormalized version might additionally store \`customer_name\` directly on the \`orders\` row (a snapshot at order time, which is also often *semantically* correct — you want the name as it was when the order was placed, not the customer's current name) or maintain a separate, pre-aggregated \`daily_sales_summary\` table instead of computing that aggregate from raw \`orders\` on every dashboard load.

**Tradeoffs**:
- *Pros*: fewer/cheaper joins, faster reads for the specific access patterns it's designed around, which matters a lot for read-heavy systems (reporting, dashboards, high-traffic public-facing pages) where query latency directly affects user experience.
- *Cons*: redundant data must be kept in sync — an update now has to touch multiple places, increasing the risk of the copies drifting out of sync (an anomaly normalization exists specifically to prevent) unless you're careful with transactions or use triggers/application logic to keep them consistent; more storage is used; write paths become more complex.

**When it's appropriate**: read-heavy systems where query performance is a bottleneck and the specific access pattern is well understood and stable; reporting/analytics/OLAP-style workloads (where denormalized star/snowflake schemas are the norm, specifically to avoid many joins across large fact/dimension tables); caching layers or materialized views that are explicitly derived from normalized source-of-truth tables (which is often a better middle ground — you get the query performance benefit of denormalization while keeping a single normalized source of truth that the denormalized copy is regenerated from).

General guidance: normalize by default for correctness and maintainability, and denormalize deliberately and selectively, backed by actual performance data showing it's needed, rather than as a starting design choice.`,
        },
      ],
    },
    {
      title:
        "Explain the difference between covering indexes and index-only scans.",
      prompt:
        "Explain what a covering index is and how it enables an index-only scan, including any caveats specific to PostgreSQL's implementation (such as the visibility map).",
      difficulty: "HARD",
      tags: ["indexing", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A **covering index** is an index that includes every column a particular query needs — both the columns used to filter/sort (the index's key columns) and any additional columns the query selects — so the database can answer the query using only the index, without ever visiting the underlying table ("heap") to fetch the full row.

This enables an **index-only scan**: instead of the typical index scan (search the index, then follow a pointer to fetch the matching row from the heap — an extra random I/O per row), the database reads the needed values directly out of the index structure itself, skipping the heap fetch entirely. This is significantly faster for queries that touch many rows, since it avoids that extra random-access read per row.

In PostgreSQL, you build a covering index using the \`INCLUDE\` clause to add non-key "payload" columns to a B-tree index without making them part of the sort order (which keeps the index smaller/more efficient than including them as full key columns when they're not needed for filtering/ordering):

\`\`\`sql
CREATE INDEX idx_orders_customer ON orders (customer_id) INCLUDE (order_date, total);
\`\`\`

A query like \`SELECT order_date, total FROM orders WHERE customer_id = 42\` can now be satisfied entirely from this index.

**Important PostgreSQL-specific caveat — the visibility map**: because PostgreSQL uses MVCC, a row's visibility (whether it's committed and visible to the current transaction, and not deleted by a since-committed transaction) can't always be determined from the index alone — that information lives in the heap. PostgreSQL tracks, per heap page, whether *all* rows on that page are known-visible to all current transactions, in a small bitmap called the **visibility map**. An index-only scan can skip the heap entirely for a given row only if the visibility map says its page is all-visible; otherwise PostgreSQL still has to visit the heap to check visibility, falling back to behavior similar to a regular index scan for that row. This is why index-only scans work best on tables that are \`VACUUM\`ed regularly (which is what updates the visibility map) and see relatively few recent updates/deletes — a table with heavy recent write churn may not benefit as much from an index-only scan as \`EXPLAIN\` might otherwise suggest, until autovacuum catches up.`,
        },
      ],
    },
    {
      title:
        "Write a query to pivot rows into columns (e.g., sales by quarter).",
      prompt:
        "Given a sales table (id, region, quarter, amount) where quarter is a value like 'Q1', 'Q2', 'Q3', 'Q4', write a query that pivots the data so each region is a single row with one column per quarter showing total sales.",
      difficulty: "HARD",
      tags: ["pivot", "aggregation", "conditional-aggregation"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Standard SQL (and PostgreSQL specifically) doesn't have a built-in \`PIVOT\` operator the way some other databases (like SQL Server or Oracle) do. The most portable way to pivot in PostgreSQL is **conditional aggregation**: use a \`CASE\` expression inside an aggregate function once per desired output column, so each aggregate only sums the amounts belonging to one quarter.

An alternative is the \`crosstab()\` function from PostgreSQL's \`tablefunc\` extension, which does a more literal pivot, but conditional aggregation is generally preferred since it needs no extension and is easier to reason about and extend.`,
          codeContent: `-- Conditional aggregation approach (no extensions needed)
SELECT
  region,
  SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS q1,
  SUM(CASE WHEN quarter = 'Q2' THEN amount ELSE 0 END) AS q2,
  SUM(CASE WHEN quarter = 'Q3' THEN amount ELSE 0 END) AS q3,
  SUM(CASE WHEN quarter = 'Q4' THEN amount ELSE 0 END) AS q4
FROM sales
GROUP BY region
ORDER BY region;

-- Equivalent using the tablefunc extension's crosstab()
-- CREATE EXTENSION IF NOT EXISTS tablefunc;
SELECT * FROM crosstab(
  'SELECT region, quarter, SUM(amount) FROM sales GROUP BY region, quarter ORDER BY 1,2',
  $$VALUES ('Q1'), ('Q2'), ('Q3'), ('Q4')$$
) AS pivoted(region text, q1 numeric, q2 numeric, q3 numeric, q4 numeric);`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is MVCC (multi-version concurrency control)?",
      prompt:
        "Explain what MVCC is, how PostgreSQL uses it to let readers and writers avoid blocking each other, and what role VACUUM plays in this design.",
      difficulty: "HARD",
      tags: ["mvcc", "concurrency", "postgresql"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Multi-Version Concurrency Control (MVCC) is a strategy databases use to let readers and writers operate concurrently without blocking each other, by keeping multiple versions of a row around instead of locking it for reads.

**How PostgreSQL implements it**: rather than updating a row in place, an \`UPDATE\` in PostgreSQL creates a brand-new row version (a new physical tuple) with the changes, and marks the old version as expired (rather than deleting it immediately) — each row version carries hidden system columns (\`xmin\`, \`xmax\`) recording which transaction created it and which (if any) expired/deleted it. A \`DELETE\` similarly just marks the row's \`xmax\`, it doesn't physically remove it right away.

When a transaction runs a query, it takes a **snapshot** — effectively "the set of transactions that were already committed as of this point" — and only "sees" row versions that were committed before its snapshot and not yet expired as of that snapshot. This is what allows a long-running read transaction to keep seeing a stable, consistent view of the data even while other transactions are concurrently inserting/updating/deleting rows: readers never block writers, and writers never block readers, because they're simply looking at different row versions rather than contending for the same physical data. (Writers can still block other writers targeting the same row, via row-level locks, since two transactions can't both create the "next" version of the same row at once.)

**Role of VACUUM**: since updates and deletes leave old, expired row versions ("dead tuples") behind instead of removing them immediately, PostgreSQL needs a separate process to reclaim that space once no active transaction's snapshot could possibly still need to see them. That's what \`VACUUM\` (usually run automatically via \`autovacuum\`) does — it scans for dead tuples that are no longer visible to any current or future transaction and marks their space as reusable for new rows. \`VACUUM\` also updates the visibility map (relevant for index-only scans) and prevents transaction ID wraparound, a serious failure mode if a table goes too long without being vacuumed. Without regular vacuuming, a table with heavy update/delete churn will bloat — its on-disk size growing far beyond its logical row count with dead tuples — which degrades both scan performance and cache efficiency.`,
        },
      ],
    },
    {
      title:
        "Write a query to find the top 3 highest-paid employees in each department using window functions.",
      prompt:
        "Given an employees table (id, name, department_id, salary), write a query that returns the top 3 highest-paid employees within each department.",
      difficulty: "HARD",
      tags: ["window-functions", "ranking", "top-n"],
      answers: [
        {
          contentType: "CODE",
          codeContent: `WITH ranked_employees AS (
  SELECT
    id,
    name,
    department_id,
    salary,
    ROW_NUMBER() OVER (
      PARTITION BY department_id
      ORDER BY salary DESC
    ) AS salary_rank
  FROM employees
)
SELECT id, name, department_id, salary
FROM ranked_employees
WHERE salary_rank <= 3
ORDER BY department_id, salary_rank;

-- Note: ROW_NUMBER is used here (rather than RANK/DENSE_RANK) because
-- "top 3" typically means "3 rows per department" even if there are
-- salary ties -- use RANK() instead if ties should be allowed to produce
-- more than 3 rows in a department (e.g. two people tied for 3rd both
-- included).`,
          codeLanguage: "sql",
        },
      ],
    },
    {
      title: "What is the N+1 query problem and how do you avoid it?",
      prompt:
        "Explain the N+1 query problem that commonly arises when using an ORM, with an example, and describe at least two strategies to avoid it.",
      difficulty: "HARD",
      tags: ["performance", "orm", "n-plus-one"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `The N+1 query problem happens when code runs 1 query to fetch a list of N parent records, and then, for each of those N records, runs a separate additional query to fetch related data — resulting in 1 + N total queries instead of a small, constant number. This pattern is especially easy to fall into unintentionally with ORMs, where accessing a related object/collection (e.g. \`order.customer\`) transparently triggers a lazy-loaded query behind the scenes if you're not careful.

**Example**: fetching 100 orders, then accessing \`order.customer.name\` for each one inside a loop, triggers 1 query for the orders plus 100 additional queries (one per order) to lazily load each customer — 101 queries total, when the same data could typically be fetched in 2 queries or even 1.

**Strategies to avoid it**:

1. **Eager loading / joins**: fetch the related data up front in the same query (a \`JOIN\`) or in a single follow-up batched query, instead of one query per row. Most ORMs expose this explicitly (e.g. SQLAlchemy's \`joinedload()\`/\`selectinload()\`, Django's \`select_related()\`/\`prefetch_related()\`, Prisma's \`include\`).
2. **Batch loading**: instead of N separate \`WHERE id = ?\` queries, collect all the needed IDs and run a single \`WHERE id IN (...)\` query, then match results back up in application code. This is the core idea behind tools like the "Dataloader" pattern commonly used in GraphQL resolvers.
3. **Query monitoring/tooling**: use ORM query-logging or APM tools in development/staging to catch N+1 patterns before they hit production, since they're easy to introduce accidentally (e.g. adding a new field access inside a loop) and often don't show up as a problem until the list being iterated grows large in production.`,
          codeContent: `-- The N+1 pattern, expressed as raw SQL for illustration:
-- 1 query for orders
SELECT id, customer_id, total FROM orders WHERE status = 'shipped';
-- then, for EACH of the N orders returned, one more query:
SELECT id, name, email FROM customers WHERE id = ?;  -- x N times

-- Fixed with a single JOIN
SELECT o.id, o.total, c.id AS customer_id, c.name, c.email
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'shipped';

-- Or fixed with batch loading: collect customer_ids from the first
-- query's results, then a single follow-up query
SELECT id, name, email FROM customers WHERE id IN (101, 102, 103, ...);`,
          codeLanguage: "sql",
        },
      ],
    },
  ],
};
