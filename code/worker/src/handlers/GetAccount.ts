import { Env, IRequest } from "..";
import { Account, AccountStore } from "../store/AccountStore";
import { CoffeeStore } from "../store/CoffeeStore";
import jwt from '@tsndr/cloudflare-worker-jwt'


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

    const accountStore = new AccountStore(env);
    const coffeeStore = new CoffeeStore(env);
    
    await Promise.all([accountStore.load(), coffeeStore.load()]);

    const accessToken = request.headers.get('Authorization');

    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    const tokenIsValid = await jwt.verify(accessToken, env.JWT_SECRET);

    if (!tokenIsValid) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    const decodedToken = jwt.decode(accessToken);

    if (!decodedToken.payload.sub) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    const account = accountStore.findOneByEmail(decodedToken.payload.sub);

    if (!account) {
        return new Response(JSON.stringify({ error: 'Not found' }), { headers, status: 404 })
    }

    const { password, ...outAccount } = account;

    let calculatedBalance = 0;
    let allCoffees = [];

    for (const card of account.cards) {
        const coffees = coffeeStore.findByUID(card);
        allCoffees.push(...coffees);

        let balance = coffees.length * 10;
        calculatedBalance -= balance;
    }

    calculatedBalance += account.balance;

    return new Response(JSON.stringify({ account: outAccount, calculatedBalance, coffees: allCoffees }), { headers, status: 200 });
}

export default GetAccount;
