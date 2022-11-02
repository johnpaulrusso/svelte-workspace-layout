export const REZISE_MOUSE_TOLERANCE_PX: number = 5;
export const MIN_SIDEBAR_SIZE_PX: number = 20;
export const SIDEBAR_AUTO_MINIMIZE_ZONE_PX: number = 50;
export const DEFAULT_SIZE_PX: number = 200;

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
    isMinimized: boolean;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
        this.isMouseOverBorder = false;
        this.isResizing = false;
        this.element = null;
        this.isMinimized = false;
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

    resize(size: number): boolean
    {
        if(this.isResizing)
        {
            if(size <= MIN_SIDEBAR_SIZE_PX + SIDEBAR_AUTO_MINIMIZE_ZONE_PX)
            {
                this.size = MIN_SIDEBAR_SIZE_PX;
                this.isMinimized = true;
            }
            else
            {
                this.size = size;
                this.isMinimized = false;
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    toggleOpenClose()
    {
        if(this.isMinimized)
        {
            this.size = DEFAULT_SIZE_PX;
            this.isMinimized = false;
        }
        else
        {
            this.size = MIN_SIDEBAR_SIZE_PX;
            this.isMinimized = true;
        }
    }

    abstract updateIsMouseOverBorder(mouseX: number, mouseY: number, borderWidth: number): void
}