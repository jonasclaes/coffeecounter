import { Env, IRequest } from "..";
import { CoffeeStore } from "../store/CoffeeStore";
import { TabStore } from "../store/TabStore";

const TopUpTab = async (
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
    if ( ! env.API_KEY ) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), { headers, status: 500 })
    }

    // Check if the API key in the request header matches the one in the KV store.
    if ( request.headers.get('X-API-Key') != env.API_KEY ) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    // Create a coffee store and load the coffees from the KV store.
    const coffeeStore = new CoffeeStore(env);

    // Create a new tab store and load the tabs from the KV store.
    const tabStore = new TabStore(env);
    
    await Promise.all([coffeeStore.load(), tabStore.load()]);

    // Check if the request URL parameter `uid` has been set.
    if (!request.params || !request.params.uid) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter', parameter: 'uid' }), { headers, status: 400 });
    }

    const topUp = await request.json<{ amount: number }>();

    // Get the tab from the tab store.
    let tab = tabStore.getByUID(request.params.uid);

    if ( tab ) {
        const tabIndex = tabStore.all().indexOf(tab);

        // Top up the tab balance.
        tab.balance += topUp.amount;
        
        tabStore.setTab(tabIndex, tab);
    } else {
        tab = { uid: request.params.uid, balance: topUp.amount };
        tabStore.new(tab);
    }

    await tabStore.save();

    // Filter all the coffees by UID.
    const filteredCoffees = coffeeStore.findByUID(request.params.uid);

    // Each coffee costs 10 cents, so multiply this by the amount of coffees consumed.
    // We multiple by a negative number as this is an outstanding balance.
    let balanceCalculation = filteredCoffees.length * - 10;

    // Add the tab balance to the equation.
    balanceCalculation += tab.balance;

    // Return a count of coffees.
    const body = JSON.stringify({
        coffees: filteredCoffees,
        balance: tab.balance,
        totalBalance: balanceCalculation
    });

    return new Response(body, { headers });
}

export default TopUpTab;
