<script lang="ts">
    import { onMount } from "svelte";
    import type ServerConnection from "../../lib/Connection";
    import MenuLayout from "../../components/MenuLayout.svelte";
    import { screen } from "../../lib/state";
    import Button from "../../components/Button.svelte";

    const { connection } : { connection: ServerConnection } = $props()

    onMount(() => {
        console.log(connection)
    })
</script>

<MenuLayout title="Multiplayer Game" onExit={() => screen.set("main")}>
    <h1>Press the button below when you are ready to start</h1>
    <Button enabled={true} onclick={() => {}}>Ready</Button>
</MenuLayout>