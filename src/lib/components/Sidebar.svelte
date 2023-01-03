<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {MIN_SIDEBAR_HEIGHT_PX, MIN_SIDEBAR_WIDTH_PX} from "../controllers/SidebarController";
    import type {ISidebarModel} from "../models/SidebarModel"
    import {SidebarOrientation} from "../models/SidebarModel"
    import {CLASS_TAB_BUTTON_CONTAINER, CLASS_STAGED_TABS, CLASS_ACTIVE_TAB} from "../controllers/TabbedContentController"

    const dispatch = createEventDispatcher();

    const CONTROL_BAR_SIZE = "height: " + MIN_SIDEBAR_HEIGHT_PX + "px;";

    export let model: ISidebarModel;

    export let controlBar_backgroundColor: string = "";
    export let controlBarButton_color: string = "";

    $: display = model.isDisplayed ? "flex" : "none";
    $: vertical = (model.orientation === SidebarOrientation.VERTICAL) ? "vertical" : "";
    $: size = (model.orientation === SidebarOrientation.VERTICAL) ? "width: " + model.width : "height: " + model.height;
    $: controlButtonSymbolName = (model.orientation === SidebarOrientation.VERTICAL) ? 
        (model.isMinimized ? "chevron_right" : "chevron_left") :
        (model.isMinimized ? "expand_less" : "expand_more");

    function onClickOpenClose()
    {
        dispatch("open_close_event");
    }

</script>

<!-- Dependent on Google material symbols -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="container tabbable-content-container {vertical}" id={model.name} style="{size}; display: {display}; {model.border}">
    <!--If the layout is not minimized or horizontal, display the control bar.-->
    {#if model.orientation === SidebarOrientation.HORIZONTAL}
        <div class="control-bar" style="{CONTROL_BAR_SIZE} background-color: {controlBar_backgroundColor}">

            <!--Only horizontal layouts have the tab buttons in the control bar.-->
            <div class={CLASS_TAB_BUTTON_CONTAINER}></div>

            <!--All control bars need an open/close button. -->
            {#if !model.isMinimized}
            <span class="material-symbols-outlined control-button" style="color: {controlBarButton_color};" on:click={onClickOpenClose} on:keydown={()=>{}}>{controlButtonSymbolName}</span>
            {/if}
        </div>
        
        <!--CONTENT-->
        <div class={CLASS_ACTIVE_TAB}></div>

        <!--This element is never visible.-->
        <div class={CLASS_STAGED_TABS}></div>
    {:else}
        <div class="vertical-sub-container">
            <div class="control-bar" style="{CONTROL_BAR_SIZE} background-color: {controlBar_backgroundColor}">
                <div class="title" style="white-space: nowrap; overflow: hidden; padding-left: 3px; font-size: small; font-family: Tahoma; background-color: {controlBar_backgroundColor}; color: {controlBarButton_color}">{model.selectedTabName}</div>

                <!--All control bars need an open/close button. -->
                <span class="material-symbols-outlined control-button" style="color: {controlBarButton_color};" on:click={onClickOpenClose} on:keydown={()=>{}}>{controlButtonSymbolName}</span>
            </div>
            <!--CONTENT-->
            <div class="{CLASS_ACTIVE_TAB}" style="border-right: solid {controlBar_backgroundColor}"></div>

            <!--This element is never visible.-->
            <div class={CLASS_STAGED_TABS}></div>
        </div>
        <!--If the layout is vertical, display vertical tab button container. This is a wider container for icons buttons. -->
        <div class="vertical-button-wrapper" style="background-color: {controlBar_backgroundColor}; width: 58px; padding: 3px 2px 2px 2px;">
            <div class={CLASS_TAB_BUTTON_CONTAINER + " vertical"} style="background-color: {controlBar_backgroundColor}"></div>
        </div>
    {/if}

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

    .vertical-sub-container{
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .active-tab{
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .active-tab.vertical{
        border-right: solid red;
    }

    .material-symbols-outlined {
      font-variation-settings:
      'FILL' 0,
      'wght' 250,
      'GRAD' 0,
      'opsz' 20;
    }

    .tab-buttons.vertical{
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }



    .staged-tabs{
        display: none;
    }


</style>