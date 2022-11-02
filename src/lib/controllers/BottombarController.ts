import { SidebarController, REZISE_MOUSE_TOLERANCE_PX } from "./SidebarController";
import { SidebarOrientation } from "../models/SidebarModel";

export class BottombarController extends SidebarController
{
    constructor(name: string, size: number)
    {
        super(name, size);
        this.resizeCustom();
        this.model.width = "auto";
        this.model.orientation = SidebarOrientation.HORIZONTAL;
        this.model.gridarea = "bottombar";
    }

    updateIsMouseOverBorder(mouseX: number, mouseY: number, borderWidth: number)
    {
        if(!this.element) return;

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
}