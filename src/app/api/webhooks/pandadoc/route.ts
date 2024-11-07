import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const incomingSignature = req.nextUrl.searchParams.get('signature');
        if (!incomingSignature) {
            return NextResponse.json({ message: 'Signature is missing' }, { status: 400 });
        }
        
        const sharedKey = process.env.PANDADOC_SHARED_WEBHOOK_KEY as string;
        if (!sharedKey) {
            return NextResponse.json({ message: 'Shared key is not set in environment variables' }, { status: 400 });
        }

        // Get the postss raw HTTP Body (UTF8 encoding)
        const body = await req.arrayBuffer();
        const rawBody = Buffer.from(body);

        // Recompute the signature using HMAC with shared webhook key
        const computedSignature = crypto
            .createHmac('sha256', sharedKey as string)
            .update(rawBody)
            .digest('hex');

        // Verify the signature
        if (computedSignature !== incomingSignature) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // TODO: handle the webhook event (use webhook to update your database, etc.)

        return NextResponse.json({ message: 'Webhook received' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
