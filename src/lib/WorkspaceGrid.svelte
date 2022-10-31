<script lang="ts">
	import BottomBar from "./BottomBar.svelte";
    import Sidebar from "./Sidebar.svelte";

    const BORDER_WIDTH_PX: number = 5; 
    const REZISE_MOUSE_TOLERANCE_PX: number = 2;

    /* private properties */
    let isMouseOverBottombarBorder: boolean = false;
    let isMouseOverSidebarBorder: boolean = false;
    let isResizingBottomBar: boolean = false;
    let isResizingSideBar: boolean = false;
    let mouseX: number = 0;
    let mouseY: number = 0;
    let containerElement: HTMLElement | null;
    let bottomBarElement: HTMLElement | null;
    let sidebarElement: HTMLElement | null;

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

        if(!containerElement || !bottomBarElement || !sidebarElement) {return}
        
        getMouseLocationDetailsFromCoordinates();
        updateCursorStyle();
        resizeBottomBar();
        resizeSideBar();
    }

    /**
     * This component must listen for mouse down events to initiate potential 
     * resize actions.
     */
    function onMouseDown()
    {
        if(isMouseOverBottombarBorder)
        {
            isResizingBottomBar = true;
        }
        if(isMouseOverSidebarBorder)
        {
            isResizingSideBar = true;
        }
    }

    /**
     * This component must listen for mouse up events to end any 
     * active resize actions.
     */
    function onMouseUp()
    {
        isResizingBottomBar = false;
        isResizingSideBar = false;
    }

    function getElementsIfNull()
    {
        if(!containerElement)
        {
            containerElement = document.getElementById("workspace_layout");
        }
        if(!bottomBarElement)
        {
            bottomBarElement = document.getElementById("bottombar");
        }
        if(!sidebarElement)
        {
            sidebarElement = document.getElementById("sidebar");
        }
    }

    function getMouseLocationDetailsFromCoordinates()
    {
        if(!bottomBarElement || !sidebarElement) return;

        let bottomBarRec = bottomBarElement.getBoundingClientRect();
        let bottomBarX = bottomBarRec.left;
        let bottomBarY = bottomBarRec.top;

        let sidebarRec = sidebarElement.getBoundingClientRect();
        let sidebarX = sidebarRec.right;
        
        let isMouseXInLeftColumn: boolean = mouseX > bottomBarX - REZISE_MOUSE_TOLERANCE_PX;
        let isMouseYInlineWithBottomBarBorder: boolean = (mouseY > (bottomBarY - REZISE_MOUSE_TOLERANCE_PX)) &&
                                                         (mouseY < (bottomBarY + BORDER_WIDTH_PX + REZISE_MOUSE_TOLERANCE_PX));
        let isMouseXInlineWithSideBarBorder: boolean = (mouseX > (sidebarX - BORDER_WIDTH_PX - REZISE_MOUSE_TOLERANCE_PX)) &&
                                                       (mouseX < (sidebarX + REZISE_MOUSE_TOLERANCE_PX));

        isMouseOverBottombarBorder = isMouseXInLeftColumn && isMouseYInlineWithBottomBarBorder;
        isMouseOverSidebarBorder = isMouseXInlineWithSideBarBorder;
    }

    function updateCursorStyle()
    {
        if(!containerElement)
        {
            containerElement = document.getElementById("workspace_layout");
        }
        if(!containerElement) return;

        if((isMouseOverSidebarBorder || isResizingSideBar) && (isMouseOverBottombarBorder || isResizingBottomBar))
        {
            containerElement.style.cursor = "move";
        }
        else if(isMouseOverSidebarBorder || isResizingSideBar)
        {
            containerElement.style.cursor = "col-resize";
        }
        else if(isMouseOverBottombarBorder || isResizingBottomBar)
        {
            containerElement.style.cursor = "row-resize";
        }
        else
        {
            containerElement.style.cursor = "default";
        }
    }

    function resizeBottomBar()
    {
        if(!containerElement || !bottomBarElement || !isResizingBottomBar) return;

        bottomBarElement.style.height = (containerElement.getBoundingClientRect().height - mouseY) + "px";
    }

    function resizeSideBar()
    {
        if(!isResizingSideBar || !sidebarElement) return;
            
        sidebarElement.style.width = mouseX + "px";
    }
</script>


<div class="container" id="workspace_layout" on:mousemove={onMouseMove} on:mousedown={onMouseDown} on:mouseup={onMouseUp}>
    <div class="content">
        <slot name="main-content"/>
    </div>
    <Sidebar>
        <div slot="content">SIDEBAR</div>
    </Sidebar>
    <BottomBar borderWidth={BORDER_WIDTH_PX}>
        <div slot="content">BOTTOMBAR</div>
    </BottomBar>
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
            "sidebar content"
            "sidebar bottombar";
    }
    .content{
        grid-area: content;

        border: solid 5px green;
    }
</style>