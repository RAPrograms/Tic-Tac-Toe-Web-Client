import { writable, type Writable } from "svelte/store";

type screens = "main" | "singleplayer-menu" | "multiplayer-menu"

export const screen: Writable<screens> = writable("main")