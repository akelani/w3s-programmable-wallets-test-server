import { NextRequest, NextResponse } from 'next/server'

export async function POST(request) {
    const req = await request.json()
    const userId = req['userId']

    console.log(userId)

    // Get user token and secret key
    const res = await fetch(process.env.CIRCLE_BASE_URL+'/users/token', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'userId': userId,
        }),
    });
    const data = await res.json();

    console.log(data);

    if(data['code']) {
        return NextResponse.json(data);
    }

    return NextResponse.json({ 
        'userId': userId,
        'userToken': data['data']['userToken'],
        'encryptionKey': data['data']['encryptionKey'],
        'challengeId': ""
     });
}