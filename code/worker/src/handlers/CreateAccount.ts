import { Env, IRequest } from "..";
import { v4 as uuidv4 } from "uuid";
import { Account, AccountStore } from "../store/AccountStore";

const CreateAccount = async (
    request: IRequest,
    env: Env,
    ctx: ExecutionContext
) => {
    // Generic set of headers.
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // Check if the API key has been set, if not, throw a server error at the client.
    if (!env.API_KEY) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), { headers, status: 500 })
    }

    // Check if the API key in the request header matches the one in the KV store.
    if (request.headers.get('X-API-Key') != env.API_KEY) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    // Create a coffee store and load the coffees from the KV store.
    const accountStore = new AccountStore(env);
    await accountStore.load();

    // Turn the request body into a coffee.
    const account = await request.json<Account>();

    // Create a new UUID.
    account.uuid = uuidv4();

    // Add the account to the accountStore.
    accountStore.add(account);

    // Save the list of coffees back to the KV store.
    await accountStore.save();

    return new Response(JSON.stringify({ message: 'Created' }), { headers, status: 201 });
}

export default CreateAccount;
