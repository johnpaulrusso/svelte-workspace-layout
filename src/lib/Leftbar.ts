import { SidebarModel, REZISE_MOUSE_TOLERANCE_PX } from "./Sidebar";

export class LeftbarModel extends SidebarModel
{
    constructor(name: string, size: number)
    {
        super(name, size);
    }

    updateIsMouseOverBorder(mouseX: number, borderWidth: number)
    {
        if(!this.element) return;

        let rec = this.element.getBoundingClientRect();
        let barX = rec.right;

        let isMouseXInlineWithSideBarBorder: boolean = (mouseX > (barX - borderWidth - REZISE_MOUSE_TOLERANCE_PX)) &&
                                                       (mouseX < (barX + REZISE_MOUSE_TOLERANCE_PX));
                                                         
        this.isMouseOverBorder = isMouseXInlineWithSideBarBorder;
    }

    resize(size: number)
    {
        if(super.resizeBase(size) && this.element)
        {
            this.element.style.width = this.size + "px";
        }
    }
}