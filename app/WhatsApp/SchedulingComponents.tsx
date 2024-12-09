// src/components/WhatsApp/SchedulingModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem
} from "@nextui-org/react";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
  isOpen,
  onClose,
  chatId
}) => {
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [repeat, setRepeat] = useState("none");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader>Schedule Message</ModalHeader>
        <ModalBody className="gap-4">
          <Textarea
            label="Message"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex gap-4">
            <Input
              type="date"
              label="Date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
            <Input
              type="time"
              label="Time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
          <Select
            label="Repeat"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          >
            <SelectItem key="none" value="none">No repeat</SelectItem>
            <SelectItem key="daily" value="daily">Daily</SelectItem>
            <SelectItem key="weekly" value="weekly">Weekly</SelectItem>
            <SelectItem key="monthly" value="monthly">Monthly</SelectItem>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onPress={onClose}>Cancel</Button>
          <Button color="primary" onPress={() => {
            // Handle scheduling
            onClose();
          }}>Schedule</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// src/components/WhatsApp/ScheduledMessagesList.tsx
export const ScheduledMessagesList: React.FC<{
  messages: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ messages, onEdit, onDelete }) => {
  return (
    <div className="space-y-3 p-4">
      {messages.map((msg) => (
        <div key={msg.id} className="flex justify-between items-center p-3 bg-default-100 rounded-lg">
          <div>
            <p className="font-medium">{msg.content}</p>
            <p className="text-small text-default-500">
              Scheduled for: {new Date(msg.scheduledFor).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="light" onPress={() => onEdit(msg.id)}>Edit</Button>
            <Button size="sm" variant="light" color="danger" onPress={() => onDelete(msg.id)}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
};