<script>
    import Button from "../components/Button.svelte";
    import MenuLayout from "../components/MenuLayout.svelte";
    import { screen } from "../lib/state";

</script>

<MenuLayout title="Singleplayer" onExit={() => screen.set("main")}>
    <div class="new-game-bnt">
        <Button onclick={() => console.log("TODO: New game dialog")}>New Game</Button>
    </div>


</MenuLayout>

<style lang="scss">
    div.new-game-bnt{
        margin: 10px auto;
        max-width: 300px;
    }
</style>