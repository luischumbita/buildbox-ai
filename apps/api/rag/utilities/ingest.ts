import 'dotenv/config';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { JsonOutputParser } from "@langchain/core/output_parsers";
//Minio client
import { Client as MinioClient } from 'minio';
import type { Document } from '@langchain/core/documents';
import path from 'path';

//S3 condig



const minioParams = {
    endPoint: process.env.S3_ENDPOINT || '',
    port: parseInt(process.env.S3_PORT || '9003'),
    useSSL: process.env.S3_USE_SSL === 'true',
    accessKey: process.env.S3_ACCESS_KEY_ID || '',
    secretKey: process.env.S3_SECRET_ACCESS_KEY || '',
    region: process.env.S3_REGION || '',
};
console.log(minioParams);
const BUCKET_NAME = process.env.S3_BUCKET || '';

const minioClient = new MinioClient(
    minioParams
)



//Qdrant config

const qdrantConfig = {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
};

const collectionName = "buildBox-rag";

const llmApiKey = process.env.GOOGLE_API_KEY;
if (!llmApiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
}
const llm = new GoogleGenerativeAI(llmApiKey);

const model = llm.getGenerativeModel({
    model: "gemini-2.0-flash",
});

//Embeddings from google

async function getVectorStore() {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "models/embedding-001",
    });

    const client = new QdrantClient({
        port: 80,
        url: qdrantConfig.url,
        apiKey: qdrantConfig.apiKey,
        checkCompatibility: false,
    });

    return new QdrantVectorStore(embeddings, {
        client,
        collectionName: collectionName,
    });
}


//Classify chunks --> Just in case we need it


//Main function to ingest data

async function ingestData() {
    try {
        console.log('Ingesting data...');
        if (!BUCKET_NAME) {
            throw new Error('S3_BUCKET environment variable is required');
        }
        const filesNames: string[] = [];
        const stream = minioClient.listObjectsV2(BUCKET_NAME, '', true);
        await new Promise<void>((resolve, reject) => {
            stream.on('data', obj => {
                if (obj.name) filesNames.push(obj.name);
            });
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        if (filesNames.length === 0) {
            console.log('No files found in the bucket');
            return;
        }

        console.log("Qdrant connection successful");

        const vectorStore = await getVectorStore();
        console.log("Vector store created");

        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
        console.log(`Found ${filesNames.length} files in the bucket`);

        for (const fileName of filesNames) {
            console.log(`Processing file: ${fileName}`);
            if (!fileName || path.extname(fileName).toLocaleLowerCase() !== '.pdf') {
                console.log("Skipeando archivos que no son pdfs")
                continue
            }

            const pdfStream = await minioClient.getObject(BUCKET_NAME, fileName);
            const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
                const chunks: Buffer[] = [];
                pdfStream.on('data', (chunk) => chunks.push(chunk));
                pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
                pdfStream.on('error', reject);
            });

            const loader = new PDFLoader(new Blob([pdfBuffer]));
            const docs = await loader.load();
            const chunks = await textSplitter.splitDocuments(docs);
            await vectorStore.addDocuments(chunks);
            console.log(`Added ${chunks.length} chunks from ${fileName} to the vector store.`);
        }

        //Determinar categories from files not obligatory

    } catch (error) {
        console.error('Exploto en el ingest pipo', error)
        process.exit(1);
    }
}

ingestData().catch(console.error)
