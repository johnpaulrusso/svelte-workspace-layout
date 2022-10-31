import { SidebarModel, REZISE_MOUSE_TOLERANCE_PX } from "./Sidebar";

export class BottombarModel extends SidebarModel
{
    constructor(name: string, size: number)
    {
        super(name, size);
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

        this.isMouseOverBorder = isMouseXInLeftColumn && isMouseYInlineWithBottomBarBorder;
    }

    resize(size: number)
    {
        if(super.resizeBase(size) && this.element)
        {
            this.element.style.height = size + "px";
        }
    }

}