<script lang="ts">
    import Button from "./Button.svelte";
    import LoadingIcon from "./LoadingIcon.svelte";

    let elm: HTMLDialogElement
    let request: Promise<string | null> | undefined

    export function create(ipAddress: string){
        elm.showModal()
        request = new Promise<string | null>((resolve) => {
            const protocol = (import.meta.env.PROD)? "https":"http"
            const req = fetch(`${protocol}://${ipAddress}/room/create`, {method: "POST"})

            setTimeout(async () => {
                const res = await req
                if(!res.ok || res.status != 200)
                    return resolve(null)
            
                resolve(await res.text())
            }, 600)
        })

        request.then(id => {
            if(id != null)
                elm.close()
        })

        return request
    }
</script>

<dialog bind:this={elm}>
    <div>
        {#await request}
            <h1>Creating room</h1>
            <LoadingIcon/>
        {:then result} 
            {#if result == null}
                <h1>Unable to create room</h1>
                <Button enabled={true} onclick={() => elm.close()}>Close</Button>
            {/if}
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