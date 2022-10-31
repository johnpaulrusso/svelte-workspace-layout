<div class="container">
    <slot name="content"/>
</div>

<style>
    .container{
        width: 200px;

        grid-area: sidebar;

        border: solid 5px blue;
    }
</style>