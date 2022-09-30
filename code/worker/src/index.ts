/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from "itty-router";
import CoffeeCount from './handlers/CoffeeCount';
import CoupleCardToAccount from "./handlers/CoupleCardToAccount";
import CreateAccount from "./handlers/CreateAccount";
import GetAccessToken from "./handlers/GetAccessToken";
import GetAccount from "./handlers/GetAccount";
import NewCoffee from "./handlers/NewCoffee";
import TopUpAccount from "./handlers/TopUpAccount";


export interface Env {
	// Environment variables
	DEVICE_API_KEY: string;
	API_KEY: string;
	JWT_SECRET: string;

	// KV Namespaces
	COFFEES: KVNamespace;
	
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

export type Obj = {
	[propName: string]: string
}

export interface IRequest extends Request {
	method: string
	params?: Obj
	query?: Obj
	url: string
}

// Create a new itty-router instance.
const router = Router<IRequest>();

// Define the routes that itty should know about.
// Provide a fallback route so that a requests always gets a response.
// The following response code is a fun implementation for when a page is not found.
// RFC2324, section 2.3.2 dictates the following HTTP status code: 418 -> I'm a Teapot
// https://www.rfc-editor.org/rfc/rfc2324#section-2.3.2
router
	.get('/api/coffee-count', CoffeeCount)
	.post('/api/coffee-count', NewCoffee)
	.get('/api/account', GetAccount)
	.post('/api/account', CreateAccount)
	.post('/api/account/login', GetAccessToken)
	.post('/api/account/card', CoupleCardToAccount)
	.post('/api/account/top-up', TopUpAccount)
	.options('*', (request: IRequest, env: Env, ctx: ExecutionContext) => new Response("OK", { status: 200, headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "*",
		"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD",
		"Access-Control-Allow-Credentials": "true"
	} }))
	.get('*', (
		request: IRequest,
		env: Env,
		ctx: ExecutionContext
	) => new Response('I\'m a Teapot', { status: 418 }));

export default {
	fetch: router.handle
}
