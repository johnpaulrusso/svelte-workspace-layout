<script lang="ts">
    import WorkspaceLayout from '$lib/components/WorkspaceLayout.svelte'
	import ContentWrapper from '$lib/components/ContentWrapper.svelte';
    import type {WorkspaceLayoutConfiguration} from "$lib/models/WorkspaceLayoutConfiguration"
    const tabButtonStyle = "border: solid transparent 3px; border-radius: 5px;background-color: transparent; color: lightgray; box-shadow: 0px 0px 1px 1px transparent, 0px 0px 1px 1px transparent inset;";
    const tabButtonStyleHover = "border: solid transparent 3px; border-radius: 5px; background-color: transparent; color: white;";
    const tabButtonStyleActive = "border: solid transparent 3px; border-radius: 5px; background-color: white; color: darkslategray;";
    const tabButtonGlow = "border: solid white 3px; border-radius: 5px; background-color: transparent; color: white; box-shadow: 0px 0px 1px 1px white, 0px 0px 1px 1px white inset;";

    const config: WorkspaceLayoutConfiguration = {
        borderWidth_px: 1,
        controlBar_backgroundColor: "darkslategray",
        controlBarButton_color: "ghostwhite",
        tabButtonStyle: tabButtonStyle,
        tabButtonStyleHover: tabButtonStyleHover,
        tabButtonStyleActive: tabButtonStyleActive,
        tabButtonStyleGlow: tabButtonGlow,
        minimizeLeftbarOnStart: true,
        minimizeBottombarOnStart: false,
        defaultSidebarSizePx: 200
    };

    let changingContent = "CONTENT";
    function onOpened()
    {
        changingContent = "OPENED";
    }
</script>

<ContentWrapper parentId="leftsidebar" name="CONTENT 2" materialSymbol="search" on:opened={onOpened}>
    <div class="test c2" slot="content">{changingContent}</div>
</ContentWrapper>
<ContentWrapper parentId="leftsidebar" name="CONTENT 3" materialSymbol="settings">
    <div class="test c3" slot="content">CONTENT 3</div>
</ContentWrapper>

<ContentWrapper parentId="bottomsidebar" name="CONTENT 4">
    <div class="test c4" slot="content">CONTENT 4</div>
</ContentWrapper>
<ContentWrapper parentId="bottomsidebar" name="CONTENT 5">
    <div class="test c5" slot="content">CONTENT 5</div>
</ContentWrapper>

<div class="container">
    <!--
<ContentWrapper parentId="main-content-container" name="Content 1">
    <div class="test c1" slot="content">CONTENT 1</div>
</ContentWrapper>-->

<div class="header"><div>H1</div><div>H2</div></div>

<!--TODO: provide workspace grid info on styling!-->
<!--TAB BUTTON STYLES-->
<!--BORDER STYLES-->
<!--FONTS-->
<!--COLORS-->

<WorkspaceLayout config={config}>
    <div class="test c1" slot="main-content">
        <div>CONTENT 1.1</div>
        <div>CONTENT 1.2</div>
        <div>CONTENT 1.3</div>
        <div>CONTENT 1.4</div>
        <div>CONTENT 1.5</div>
        <div>CONTENT 1.1</div>
        <div>CONTENT 1.2</div>
        <div>CONTENT 1.3</div>
        <div>CONTENT 1.4</div>
        <div>CONTENT 1.5</div>
        <div>CONTENT 1.1</div>
        <div>CONTENT 1.2</div>
        <div>CONTENT 1.3</div>
        <div>CONTENT 1.4</div>
        <div>CONTENT 1.5</div>
        <div>CONTENT 1.1</div>
        <div>CONTENT 1.2</div>
        <div>CONTENT 1.3</div>
        <div>CONTENT 1.4</div>
        <div>CONTENT 1.5</div>
        <div>CONTENT 1.1</div>
        <div>CONTENT 1.2</div>
        <div>CONTENT 1.3</div>
        <div>CONTENT 1.4</div>
        <div>CONTENT 1.5</div>
        <div>CONTENT 1.1</div>
        <div>CONTENT 1.2</div>
        <div>CONTENT 1.3</div>
        <div>CONTENT 1.4</div>
        <div>CONTENT 1.5</div>
    </div>
</WorkspaceLayout>

<div class="footer"><div>F2</div></div>
</div>

<style>
    .container{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .test{
        min-width: 0px;
        min-height: 0px;
        width: 100%;
        height: 100%;
        background-color:slategray;
    }
    .header{
        flex-shrink: 0;
    }
    .footer{
        flex-shrink: 0;
    }
    /*
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
    }*/
</style>