'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserResource } from '@clerk/types'

export default function UserStatus({ user }: { user: UserResource } ) {
  const [status, setStatus] = useState('Available')
  const [isEditing, setIsEditing] = useState(false)

  const handleStatusChange = () => {
    setIsEditing(false)
  }

  const userNameToDisplay = user.fullName || user.emailAddresses[0].emailAddress

  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="/placeholder-avatar.jpg" alt={userNameToDisplay} />
        <AvatarFallback>{userNameToDisplay[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{userNameToDisplay}</div>
        {isEditing ? (
          <Input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onBlur={handleStatusChange}
            className="mt-1"
          />
        ) : (
          <Button variant="link" onClick={() => setIsEditing(true)} className="h-auto p-0">
            {status}
          </Button>
        )}
      </div>
    </div>
  )
}

