import dotenv from "dotenv";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter, CharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
dotenv.config();

import cheerio from 'cheerio';
import { writeFile } from 'fs/promises';

import express from 'express';
import { getDocument } from "pdfjs-dist";
import googleServer from './google-server.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import embeddingText from './recipes/embeddingString.js';

const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));  // For URL-encoded data
app.use('/speech', googleServer);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/query', async (req, res) => {
  const query = req.query.query;
  console.log(query);
  const document = await queryDocs(query);
  res.send(document);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Speech-to-Text API!');
});

// const index = pc.index("pinecone-index")
// await index.namespace('example-namespace').deleteAll();

// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io

// catch an exception of when the environment variables are not set

if (!process.env.PINECONE_INDEX || !process.env.PINECONE_API_KEY || !process.env.OPENAI_API_KEY) {
  throw new Error("API keys requried is missing: PINECONE_INDEX || PINECONE_API_KEY || OPENAI_API_KEY");
}
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
const namespace = "ns1";

const embedder = new OpenAIEmbeddings(
  {
    model: "text-embedding-3-small",
  }
);

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 50,
//   chunkOverlap: 10,
// });

const splitter = new CharacterTextSplitter({
  separator: "\n",
  chunkSize: 40,
  chunkOverlap: 10,
});

const recipe = "./recipes/recipe2.txt";

const storeDocs = async (text) => {
  // const docs = await splitter.createDocuments([text]);
  const docs = embeddingText;

  console.log(docs);
  await PineconeStore.fromDocuments(docs, embedder, {
    pineconeIndex,
    namespace,
    maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  });
  console.log("Stored documents in Pinecone");
};

const queryDocs = async (query) => {
  const vectorStore = await PineconeStore.fromExistingIndex(
    embedder,
    { pineconeIndex, namespace }
  );
  
  /* Search the vector DB independently with metadata filters */
  const results = await vectorStore.similaritySearch(query, 5);
  console.log(results);
  return results;
}

const deleteAll = async () => {
  try {
    await pineconeIndex.namespace(namespace).deleteAll();
    console.log("Deleted all documents");
  } catch (error) {
    // console.error("Error deleting documents", error);
  }
};

async function main() {
  const text = readFileSync(recipe, 'utf8');
  // console.log(text);
  // const text = await extractTextFromUrl(url);
  // await deleteAll();
  // await storeDocs(text);
  // await queryDocs("grade");
}

main();
// queryDocs("how long should this be in the oven for?");
// queryDocs("What ingredients are needed for the pancake?");