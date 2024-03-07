# RAG Arena

RAG Arena is an open-source Next.js project made my mendable.ai that interfaces with LangChain to provide a RAG chatbot experience where queries receive multiple responses. Users vote on these responses, which are then unblurred to reveal the Retriever used, differentiating the chatbots by their data RAG methods. The project utilizes Supabase for database operations and features a real-time leaderboard displaying data from the database.

## Installation

Ensure you have `pnpm` installed on your system. If not, install it via:

```bash
npm install -g pnpm
```

Clone the project repository:

```bash
git clone https://github.com/mendableai/rag-arena
```

Navigate to the project directory and install the dependencies:

```bash
cd RAG-arena
pnpm i
```

Configure your environment variables:

```
# probably in: https://platform.openai.com/api-keys
OPENAI_API_KEY=

# probably in: https://supabase.com/dashboard/ project>project settings>api
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PRIVATE_KEY=

# probably in: https://console.upstash.com/redis/
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

PRODUCTION=false
```

Start the development server:

```bash
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

# Architecture Overview

### Ingestion System

- **Path:** `app/api/ingest/route.ts`
- **Description:** This module is responsible for ingesting articles into a vector database, making them retrievable for future queries.
- **Implementation Details:**
  - **Splitter:** Utilizes the `RecursiveCharacterTextSplitter` from LangChain for effective text splitting.
  - **Embeddings:** Leverages `OpenAIEmbeddings` for generating document embeddings.
  - **Storage:** Employs `SupabaseVectorStore` for storing the processed documents in Supabase.

### Dynamic Retriever

- **Path:** `app/api/retrievers/dynamic-retriever/route.ts`
- **Description:** Dynamically selects and uses different retrievers based on user input to fetch relevant documents.
- **Key Features:**
  - **Rate Limiting:** Implements rate limiting to manage the load and ensure fair usage.
  - **Document RAG:** Retrieves documents that are most relevant to the user's query.
  - **OpenAI Integration:** Interacts with OpenAI's API to enhance chat completions, powered by SupabaseVectorStore for document matching.

### Voting System

- **Path:** `actions/voting-system.ts`
- **Purpose:** Oversees the logic behind voting for the retrieved answers, which is crucial for the learning and adaptation of the system.
- **Functionalities:**
  - **Vote Tracking:** Updates the number of votes, times tested, and the Elo ratings for each retriever.
  - **Elo Adjustment:** Adjusts the Elo ratings based on the average number of times retrievers have been tested, promoting fairness and accuracy.

```
// calculation used for the elo
function calculateEloAdjustment(timesTested: number, averageTimesTested: number): number {
    if (averageTimesTested === 0) return 10;
    const adjustmentFactor = timesTested / averageTimesTested;
    return (1 / adjustmentFactor) * 10;
}
```

### Database Schema

- **Table Name:** Leaderboard
- **Contents:** Holds crucial data for each retriever, including `id`, `retriever`, `elo`, `votes`, `times_tested`, `full_name`, `description`, and `link`.

## RAG Functions Overview

(https://js.langchain.com/docs/modules/data_connection/retrievers/)

This section outlines the various RAG functions defined in `app/api/retrievers/dynamic-retriever/tools/functions.ts`, detailing their purpose and implementation within the project's architecture. These functions play a crucial role in the document RAG process, leveraging different strategies and technologies to optimize performance and accuracy.

### Vector Store

- **When to Use:** Ideal for beginners seeking a quick and straightforward solution.
- **Description:** This function leverages the simplicity of creating embeddings for each text piece, making it the most accessible starting point for document RAG.

### Parent Document

- **When to Use:** Best for documents divided into smaller, distinct chunks of information that are indexed separately but should be retrieved as a whole.
- **Description:** It indexes multiple chunks per document, identifying the most similar chunks in embedding space to retrieve the entire parent document, rather than just the individual chunks.

### Multi Vector

- **When to Use:** Suitable when you can extract more relevant information for indexing than the document's text itself.
- **Description:** Creates multiple vectors for each document, with each vector potentially representing text summaries, hypothetical questions, or other forms of distilled information.

### Contextual Compression

- **When to Use:** Useful when retrieved documents contain excessive irrelevant information, distracting from the core query response.
- **Description:** Adds a post-processing step to another retriever, extracting only the most pertinent information from retrieved documents, which can be accomplished using embeddings or an LLM.

### Time Weighted

- **When to Use:** Ideal for documents with associated timestamps, aiming to retrieve the most recent documents based on semantic similarity and recency.
- **Description:** Retrieves documents by balancing semantic similarity with document timestamps, ensuring recent documents are prioritized in the RAG process.

### Multi-Query Retriever

- **When to Use:** Best for complex queries requiring multiple distinct pieces of information for a comprehensive response.
- **Description:** Generates multiple queries from a single input, addressing the need for information across various topics to answer the original query fully. This approach fetches documents for each generated query, ensuring a thorough response.

## Contributing

Contributions are welcome! Please follow the standard fork & pull request workflow. Ensure you adhere to the coding styles and patterns present in the project and write tests for new features or bug fixes.

## License

RAG Arena is open source and released under the MIT License. See the LICENSE file for more information.
