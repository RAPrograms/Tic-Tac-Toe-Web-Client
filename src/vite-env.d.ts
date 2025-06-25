/// <reference types="svelte" />
/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface ServerConfig{
    MaxRoomInstances: number
    MinRoomInstances: number
    AllowUserCreateRooms: boolean
}