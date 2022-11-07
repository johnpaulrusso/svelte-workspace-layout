<script lang="ts">
    import WorkspaceGrid from '$lib/WorkspaceGrid.svelte'
    import TestComponentA from '$lib/test/TestComponentA.svelte';
    import TestComponentB from '$lib/test/TestComponentB.svelte';
	import { WorkspaceLocation} from '$lib/models/WorkspaceComponentModel';
    import type { IWorkspaceComponentModel} from '$lib/models/WorkspaceComponentModel';
    import {onMount} from "svelte";

    const onClickB = (event: Event) =>
    {
        myComponents[1].properties.txt = "WORLD";
        myComponents = myComponents;
    }

    let myComponents: Array<IWorkspaceComponentModel> = [];

    let comp1: IWorkspaceComponentModel = {
        componentType: TestComponentA, 
        properties: {txt: "HELLO", num: 12}, 
        events: [],
        initialLocation: WorkspaceLocation.MAIN
    };
    
    let comp2: IWorkspaceComponentModel = {
        componentType: TestComponentB, 
        properties: {id: "b1", txt: "HELLO"}, 
        events: [{name: "click-b", callback: onClickB}], 
        initialLocation: WorkspaceLocation.BOTTOMBAR
    };

    let comp3: IWorkspaceComponentModel = {
        componentType: TestComponentA, 
        properties: {txt: "HELLO", num: 12}, 
        events: [], 
        initialLocation: WorkspaceLocation.LEFTBAR
    };

    myComponents = [...myComponents, comp1, comp2, comp3];

    onMount(() => {
        myComponents.forEach(c => {
            c.events.forEach(e => {
                document.addEventListener(e.name, e.callback);
            })
        })
    })
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