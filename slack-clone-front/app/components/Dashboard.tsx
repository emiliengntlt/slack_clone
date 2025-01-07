'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ChannelList from './ChannelList'
import ChatArea from './ChatArea'

import UserStatus from './UserStatus'
import { UserResource } from '@clerk/types'

export default function Dashboard({ user, onLogout }: { user: UserResource, onLogout: () => void }) {
  const [selectedChannel, setSelectedChannel] = useState(null)

  return (
    <div className="flex h-screen w-full">
      <div className="w-64 bg-gray-100 p-4">
        <UserStatus user={user} />
        <ChannelList onSelectChannel={setSelectedChannel} />
        <Button onClick={onLogout} className="mt-4 w-full">
          Logout
        </Button>
      </div>
      <div className="flex-1">
        {selectedChannel ? (
          <ChatArea channel={selectedChannel} user={user} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <span className="text-9xl">👋</span>
              <h1 className="text-3xl font-bold">Welcome to Gauntlack</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

