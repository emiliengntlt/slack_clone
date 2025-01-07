'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { DefaultService } from '../api/generated/services/DefaultService'
import { Message } from '../api/generated'

export default function ChatArea({ channel, user }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      if (channel?.id) {
        try {
          const response = await DefaultService.getApiMessages(channel.id.toString())
          setMessages(response)
        } catch (error) {
          console.error('Failed to fetch messages:', error)
        }
      }
    }
    fetchMessages()
  }, [channel])

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await DefaultService.postApiMessages({
          channelId: channel.id,
          userId: user.id,
          text: newMessage
        })
        setMessages([...messages, response])
        setNewMessage('')
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <strong>{message.userId}: </strong>
            {message.content}
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

