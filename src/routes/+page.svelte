<script lang="ts">
    import WorkspaceGrid from '$lib/WorkspaceGrid.svelte'
    import TestComponent from '$lib/test/TestComponent.svelte';
	import { WorkspaceLocation} from '$lib/models/WorkspaceComponentModel';
    import type { IWorkspaceComponentModel} from '$lib/models/WorkspaceComponentModel';

    let myComponents: Array<IWorkspaceComponentModel> = [
        {componentType: TestComponent, properties: {txt: "MAIN CONTENT"}, initialLocation: WorkspaceLocation.MAIN},
        {componentType: TestComponent, properties: {txt: "LEFTBAR"}, initialLocation: WorkspaceLocation.LEFTBAR},
        {componentType: TestComponent, properties: {txt: "BOTTOMBAR"}, initialLocation: WorkspaceLocation.BOTTOMBAR},
    ];
</script>

<div class="container">
<WorkspaceGrid components={myComponents}>
    <div slot="main-content" class="my-main-content">
        CONTENT
    </div>
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

    .my-main-content{
        text-align: center;
        background-color: lightgoldenrodyellow;

        /**Flex grow must be set if you want the content to fill up empty space.*/
        flex-grow: 1;
    }

</style>