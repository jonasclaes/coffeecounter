import { GenericItem, GenericStore } from "./GenericStore";

/**
 * A coffee interface to save the coffee UID and timestamp.
 */
export interface Coffee extends GenericItem {
    uuid: string;
    uid: string;
    timestamp: number;
}

/**
 * A coffee store to persist coffees.
 */
export class CoffeeStore extends GenericStore<Coffee> {
    protected STORE_KEY: string = 'coffees';

    /**
     * Find all the coffees by a UID.
     * @param uid UID of the card.
     * @returns Array of coffees.
     */
    public findByUID(uid: string): Coffee[] {
        return this.items.filter(coffee => coffee.uid == uid);
    }
}
