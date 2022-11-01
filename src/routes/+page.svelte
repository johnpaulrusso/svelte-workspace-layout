<script lang="ts">
    import WorkspaceGrid from '$lib/WorkspaceGrid.svelte'
</script>

<div class="container">
<WorkspaceGrid>
    <div slot="main-content" class="my-main-content">
        CONTENT
    </div>
    <div slot="leftbar" class="my-leftbar" >LEFTBAR</div>
    <div slot="bottombar" class="my-bottombar" >BOTTOMBAR</div>
</WorkspaceGrid>
</div>

<style>
    .container{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .my-main-content{
        text-align: center;
        background-color: lightgoldenrodyellow;

        /**Flex grow must be set if you want the content to fill up empty space.*/
        flex-grow: 1;
    }

    .my-leftbar{
        text-align: center;
        background-color:lavender;

        /**Flex grow must be set if you want the content to fill up sidebar space.*/
        flex-grow: 1;
    }
    .my-bottombar{
        text-align: center;
        background-color:lightcyan;

        /**Flex grow must be set if you want the content to fill up sidebar space.*/
        flex-grow: 1;
    }


</style>