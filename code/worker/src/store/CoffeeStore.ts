import { GenericStore } from "./GenericStore";

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
export class CoffeeStore extends GenericStore<Coffee> {
    /**
     * Find all the coffees by a UID.
     * @param uid UID of the card.
     * @returns Array of coffees.
     */
    public findByUID(uid: string): Coffee[] {
        return this.items.filter(coffee => coffee.uid == uid);
    }

    /**
     * Add a new coffee to the collection.
     * @param coffee New coffee.
     */
    public new(coffee: Coffee): void {
        this.items.push(coffee);
    }
}
