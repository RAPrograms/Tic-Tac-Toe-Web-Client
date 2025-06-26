<script lang="ts">
    import LoadingIcon from "../../components/LoadingIcon.svelte";

    let ready = $state(false)
    let otherReady = $state(true)

    let playerCount = $state(1)

</script>

{#snippet playerCard(number: number)}
    <h1>P{number}</h1>
    <svg viewBox="0 0 164 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M120.267 0C144.42 0 164 19.5367 164 43.6364V76.3636C164 100.463 144.42 120 120.267 120H43.7333C19.5801 120 7.04434e-07 100.463 0 76.3636V43.6364C7.04434e-07 19.5367 19.5801 1.22995e-06 43.7333 0H120.267ZM113.707 82.9091H131.2V65.4545H113.707V82.9091ZM54.6667 37.0909V52.3636H39.36V65.4545H54.6667V80.7273H67.7867V65.4545H83.0933V52.3636H67.7867V37.0909H54.6667ZM96.2133 54.5455H113.707V37.0909H96.2133V54.5455Z" fill="white"/>
    </svg>
{/snippet}

<button onclick={() => playerCount = 2}>s</button>

<div class="screen-wrapper">
    <section>
        <div>
            {@render playerCard(1)}
            <br>
            {#if playerCount > 1}
                <button disabled={ready} onclick={() => ready = true}>
                    {#if ready}
                        READY!
                    {:else}
                        NOT READY
                    {/if}
                </button>
            {/if}
        </div>
        <div>
            {#if playerCount <= 1}
                <LoadingIcon/>
            {:else}
                {@render playerCard(2)}
                <div class="status-text">
                    {#if otherReady}
                        READY!
                    {:else}
                        NOT READY
                    {/if}
                </div>
            {/if}
        </div>
    </section>
</div>



<style lang="scss">
    .screen-wrapper{
        container: lobby-wrapper / size;
        box-sizing: border-box;
        max-height: 100vh;
        overflow: hidden;
        max-width: 100vw;
        display: grid;
        height: 100%;
        width: 100%;
        
        & > section{
            display: flex;

            @container lobby-wrapper (aspect-ratio < 1/1) {
               flex-direction: column-reverse;
            }

            & > div{
                transition: background-color 400ms ease-in;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                display: flex;
                gap: 20px;
                
                flex-grow: 1;

                @container lobby-wrapper (aspect-ratio >= 1/1) {
                    width: 50%;
                }

                & > svg{
                    max-width: 100px;
                }

                & > .status-text, & > button{
                    font-weight: bold;
                    background: none;
                    font-size: 30px;
                    letter-spacing: 3px;
                    color: white;
                }

                & > button{
                    &:not(:disabled){
                        border: white 3px solid;
                        background: orange;
                        border-radius: 50px;
                        cursor: pointer;
                        padding: 20px;
                    }

                    &:disabled{
                        border: none;
                    }
                }

                &:first-child{
                    background-color: #3e83eb;
                }

                &:last-child{
                    &:has(:global(.loader)){ background-color: #3a79d9 !important; }

                    background-color: #fd1d6e;
                }
            }
        }
    }
</style>