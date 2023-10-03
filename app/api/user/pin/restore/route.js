import { NextRequest, NextResponse } from 'next/server'
import { v4 } from "uuid";
import { headers } from "next/headers";

export async function POST(request) {
    const idempotencyKey = v4();
    const requestHeaders = new Headers(request.headers);
    const userTokenFromHeader = requestHeaders.get('x-user-token');

    // Get user token and secret key
    const res = await fetch(process.env.CIRCLE_BASE_URL+'/user/pin/restore', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
            'Content-Type': 'application/json',
            'X-User-Token': userTokenFromHeader,
        },
        body: JSON.stringify({
            'idempotencyKey': idempotencyKey,
            
        }),
    });
    const data = await res.json();

    console.log(data);

    if(data['code']) {
        return NextResponse.json(data);
    }

    return new NextResponse(JSON.stringify(data['data']))
}