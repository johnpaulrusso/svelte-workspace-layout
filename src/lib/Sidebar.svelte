<script lang="ts">
    import {onMount} from "svelte";

    export let id = "sidebar";
    export let height = "";
    export let width = "";
    export let gridarea = "";
    export let border = "";

    let containerElement: HTMLElement | null;

    onMount(() => {
        containerElement = document.getElementById(id);
    });

</script>

<div class="container" id={id} style="height: {height}; width: {width}; grid-area: {gridarea}; border: {border}">
    <slot name="content"/>
</div>

<style>
    .container{
        width: 200px;

        grid-area: sidebar;

        border: solid 5px blue;
    }
</style>