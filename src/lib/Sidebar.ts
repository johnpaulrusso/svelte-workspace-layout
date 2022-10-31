export const REZISE_MOUSE_TOLERANCE_PX: number = 2;

export abstract class SidebarModel
{
    name: string = "";
    size: number;
    isMouseOverBorder: boolean;
    isResizing: boolean;
    element: HTMLElement | null;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
        this.isMouseOverBorder = false;
        this.isResizing = false;
        this.element = null;
    }

    setIsResizing()
    {
        if(this.isMouseOverBorder)
        {
            this.isResizing = true;
        }
    }

    clearIsResizing()
    {
        this.isResizing = false;
    }

    resizeBase(size: number): boolean
    {
        if(this.isResizing)
        {
            this.size = size;
            return true;
        }
        else
        {
            return false;
        }
    }

    abstract resize(size: number): void
}



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