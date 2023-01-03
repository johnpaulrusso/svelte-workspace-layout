import { TabButtonStateID } from "./TabButtonState";
import { TabButtonStateMachine } from "./TabButtonStateMachine";

export class TabButtonElement extends HTMLButtonElement
{
    stateMachine: TabButtonStateMachine;

    constructor(idleStyle: string, hoverStyle: string, activeStyle: string, flashStyle: string)
    {
        super();
        
        this.stateMachine = new TabButtonStateMachine(idleStyle, hoverStyle, activeStyle, flashStyle);
        this.setStyle();

        this.addEventListener('click', e => {
            this.stateMachine.triggerTransition(TabButtonStateID.ACTIVE, 'click');
            this.setStyle();
        });

        this.addEventListener('onmouseover', e => {
            this.stateMachine.triggerTransition(TabButtonStateID.HOVER, 'onmouseover');
            this.setStyle();
        });

        this.addEventListener('onmouseout', e => {
            this.stateMachine.triggerTransition(TabButtonStateID.IDLE, 'onmouseout');
            this.setStyle();
        });
    }

    idle()
    {
        this.stateMachine.triggerTransition(TabButtonStateID.IDLE, 'external');
        this.setStyle();
    }

    flash()
    {
        this.stateMachine.triggerTransition(TabButtonStateID.FLASH, 'external');
        this.setStyle();
    }

    private setStyle()
    {
        this.style.cssText = this.stateMachine.currentState.style;
    }
}