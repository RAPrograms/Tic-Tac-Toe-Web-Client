<script lang="ts">
    import MenuLayout from "../components/MenuLayout.svelte";
    import Button from "../components/Button.svelte";
    import Board from "../components/Board.svelte";
    import GameInstance from "../lib/Game";

    import { screen } from "../lib/state";

    let gameInstance: GameInstance | undefined = undefined
    let turn
</script>

{#if gameInstance}
    <MenuLayout title="Tic Tac Toe" onExit={() => screen.set("main")}>
        <header>
            <h2>
                <span style="color: {$turn == 0? "cyan":"red"}">{$turn == 0? "X":"O"}</span> 
                team turn
            </h2>
        </header>

        <Board instance={gameInstance} />

        <div class="bnt">
            <Button onclick={() => {gameInstance!.reset()}}>Restart</Button>
        </div>
    </MenuLayout>
{:else}
    <MenuLayout title="Singleplayer" onExit={() => screen.set("main")}>
        <div class="bnt">
            <Button onclick={() => {
                gameInstance = GameInstance.new(3)
                turn = gameInstance.turn
            }}>New Game</Button>
        </div>
    </MenuLayout>
{/if}


<style lang="scss">
    div.bnt{
        margin: 10px auto;
        max-width: 300px;
    }

    :global([data-menu="tic-tac-toe"]) :global(.board){
        flex-grow: 1;
        width: 100%;
    }
</style>