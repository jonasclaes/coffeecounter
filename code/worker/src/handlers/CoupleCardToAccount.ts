import { Env, IRequest } from "..";
import { Account, AccountStore } from "../store/AccountStore";

interface RequestData {
    email: string;
    card: {
        uid: string;
    }
}

const CoupleCardToAccount = async (
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

    // Check if the API key has been set, if not, throw a server error at the client.
    if (!env.API_KEY) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), { headers, status: 500 })
    }

    // Check if the API key in the request header matches the one in the KV store.
    if (request.headers.get('X-API-Key') != env.API_KEY) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    const accountStore = new AccountStore(env);
    await accountStore.load();

    const requestData = await request.json<RequestData>();

    const account = accountStore.findOneByEmail(requestData.email);

    if (!account) {
        return new Response(JSON.stringify({ error: 'Not found' }), { headers, status: 404 })
    }

    // Add the card UID to the account cards.
    account.cards.push(requestData.card.uid);

    accountStore.update(account.uuid, account);
    await accountStore.save();

    return new Response(JSON.stringify({ message: "OK" }), { headers, status: 200 });
}

export default CoupleCardToAccount;
