<script lang="ts">
    import MenuLayout from "../../components/MenuLayout.svelte";
    import type ServerConnection from "../../lib/Connection";
    import ReadyScreen from "./MultiplayerLobby.svelte";
    
    import { screen } from "../../lib/state";
    import { onMount } from "svelte";

    const { connection } : { connection: ServerConnection } = $props()

    onMount(() => {
        console.log(connection.request("readyState", true))
    })
</script>

<MenuLayout title="Multiplayer Game" onExit={() => screen.set("main")}>

    <ReadyScreen/>
    <!--<h1>Press the button below when you are ready to start</h1>
    <Button enabled={true} onclick={() => {}}>Ready</Button>-->
</MenuLayout>