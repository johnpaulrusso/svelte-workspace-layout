<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {MIN_SIDEBAR_SIZE_PX} from "../controllers/SidebarController";
    import type {ISidebarModel} from "../models/SidebarModel"
    import {SidebarOrientation} from "../models/SidebarModel"
    import {CLASS_TAB_BUTTON_CONTAINER, CLASS_STAGED_TABS, CLASS_ACTIVE_TAB} from "../controllers/TabbedContentController"

    const dispatch = createEventDispatcher();

    export let model: ISidebarModel;

    export let controlBar_backgroundColor: string = "";
    export let controlBarButton_color: string = "";

    $: display = model.isDisplayed ? "flex" : "none";
    $: vertical = (model.orientation === SidebarOrientation.VERTICAL) ? "vertical" : "";
    $: sizeControlbar = (model.orientation === SidebarOrientation.VERTICAL) ? "width: " + MIN_SIDEBAR_SIZE_PX + "px;" : "height: " + MIN_SIDEBAR_SIZE_PX + "px;";
    $: size = (model.orientation === SidebarOrientation.VERTICAL) ? "width: " + model.width : "height: " + model.height;
    $: controlButtonSymbolName = (model.orientation === SidebarOrientation.VERTICAL) ? 
        (model.isMinimized ? "expand_more" : "expand_less") :
        (model.isMinimized ? "expand_less" : "expand_more");

    function onClickOpenClose()
    {
        dispatch("open_close_event");
    }

</script>

<!-- Dependent on Google material symbols -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="container tabbable-content-container {vertical}" id={model.name} style="{size}; display: {display}; {model.border}">
    <div class="control-bar {vertical}" style="{sizeControlbar} background-color: {controlBar_backgroundColor}">
        <div class={CLASS_TAB_BUTTON_CONTAINER}></div>
        <span class="material-symbols-outlined control-button" style="color: {controlBarButton_color};" on:click={onClickOpenClose} on:keydown={()=>{}}>{controlButtonSymbolName}</span>
    </div>
    <div class={CLASS_ACTIVE_TAB}></div>
    <div class={CLASS_STAGED_TABS}></div>
</div>
<style>
    .container{
        /*LEFT*/

        /*BOTTOM */

        flex-direction: column;
        overflow: hidden;
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
    }
    .control-bar.vertical{
        writing-mode: sideways-lr;
        justify-content:flex-end;
    }

    .active-tab{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .material-symbols-outlined {
      font-variation-settings:
      'FILL' 0,
      'wght' 250,
      'GRAD' 0,
      'opsz' 20;
    }
/*
    .material-symbols-outlined.control-button:hover{
        background-color:rgb(240, 240, 240);
    }*/

    .staged-tabs{
        display: none;
    }
</style>