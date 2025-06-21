<script lang="ts">
    import type { Snippet } from "svelte";
    import { fade } from "svelte/transition";

    const { onExit = () => {}, title, children } : { title: string, onExit: () => void, children: Snippet } = $props()
</script>

<div class="layout screen" transition:fade>
    <header>
        <button aria-label="Exit" onclick={onExit}>
            <svg viewBox="0 0 30 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="7.00071" height="36.957" rx="3.50036" transform="matrix(-0.682493 0.730892 -0.682493 -0.730892 30.001 49.104)"/>
                <rect width="7.00071" height="36.957" rx="3.50036" transform="matrix(-0.682493 -0.730892 0.682493 -0.730892 4.77832 32.1284)"/>
            </svg>
        </button>
        <h1>{title}</h1>
    </header>
    <section>
        {@render children()}
    </section>
</div>

<style lang="scss">
    @import "../variables.scss";

    div.layout{
        & > header{
            $height: 50px;

            box-shadow: 0 10px 5px -9px rgba(0, 0, 0, 0.3);
            background-color: $header;
            box-sizing: border-box;
            padding-right: $height;
            display: flex;
            height: 50px;


            & > button{
                transition: opacity 400ms ease-out;
                box-sizing: border-box;
                background: none;
                cursor: pointer;
                width: $height;
                border: none;
                padding: 5px;

                &:hover{
                    transition: opacity 200ms ease-in;
                    opacity: .7;
                }

                & > svg{
                    aspect-ratio: 6/11;
                    display: block;
                    fill: white;
                    height: 100%;
                    margin: auto;
                }
            }

            & > h1{
                text-align: center;
                flex-grow: 1;
            }
        }

        & > section{
            box-sizing: border-box;
            padding: 10px;
        }
    }
</style>