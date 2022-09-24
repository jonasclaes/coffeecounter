import { Env } from "..";

/**
 * A coffee interface to save the coffee UID and timestamp.
 */
export interface Coffee {
    uid: string;
    timestamp: number;
}

/**
 * A coffee store to persist coffees.
 */
export class CoffeeStore {
    env: Env;
    coffees: Coffee[] = [];

    /**
     * Create a new coffee store.
     */
    constructor(env: Env) {
        this.env = env;
    }

    /**
     * Load the coffees from the KV store.
     */
    public async load(): Promise<void> {
        const cache = await this.env.COFFEES.get('coffees');

        // If the key was not set in the KV namespace, initialize it with an empty array.
        if (!cache) {
            await this.env.COFFEES.put('coffees', JSON.stringify([]));
            this.coffees = [];
        } else {
            this.coffees = JSON.parse(cache);
        }
    }

    /**
     * Save the coffees to the KV store.
     */
    public async save(): Promise<void> {
        await this.env.COFFEES.put('coffees', JSON.stringify(this.coffees));
    }

    /**
     * Get all the coffees.
     * @returns Array of coffees.
     */
    public all(): Coffee[] {
        return this.coffees;
    }

    /**
     * Count all the coffees.
     * @returns Amount of coffees.
     */
    public count(): number {
        return this.all().length;
    }

    /**
     * Find all the coffees by a UID.
     * @param uid UID of the card.
     * @returns Array of coffees.
     */
    public findByUID(uid: string): Coffee[] {
        return this.coffees.filter(coffee => coffee.uid == uid);
    }

    /**
     * Add a new coffee to the collection.
     * @param coffee New coffee.
     */
    public new(coffee: Coffee): void {
        this.coffees.push(coffee);
    }
}
