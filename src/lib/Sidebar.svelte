<script lang="ts">
    import {onMount} from "svelte";

    export let id = "sidebar";
    export let height = "auto";
    export let width = "auto";
    export let gridarea = "";
    export let border = "";
    export let flexDirection = "column";

    let containerElement: HTMLElement | null;

    onMount(() => {
        containerElement = document.getElementById(id);
    });

</script>

<div class="container" id={id} style="height: {height}; width: {width}; grid-area: {gridarea}; display: flex; flex-direction: {flexDirection}; {border}">
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