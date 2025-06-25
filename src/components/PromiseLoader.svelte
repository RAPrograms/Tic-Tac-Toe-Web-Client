<script lang="ts">
    import Button from "./Button.svelte";
    import LoadingIcon from "./LoadingIcon.svelte";

    const { message } : { message: string } = $props()

    let elm: HTMLDialogElement
    let request: Promise<string | null> | undefined = $state(undefined)

    export function show(promise: Promise<any>){
        request = promise

        elm.showModal()

        request.then(() => {
            elm.close()
        })
    }
</script>

<dialog bind:this={elm}>
    <div>
        {#await request}
            <h1>{message}</h1>
            <LoadingIcon/>
        {:catch error}
            <h1>{error}</h1>
            <Button enabled={true} onclick={() => elm.close()}>Close</Button>
        {/await}
    </div>
</dialog>


<style lang="scss">
    dialog{
        background: none;
        border: none;
        display: grid;
        place-items: center;

        &:not(:open){
            visibility: hidden;
            display: none;
        }

        &::backdrop{
            background: rgba(0, 0, 0, 0.643);
        }

        & > div{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;

            & > :global(.loader){
                margin-top: 30px;
            }
        }
    }
</style>