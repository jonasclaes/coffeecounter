import { Env, IRequest } from "..";
import { Account, AccountStore } from "../store/AccountStore";


interface RequestData {
    amount: number;
}


const TopUpAccount = async (
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
    await accountStore.load()

    const account = accountStore.findOneByEmail(request.params.email);

    // Check if the API key in the request header matches the one in the KV store.
    if (request.headers.get('Authorization') != account?.password) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    if (!account) {
        return new Response(JSON.stringify({ error: 'Not found' }), { headers, status: 404 })
    }

    const requestData = await request.json<RequestData>();

    account.balance += requestData.amount;

    accountStore.update(account.uuid, account);
    await accountStore.save();

    return new Response(JSON.stringify({ message: "OK" }), { headers, status: 200 });
}

export default TopUpAccount;
