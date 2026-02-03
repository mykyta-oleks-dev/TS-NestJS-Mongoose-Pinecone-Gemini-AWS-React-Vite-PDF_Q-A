# PDF Documents AI Q&A Cloud Infrastructure

## Description

A Serverless Framework stack describing the AWS S3 bucket, State Machine and Lambda Functions Cloud Formation stack for processing .pdf documents saved under `docs/{user-email}` prefix.

## Technologies used

- TypeScript - a high-level, multi-paradigm programming language.

- Node.JS - free, open-source, cross-platform JavaScript runtime environment.

- npm - package manager for the JavaScript programming language maintained by npm, Inc., a subsidiary of GitHub.

- Serverless Framework - an open-source Command Line Interface (CLI) tool designed to build, deploy, and manage serverless applications, primarily for AWS Lambda and other cloud providers.

- AWS S3 - Simple Storage Service, a highly scalable, durable, and secure object storage service offered by AWS

- AWS Lambda - a serverless, event-driven compute service that allows you to run code without provisioning or managing servers.

- AWS Step Functions - a serverless, visual orchestrator that lets developers build multi-step workflows, or "state machines," to connect AWS services like Lambda, DynamoDB, and SNS.

- Pinecone - a fully managed, cloud-native vector database designed for fast, scalable storage and retrieval of high-dimensional vector embeddings

## Structure and workflow

The `infra` directory consists of `handlers/` with the source TypeScript Lambda Functions definitions, `shared/` with type definitions and `serverless.yml` for Cloud Formation stack definition.

## Installation

The stack uses `npm` as the package manager.

```shell
npm install
```

## Deploying and running the project

The application requires setting the next parameters in the AWS SSM before deployment to work correctly (stage = `dev` or `prod`):

- Gemini API key as `infra/{stage}/gemini/apiKey` SecureString
- Pinecone API key as `infra/{stage}/pinecone/apiKey` SecureString
- HMAC secret as `infra/{stage}/hmac` SecureString (shared with `api`)
- API URL as `infra/{stage}/apiUrl` String
- Client URL as `infra/{stage}/clientUrl` String

The production deployment of the project will require first acquiring the DNS-es for API and Client and then their put in the SSM Parameters Store as they are baked inside the stack's functions and services as env variables.

To deploy the stack at the development stage:

```shell
serverless deploy
```

To deploy the stack as any other stage specify the stage name in the `--stage` parameter:

```shell
serverless deploy --stage prod
```

The stack will automatically receive calls to start the flow with the successful uploads to the S3 by the expected prefix.
