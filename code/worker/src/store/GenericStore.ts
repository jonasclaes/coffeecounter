import { Env } from "..";

/**
 * A generic store to persist items.
 */
export abstract class GenericStore<T> {
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
}
