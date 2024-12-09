import React, { useRef, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider
} from "@nextui-org/react";
import { 
  Download, 
  Bot, 
  Settings, 
  Phone,
  MoreVertical,
  ThumbsUp,
  Heart,
  Laugh,
  Frown,
  Clock
} from "lucide-react";
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';
import { Chat, Message } from './types';

interface ChatAreaProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage?: (message: string, attachments?: File[]) => void;
  onReaction?: (messageId: string, reaction: string) => void;
  onDownloadMedia?: (messageId: string) => void;
}

const reactions = [
  { emoji: "👍", icon: ThumbsUp },
  { emoji: "❤️", icon: Heart },
  { emoji: "😄", icon: Laugh },
  { emoji: "😢", icon: Frown }
];

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  chat, 
  messages,
  onSendMessage,
  onReaction,
  onDownloadMedia
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <Card className="h-full">
        <CardBody className="h-full items-center justify-center">
          <div className="text-center text-default-500">
            <Phone size={48} className="mx-auto mb-4" />
            <p className="text-xl font-semibold mb-2">Welcome to Chat</p>
            <p className="text-small">Select a conversation to start messaging</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const getMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) {
      return 'Today';
    } else if (isYesterday) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="justify-between border-b">
        <div className="flex gap-3">
          <Avatar
            name={chat.name}
            size="sm"
            className="transition-transform hover:scale-110"
          />
          <div>
            <h4 className="text-small font-semibold leading-none">{chat.name}</h4>
            <p className="text-tiny text-default-500">
              {chat.status === 'typing' 
                ? 'typing...' 
                : chat.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Tooltip content="Media & Files">
            <Button isIconOnly variant="light" size="sm">
              <Download size={20} />
            </Button>
          </Tooltip>
          <Tooltip content="Auto-Reply Settings">
            <Button isIconOnly variant="light" size="sm">
              <Bot size={20} />
            </Button>
          </Tooltip>
          <Tooltip content="Chat Settings">
            <Button isIconOnly variant="light" size="sm">
              <Settings size={20} />
            </Button>
          </Tooltip>
        </div>
      </CardHeader>

      <Divider/>

      <CardBody className="p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const showDateSeparator = index === 0 || 
              getMessageDate(message.timestamp) !== 
              getMessageDate(messages[index - 1].timestamp);

            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && (
                  <div className="flex justify-center">
                    <span className="text-tiny bg-default-100 text-default-600 px-3 py-1 rounded-full">
                      {getMessageDate(message.timestamp)}
                    </span>
                  </div>
                )}
                <MessageBubble
                  message={message}
                  isSequential={
                    index > 0 &&
                    messages[index - 1].sender === message.sender &&
                    !showDateSeparator &&
                    Date.parse(message.timestamp) - Date.parse(messages[index - 1].timestamp) < 60000
                  }
                  // onReaction={onReaction}
                  // onDownloadMedia={onDownloadMedia}
                  // isHovered={hoveredMessage === message.id}
                  // onHover={setHoveredMessage}
                  // reactions={reactions}
                />
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardBody>

      <Divider/>

      <MessageInput 
        chatId={chat.id} 
        onSend={onSendMessage}
      />
    </Card>
  );
};