<script lang="ts">
    export let txt: string = "";
</script>

<div class="container">{txt}</div>

<style>
.container{
    background-color: lightcyan;
    flex-grow: 1;
    z-index: 1;
}
</style>