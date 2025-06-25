<script>
    import MenuLayout from "../../components/MenuLayout.svelte";

    import { screen } from "../../lib/state";
</script>

<MenuLayout title="Rooms" onExit={() => screen.set("main")}>
    Rooms
</MenuLayout>