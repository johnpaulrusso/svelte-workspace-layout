<script lang="ts">
	import type { IWorkspaceComponentModel } from "$lib/models/WorkspaceComponentModel";
    import {createEventDispatcher} from "svelte";
    import {MIN_SIDEBAR_SIZE_PX} from "../controllers/SidebarController";
    import type {ISidebarModel} from "../models/SidebarModel"
    import {SidebarOrientation} from "../models/SidebarModel"
    import {CLASS_TAB_BUTTON_CONTAINER, CLASS_STAGED_TABS, CLASS_ACTIVE_TAB} from "../TabbedContentManager"

    const dispatch = createEventDispatcher();

    export let model: ISidebarModel;

    $: vertical = (model.orientation === SidebarOrientation.VERTICAL) ? "vertical" : "";
    $: size = (model.orientation === SidebarOrientation.VERTICAL) ? "width: " + MIN_SIDEBAR_SIZE_PX + "px;" : "height: " + MIN_SIDEBAR_SIZE_PX + "px;";
    $: controlButtonSymbolName = model.isMinimized ? "expand_less" : "expand_more";

    //selectedComponentIndex must be > 0.

    function onClickOpenClose()
    {
        dispatch("open_close_event");
    }

    /*
    function onClickTab(event: MouseEvent)
    {
        let element = event.target as HTMLElement
        if(element)
        {
            dispatch("tab_change_event", element.getAttribute("name"));
        }
    }*/
    
</script>

<!-- Dependent on Google material symbols -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="container tabbable-content-container {vertical}" id={model.name} style="height: {model.height}; width: {model.width}; grid-area: {model.gridarea}; {model.border}">
    <div class="control-bar {vertical}" style="{size}">
        <div class={CLASS_TAB_BUTTON_CONTAINER}></div>
        <span class="material-symbols-outlined control-button" on:click={onClickOpenClose} on:keydown={()=>{}}>{controlButtonSymbolName}</span>
    </div>
    <div class={CLASS_ACTIVE_TAB}></div>
    <div class={CLASS_STAGED_TABS}></div>
</div>
<style>
    .container{
        grid-area: sidebar;
        overflow: hidden;

        display: flex; 
        flex-direction: column;

        border: solid 1px; 
    }
    .container.vertical{
        flex-direction: row-reverse;
    }

    .content-staging-area{
        display: none;
    }

    .control-bar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: solid 1px red;
    }
    .control-bar.vertical{
        writing-mode: sideways-lr;
        justify-content:flex-end;
    }

    .active-tab{
        width: 100%;
        height: 100%;
        border: solid 1px green;
        display: flex;
        flex-direction: column;
        overflow: hidden;
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

    .staged-tabs{
        display: none;
    }
</style>