import { Env, IRequest } from "..";
import { CoffeeStore } from "../store/CoffeeStore";
import { TabStore } from "../store/TabStore";

const GetTab = async (
    request: IRequest,
    env: Env,
    ctx: ExecutionContext
) => {
    // Generic set of headers.
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // Create a coffee store and load the coffees from the KV store.
    const coffeeStore = new CoffeeStore(env);

    // Create a new tab store and load the tabs from the KV store.
    const tabStore = new TabStore(env);
    
    await Promise.all([coffeeStore.load(), tabStore.load()]);

    // Check if the request URL parameter `uid` has been set.
    if (!request.params || !request.params.uid) {
        return new Response(JSON.stringify({ error: 'Missing URL parameter', parameter: 'uid' }), { headers, status: 400 });
    }

    // Get the tab from the tab store.
    const tab = tabStore.getByUID(request.params.uid) || { uid: request.params.uid, balance: 0 };
    
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

export default GetTab;
