<script lang="ts">
    import {onMount} from "svelte";
    import {SidebarOrientation, MIN_SIDEBAR_SIZE_PX} from "./Sidebar";

    export let id = "sidebar";
    export let height = "auto";
    export let width = "auto";
    export let gridarea = "";
    export let border = "";
    export let orientation: SidebarOrientation = SidebarOrientation.VERTICAL;

    let containerElement: HTMLElement | null;

    $: flexDirection = (orientation === SidebarOrientation.VERTICAL) ? "row-reverse" : "column";
    $: textWritingMode = (orientation === SidebarOrientation.VERTICAL) ? "vertical-rl" : "horizontal-tb";
    $: minSize = (orientation === SidebarOrientation.VERTICAL) ? "min-width: " + MIN_SIDEBAR_SIZE_PX + "px;" : "min-height: " + MIN_SIDEBAR_SIZE_PX + "px;"

    onMount(() => {
        containerElement = document.getElementById(id);
    });

</script>

<div class="container" id={id} style="height: {height}; width: {width}; grid-area: {gridarea}; display: flex; flex-direction: {flexDirection}; {border}">
    <div class="control-bar" style="writing-mode: {textWritingMode}; {minSize}">CONTROL BAR</div>
    <slot name="content"/>
</div>

<style>
    .container{
        grid-area: sidebar;

        display: flex;
        flex-direction: column;
        justify-content: stretch;

        overflow: hidden;
    }


</style>