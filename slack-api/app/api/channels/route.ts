import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { channels } from '@/src/db/schema';

/**
 * @swagger
 * components:
 *   schemas:
 *     Channel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
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
 * /api/channels:
 *   get:
 *     summary: Get all channels
 *     responses:
 *       200:
 *         description: List of all channels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Channel'
 *       500:
 *         description: Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const dynamic = 'force-dynamic';

// Add cors headers to the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Be more restrictive in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const selectedChannels = await db.select().from(channels);
    return NextResponse.json(selectedChannels, { headers: corsHeaders });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Channel name is required and must be a string' },
        { status: 400, headers: corsHeaders }
      );
    }

    const newChannel = await db.insert(channels)
      .values({
        name: body.name,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newChannel[0], { 
      status: 201, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500, headers: corsHeaders }
    );
  }
}
