/**
 *  Nothing about this class has to do with slots! Only tabs.
 * 
 *  slotted-wrapper-content could be any target, let the client decide!
 */
 import type { ISidebarModel } from "../models/SidebarModel";

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
    tabbedContentContainerModels: ISidebarModel[] = [];
    buttonStyle: string = "";
    buttonHoverStyle: string = "";
    tabClickedCallback: ((tabContainerName: string, tabName: string) => void) | null = null;
    onChangeCallback:  ((tabContainerName: string) => void) | null = null;

    /** Use this to identify content wrappers. */
    #nextContentUid: number = 0;
    #activeUid: string = "-1";
    #tabOpenedCallbacks: Map<string, ()=>void>;
    
    constructor(tabbedContentContainerModels: ISidebarModel[], buttonStyle?: string, buttonHoverStyle?: string, tabClickedCallback?: (tabContainerName: string, tabName: string) => void, onChangeCallback?: (tabContainerName: string) => void)
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
        if(tabClickedCallback)
        {
            this.tabClickedCallback = tabClickedCallback;
        }
        if(onChangeCallback)
        {
            this.onChangeCallback = onChangeCallback;
        }
        this.#tabOpenedCallbacks = new Map<string, ()=>void>();
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
            let tabName: string = "";
            let uidOfTarget = target.dataset.uid;
            let activeContentWrapper: HTMLElement | null = null;

            let stagingItem = getSingletonElementByClassFrom(parentTabbedFlexItem as HTMLElement, CLASS_STAGED_TABS);
            let activeItem = getSingletonElementByClassFrom(parentTabbedFlexItem as HTMLElement, CLASS_ACTIVE_TAB);
            let buttonContainer = getSingletonElementByClassFrom(parentTabbedFlexItem as HTMLElement, CLASS_TAB_BUTTON_CONTAINER);

            let isAlreadyActive = false;
            if(activeItem)
            {
                let childWrappersActive = activeItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
                if(childWrappersActive.length > 0)
                {
                    activeContentWrapper = childWrappersActive.item(0);
                    if(activeContentWrapper)
                    {
                        if(activeContentWrapper.dataset.uid == uidOfTarget)
                        {
                            //No need to do anything, already active.
                            isAlreadyActive = true;

                            //Need to see if it is being opened!
                            let tabbedContentContainerModel = this.tabbedContentContainerModels.find(m => m.name === activeContentWrapper!.dataset.parentid);
                            if(tabbedContentContainerModel?.isMinimized)
                            {
                                tabName = activeContentWrapper.dataset.name!;
                                this.#triggerTabOpenedCallback(tabName);      
                            }
                        }
                    }
                }
            }

            if(!isAlreadyActive && stagingItem && activeItem)
            {
                let childWrappersStaging = stagingItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
                Array.from(childWrappersStaging).forEach(cws => {
                    if(cws && activeContentWrapper && cws.dataset.uid == uidOfTarget)
                    {
                        //SWAP THIS WITH ACTIVE, PUT ACTIVE BACK INTO STAGING.
                        stagingItem?.appendChild(activeContentWrapper);
                        activeItem?.appendChild(cws);
                        this.#activeUid = cws.dataset.uid!;

                        tabName = cws.dataset.name!;
                        this.#triggerTabOpenedCallback(tabName);                  
                    }
                })

                this.#setTabButtonActiveClass(buttonContainer);
            }

            //Finally, emit the callback so the client knows the tab was clicked/changed.
            if(this.tabClickedCallback && parentTabbedFlexItem.id && tabName)
            {
                this.tabClickedCallback(parentTabbedFlexItem.id, tabName);
            } 
        }
    }

    registerOnTabOpenedCallback(tabName: string, callback: () => void) 
    {
        this.#tabOpenedCallbacks.set(tabName, callback);
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

    /**
     * 
     * @param tabbedFlexItem - the parent tab container.
     */
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
                    let iconName = cw.dataset.materialsymbol;

                    let tabButton = document.createElement("button");
                    tabButton.style.cssText = this.buttonStyle;
                    tabButton.classList.add("tab-button");
                    tabButton.setAttribute('data-uid', cw.dataset.uid!);
                    tabButton.title = cw.dataset.name ? cw.dataset.name : "";

                    if(iconName)
                    {
                        let buttonIconSpan = document.createElement("span");
                        buttonIconSpan.innerHTML = iconName;
                        buttonIconSpan.classList.add("material-symbols-outlined");
                        buttonIconSpan.setAttribute('data-uid', cw.dataset.uid!);
                        buttonIconSpan.style.cssText = "font-size: xx-large; margin: 5px 3px 5px 3px";
                        tabButton.appendChild(buttonIconSpan)
                    }
                    else
                    {
                        tabButton.innerHTML = cw.dataset.name ? cw.dataset.name : "";
                    }

                    tabButton.onmouseover = () =>
                    {
                        tabButton.style.cssText = this.buttonHoverStyle;
                    }
                    tabButton.onmouseout = () =>
                    {
                        let isActive: boolean = tabButton.classList.contains("active");
                        tabButton.style.cssText = isActive ? this.buttonHoverStyle : this.buttonStyle;
                    }
                     
                    
                    
                    let self: TabbedContentManager = this;
                    tabButton.onclick = (event: Event) => {
                        self.onTabClicked(event);
                    }
                    buttonContainer?.appendChild(tabButton);
                }
            })
        }
    }

    /**
     * #setInitialActiveTab - Sets the first tabbable content child of the staging element to the active element.
     * @param tabbedFlexItem - the parent tab container.
     */
    #setInitialActiveTab(tabbedFlexItem : HTMLElement)
    {
        let stagingItem = getSingletonElementByClassFrom(tabbedFlexItem as HTMLElement, CLASS_STAGED_TABS);
        let activeItem = getSingletonElementByClassFrom(tabbedFlexItem as HTMLElement, CLASS_ACTIVE_TAB);
        let buttonContainer = getSingletonElementByClassFrom(tabbedFlexItem as HTMLElement, CLASS_TAB_BUTTON_CONTAINER);

        if(stagingItem && activeItem)
        {
            let childWrappers = stagingItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
            if(childWrappers.length > 0)
            {
                //Set the first child in the list to the active tab.
                let childWrapperToAdd = childWrappers.item(0);
                if(childWrapperToAdd)
                {
                    activeItem.appendChild(childWrapperToAdd);
                    this.#activeUid = childWrapperToAdd.dataset.uid!;
                }
            }
        }

        this.#setTabButtonActiveClass(buttonContainer)
    }

    /**
     * setTabButtonActiveClass - add or remove the "active" class to/from tab buttons
     * depending on the active UID. 
     * @param buttonContainer 
     */
    #setTabButtonActiveClass(buttonContainer: HTMLElement | null)
    {
        if(buttonContainer)
        {
            let tabButtons = buttonContainer.getElementsByClassName("tab-button") as HTMLCollectionOf<HTMLElement>;
            Array.from(tabButtons).forEach(btn => {
                if(btn.dataset.uid === this.#activeUid)
                {
                    btn.classList.add("active");
                    btn.style.cssText = this.buttonHoverStyle;
                }
                else
                {
                    btn.classList.remove("active");
                    btn.style.cssText = this.buttonStyle;
                }
            });
        }
    }

    #triggerTabOpenedCallback(tabName: string)
    {
        if(this.#tabOpenedCallbacks.has(tabName))
        {
            //Wait for a repaint before making the callback.
            let tabOpenedCallback: ()=>void = this.#tabOpenedCallbacks.get(tabName)!;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    tabOpenedCallback();
                });
            });
        }    
    }


}


