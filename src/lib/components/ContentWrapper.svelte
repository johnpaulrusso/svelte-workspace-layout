<script lang="ts">
    export let name: string = "";
    export let parentId: string = "";
</script>

<div class="tabbable-content" data-parentid={parentId} data-name={name}>
    <slot name="content">Content Wrapper Missing Content!</slot>
</div>

<style>
.tabbable-content{
    flex-grow: 1;
 }
</style>
