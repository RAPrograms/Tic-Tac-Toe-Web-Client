<script>
    import { screen } from "./lib/state";
    import MainMenu from "./screens/MainMenu.svelte";
    import SinglePlayer from "./screens/SinglePlayer.svelte";
</script>

{#if $screen == "main"}
    <MainMenu/>
{:else if $screen == "singleplayer"}
    <SinglePlayer/>
{:else if $screen == "multiplayer"}

{/if}