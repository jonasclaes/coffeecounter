import { Env, IRequest } from "..";
import { Account, AccountStore } from "../store/AccountStore";
import { CoffeeStore } from "../store/CoffeeStore";

const GetAccount = async (
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

    if (!request.params || !request.params.email) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter', parameter: 'email' }), { headers, status: 400 })
    }

    const accountStore = new AccountStore(env);
    const coffeeStore = new CoffeeStore(env);
    
    await Promise.all([accountStore.load(), coffeeStore.load()]);

    const account = accountStore.findOneByEmail(request.params.email);

    if (!account) {
        return new Response(JSON.stringify({ error: 'Not found' }), { headers, status: 404 })
    }

    const { password, ...outAccount } = account;

    let calculatedBalance = 0;

    for (const card of account.cards) {
        const coffees = coffeeStore.findByUID(card);

        let balance = coffees.length * 10;
        calculatedBalance -= balance;
    }

    calculatedBalance += account.balance;

    return new Response(JSON.stringify({ account: outAccount, calculatedBalance }), { headers, status: 200 });
}

export default GetAccount;
