<script lang="ts">
    export let txt: string = "";
    export let num: number = 0;
</script>

<div class="container">{txt}, {num}</div>

<style>
.container{
    background-color:lavender;
    flex-grow: 1;
    z-index: 1;
}
</style>