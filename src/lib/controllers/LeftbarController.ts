import { SidebarController, REZISE_MOUSE_TOLERANCE_PX, MIN_SIDEBAR_WIDTH_PX, SIDEBAR_AUTO_MINIMIZE_ZONE_PX } from "./SidebarController";
import { SidebarOrientation } from "../models/SidebarModel";
import type {WorkspaceLayoutConfiguration} from "../models/WorkspaceLayoutConfiguration"

export const LEFT_BAR_OFFSET_PX: number = 62;

export class LeftbarController extends SidebarController
{
    constructor(name: string, size: number, config: WorkspaceLayoutConfiguration, tabClickedCallback?: (tabContainerName: string, tabName: string) => void)
    {
        super(name, size, config, tabClickedCallback);
        this.model.height = "auto"
        this.resizeCustom();
        this.model.orientation = SidebarOrientation.VERTICAL;
        this.model.gridarea = "leftbar";
    }

    updateIsMouseOverBorder(mouseX: number, mouseY: number, borderWidth: number)
    {
        if(!this.element || !this.model.isDisplayed) return;

        let rec = this.element.getBoundingClientRect();
        let barX = rec.right;

        let isMouseXInlineWithSideBarBorder: boolean = (mouseX > (barX - borderWidth - REZISE_MOUSE_TOLERANCE_PX)) &&
                                                       (mouseX < (barX + REZISE_MOUSE_TOLERANCE_PX));
                                                         
        this.model.isMouseOverBorder = isMouseXInlineWithSideBarBorder;
    }

    resizeCustom(): void
    {
        this.model.width = this.model.size + "px";
    }

    getMinSize(): number
    {
        return MIN_SIDEBAR_WIDTH_PX;
    }
}