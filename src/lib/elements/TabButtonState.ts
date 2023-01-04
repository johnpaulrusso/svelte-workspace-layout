import type { TabButtonStateTransition } from "./TabButtonStateTransition";

export enum TabButtonStateID 
{
    IDLE = 0,
    HOVER,
    ACTIVE,
    FLASH
}

export class TabButtonState
{
    id: TabButtonStateID;
    style: string;
    transitions: Array<TabButtonStateTransition> = [];

    constructor(id: TabButtonStateID, style: string)
    {
        this.id = id;
        this.style = style;
    }

    addTransition(transition: TabButtonStateTransition)
    {
        this.transitions.push(transition);
    }
}