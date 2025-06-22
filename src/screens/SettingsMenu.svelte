<script lang="ts">
    import Button from "../components/Button.svelte";
    import MenuLayout from "../components/MenuLayout.svelte";
    import { database, screen } from "../lib/state";

    async function purgeGames(){
        if(!confirm("Do you want to permently delete all games?"))
            return

        const storesInstance = await database.openDataStores('active', "readwrite")
        if(storesInstance == undefined){
            alert("Unable to open database")
            return
        }

        if(storesInstance[0]["active"].clear() != undefined)
            alert("Unable to delete games")
    }
</script>

<MenuLayout title="Settings" onExit={() => screen.set("main")}>
    <div>Verison: {__APP_VERSION__}</div>

    <div class="pruge-games-bnt">
        <Button enabled={true} onclick={() => {purgeGames()}}>Clear saved games</Button>
    </div>
</MenuLayout>

<style lang="scss">
    .pruge-games-bnt{
        //--colour: red;
    }
</style>