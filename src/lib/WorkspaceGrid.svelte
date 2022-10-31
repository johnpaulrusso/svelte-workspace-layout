<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
    import { LeftbarModel } from "./Leftbar";
    import { BottombarModel } from "./Bottombar";

    const BORDER_WIDTH_PX: number = 5; 

    /* private properties */
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
        
        leftSideBar.updateIsMouseOverBorder(mouseX, BORDER_WIDTH_PX);
        bottomSideBar.updateIsMouseOverBorder(mouseX, mouseY, BORDER_WIDTH_PX);

        updateCursorStyle();

        leftSideBar.resize(mouseX);
        bottomSideBar.resize(containerElement.getBoundingClientRect().height - mouseY);
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


<div class="container" id="workspace_layout" on:mousemove={onMouseMove} on:mousedown={onMouseDown} on:mouseup={onMouseUp}>
    <div class="content">
        <slot name="main-content"/>
    </div>
    <Sidebar id={leftSideBar.name} width="{leftSideBar.size}px" border="solid blue {BORDER_WIDTH_PX}px" gridarea="leftbar">
        <div slot="content">LEFTBAR</div>
    </Sidebar>
    <Sidebar id={bottomSideBar.name} height="{bottomSideBar.size}px" width="100%" border="solid red {BORDER_WIDTH_PX}px" gridarea="bottombar">
        <div slot="content">BOTTOMBAR</div>
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

        border: solid 5px green;
    }
</style>