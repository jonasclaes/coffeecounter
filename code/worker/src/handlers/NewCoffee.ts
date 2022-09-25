import { Env, IRequest } from "..";
import { COFFEE_UID_LENGTH } from "../const";
import { Coffee, CoffeeStore } from "../store/CoffeeStore";

const NewCoffee = async (
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
    if ( ! env.DEVICE_API_KEY ) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), { headers, status: 500 })
    }

    // Check if the API key in the request header matches the one in the KV store.
    if ( request.headers.get('X-API-Key') != env.DEVICE_API_KEY ) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers, status: 401 })
    }

    // Create a coffee store and load the coffees from the KV store.
    const coffeeStore = new CoffeeStore(env);
    await coffeeStore.load();

    // Turn the request body into a coffee.
    const coffee = await request.json<Coffee>();

    // Check if the uid has been set on the coffee.
    if ( ! coffee.uid ) {
        return new Response(JSON.stringify({ error: 'Missing parameter', parameter: 'uid' }), { headers, status: 400 })
    }

    // Check if the uid length is correct on the coffee.
    if ( coffee.uid.length != COFFEE_UID_LENGTH ) {
        return new Response(JSON.stringify({ error: 'Invalid parameter length', parameter: 'uid', length: coffee.uid.length, required: COFFEE_UID_LENGTH }), { headers, status: 400 })
    }

    // Set the timestamp of the coffee.
    coffee.timestamp = Date.now();

    // Add it to the list of coffees.
    coffeeStore.new(coffee);

    // Save the list of coffees back to the KV store.
    await coffeeStore.save();

    // Return an updated count of coffees.
    const body = JSON.stringify({
        amountOfCoffees: coffeeStore.count()
    });
    
    return new Response(body, { headers });
}

export default NewCoffee;
