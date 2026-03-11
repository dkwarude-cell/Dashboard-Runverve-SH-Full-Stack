import { useState, useCallback, useRef } from 'react';
import { sendAIMessage, AIMessage } from '@/lib/ai';

export interface ChatAttachment {
  name: string;
  type: 'image' | 'file';
  uri: string;
  size?: string;
  mimeType?: string;
}

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
  attachments?: ChatAttachment[];
}

export function useAIChat() {
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messageIdCounter = useRef(0);

  const generateId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}`;
  };

  const sendMessage = useCallback(async (
    userMessage: string,
    context?: string,
    attachments?: ChatAttachment[]
  ) => {
    const userEntry: ChatEntry = {
      id: generateId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      attachments,
    };

    const loadingEntry: ChatEntry = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setChatHistory(prev => [...prev, userEntry, loadingEntry]);
    setIsThinking(true);

    // Build conversation history for API
    const apiMessages: AIMessage[] = chatHistory
      .filter(entry => !entry.isLoading && !entry.error)
      .map(entry => ({
        role: entry.role as 'user' | 'assistant',
        content: entry.content,
      }));
    apiMessages.push({ role: 'user', content: userMessage });

    // Add attachment context if files were attached
    if (attachments?.length) {
      const attachmentInfo = attachments.map(a => 
        `[Attached ${a.type}: ${a.name}${a.size ? ` (${a.size})` : ''}]`
      ).join('\n');
      apiMessages[apiMessages.length - 1].content += `\n\n${attachmentInfo}`;
    }

    const response = await sendAIMessage(apiMessages, context);

    setChatHistory(prev => {
      const updated = prev.filter(entry => entry.id !== loadingEntry.id);
      return [
        ...updated,
        {
          id: loadingEntry.id,
          role: 'assistant' as const,
          content: response.message || response.error || 'Something went wrong.',
          timestamp: new Date(),
          error: response.error,
        },
      ];
    });

    setIsThinking(false);
  }, [chatHistory]);

  const clearChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  return {
    chatHistory,
    isThinking,
    sendMessage,
    clearChat,
  };
}
