<script lang="ts">
	import BottomBar from "./BottomBar.svelte";
    import Sidebar from "./Sidebar.svelte";
</script>

<div class="container">
    <div class="content">
        <slot name="main-content"/>
    </div>
    <Sidebar>
        <div slot="content">SIDEBAR</div>
    </Sidebar>
    <BottomBar>
        <div slot="content">BOTTOMBAR</div>
    </BottomBar>
</div>

<style>
    .container{
        width: 100%;
        height: 100%;

        /** Grid Setup */
        display: grid;
        grid-template-columns: min-content minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr) min-content;
        grid-template-areas: 
            "sidebar content"
            "sidebar bottombar";
    }
    .content{
        grid-area: content;

        border: solid 5px green;
    }
</style>