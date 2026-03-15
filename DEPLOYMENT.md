# Deployment Guide

This app is ready to deploy as a Next.js app.

The simplest setup is:
- `main` = live production website
- `dev` = local development and new features

That means:
- you build new things in `dev`
- you deploy only from `main`

## Simple Branch Plan

Use this rule:

- `main` -> what the world sees
- `dev` -> what you are building now

Simple daily flow:

1. switch to `dev`
2. build and test new changes
3. merge `dev` into `main` when ready
4. push `main`
5. production deploy updates

Helpful commands:

```bash
git switch dev
git add .
git commit -m "Add new feature"
git switch main
git merge dev
git push origin main
```

If you want preview deployments later, you can also push `dev` to the remote:

```bash
git push -u origin dev
```

## Best Hosting Choice For This App

Use Vercel.

Why:
- this is a Next.js app
- Vercel understands Next.js very well
- custom domain support is simple
- production and preview deployments are easy

This repo already includes:
- [vercel.json](./vercel.json)

So the deployment path is already prepared.

If you want GitHub Actions later, you can add a workflow after updating your GitHub token permissions to include workflow management.

## First Deployment Steps

## 1. Push your repo

Make sure your latest code is in your git remote.

## 2. Import the repo into Vercel

In Vercel:

1. create a new project
2. import your git repository
3. let Vercel detect `Next.js`
4. keep the root folder as this project folder
5. deploy

The build command is already set in [vercel.json](./vercel.json):

```text
npm run build
```

That command already runs the content import and then builds the app.

## 3. Add environment variables if you want AI

AI is optional.

If you want AI mock interviews on production, add these environment variables in Vercel Project Settings:

```text
AI_API_KEY=your_key_here
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL=openai/gpt-oss-120b
```

If you do not add them:
- the normal learning app still works
- only AI interview features stay disabled

## 4. Add your custom domain

In Vercel Project Settings:

1. open `Domains`
2. add your domain name
3. Vercel will show the DNS records you must add at your domain provider
4. add those records where your domain is managed
5. wait for verification

Usually:
- root domain uses an `A` record
- `www` often uses a `CNAME`

Use the exact values Vercel shows in your dashboard, because DNS values can change over time.

## Production And Dev Workflow

Recommended setup:

- production branch in Vercel: `main`
- local development branch: `dev`

Good safe flow:

1. work on `dev`
2. test locally with `npm run dev`
3. run checks:

```bash
npm run lint
npm test
npm run build
```

4. merge to `main`
5. push `main`
6. Vercel deploys production

## Local Run

Start local development:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deployment Checklist

Before deploying:

- make sure `main` is clean
- make sure tests pass
- make sure build passes
- make sure `.env.local` is not committed
- make sure production secrets are added in Vercel
- make sure domain DNS is pointed correctly

## Very Short Version

Use `dev` for building.
Use `main` for production.
Connect `main` to Vercel.
Add your domain in Vercel.
Set DNS records.
Deploy.
