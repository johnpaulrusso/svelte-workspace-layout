<script lang="ts">
    import WorkspaceGrid from '$lib/WorkspaceGrid.svelte'
</script>

<div class="container">
<WorkspaceGrid>
    <div slot="main-content">MAIN CONTENT</div>
</WorkspaceGrid>
</div>

<style>
    .container{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
    }
</style>