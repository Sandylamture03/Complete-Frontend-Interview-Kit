# Frontend Interview Prep OS

This is a learning app for React.js and frontend interview preparation.

Live app:
- https://prep.ai-developer.in/

Think of it like one smart school bag:
- all your study notes stay in one place
- interview questions stay in one place
- easy explanations stay in one place
- practice rounds stay in one place

You do not have to keep opening many random files and websites again and again.

## What This App Does

This app helps you prepare for:
- React.js interviews
- frontend developer interviews
- JavaScript interviews
- HTML and CSS interviews
- browser and DOM questions
- accessibility questions
- performance and security questions
- DSA rounds for frontend roles
- machine coding rounds
- frontend system design rounds
- resume and behavioral rounds

For most topics, the app shows:
- easy explanation
- interview-ready answer
- example
- follow-up questions

## Why This App Is Special

This app is made to be:
- easy to understand
- useful for interviews
- available offline inside your project
- organized by track, topic, and experience level

It mixes two things together:
1. your own files from the `context/` folder
2. curated offline notes prepared inside the app

So you get both:
- your real source material
- cleaner study material for fast revision

## Main Parts Of The App

## 1. Dashboard

The home page gives you a quick view of:
- important tracks
- featured topics
- resource packs
- content library stats

This is the starting point.

## 2. Tracks

Tracks are big study groups like:
- React
- Frontend
- JavaScript
- HTML/CSS
- Accessibility
- Performance/Security
- DSA
- Machine Coding
- System Design
- Resume/Behavioral

Each track contains related topics.

## 3. Topics

Each topic teaches one concept in a simple way.

Example:
- React hooks
- state and props
- event loop
- flexbox and grid

Inside a topic you usually get:
- simple explanation
- analogy
- interview answer
- code example
- common mistakes

## 4. Interview Bank

This is the big interview-only section.

It is arranged like this:
- first choose a track
- then open a topic
- then see questions by experience level

Experience levels are:
- Beginner
- 1-3 years
- 3-6 years
- Expert

Each question shows:
- question
- easy answer
- interview-ready answer
- example
- why interviewer asks it
- follow-up questions

This section is made for direct interview preparation.

## 5. Drills

Drills help you practice quickly.

You can use them for:
- self-checking
- active recall
- short revision practice

This is good when you want to study fast.

## 6. Coding

The coding section helps with rounds where you must solve things.

It includes practice ideas like:
- polyfills
- async JavaScript
- DOM and event problems
- frontend DSA patterns
- machine coding prompts

## 7. Mock Interview

This page lets you practice like a real interview.

You can:
- answer questions one by one
- use voice features in supported browsers
- get AI feedback when AI is configured

Without AI setup:
- the page still opens
- non-AI parts of the app still work

With AI setup:
- the app can ask questions
- the app can review your answer
- the app can guide you on what was missing

## 8. Resources

This section stores offline resource packs inside the app.

That means:
- no need to jump to many external links
- important notes are already kept locally
- you can revise from one place

## 9. Resume

This section helps you prepare answers based on your own profile and work story.

It helps for questions like:
- tell me about yourself
- explain your project
- what was your role
- what challenge did you solve

## 10. Revision

This is your repeat-learning area.

It helps you remember weak topics again and again instead of forgetting them.

## How The App Works

The app works in a simple flow:

1. Files in `context/` are treated like raw study material.
2. The import script reads those files.
3. The app turns them into a structured question library.
4. Curated topic notes are added on top for easier learning.
5. The UI shows everything in a clean way.
6. Your progress is saved locally in your browser.

So the app is not only a notes app.
It is also:
- a question bank
- a revision tool
- a mock interview tool
- a resume prep tool

## How Content Is Stored

Important folders:

- `app/` -> pages of the website
- `components/` -> reusable UI parts
- `content/` -> learning content and generated library
- `context/` -> your raw files and source material
- `lib/` -> content logic, types, storage logic, AI helpers
- `scripts/` -> import script for turning files into structured data
- `tests/` -> automated tests

## Simple Project Flow

You add files here:

```text
context/
```

Then the import script processes them and creates structured data used by the app.

That processed content is used in:
- dashboard
- tracks
- interview bank
- drills
- mock interview

## How To Run The App

## Step 1

Install packages:

```bash
npm install
```

## Step 2

Start the app:

```bash
npm run dev
```

## Step 3

Open this in your browser:

```text
http://localhost:3000
```

## Useful Commands

Run the content import:

```bash
npm run import:content
```

Run tests:

```bash
npm test
```

Run lint:

```bash
npm run lint
```

Build the app:

```bash
npm run build
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## AI Features

AI is optional.

The app does not need AI for basic study.

The app does need AI if you want:
- AI mock interview feedback
- AI answer review
- AI-guided interview flow

To enable AI later, fill the variables in:

```text
.env.local
```

Use the format shown in:

```text
.env.example
```

## How To Add More Study Material

If you want more content:

1. add files into `context/`
2. run:

```bash
npm run import:content
```

3. restart the app if needed

Then the app can include those materials in the source library.

## Best Way To Use This App

If you are preparing for interviews, a simple path is:

1. start from `Tracks`
2. study one topic in simple mode
3. open `Interview Bank`
4. practice questions topic by topic
5. use `Drills`
6. use `Mock Interview`
7. revise weak topics in `Revision`
8. prepare self-introduction in `Resume`

## In One Line

This app is your one-place React and frontend interview preparation system, made to turn messy files and resources into simple learning, strong interview answers, and real practice.

## Deployment

If you want to put this app on your own domain, read [DEPLOYMENT.md](./DEPLOYMENT.md).

Current live deployment:
- https://prep.ai-developer.in/

That file explains:
- production branch
- dev branch
- Vercel setup
- custom domain setup
- AI environment variables
