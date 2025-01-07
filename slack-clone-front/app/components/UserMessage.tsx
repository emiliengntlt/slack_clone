import { Message } from '../api/generated'

interface UserMessageProps {
  message: Message
}

export function UserMessage({ message }: UserMessageProps) {
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
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-gray-700 mt-1">{message.content}</p>
      </div>
    </div>
  )
} 