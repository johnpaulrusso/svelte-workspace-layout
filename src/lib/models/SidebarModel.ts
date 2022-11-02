import type { IWorkspaceComponentModel } from "./WorkspaceComponentModel";

export enum SidebarOrientation 
{
    VERTICAL = 0,
    HORIZONTAL
}

/**
 * This interface defines all data needed by the sidebar UI.
 */
export interface ISidebarModel
{
    /*Identification Props*/
    name: string;

    /*Geometric Props*/
    size: number;
    height: string;
    width: string;
    orientation: SidebarOrientation;
    gridarea: string;

    /*Border Props*/
    border: string;

    /*Properties for resizing*/
    isMouseOverBorder: boolean;
    isResizing: boolean;
    isMinimized: boolean;

    /*Child Components*/
    selectedComponentIndex: number;
}