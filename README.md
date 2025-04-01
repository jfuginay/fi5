# Faith In Five

## Tech Stack

-   Client/Server - [React/Next](https://nextjs.org/)
-   Database - [Postgres](https://www.postgresql.org/)
-   ORM - [Prisma](https://www.prisma.io/)
-   API - [tRPC](https://trpc.io/)
-   State - [React-Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)
-   Forms - [React-Hook-Form](https://react-hook-form.com/)
-   Styling - [Tailwindcss](https://tailwindcss.com/)
-   UI library - [Chakra](https://chakra-ui.com/)
-   Input validation - [Zod](https://zod.dev/)
-   Authentication - [NextAuth](https://next-auth.js.org/)

## Development Server

In order to set up your development environment you will need to download some prerequisites:

-   `docker`
-   `docker-compose`
-   `node 16 or higher`
-   `npm` setup and configured on your machine.

Below are instructions for setting up your development environment.
You may also use [n](https://www.npmjs.com/package/n) to manage your node versions by running:

```bash
sudo npm i -g n
```

```bash
sudo n 16
```

### Install Prereqs

-   Docker Desktop https://www.docker.com/products/docker-desktop/
-   Node 16 (LTS) https://nodejs.org/en/download/

```bash
docker run hello-world
```

```bash
node -v
```

You should see the following (or a version slightly higher)

```bash
v16.17.1
```

### Setup environment

```bash
# Install dependencies, create environment variables
npm run first-time-setup
```

Once this completes, the following command will start up a development server on your local machine:

```bash
# Starts the docker containers for PostgreSQL, MailHog and runs Next.js with hot-reload support
npm run start:test-env
```

After those servers boot, you can run migrations and seed your database

```bash
npm run prisma:migrate-dev
npm run prisma:seed
```

### Create An Account

1. Go to http://localhost:3000
2. Click on `Sign in`, and enter an email
3. Open your inbox at http://localhost:8025 to verify your account

### Commonly used URL's

```bash
# The front-end React UI
http://localhost:3000
# The backend Next.js server
http://localhost:3000/api
# MailHog inbox
http://localhost:8025
```

## Making changes to the database

1. Edit the database schema inside `prisma/schema.prisma`
2. Run `npm run prisma:format` to check for errors
3. Run `npm run prisma:migrate-dev`

## Build

Run `npm run next:build` to build the project for production. The build artifacts will be stored in the `.next` directory.

## Useful resources

-   [Next in 100s](https://www.youtube.com/watch?v=Sklc_fQBmcs)
-   [Prisma in 100s](https://www.youtube.com/watch?v=rLRIB6AF2Dg)
-   [React-Query in 100s](https://www.youtube.com/watch?v=novnyCaa7To)
-   [Tailwind in 100s](https://www.youtube.com/watch?v=mr15Xzb1Ook)
-   [TypeScript in 100s](https://www.youtube.com/watch?v=zQnBQ4tB3ZA)
-   [Docker in 100s](https://www.youtube.com/watch?v=Gjnup-PuquQ)
-   [Build a Blog With the T3 Stack](https://www.youtube.com/watch?v=syEWlxVFUrY)
-   [Build a Live Chat Application with the T3 Stack](https://www.youtube.com/watch?v=dXRRY37MPuk)
