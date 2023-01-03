import { TabButtonStateID } from "./TabButtonState";
import { TabButtonStateMachine } from "./TabButtonStateMachine";

export class TabButton
{
    stateMachine: TabButtonStateMachine;
    buttonElement: HTMLButtonElement;

    constructor(uid: string, title: string, iconName: string | undefined, idleStyle: string, hoverStyle: string, activeStyle: string, flashStyle: string, customOnClickCallback: (event: Event) => void)
    {
        this.stateMachine = new TabButtonStateMachine(idleStyle, hoverStyle, activeStyle, flashStyle);

        this.buttonElement = document.createElement("button") as HTMLButtonElement;
        this.setupButtonElement(uid, title, iconName);
        this.setStyle();

        this.buttonElement.onclick = (e => {
            this.stateMachine.triggerTransition(TabButtonStateID.ACTIVE, 'click');
            this.setStyle();
            customOnClickCallback(e);
        });

        this.buttonElement.onmouseover = (e => {
            this.stateMachine.triggerTransition(TabButtonStateID.HOVER, 'onmouseover');
            this.setStyle();
        });

        this.buttonElement.onmouseout = (e => {
            this.stateMachine.triggerTransition(TabButtonStateID.IDLE, 'onmouseout');
            this.setStyle();
        });
    }

    forceIdle()
    {
        this.stateMachine.triggerTransition(TabButtonStateID.IDLE, 'external');
        this.setStyle();
    }

    forceActive()
    {
        this.stateMachine.triggerTransition(TabButtonStateID.ACTIVE, 'external');
        this.setStyle();
    }

    forceFlash()
    {
        this.stateMachine.triggerTransition(TabButtonStateID.FLASH, 'external');
        this.setStyle();
    }

    private setupButtonElement(uid: string, title: string, iconName: string | undefined)
    {
        this.buttonElement.classList.add("tab-button");
        this.buttonElement.setAttribute('data-uid', uid);
        this.buttonElement.title = title;

        if(iconName)
        {
            let buttonIconSpan = document.createElement("span");
            buttonIconSpan.innerHTML = iconName;
            buttonIconSpan.classList.add("material-symbols-outlined");
            buttonIconSpan.setAttribute('data-uid', uid);
            buttonIconSpan.style.cssText = "font-size: xx-large; margin: 5px 3px 5px 3px";
            this.buttonElement.appendChild(buttonIconSpan)
        }
        else
        {
            this.buttonElement.innerHTML = title;
        }
    }

    private setStyle()
    {
        this.buttonElement.style.cssText = this.stateMachine.currentState.style;
    }
}