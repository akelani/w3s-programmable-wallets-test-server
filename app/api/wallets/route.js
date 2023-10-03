import { NextResponse } from 'next/server'
import { v4 } from "uuid";
import { headers } from "next/headers";

export async function GET(request) {
    const requestHeaders = new Headers(request.headers);
    const userTokenFromHeader = requestHeaders.get('x-user-token');

    try {
        console.log("Getting wallets...")
        // Get challenge id
        const res = await fetch(process.env.CIRCLE_BASE_URL + '/wallets', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
                'Content-Type': 'application/json',
                'X-User-Token': userTokenFromHeader,
            },
        });

        const data = await res.json();
        console.log("%j", data);

        if(data['code']) {
            return NextResponse.json(data, { status: 500 })
        }

        return new NextResponse(JSON.stringify(data['data']['wallets']))
    } catch (e) {
        console.log(e);
        return NextResponse.json(e, { status: 500 });
    }

}