<script lang="ts">
    import { fade } from "svelte/transition";
    import { screen } from "../lib/state";

    function animateButtonClick(e: Event){
        const target: HTMLElement = e.target
        if(target.tagName != "BUTTON")
            return

        target.classList.add("clicked")
        setTimeout(() => { target.classList.remove("clicked") }, 440)
    }
</script>

<div class="screen" transition:fade>
    <header>
        <span>Welcome To</span>
        <h1>TIC TAC TOE</h1>
    </header>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <main onclick={animateButtonClick}>
        <button onclick={() => {screen.set("singleplayer-menu")}}>Singleplayer</button>
        <button>Multiplayer</button>
        <br>
        <button>Replayer</button>
        <button>Settings</button>
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
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 300px;

        & > button{
            background-color: $primary;
            border: none;
            box-shadow: 0 10px 5px -7px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            font-weight: bold;
            font-size: min(1rem, 20px);
            padding: 20px 30px;
            width: 100%;
            border-radius: 10px;

            position: relative;
            overflow: hidden;

            &::after{
                background-color: rgba(0, 0, 0, 0.267);
                translate: -50% -50%;
                border-radius: 100%;
                position: absolute;
                aspect-ratio: 1/1;
                content: "";
                left: 50%;
                top: 50%;
            }

            &:global(.clicked::after){
                animation: example .44s linear;
            }
        }
    }

    @keyframes example {
        0% {width: 0%; opacity: 1;}
        60% {width: 100%; opacity: 1;}
        100% {width: 100%; opacity: 0;}
    }
</style>

