import { NextRequest, NextResponse } from 'next/server'

export async function POST(request) {
    const req = await request.json()
    const blockchain = req['blockchain']
    const address = req['address']

    // Get user token and secret key
    const res = await fetch(process.env.CIRCLE_BASE_URL+'/transactions/validateAddress', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'blockchain': blockchain,
            'address': address
        }),
    });
    const data = await res.json();
    //console.log("%j", data);
    console.log(data['data']);

    if(data['code']) {
        return NextResponse.json(data);
    }

    return new NextResponse(JSON.stringify(data['data']));
}