<script lang="ts">
    import type { Snippet } from "svelte";

    const { children, onclick = () => {} } : { children: Snippet, onclick: () => void | undefined } = $props()

    function handleClick(e: Event){
        const target: HTMLElement = e.target as HTMLElement

        target.classList.add("clicked")
        setTimeout(() => { target.classList.remove("clicked") }, 440)

        onclick()
    }
</script>

<button onclick={handleClick}>{@render children()}</button>

<style lang="scss">
    @import "../variables.scss";

    button{
        box-shadow: 0 10px 5px -7px rgba(0, 0, 0, 0.3);
        font-size: min(1rem, 20px);
        background-color: $primary;
        border-radius: 10px;
        padding: 20px 30px;
        position: relative;
        font-weight: bold;
        overflow: hidden;
        cursor: pointer;
        border: none;
        width: 100%;

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
            animation: circularPulse .44s linear;
        }
    }
    

    @keyframes circularPulse {
        0% {width: 0%; opacity: 1;}
        60% {width: 110%; opacity: 1;}
        100% {width: 110%; opacity: 0;}
    }
</style>