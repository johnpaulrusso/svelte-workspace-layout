/**
 *  Nothing about this class has to do with slots! Only tabs.
 * 
 *  slotted-wrapper-content could be any target, let the client decide!
 * 
 *  This object should not perform any sidebar specific tasks!
 */
 import type { ISidebarModel } from "../models/SidebarModel";

export const CLASS_TABBABLE_CONTENT: string = "tabbable-content";
export const CLASS_TABBABLE_CONTENT_CONTAINER: string = "tabbable-content-container";

export const CLASS_STAGED_TABS: string = "staged-tabs";
export const CLASS_ACTIVE_TAB: string = "active-tab";
export const CLASS_TAB_BUTTON_CONTAINER: string = "tab-buttons"



export function getSingletonElementByClassFrom(parentElement: HTMLElement, className: string): HTMLElement | null
{
    let element: HTMLElement | null = null;
    let candidates = parentElement.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>
    if(candidates.length == 1)
    {
        element = candidates.item(0);
    }
    return element;
}


export class TabbedContentManager{
    tabbedContentContainerModels: ISidebarModel[] = [];
    buttonStyle: string = "";
    buttonHoverStyle: string = "";
    onChangeCallback:  ((tabContainerName: string) => void) | null = null;

    /** Use this to identify content wrappers. */
    #nextContentUid: number = 0;
    
    constructor(tabbedContentContainerModels: ISidebarModel[], buttonStyle?: string, buttonHoverStyle?: string, onChangeCallback?: (tabContainerName: string) => void)
    {
        this.tabbedContentContainerModels = tabbedContentContainerModels;
        if(buttonStyle)
        {
            this.buttonStyle = buttonStyle;
        }
        if(buttonHoverStyle)
        {
            this.buttonHoverStyle = buttonHoverStyle;
        }

        if(onChangeCallback)
        {
            this.onChangeCallback = onChangeCallback;
        }
    }

    /**
     * placeItemsInInitialLocations - Places all content wrappers into
     * initial elements based on thier corresponding parent Id.
     * @param parentIds a list of the string parentIds of elements 
     * valid for content wrapper placement.
     */
    placeItemsInInitialLocations()
    {
        //For each ContentWrapper, place in the commanded TabbedFlexItem's staging element.
        let allWrappedContent = document.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
        Array.from(allWrappedContent).forEach(wc => {
            let tabbedContentContainerModel = this.tabbedContentContainerModels.find(m => m.name === wc.dataset.parentid);
            if(tabbedContentContainerModel)
            {
                wc.dataset.uid = String(this.#nextContentUid++);
                this.#placeInStagingElementOfParentId(tabbedContentContainerModel.name, wc);

                if(!tabbedContentContainerModel.isDisplayed && this.onChangeCallback)
                {
                    tabbedContentContainerModel.isDisplayed = true;
                    this.onChangeCallback(tabbedContentContainerModel.name);
                }
            }
        });
    }

    #placeInStagingElementOfParentId(parentId: string | undefined, wrappedContent: HTMLElement)
    {
        if(parentId)
        {
            let parent = document.getElementById(parentId);
            if(parent)
            {
                let stagingCandidates = parent.getElementsByClassName(CLASS_STAGED_TABS) as HTMLCollectionOf<HTMLElement>
                if(stagingCandidates.length == 1)
                {
                    let stagingItem = stagingCandidates.item(0);
                    if(stagingItem)
                    {
                        stagingItem.appendChild(wrappedContent);
                    }
                }
            }
        }
    }


}


