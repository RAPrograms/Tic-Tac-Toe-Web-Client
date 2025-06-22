<script lang="ts">
    import MenuLayout from "../components/MenuLayout.svelte";
    import Button from "../components/Button.svelte";
    import Board from "../components/Board.svelte";
    import GameInstance from "../lib/Game";

    import { screen } from "../lib/state";
    import { get } from "svelte/store";

    let gameInstance: GameInstance | undefined = undefined
    let turn





    function fakegen(){
        const instance = GameInstance.new(3)
        for(let i=0; i<8; i++){
            const team = Math.round(i % 2)
            const index = Math.round(Math.random() * 9) 
            try {
                instance.setCellClaim(index, team as 0 | 1 | -1 | undefined)
            } catch (error) {}
        }

        return instance
    }

    const fakeDB = Array(100).fill(undefined).map(() => fakegen())
</script>

{#if gameInstance}
    <MenuLayout title="Tic Tac Toe" onExit={() => screen.set("main")}>
        <header>
            <h2>
                <span style="color: {$turn == 0? "cyan":"red"}">{$turn == 0? "X":"O"}</span> 
                team turn
            </h2>
        </header>

        <Board instance={gameInstance} onCellSelect={() => {}} onFinish={() => {}} />

        <div class="bnt">
            <Button onclick={() => {gameInstance!.reset()}} enabled={true}>Restart</Button>
        </div>
    </MenuLayout>
{:else}
    <MenuLayout title="Singleplayer" onExit={() => screen.set("main")}>
        <div class="bnt new-game">
            <Button enabled={true} onclick={() => {
                gameInstance = GameInstance.new(3)
                turn = gameInstance.turn
            }}>New Game</Button>
        </div>

        <section class="continue-game">
            {#each fakeDB as instance}
                <article>
                    <Board {instance} onCellSelect={() => false} onFinish={() => {}}/>
                </article>
            {/each}
        </section>
    </MenuLayout>
{/if}


<style lang="scss">
    div.bnt{
        margin: 10px auto;
        max-width: 300px;
    }

    div.bnt.new-game{
        top: 0;
        left: 0;
        position: sticky;
    }

    :global([data-menu="tic-tac-toe"]) :global(.board){
        flex-grow: 1;
        width: 100%;
    }

    section.continue-game{
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
    }
</style>