# Navigator - Linktree API Clone

This is a clone of the Linktree API built with TypeScript, Express, Prisma, and Supabase. The API allows users to create an account, log in with JWT-based access and refresh tokens, and manage links that they wish to publish.

## Features

- **User Authentication**: Sign up, login with access and refresh tokens.
- **Link Management**: Create, update, delete, and fetch links.
  - Fetch individual links by ID.
  - Fetch all links associated with a specific username.

## Technologies Used

- **Backend Framework**: Express
- **Database ORM**: Prisma
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v18.x.x or higher)
- pnpm (v8.x.x or higher)
- Supabase project with database set up

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zulfikarrosadi/navigator-backend.git
   cd navigator-backend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Copy .env.example to .env and fill all variables

4. Run database migrations:

   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:

   ```bash
   pnpm run dev
   ```

The server will be running on localhost with port you define in .env file.

## API Endpoints

Import postman collection to view all endpoint
TODO: craete endpoint for API documentation

---

## Contribution Guidelines

We welcome contributions to the Navigator! Please follow these guidelines to help us maintain the quality and consistency of the project.

## Branching Model

- **dev branch**: All development happens here. You cannot push directly to `dev`.
- **feature branches**: Every feature or bug fix must be done in a separate branch, named descriptively, e.g., `feat/user-authentication` or `fix/link-fetch-error`.
- **Pull requests**: Before merging into `dev`, create a pull request. The integration status checks must pass before the PR can be merged.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. Examples:

- `feat: add user registration endpoint`
- `fix: correct issue with link deletion`
- `chore: update dependencies`
- `docs: add API documentation for link creation`

## Code Style

- This project uses ESLint and Prettier for linting and formatting. Please ensure that your code passes the linter and is formatted properly before committing.
- Husky and lint-staged are used to enforce linting and formatting on commit.

Run the following command to manually lint and format the code:

```bash
pnpm run lint
pnpm run format
```

## Pull Request Process

1. Create a new branch from `dev` for your feature or bug fix.
2. Make your changes in the branch.
3. Ensure all linting, formatting, and tests pass before committing.
4. Push the branch to the repository.
5. Open a pull request into `dev`.
6. Your pull request will be reviewed and must pass all integration checks before being merged.

---

Feel free to customize any part of this draft based on additional specifics!
