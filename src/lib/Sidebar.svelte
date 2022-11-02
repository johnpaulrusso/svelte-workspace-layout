<script lang="ts">
    import {onMount, createEventDispatcher} from "svelte";
    import {SidebarOrientation, MIN_SIDEBAR_SIZE_PX} from "./Sidebar";

    const dispatch = createEventDispatcher();

    export let id = "sidebar";
    export let height = "auto";
    export let width = "auto";
    export let gridarea = "";
    export let border = "";
    export let orientation: SidebarOrientation = SidebarOrientation.VERTICAL;
    export let isMinimized: boolean;

    let containerElement: HTMLElement | null;
    let controlButtonSymbolName = "expand_more";

    $: flexDirection = (orientation === SidebarOrientation.VERTICAL) ? "row-reverse" : "column";
    $: textWritingMode = (orientation === SidebarOrientation.VERTICAL) ? "vertical-rl" : "horizontal-tb";
    $: size = (orientation === SidebarOrientation.VERTICAL) ? "width: " + MIN_SIDEBAR_SIZE_PX + "px;" : "height: " + MIN_SIDEBAR_SIZE_PX + "px;"

    onMount(() => {
        containerElement = document.getElementById(id);
    });

    $: controlButtonSymbolName = isMinimized ? "expand_less" : "expand_more";

    function onClickOpenClose()
    {
        dispatch("open_close_event");
    }
    
</script>

<!-- Dependent on Google material symbols -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="container" id={id} style="height: {height}; width: {width}; grid-area: {gridarea}; display: flex; flex-direction: {flexDirection}; {border}">
    <div class="control-bar" style="writing-mode: {textWritingMode}; {size} flex-direction: row;">
        <div>CONTROL BAR</div>
        <button class="control-bar-open-close" on:click={onClickOpenClose}><span class="material-symbols-outlined control-button">{controlButtonSymbolName}</span></button>
    </div>
    <slot name="content"/>
</div>

<style>
    .container{
        grid-area: sidebar;
        overflow: hidden;
    }

    .control-bar{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .material-symbols-outlined {
      font-variation-settings:
      'FILL' 0,
      'wght' 200,
      'GRAD' 0,
      'opsz' 20;
      line-height: 2;
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