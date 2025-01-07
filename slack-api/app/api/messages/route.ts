import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/src/db';
import { messages } from '@/src/db/schema';

// Disable static generation for this route since it requires dynamic DB access
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get messages for a channel
 *     parameters:
 *       - name: channelId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *       400:
 *         description: Channel ID is required
 *       500:
 *         description: Database connection error
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    const selectedMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.channelId, parseInt(channelId)));

    return NextResponse.json(selectedMessages);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channelId
 *               - userId
 *               - text
 *             properties:
 *               channelId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Database connection error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId, userId, text } = body;

    if (!channelId || !userId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = {
      content: text,
      channelId,
      userId, 
      timestamp: new Date().toISOString(),
    };

    const insertedMessage = await db.insert(messages).values(newMessage).returning();
    return NextResponse.json(insertedMessage[0], { status: 201 });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
}
