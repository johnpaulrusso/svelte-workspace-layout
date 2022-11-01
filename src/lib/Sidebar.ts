export const REZISE_MOUSE_TOLERANCE_PX: number = 5;
export const MIN_SIDEBAR_SIZE_PX: number = 20;

export enum SidebarOrientation 
{
    VERTICAL = 0,
    HORIZONTAL
}

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
            if(size < MIN_SIDEBAR_SIZE_PX)
            {
                this.size = MIN_SIDEBAR_SIZE_PX;
            }
            else
            {
                this.size = size;
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    abstract resize(size: number): void
}