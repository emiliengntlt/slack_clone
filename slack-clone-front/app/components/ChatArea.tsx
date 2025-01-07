'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, Send } from 'lucide-react'
import { DefaultService } from '../api/generated/services/DefaultService'
import { Message, Reaction } from '../api/generated'
import { UserMessage } from './UserMessage'
import pusherClient from '../lib/pusher'

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

    // Subscribe to Pusher channel
    if (channel?.id) {
      const channelName = `channel-${channel.id}`
      pusherClient.subscribe(channelName)
      
      pusherClient.bind('new-message', (message: Message) => {
        setMessages((prev) => [...prev, message])
      })

      pusherClient.bind('new-reaction', (reaction: Reaction) => {
        setMessages((prev) => prev.map(message => {
          if (message.id === reaction.messageId) {
            return {
              ...message,
              reactions: [...(message.reactions || []), reaction]
            }
          }
          return message
        }))
      })
    }

    // Cleanup function
    return () => {
      if (channel?.id) {
        const channelName = `channel-${channel.id}`
        pusherClient.unsubscribe(channelName)
        pusherClient.unbind('new-message')
        pusherClient.unbind('new-reaction')
      }
    }
  }, [channel])

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await DefaultService.postApiMessages({
          channelId: channel.id,
          userId: user.id,
          text: newMessage,
          username: user.fullName || user.username || user.emailAddresses[0].emailAddress,
          userAvatar: user.imageUrl
        })
        // setMessages([...messages, response])
        setNewMessage('')
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-9xl">💨</span>
            <h2 className="text-2xl font-medium text-gray-600">This is the start of your conversation</h2>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <UserMessage key={message.id} message={message} userId={user.id} />
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="mr-2"
          />
          <Button size="icon" variant="ghost" className="mr-2">
            <>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  // Handle file upload here
                  console.log(e.target.files)
                }}
              />
              <label htmlFor="file-upload">
                <Paperclip className="h-4 w-4 cursor-pointer" />
              </label>
            </>
          </Button>
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

