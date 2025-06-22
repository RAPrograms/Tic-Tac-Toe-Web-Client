import { writable, type Writable } from "svelte/store";

type screens = "main" | "singleplayer" | "multiplayer" | "settings"

export const screen: Writable<screens> = writable("main")