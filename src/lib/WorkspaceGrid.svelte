<script lang="ts">
    import {onMount} from "svelte";
    import Sidebar from "./components/Sidebar.svelte";
    import { LeftbarController } from "./controllers/LeftbarController";
    import { BottombarController } from "./controllers/BottombarController";
	import { WorkspaceLocation, type IWorkspaceComponentModel } from "./models/WorkspaceComponentModel";

    /* public properties */
    export let borderWidth_px: number = 1;
   // export let borderColor: string = "lightgray";

    export let components: Array<IWorkspaceComponentModel> = [];

    /* private properties */
    /*
    let LEFTBAR_BORDER_STYLE: string = "border-style: none solid none none; border-color: " + 
                                        borderColor + "; border-width: " + 
                                        borderWidth_px + "px;";
    let BOTTOMBAR_BORDER_STYLE: string = "border-style: solid none none none; border-color: " +                                       
                                        borderColor + "; border-width: " + 
                                        borderWidth_px + "px;";*/

    let mouseX: number = 0;
    let mouseY: number = 0;
    let containerElement: HTMLElement | null;

    let leftSideBar: LeftbarController = new LeftbarController("leftsidebar", 200);
    let bottomSideBar: BottombarController = new BottombarController("bottomsidebar", 200);

    $: leftSidebarComponents = components.filter(comp => comp.initialLocation === WorkspaceLocation.LEFTBAR);
    $: bottomSidebarComponents = components.filter(comp => comp.initialLocation === WorkspaceLocation.BOTTOMBAR);
    $: if(leftSidebarComponents.length > 0){
        leftSideBar.model.isDisplayed = true;
    }else{
        leftSideBar.model.isDisplayed = false;
    }
    $: if(bottomSidebarComponents.length > 0){
        bottomSideBar.model.isDisplayed = true;
    }else{
        bottomSideBar.model.isDisplayed = false;
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


<div class="container noselect" id="workspace_layout" on:mousemove={onMouseMove} on:mousedown={onMouseDown} on:mouseup={onMouseUp} on:mouseleave={onMouseUp}>
    <div class="content">
        <slot name="main-content"><em>no content was provided to this slot.</em></slot>
    </div>
    <Sidebar model={leftSideBar.model}
             components={leftSidebarComponents}
             on:open_close_event={onOpenCloseLeftbar}
             on:tab_change_event={onChangeTabLeftbar}>
    </Sidebar>
    <Sidebar model={bottomSideBar.model}
            components={bottomSidebarComponents}
            on:open_close_event={onOpenCloseBottombar}
            on:tab_change_event={onChangeTabBottombar}>
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