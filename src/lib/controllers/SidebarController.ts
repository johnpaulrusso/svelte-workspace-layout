export const REZISE_MOUSE_TOLERANCE_PX: number = 5;
export const MIN_SIDEBAR_HEIGHT_PX: number = 20;
export const MIN_SIDEBAR_WIDTH_PX: number = 46;
export const SIDEBAR_AUTO_MINIMIZE_ZONE_PX: number = 50;
export const DEFAULT_SIZE_PX: number = 200;

import type { ISidebarModel } from "../models/SidebarModel";
import { SidebarOrientation } from "../models/SidebarModel";

export abstract class SidebarController
{
    model: ISidebarModel;

    //The underlying element is intentionally NOT part of the interface.
    element: HTMLElement | null;

    constructor(name: string, size: number) {
        this.model = {
            name: name,
            size: size,
            height: "auto",
            width: (size + "px"),
            orientation: SidebarOrientation.VERTICAL,
            gridarea: "leftbar",
            border: "",
            isMouseOverBorder: false,
            isResizing: false,
            isMinimized: false,
            selectedTabName: "",
            isDisplayed: false,
        }
        this.element = null;
    }

    setIsResizing()
    {
        if(this.model.isMouseOverBorder && this.model.isDisplayed)
        {
            this.model.isResizing = true;
        }
    }

    clearIsResizing()
    {
        this.model.isResizing = false;
    }

    resize(size: number): boolean
    {
        if(this.model.isResizing && this.model.isDisplayed)
        {
            let minSize = this.getMinSize();

            if(size <= minSize + SIDEBAR_AUTO_MINIMIZE_ZONE_PX)
            {
                this.model.size = minSize;
                this.model.isMinimized = true;
            }
            else
            {
                this.model.size = size;
                this.model.isMinimized = false;
            }
            
            this.resizeCustom();

            return true;
        }
        else
        {
            return false;
        }
    }

    toggleOpenClose()
    {
        if(this.model.isMinimized)
        {
            this.open();
        }
        else
        {
            this.close();
        }
    }

    open()
    {
        this.model.size = DEFAULT_SIZE_PX;
        this.model.isMinimized = false;
        this.resizeCustom();
    }

    close()
    {
        this.model.size = this.getMinSize();
        this.model.isMinimized = true;
        this.resizeCustom();
    }

    changeTab(tabName: string | null)
    {
        if(tabName)
        {
            this.model.selectedTabName = tabName
            if(this.model.isMinimized)
            {
                this.model.size = DEFAULT_SIZE_PX;
                this.model.isMinimized = false;
                this.resizeCustom();
            }
        }
    }

    abstract updateIsMouseOverBorder(mouseX: number, mouseY: number, borderWidth: number): void
    abstract resizeCustom(): void
    abstract getMinSize(): number
}