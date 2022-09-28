import { Env, IRequest } from "..";
import { Account, AccountStore } from "../store/AccountStore";
import jwt from '@tsndr/cloudflare-worker-jwt'


interface RequestData {
    email: string;
    password: string;
}


const GetAccessToken = async (
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
    await accountStore.load();

    const requestData = await request.json<RequestData>();

    const account = accountStore.findOneByEmail(requestData.email);

    if (!account) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    // Check if the API key in the request header matches the one in the KV store.
    if (requestData.password != account.password) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    const token = await jwt.sign({
        sub: account.email,
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60)  // 8 hours expiry time
    }, env.JWT_SECRET);

    return new Response(JSON.stringify({ accessToken: token }), { headers, status: 200 });
}

export default GetAccessToken;
