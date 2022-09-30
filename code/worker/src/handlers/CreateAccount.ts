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
        "Access-Control-Allow-Origin": request.headers.get('origin') || "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD",
        "Access-Control-Allow-Credentials": "true"
    };

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
