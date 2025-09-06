<script lang="ts">
    import { fade } from "svelte/transition";
    import { screen } from "../lib/state";

    import Button from "../components/Button.svelte";
    
</script>

<div class="screen" transition:fade>
    <header>
        <span>Welcome To</span>
        <h1>TIC TAC TOE</h1>
    </header>
    <main>
        <Button onclick={() => {screen.set("singleplayer")}} enabled={true}>Singleplayer</Button>
        <Button onclick={() => {screen.set("multiplayer")}} enabled={false}>Multiplayer</Button>
        <br>
        <Button onclick={() => {screen.set("settings")}} enabled={true}>Settings</Button>
        <a class="credit" href="https://github.com/RAPrograms/Tic-Tac-Toe-Web-Client" target="_blank" rel="noopener noreferrer">RAPrograms</a>
    </main>
</div>

<style lang="scss">
    @import "../variables.scss";

    .screen{
        justify-content: center;
        flex-direction: column;
        align-items: center;
        display: flex;
    }

    header{
        & > h1{ line-height: 20px; }

        text-align: center;
        margin: 40px 0;
    }

    main{
        flex-direction: column;
        display: flex;
        width: 300px;
        gap: 20px;

        & > .credit{
            text-align: center;
            text-decoration: none;
            color: white;
        }
    }
</style>

