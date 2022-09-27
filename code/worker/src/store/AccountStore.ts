import { GenericItem, GenericStore } from "./GenericStore";

export interface Account extends GenericItem {
    firstName: string;
    lastName: string;
    email: string;

    // A pin code.
    password: string;
    
    cards: string[];
    balance: number;
}

export class AccountStore extends GenericStore<Account> {
    protected STORE_KEY: string = 'accounts';

    /**
     * Find one account by email.
     * @param email Email address.
     * @returns Account or undefined if the account could not be found.
     */
    public findOneByEmail(email: string): Account | undefined {
        return this.items.find(account => account.email.toLowerCase() == email.toLowerCase());
    }
}
