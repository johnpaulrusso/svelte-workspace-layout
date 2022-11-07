import type { ComponentEvents, ComponentProps, ComponentType, SvelteComponent } from "svelte";

export enum WorkspaceLocation 
{
    MAIN = 0,
    LEFTBAR,
    BOTTOMBAR
}

export interface IWorkspaceComponentModel
{
    name: string
    componentType: ComponentType;
    properties: Record<string, any>;
    events: Array<IEventCallback>;
    initialLocation: WorkspaceLocation;
}

export interface IEventCallback
{
    name: string,
    callback: (event: Event) => void
}