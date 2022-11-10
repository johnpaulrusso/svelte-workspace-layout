/**
 *  Nothing about this class has to do with slots! Only tabs.
 * 
 *  slotted-wrapper-content could be any target, let the client decide!
 */
export const CLASS_TABBABLE_CONTENT: string = "tabbable-content";
export const CLASS_TABBABLE_CONTENT_CONTAINER: string = "tabbable-content-container";

export const CLASS_STAGED_TABS: string = "staged-tabs";
export const CLASS_ACTIVE_TAB: string = "active-tab";
export const CLASS_TAB_BUTTON_CONTAINER: string = "tab-buttons"

function getSingletonElementByClassFrom(parentElement: HTMLElement, className: string): HTMLElement | null
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
    tabbedContentContainerIds: string[] = [];
    buttonStyle: string = "";
    buttonHoverStyle: string = "";
    tabClickedCallback: ((tabContainerName: string) => void) | null = null;
    
    constructor(tabbedContentContainerIds: string[], buttonStyle?: string, buttonHoverStyle?: string, tabClickedCallback?: (tabContainerName: string) => void)
    {
        this.tabbedContentContainerIds = tabbedContentContainerIds;
        if(buttonStyle)
        {
            this.buttonStyle = buttonStyle;
        }
        if(buttonHoverStyle)
        {
            this.buttonHoverStyle = buttonHoverStyle;
        }
        if(tabClickedCallback)
        {
            this.tabClickedCallback = tabClickedCallback;
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
            let tabbedContentContainerId = this.tabbedContentContainerIds.find(pid => pid === wc.dataset.parentid);
            this.#placeInStagingElementOfParentId(tabbedContentContainerId, wc);
        });

        //For each tab container, make the first staged-tab the active tab.
        let allTabbedFlexItems = document.getElementsByClassName(CLASS_TABBABLE_CONTENT_CONTAINER) as HTMLCollectionOf<HTMLElement>;
        Array.from(allTabbedFlexItems).forEach(tfi => {
            this.#createTabButtonsForAllStagedElements(tfi);
            this.#setInitialActiveTab(tfi);
        })
    }

    onTabClicked(event: Event)
    {
        let target = event.target as HTMLElement;
        let parentTabbedFlexItem = target.closest("." + CLASS_TABBABLE_CONTENT_CONTAINER) as HTMLElement;

        if(parentTabbedFlexItem)
        {
            let nameOfTarget = target.innerHTML;
            let activeContentWrapper: HTMLElement | null = null;

            let stagingItem = getSingletonElementByClassFrom(parentTabbedFlexItem as HTMLElement, CLASS_STAGED_TABS);
            let activeItem = getSingletonElementByClassFrom(parentTabbedFlexItem as HTMLElement, CLASS_ACTIVE_TAB);

            let isAlreadyActive = false;
            if(activeItem)
            {
                let childWrappersActive = activeItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
                if(childWrappersActive.length > 0)
                {
                    activeContentWrapper = childWrappersActive.item(0);
                    if(activeContentWrapper)
                    {
                        if(activeContentWrapper.dataset.name == nameOfTarget)
                        {
                            //No need to do anything, already active.
                            isAlreadyActive = true;
                        }
                    }
                }
            }

            if(!isAlreadyActive && stagingItem && activeItem)
            {
                let childWrappersStaging = stagingItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
                Array.from(childWrappersStaging).forEach(cws => {
                    if(cws && activeContentWrapper && cws.dataset.name == nameOfTarget)
                    {
                        //SWAP THIS WITH ACTIVE, PUT ACTIVE BACK INTO STAGING.
                        stagingItem?.appendChild(activeContentWrapper);
                        activeItem?.appendChild(cws);
                    }
                })
            }

            //Finally, emit the callback so the client knows the tab was clicked/changed.
            if(this.tabClickedCallback && parentTabbedFlexItem.id)
            {
                this.tabClickedCallback(parentTabbedFlexItem.id);
            } 
        }
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

    #createTabButtonsForAllStagedElements(tabbedFlexItem : HTMLElement)
    {
        let stagingItem = getSingletonElementByClassFrom(tabbedFlexItem as HTMLElement, CLASS_STAGED_TABS);
        let buttonContainer = getSingletonElementByClassFrom(tabbedFlexItem as HTMLElement, CLASS_TAB_BUTTON_CONTAINER);
        
        if(stagingItem && buttonContainer)
        {
            let childWrappers = stagingItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
            Array.from(childWrappers).forEach(cw => {
                if(cw)
                {
                    let tabButton = document.createElement("button");
                    tabButton.style.cssText = this.buttonStyle;
                    tabButton.onmouseover = () =>
                    {
                        tabButton.style.cssText = this.buttonHoverStyle;
                    }
                    tabButton.onmouseout = () =>
                    {
                        tabButton.style.cssText = this.buttonStyle;
                    }
                     
                    tabButton.innerHTML = cw.dataset.name ? cw.dataset.name : "";
                    
                    let self: TabbedContentManager = this;
                    tabButton.onclick = (event: Event) => {
                        self.onTabClicked(event);
                    }
                    buttonContainer?.appendChild(tabButton);
                }
            })
        }
    }

    #setInitialActiveTab(tabbedFlexItem : HTMLElement)
    {
        let stagingItem = getSingletonElementByClassFrom(tabbedFlexItem as HTMLElement, CLASS_STAGED_TABS);
        let activeItem = getSingletonElementByClassFrom(tabbedFlexItem as HTMLElement, CLASS_ACTIVE_TAB);

        if(stagingItem && activeItem)
        {
            let childWrappers = stagingItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
            if(childWrappers.length > 0)
            {
                let childWrapperToAdd = childWrappers.item(0);
                if(childWrapperToAdd)
                {
                    activeItem.appendChild(childWrapperToAdd);
                }
            }
        }
    }


}


