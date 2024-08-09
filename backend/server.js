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
import embeddingText1 from './recipes/embeddingString1.js';
import embeddingText2 from './recipes/embeddingString2.js';

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
  const { query, namespace } = req.query || {};
  console.log('GET/query');
  console.log('  Query:', query);
  console.log('  Namespace:', namespace);
  const document = await queryDocs(query, namespace);
  res.send(document);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Speech-to-Text API!');
});

if (!process.env.PINECONE_INDEX || !process.env.PINECONE_API_KEY || !process.env.OPENAI_API_KEY) {
  throw new Error("API keys requried is missing: PINECONE_INDEX || PINECONE_API_KEY || OPENAI_API_KEY");
}
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

const embedder = new OpenAIEmbeddings(
  {
    model: "text-embedding-3-small",
  }
);

const storeDocs = async (text, namespace) => {
  const docs = text;
  await PineconeStore.fromDocuments(docs, embedder, {
    pineconeIndex,
    namespace,
    maxConcurrency: 5,
  });
  console.log("Stored documents in Pinecone");
};

const queryDocs = async (query, namespace) => {
  const vectorStore = await PineconeStore.fromExistingIndex(
    embedder,
    { pineconeIndex, namespace }
  );
  
  const results = await vectorStore.similaritySearch(query, 5);
  console.log(results);
  return results;
}

const deleteAll = async (namespaces) => {
  try {
    namespaces.forEach(async (namespace) => {
      await pineconeIndex.namespace(namespace).deleteAll();
      console.log("Deleted all documents in " + namespace);
    });
  } catch (error) {
    // console.error("Error deleting documents", error);
  }
};

async function main() {
  // await deleteAll(['ns1']);
  // await storeDocs(embeddingText1, "recipe1");
  // await storeDocs(embeddingText2, "recipe2");
}

main();
// queryDocs("What ingredients are needed for the pancake?", "recipe2");