import { writable } from 'svelte/store';

export const register = writable({
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	cards: [],
	balance: 0
});
