<script lang="ts"> 

export let borderWidth = 1;

</script>

<div class="container" id="bottombar" style="border-width: {borderWidth}px">
    <slot name="content"/>
</div>

<style>
    .container{
        height: 200px;

        grid-area: bottombar;

        border: solid;
        border-color: red;
    }
</style>