<script lang="ts">
    import PromiseLoader from "../../components/PromiseLoader.svelte";
    import LoadingIcon from "../../components/LoadingIcon.svelte";
    import MenuLayout from "../../components/MenuLayout.svelte";
    import MultiplayerRooms from "./MultiplayerRooms.svelte";
    import MultiplayerGame from "./MultiplayerGame.svelte";
    import Button from "../../components/Button.svelte";

    import { screen } from "../../lib/state";
    import ServerConnection from "../../lib/Connection";

    let wsConnectionScreen: PromiseLoader

    let ip: string | undefined = $state()
    let serverConfig: Promise<ServerConfig | null> | undefined = $state(undefined)
    let roomConnection: Promise<ServerConnection | undefined> | undefined | ServerConnection = $state(undefined)

    function connectToServer(e: SubmitEvent){
        e.preventDefault()

        const form: HTMLFormElement = e.target as HTMLFormElement
        const input = form.querySelector("input")
        ip = input?.value
        if(ip == undefined || ip == "")
            return


        serverConfig = new Promise<ServerConfig | null>(async (resolve) => {
            try {
                const protocol = (import.meta.env.PROD)? "https":"http"
                const res = await fetch(`${protocol}://${ip}/config`)

                setTimeout(async () => {
                    if(!res.ok)
                        return resolve(null)

                    
                    resolve(await res.json())
                }, 600)
            } catch (error) {
                return resolve(null)
            }
        })
    }
    
    function confirmChoise(message: string, callback: () => void){
        if(confirm(message))
            callback()
    }
</script>

<PromiseLoader bind:this={wsConnectionScreen} message="Connecting to room"/>

{#snippet connectionForm()}
	<form onsubmit={connectToServer}>
        <h1>Server IP</h1>
        <input type="text" placeholder="192.168.1.1" required
        
        
            value="localhost:8000"
        >
        <Button enabled={true} onclick={() => {}}>Connect</Button>
    </form>
{/snippet}

{#if serverConfig == undefined}
    <MenuLayout title="Connect to Server" onExit={() => screen.set("main")}>
        <section class="connection-form">
            {@render connectionForm()}
        </section>
    </MenuLayout>
{:else}
    {#await serverConfig}
        <MenuLayout title="Connect to Server" onExit={() => confirmChoise("Are you sure you want to cancel?", () => screen.set("main"))}>
            <LoadingIcon/>
        </MenuLayout>
    {:then config} 
        {#if config == undefined}
            <MenuLayout title="Connect to Server" onExit={() => screen.set("main")}>
                <section class="connection-form">
                    {@render connectionForm()}
                    <b style="text-align: center">Unable to connect to server</b>
                </section>
            </MenuLayout>
        {:else}
            {#if roomConnection == undefined || roomConnection instanceof Promise}
                <MultiplayerRooms ipAddress={ip!} serverConfig={config} onSelection={(id: string) => {
                    const protocol = (import.meta.env.PROD)? "https":"http"
                    roomConnection = ServerConnection.open(`${protocol}://${ip}/room/${id}`)
                    wsConnectionScreen.show(roomConnection)

                    roomConnection.then(connection => roomConnection = connection)
                }}/>   
            {:else}
                <MultiplayerGame connection={roomConnection}/>
            {/if}
        {/if}
    {/await}
{/if}


<style lang="scss">
    :global(.layout[data-menu="connect-to-server"]) > :global(section){
        justify-content: center;
    }
    
    section.connection-form{
        box-shadow: 0 10px 5px -7px rgba(0, 0, 0, 0.3);
        background: rgba(255, 255, 255, 0.289);
        min-width: min(100vw, 300px);
        backdrop-filter: blur(10px);
        box-sizing: border-box;
        border-radius: 20px;
        max-width: 100vw;
        padding: 20px;
    }

    section.connection-form, section.connection-form > form{
        flex-direction: column;
        justify-content: end;
        display: flex;
        gap: 20px;

        &:has(:invalid) > :global(button){
            cursor: not-allowed;
            opacity: .5;
        }
    }
    
    
    :global(.layout[data-menu="connect-to-server"]) {section.connection-form{
        & h1{
            text-align: center;
        }

        & input{
            border-radius: 10px;
            text-align: center;
            padding: 10px 5px;
        }


        & :global(button){
            --colour: green;

            justify-self: flex-end;
            display: block;
        }
    }}
</style>