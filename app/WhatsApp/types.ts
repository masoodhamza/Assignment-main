export interface Chat {
  id: string;
  name: string;
  phone: string;
  unreadCount: number;
  status: 'online' | 'offline' | 'typing';
  lastMessage: Message;
  isGroup?: boolean;
  groupAdmin?: string;
  participants?: string[];
  avatar?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'contact' | 'bot';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: Message;
  media?: MediaContent;
  reactions?: string[];
  seenBy?: string[];
}

export interface MediaContent {
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  isUploading?: boolean;
  uploadProgress?: number;
  onRemove?: () => void;
}

export interface ScheduledMessage {
  id: string;
  chatId: string;
  content: string;
  scheduledFor: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'sent' | 'failed';
}

export interface AutoReplyRule {
  id: string;
  pattern: string;
  response: string;
  isEnabled: boolean;
  schedule: 'always' | 'outside-hours' | 'custom';
  customSchedule?: {
    days: number[];
    startTime: string;
    endTime: string;
  };
}

export interface ChatBotConfig {
  isEnabled: boolean;
  personality: 'professional' | 'friendly' | 'casual';
  contextLength: number;
  triggers: string[];
  defaultResponses: string[];
}

export interface Account {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  avatar?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

export interface VoiceMessage extends MediaContent {
  duration: number;
  waveform?: number[];
}

export interface ChatSettings {
  notifications: boolean;
  muteUntil?: string;
  autoReply?: AutoReplyRule;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}