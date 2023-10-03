import { NextRequest, NextResponse } from 'next/server'

export async function POST(request) {
    const req = await request.json()
    console.log(req)
    const amounts = req['amounts']
    const destinationAddress = req['destinationAddress']
    const tokenId = req['tokenId']
    const walletId = req['walletId']

    const requestHeaders = new Headers(request.headers);
    const userTokenFromHeader = requestHeaders.get('x-user-token');

    // Get user token and secret key
    const res = await fetch(process.env.CIRCLE_BASE_URL+'/transactions/transfer/estimateFee', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-User-Token': userTokenFromHeader,
        },
        body: JSON.stringify({
            'amounts': amounts,
            'destinationAddress': destinationAddress,
            'tokenId': tokenId,
            'walletId': walletId
        }),
    });
    const data = await res.json();

    console.log("%j", data);

    if(data['code']) {
        return new NextResponse(JSON.stringify(data), { status: 500 });
    }

    return new NextResponse(JSON.stringify(data['data']));
}