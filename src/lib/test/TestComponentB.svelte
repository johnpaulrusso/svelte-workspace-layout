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

<div class="container" id={id}>
    {txt}
    <button on:click={onClick}>Do Stuff!</button>
</div>


<style>
.container{
    background-color:aquamarine;
    flex-grow: 1;
    z-index: 1;

    display: flex;
    flex-direction: column;
}
</style>