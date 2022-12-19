<script lang="ts">
	import { onMount, createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let name: string = "";
    export let parentId: string = "";
    export let materialSymbol: string = "";

    onMount(() => {
        let element = document.getElementById("tabbable-content-" + name);
        if(element)
        {
            element.addEventListener("opened", onOpened);
        }
    });

    function onOpened()
    {
        dispatch("opened");
    }

</script>

<div class="tabbable-content" id="tabbable-content-{name}" data-parentid={parentId} data-name={name} data-materialsymbol={materialSymbol} data-uid="-1">
    <slot name="content">Content Wrapper Missing Content!</slot>
</div>

<style>
.tabbable-content{
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
 }
</style>
