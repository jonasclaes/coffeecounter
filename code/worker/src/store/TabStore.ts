import { GenericStore } from "./GenericStore";

/**
 * A tab interface to save the tab UID and balance.
 */
export interface Tab {
    uid: string;
    balance: number;
}

/**
 * A tab store to persist tabs.
 */
export class TabStore extends GenericStore<Tab> {
    /**
     * Find all the tabs by a UID.
     * @param uid UID of the card.
     * @returns Array of tabs.
     */
    public findByUID(uid: string): Tab[] {
        return this.items.filter(tab => tab.uid == uid);
    }

    /**
     * Find a tab by a UID.
     * @param uid UID of the card.
     * @returns A tab or null if the tab could not be found.
     */
    public getByUID(uid: string): Tab | null {
        return this.items.find(tab => tab.uid == uid) || null;
    }

    /**
     * Set a tab.
     * @param index Tab index.
     * @param tab Tab to save.
     */
    public setTab(index: number, tab: Tab) {
        this.items[index] = tab;
    }

    /**
     * Add a new tab to the collection.
     * @param tab New tab.
     */
    public new(tab: Tab): void {
        this.items.push(tab);
    }
}
