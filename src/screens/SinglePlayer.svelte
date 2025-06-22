<script lang="ts">
    import MenuLayout from "../components/MenuLayout.svelte";
    import Button from "../components/Button.svelte";
    import Board from "../components/Board.svelte";
    import GameInstance from "../lib/Game";

    import { screen } from "../lib/state";
    import { get } from "svelte/store";

    let gameInstance: GameInstance | undefined = undefined
    let turn

    let boardInstance: Board | undefined

    function openGame(instance: GameInstance){
        gameInstance = instance
        turn = instance.turn
    }


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

        <Board instance={gameInstance} onCellSelect={saveGame} onFinish={() => {}} disabled={false} bind:this={boardInstance} />

        <div class="bnt">
            <Button onclick={() => boardInstance?.reset()} enabled={true}>Restart</Button>
        </div>
    </MenuLayout>
{:else}
    <MenuLayout title="Singleplayer" onExit={() => screen.set("main")}>
        <div class="bnt new-game">
            <Button enabled={true} onclick={() => openGame(GameInstance.new(3)) }>New Game</Button>
        </div>

        <section class="continue-game">
            {#each fakeDB as instance}
                <button onclick={() => openGame(instance) }>
                    <Board {instance} disabled={true} onCellSelect={() => false} onFinish={() => {}}/>
                    <div>12 june 2025</div>
                </button>
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
        position: sticky;
        z-index: 1;
        top: 0;
        left: 0;
    }

    :global([data-menu="tic-tac-toe"]) :global(.board){
        flex-grow: 1;
        width: 100%;
    }

    section.continue-game{
        justify-content: center;
        flex-wrap: wrap;
        display: flex;
        z-index: 0;
        gap: 20px;

        & > button{
            background: rgba(162, 162, 162, 0.466);
            transition: 400ms box-shadow ease-out;
            box-shadow: 0px 0px 0px -10px white;
            padding: 20px 20px 10px 20px;
            backdrop-filter: blur(10px);
            box-sizing: border-box;
            border-radius: 20px;
            cursor: pointer;
            border: none;

            & > div{
                font-weight: bold;
                margin-top: 10px;
                font-size: 20px;
            }

            & > :global(.board){
                pointer-events: none;
            }

            &:hover{
                box-shadow: 0px 0px 30px -10px white;
                transition: 150ms box-shadow ease-in;
            }
        }
    }
</style>