# PDF Documents AI Q&A Client

## Description

The client React application suited for deployment with Vercel.

## Technologies used

- TypeScript - a high-level, multi-paradigm programming language.

- Node.JS - free, open-source, cross-platform JavaScript runtime environment.

- npm - package manager for the JavaScript programming language maintained by npm, Inc., a subsidiary of GitHub.

- React - a free and open-source front-end JavaScript library for building user interfaces.

- Vite - a build tool and development server for modern JavaScript projects, designed to provide a fast and lean development experience.

- TanStack Query - a library designed for managing server state in web applications

- Zustand - "A small, fast, and scalable bearbones state management solution".

- Shadcn - "A set of beautifully designed components that you can customize, extend, and build on."

## Structure and workflow

The client app uses Vite for serving the React app with grouped and structured components, separate configurations. The authentication is managed by storing the user's email in local storage. The possible change to the authentication process is to switch to storing the JWT and partial user's data instead.

## Installation

The client app uses `npm` as the package manager.

```shell
npm install
```

## Running the project

The application connects to Supabase by creating client with provided env variables, as well as requests data from `api` Edge Function by axios fetches.

Run the script to start the app in development:

```shell
npm run dev
```

Set up the `.env` with variables as shown in `.env.example`. For deployment, set the environment variables directly or using other tools in the app's root.

The app's url (whether from local dev run or production deployment) are to be exposed to the `infra` SSM parameters for correct S3 CORS policy to allow file PUT requests with the generated presigned URLs.
