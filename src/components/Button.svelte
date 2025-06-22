<script lang="ts">
    import { onMount, type Snippet } from "svelte";

    const { children, onclick = () => {}, enabled = true } : { children: Snippet, onclick: () => void | undefined, enabled: Promise<boolean> | boolean | undefined } = $props()

    function handleClick(e: Event){
        const target: HTMLElement = e.target as HTMLElement

        target.classList.add("clicked")
        setTimeout(() => { target.classList.remove("clicked") }, 440)

        onclick()
    }

    let disabled = $state(true)

    onMount(async () => {
        if(!(enabled instanceof Promise)){
            disabled = !enabled
            return
        }
        
        disabled = !(await enabled)
    })

</script>

<button {disabled} onclick={handleClick}>{@render children()}</button>

<style lang="scss">
    @import "../variables.scss";

    button{
        box-shadow: 0 10px 5px -7px rgba(0, 0, 0, 0.3);
        font-size: min(1rem, 20px);
        background-color: var(--colour, $primary);
        border-radius: 10px;
        padding: 20px 30px;
        position: relative;
        font-weight: bold;
        overflow: hidden;
        border: none;
        width: 100%;

        &:disabled{opacity: .7; }
        &:not(:disabled){
            transition: 300ms opacity ease-out;
            cursor: pointer;
        }

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