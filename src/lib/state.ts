import { writable, type Writable } from "svelte/store";

type screens = "main" | "singleplayer" | "multiplayer" | "settings"

export const screen: Writable<screens> = writable("main")


import Database from "./Database";

export const database = new Database("Games", 1, (db: IDBDatabase) => {
    if(!db.objectStoreNames.contains("active"))
        db.createObjectStore("active", { keyPath: "id" });
})