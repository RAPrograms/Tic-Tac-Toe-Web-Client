<script lang="ts">
    import MenuLayout from "../components/MenuLayout.svelte";
    import Button from "../components/Button.svelte";
    import Board from "../components/Board.svelte";
    import GameInstance from "../lib/Game";

    import { screen } from "../lib/state";


    let gamebackCooldown: string | number | NodeJS.Timeout | undefined

    let gameInstance: GameInstance | undefined = undefined
    let turn

    let boardInstance: Board | undefined

    function openGame(instance: GameInstance){
        gameInstance = instance
        turn = instance.turn

        gamebackCooldown = setTimeout(() => {
            clearTimeout(gamebackCooldown)
            gamebackCooldown = undefined
        }, 10000)
    }

    function exitGame(){
        if(gamebackCooldown == undefined)
            return screen.set("main")
        
        gameInstance = undefined
        turn = undefined
    }

    function saveGame(index: number, finished: boolean){
        if(finished)
            return

        gameInstance?.saveActive()
        console.log("Saving")
    }
</script>

{#if gameInstance}
    <MenuLayout title="Tic Tac Toe" onExit={exitGame}>
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
            {#await GameInstance.getAllActive()}
               {#each {length: 10} as _}
                    <div class="placeholder"></div>
               {/each}
            {:then games} 
                {#each games as instance}
                    <button onclick={() => openGame(instance) }>
                        <Board {instance} disabled={true} onCellSelect={() => {}} onFinish={() => {}}/>
                    </button>
                {/each}
            {/await}
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

        & > button, & > .placeholder{
            background: rgba(162, 162, 162, 0.466);
            backdrop-filter: blur(10px);
            box-sizing: border-box;
            border-radius: 20px;
            aspect-ratio: 1/1;
            padding: 20px;
            width: 190px;
            border: none;
        }

        & > button{
            transition: 400ms box-shadow ease-out;
            box-shadow: 0px 0px 0px -10px white;
            cursor: pointer;

            & > :global(.board){
                pointer-events: none;
            }

            &:hover{
                box-shadow: 0px 0px 30px -10px white;
                transition: 150ms box-shadow ease-in;
            }
        }

        & > .placeholder{
            animation: pulsing 1s infinite ease-in-out alternate;
            position: relative;
            isolation: isolate;
            overflow: hidden;
        }
    }

    @keyframes pulsing{
        from {opacity: .7}
        to {opacity: .3;}
    }
</style>