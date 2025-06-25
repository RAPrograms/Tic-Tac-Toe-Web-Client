<script>
    import Multiplayer from "./screens/multiplayer/Multiplayer.svelte";
    import SinglePlayer from "./screens/SinglePlayer.svelte";
    import SettingsMenu from "./screens/SettingsMenu.svelte";
    import MainMenu from "./screens/MainMenu.svelte";
    
    import { serverConnectPromise } from "./lib/Multiplayer";
    import { screen } from "./lib/state";
    import { onMount } from "svelte";

    onMount(async () => {
        const multiplayerServer = new URLSearchParams(document.location.search).get("server")
        if(multiplayerServer == undefined)
            return

        const results = await serverConnectPromise(multiplayerServer).catch(() => {})
        if(results == null)
            return

        // @ts-ignore
        window.serverConfigPreload = results
    })
</script>

{#if $screen == "main"}
    <MainMenu/>
{:else if $screen == "singleplayer"}
    <SinglePlayer/>
{:else if $screen == "multiplayer"}
    <Multiplayer/>
{:else if $screen == "settings"}
    <SettingsMenu/>
{/if}