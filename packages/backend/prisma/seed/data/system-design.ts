import type { CategorySeed } from "../types";

export const systemDesignSeed: CategorySeed = {
  name: "System Design",
  slug: "system-design",
  description:
    "Scalability fundamentals, architecture patterns, and classic large-scale system design interview prompts.",
  icon: "network",
  questions: [
    {
      title: "What is the difference between horizontal and vertical scaling?",
      prompt:
        "Explain the difference between horizontal and vertical scaling, and the tradeoffs of each approach.",
      difficulty: "EASY",
      tags: ["scalability", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Vertical scaling (scaling up) means increasing the capacity of a single machine: more CPU, more RAM, faster disks. Horizontal scaling (scaling out) means adding more machines and distributing load across them.

Vertical scaling tradeoffs:
- Simple: no changes to application architecture, no distributed systems complexity, no data partitioning.
- Hard ceiling: there is a maximum size of machine you can buy, and it gets disproportionately expensive as you approach that ceiling.
- Single point of failure: one machine going down takes the whole system down; no redundancy by default.

Horizontal scaling tradeoffs:
- Effectively unbounded capacity: keep adding commodity machines as load grows.
- Better fault tolerance: if one node fails, others can continue serving traffic (with proper load balancing and redundancy).
- Adds real complexity: you now need a load balancer to distribute traffic, you need to think about state (sessions, in-memory caches) that can no longer live safely on a single box, and data layers need replication or sharding to scale alongside the application tier.
- Network overhead and consistency concerns appear once data or logic is spread across multiple machines.

In practice, most systems use both: individual nodes are sized reasonably (some vertical scaling) while the overall system scales out horizontally behind a load balancer, since horizontal scaling is what provides both higher ceiling capacity and resilience to individual node failure, which vertical scaling alone cannot provide.`,
        },
      ],
    },
    {
      title: "What is a load balancer and what algorithms does it use?",
      prompt:
        "Explain what a load balancer does and describe a few common algorithms used to distribute traffic across backend servers.",
      difficulty: "EASY",
      tags: ["load-balancing", "scalability"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A load balancer sits between clients and a pool of backend servers, distributing incoming requests across those servers so no single server is overwhelmed, and routing around servers that are unhealthy. It enables horizontal scaling and improves availability, since traffic can be redirected away from a failed node.

Common distribution algorithms:

- Round robin: requests are sent to each server in rotation. Simple, but ignores current load or server capacity differences.
- Weighted round robin: like round robin, but servers with more capacity are assigned a higher weight and receive proportionally more requests.
- Least connections: routes each new request to the server currently handling the fewest active connections, which adapts better than round robin when requests take varying amounts of time to process.
- IP hash / consistent hashing: routes a given client (based on IP or another key) consistently to the same backend server, which is useful for session affinity ("sticky sessions") without a shared session store.
- Least response time: routes to the server with the lowest current response time combined with the fewest active connections.

Load balancers also perform health checks (periodic pings or requests) to detect and stop routing to unhealthy servers, and can operate at different layers: Layer 4 (transport layer, routing based on IP/port, fast but less flexible) or Layer 7 (application layer, can route based on URL path, headers, cookies, enabling more intelligent routing such as sending API traffic to one service and static assets to another).`,
        },
      ],
    },
    {
      title: "What is caching and why is it important in system design?",
      prompt:
        "Explain what caching is, where it can be applied in a typical web architecture, and common cache eviction policies.",
      difficulty: "EASY",
      tags: ["caching", "scalability"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Caching stores a copy of expensive-to-compute or expensive-to-fetch data in a faster-to-access location, so subsequent requests for the same data can be served quickly without repeating the expensive work (a database query, an external API call, a heavy computation). It trades memory/storage and some staleness risk for reduced latency and reduced load on downstream systems.

Where caching typically appears in a web architecture:

- Client-side: browser cache, mobile app local storage.
- CDN: caches static assets (images, JS/CSS bundles) and sometimes API responses geographically close to users.
- Application-level / in-memory cache: caches computed results or frequently accessed objects inside the application process.
- Distributed cache (e.g., Redis, Memcached): a shared cache layer between application servers and the database, so all application instances benefit from a cache hit regardless of which one served the original request.
- Database-level: query result caching, buffer pools/page caches inside the database engine itself.

Common eviction policies (used once a cache reaches capacity):

- LRU (Least Recently Used): evicts the item that hasn't been accessed for the longest time; good general-purpose default.
- LFU (Least Frequently Used): evicts the item accessed least often overall.
- FIFO: evicts the oldest inserted item regardless of access pattern.
- TTL (Time To Live): items expire automatically after a fixed duration, useful for data that becomes stale after a known period.

Key risks to manage: cache invalidation (making sure stale data is updated or evicted when the underlying source changes), cache stampede (many requests missing the cache simultaneously and overwhelming the backend), and choosing an appropriate consistency tradeoff (cache-aside, write-through, write-behind).`,
        },
      ],
    },
    {
      title: "SQL vs NoSQL: how do you choose?",
      prompt:
        "Compare SQL and NoSQL databases and explain the factors that would lead you to choose one over the other for a given system.",
      difficulty: "EASY",
      tags: ["databases", "sql", "nosql"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `SQL (relational) databases like PostgreSQL and MySQL store data in structured tables with a fixed schema, support ACID transactions, and use SQL with joins across normalized tables. NoSQL databases are a broad category (document, key-value, wide-column, graph) that typically favor flexible/schema-less data models, horizontal scalability, and often relax strict consistency guarantees in exchange for availability and partition tolerance.

Reasons to choose SQL:
- Data is naturally relational and benefits from joins across normalized entities (e.g., users, orders, order_items).
- Strong consistency and multi-row/multi-table ACID transactions are required (e.g., financial transactions, inventory management).
- The schema is well understood upfront and enforcing structure/constraints at the database level is valuable.
- Complex ad-hoc querying and reporting are common needs.

Reasons to choose NoSQL:
- The data model is naturally document-shaped, hierarchical, or highly variable between records (e.g., user-generated content with different shapes), which fits document stores like MongoDB well.
- You need to scale writes horizontally across many nodes more easily than traditional relational sharding allows (e.g., wide-column stores like Cassandra, built for high write throughput across a cluster).
- Extremely low-latency key-based lookups are the dominant access pattern (key-value stores like DynamoDB or Redis).
- Relationships between entities are the primary concern and traversal-heavy (graph databases like Neo4j).
- You are willing to trade strict consistency for higher availability and partition tolerance (per the CAP theorem), and your application can tolerate eventual consistency.

In practice, many real systems are polyglot: a relational database for core transactional data, a key-value/document store for caching or high-throughput lookups, and perhaps a search index (like Elasticsearch) or graph database for specialized access patterns, choosing the tool that matches each specific data access pattern rather than forcing everything into one model.`,
        },
      ],
    },
    {
      title: "What is a CDN and how does it improve performance?",
      prompt:
        "Explain what a Content Delivery Network is, how it works, and what kinds of content benefit most from being served through one.",
      difficulty: "EASY",
      tags: ["cdn", "caching", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A Content Delivery Network is a globally distributed set of proxy servers (edge servers / points of presence) that cache and serve content from a location physically close to the requesting user, rather than every request traveling all the way to a single origin server.

How it improves performance:

- Reduced latency: physical distance to the server is a major contributor to network round-trip time; serving from a nearby edge node instead of a distant origin server significantly cuts latency.
- Reduced origin load: cached content is served directly from the edge without hitting the origin server at all, freeing origin capacity for dynamic, non-cacheable requests.
- Better resilience and availability: traffic spikes are absorbed across many distributed edge nodes rather than concentrating on one origin; some CDNs also provide DDoS protection.
- Bandwidth cost savings: less traffic needs to traverse the origin's own network.

Content that benefits most: static assets that don't change per-request — images, videos, CSS/JS bundles, fonts — and increasingly, semi-static or personalized-but-cacheable API responses using short TTLs plus cache-control headers. Highly dynamic, per-user, non-cacheable content (e.g., a personalized live dashboard) benefits less directly, though even there a CDN can still help by terminating TLS closer to the user and routing efficiently to the origin.

A CDN typically works using DNS or Anycast routing to direct a user's request to the nearest edge node, which either serves a cached copy or fetches from the origin on a cache miss and caches the response for subsequent requests (with cache invalidation strategies to handle content updates).`,
        },
      ],
    },
    {
      title: "What is the difference between latency and throughput?",
      prompt:
        "Explain the difference between latency and throughput in the context of system design, and why optimizing for one can sometimes hurt the other.",
      difficulty: "EASY",
      tags: ["performance", "fundamentals"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Latency is the time it takes for a single request to complete, from when it's sent to when the response is received, usually measured in milliseconds. Throughput is the number of requests (or units of data) a system can process per unit of time, usually measured in requests per second or bytes per second.

They are related but distinct, and optimizing one does not automatically optimize the other:

- A system can have low latency but low throughput: a single request is answered very quickly, but the system can only handle a few requests at a time (e.g., a single-threaded server with fast per-request processing but no concurrency).
- A system can have high throughput but higher latency: batching many requests together to process them more efficiently (e.g., writing to disk in batches, or batching network calls) increases overall throughput but increases the time any individual request in the batch has to wait, raising its latency.

This tradeoff shows up constantly in system design decisions: increasing a queue's batch size or a connection pool's buffering improves throughput at the cost of per-request latency; adding more parallel workers can improve both up to a point, until resource contention (CPU, DB connections, lock contention) causes throughput gains to plateau while latency starts climbing due to queuing delays (as described by queuing theory — as utilization approaches 100%, queuing latency grows sharply).

In interviews, it's useful to state explicit targets for both when discussing a design: e.g., "p99 latency under 200ms" and "support 50,000 requests/second," since a design that's good for one metric may need different techniques (caching and reducing per-request work for latency; horizontal scaling, batching, and async processing for throughput) than a design optimized purely for the other.`,
        },
      ],
    },
    {
      title: "How does database replication work and what are its tradeoffs?",
      prompt:
        "Explain database replication, the difference between synchronous and asynchronous replication, and common replication topologies.",
      difficulty: "MEDIUM",
      tags: ["databases", "replication", "scalability"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Replication keeps copies of the same data on multiple database nodes, improving read scalability (reads can be spread across replicas) and availability/durability (data survives the loss of any single node).

Common topology: leader-follower (primary-replica). All writes go to a single leader, which then propagates changes to one or more followers/replicas. Reads can be served from either the leader (for strongly consistent reads) or from replicas (for scaled-out, potentially slightly stale reads). Some systems support multi-leader or leaderless (e.g., Dynamo-style, using quorum reads/writes) replication for higher write availability, at the cost of more complex conflict resolution.

Synchronous vs asynchronous replication:

- Synchronous: the leader waits for acknowledgment from (some or all) replicas before confirming a write to the client. This guarantees replicas are up to date, minimizing data loss on leader failure, but increases write latency and reduces availability if a replica is slow or unreachable (the write can't complete).
- Asynchronous: the leader confirms the write immediately after committing locally and propagates to replicas in the background. This gives lower write latency and better availability, but replicas can lag behind, meaning a reader hitting a replica might see stale data (replication lag), and a leader crash before replication completes can lose the most recent writes.
- Semi-synchronous is a middle ground: wait for acknowledgment from at least one replica before confirming, balancing durability and latency.

Failover: if the leader fails, the system needs a mechanism (automatic or manual) to promote a replica to be the new leader, which introduces its own complexity — detecting the failure reliably, avoiding split-brain (two nodes believing they're the leader), and reconciling any writes that were in flight during the failover.

Tradeoffs to call out in an interview: replication improves read throughput and fault tolerance but introduces replication lag/staleness, added operational complexity, and consistency questions that need to be explicitly designed for (e.g., read-your-writes consistency for a user who just wrote data and then immediately reads it from a lagging replica).`,
        },
      ],
    },
    {
      title: "What is database sharding and when would you use it?",
      prompt:
        "Explain database sharding, common sharding strategies, and the tradeoffs and challenges it introduces.",
      difficulty: "MEDIUM",
      tags: ["databases", "sharding", "scalability"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Sharding is horizontal partitioning of a dataset across multiple database instances (shards), where each shard holds a subset of the total data. Unlike replication (full copies of all data on each node), sharding splits the data itself, letting the system scale write throughput and total storage beyond what a single machine can handle.

Common sharding strategies:

- Range-based: partition by a key range (e.g., user IDs 1-1M on shard A, 1M-2M on shard B). Simple and supports efficient range queries, but can create hotspots if data or traffic isn't evenly distributed across ranges.
- Hash-based: apply a hash function to the shard key and use the result to pick a shard. Distributes data more evenly, but makes range queries across shards expensive (you may need to query every shard).
- Directory-based: a lookup service maps each key (or key range) to its shard, giving flexibility to rebalance data by simply updating the mapping, at the cost of an extra lookup and a potential single point of failure/bottleneck in the directory itself.
- Consistent hashing is commonly used underneath hash-based sharding to minimize data movement when shards are added or removed.

Challenges sharding introduces:

- Cross-shard queries and joins become expensive or impossible without application-level aggregation, since data that used to live in one table is now spread across independent databases.
- Rebalancing: adding or removing shards requires moving data, which is operationally complex and needs care to avoid downtime; consistent hashing helps minimize the fraction of keys that must move.
- Choosing the shard key well is critical — a poor choice (e.g., a key with skewed access patterns, like sharding by "signup date" when most active traffic is recent) leads to hot shards that bottleneck the whole system even though other shards are idle.
- Transactions spanning multiple shards lose the simplicity of single-node ACID transactions and typically require distributed transaction patterns (e.g., two-phase commit, sagas) or must be avoided by design.

Sharding is generally reached for once a single database node (even a well-tuned, well-replicated one) can no longer handle the required write throughput or data volume; it's a significant complexity increase, so it's usually adopted after simpler options (better indexing, read replicas, caching, vertical scaling) are exhausted.`,
        },
      ],
    },
    {
      title: "Explain the CAP theorem",
      prompt:
        "State the CAP theorem and explain what it means in practice for designing distributed systems, with examples of systems that favor CP versus AP.",
      difficulty: "MEDIUM",
      tags: ["cap-theorem", "distributed-systems", "consistency"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `The CAP theorem states that a distributed data system can provide at most two of the following three guarantees simultaneously during a network partition:

- Consistency: every read receives the most recent write or an error; all nodes see the same data at the same time.
- Availability: every request receives a (non-error) response, without guaranteeing it contains the most recent write.
- Partition tolerance: the system continues to operate despite network partitions (messages between nodes being dropped or delayed).

In practice, because network partitions are a fact of life in any real distributed system (you cannot guarantee the network never fails), partition tolerance is not really optional — the meaningful choice is between Consistency and Availability when a partition actually occurs. This is why CAP is often discussed as CP vs. AP:

- CP systems (e.g., traditional configurations of ZooKeeper, HBase, or a relational database using synchronous replication with quorum writes) choose to reject or block requests during a partition rather than risk returning stale or inconsistent data. This is appropriate for use cases where correctness matters more than availability, such as financial ledgers, inventory counts, or leader election.
- AP systems (e.g., Cassandra, DynamoDB in its default configuration, CouchDB) continue to serve reads and writes during a partition, accepting that different nodes might temporarily diverge, and reconcile afterward (eventual consistency, sometimes with conflict resolution logic or "last write wins"). This suits use cases where staying available matters more than every read being perfectly up to date, such as a shopping cart, a social media feed, or presence/status indicators.

It's worth noting CAP describes behavior specifically during a partition; when the network is healthy, most systems can provide both consistency and availability. It's also a simplification — real systems often make more nuanced tradeoffs (e.g., tunable consistency per-request in Cassandra, or PACELC, which extends CAP to also describe the latency/consistency tradeoff even when there is no partition).`,
        },
      ],
    },
    {
      title:
        "What is the difference between strong consistency and eventual consistency?",
      prompt:
        "Explain the difference between strong consistency and eventual consistency, and give examples of when each is an appropriate choice.",
      difficulty: "MEDIUM",
      tags: ["consistency", "distributed-systems"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Consistency models describe what guarantees a distributed system makes about when and whether different readers see the same, most up-to-date data.

Strong consistency guarantees that once a write completes, any subsequent read (from any node) will see that write immediately — the system behaves as if there were only a single copy of the data. Achieving this in a distributed system typically requires coordination, such as routing all reads/writes through a single leader, or using consensus/quorum protocols (e.g., requiring a majority of replicas to acknowledge before a write or read is considered complete). This coordination adds latency and can reduce availability during network issues, per the CAP theorem.

Eventual consistency guarantees only that if no new writes occur, all replicas will eventually converge to the same value — but there is no bound on staleness a reader might see in the meantime, and reads can return outdated or conflicting data during the convergence window. This model allows for higher availability and lower latency, since a node can respond immediately from its local copy without coordinating with others first.

When strong consistency is appropriate: banking/financial balances, inventory counts (avoiding overselling), authentication/authorization state, anything where an outdated read could cause an incorrect real-world decision.

When eventual consistency is appropriate: social media likes/view counts, DNS records, product catalog metadata, presence indicators, shopping cart contents (often reconciled with conflict resolution) — cases where brief staleness is an acceptable price for availability and speed.

There are also useful middle-ground models, such as read-your-writes consistency (a user always sees their own writes immediately, even if other users might briefly see stale data) and causal consistency (writes that are causally related are seen in the same order by all nodes), which many real systems use as a pragmatic balance.`,
        },
      ],
    },
    {
      title: "Microservices vs monolith: how do you decide?",
      prompt:
        "Compare a microservices architecture to a monolithic architecture, and explain the factors that would push a team toward one or the other.",
      difficulty: "MEDIUM",
      tags: ["architecture", "microservices", "monolith"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A monolith is a single deployable application containing all of a system's functionality, typically with one shared codebase, one build/deploy pipeline, and often one database. Microservices split functionality into multiple independently deployable services, each owning its own data store and communicating over the network (REST, gRPC, messaging).

Advantages of a monolith:
- Simpler to develop, test, and deploy initially: one codebase, one deployment, no network calls between internal components, easier to reason about transactions (a single database supports real ACID transactions across entities).
- Lower operational overhead: no service discovery, no distributed tracing, no need to manage dozens of independent deployments and their versioning.
- Refactoring across "boundaries" is just moving code within one codebase, not a coordinated multi-team, multi-repo change.

Advantages of microservices:
- Independent deployability: teams can ship their service without coordinating a release with every other team, enabling faster iteration at scale.
- Independent scaling: a service under heavy load can be scaled out without scaling the entire application.
- Technology flexibility: each service can use the language/database best suited to its problem.
- Fault isolation: a bug or crash in one service is less likely to bring down the entire system, if failures are handled gracefully (timeouts, circuit breakers, fallback behavior) elsewhere.
- Clear ownership boundaries can align well with team structure (Conway's Law) at larger organizations.

Costs of microservices: significant operational complexity (service discovery, distributed tracing/observability, network reliability handling, versioned APIs between services), harder to maintain data consistency across services (no more free multi-table transactions; need patterns like sagas), and duplicated effort in cross-cutting concerns unless shared infrastructure/platform tooling is invested in.

Rule of thumb commonly cited: start with a well-structured monolith (often called a "modular monolith," with clean internal boundaries) and only split into microservices once there's a concrete, demonstrated need — a team that needs to scale/deploy independently, or a component with very different scaling/technology requirements — rather than adopting microservices upfront for a small team or an unproven product, where the operational overhead outweighs the benefits.`,
        },
      ],
    },
    {
      title:
        "What role do message queues and pub/sub systems play in system design?",
      prompt:
        "Explain what message queues and publish/subscribe systems are used for, the difference between them, and give examples of when you'd introduce one into an architecture.",
      difficulty: "MEDIUM",
      tags: ["message-queues", "pub-sub", "asynchronous-processing"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Message queues and pub/sub systems both let components communicate asynchronously through an intermediary broker instead of calling each other directly and synchronously.

A message queue (e.g., SQS, RabbitMQ in queue mode) typically follows a point-to-point model: a producer places a message on a queue, and one consumer (or one from a pool of competing consumers) picks it up and processes it, after which the message is removed. This is useful for distributing work across a pool of workers, such as a job processing system.

A pub/sub system (e.g., Kafka, SNS, Google Pub/Sub, Redis pub/sub) follows a broadcast model: a publisher sends a message to a topic, and every subscriber to that topic receives its own copy of the message. This is useful when multiple independent consumers need to react to the same event without the publisher knowing or caring who they are.

Why introduce one into an architecture:

- Decoupling: producers and consumers don't need to know about each other or be online at the same time; the broker buffers messages.
- Load leveling: absorbing traffic spikes by queuing work rather than overwhelming downstream services, letting consumers process at a sustainable rate.
- Reliability: messages can be retried, persisted, and acknowledged, so a consumer crash doesn't lose in-flight work (with proper at-least-once delivery semantics).
- Enabling async workflows: things that don't need to block the user's request-response cycle (sending an email, generating a thumbnail, updating a search index) can be offloaded to background processing.

Key design considerations: delivery guarantees (at-most-once vs at-least-once vs exactly-once, the last being genuinely hard to achieve and usually approximated via idempotent consumers), ordering guarantees (some systems like Kafka guarantee order only within a partition), and how to handle poison messages (a message that repeatedly fails processing) typically via a dead-letter queue.`,
          codeContent: `// Example: decoupling an order service from downstream effects via pub/sub
// 1. OrderService publishes an event, doesn't know or care who's listening
publish("order.placed", { orderId, userId, total });

// 2. Independent subscribers react without coupling to OrderService
onMessage("order.placed", "email-service", sendConfirmationEmail);
onMessage("order.placed", "inventory-service", decrementStock);
onMessage("order.placed", "analytics-service", recordPurchaseEvent);`,
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What is an API gateway and why would you use one?",
      prompt:
        "Explain the role of an API gateway in a microservices architecture and what cross-cutting concerns it typically handles.",
      difficulty: "MEDIUM",
      tags: ["api-gateway", "microservices", "architecture"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `An API gateway is a single entry point that sits in front of a set of backend services (often microservices) and routes incoming client requests to the appropriate service, while centralizing cross-cutting concerns that would otherwise need to be duplicated in every individual service.

Responsibilities typically handled by an API gateway:

- Routing: mapping incoming request paths/hosts to the correct backend service.
- Authentication and authorization: verifying tokens/sessions once at the edge rather than in every downstream service.
- Rate limiting and throttling: enforcing per-client or per-API request limits centrally.
- Request/response transformation: adapting formats between what clients expect and what internal services provide, and aggregating multiple backend calls into a single client-facing response (a form of the "backend for frontend" pattern).
- TLS termination: handling HTTPS at the edge so internal services can communicate over plain HTTP within a trusted network.
- Logging, metrics, and tracing: capturing consistent observability data for all traffic in one place.
- Caching: caching responses for cacheable endpoints at the edge.
- Circuit breaking / load shedding: protecting backend services from being overwhelmed.

Benefits: clients only need to know about one endpoint rather than the internal service topology, cross-cutting logic is implemented once instead of duplicated (and potentially inconsistently) across every service, and internal services can evolve, be renamed, or be re-organized without breaking clients as long as the gateway's external contract is maintained.

Tradeoffs: the gateway itself becomes a critical piece of infrastructure that must be highly available and low-latency, since all traffic flows through it, and it can become a bottleneck or single point of failure if not designed with redundancy (multiple gateway instances behind a load balancer) and careful attention to added latency.`,
        },
      ],
    },
    {
      title:
        "How would you design a rate limiting algorithm and where would you enforce it?",
      prompt:
        "Compare common rate limiting algorithms (token bucket, leaky bucket, fixed window, sliding window) and explain where in a system rate limiting is typically enforced.",
      difficulty: "MEDIUM",
      tags: ["rate-limiting", "api-design", "scalability"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Rate limiting restricts how many requests a client (per user, API key, or IP) can make in a given time window, protecting backend services from being overwhelmed and enforcing fair usage/billing tiers.

Common algorithms:

- Fixed window: count requests in discrete windows (e.g., per calendar minute); simple, but allows bursts of up to 2x the limit right at window boundaries (a burst at the end of one window plus a burst at the start of the next).
- Sliding window (log or counter-based): tracks requests over a continuously moving window rather than fixed boundaries, smoothing out the boundary-burst problem at the cost of more memory (storing timestamps) or more computation (weighted counting across the previous and current window).
- Token bucket: a bucket holds tokens, refilled at a fixed rate up to a cap; each request consumes a token, and requests are rejected (or queued) when the bucket is empty. This naturally allows short bursts up to the bucket size while enforcing a steady average rate, which matches many real traffic patterns well.
- Leaky bucket: requests enter a queue (the "bucket") and are processed ("leak out") at a fixed rate; excess requests beyond the queue capacity are dropped. This smooths bursty traffic into a steady output rate, useful when the downstream system needs a constant processing rate rather than tolerating bursts.

Where to enforce it: often at multiple layers — at the API gateway/edge (protects the whole system generically per client), and sometimes additionally at a specific service if that service has its own more sensitive downstream dependency (e.g., a third-party API with its own strict limits). For a distributed system with multiple gateway/service instances, the counter state needs to be shared (e.g., in Redis, using atomic increment operations with expiry, or a Lua script for atomicity) rather than kept in local per-instance memory, otherwise each instance would allow the full limit independently, multiplying the effective allowed rate by the number of instances.`,
          codeContent: `// Token bucket in Redis (conceptual), keyed per user/API key
async function isAllowed(userId: string, capacity: number, refillPerSec: number): Promise<boolean> {
  const now = Date.now() / 1000;
  const key = \`ratelimit:\${userId}\`;

  const [tokens, lastRefill] = await redis.hmget(key, "tokens", "lastRefill");
  const elapsed = now - (Number(lastRefill) || now);
  const refreshed = Math.min(capacity, Number(tokens ?? capacity) + elapsed * refillPerSec);

  if (refreshed < 1) return false;

  await redis.hmset(key, { tokens: refreshed - 1, lastRefill: now });
  return true;
}`,
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "What is the circuit breaker pattern and why is it used?",
      prompt:
        "Explain the circuit breaker pattern in distributed systems, its states, and what problem it solves compared to naive retries.",
      difficulty: "MEDIUM",
      tags: ["circuit-breaker", "resilience", "microservices"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `The circuit breaker pattern protects a system from repeatedly calling a downstream dependency that is failing or slow, preventing cascading failures across a distributed system. It's directly inspired by electrical circuit breakers: when too many failures are detected, the "circuit" trips open and stops sending traffic to the failing dependency for a while, rather than continuing to hammer it.

A circuit breaker typically has three states:

- Closed: normal operation; requests pass through to the dependency, and failures are counted.
- Open: after failures exceed a threshold (e.g., error rate over a rolling window), the breaker "trips" and immediately fails/short-circuits new requests without even attempting to call the dependency, for a configured cooldown period. This gives the struggling dependency time to recover and avoids wasting resources (threads, connections, latency) on calls likely to fail anyway.
- Half-open: after the cooldown, the breaker allows a limited number of trial requests through. If they succeed, the breaker closes again (resumes normal traffic); if they fail, it goes back to open and waits again.

Why this is better than naive retries: retrying a failing request without a circuit breaker can make things worse — if a downstream service is struggling because it's overloaded, every caller retrying aggressively adds more load exactly when the service needs less, turning a partial outage into a full one (a "retry storm"). A circuit breaker instead reduces load on a struggling dependency, gives it breathing room to recover, and fails fast for callers (returning an error or a cached/default fallback immediately) instead of making them wait on doomed requests, which also protects the caller's own resources (e.g., thread pools, connection pools) from being exhausted waiting on a slow dependency.

Circuit breakers are commonly paired with timeouts, retries with exponential backoff and jitter (for the requests that are attempted), and bulkheads (isolating resource pools per dependency) as complementary resilience patterns.`,
        },
      ],
    },
    {
      title: "Design a URL shortener",
      prompt:
        "Design a URL shortening service like bit.ly. Cover the API, how short codes are generated, the data model, and how you'd scale reads given that reads vastly outnumber writes. Assume 100M new URLs per month and a 100:1 read-to-write ratio.",
      difficulty: "MEDIUM",
      tags: ["url-shortener", "design-question", "scalability"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: given a long URL, return a short unique alias; given the short alias, redirect to the original URL. Secondary: custom aliases, expiration, click analytics, high availability, low redirect latency.

API:
- POST /shorten { longUrl, customAlias?, expiresAt? } → { shortUrl }
- GET /{shortCode} → 301/302 redirect to the original long URL

Short code generation — two main approaches:
- Base62 encode a unique numeric ID (from an auto-incrementing counter, or a distributed ID generator like a Snowflake-style service) into a 6-7 character string using [a-zA-Z0-9]. This guarantees uniqueness by construction and is simple, but a naive centralized counter can be a bottleneck; mitigate by handing out ID ranges to each server ahead of time, or using a distributed ID generator.
- Hash the long URL (e.g., MD5/SHA-256) and take the first 6-7 characters, checking for collisions and re-hashing with a salt if one occurs. Simpler to distribute but requires collision handling.
Base62 counter-based generation is generally preferred for predictable uniqueness without collision-checking overhead.

Data model (relational or key-value both work; key-value fits the access pattern well):
- urls: short_code (PK), long_url, created_at, expires_at, user_id (nullable), click_count
Given the primary access pattern is a simple key lookup (short_code → long_url), a key-value store or a simple indexed table on short_code both work well; a relational DB is fine at this scale with the right index.

Scaling reads (100:1 read/write ratio):
- Cache short_code → long_url mappings in a distributed cache (Redis) in front of the database; the vast majority of redirect requests should be cache hits, since a small fraction of URLs (recently created / popular ones) account for most traffic.
- Use a CDN or edge-level caching for the redirect responses themselves where possible, since a redirect for a given short code rarely changes.
- Add read replicas behind the cache layer for cache misses.
- Because writes are comparatively rare, the write path (generating a new code, storing the mapping) doesn't need heavy optimization beyond avoiding a single point of contention (e.g., pre-allocating ID ranges per server rather than a single global counter).

Other considerations: use a 301 (permanent) redirect only if analytics on click-through aren't needed (browsers cache 301s, so subsequent clicks may not hit your server at all), otherwise use 302 so every click is trackable; handle expired/deleted links with a 404/410; rate-limit the shorten endpoint to prevent abuse; consider a bloom filter in front of the database to quickly reject lookups for codes that definitely don't exist.`,
        },
      ],
    },
    {
      title: "Design a rate limiter as a standalone service",
      prompt:
        "Design a distributed rate limiting service that can be used by multiple downstream APIs to enforce per-user request limits (e.g., 100 requests per minute), assuming it must work correctly across many application server instances.",
      difficulty: "MEDIUM",
      tags: ["design-question", "rate-limiting", "distributed-systems"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: enforce a configurable limit (e.g., 100 req/min) per client key (user ID, API key, or IP), work correctly when requests for the same client hit different application server instances, add minimal latency, and fail gracefully if the rate limiter itself is unavailable.

High-level architecture: rather than tracking counts in each application server's local memory (which would let each instance independently allow the full limit, multiplying the effective allowed rate by the number of instances), use a centralized, shared counter store — typically Redis — that all instances query before processing a request. The rate-limiting check can live in a shared library called at the start of request handling, or as a dedicated sidecar/middleware at the API gateway layer, so individual services don't each need to reimplement it.

Algorithm: token bucket or sliding-window counter (see the rate limiting algorithms question) implemented with Redis. Use a single atomic operation (a Lua script executed via EVAL, or Redis's built-in INCR + EXPIRE combination) to avoid race conditions between the "read current count" and "increment count" steps when multiple application servers check the same key concurrently — without atomicity, two concurrent requests could both read count=99 and both be allowed through even though the limit is 100.

Data model: a Redis key per (client, endpoint) pair, e.g. ratelimit:{clientId}:{endpoint}, storing either a counter with a TTL (fixed window) or a sorted set of request timestamps (sliding window log) or bucket state (token bucket).

Scaling the rate limiter itself: Redis can become a bottleneck/single point of failure at very high request volume, so in practice you'd run a Redis cluster (sharded by client key) for horizontal scale, and consider a local, short-lived approximate cache in each application instance (e.g., allow requests optimistically and reconcile against Redis periodically) to reduce the number of Redis round-trips, trading some precision for lower latency and reduced load — an approach used by systems like Cloudflare's rate limiter.

Failure handling: decide whether a Redis outage should fail open (allow all requests, prioritizing availability) or fail closed (reject all requests, prioritizing protection) — for most APIs, failing open with alerting is preferred so a rate limiter outage doesn't take down the entire API.

Response: return HTTP 429 Too Many Requests with a Retry-After header when a client exceeds their limit.`,
        },
      ],
    },
    {
      title: "Design an autocomplete / typeahead search service",
      prompt:
        "Design a search autocomplete service (like a search box suggestion dropdown) that returns the top matching suggestions as a user types, with low latency. Assume a large, relatively static corpus of possible query terms.",
      difficulty: "MEDIUM",
      tags: ["design-question", "autocomplete", "search"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: given a prefix typed so far, return the top-k most relevant/popular completions within tens of milliseconds, ideally re-querying on every keystroke; suggestions should reflect popularity (e.g., trending or frequently searched terms) and update periodically as popularity shifts.

Core data structure: a trie (prefix tree) is the natural fit — each node represents a character, and paths from the root represent prefixes; the node at the end of a path stores (or points to) the top-k most popular completions for that prefix, precomputed. On a keystroke, the client sends the current prefix, the server walks the trie to the corresponding node, and returns the precomputed top-k list in O(prefix length) time, avoiding an expensive scan or ranking computation on the request path.

Precomputing top-k per node: rather than ranking all completions under a node at query time, augment each trie node with a small cached list (e.g., top 5-10) of its most popular descendant terms, computed offline/asynchronously from a query log (aggregating search frequency over a recent time window) and periodically refreshed (e.g., every few hours) via a batch job, since search popularity doesn't need to be real-time-precise.

Serving architecture:
- The trie for the full corpus can be large; if it doesn't fit on one machine, shard it by prefix range (e.g., a-h on one shard, i-p on another) across multiple servers, with a routing layer directing each request to the right shard based on the first character(s) of the prefix.
- Cache the trie (or shards of it) fully in memory on each serving node for speed, rebuilding/reloading it periodically from the offline aggregation job rather than mutating it live on every search event.
- Put a CDN/edge cache or client-side debounce in front of the service since consecutive keystrokes for the same growing prefix are highly redundant; debouncing the client's requests (e.g., only querying after ~150ms of typing pause, or cancelling in-flight requests as new keystrokes arrive) reduces load significantly.

Handling real-time trends: for use cases needing near-real-time popularity (e.g., breaking news search terms), you can maintain a separate, more frequently updated "hot" structure (updated every few minutes from a streaming aggregation pipeline) merged with the base trie's precomputed results at query time.

Personalization (optional extension): blend global popularity with the individual user's own search history for a more relevant ranking, typically as a secondary re-ranking step over the candidate list rather than by building a full trie per user.`,
        },
      ],
    },
    {
      title:
        "How does database indexing work and what are the tradeoffs of adding an index?",
      prompt:
        "Explain how a database index works under the hood (e.g., B-tree), and what tradeoffs come with adding indexes to a table.",
      difficulty: "MEDIUM",
      tags: ["databases", "indexing", "performance"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `An index is an auxiliary data structure that lets the database find rows matching a query condition without scanning every row in the table (a full table scan). The most common structure is a B-tree (or B+ tree): a balanced, sorted tree structure where each node can have many children, keeping the tree shallow (typically 3-4 levels even for millions of rows) so a lookup, range scan, or ordered traversal takes very few disk/page reads. The leaf nodes of a B+ tree specifically store the indexed values in sorted order along with pointers to the actual row data (or the row data itself for a clustered index), making range queries (e.g., WHERE age BETWEEN 20 AND 30) efficient since a contiguous range of leaves can be scanned directly.

Other index types include hash indexes (O(1) exact-match lookups, but no support for range queries or ordering) and specialized structures like GIN/GiST indexes (for full-text search or geospatial data in PostgreSQL).

Without an index, a query filtering on a non-indexed column requires a full table scan — the database reads every row to check whether it matches, which is O(n) and gets slower as the table grows.

Tradeoffs of adding an index:

- Faster reads for queries that filter, sort, or join on the indexed column(s), often turning an O(n) scan into an O(log n) lookup.
- Slower writes: every INSERT, UPDATE, or DELETE must also update every index on the table, so more indexes mean more write overhead.
- Extra storage: each index consumes additional disk space, sometimes substantial for large tables or many indexes.
- Not all indexes help all queries: an index only helps if the query's filter/sort/join columns match the index's leading columns (for composite indexes, order matters — an index on (a, b) helps queries filtering on a, or on a and b together, but not efficiently on b alone).
- Over-indexing is a real anti-pattern: adding indexes speculatively without measuring actual query patterns adds write overhead and storage cost without necessarily improving the queries that matter.

In an interview, it's good to mention that index design should be driven by actual/expected query patterns (which columns appear in WHERE, JOIN, ORDER BY clauses) rather than indexing every column indiscriminately.`,
        },
      ],
    },
    {
      title: "Design a news feed system",
      prompt:
        "Design a social media news feed (like Facebook or Twitter/X) that shows a personalized, roughly reverse-chronological stream of posts from accounts a user follows. Assume 500M daily active users and users following a highly variable number of accounts, from a handful to millions (celebrities).",
      difficulty: "HARD",
      tags: ["design-question", "news-feed", "scalability", "fan-out"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: users can post content; users can follow other users; each user sees a feed aggregating recent posts from everyone they follow, ranked by recency (and often relevance); feed reads must be fast (sub-second) even though the underlying data (who follows whom, who posted what) is enormous and constantly changing.

Core design decision — fan-out strategy:

- Fan-out on write (push model): when a user posts, immediately write that post into the precomputed feed (e.g., a Redis list or a feed table) of every one of their followers. Reading a feed then becomes a cheap, fast lookup of an already-materialized list. This works great for users with a normal number of followers, but breaks down for celebrities with millions of followers — a single post would require millions of writes, which is slow and resource-intensive (the "celebrity problem" / hot-key fan-out).
- Fan-out on read (pull model): don't precompute anything; when a user requests their feed, query posts from all the accounts they follow at read time and merge/sort them. This avoids the celebrity write-amplification problem but makes reads expensive, especially for users following many accounts, since it requires fetching and merging from many sources on every feed load.
- Hybrid approach (used by most large-scale systems in practice): use fan-out-on-write for the vast majority of users (normal follower counts), but for accounts with very large follower counts, skip the write-time fan-out and instead merge their posts into a user's feed at read time; the final feed is a merge of the user's precomputed feed (excluding celebrity posts) with a real-time pull of "unfanned" posts from any celebrities the user follows.

High-level architecture:
- Post service: handles post creation, writes the post to a durable store, and triggers fan-out (publishes an event to a queue that fan-out workers consume asynchronously, so the user's post-creation request returns quickly without waiting on millions of feed writes).
- Fan-out workers: consume post-created events and write the post ID into each follower's feed cache (e.g., a capped-length list per user in Redis), for non-celebrity posters.
- Feed service: on a feed read, fetches the user's precomputed feed list from cache, merges in any celebrity posts pulled live, sorts by recency/rank, and hydrates post content (fetching full post objects, possibly from a separate cache/store) before returning.
- Graph service: stores the follower/following relationships (a graph, but often implemented as simple indexed tables or a graph database at very large scale) to know fan-out targets and pull-time targets.

Data model: users, posts (post_id, author_id, content, created_at), follows (follower_id, followee_id), and per-user feed caches (user_id → ordered list of post_ids, capped to a reasonable length like a few hundred, with older entries evicted or persisted to a colder store).

Key tradeoffs to discuss: consistency is relaxed — it's fine and expected for a feed to be slightly stale or for post ordering to not be perfectly real-time; storage cost of fan-out (many copies of the same post ID across follower feeds) is accepted in exchange for read speed; ranking (as opposed to pure chronological order) adds further complexity, typically as a separate scoring/ML step applied over a candidate set rather than something baked into the fan-out itself.`,
        },
      ],
    },
    {
      title: "Design a real-time chat application",
      prompt:
        "Design a real-time one-on-one and group chat application like WhatsApp or Slack, covering message delivery, connection management, and how messages are stored and synced across a user's devices. Assume tens of millions of concurrent connections.",
      difficulty: "HARD",
      tags: ["design-question", "chat", "websockets", "real-time"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: real-time, low-latency message delivery between users (1:1 and group chats); messages persist and sync across a user's multiple devices; delivery/read receipts; presence (online/offline/typing); support for offline recipients (messages delivered when they reconnect).

Connection layer: HTTP request/response is a poor fit for real-time bidirectional delivery, so clients maintain a persistent connection — typically WebSockets (or a similar protocol like MQTT for mobile-friendly, low-power scenarios) — to a fleet of connection/gateway servers. Since a single machine can only hold a limited number of open connections, tens of millions of concurrent users requires many connection server instances behind a load balancer, with a routing layer (or a shared registry, e.g., in Redis) tracking which connection server each user is currently attached to, so that a message destined for user B can be routed to the specific server holding B's live connection.

Message send flow:
1. Client A sends a message over its WebSocket connection to its connection server.
2. The connection server writes the message durably (e.g., to a message store/database, and/or appends it to a per-conversation log) and acknowledges receipt to A quickly (sent status).
3. The system looks up where recipient B is connected (via the presence/routing registry). If B is online, the message is pushed to B's connection server and forwarded over B's live WebSocket (delivered status updates back to A once B's client acks).
4. If B is offline, the message stays durably stored and is delivered when B reconnects (the client fetches undelivered messages since its last sync point on reconnect); a push notification service (APNs/FCM) is also triggered to alert B's device.

Multi-device sync: rather than modeling delivery as strictly per-device, treat the durable per-user (or per-conversation) message log as the source of truth, and have each of a user's devices independently sync/catch up against that log using a cursor/offset (e.g., "give me all messages after sequence number N"), so a message sent while a user's phone is offline still shows up correctly once the phone reconnects, and also appears on their other logged-in devices.

Group chats: a message sent to a group is fanned out to each group member's routing lookup and connection server, similar to the news feed fan-out problem, though generally at a much smaller scale (groups rarely have millions of members) so straightforward fan-out-on-write is usually fine.

Data model: conversations (conversation_id, type: direct/group, members), messages (message_id, conversation_id, sender_id, content, sent_at, sequence_number), and a per-user delivery/read-state table for read receipts.

Key considerations: message ordering (per-conversation monotonic sequence numbers, since wall-clock timestamps from different clients aren't reliably ordered), end-to-end encryption (if required, meaning the server can't read message content, only route encrypted blobs), presence (a lightweight, frequently-updated, best-effort system, often using heartbeats and short TTLs rather than strict consistency), and connection server failover (if a connection server dies, affected clients reconnect and re-register with a different server via the routing registry).`,
        },
      ],
    },
    {
      title: "Design a distributed cache like Redis",
      prompt:
        "Design a distributed, in-memory key-value cache system that can be sharded across many nodes, covering data partitioning, replication, and handling node failures. Assume it needs to support millions of keys and very high read/write throughput.",
      difficulty: "HARD",
      tags: [
        "design-question",
        "caching",
        "distributed-systems",
        "consistent-hashing",
      ],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Requirements: store key-value pairs in memory for very low-latency (sub-millisecond) get/set operations; scale horizontally across many nodes since the full dataset and required throughput exceed a single machine; tolerate individual node failures without losing all data for the keys that node held; support TTL-based expiration.

Partitioning (sharding): with many nodes, each key must be deterministically mapped to the node responsible for it. A naive hash(key) % N breaks badly whenever N changes (nearly all keys remap, causing a cache-wide stampede to the backing store). Consistent hashing solves this: nodes and keys are both mapped onto a hash ring (a fixed circular hash space), and a key belongs to the first node found walking clockwise from the key's position. Adding or removing a node then only remaps the keys between that node and its neighbor on the ring, not the entire keyspace — typically only about 1/N of keys move when a node is added or removed, rather than nearly all of them. Virtual nodes (each physical node mapped to many points on the ring) are used to keep the distribution of keys across nodes even, since a small number of raw hash points can distribute unevenly.

Replication and failure handling: each shard's data is replicated to one or more additional nodes (a primary plus replicas, similar to database replication) so that if the primary for a shard fails, a replica can be promoted and continue serving that shard's keys without data loss (up to whatever replication lag existed) or downtime. A cluster coordinator (or a gossip protocol between nodes, as Redis Cluster uses) tracks node health and ring/slot ownership, detects failures via missed heartbeats, and triggers failover.

Client routing: clients (or a proxy layer in front of the cluster) need to know the current key-to-node mapping to route requests directly to the right node rather than paying an extra network hop through a central router for every request; this mapping is typically cached client-side and refreshed when the cluster topology changes (e.g., Redis Cluster returns a MOVED error directing the client to the correct node if it guesses wrong, letting clients self-correct their local routing table).

Eviction and memory management: since it's an in-memory store with finite capacity, each node runs an eviction policy (commonly LRU or LFU, sometimes configurable) once memory pressure is reached, in addition to active/lazy TTL-based expiration for keys with an expiry set.

Consistency tradeoffs: a distributed cache typically favors availability and low latency over strong consistency — it's usually acceptable for a replica to briefly serve slightly stale data after a write to the primary, since caches are, by nature, not meant to be the single source of truth (the backing database/data store still is), and clients that need guaranteed-fresh data should read through to that source of truth.`,
          codeContent: `// Consistent hashing ring (simplified)
class ConsistentHashRing {
  private ring = new Map<number, string>(); // hash -> nodeId
  private sortedHashes: number[] = [];

  addNode(nodeId: string, virtualNodes = 150) {
    for (let i = 0; i < virtualNodes; i++) {
      const hash = this.hash(\`\${nodeId}#\${i}\`);
      this.ring.set(hash, nodeId);
    }
    this.sortedHashes = [...this.ring.keys()].sort((a, b) => a - b);
  }

  getNode(key: string): string {
    const hash = this.hash(key);
    const idx = this.sortedHashes.findIndex((h) => h >= hash);
    const targetHash = idx === -1 ? this.sortedHashes[0] : this.sortedHashes[idx];
    return this.ring.get(targetHash)!;
  }

  private hash(input: string): number {
    // stand-in for a real hash function (e.g., murmur3, md5)
    let h = 0;
    for (const ch of input) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  }
}`,
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title: "Design a notification system",
      prompt:
        "Design a system that sends notifications (push, email, SMS) to users triggered by events elsewhere in a platform (e.g., 'someone liked your post'), supporting per-user channel preferences and avoiding duplicate or excessive notifications.",
      difficulty: "HARD",
      tags: ["design-question", "notifications", "async-processing"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: many different services in a platform can trigger notifications (likes, comments, order updates, security alerts); notifications must be delivered through the right channel (push, email, SMS, in-app) per user preference; avoid overwhelming users with duplicate/excessive notifications; delivery should be reliable and not block the triggering service's own request path; support scale (potentially millions of notification events per hour).

High-level architecture:

1. Producers (any service — e.g., the "likes" service, "orders" service) publish a notification event to a message queue/topic (e.g., Kafka or SQS) rather than calling a notification API synchronously, decoupling the triggering action from delivery and letting the producer's own request complete quickly regardless of notification delivery time.

2. Notification service consumes these events and is responsible for: looking up the target user's channel preferences (has the user opted into push but not email for this event type?), deduplication/aggregation (e.g., batching "5 people liked your post" into one notification instead of 5 separate ones within a short window), rate limiting per user (avoid sending more than some cap of notifications in a period), and rendering the final message content (templated per event type and channel).

3. Channel-specific delivery workers/services: separate workers for push (calling APNs/FCM), email (via an ESP like SendGrid/SES), and SMS (via Twilio or similar), each consuming from their own queue so a slow or failing channel (e.g., an email provider outage) doesn't back up or block delivery on other channels.

4. A durable notification log/store records what was sent (and its delivery status) for auditing, for populating an in-app notification center, and to support deduplication (checking "did we already send this exact notification recently" before sending again).

Data model: user_notification_preferences (user_id, event_type, channel, enabled), notifications (notification_id, user_id, event_type, payload, created_at, status), and a delivery_attempts or per-channel status table for tracking retries.

Handling reliability and scale:
- Use retry with exponential backoff for transient failures calling external providers (push/email/SMS gateways), and a dead-letter queue for notifications that repeatedly fail, so they can be inspected/reprocessed rather than silently lost.
- Idempotency keys on notification events so that if a producer retries publishing (e.g., due to an ack timeout) or a consumer reprocesses a message after a crash, the same notification isn't sent twice.
- Aggregation windows (e.g., wait up to 60 seconds to batch similar events like multiple likes on the same post) reduce notification volume and avoid spamming users, at the cost of a small delivery delay.
- Priority tiers: security/critical notifications (e.g., "new login from unrecognized device") should bypass batching/aggregation and be delivered immediately through a high-priority path, distinct from lower-priority social notifications.

Preferences and quiet hours: respect user-configured preferences per event type and channel, and optionally per-user quiet hours (queue non-urgent notifications and deliver them after quiet hours end, while still allowing urgent/security notifications through immediately).`,
        },
      ],
    },
    {
      title: "Design a ride-sharing dispatch system",
      prompt:
        "Design the core matching/dispatch system for a ride-sharing app like Uber or Lyft: matching riders to nearby available drivers efficiently at city scale, and tracking driver locations in real time.",
      difficulty: "HARD",
      tags: ["design-question", "ride-sharing", "geospatial", "real-time"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: continuously track live driver locations; given a rider's pickup location, quickly find nearby available drivers and match/dispatch one; handle high write volume (drivers' apps report location every few seconds) and read volume (matching queries); operate correctly at city or global scale with many independent geographic markets.

Location tracking: driver apps periodically send location updates (e.g., every 4 seconds) to a location ingestion service. This is a very high write-throughput stream (millions of active drivers x frequent updates), so it's typically handled via a message queue/stream (e.g., Kafka) that ingestion workers consume to update each driver's current position in a fast-access store, rather than writing directly to a heavy relational database on every ping.

Geospatial indexing — the core matching problem: given a rider's location, find the nearest available drivers efficiently, rather than scanning every driver's location and computing distance (O(n), far too slow at scale). Common approaches:

- Geohashing: encode latitude/longitude into a string where nearby locations share common string prefixes; drivers are indexed/bucketed by geohash cell, and a search for nearby drivers becomes a lookup of drivers in the rider's geohash cell and its neighboring cells, rather than a scan of the entire city.
- Quadtrees: recursively subdivide the map into four quadrants, subdividing further only in cells with high driver density, giving a tree structure that naturally adapts search granularity to driver density (dense downtown areas get finer subdivision than sparse suburbs).
- Many real systems (including Uber's own published designs) use a hybrid or a similar space-filling-curve-based grid system (e.g., Uber's H3 hexagonal grid) precisely for this reason: it makes "find nearby available drivers" a fast, indexed lookup instead of a full scan.

Matching/dispatch flow:
1. Rider requests a ride from location X.
2. Dispatch service queries the geospatial index for available drivers within an expanding radius around X (starting small, expanding if too few results).
3. Candidate drivers are ranked (distance/ETA, driver rating, vehicle type match, fairness/rotation considerations) and the request is offered to the top candidate, with a short timeout to accept.
4. If declined or timed out, the offer moves to the next candidate; once a driver accepts, that driver is marked unavailable and the rider is notified, using the same real-time delivery infrastructure as a chat/notification system (persistent connections, e.g., WebSockets or push notifications).

Data model considerations: driver current-location state benefits from an in-memory store (e.g., Redis, which has built-in geospatial commands like GEOADD/GEORADIUS) for very fast read/write of ephemeral, frequently-changing position data, while ride history, driver profiles, and billing data belong in a durable, more traditional database, since they need long-term consistency and querying rather than raw speed.

Scaling and partitioning: partition the system by geographic region/city, since a ride in New York never needs to match against a driver in Los Angeles — this keeps each partition's dataset and query volume manageable and allows independent scaling per market, along with regional infrastructure for lower latency to local users.

Consistency considerations: driver location data is inherently a bit stale (a few seconds old) and that's an acceptable tradeoff for availability/speed; the ride matching decision itself, however, needs a stronger guarantee that a driver isn't double-booked, typically enforced via an atomic "claim" operation (e.g., a conditional update or distributed lock keyed by driver ID) when a driver accepts a ride offer.`,
        },
      ],
    },
    {
      title: "Design a web crawler",
      prompt:
        "Design a scalable web crawler that discovers and downloads web pages starting from a set of seed URLs, avoiding duplicate crawling and respecting site crawl politeness (e.g., robots.txt, rate limits per domain). Assume it needs to crawl billions of pages.",
      difficulty: "HARD",
      tags: ["design-question", "web-crawler", "distributed-systems"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: starting from seed URLs, discover and fetch web pages at massive scale (billions of pages), extract new links to crawl further, avoid re-crawling the same URL excessively, respect per-site politeness (robots.txt rules, rate limits so as not to overwhelm any single site), and be resilient/restartable given the scale and duration of the crawl.

High-level architecture (pipeline of stages, each independently scalable):

1. URL frontier: a large, prioritized queue of URLs waiting to be crawled. Rather than one simple FIFO queue, the frontier is typically partitioned per domain/host, both so a single popular domain's URLs don't dominate the whole crawl, and to enforce politeness — a per-domain queue lets the system control the crawl rate against any one host independently (e.g., wait N seconds between requests to the same domain), avoiding accidentally DoSing a site.

2. Fetcher workers: pull URLs from the frontier (respecting per-domain rate limits) and download the page content over HTTP, handling timeouts, redirects, and retries for transient failures.

3. Robots.txt / politeness check: before fetching (or crawling further on) a domain, fetch and cache that domain's robots.txt to determine disallowed paths and any specified crawl-delay, respecting it for all subsequent requests to that domain (with a reasonably long cache TTL, since robots.txt changes infrequently).

4. Duplicate detection: before adding a discovered URL to the frontier, check whether it's already been seen/crawled. At billions-of-URLs scale, storing a full set of every seen URL for exact lookup is expensive; a Bloom filter is commonly used as a fast, memory-efficient probabilistic pre-check (definitely-not-seen vs. maybe-seen), backed by a more authoritative store for the maybe-seen case, or accepting the Bloom filter's small false-positive rate (occasionally skipping a URL that wasn't actually seen) as a reasonable tradeoff at this scale. Similarly, near-duplicate content detection (e.g., using content hashing or shingling/simhash) helps avoid storing/reprocessing pages that are effectively the same content at different URLs.

5. Link extraction: parse fetched HTML to extract outbound links, normalize them (resolve relative URLs, strip tracking parameters/fragments where appropriate), and feed new, not-yet-seen URLs back into the frontier.

6. Storage: store the fetched page content (e.g., in a distributed blob store) plus metadata (URL, fetch time, HTTP status, content hash) in an index/database for downstream consumers (e.g., a search indexer).

Scaling and partitioning: distribute the frontier and fetcher workers across many machines, typically partitioning work by domain hash so that all URLs for a given domain are handled by a consistent subset of workers, keeping per-domain rate limiting and robots.txt caching simple and localized rather than needing global coordination for every single request.

Other considerations: prioritization (crawl high-value/frequently-changing pages more often — e.g., news homepages — versus rarely-changing static pages, informed by historical change-frequency data), crawl traps (avoiding infinite URL spaces like calendar pages that generate endless "next day" links, often mitigated with URL depth/pattern heuristics), and freshness (periodically re-crawling already-seen pages to detect content changes, not just discovering brand-new URLs).`,
        },
      ],
    },
    {
      title: "How would you design a distributed unique ID generator?",
      prompt:
        "Design a service that generates unique, roughly time-sortable IDs across many machines without coordination on every request, similar to Twitter's Snowflake. Explain the ID structure and why coordination-free generation matters at scale.",
      difficulty: "HARD",
      tags: ["design-question", "distributed-systems", "id-generation"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Requirements: generate IDs that are unique across an entire distributed system, ideally roughly sortable by creation time (useful for pagination and indexing performance), generated with very low latency, and without requiring a synchronous coordination step (like a database round-trip or distributed lock) on every single ID request, since that would become a severe bottleneck and single point of failure at high request volume.

Why a naive approach falls short: a single auto-incrementing counter in one database is simple and gives sortable, compact IDs, but doesn't scale as a distributed system's write volume grows (that one database becomes the bottleneck and a single point of failure) and doesn't work at all across independent, geographically-distributed nodes without coordination. UUIDs (v4, random) solve uniqueness without coordination since they're generated locally with negligible collision probability, but they are not time-sortable and are larger (128 bits, often stored/transmitted as a 36-character string), which hurts database index locality and performance for time-ordered access patterns.

Snowflake-style approach: encode an ID as a single 64-bit integer composed of several bit-packed fields generated locally on each node without needing to ask any other node:

- Timestamp (e.g., 41 bits): milliseconds since a custom epoch, giving both uniqueness-over-time and natural sortability, since IDs generated later have numerically larger timestamps.
- Machine/worker ID (e.g., 10 bits): a unique identifier assigned to each ID-generating node/process (up to 1024 distinct workers), assigned at startup via configuration or a coordination service like ZooKeeper (used only once at startup, not per-request).
- Sequence number (e.g., 12 bits): a per-millisecond counter local to that worker, incremented for each ID generated within the same millisecond on that worker (up to 4096 IDs per millisecond per worker), resetting when the millisecond ticks over.

Because each worker only needs its own pre-assigned worker ID and the current time to generate a new unique ID locally (no network call, no shared counter to coordinate), generation is extremely fast and horizontally scalable — throughput scales linearly by simply adding more worker nodes, each independently guaranteed to produce IDs that don't collide with any other worker's IDs (different worker ID bits) and are still roughly time-ordered globally (dominated by the timestamp bits).

Edge cases to handle: clock skew/drift or clock rollback (e.g., NTP adjusting the system clock backwards) can violate the "always increasing" assumption within a worker; a common mitigation is for a worker to detect if the current time is behind its last recorded timestamp and either wait or raise an error rather than risk generating a duplicate/out-of-order ID.`,
          codeContent: `// Simplified Snowflake-style ID generation (64-bit packed into a bigint)
class SnowflakeGenerator {
  private lastTimestamp = -1n;
  private sequence = 0n;
  constructor(private workerId: bigint, private epoch = 1700000000000n) {}

  nextId(): bigint {
    let timestamp = BigInt(Date.now()) - this.epoch;

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & 0xfffn; // 12-bit sequence
      if (this.sequence === 0n) {
        while (BigInt(Date.now()) - this.epoch <= timestamp) {} // wait for next ms
        timestamp = BigInt(Date.now()) - this.epoch;
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    return (timestamp << 22n) | (this.workerId << 12n) | this.sequence;
  }
}`,
          codeLanguage: "typescript",
        },
      ],
    },
    {
      title:
        "How would you design a system for exactly-once message processing?",
      prompt:
        "Message brokers commonly only guarantee at-least-once delivery. Explain why exactly-once processing is hard to achieve, and how you'd design consumers to behave as if messages are processed exactly once.",
      difficulty: "HARD",
      tags: ["message-queues", "idempotency", "distributed-systems"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Most distributed message brokers (SQS, Kafka in its default mode, RabbitMQ) guarantee at-least-once delivery: a message will be delivered one or more times, but never silently dropped. Exactly-once delivery at the transport level is fundamentally hard in a distributed system because it requires coordinating the producer's send, the broker's durable storage, and the consumer's processing and acknowledgment as a single atomic unit across independent, failure-prone machines connected by an unreliable network — any of those steps can fail or the acknowledgment itself can be lost after processing already succeeded, and there's no way for the sender to distinguish "message was never received" from "message was received and processed, but the ack was lost" without additional coordination.

Why at-least-once naturally happens in practice: a consumer might successfully process a message, then crash (or have a network blip) before sending the acknowledgment back to the broker; the broker, having not received an ack within its timeout, redelivers the message to another consumer, resulting in the same logical message being processed twice.

The practical solution used industry-wide is not to achieve true exactly-once delivery, but to achieve exactly-once processing semantics on top of at-least-once delivery, via idempotency: design consumers so that processing the same message multiple times has the same effect as processing it once.

How to make processing idempotent:

- Assign each message a unique idempotency key (either provided by the producer, e.g., a UUID generated once per logical event, or derived deterministically from the message's content/business key).
- Before applying a message's effect, check a durable store (a dedicated "processed message IDs" table, or a uniqueness constraint on the business operation itself) for whether that key has already been processed; if so, skip reprocessing (or return the previously computed result) instead of reapplying the effect.
- Where possible, design the operation itself to be naturally idempotent (e.g., "set user's status to active" rather than "increment active count by 1" — the former yields the same end state no matter how many times it's applied, while the latter double-counts on a retry).
- For database writes, this check-and-write should be atomic with respect to the actual side effect — e.g., using a database transaction that both records the idempotency key and applies the change, or a unique constraint on (idempotency_key) that causes a duplicate insert to fail safely, rather than checking in one step and writing in a separate, non-atomic step (which reintroduces a race condition between concurrent redeliveries).

This shifts the guarantee from "the broker promises exactly-once delivery" (very hard/impossible in general) to "the consumer's business logic behaves correctly no matter how many times a given message is delivered" (achievable and what real systems rely on).`,
        },
      ],
    },
    {
      title: "How do you handle database hotspots at scale?",
      prompt:
        "Explain what a database hotspot is, why sharding alone doesn't automatically prevent it, and strategies to mitigate hot keys/hot shards.",
      difficulty: "HARD",
      tags: ["databases", "sharding", "scalability", "hotspot"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A hotspot (or "hot key"/"hot shard") occurs when traffic is disproportionately concentrated on a small subset of keys or a single shard, overwhelming that specific node while the rest of the cluster sits comparatively idle — meaning the overall system is bottlenecked well below its aggregate theoretical capacity, even though total capacity across all nodes would otherwise be sufficient.

Why sharding alone doesn't prevent this: sharding distributes data based on a key, but it says nothing about the distribution of access frequency across keys. A poorly chosen shard key can concentrate both data and traffic unevenly (e.g., sharding by signup date puts all of today's highly active new users on one shard); even a well-distributed shard key for data volume can still produce a hotspot if real-world access patterns are skewed — a classic example is a celebrity's row in a "users" table or a viral post's row in a "posts" table receiving vastly more reads/writes than an average row, regardless of how evenly the table itself is partitioned.

Mitigation strategies:

- Better shard key selection: choose a key that distributes both data and access load evenly — hashing a naturally high-cardinality, evenly-accessed field (like a random or hashed user ID) is usually safer than a naturally skewed field (like signup date or a category with very unequal popularity).
- Key splitting / salting: for a single very hot key (e.g., a global counter, or a celebrity's like-count), split it into multiple sub-keys distributed across different shards/partitions (e.g., counter_0 through counter_9, each incremented by a random subset of requests), and aggregate the sub-keys when reading the total. This trades a slightly more expensive/complex read for dramatically better write distribution.
- Caching in front of the hot data: an in-memory cache (Redis) absorbing reads for hot keys means the underlying database shard only needs to serve cache misses, not every read directly.
- Read replicas targeted at hot shards: adding extra read replicas specifically for a shard known to be hot, to spread read load, while writes still go to that shard's primary.
- Application-level rate limiting or queuing for writes to an especially hot key, smoothing bursts rather than letting them all hit the database simultaneously.
- Detecting hotspots proactively via monitoring (per-shard/per-key request metrics) so the team can react (rebalance, add caching, adjust the shard key) before a hotspot causes an outage rather than discovering it during an incident.

The general theme: a hotspot is fundamentally a load-distribution problem, and while good shard key design reduces the likelihood, real-world traffic is rarely perfectly uniform, so systems at scale typically need caching, replica scaling, and/or key-splitting techniques as complementary defenses rather than relying on sharding strategy alone.`,
        },
      ],
    },
    {
      title: "Design a distributed job scheduler",
      prompt:
        "Design a system that lets other services schedule jobs to run at a specific time or on a recurring cron-like schedule, ensuring each job runs reliably even if individual worker nodes fail. Assume millions of scheduled jobs.",
      difficulty: "HARD",
      tags: ["design-question", "job-scheduler", "distributed-systems"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: clients can schedule a job to run once at a specific future time, or on a recurring schedule (cron-like); jobs must execute reliably (a scheduled job shouldn't silently be lost if a node crashes); the system must scale to millions of pending jobs and support timely execution (jobs run close to their scheduled time, not delayed by system overload); avoid duplicate execution of the same job occurrence.

Core components:

1. Scheduling API / metadata store: clients submit jobs (job definition, schedule — either a one-time timestamp or a cron expression, payload/callback info) which are persisted durably (e.g., in a relational database) as the source of truth. For recurring jobs, the system computes and stores the next execution time based on the cron expression.

2. Time-based partitioning / bucketing: rather than one giant sorted structure of "all jobs by execution time" that a single process polls (which wouldn't scale to millions of jobs), a common approach is to bucket jobs into time-based shards — e.g., a "minute bucket" structure where each bucket holds the jobs due to run within that minute, sometimes implemented as a hierarchical timing wheel (buckets for the next hour at minute granularity, further out jobs at coarser granularity, migrating to finer buckets as their time approaches). This lets the scheduler efficiently find "what's due now" without scanning the entire job set.

3. Dispatcher/polling workers: periodically (e.g., every few seconds) query for jobs due to run in the current time window and hand them off to execution, using a claim mechanism (e.g., an atomic conditional update marking a job as "claimed by worker X" with a lease/timeout) so that if multiple dispatcher instances are running for scale/redundancy, they don't both pick up and execute the same job.

4. Execution workers: pull claimed jobs from a queue and actually run them (e.g., invoking a webhook, running a task), reporting success/failure back to update the job's state. On failure, apply a retry policy (with backoff) up to a configured limit before marking the job failed and alerting.

5. Lease/heartbeat and reclaim logic: if a worker claims a job but crashes before completing/reporting it, the claim should have a timeout (lease) after which another worker can safely reclaim and retry the job, preventing jobs from being lost due to a single node failure.

Handling recurring jobs: after a recurring job's occurrence executes (or is due), compute its next occurrence from the cron expression and reinsert/reschedule it into the bucketing structure, rather than trying to represent all future occurrences upfront.

Ensuring exactly-once-ish execution: combine the atomic claim (preventing two workers from grabbing the same occurrence) with idempotent job handlers where possible (see the exactly-once processing question), since retries after a lease timeout could in rare cases still cause a job to run more than once if the original worker was merely slow rather than actually dead.

Scaling: partition the metadata store and bucket structure (e.g., by job ID hash or time range) across multiple nodes so both storage and dispatch polling scale horizontally; ensure dispatcher/worker fleets can be scaled independently based on job volume and execution duration.`,
        },
      ],
    },
    {
      title: "How would you design a system to prevent a cache stampede?",
      prompt:
        "Explain what a cache stampede (thundering herd) is, why it happens, and describe at least three techniques to prevent it.",
      difficulty: "HARD",
      tags: ["caching", "scalability", "thundering-herd"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `A cache stampede (also called a thundering herd) happens when a popular cached item expires or is evicted, and a large number of concurrent requests for that same item all miss the cache at roughly the same moment, causing all of them to simultaneously fall through to the backing data source (typically a database) to regenerate the value. If the underlying computation or query is expensive, this sudden burst of duplicate, simultaneous load can overwhelm the backend, causing slow responses or an outage — ironically, the very thing caching was meant to prevent, triggered by the cache itself.

Mitigation techniques:

1. Request coalescing (single-flight): when multiple concurrent requests miss the cache for the same key, ensure only one of them actually goes to the backend to regenerate the value, while the others wait for that in-flight computation to complete and then all share its result, rather than each independently hitting the backend. This is often implemented with a per-key lock or an in-memory "in-flight requests" map on the cache-serving layer.

2. Early/probabilistic expiration recomputation: instead of every request treating the cache as strictly hit-or-miss based on a hard TTL, have requests probabilistically decide to recompute slightly before actual expiration (with probability increasing as the entry approaches its TTL), so on average only one or a few requests trigger early recomputation and refresh the cache before it actually goes stale for everyone else, smoothing out the moment of expiration rather than concentrating all load exactly at the TTL boundary.

3. Stale-while-revalidate: continue serving the stale (expired) cached value to requests while a single background refresh updates the cache, rather than making every requester wait for or trigger a fresh recomputation; this trades brief staleness for avoiding a load spike entirely.

4. Locking with a fallback: the first request to encounter a miss acquires a short-lived lock (e.g., in Redis, via SETNX) and computes the fresh value while other concurrent requests either wait briefly and retry the cache, or serve a stale/default value rather than also attempting the expensive computation.

5. Staggered/jittered TTLs: if many related keys were all populated at the same time (e.g., during a cache warm-up or deploy) and would therefore all expire simultaneously, add random jitter to each key's TTL so their expirations are spread out over time instead of all falling due at once, avoiding a large-scale stampede across many keys simultaneously.

In an interview, it's good to mention that these techniques are complementary — a production system dealing with genuinely hot keys often combines request coalescing with stale-while-revalidate and jittered TTLs rather than relying on just one.`,
        },
      ],
    },
    {
      title: "Design a video streaming service like YouTube",
      prompt:
        "Design the core architecture for a video streaming platform: video upload and processing, storage, and delivery to viewers at scale with adaptive quality. Assume hundreds of millions of daily viewers.",
      difficulty: "HARD",
      tags: ["design-question", "video-streaming", "cdn", "scalability"],
      answers: [
        {
          contentType: "TEXT",
          textContent: `Requirements: creators upload video files; the platform processes them into a format suitable for efficient, adaptive-quality streaming; viewers can play videos with minimal startup delay and smooth playback across varying network conditions and devices, at massive scale (hundreds of millions of daily viewers, vastly more reads than writes).

Upload and processing pipeline:
1. Upload service: accepts the raw uploaded video file (often via resumable/chunked upload for large files) and stores the original in durable object storage (e.g., S3-like blob storage), then publishes an event that the video is ready for processing.
2. Transcoding pipeline: a fleet of async workers (triggered by the upload event via a queue) transcodes the raw video into multiple resolutions/bitrates (e.g., 240p, 480p, 720p, 1080p, 4K) and formats, and segments each into small chunks (a few seconds each) as required by adaptive streaming protocols like HLS or DASH. Transcoding is CPU/GPU-intensive and slow, so it runs asynchronously in the background — the uploader doesn't wait for it — with the video shown as "processing" until at least a base quality is ready.
3. Processed output storage: the transcoded segments and manifest files (describing available quality levels and segment URLs) are stored in object storage as well, organized per video.

Delivery/playback:
- Video segments are served through a CDN, not directly from origin storage, since read (playback) volume is enormous relative to upload volume, and video content is highly cacheable (immutable once processed) and benefits hugely from edge caching close to viewers to reduce latency and origin bandwidth cost.
- Adaptive bitrate streaming: the player downloads a manifest listing available quality levels, then requests segments at a quality level chosen based on currently measured network conditions/buffer health, switching up or down between segments as conditions change, so playback can start quickly at a lower quality and step up, or gracefully degrade instead of buffering/stalling on a slow connection.
- Playback metadata (view counts, likes, comments) is served from a separate, more traditional application/database layer, decoupled from the actual video byte delivery path.

Data model: videos (video_id, uploader_id, title, status, duration, created_at), video_renditions (video_id, resolution, bitrate, manifest/segment storage paths), and separate engagement tables (views, likes, comments) that don't need to sit on the hot video-serving path.

Key scaling considerations:
- Storage cost/tiering: keep frequently-watched videos' segments hot in CDN caches, and consider moving rarely-watched older content to cheaper, colder storage tiers, fetching and re-caching on the rare access.
- Processing scale: the transcoding worker fleet needs to scale elastically with upload volume, and prioritize producing at least a lower-quality rendition quickly so a video is watchable soon after upload, with higher-quality renditions completing shortly after.
- Global distribution: multiple CDN edge regions and, for very large scale, regional origin/storage replication so playback requests don't need to cross continents to fetch from a single origin.
- View count and analytics ingestion is itself high-volume and is typically handled by an asynchronous event pipeline (buffering and batching view events) rather than synchronous writes on every single playback tick, to avoid that becoming a bottleneck on the playback path itself.`,
        },
      ],
    },
    {
      title: "What is consistent hashing and why is it used?",
      prompt:
        "Explain consistent hashing, the problem it solves compared to simple modulo-based hashing, and where it's commonly applied in system design.",
      difficulty: "HARD",
      tags: ["consistent-hashing", "distributed-systems", "sharding"],
      answers: [
        {
          contentType: "BOTH",
          textContent: `Consistent hashing is a technique for distributing keys across a set of nodes such that adding or removing a node only requires remapping a small fraction of keys, rather than nearly all of them.

The problem with simple modulo hashing: a naive approach maps a key to a node via hash(key) % N, where N is the current number of nodes. This works fine while N stays fixed, but the moment N changes (a node is added or removed, which happens routinely in any real system due to scaling or failures), the result of % N changes for almost every key, meaning almost every key now maps to a different node than before. In a cache, this causes a massive, sudden wave of cache misses across nearly the entire dataset (a "stampede") as the cache effectively resets; in a sharded database, it would require moving nearly all data between nodes just because the cluster size changed slightly.

How consistent hashing fixes this: both nodes and keys are hashed onto the same fixed, circular hash space (a "ring," e.g., hash values from 0 to 2^32-1 arranged in a circle). A key is assigned to the first node encountered walking clockwise around the ring from the key's hash position. When a node is added, it only takes over the portion of the ring between itself and the next node clockwise — meaning only the keys that fall in that specific arc need to move, while every other key's mapping is completely unaffected. Similarly, removing a node only affects the keys that were mapped to it, which get reassigned to the next node clockwise; on average, only about 1/N of keys need to move for a ring of N nodes, rather than nearly all of them.

Virtual nodes: mapping each physical node to just one point on the ring can lead to uneven key distribution (some nodes get much larger arcs than others, especially with few nodes). The standard mitigation is to map each physical node to many points on the ring (virtual nodes, e.g., 100-200 per physical node, each with an independently hashed position), which averages out to a much more even distribution of keys across physical nodes, and also means that when a node is removed, the keys it held are spread across many other nodes rather than dumped entirely onto just its single ring neighbor.

Where it's used: distributed caches (Memcached client libraries, Redis Cluster's slot design is a related but distinct approach), distributed databases (Cassandra, DynamoDB), CDN request routing, and load balancers doing session-affinity routing — essentially anywhere keys need to be distributed across a dynamically-changing set of nodes with minimal disruption on membership changes.`,
          codeContent: `// See the earlier ConsistentHashRing example under "Design a distributed cache"
// for a working addNode/getNode implementation using virtual nodes.`,
          codeLanguage: "typescript",
        },
      ],
    },
  ],
};
