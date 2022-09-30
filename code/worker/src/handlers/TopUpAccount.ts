import { Env, IRequest } from "..";
import { Account, AccountStore } from "../store/AccountStore";
import jwt from '@tsndr/cloudflare-worker-jwt'


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
        "Access-Control-Allow-Origin": request.headers.get('origin') || "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD",
        "Access-Control-Allow-Credentials": "true"
    };

    const accountStore = new AccountStore(env);
    await accountStore.load()

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

    const requestData = await request.json<RequestData>();

    account.balance += requestData.amount;

    accountStore.update(account.uuid, account);
    await accountStore.save();

    return new Response(JSON.stringify({ message: "OK" }), { headers, status: 200 });
}

export default TopUpAccount;
