import { useState } from 'react'
import { DefaultService, Message } from '../api/generated'

interface UserMessageProps {
  message: Message
  userId: string
}

export function UserMessage({ message, userId }: UserMessageProps) {
    const reactions = message.reactions
    const reactionCounts = reactions?.reduce((acc, reaction) => {
        const key = reaction.emoji
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const [localReactionCounts, setLocalReactionCounts] = useState<Record<string, number>>(reactionCounts || {})
    const [showEmojis, setShowEmojis] = useState(false)

    const handleAddReaction = async (emoji: string) => {
        try {
            if (!message.id) {
                throw new Error('Message ID is required')
            }
            await DefaultService.postApiReactions({
                messageId: message.id,
                userId: userId,
                emoji: emoji
            })
            setLocalReactionCounts(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }))
        } catch (error) {
            console.error('Failed to add reaction:', error)
        }
    }

  


  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="flex-shrink-0">
        <img 
          src={message.userAvatar || '/placeholder-avatar.jpg'} 
          alt={message.username}
          className="h-8 w-8 rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <span className="font-medium text-gray-900 font-bold">{message.username}</span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-gray-700 mt-1">{message.content}</p>
        {
            <div className="flex items-center space-x-1 mt-1">
                {Object.entries(localReactionCounts || {}).map(([emoji, count]) => (
                    <span key={emoji} className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-500">{emoji} {count}</span>
                ))}
                <div className="relative inline-block">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-500 cursor-pointer hover:bg-gray-200" onClick={() => setShowEmojis(!showEmojis)}>+</span>
                    {showEmojis && (
                    <div className="absolute bottom-8 left-0 bg-white shadow-lg rounded-lg p-2 flex space-x-2">
                        {['👍', '❤️', '😂', '😮', '😢', '🎉'].map(emoji => (
                        <span 
                            key={emoji}
                            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                            onClick={() => {
                            handleAddReaction(emoji);
                            setShowEmojis(false);
                            }}
                        >
                            {emoji}
                        </span>
                        ))}
                    </div>
                    )}
                </div>
            </div>
        }
      </div>
    </div>
  )
} 