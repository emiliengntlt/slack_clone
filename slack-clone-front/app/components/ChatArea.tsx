'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

export default function ChatArea({ channel, user }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // TODO: Fetch messages for the selected channel
    // For now, we'll just set some dummy messages
    setMessages([
      { id: 1, user: 'John', content: 'Hello everyone!' },
      { id: 2, user: 'Jane', content: 'Hi John, how are you?' },
    ])
  }, [channel])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), user: user.email, content: newMessage }])
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <strong>{message.user}: </strong>
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

