<script lang="ts">
    import {onMount, afterUpdate} from "svelte";
    import Sidebar from "./Sidebar.svelte";
    import { MIN_SIDEBAR_SIZE_PX } from "../controllers/SidebarController";
    import { LeftbarController } from "../controllers/LeftbarController";
    import { BottombarController } from "../controllers/BottombarController";
    import * as tabMgr from "../controllers/TabbedContentController"
    import type {WorkspaceLayoutConfiguration} from "../models/WorkspaceLayoutConfiguration"

    /* public properties */
    // TODO: Package these in an interface.
    export let config: WorkspaceLayoutConfiguration = {
        borderWidth_px: 1,
        controlBar_backgroundColor: "",
        controlBarButton_color: "",
        tabButtonStyle: "",
        tabButtonStyleHover: "",
        minimizeLeftbarOnStart: false,
        minimizeBottombarOnStart: false
    };

    let mouseX: number = 0;
    let mouseY: number = 0;
    let containerElement: HTMLElement | null;

    let leftSideBar: LeftbarController = new LeftbarController("leftsidebar", config.minimizeLeftbarOnStart ? MIN_SIDEBAR_SIZE_PX : 200);
    let bottomSideBar: BottombarController = new BottombarController("bottomsidebar", config.minimizeBottombarOnStart ? MIN_SIDEBAR_SIZE_PX : 200);

    let tabbedContentManager: tabMgr.TabbedContentManager | null = null; 

    onMount(() => {

        getElementsIfNull();

        leftSideBar.model.isMinimized = config.minimizeLeftbarOnStart;
        bottomSideBar.model.isMinimized = config.minimizeBottombarOnStart;
    
        tabbedContentManager = new tabMgr.TabbedContentManager([leftSideBar.model, bottomSideBar.model], config.tabButtonStyle, config.tabButtonStyleHover, onTabClicked, onTabManagerChange);
        tabbedContentManager.placeItemsInInitialLocations();
    })

    const onTabClicked = (tabContainerName: string) =>
    {
        if(tabContainerName == "leftsidebar")
        {
            if(leftSideBar.model.isMinimized)
            {
                leftSideBar.toggleOpenClose();
            }
            leftSideBar = leftSideBar;
        }
        if(tabContainerName == "bottomsidebar")
        {
            if(bottomSideBar.model.isMinimized)
            {
                bottomSideBar.toggleOpenClose();
            }
            bottomSideBar = bottomSideBar;
        }
    }

    const onTabManagerChange = (tabContainerName: string) => 
    {
        if(tabContainerName == "leftsidebar")
        {
            leftSideBar = leftSideBar;
        }
        if(tabContainerName == "bottomsidebar")
        {
            bottomSideBar = bottomSideBar;
        }
    }

    /**
     * This component must always monitor mouse movement to handle 
     * seemless sub-element resizing. 
     * @param event mouse move event.
     */
    function onMouseMove(event: MouseEvent)
    {
        mouseX = event.clientX;
        mouseY = event.clientY;

        getElementsIfNull();

        if(!containerElement) {return}
        
        leftSideBar.updateIsMouseOverBorder(mouseX, mouseY, config.borderWidth_px);
        bottomSideBar.updateIsMouseOverBorder(mouseX, mouseY, config.borderWidth_px);

        updateCursorStyle();

        //We need to calculate an offset here incase the layout is nested in another UI element.
        let offsetX = containerElement.getBoundingClientRect().left;
        leftSideBar.resize(mouseX + offsetX);

        //We need to calculate an offset here incase the layout is nested in another UI element.
        let sby = containerElement.getBoundingClientRect().top + containerElement.getBoundingClientRect().height - mouseY;
        bottomSideBar.resize(sby);

        //This is needed to trigger Svelte reactivity.
        leftSideBar = leftSideBar;
        bottomSideBar = bottomSideBar;
    }

    /**
     * This component must listen for mouse down events to initiate potential 
     * resize actions.
     */
    function onMouseDown()
    {
        leftSideBar.setIsResizing();
        bottomSideBar.setIsResizing();
    }

    /**
     * This component must listen for mouse up events to end any 
     * active resize actions.
     */
    function onMouseUp()
    {
        bottomSideBar.clearIsResizing();
        leftSideBar.clearIsResizing();
    }

    function getElementsIfNull()
    {
        if(!containerElement)
        {
            containerElement = document.getElementById("workspace_layout");
        }
        if(!bottomSideBar.element)
        {
            bottomSideBar.element = document.getElementById(bottomSideBar.model.name);
        }
        if(!leftSideBar.element)
        {
            leftSideBar.element = document.getElementById(leftSideBar.model.name);
        }
    }

    function updateCursorStyle()
    {
        if(!containerElement)
        {
            containerElement = document.getElementById("workspace_layout");
        }
        if(!containerElement) return;

        if((leftSideBar.model.isMouseOverBorder || leftSideBar.model.isResizing) && (bottomSideBar.model.isMouseOverBorder || bottomSideBar.model.isResizing))
        {
            containerElement.style.cursor = "move";
        }
        else if(leftSideBar.model.isMouseOverBorder || leftSideBar.model.isResizing)
        {
            containerElement.style.cursor = "col-resize";
        }
        else if(bottomSideBar.model.isMouseOverBorder || bottomSideBar.model.isResizing)
        {
            containerElement.style.cursor = "row-resize";
        }
        else
        {
            containerElement.style.cursor = "default";
        }
    }

    function onOpenCloseLeftbar() {
        leftSideBar.toggleOpenClose();
        leftSideBar = leftSideBar;
    }   

    function onOpenCloseBottombar() {
        bottomSideBar.toggleOpenClose();
        bottomSideBar = bottomSideBar;
    }   

    function onChangeTabLeftbar(event: CustomEvent) {
        leftSideBar.changeTab(event.detail);
        leftSideBar = leftSideBar;
    }   

    function onChangeTabBottombar(event: CustomEvent) {
        bottomSideBar.changeTab(event.detail);
        bottomSideBar = bottomSideBar;
    }   

</script>


<div class="container-horizontal noselect" id="workspace_layout" on:mousemove={onMouseMove} on:mousedown={onMouseDown} on:mouseup={onMouseUp} on:mouseleave={onMouseUp}>
    <Sidebar model={leftSideBar.model}
             controlBar_backgroundColor={config.controlBar_backgroundColor}
             controlBarButton_color={config.controlBarButton_color}
             on:open_close_event={onOpenCloseLeftbar}
             on:tab_change_event={onChangeTabLeftbar}>
    </Sidebar>
    <div class="container-nested-vertical">
        <div class="main-content">
            <slot name="main-content">Error: Missing Main Content Slot!</slot>
        </div>
        <Sidebar model={bottomSideBar.model}
                controlBar_backgroundColor={config.controlBar_backgroundColor}
                controlBarButton_color={config.controlBarButton_color}
                on:open_close_event={onOpenCloseBottombar}
                on:tab_change_event={onChangeTabBottombar}>
        </Sidebar>
    </div>
</div>

<style>
    .container-horizontal{
        width: 100%;
        height: 100%;

        min-height: 0px;

        /** Grid Setup */
        display: flex;
        flex-direction: row;

         /* Flex ITEM */
         flex: 1;
    }
    .container-nested-vertical{
        width: 100%;
        height: 100%;

        min-height: 0px;

        /* Flex Item: If Leftbar Increases */
        flex: 1; /* adjust automatically */
        min-width: 0; /* allow flexing beyond auto width */
        overflow-x: auto; /* scroll overflow on small width */

        /* Flex Setup */
        display: flex;
        flex-direction: column;
    }
    .main-content{
        width: 100%;

        /* Flex Item: If Bottombar Increases */
        flex: 1; /* adjust automatically */
        min-height: 0; /* allow flexing beyond auto height */
        overflow-y: auto; /* scroll overflow on small height */

        /* Flex Setup, For Slotted Content */
        display: flex;
        flex-direction: column;
    }
    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                    user-select: none; /* Non-prefixed version, currently
                                        supported by Chrome, Edge, Opera and Firefox */
    }


</style>