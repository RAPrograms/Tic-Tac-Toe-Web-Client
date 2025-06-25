<script>
    import Multiplayer from "./screens/multiplayer/Multiplayer.svelte";
    import SinglePlayer from "./screens/SinglePlayer.svelte";
    import SettingsMenu from "./screens/SettingsMenu.svelte";
    import MainMenu from "./screens/MainMenu.svelte";
    
    import { screen } from "./lib/state";
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