import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  avatar?: string;
}

@Component({
  selector: 'app-chat-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.css']
})
export class ChatSupportComponent {
  newMessage = '';
  isChatOpen = signal(false);
  supportAgent = {
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'Online',
    role: 'Support Specialist'
  };

  messages: Message[] = [
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 3600000),
      avatar: this.supportAgent.avatar
    },
    {
      id: 2,
      text: "I'm having trouble with my account settings",
      sender: 'user',
      timestamp: new Date(Date.now() - 3500000)
    },
    {
      id: 3,
      text: "I'd be happy to help with that. Could you tell me more about the issue?",
      sender: 'support',
      timestamp: new Date(Date.now() - 3400000),
      avatar: this.supportAgent.avatar
    },
    {
      id: 4,
      text: "I can't change my profile picture",
      sender: 'user',
      timestamp: new Date(Date.now() - 300000)
    }
  ];

  toggleChat() {
    this.isChatOpen.update(value => !value);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        id: this.messages.length + 1,
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });

      // Simulate support reply after 1-3 seconds
      setTimeout(() => {
        this.messages.push({
          id: this.messages.length + 1,
          text: this.getRandomResponse(),
          sender: 'support',
          timestamp: new Date(),
          avatar: this.supportAgent.avatar
        });
      }, 1000 + Math.random() * 2000);

      this.newMessage = '';
    }
  }

  private getRandomResponse(): string {
    const responses = [
      "I understand. Let me check that for you.",
      "Thanks for sharing that information.",
      "That's a common issue. Here's what you can do...",
      "I'll need to escalate this to our technical team.",
      "Have you tried refreshing the page?",
      "Let me guide you through the steps to resolve this."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}