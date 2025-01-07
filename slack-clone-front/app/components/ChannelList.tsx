'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

export default function ChannelList({ onSelectChannel }) {
  const [channels, setChannels] = useState([
    { id: 1, name: 'general', isPublic: true },
    { id: 2, name: 'random', isPublic: true },
  ])
  const [newChannelName, setNewChannelName] = useState('')

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      setChannels([...channels, { id: Date.now(), name: newChannelName, isPublic: true }])
      setNewChannelName('')
    }
  }

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Channels</h2>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id} className="mb-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectChannel(channel)}
            >
              # {channel.name}
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex">
        <Input
          placeholder="New channel"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleAddChannel} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

