import type { ComponentType } from "svelte";

export enum WorkspaceLocation 
{
    MAIN = 0,
    LEFTBAR,
    BOTTOMBAR
}

export interface IWorkspaceComponentModel
{
    componentType: ComponentType;
    properties: Record<string, any>;
    initialLocation: WorkspaceLocation;
}