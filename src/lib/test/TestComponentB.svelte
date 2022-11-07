<script lang="ts">

    export let id: string = "";
    export let txt: string = "";

    function onClick(){
        let event = new CustomEvent('click-b', {bubbles: true, detail: {}})
        let element = document.getElementById(id);
        if(element)
        {
            element.dispatchEvent(event);
        }
    }
</script>

<div class="container" id={id}>{txt}</div>
<button on:click={onClick}>Do Stuff!</button>

<style>
.container{
    background-color:aquamarine;
    flex-grow: 1;
    z-index: 1;
}
</style>