import { Env } from "..";

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
export class TabStore {
    env: Env;
    tabs: Tab[] = [];

    /**
     * Create a new tab store.
     */
    constructor(env: Env) {
        this.env = env;
    }

    /**
     * Load the tabs from the KV store.
     */
    public async load(): Promise<void> {
        const cache = await this.env.COFFEES.get('tabs');

        // If the key was not set in the KV namespace, initialize it with an empty array.
        if (!cache) {
            await this.env.COFFEES.put('tabs', JSON.stringify([]));
            this.tabs = [];
        } else {
            this.tabs = JSON.parse(cache);
        }
    }

    /**
     * Save the tabs to the KV store.
     */
    public async save(): Promise<void> {
        await this.env.COFFEES.put('tabs', JSON.stringify(this.tabs));
    }

    /**
     * Get all the tabs.
     * @returns Array of tabs.
     */
    public all(): Tab[] {
        return this.tabs;
    }

    /**
     * Count all the tabs.
     * @returns Amount of tabs.
     */
    public count(): number {
        return this.all().length;
    }

    /**
     * Find all the tabs by a UID.
     * @param uid UID of the card.
     * @returns Array of tabs.
     */
    public findByUID(uid: string): Tab[] {
        return this.tabs.filter(tab => tab.uid == uid);
    }

    /**
     * Find a tab by a UID.
     * @param uid UID of the card.
     * @returns A tab or null if the tab could not be found.
     */
    public getByUID(uid: string): Tab | null {
        return this.tabs.find(tab => tab.uid == uid) || null;
    }

    /**
     * Set a tab.
     * @param index Tab index.
     * @param tab Tab to save.
     */
    public setTab(index: number, tab: Tab) {
        this.tabs[index] = tab;
    }

    /**
     * Add a new tab to the collection.
     * @param tab New tab.
     */
    public new(tab: Tab): void {
        this.tabs.push(tab);
    }
}
