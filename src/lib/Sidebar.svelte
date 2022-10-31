<div class="container" id="sidebar">
    <slot name="content"/>
</div>

<style>
    .container{
        width: 200px;

        grid-area: sidebar;

        border: solid 5px blue;
    }
</style>