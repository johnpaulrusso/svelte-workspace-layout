import { SidebarController, REZISE_MOUSE_TOLERANCE_PX } from "./SidebarController";
import { SidebarOrientation } from "../models/SidebarModel";

export class LeftbarController extends SidebarController
{
    constructor(name: string, size: number)
    {
        super(name, size);
        this.model.height = "auto"
        this.resizeCustom();
        this.model.orientation = SidebarOrientation.VERTICAL;
        this.model.gridarea = "leftbar";
    }

    updateIsMouseOverBorder(mouseX: number, mouseY: number, borderWidth: number)
    {
        if(!this.element) return;

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
}