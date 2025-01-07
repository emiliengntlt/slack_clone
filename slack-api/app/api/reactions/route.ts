import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/src/db';
import { messages, reactions } from '@/src/db/schema';
import { pusherServer } from '../messages/route';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Be more restrictive in production
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Reaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         messageId:
 *           type: integer
 *         emoji:
 *           type: string
 *         userId:
 *           type: string
 *         createdAt:
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
 * /api/reactions:
 *   post:
 *     summary: Add a reaction to a message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *               - userId
 *               - emoji
 *             properties:
 *               messageId:
 *                 type: integer
 *               userId:
 *                 type: string
 *               emoji:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       400:
 *         description: Missing required fields or reaction already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Message not found
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
    const { messageId, userId, emoji } = body;

    if (!messageId || !userId || !emoji) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if message exists
    const messageExists = await db
      .select({ id: messages.id })
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);

    if (!messageExists.length) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if user already reacted with this emoji
    const existingReaction = await db
      .select()
      .from(reactions)
      .where(
        sql`${reactions.messageId} = ${messageId} AND 
            ${reactions.userId} = ${userId} AND 
            ${reactions.emoji} = ${emoji}`
      )
      .limit(1);

    if (existingReaction.length > 0) {
      return NextResponse.json(
        { error: 'Reaction already exists' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create the reaction
    const newReaction = {
      messageId,
      userId,
      emoji,
      createdAt: new Date(),
    };

    const [insertedReaction] = await db
      .insert(reactions)
      .values(newReaction)
      .returning();

    // Get the channel ID for the message
    const [message] = await db
      .select({ channelId: messages.channelId })
      .from(messages)
      .where(eq(messages.id, messageId));

    // Trigger Pusher event for the new reaction
    await pusherServer.trigger(
      `channel-${message.channelId}`,
      'new-reaction',
      insertedReaction
    );

    return NextResponse.json(insertedReaction, {
      status: 201,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500, headers: corsHeaders }
    );
  }
} 