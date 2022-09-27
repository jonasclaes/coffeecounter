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

    if (!request.params || !request.params.email) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter', parameter: 'email' }), { headers, status: 400 })
    }

    const accountStore = new AccountStore(env);
    const coffeeStore = new CoffeeStore(env);
    
    await Promise.all([accountStore.load(), coffeeStore.load()]);

    const account = accountStore.findOneByEmail(request.params.email);

    // Check if the API key in the request header matches the one in the KV store.
    if (request.headers.get('Authorization') != account?.password) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

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
