# LangchainJS

![Image 1: 1AH05dvGA 7db EMySc9AAw](https://dist.neo4j.com/wp-content/uploads/20230615211357/1AH05dvGA_7db_EMySc9AAw.png)

[LangChain.js](https://js.langchain.com/docs/get_started/introduction) is a JavaScript/TypeScript implementation of the LangChain library. It uses similar concepts, with Prompts, Chains, Transformers, Document Loaders, Agents, and more.

Here is an overview of the [Graph Integrations](https://js.langchain.com/docs/use_cases/graph/quickstart).

The Neo4j Integration makes the [Neo4j Vector](../vector-search/) index as well as Cypher generation and execution available in the LangChain.js library.

Learn how to build a chatbot in TypeScript using LangChain.js with our new [GraphAcademy course](https://graphacademy.neo4j.com/courses/llm-chatbot-typescript/).

![Image 2: llm chatbot typescript](https://cdn.graphacademy.neo4j.com/assets/img/courses/banners/llm-chatbot-typescript.png)

## Installation

```shell
npm install @langchain/openai neo4j-driver @langchain/community
```

## Functionality Includes

### Neo4jVector

The Neo4j Vector integration supports a number of operations:

- create vector from langchain documents
- query vector
- query vector with additional graph retrieval Cypher query
- construct vector instance from existing graph data
- hybrid search

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";

// Configuration object for Neo4j connection and other related settings
const config = {
  url: "bolt://localhost:7687", // URL for the Neo4j instance
  username: "neo4j", // Username for Neo4j authentication
  password: "pleaseletmein", // Password for Neo4j authentication
  indexName: "vector", // Name of the vector index
  keywordIndexName: "keyword", // Name of the keyword index if using hybrid search
  searchType: "vector" as const, // Type of search (e.g., vector, hybrid)
  nodeLabel: "Chunk", // Label for the nodes in the graph
  textNodeProperty: "text", // Property of the node containing text
  embeddingNodeProperty: "embedding", // Property of the node containing embedding
};

const documents = [
  { pageContent: "what's this", meta{ a: 2 } },
  { pageContent: "Cat drinks milk", meta{ a: 1 } },
];

const neo4jVectorIndex = await Neo4jVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings(),
  config
);

const results = await neo4jVectorIndex.similaritySearch("water", 1);

console.log(results);

/*
  [ Document { pageContent: 'Cat drinks milk', meta{ a: 1 } } ]
*/

await neo4jVectorIndex.close();
```

#### Hybrid Search

Hybrid search combines vector search with fulltext search with re-ranking and de-duplication of the results.

### Neo4j Graph

The Neo4j Graph integration is a wrapper for the Neo4j Python driver. It allows querying and updating the Neo4j database in a simplified manner from LangChain. Many integrations allow to use the Neo4j Graph as a source of data for LangChain.

```typescript
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

const graph = await Neo4jGraph.initialize({ NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD });

QUERY = """
MATCH (m:Movie)-[:IN_GENRE]->(:Genre {{name:$genre}})
RETURN m.title, m.plot
ORDER BY m.imdbRating DESC LIMIT 5"""

await graph.query(QUERY, genre="action")
```

### CypherQAChain

The CypherQAChain is a LangChain component that allows you to interact with a Neo4j graph database in natural language. Using an LLM and the graph schema it translates the user question into a Cypher query, executes it against the graph and uses the returned context information and the original question with a second LLM to generate a natural language response.

```typescript
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { OpenAI } from "@langchain/openai";
import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";

const graph = await Neo4jGraph.initialize({ NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD });
const model = new OpenAI({ temperature: 0 });

// Populate the database with two nodes and a relationship
await graph.query(`
  CREATE (a:Actor {name:'Bruce Willis'})
    ->(:Movie {title: 'Pulp Fiction'} `);

await graph.refreshSchema();

const chain = GraphCypherQAChain.fromLLM({ llm: model, graph });

const res = await chain.run("Who acted in Pulp Fiction?");
// Bruce Willis acted in Pulp Fiction.
```

### Knowledge Graph Construction

Creating a Knowledge Graph from unstructured data like PDF documents used to be a complex and time-consuming task that required training and using dedicated, large NLP models.

The Graph Transformers are tools that allow you to extract structured data from unstructured documents and transform it into a Knowledge Graph.

See [Graph Transformers for LangChain](https://js.langchain.com/docs/tutorials/graph/).
