"use client";

import { openDB } from "idb";

import type { SessionResult } from "@/lib/types";

const DB_NAME = "frontend-interview-prep";
const STORE_NAME = "sessions";

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function saveSessionResult(result: SessionResult) {
  const db = await getDb();
  await db.put(STORE_NAME, result);
}

export async function loadSessionResults(): Promise<SessionResult[]> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}
