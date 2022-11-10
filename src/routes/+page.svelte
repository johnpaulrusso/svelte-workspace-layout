<script lang="ts">
    import WorkspaceGrid from '$lib/WorkspaceGrid.svelte'
	import ContentWrapper from '$lib/components/ContentWrapper.svelte';

</script>

<div class="container">
    <!--
<ContentWrapper parentId="main-content-container" name="Content 1">
    <div class="test c1" slot="content">CONTENT 1</div>
</ContentWrapper>-->

<ContentWrapper parentId="leftsidebar" name="Content 2">
    <div class="test c2" slot="content">CONTENT 2</div>
</ContentWrapper>
<ContentWrapper parentId="leftsidebar" name="Content 3">
    <div class="test c3" slot="content">CONTENT 3</div>
</ContentWrapper>
<ContentWrapper parentId="bottomsidebar" name="Content 4">
    <div class="test c4" slot="content">CONTENT 4</div>
</ContentWrapper>
<ContentWrapper parentId="bottomsidebar" name="Content 5">
    <div class="test c5" slot="content">CONTENT 5</div>
</ContentWrapper>

<!--TODO: provide workspace grid info on styling!-->
<!--TAB BUTTON STYLES-->
<!--BORDER STYLES-->
<!--FONTS-->
<!--COLORS-->
<WorkspaceGrid>
    <div class="test c1" slot="main-content">CONTENT 1</div>
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

    .test{
        width: 100%;
        height: 100%;
    }
    .c1{
        background-color:aquamarine;
    }
    .c2{
        background-color: lavender;
    }
    .c3{
        background-color: lightcyan;
    }
    .c4{
        background-color: lightgoldenrodyellow;
    }
    .c5{
        background-color:lightpink;
    }
</style>