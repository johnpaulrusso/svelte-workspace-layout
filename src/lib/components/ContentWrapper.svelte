<script lang="ts">
    export let name: string = "";
    export let parentId: string = "";
    export let materialSymbol: string = "";
</script>

<div class="tabbable-content" data-parentid={parentId} data-name={name} data-materialsymbol={materialSymbol} data-uid="-1">
    <slot name="content">Content Wrapper Missing Content!</slot>
</div>

<style>
.tabbable-content{
    flex-grow: 1;
 }
</style>
