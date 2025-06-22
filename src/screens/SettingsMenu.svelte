<script lang="ts">
    import MenuLayout from "../components/MenuLayout.svelte";
    import { screen } from "../lib/state";
</script>

<MenuLayout title="Settings" onExit={() => screen.set("main")}>
    <div>Verison: {__APP_VERSION__}</div>
</MenuLayout>