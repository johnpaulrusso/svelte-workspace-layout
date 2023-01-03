import type { TabButtonState } from "./TabButtonState";

export class TabButtonStateTransition{
    targetState: TabButtonState;
    permittedTriggerEvents: Array<string> = [];

    constructor(targetState: TabButtonState, permittedTriggerEvents: Array<string>)
    {
        this.targetState = targetState;
        this.permittedTriggerEvents = permittedTriggerEvents;
    }
}