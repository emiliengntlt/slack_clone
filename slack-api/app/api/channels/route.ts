import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { channels } from '@/src/db/schema';

// Disable static generation for this route since it requires dynamic DB access
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const selectedChannels = await db.select().from(channels);
    return NextResponse.json(selectedChannels);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
}
