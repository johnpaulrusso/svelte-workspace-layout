<script lang="ts"> 

const BORDER_WIDTH_PX: number = 5; 

</script>

<div class="container" id="sidebar" style="border-width: {BORDER_WIDTH_PX}px">
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