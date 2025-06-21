<script lang="ts">
    import { get, writable, type Writable } from "svelte/store";
    import GameInstance from "../lib/Game";

    const { instance } : { instance: GameInstance } = $props()

   
    const winningPath: Writable<undefined | Array<number>> = writable(undefined)
    const board = instance.board

    function handle_cell_selection(index: number){
        try {
            instance.setCellClaim(index, get(instance.turn))
            instance.setTurn()
        } catch (error) {
            console.error("Cell claiming error", error)
        }

        winningPath.set(instance.getWinningPath(index))
    }
</script>


<div class="board">
    <section>
        {#each $board as team, i}
            <button aria-label="Cell {i}" style="--colour: {$winningPath != undefined && $winningPath.includes(i)? "green":"unset"}" disabled={team != -1 || $winningPath != undefined} onclick={() => {handle_cell_selection(i)}}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {#if team == 0}
                        <path fill="cyan" xmlns="http://www.w3.org/2000/svg" d="M89.6333 1.46445C91.586 -0.488097 94.751 -0.488133 96.7036 1.46445L98.7515 3.51133C100.704 5.46393 100.704 8.63001 98.7515 10.5826L59.2261 50.1061L98.7515 89.6305C100.704 91.5831 100.704 94.7492 98.7515 96.7018L96.7036 98.7486C94.751 100.701 91.586 100.701 89.6333 98.7486L50.1079 59.2242L10.5835 98.7486C8.63087 100.701 5.46486 100.701 3.51222 98.7486L1.46437 96.7018C-0.488158 94.7492 -0.488073 91.5831 1.46437 89.6305L40.9888 50.1061L1.46437 10.5826C-0.488085 8.63002 -0.488161 5.46388 1.46437 3.51133L3.51222 1.46445C5.46486 -0.488151 8.63087 -0.488151 10.5835 1.46445L50.1079 40.9879L89.6333 1.46445Z"/>
                    {:else if team == 1}
                        <circle stroke="red" xmlns="http://www.w3.org/2000/svg" cx="50" cy="50" r="44.075" stroke-width="11.85"/>
                    {/if}
                </svg>
            </button>
        {/each}
    </section>
</div>


<style lang="scss">
    .board{
        $min-size: 150px;

        container: board-wrapper / size;
        box-sizing: border-box;
        min-height: $min-size;
        min-width: $min-size;
        max-height: 100vh;
        max-width: 100vw;
        overflow: hidden;
        display: grid;

        & > section{
            box-shadow: 0px 10px 5px -5px rgba(106, 106, 106, 0.2);
            grid-template-columns: repeat(var(--size, 3), 1fr);
            background-color: #4b4b4b;
            box-sizing: border-box;
            border-radius: 20px;
            aspect-ratio: 1/1;
            padding: 20px;
            display: grid;
            margin: auto;
            width: 100%;
            gap: 15px;
            

            @container board-wrapper (aspect-ratio > 1/1) {
                height: 100%;
                width: auto;
            }

            & > button{
                background-color: color-mix(in hsl, var(--colour, transparent) 10%, transparent);
                border: min(1vw, 3px) solid var(--colour, grey);
                box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.0);
                transition: 300ms all ease-out;
                border-radius: min(10%, 20px);
                box-sizing: border-box;
                aspect-ratio: 1/1;
                overflow: hidden;

                &:not(:disabled){
                    cursor: pointer;
                }

                &:hover:not(:disabled){
                    transition: 150ms all ease-in;
                    --colour: white;
                }

                &:is(:disabled, :hover){
                    box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
                    transition: 150ms box-shadow ease-in;
                }

                & > svg{
                    box-sizing: border-box;
                    aspect-ratio: 1/1;
                    margin: 10%;
                }
            }
        }

        
    }
</style>
