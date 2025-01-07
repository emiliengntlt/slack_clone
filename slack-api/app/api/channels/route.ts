import { NextResponse } from 'next/server';
import { channels } from '../../lib/mockData';

export async function GET() {
  return NextResponse.json(channels);
}

