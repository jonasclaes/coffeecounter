import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const tokenStore = writable((browser && localStorage.getItem('token')) || '');

tokenStore.subscribe((value) => (browser ? localStorage.setItem('token', value) : null));
