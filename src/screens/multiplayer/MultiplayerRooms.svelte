<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../../components/Button.svelte";
    import MenuLayout from "../../components/MenuLayout.svelte";

    import { screen } from "../../lib/state";
    import LoadingIcon from "../../components/LoadingIcon.svelte";

    interface roomsResponce{total: number, instances: Record<string, number>}

    const { serverConfig, ipAddress } : { serverConfig: ServerConfig, ipAddress: string } = $props()

    function getRooms(): Promise<roomsResponce>{
        return new Promise<roomsResponce>(async(resolve) => {
            const protocol = (import.meta.env.PROD)? "https":"http"
            const res = await fetch(`${protocol}://${ipAddress}/rooms`)
            if(!res.ok)
                return resolve({total: 0, instances: {}})

            resolve(await res.json())
        })
    }

    let roomData: Promise<roomsResponce> = $state(getRooms())
    let allowRoomCreation = $derived(new Promise<boolean>(async(resolve) => {
        if(!serverConfig.AllowUserCreateRooms)
            return resolve(false)
           
        const data = await roomData
        resolve(data.total < serverConfig.MaxRoomInstances)
    }))

    onMount(() => {
        setInterval(() => {
            getRooms().then(data => roomData = Promise.resolve(data))
            console.log("reloaded")
        }, 180000)
    })
</script>

<MenuLayout title="Rooms" onExit={() => screen.set("main")}>
    <Button enabled={allowRoomCreation} onclick={() => {}}>Open Room</Button>
    <br>
    {#await roomData}
        <LoadingIcon/>
    {:then data}
        {@const instances = Object.entries(data.instances)}
        {#if instances.length <= 0}
            <div>No open games found</div>
        {:else}
            {#each Object.entries(data.instances) as [id, playerCount]}
                <button>
                    <div>{id}</div>
                    <div>{playerCount}</div>
                </button>
            {/each}
        {/if}
    {/await}
</MenuLayout>

<style lang="scss">
    :global(.layout[data-menu="rooms"]) > :global(section){
        padding: 30px 10px !important;

        & > :global(*) {
            max-width: 500px;
        }

        & > :global(.loader){
            margin-top: 20px;
        }
    }



    button{
        box-shadow: 0 10px 5px -7px rgba(0, 0, 0, 0.3);
        background: rgba(255, 255, 255, 0.289);
        min-width: min(100vw, 300px);
        backdrop-filter: blur(10px);
        box-sizing: border-box;
        border-radius: 20px;
        cursor: pointer;
        padding: 20px;
        display: flex;
        width: 100%;
        gap: 10px;

        & > :first-child{
            flex-grow: 1;
            text-align: left;
        }
    }
</style>