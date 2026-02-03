# PDF Documents AI Q&A API

## Description

A NestJS app with custom modules implementing services powered by AWS SDK v3 library for S3, Google's NPM `genai` library and Pinecone's SDK.

## Technologies used

- TypeScript - a high-level, multi-paradigm programming language.

- Node.JS - free, open-source, cross-platform JavaScript runtime environment.

- npm - package manager for the JavaScript programming language maintained by npm, Inc., a subsidiary of GitHub.

- AWS S3 - Simple Storage Service, a highly scalable, durable, and secure object storage service offered by AWS

- Pinecone - a fully managed, cloud-native vector database designed for fast, scalable storage and retrieval of high-dimensional vector embeddings

- NestJS - a progressive, free, and open-source Node.js framework for building efficient, scalable server-side applications.

- MongoDB - an open-source NoSQL database that uses a document-oriented, flexible schema instead of traditional table-based relational structures.

- Mongoose - a popular Object Data Modeling (ODM) library for MongoDB and Node.js

## Structure and workflow

The `api` directory has `src/` with the source TypeScript project files. The application is divided in the `modules/` into separate modules for handling S3, Pinecone, Gemini and HTTP routing to the `/documents`, `/chat` routes.

## Installation

The app uses `npm` as the package manager.

```shell
npm install
```

## Running the project

The application requires valid database URL and other variables set up in the `.env` file, as shown in `.env.example`.

To run the application in the development mode:

```shell
npm run start:dev
```

For the communication with `infra` exposure of the app is required, which can be done using instruments like `ngrok` and providing the DNS to the `infra` SSM parameters.
