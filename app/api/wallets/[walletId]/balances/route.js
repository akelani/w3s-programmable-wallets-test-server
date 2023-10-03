import { NextResponse } from 'next/server'
import { v4 } from "uuid";
import { headers } from "next/headers";

export async function GET(request, params) {
    const requestHeaders = new Headers(request.headers);
    const userTokenFromHeader = requestHeaders.get('x-user-token');
    const { walletId } = params.params

    try {
        console.log("Getting balances...")
        // Get wallet balances
        const res = await fetch(process.env.CIRCLE_BASE_URL + '/wallets/' + walletId + '/balances?includeAll=True', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
                'Content-Type': 'application/json',
                'X-User-Token': userTokenFromHeader,
            },
        });

        const data = await res.json();

        //console.log("%j", data);

        console.log(data['data']['tokenBalances']);
        return NextResponse.json(data['data']['tokenBalances']);
    } catch (e) {
        console.log(e);
        return NextResponse.json(e, { status: 500 });
    }

}