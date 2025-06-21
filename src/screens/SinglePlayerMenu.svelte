<script>
    import MenuLayout from "../components/MenuLayout.svelte";
    import { screen } from "../lib/state";

</script>
<MenuLayout title="Singleplayer" onExit={() => screen.set("main")}>
    hi
</MenuLayout>