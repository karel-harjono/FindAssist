import dotenv from "dotenv";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter, CharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
dotenv.config();

import cheerio from 'cheerio';
import { writeFile } from 'fs/promises';

const pdfPath = 'recipe.pdf';

import { getDocument } from "pdfjs-dist";

async function getTextFromPDF(path) {
    let doc = await getDocument(path).promise;
    let page1 = await doc.getPage(2);
    let content = await page1.getTextContent();
    let strings = content.items.map(function(item) {
        return item.str;
    });
    await writeFile('output.txt', strings);
    console.log('Text content extracted and written to output.txt');
    
    return strings;
}

async function extractTextFromUrl(url) {
    try {
        const response = await fetch(url);
        const body = await response.text();
        
        const $ = cheerio.load(body);
        
        // Remove script, style, and other non-visible elements
        $('script, style, noscript, iframe').remove();
        
        // Get text from body, filtering out non-visible elements
        let text = $('body').find('*').not('script, style').contents()
            .filter(function() {
                return this.type === 'text';
            })
            .text();

        // Replace multiple newlines and whitespace with a single space
        // text = text.replace(/\s+/g, ' ').trim();

        // Write the cleaned text to a file
        await writeFile('output.txt', text);

        console.log('Text content extracted and written to output.txt');
        return text;
    } catch (error) {
        console.error('Error:', error);
    }
}

// const index = pc.index("pinecone-index")
// await index.namespace('example-namespace').deleteAll();

// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io

const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
const namespace = "ns1";

const embedder = new OpenAIEmbeddings(
  {
    model: "text-embedding-3-small",
  }
);

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 250,
  chunkOverlap: 50,
});

// const splitter = new CharacterTextSplitter({
//   separator: ".",
//   chunkSize: 250,
//   chunkOverlap: 50,
// });

const url = 'https://www.maangchi.com/recipe/dububuchim-yangnyeomjang';

const storeDocs = async (text) => {
    const docs = await splitter.createDocuments([text]);
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
  const results = await vectorStore.similaritySearch(query, 3);
  console.log(results);
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
  const text = await getTextFromPDF(pdfPath);
  // const text = await extractTextFromUrl(url);
  // await deleteAll();
  // await storeDocs(text);
  // await queryDocs("grade");
}

main();
// queryDocs("how long should this be in the oven for?");
// queryDocs("What ingredients are needed?");