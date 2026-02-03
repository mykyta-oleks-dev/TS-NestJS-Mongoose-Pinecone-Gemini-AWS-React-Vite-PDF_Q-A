# PDF Documents AI Q&A

## Description

The fullstack web application for chat-like experience in Q&A on .pdf files text content with Gemini AI. Upload your .pdf document, wait for it to be processed and feel free to ask your question on the text content of the uploaded file! Uses Gemini AI for processing both the contents and the questions for answering.

## Technologies used

- TypeScript - a high-level, multi-paradigm programming language.

- Node.JS - free, open-source, cross-platform JavaScript runtime environment.

- npm - package manager for the JavaScript programming language maintained by npm, Inc., a subsidiary of GitHub.

- Serverless Framework - an open-source Command Line Interface (CLI) tool designed to build, deploy, and manage serverless applications, primarily for AWS Lambda and other cloud providers.

- AWS S3 - Simple Storage Service, a highly scalable, durable, and secure object storage service offered by AWS

- AWS Lambda - a serverless, event-driven compute service that allows you to run code without provisioning or managing servers.

- AWS Step Functions - a serverless, visual orchestrator that lets developers build multi-step workflows, or "state machines," to connect AWS services like Lambda, DynamoDB, and SNS.

- Pinecone - a fully managed, cloud-native vector database designed for fast, scalable storage and retrieval of high-dimensional vector embeddings

- NestJS - a progressive, free, and open-source Node.js framework for building efficient, scalable server-side applications.

- MongoDB - an open-source NoSQL database that uses a document-oriented, flexible schema instead of traditional table-based relational structures.

- Mongoose - a popular Object Data Modeling (ODM) library for MongoDB and Node.js

- React - a free and open-source front-end JavaScript library for building user interfaces.

- Vite - a build tool and development server for modern JavaScript projects, designed to provide a fast and lean development experience.

- TanStack Query - a library designed for managing server state in web applications

- Zustand - "A small, fast, and scalable bearbones state management solution".

- Shadcn - "A set of beautifully designed components that you can customize, extend, and build on."

## Structure

The project consists of: `infra` directory with defined Serverless stack, that describes the S3-State Machine-Lambdas architecture and handlers used for Lambda Functions; `api` directory with NestJS application using AWS SDK v3 libraries for S3 and SQS, custom modules and PostgreSQL migrations; `client` directory with React SPA.

The `infra` stack uses saved in AWS SSM such parameters, as URLs to `api` and `client` apps for adding CORS policy access and making the signed requests for updating the documents on state machine flow end.

The `api` functionality is divided between custom modules and services, implementing generation of presigned URLs for S3 files upload, their reading and text retrieval, SQS messages resolving, OpenSearch indexing.

The `client` is a React SPA with single purpose of providing UI for displaying and managing the uploaded document files.

## Workflow

Most requests to the `api` application on `/documents` sub-route require providing `X-User-Email` header with the valid email for the user. It is used to authentication and validation of incoming data.

Files are uploaded using S3 PUT presigned URLs, which are valid 60s. The files are placed under `tmp` prefix for automatic cleanup, meaning the client needs to make a request for finalizing file upload.

The finalizing request tells `api` to copy the file into temporary location. Movement of the documents triggers the state machine starting its document processing workflow, including batching, embedding text contents and saving the vectors to Pinecone index.

The `client` application asks the user for their email and saves it into the local storage to later restore the authentication status. Page changes to the chat interface and input fields below with the actions to log out and manage the file upload.

Uploading process includes HTTP request to generate the presigned URL and following request on that URL with selected file. DB record is created on confirming the upload with finalizing request after checks on the file existance.

The status of the files contents processing is dynamically updated with SSE connection between apps. On pending processing, success or failure the label shows appropriate text and is blue, red or green accordingly.

After successful file processing chat messaging becomes enabled, allowing to ask the AI on the file contents. The message is embedded in the `api` and is used to query the Pinecone index on the file vectors under the corresponding namespace. Most fitting chunks of text are used as context for Gemini to answer the actual question.

On file delete, the request is sent to `api` to command the file removal from S3 as well as delete pinecone namespace for the document's processed vectors and DB records related to the file.

## Installation

The apps use `npm` as the package manager.

Go to corresponding app's folders to learn more from their `README.md`s.

## Running the project

Refer to the apps' inner `README.md`s for running them in development mode.

## Features

- Email Authentication/Authorization: Authenticate with your email

- Chat Page: The previous questions to AI are rendered for the current user if document was previously uploaded

- Uploading Document: Users are able to upload .pdf file up to 10MBs. The files are uploaded in multiple steps and processed on background while the new record with status 'pending' is added.

- Questioning the AI: The question can be printed into the input below to be sent for processing and answer generation by the AI

- Delete Document: Users are able to delete the current document from the system, issuing the command for the storage and background process for removing the related document and chat messages records from DB
