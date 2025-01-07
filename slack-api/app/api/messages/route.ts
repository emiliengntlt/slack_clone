import { NextResponse } from 'next/server';
import { messages } from '../../lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (!channelId) {
    return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
  }

  const channelMessages = messages.filter(message => message.channelId === channelId);
  return NextResponse.json(channelMessages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { channelId, userId, text } = body;

  if (!channelId || !userId || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newMessage = {
    id: `M${messages.length + 1}`.padStart(4, '0'),
    channelId,
    userId,
    text,
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);
  return NextResponse.json(newMessage, { status: 201 });
}

