<script>
    import MenuLayout from "./components/MenuLayout.svelte";
    import { screen } from "./lib/state";
    import MainMenu from "./screens/MainMenu.svelte";
    import SinglePlayerMenu from "./screens/SinglePlayerMenu.svelte";


</script>

{#if $screen == "main"}
    <MainMenu/>
{:else if $screen == "singleplayer-menu"}
    <SinglePlayerMenu/>
{:else if $screen == "multiplayer-menu"}

{/if}