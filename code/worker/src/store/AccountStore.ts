import { Env } from "..";
import { GenericStore } from "./GenericStore";

export interface Account {
    id: string;
    email: string;
    password: string;
}

export class AccountStore extends GenericStore<Account> {
    protected STORE_KEY: string = 'accounts';
}