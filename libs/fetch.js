export default async function fetcher(...args) {
    const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;
    args[0] = endpoint + "/api" + args[0];

    args[1] = {
        ...args[1],
        headers: {
            Accept: "application/json",
            "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY,
        },
    };

    try {
        const res = await fetch(...args);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}
