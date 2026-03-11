import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {
  Send,
  Trash2,
  Sparkles,
  User,
  AlertCircle,
  Lightbulb,
  Paperclip,
  ImageIcon,
  X,
  FileText,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { SmartHealLogo } from '@/components/ui/SmartHealLogo';
import { useAIChat, ChatEntry, ChatAttachment } from '@/hooks/useAIChat';
import { useClients } from '@/hooks/useClients';
import { useSessions } from '@/hooks/useSessions';
import { useDevices } from '@/hooks/useDevices';
import { buildClientContext, buildSessionContext, buildDeviceContext } from '@/lib/ai';
import { useResponsive } from '@/hooks/useResponsive';

const QUICK_PROMPTS = [
  { label: 'Suggest Therapy', prompt: 'Based on the current client data, suggest personalized therapy plans for clients who need attention. Include therapy type, session frequency, device settings, and recovery milestones.' },
  { label: 'Client Summary', prompt: 'Give me a summary of all current clients, their progress, and any concerns.' },
  { label: 'Session Analysis', prompt: 'Analyze recent therapy sessions and identify trends or areas for improvement.' },
  { label: 'Treatment Plan', prompt: 'Suggest optimized treatment plans based on current client progress data, including recommended device configurations and session schedules.' },
  { label: 'Risk Assessment', prompt: 'Identify clients who may be at risk of dropping off or showing declining progress. Suggest interventions.' },
  { label: 'Device Status', prompt: 'Review all connected devices and flag any issues or maintenance needs.' },
  { label: 'Weekly Report', prompt: 'Generate a weekly performance report for the clinic including key metrics.' },
  { label: 'Recovery Milestones', prompt: 'Review client progress and suggest updated recovery milestones. Identify which clients are ready to advance to the next therapy phase.' },
];

function MessageBubble({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === 'user';

  if (entry.isLoading) {
    return (
      <View style={[styles.messageBubble, styles.assistantBubble]}>
        <View style={styles.bubbleHeader}>
          <SmartHealLogo size={22} />
          <Text style={styles.senderName}>SmartHeal AI</Text>
        </View>
        <View style={styles.thinkingContainer}>
          <ActivityIndicator size="small" color="#d4183d" />
          <Text style={styles.thinkingText}>Thinking...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
      <View style={styles.bubbleHeader}>
        {isUser ? (
          <View style={styles.userIcon}>
            <User size={14} color="#fff" />
          </View>
        ) : (
          <View style={[entry.error ? styles.errorIcon : null]}>
            {entry.error ? (
              <View style={styles.errorIconWrap}><AlertCircle size={14} color="#fff" /></View>
            ) : (
              <SmartHealLogo size={22} />
            )}
          </View>
        )}
        <Text style={styles.senderName}>{isUser ? 'You' : 'SmartHeal AI'}</Text>
        <Text style={styles.timestamp}>
          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Text style={[styles.messageText, entry.error ? styles.errorText : null]}>
        {entry.content}
      </Text>
      {entry.attachments && entry.attachments.length > 0 && (
        <View style={styles.attachmentList}>
          {entry.attachments.map((att, i) => (
            <View key={i} style={styles.attachmentChip}>
              {att.type === 'image' ? (
                <ImageIcon size={12} color="#d4183d" />
              ) : (
                <FileText size={12} color="#d4183d" />
              )}
              <Text style={styles.attachmentChipText} numberOfLines={1}>{att.name}</Text>
              {att.size && <Text style={styles.attachmentSize}>{att.size}</Text>}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function AIAssistantScreen() {
  const { chatHistory, isThinking, sendMessage, clearChat } = useAIChat();
  const { clients } = useClients();
  const { sessions } = useSessions();
  const { devices } = useDevices();
  const { isMobile, isDesktop } = useResponsive();
  const [inputText, setInputText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatHistory]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleFilePick = () => {
    if (Platform.OS === 'web') {
      if (!fileInputRef.current) {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.json';
        input.onchange = (e: any) => {
          const files = Array.from(e.target.files || []) as File[];
          const newAttachments: ChatAttachment[] = files.map(f => ({
            name: f.name,
            type: 'file' as const,
            uri: URL.createObjectURL(f),
            size: formatFileSize(f.size),
            mimeType: f.type,
          }));
          setPendingAttachments(prev => [...prev, ...newAttachments]);
          input.value = '';
        };
        fileInputRef.current = input;
      }
      fileInputRef.current.click();
    } else {
      Alert.alert('Attach File', 'File attachment is available on web. For mobile, use the photo option.');
    }
  };

  const handleImagePick = () => {
    if (Platform.OS === 'web') {
      if (!imageInputRef.current) {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        input.onchange = (e: any) => {
          const files = Array.from(e.target.files || []) as File[];
          const newAttachments: ChatAttachment[] = files.map(f => ({
            name: f.name,
            type: 'image' as const,
            uri: URL.createObjectURL(f),
            size: formatFileSize(f.size),
            mimeType: f.type,
          }));
          setPendingAttachments(prev => [...prev, ...newAttachments]);
          input.value = '';
        };
        imageInputRef.current = input;
      }
      imageInputRef.current.click();
    } else {
      Alert.alert('Attach Image', 'Image attachment is available on web. Native image picker coming soon.');
    }
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if ((!inputText.trim() && pendingAttachments.length === 0) || isThinking) return;
    const context = [
      buildClientContext(clients),
      buildSessionContext(sessions),
      buildDeviceContext(devices),
    ].join('\n\n');
    const message = inputText.trim() || (pendingAttachments.length > 0 ? `Attached ${pendingAttachments.length} file(s)` : '');
    sendMessage(message, context, pendingAttachments.length > 0 ? pendingAttachments : undefined);
    setInputText('');
    setPendingAttachments([]);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isThinking) return;
    const context = [
      buildClientContext(clients),
      buildSessionContext(sessions),
      buildDeviceContext(devices),
    ].join('\n\n');
    sendMessage(prompt, context);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Sparkles size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSubtitle}>Powered by Claude AI via OpenRouter</Text>
          </View>
        </View>
        {chatHistory.length > 0 && (
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Trash2 size={16} color="#9ca3af" />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
      >
        {chatHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <SmartHealLogo size={52} />
            </View>
            <Text style={styles.emptyTitle}>SmartHeal AI Assistant</Text>
            <Text style={styles.emptySubtitle}>
              Ask me anything about your clients, therapy sessions, devices, or clinical insights.
              I have access to your dashboard data and can provide real-time analysis.
            </Text>

            {/* Quick Prompts */}
            <View style={styles.quickPromptsContainer}>
              <View style={styles.quickPromptsHeader}>
                <Lightbulb size={16} color="#f59e0b" />
                <Text style={styles.quickPromptsTitle}>Quick Actions</Text>
              </View>
              <View style={[styles.quickPromptsGrid, isDesktop && styles.quickPromptsGridDesktop]}>
                {QUICK_PROMPTS.map((qp, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickPromptButton}
                    onPress={() => handleQuickPrompt(qp.prompt)}
                  >
                    <Text style={styles.quickPromptLabel}>{qp.label}</Text>
                    <Text style={styles.quickPromptText} numberOfLines={2}>
                      {qp.prompt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          chatHistory.map(entry => <MessageBubble key={entry.id} entry={entry} />)
        )}
      </ScrollView>

      {/* Quick Prompts Bar (when chat is active) */}
      {chatHistory.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickBar}
          contentContainerStyle={styles.quickBarContent}
        >
          {QUICK_PROMPTS.map((qp, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickChip}
              onPress={() => handleQuickPrompt(qp.prompt)}
              disabled={isThinking}
            >
              <Text style={styles.quickChipText}>{qp.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Pending Attachments Preview */}
      {pendingAttachments.length > 0 && (
        <View style={styles.pendingAttachments}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pendingAttachmentsContent}>
            {pendingAttachments.map((att, i) => (
              <View key={i} style={styles.pendingChip}>
                {att.type === 'image' ? (
                  <ImageIcon size={12} color="#d4183d" />
                ) : (
                  <FileText size={12} color="#d4183d" />
                )}
                <Text style={styles.pendingChipText} numberOfLines={1}>{att.name}</Text>
                <TouchableOpacity onPress={() => removeAttachment(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X size={12} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleImagePick}
          disabled={isThinking}
        >
          <ImageIcon size={20} color={isThinking ? '#4b5563' : '#9ca3af'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleFilePick}
          disabled={isThinking}
        >
          <Paperclip size={20} color={isThinking ? '#4b5563' : '#9ca3af'} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ask SmartHeal AI..."
          placeholderTextColor="#6b7280"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          multiline
          editable={!isThinking}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() && pendingAttachments.length === 0 || isThinking) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={(!inputText.trim() && pendingAttachments.length === 0) || isThinking}
        >
          {isThinking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030213',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#d4183d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  clearText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(212,24,61,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 22,
    marginBottom: 32,
  },
  quickPromptsContainer: {
    width: '100%',
    maxWidth: 700,
  },
  quickPromptsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  quickPromptsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  quickPromptsGrid: {
    gap: 10,
  },
  quickPromptsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickPromptButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: 200,
  },
  quickPromptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4183d',
    marginBottom: 6,
  },
  quickPromptText: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 18,
  },
  messageBubble: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#d4183d',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  botIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#d4183d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    backgroundColor: '#ef4444',
  },
  errorIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  messageText: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 22,
  },
  errorText: {
    color: '#fca5a5',
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thinkingText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  quickBar: {
    maxHeight: 48,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  quickBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(212,24,61,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,24,61,0.3)',
  },
  quickChipText: {
    fontSize: 12,
    color: '#d4183d',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#d4183d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  attachButton: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  attachmentList: {
    marginTop: 10,
    gap: 6,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212,24,61,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  attachmentChipText: {
    fontSize: 12,
    color: '#e5e7eb',
    maxWidth: 150,
  },
  attachmentSize: {
    fontSize: 10,
    color: '#6b7280',
  },
  pendingAttachments: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pendingAttachmentsContent: {
    gap: 8,
    flexDirection: 'row',
  },
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212,24,61,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,24,61,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pendingChipText: {
    fontSize: 12,
    color: '#e5e7eb',
    maxWidth: 120,
  },
});
