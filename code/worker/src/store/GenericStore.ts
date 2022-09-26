import { Env } from "..";

export interface GenericItem {
    uuid: string;
}

/**
 * A generic store to persist items.
 */
export abstract class GenericStore<T extends GenericItem> {
    protected STORE_KEY: string = 'undefined';
    protected env: Env;
    protected items: T[] = [];

    /**
     * Create a new generic store.
     */
    constructor(env: Env) {
        this.env = env;
    }

    /**
     * Load the items from the KV store.
     */
    public async load(): Promise<void> {
        const cache = await this.env.COFFEES.get(this.STORE_KEY);

        // If the key was not set in the KV namespace, initialize it with an empty array.
        if (!cache) {
            await this.env.COFFEES.put(this.STORE_KEY, JSON.stringify([]));
            this.items = [];
        } else {
            this.items = JSON.parse(cache);
        }
    }

    /**
     * Save the items to the KV store.
     */
    public async save(): Promise<void> {
        await this.env.COFFEES.put(this.STORE_KEY, JSON.stringify(this.items));
    }

    /**
     * Get all the items.
     * @returns Array of items.
     */
    public all(): T[] {
        return this.items;
    }

    /**
     * Count all the items.
     * @returns Amount of items.
     */
    public count(): number {
        return this.items.length;
    }

    /**
     * Add a generic item to the list.
     * @param item The item to add.
     */
    public add(item: T): void {
        this.items.push(item);
    }

    /**
     * Update a generic item in the list.
     * @param uuid UUID of the item.
     * @param item The item to set.
     */
    public update(uuid: string, newItem: T): void {
        const itemIndex = this.items.findIndex(item => item.uuid == uuid);
        
        if (itemIndex < 0) throw new Error("Item not found");

        this.items[itemIndex] = newItem;
    }

    public delete(uuid: string): void {
        this.items = this.items.filter(item => item.uuid != uuid);
    }
}
