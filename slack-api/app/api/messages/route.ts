import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/src/db';
import { messages, reactions } from '@/src/db/schema';
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
 *         reactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reaction'
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
 *         description: List of messages with their reactions
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
 *         description: Message created successfully (includes empty reactions array)
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

    // First, get all messages with their reactions
    const results = await db
      .select({
        message: {
          id: messages.id,
          content: messages.content,
          channelId: messages.channelId,
          userId: messages.userId,
          username: messages.username,
          userAvatar: messages.userAvatar,
          timestamp: messages.createdAt,
        },
        reaction: {
          id: reactions.id,
          emoji: reactions.emoji,
          userId: reactions.userId,
          createdAt: reactions.createdAt,
        },
      })
      .from(messages)
      .leftJoin(reactions, eq(messages.id, reactions.messageId))
      .where(eq(messages.channelId, parseInt(channelId)));

    // Group reactions by message
    const messagesMap = new Map();
    
    results.forEach((row) => {
      const { message, reaction } = row;
      
      if (!messagesMap.has(message.id)) {
        messagesMap.set(message.id, {
          ...message,
          reactions: [],
        });
      }
      
      if (reaction?.id) { // Only add reaction if it exists
        messagesMap.get(message.id).reactions.push(reaction);
      }
    });

    const formattedMessages = Array.from(messagesMap.values());

    return NextResponse.json(formattedMessages, { headers: corsHeaders });
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
 *         description: Message created successfully (includes empty reactions array)
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
    // Handle regular message creation
    return await handleMessageCreation(request);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Helper function to handle original message creation logic
async function handleMessageCreation(request: Request) {
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
    createdAt: new Date(),
  };

  const [insertedMessage] = await db.insert(messages).values(newMessage).returning();
  return NextResponse.json(
    { ...insertedMessage, reactions: [] },
    { status: 201, headers: corsHeaders }
  );
}
