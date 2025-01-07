import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/src/db';
import { messages } from '@/src/db/schema';
// Disable static generation for this route since it requires dynamic DB access
export const dynamic = 'force-dynamic';

// Add cors headers to the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Be more restrictive in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize Clerk with your secret key
// const clerk = clerkClient();


/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         channelId:
 *           type: integer
 *         userId:
 *           type: string
 *         username:
 *           type: string
 *         userAvatar:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       400:
 *         description: Channel ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' }, 
        { status: 400, headers: corsHeaders }
      );
    }

    const selectedMessages = await db
      .select({
        id: messages.id,
        content: messages.content,
        channelId: messages.channelId,
        userId: messages.userId,
        username: messages.username,
        userAvatar: messages.userAvatar,
        timestamp: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.channelId, parseInt(channelId)));

    return NextResponse.json(selectedMessages, { headers: corsHeaders });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500, headers: corsHeaders }
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
 *               - username
 *             properties:
 *               channelId:
 *                 type: integer
 *               userId:
 *                 type: string
 *               text:
 *                 type: string
 *               username:
 *                 type: string
 *               userAvatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId, userId, text, username, userAvatar } = body;

    if (!channelId || !userId || !text || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400, headers: corsHeaders }
      );
    }

    const newMessage = {
      content: text,
      channelId,
      userId,
      username,
      userAvatar,
      timestamp: new Date().toISOString(),
    };

    const insertedMessage = await db.insert(messages).values(newMessage).returning();
    return NextResponse.json(insertedMessage[0], { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500, headers: corsHeaders }
    );
  }
}
