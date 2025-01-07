export const users = [
  { id: 'U001', name: 'John Doe', email: 'john@example.com' },
  { id: 'U002', name: 'Jane Smith', email: 'jane@example.com' },
];

export const channels = [
  { id: 'C001', name: 'general', members: ['U001', 'U002'] },
  { id: 'C002', name: 'random', members: ['U001'] },
];

export const messages = [
  { id: 'M001', channelId: 'C001', userId: 'U001', text: 'Hello, world!', timestamp: '2023-05-10T10:00:00Z' },
  { id: 'M002', channelId: 'C001', userId: 'U002', text: 'Hi there!', timestamp: '2023-05-10T10:01:00Z' },
];

