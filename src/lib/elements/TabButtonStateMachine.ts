import { TabButtonState, TabButtonStateID } from "./TabButtonState";
import { TabButtonStateTransition } from "./TabButtonStateTransition";

export class TabButtonStateMachine
{
    currentState: TabButtonState;
    
    private idle: TabButtonState;
    private hover: TabButtonState;
    private active: TabButtonState;
    private flash: TabButtonState;

    constructor(idleStyle: string, hoverStyle: string, activeStyle: string, flashStyle: string)
    {
        this.idle = new TabButtonState(TabButtonStateID.IDLE, idleStyle);
        this.hover = new TabButtonState(TabButtonStateID.HOVER, hoverStyle);
        this.active = new TabButtonState(TabButtonStateID.ACTIVE, activeStyle);
        this.flash = new TabButtonState(TabButtonStateID.FLASH, flashStyle);

        /* IDLE Transitions */
        this.idle.addTransition(new TabButtonStateTransition(this.hover, ['onmouseover']));
        this.idle.addTransition(new TabButtonStateTransition(this.flash, ['external']));

        /* HOVER Transitions */
        this.hover.addTransition(new TabButtonStateTransition(this.idle, ['onmouseout']));
        this.hover.addTransition(new TabButtonStateTransition(this.active, ['click']));

        /* ACTIVE Transitions */
        this.active.addTransition(new TabButtonStateTransition(this.idle, ['external']));

        /* FLASH Transitions */
        this.flash.addTransition(new TabButtonStateTransition(this.active, ['click']));

        this.currentState = this.idle;
    }

    triggerTransition(stateId: TabButtonStateID, eventType: string)
    {
        //Only allow transitions if there exists a valid transition to the stateId.
        //Additionally, make sure the transition supports the specified event type.
        let transition = this.currentState.transitions.find(t => t.targetState.id === stateId);
        if(transition && transition.permittedTriggerEvents.findIndex(e => e === eventType) > -1)
        {
            this.currentState = transition.targetState;
        }
    }
}