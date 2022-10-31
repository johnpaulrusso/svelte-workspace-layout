<script lang="ts">
	import BottomBar from "./BottomBar.svelte";
    import Sidebar from "./Sidebar.svelte";

    const BORDER_WIDTH_PX: number = 5; 
    const REZISE_MOUSE_TOLERANCE_PX: number = 2;

    let isMouseOverBottombarBorder: boolean = false;
    let isResizingBottomBar: boolean = false;

    function onMouseMove(event: MouseEvent)
    {
        let mouseX = event.clientX;
        let mouseY = event.clientY;

        let containerElement = document.getElementById("workspace_layout");
        let bottomBarElement = document.getElementById("bottombar");
        if(!containerElement || !bottomBarElement) {return}

        let bottomBarRec = bottomBarElement.getBoundingClientRect();
        let bottomBarX = bottomBarRec.left;
        let bottomBarY = bottomBarRec.top;
        
        let isMouseXInLeftColumn: boolean = mouseX > bottomBarX;
        let isMouseYInlineWithBottomBarBorder: boolean = (mouseY > (bottomBarY - REZISE_MOUSE_TOLERANCE_PX)) &&
                                                         (mouseY < (bottomBarY + BORDER_WIDTH_PX + REZISE_MOUSE_TOLERANCE_PX));

        isMouseOverBottombarBorder = isMouseXInLeftColumn && isMouseYInlineWithBottomBarBorder;
        
        containerElement.style.cursor = (isMouseOverBottombarBorder || isResizingBottomBar) ? "row-resize" : "default";

        if(isResizingBottomBar)
        {
            //We need to change the div height with the mouse!
            bottomBarElement.style.height = (containerElement.getBoundingClientRect().height - mouseY) + "px";
        }
    }

    function onMouseDown()
    {
        if(isMouseOverBottombarBorder)
        {
            isResizingBottomBar = true;
        }
    }

    function onMouseUp()
    {
        isResizingBottomBar = false;
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