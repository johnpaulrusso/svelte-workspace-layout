<script lang="ts">
	import type { IWorkspaceComponentModel } from "$lib/models/WorkspaceComponentModel";
    import {createEventDispatcher} from "svelte";
    import {MIN_SIDEBAR_SIZE_PX} from "../controllers/SidebarController";
    import type {ISidebarModel} from "../models/SidebarModel"
    import {SidebarOrientation} from "../models/SidebarModel"

    const dispatch = createEventDispatcher();

    export let model: ISidebarModel;
    export let components: Array<IWorkspaceComponentModel>;

    $: vertical = (model.orientation === SidebarOrientation.VERTICAL) ? "vertical" : "";
    $: size = (model.orientation === SidebarOrientation.VERTICAL) ? "width: " + MIN_SIDEBAR_SIZE_PX + "px;" : "height: " + MIN_SIDEBAR_SIZE_PX + "px;";
    $: controlButtonSymbolName = model.isMinimized ? "expand_less" : "expand_more";

    //selectedComponentIndex must be > 0.
    $: selectedComponentIndex = components.findIndex(c => c.name == model.selectedTabName);
    $: if(selectedComponentIndex < 0) {selectedComponentIndex = 0}

    function onClickOpenClose()
    {
        dispatch("open_close_event");
    }

    function onClickTab(event: MouseEvent)
    {
        let element = event.target as HTMLElement
        if(element)
        {
            dispatch("tab_change_event", element.getAttribute("name"));
        }
    }
    
</script>

<!-- Dependent on Google material symbols -->
{#if components.length > 0}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="container {vertical}" id={model.name} style="height: {model.height}; width: {model.width}; grid-area: {model.gridarea}; {model.border}">
    <div class="control-bar {vertical}" style="{size} ">
        <div class="tabs">
        {#each components as c}
            <button class="tab {vertical}" name="{c.name}" on:click={onClickTab}>{c.name}</button>
        {/each}
        </div>
        <span class="material-symbols-outlined control-button" on:click={onClickOpenClose} on:keydown={()=>{}}>{controlButtonSymbolName}</span>
    </div>
    <svelte:component this={components[selectedComponentIndex].componentType} {...components[selectedComponentIndex].properties}/>

</div>
{/if}
<style>
    .container{
        grid-area: sidebar;
        overflow: none;

        display: flex; 
        flex-direction: column;
    }
    .container.vertical{
        flex-direction: row-reverse;
    }

    .control-bar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .control-bar.vertical{
        writing-mode: sideways-lr;
        justify-content:flex-end;
    }

    .tabs{
        display: flex;
    }
    .tab{
        display: inline-block;
        border: solid black 1px;
        min-width: 60px;
    }
    .tab.vertical{
        min-width: 20px;
        min-height: 60px;
    }
    .tab:hover{
        background-color:rgb(240, 240, 240);
    }

    .material-symbols-outlined {
      font-variation-settings:
      'FILL' 0,
      'wght' 200,
      'GRAD' 0,
      'opsz' 20;
    }

    .material-symbols-outlined.control-button:hover{
        background-color:rgb(240, 240, 240);
    }

    button{
        background: none;
        border: none;
        margin: 0;
        padding: 0;
    }

</style>