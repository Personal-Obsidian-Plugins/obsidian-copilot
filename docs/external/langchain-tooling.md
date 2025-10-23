# LangChain Tooling: Best Practices and Guidelines

## 🎯 1. Tool Creation

LangChain tools encapsulate a function plus an input schema so an agent can call external systems (APIs, databases, file stores) via structured arguments. This makes agents far more capable than pure text‑generation models.

### ✨ What is a tool?

- A tool is a callable function with a structured input schema; agents can decide to call it when appropriate.
- Tools let models interact with the outside world via well‑defined inputs and outputs.
- Some providers (OpenAI, Anthropic, Gemini) already expose built‑in tools such as web search or code interpreters.

### 🛠️ How to create a tool

1. **Define a function** that performs the desired action (e.g., search a database, fetch weather).

2. **Specify an input schema** using Zod or JSON to define the expected arguments. Example:

   ```js
   import * as z from "zod";
   import { tool } from "langchain";

   const searchDatabase = tool(({ query, limit }) => `Found ${limit} results for '${query}'`, {
     name: "search_database",
     description: "Search the customer database for records matching the query.",
     schema: z.object({
       query: z.string().describe("Search terms to look for"),
       limit: z.number().describe("Maximum number of results to return"),
     }),
   });
   ```

   The agent can now call `search_database` with structured arguments.

3. **Access runtime context**: Tools can receive a `runtime` parameter (an instance of `ToolRuntime`) that exposes mutable state, immutable context (e.g., user ID), long‑term store, streaming writer and tool‑call ID. Just add `runtime: ToolRuntime` to your tool signature.

4. **Access persistent memory**: Use `runtime.store` to read or write values across sessions.

5. **Stream updates**: If you need real‑time progress, call `config.streamWriter` or `config.writer` in your tool to emit custom updates as it runs. This becomes part of streaming (see below).

### ✅ Best practices for tool creation

- **Clear names and descriptions:** Give your tools action‑oriented names and concise descriptions so the LLM knows when to call them. E.g., `search_customer_orders` instead of `orders` or `do_api_call`. This helps the model choose the right tool.
- **Use descriptive schemas:** Define precise argument types (e.g., strings, numbers) and add `describe` text to each field. This clarity improves the model’s ability to populate tool arguments correctly.
- **Validate inputs:** Zod schemas validate the incoming arguments and will catch type mismatches early, reducing runtime errors.
- **Keep side effects minimal:** Tools should ideally be idempotent and predictable. For example, separate a “fetch data” tool from a “write data” tool so that read and write operations are clear.
- **Expose only necessary context:** Use `runtime.context` to pass immutable configuration (like user ID) and `runtime.store` for persistent state. Don’t overuse global variables; keep state explicit.
- **Consider async support:** If your tool performs I/O (DB queries, API calls), define it as an async function so it doesn’t block the agent loop.

---

## 🧠 2. Middleware

Middleware lets you intercept and control the agent’s execution at key points—before and after model calls and tool calls. It’s an advanced mechanism for injecting behavior such as logging, modifying prompts, enforcing limits, or adding approval workflows.

### 🧩 What middleware can do

- **Monitor**: Log or analyze agent behavior at each step (for debugging, analytics or audit purposes).
- **Modify**: Transform prompts, change tool selection, or reformat outputs before they’re returned.
- **Control**: Implement retries, fallback models, or early termination logic.
- **Enforce policies**: Apply rate limits, guardrails (e.g., PII detection), or other compliance checks.

Middleware is added via the `middleware` array when you call `createAgent`:

```js
import { createAgent, summarizationMiddleware, humanInTheLoopMiddleware } from "langchain";

const agent = createAgent({
  model: "openai:gpt-4o",
  tools: [getWeather, saveUserInfo],
  middleware: [summarizationMiddleware, humanInTheLoopMiddleware],
});
```

### 🔌 Built‑in middleware (examples)

- **Summarization**: Summarizes long conversation histories when you approach context/token limits. You can configure the model used for summarization, the token threshold, and how many recent messages to keep.
- **Human-in-the-loop**: Pauses agent execution to request human approval/editing/rejection before certain tool calls, ideal for high‑stakes actions like sending emails or performing transactions.
- **Prompt caching (Anthropic)**: Caches repeated prompt prefixes to reduce costs with Anthropic models.
- **Model call limit**: Limits the number of model calls in a thread or a single run to control cost and prevent infinite loops.
- **Tool call limit**: Restricts how often a tool can be called (globally or per tool).

### 🛡️ Best practices for middleware

- **Start simple:** Use middleware sparingly at first—only add complexity where you need control or observability. Too many middleware layers can make debugging difficult.
- **Order matters:** Middleware runs in order; place logging middleware first if you want to capture raw inputs, and security middleware before anything sensitive.
- **Use summarization to stay within context limits:** Summarization keeps long chats manageable by summarizing history when tokens exceed a threshold. Choose a smaller model for summarization to save costs.
- **Implement human approval for high‑risk actions:** Use human‑in‑the‑loop middleware for operations like database writes or external actions. Configure `interruptOn` to specify which tools require approval.
- **Monitor tool/model usage:** Apply call‑limit middleware to avoid runaway costs or loops. Set sensible `runLimit` and `threadLimit` values.
- **Extend context:** Use middleware with custom state schema to carry additional data across agent steps.

---

## 📑 3. Structured Output

Structured output means the agent returns a typed object (JSON) instead of free‑form text. This is critical when your downstream logic needs predictable fields rather than parsing natural language.

### 🧱 Basics

- When you pass a `responseFormat` to `createAgent`, the agent will return a `structuredResponse` property in its final state.
- The schema can be a **Zod schema** or a **JSON Schema**.
- Depending on the model provider, you can choose between two strategies:

  1. **Provider strategy**: If your model natively supports structured output (OpenAI and Grok currently), LangChain will use it automatically. This is the most reliable approach.
  2. **Tool strategy**: If the model doesn’t support native structured output, LangChain will call a special tool internally to produce the structured data.

### 🚀 Using a provider strategy

```js
import * as z from "zod";
import { createAgent, providerStrategy } from "langchain";

const ContactInfo = z.object({
  name: z.string().describe("The name of the person"),
  email: z.string().describe("The email address of the person"),
  phone: z.string().describe("The phone number of the person"),
});

const agent = createAgent({
  model: "openai:gpt-5",
  tools: tools,
  responseFormat: providerStrategy(ContactInfo),
});

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "Extract contact info from: John Doe, john@example.com, (555) 123-4567",
    },
  ],
});
const contact = result.structuredResponse;
// contact = { name: "John Doe", email: "john@example.com", phone: "(555) 123-4567" }
```

Provider-native structured output gives strict validation because the provider enforces the schema.

### 🛠 Using a tool strategy

For models that don’t support native structured output, call `toolStrategy`:

```js
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const ProductReview = z.object({
  rating: z.number().min(1).max(5).optional(),
  sentiment: z.enum(["positive", "negative"]),
  keyPoints: z
    .array(z.string())
    .describe("The key points of the review. Lowercase, 1-3 words each."),
});

const agent = createAgent({
  model: "openai:gpt-5",
  tools: tools,
  responseFormat: toolStrategy(ProductReview),
});

const res = await agent.invoke({
  messages: [
    {
      role: "user",
      content:
        "Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'",
    },
  ],
});
console.log(res.structuredResponse);
// { rating: 5, sentiment: "positive", keyPoints: ["fast shipping", "expensive"] }
```

### ⚠️ Error handling & custom content

- You can provide `toolMessageContent` to customize the message shown in the chat when structured output is produced.
- The `handleError` option in `toolStrategy` allows you to catch and retry errors or propagate them directly.
- Union types (array of schemas) are supported when multiple possible outputs exist.

### ✅ Best practices for structured output

- **Define clear schemas:** Use descriptive Zod schemas or JSON schemas; include `.describe()` on fields to clarify what each field should contain.
- **Prefer provider strategy when available:** It’s more robust because the provider enforces the schema.
- **Handle errors gracefully:** Use `handleError` to manage parsing or validation errors, and decide whether to retry or throw.
- **Avoid over‑complex schemas:** Start simple; complex nested structures can be hard for models to produce accurately. If needed, iteratively refine.

---

## 📡 4. Streaming

Streaming lets your application show intermediate outputs (tokens or updates) as they are generated, greatly improving user experience, especially for slow LLM responses.

### 🌊 Overview

- Streaming surfaces real‑time updates from agent runs.
- You can stream:

  1. **Agent progress** (updates after each agent step).
  2. **LLM tokens** as they’re generated.
  3. **Custom updates** emitted by your tools.

- Streaming modes can be combined (e.g., `["updates", "messages", "custom"]`).

### 🧱 Streaming agent progress

Use `agent.stream()` with `streamMode: "updates"` to receive an event after each agent step. For a single tool call you might see events like:

1. Model call requesting a tool,
2. Tool execution result,
3. Final model response.

Example (simplified):

```js
for await (const chunk of await agent.stream(
  { messages: [{ role: "user", content: "what is the weather in SF?" }] },
  { streamMode: "updates" }
)) {
  // chunk is a record keyed by step name ('model' or 'tools') with the content
  console.log(chunk);
}
```

### 🧵 Streaming LLM tokens

Set `streamMode: "messages"` to stream tokens as they are produced by the model. Each yield contains `[token, metadata]`; the token holds content blocks (the partial text) and the metadata identifies which node produced it.

### 📨 Streaming custom updates from tools

To emit custom updates, call the writer within your tool (available via `config.writer` or `config.streamWriter`). This can be used to stream progress messages like “Looking up data…” and “Acquired data…”.

Example:

```js
const getWeather = tool(
  async (input, config) => {
    config.writer?.(`Looking up data for city: ${input.city}`);
    // fetch data...
    config.writer?.(`Acquired data for city: ${input.city}`);
    return `It's always sunny in ${input.city}!`;
  },
  {
    name: "get_weather",
    description: "Get weather for a given city.",
    schema: z.object({ city: z.string() }),
  }
);
```

### ✅ Best practices for streaming

- **Use streaming to improve UX:** Show partial responses (tokens) or progress updates to keep users engaged and informed.
- **Combine modes thoughtfully:** When debugging, you might want all modes; for user‑facing applications, choose what’s most useful (e.g., only tokens or only progress).
- **Handle network constraints:** If you’re behind a proxy that doesn’t support streaming, the response may be buffered. Consider fallbacks or proxies that support streaming.
- **Avoid over‑streaming:** Too many custom updates can overwhelm clients; emit meaningful updates (e.g., completion percentages, milestones).
- **Clean up context:** If a tool uses `config.writer`, it can’t be invoked outside a LangGraph execution without a writer function, so design your tools accordingly.

---

## 🧠 Extra best practices for LangChain

Beyond the specific features above, here are some general tips for building robust LangChain applications:

- **Scope your agent:** Start with realistic tasks and develop a standard operating procedure. If a task is too broad to describe step‑by‑step or would be unrealistic for a smart intern, refine it before coding.
- **Design before building:** Write down the flow, decisions, and required tools; this surfaces the inputs and outputs your agent will need.
- **Test with examples:** Before adding complexity, manually test your prompts and tools using concrete examples to ensure the LLM’s reasoning works.
- **Iterate and monitor:** Use tracing and logging (via LangSmith or middleware) to understand where agents make mistakes and to track improvements over time.
- **Keep latency and cost in mind:** Every tool call and model invocation costs tokens and time. Use caching, call limits, and summarization middleware to control them.
- **Prefer built‑in features:** When provider strategies (structured output), built‑in tools (e.g., search), or built‑in middleware solve your problem, use them. Only build custom logic when necessary.
- **Use clear naming conventions:** Name your tools, variables and middleware functions descriptively. This reduces confusion both for the LLM and for human developers.
- **Plan for human oversight:** For actions that affect real users or critical systems, incorporate human approval via middleware.

With these guidelines, you’re well-equipped to build robust, responsive, and maintainable LangChain agents that use tools, middleware, structured output, and streaming effectively. 🚀
