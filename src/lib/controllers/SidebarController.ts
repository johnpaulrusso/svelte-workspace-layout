export const REZISE_MOUSE_TOLERANCE_PX: number = 5;
export const MIN_SIDEBAR_HEIGHT_PX: number = 20;
export const MIN_SIDEBAR_WIDTH_PX: number = 62;
export const SIDEBAR_AUTO_MINIMIZE_ZONE_PX: number = 50;
const DEFAULT_SIZE_PX: number = 200;

import type { ISidebarModel } from "../models/SidebarModel";
import { SidebarOrientation } from "../models/SidebarModel";
import {getSingletonElementByClassFrom, CLASS_TAB_BUTTON_CONTAINER, CLASS_STAGED_TABS, CLASS_TABBABLE_CONTENT, CLASS_TABBABLE_CONTENT_CONTAINER, CLASS_ACTIVE_TAB} from "./TabbedContentController"
import type {WorkspaceLayoutConfiguration} from "../models/WorkspaceLayoutConfiguration"
import { TabButton } from "../elements/TabButton";
export abstract class SidebarController
{
    model: ISidebarModel;

    //The underlying element is intentionally NOT part of the interface.
    element: HTMLElement | null;

    #tabButtons: Array<TabButton> = [];

    tabClickedCallback: ((tabContainerName: string, tabName: string) => void) | null = null;

    constructor(name: string, size: number, config: WorkspaceLayoutConfiguration, tabClickedCallback?: (tabContainerName: string, tabName: string) => void) {
        this.model = {
            name: name,
            size: size,
            height: "auto",
            width: (size + "px"),
            orientation: SidebarOrientation.VERTICAL,
            gridarea: "leftbar",
            border: "",
            isMouseOverBorder: false,
            isResizing: false,
            isMinimized: false,
            defaultSize: DEFAULT_SIZE_PX,
            selectedTabName: "",
            selectedTabUid: "-1",
            isDisplayed: false,
            config: config,
        }
        this.element = null;

        if(tabClickedCallback)
        {
            this.tabClickedCallback = tabClickedCallback;
        }
    }

    initialize()
    {
        this.#createTabButtonsForAllStagedElements();
        this.#setInitialActiveTab();

        if(!this.model.isMinimized)
        {
            this.#setTabButtonActiveClass();
        }
    }

    setIsResizing()
    {
        if(this.model.isMouseOverBorder && this.model.isDisplayed)
        {
            this.model.isResizing = true;
        }
    }

    clearIsResizing()
    {
        this.model.isResizing = false;
    }

    resize(size: number): boolean
    {
        if(this.model.isResizing && this.model.isDisplayed)
        {
            let minSize = this.getMinSize();

            if(size <= minSize + SIDEBAR_AUTO_MINIMIZE_ZONE_PX)
            {
                this.model.size = minSize;
                this.model.isMinimized = true;
            }
            else
            {
                this.model.size = size;
                this.model.isMinimized = false;
            }
            
            this.resizeCustom();

            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * toggleOpenClose
     * This is never trigger by clicking a tab button, only the open/close button.
     * @returns true if the sidebar was opened.
     */
    toggleOpenClose(tabName?: string) : boolean
    {
        let tabNameToUse = tabName ? tabName : this.model.selectedTabName;
        if(this.model.isMinimized)
        {
            this.open(tabNameToUse);
            return true;
        }
        else
        {
            this.close(tabNameToUse);
            return false;
        }
    }

    open(tabName?: string)
    {
        this.model.size = this.model.defaultSize;
        this.model.isMinimized = false;
        this.resizeCustom();

        if(tabName)
        {
            this.model.selectedTabName = tabName
            this.#dispatchOpenedEvent(tabName)
            this.#updateTabButtonStyle(tabName)
        }
    }

    close(tabName?: string)
    {
        this.model.size = this.getMinSize();
        this.model.isMinimized = true;
        this.resizeCustom();

        this.#clearActiveButton();

        if(tabName)
        {
            this.#dispatchClosedEvent(tabName)
        }
    }

    flash(tabName: string)
    {
        Array.from(this.#tabButtons).forEach(tabButton => {
            if(tabButton.buttonElement.title === tabName)
            {
                tabButton.forceFlash();
            }
        });
    }

    /** When a tab button is clicked, this is the first code block to get executed! */
    onTabClicked(event: Event)
    {
        let target = event.target as HTMLElement;
        let parentTabbedFlexItem = target.closest("." + CLASS_TABBABLE_CONTENT_CONTAINER) as HTMLElement;

        if(parentTabbedFlexItem)
        {
            let uidOfTarget = target.dataset.uid;
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
                        if(activeContentWrapper.dataset.uid == uidOfTarget)
                        {
                            //No need to do anything, already active.
                            isAlreadyActive = true;

                            //Need to see if it is being opened!
                            if(this.model.isMinimized)
                            {
                                this.model.selectedTabName = activeContentWrapper.dataset.name!;
                                this.model.selectedTabUid = activeContentWrapper.dataset.uid!;
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
                        this.#dispatchClosedEvent(this.model.selectedTabName);

                        //SWAP THIS WITH ACTIVE, PUT ACTIVE BACK INTO STAGING.
                        stagingItem?.appendChild(activeContentWrapper);
                        activeItem?.appendChild(cws);
                        this.model.selectedTabUid = cws.dataset.uid!;
                        this.model.selectedTabName = cws.dataset.name!;         
                    }
                })

                //This needs be here so that changing open tabs triggers the opened event for the underlying tabbed content.
                if(!this.model.isMinimized)
                {
                    this.#dispatchOpenedEvent(this.model.selectedTabName);
                }

                //This only needs to occur when the tab changes!
                this.#forceInactiveTabButtonsToIdle();
            }

            //Finally, emit the callback so the client knows the tab was clicked/changed.
            if(this.tabClickedCallback && parentTabbedFlexItem.id && this.model.selectedTabName)
            {
                this.tabClickedCallback(parentTabbedFlexItem.id, this.model.selectedTabName);
            }
        }
    }

    /**
     * MOVE TO SIDEBAR MANAGER!!!!
     * @param tabbedFlexItem - the parent tab container.
     */
    #createTabButtonsForAllStagedElements()
    {

        let stagingItem = getSingletonElementByClassFrom(this.element as HTMLElement, CLASS_STAGED_TABS);
        let buttonContainer = getSingletonElementByClassFrom(this.element  as HTMLElement, CLASS_TAB_BUTTON_CONTAINER);

        if(stagingItem && buttonContainer)
        {
            let childWrappers = stagingItem.getElementsByClassName(CLASS_TABBABLE_CONTENT) as HTMLCollectionOf<HTMLElement>;
            Array.from(childWrappers).forEach(cw => {
                if(cw)
                {
                    let self: SidebarController = this;
                    let iconName = cw.dataset.materialsymbol;
                    let tabButton = new TabButton(this.model.name, cw.dataset.uid!, cw.dataset.name ? cw.dataset.name : "", iconName, 
                                                           this.model.config.tabButtonStyle, 
                                                           this.model.config.tabButtonStyleHover, 
                                                           this.model.config.tabButtonStyleActive, 
                                                           this.model.config.tabButtonStyle + "animation: glowing 2s infinite ease-in-out;",
                                                           (event: Event) => {
                                                                self.onTabClicked(event);
                                                           });

                    buttonContainer?.appendChild(tabButton.buttonElement);
                    this.#tabButtons.push(tabButton);
                }
            })
        }
    }

    /**
     * MOVE TO SIDEBAR MANAGER!!!!
     * #setInitialActiveTab - Sets the first tabbable content child of the staging element to the active element.
     * @param tabbedFlexItem - the parent tab container.
     */
    #setInitialActiveTab()
    {
        let stagingItem = getSingletonElementByClassFrom(this.element as HTMLElement, CLASS_STAGED_TABS);
        let activeItem = getSingletonElementByClassFrom(this.element as HTMLElement, CLASS_ACTIVE_TAB);

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
                    this.model.selectedTabUid = childWrapperToAdd.dataset.uid!;
                    this.model.selectedTabName = childWrapperToAdd.dataset.name!;
                }
            }
        }
    }

    /**
     * MOVE TO SIDEBAR MANAGER!!!!
     * setTabButtonActiveClass - add or remove the "active" class to/from tab buttons
     * depending on the active UID. 
     * @param buttonContainer 
     */
    #setTabButtonActiveClass()
    {
        Array.from(this.#tabButtons).forEach(tabButton => {
            if(tabButton.buttonElement.dataset.uid === this.model.selectedTabUid)
            {
                tabButton.forceActive();
            }
            else
            {
                tabButton.forceIdle();
            }
        });
    }

    #forceInactiveTabButtonsToIdle()
    {
        Array.from(this.#tabButtons).forEach(tabButton => {
            if(tabButton.buttonElement.dataset.uid !== this.model.selectedTabUid)
            {
                tabButton.forceIdle();
            }
        });
    }

    #clearActiveButton()
    {
        Array.from(this.#tabButtons).forEach(tabButton => {
            tabButton.forceIdle();
        });
    }

    #dispatchOpenedEvent(tabName: string)
    {
        let tabElement = document.getElementById("tabbable-content-" + tabName);
        if(tabElement)
        {
            tabElement.dispatchEvent(new Event("opened"));
        }
    }

    #dispatchClosedEvent(tabName: string)
    {
        let tabElement = document.getElementById("tabbable-content-" + tabName);
        if(tabElement)
        {
            tabElement.dispatchEvent(new Event("closed"));
        }
    }


    #updateTabButtonStyle(tabName: string)
    {
        Array.from(this.#tabButtons).forEach(tabButton => {
            if(tabButton.buttonElement.title === tabName)
            {
                tabButton.forceActive();
            }
            else
            {
                tabButton.forceIdle();
            }
        });
    }

    abstract updateIsMouseOverBorder(mouseX: number, mouseY: number, borderWidth: number): void
    abstract resizeCustom(): void
    abstract getMinSize(): number
}