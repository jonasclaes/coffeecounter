import { Env, IRequest } from "..";
import { CoffeeStore } from "../store/CoffeeStore";

const CoffeeCount = async (
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

    // Create a coffee store and load the coffees from the KV store.
    const coffeeStore = new CoffeeStore(env);
    await coffeeStore.load();

    // Return a count of coffees.
    const body = JSON.stringify({
        amountOfCoffees: coffeeStore.count()
    });

    return new Response(body, { headers });
}

export default CoffeeCount;
