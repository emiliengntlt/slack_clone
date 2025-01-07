'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { DefaultService } from '../api/generated/services/DefaultService'
import { Channel } from '../api/generated'

import { OpenAPI } from '../api/generated/core/OpenAPI';

OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


export default function ChannelList({ onSelectChannel }: { onSelectChannel: (channel: Channel) => void }) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [newChannelName, setNewChannelName] = useState('')

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await DefaultService.getApiChannels()
        setChannels(response)
      } catch (error) {
        console.error('Failed to fetch channels:', error)
      }
    }
    fetchChannels()
  }, [])

  const handleAddChannel = async () => {
    // if (newChannelName.trim()) {
    //   try {
    //     const newChannel = await api.createChannel({
    //       name: newChannelName,
    //       isPublic: true
    //     })
    //     setChannels([...channels, newChannel])
    //     setNewChannelName('')
    //   } catch (error) {
    //     console.error('Failed to create channel:', error)
    //   }
    // }
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

