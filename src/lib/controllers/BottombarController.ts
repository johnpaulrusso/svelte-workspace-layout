import { SidebarController, REZISE_MOUSE_TOLERANCE_PX, MIN_SIDEBAR_HEIGHT_PX, SIDEBAR_AUTO_MINIMIZE_ZONE_PX } from "./SidebarController";
import { SidebarOrientation } from "../models/SidebarModel";
import type {WorkspaceLayoutConfiguration} from "../models/WorkspaceLayoutConfiguration"

export class BottombarController extends SidebarController
{
    constructor(name: string, size: number, config: WorkspaceLayoutConfiguration, tabClickedCallback?: (tabContainerName: string, tabName: string) => void)
    {
        super(name, size, config, tabClickedCallback);
        this.resizeCustom();
        this.model.width = "auto";
        this.model.orientation = SidebarOrientation.HORIZONTAL;
        this.model.gridarea = "bottombar";
    }

    updateIsMouseOverBorder(mouseX: number, mouseY: number, borderWidth: number)
    {
        if(!this.element || !this.model.isDisplayed) return;

        let rec = this.element.getBoundingClientRect();
        let barX = rec.left;
        let barY = rec.top;

        let isMouseXInLeftColumn: boolean = mouseX > barX - REZISE_MOUSE_TOLERANCE_PX;
        let isMouseYInlineWithBottomBarBorder: boolean = (mouseY > (barY - REZISE_MOUSE_TOLERANCE_PX)) &&
                                                         (mouseY < (barY + borderWidth + REZISE_MOUSE_TOLERANCE_PX));

        this.model.isMouseOverBorder = isMouseXInLeftColumn && isMouseYInlineWithBottomBarBorder;
    }

    resizeCustom(): void
    {
        this.model.height = this.model.size + "px";
    }

    getMinSize(): number
    {
        return MIN_SIDEBAR_HEIGHT_PX;
    }
}