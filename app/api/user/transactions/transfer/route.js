import { NextRequest, NextResponse } from 'next/server'
import { v4 } from "uuid";
import { headers } from "next/headers";

export async function POST(request) {
    const req = await request.json()
    const userId = req['userId']
    const amounts = req['amounts']
    const destinationAddress = req['destinationAddress']
    const tokenId = req['tokenId']
    const walletId = req['walletId']
    const feeLevel = req['feeLevel']

    const requestHeaders = new Headers(request.headers);
    const userTokenFromHeader = requestHeaders.get('x-user-token');

    // Get user token and secret key
    const res = await fetch(process.env.CIRCLE_BASE_URL + '/user/transactions/transfer', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
            'Content-Type': 'application/json',
            'X-User-Token': userTokenFromHeader,
        },
        body: JSON.stringify({
            'userId': userId,
            'idempotencyKey': v4(),
            'amounts': amounts,
            'destinationAddress': destinationAddress,
            'tokenId': tokenId,
            'walletId': walletId,
            'feeLevel': feeLevel,
        }),
    });

    console.log({
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
            'Content-Type': 'application/json',
            'X-User-Token': userTokenFromHeader,
        },
        body: JSON.stringify({
            'userId': userId,
            'idempotencyKey': v4(),
            'amounts': amounts,
            'destinationAddress': destinationAddress,
            'tokenId': tokenId,
            'walletId': walletId,
            'feeLevel': feeLevel,
        }),
    });

    const data = await res.json();

    console.log(data);

    if (data['code']) {
        return NextResponse.json(data);
    }

    return NextResponse.json({
        'challengeId': data['data']['challengeId'],
    });
}