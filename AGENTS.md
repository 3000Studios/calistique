# Codex Autonomous Development Instructions

Project: myappai
Owner: 3000Studios

Purpose:
Build and maintain an AI system manager platform that converts natural language commands into executable development tasks.

The system acts as a developer command center capable of:

- managing system resources
- executing scripts
- building software projects
- automating development workflows
- running AI agents
- providing a web dashboard interface

---

# Primary Architecture

The project contains the following modules:

/dashboard
Web UI for system control

/engine
AI command interpreter

/scripts
Script generation and execution engine

/workers
Automation agents

/api
Backend endpoints

---

# Core Commands

When working in this repository always follow this execution pipeline.

1. Install dependencies
2. Validate environment
3. Run linting
4. Run tests
5. Start development server
6. Apply requested code changes
7. Re-test
8. Commit changes

---

# Dependency Setup

Node.js must be installed.

Install dependencies with:

npm install

If Python modules exist:

pip install -r requirements.txt

---

# Development Server

Start the development server using:

npm run dev

The server should run locally and expose API endpoints.

---

# Testing

Before committing changes always run:

npm run test

or

pytest

---

# Coding Rules

Follow these standards:

- Prefer TypeScript over JavaScript
- Use async/await for async operations
- Keep modules small and focused
- Avoid breaking existing API routes
- Maintain consistent folder structure

---

# Performance Goals

The system must prioritize:

- fast execution
- low latency
- minimal blocking operations
- clean architecture

---

# Security Rules

Never expose API keys or secrets in code.

Environment variables must be used for secrets.

---

# Deployment

Production builds must use:

npm run build

Artifacts should be generated in the build or dist directory.

---

# Commit Strategy

When changes are made:

1. run tests
2. verify application boots
3. create commit
4. push branch
5. open pull request

---

# Autonomous Behavior

Codex should:

- automatically install dependencies
- fix build errors
- run tests
- improve code quality
- maintain working builds

The goal is a continuously improving autonomous development workflow.
