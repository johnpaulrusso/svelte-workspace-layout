<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
    import { LeftbarModel } from "./Leftbar";
    import { BottombarModel } from "./Bottombar";
    import {SidebarOrientation} from "./Sidebar";

    /* public properties */
    export let borderWidth_px: number = 1;
    export let borderColor: string = "lightgray";

    /* private properties */
    let LEFTBAR_BORDER_STYLE: string = "border-style: none solid none none; border-color: " + 
                                        borderColor + "; border-width: " + 
                                        borderWidth_px + "px;";
    let BOTTOMBAR_BORDER_STYLE: string = "border-style: solid none none none; border-color: " +                                       
                                        borderColor + "; border-width: " + 
                                        borderWidth_px + "px;";

    let mouseX: number = 0;
    let mouseY: number = 0;
    let containerElement: HTMLElement | null;

    let leftSideBar: LeftbarModel = new LeftbarModel("leftsidebar", 200);
    let bottomSideBar: BottombarModel = new BottombarModel("bottomsidebar", 200);

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

        if(!containerElement || !leftSideBar.element || !bottomSideBar.element) {return}
        
        leftSideBar.updateIsMouseOverBorder(mouseX, mouseY, borderWidth_px);
        bottomSideBar.updateIsMouseOverBorder(mouseX, mouseY, borderWidth_px);

        updateCursorStyle();

        leftSideBar.resize(mouseX);
        bottomSideBar.resize(containerElement.getBoundingClientRect().height - mouseY);

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
            bottomSideBar.element = document.getElementById(bottomSideBar.name);
        }
        if(!leftSideBar.element)
        {
            leftSideBar.element = document.getElementById(leftSideBar.name);
        }
    }

    function updateCursorStyle()
    {
        if(!containerElement)
        {
            containerElement = document.getElementById("workspace_layout");
        }
        if(!containerElement) return;

        if((leftSideBar.isMouseOverBorder || leftSideBar.isResizing) && (bottomSideBar.isMouseOverBorder || bottomSideBar.isResizing))
        {
            containerElement.style.cursor = "move";
        }
        else if(leftSideBar.isMouseOverBorder || leftSideBar.isResizing)
        {
            containerElement.style.cursor = "col-resize";
        }
        else if(bottomSideBar.isMouseOverBorder || bottomSideBar.isResizing)
        {
            containerElement.style.cursor = "row-resize";
        }
        else
        {
            containerElement.style.cursor = "default";
        }
    }
</script>


<div class="container noselect" id="workspace_layout" on:mousemove={onMouseMove} on:mousedown={onMouseDown} on:mouseup={onMouseUp} on:mouseleave={onMouseUp}>
    <div class="content">
        <slot name="main-content"><em>no content was provided to this slot.</em></slot>
    </div>
    <Sidebar id={leftSideBar.name} 
             width="{leftSideBar.size}px" 
             border="{LEFTBAR_BORDER_STYLE}" 
             gridarea="leftbar" 
             orientation={SidebarOrientation.VERTICAL}
             isMinimized={leftSideBar.isMinimized}>
        <slot name="leftbar" slot="content"><em>no content was provided to this slot.</em></slot>
    </Sidebar>
    <Sidebar id={bottomSideBar.name} 
            height="{bottomSideBar.size}px" 
            border="{BOTTOMBAR_BORDER_STYLE}" 
            gridarea="bottombar" 
            orientation={SidebarOrientation.HORIZONTAL}
            isMinimized={bottomSideBar.isMinimized}>
        <slot name="bottombar" slot="content"><em>no content was provided to this slot.</em></slot>
    </Sidebar>
</div>

<style>
    .container{
        width: 100%;
        height: 100%;

        /** Grid Setup */
        display: grid;
        grid-template-columns: min-content minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr) min-content;
        grid-template-areas: 
            "leftbar content"
            "leftbar bottombar";
    }
    .content{
        grid-area: content;

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