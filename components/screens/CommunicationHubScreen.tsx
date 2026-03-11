import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Search,
  Phone,
  Video,
  VideoOff,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Mic,
  MicOff,
  Monitor,
  X,
  PhoneOff,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Clock,
  Mail,
  MapPin,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { useResponsive } from '@/hooks/useResponsive';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Contact {
  id: string;
  name: string;
  role: 'client' | 'staff';
  avatar_color: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  condition?: string;
}

interface ChatMessage {
  id: string;
  contactId: string;
  text: string;
  time: string;
  isOwn: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CONTACTS: Contact[] = [
  { id: '1', name: 'Priya Sharma', role: 'client', avatar_color: '#ef4444', online: true, lastMessage: 'Thank you for the session update!', lastTime: 'Now', unread: 3, email: 'priya.sharma@email.com', phone: '+91 98765 43210', location: 'Mumbai, MH', joinDate: 'Jan 2025', condition: 'Knee Rehabilitation' },
  { id: '2', name: 'Dr. Arjun Patel', role: 'staff', avatar_color: '#3b82f6', online: true, lastMessage: 'I\'ll review the case files today', lastTime: '2m', unread: 1, email: 'dr.patel@smartheal.io', phone: '+91 87654 32109', location: 'Ahmedabad, GJ', joinDate: 'Mar 2024' },
  { id: '3', name: 'Ananya Iyer', role: 'client', avatar_color: '#8b5cf6', online: false, lastMessage: 'Can we reschedule my Thursday session?', lastTime: '15m', unread: 0, email: 'ananya.iyer@email.com', phone: '+91 76543 21098', location: 'Chennai, TN', joinDate: 'Jun 2025', condition: 'Shoulder Recovery' },
  { id: '4', name: 'Dr. Vikram Reddy', role: 'staff', avatar_color: '#10b981', online: true, lastMessage: 'The new protocol looks promising', lastTime: '1h', unread: 0, email: 'dr.reddy@smartheal.io', phone: '+91 65432 10987', location: 'Hyderabad, TS', joinDate: 'Feb 2024' },
  { id: '5', name: 'Meera Nair', role: 'client', avatar_color: '#f59e0b', online: true, lastMessage: 'My pain levels have decreased significantly', lastTime: '2h', unread: 2, email: 'meera.nair@email.com', phone: '+91 54321 09876', location: 'Kochi, KL', joinDate: 'Sep 2025', condition: 'Lower Back Therapy' },
  { id: '6', name: 'Rohan Gupta', role: 'client', avatar_color: '#06b6d4', online: false, lastMessage: 'When should I start the new exercises?', lastTime: '3h', unread: 0, email: 'rohan.gupta@email.com', phone: '+91 43210 98765', location: 'Delhi, DL', joinDate: 'Nov 2025', condition: 'Post-Surgery Rehab' },
  { id: '7', name: 'Dr. Kavya Menon', role: 'staff', avatar_color: '#ec4899', online: false, lastMessage: 'Patient charts have been updated', lastTime: '5h', unread: 0, email: 'dr.menon@smartheal.io', phone: '+91 32109 87654', location: 'Bengaluru, KA', joinDate: 'Aug 2024' },
  { id: '8', name: 'Aditya Joshi', role: 'client', avatar_color: '#14b8a6', online: true, lastMessage: 'Thanks for adjusting the device settings', lastTime: '1d', unread: 0, email: 'aditya.joshi@email.com', phone: '+91 21098 76543', location: 'Pune, MH', joinDate: 'Dec 2025', condition: 'Muscle Recovery' },
  { id: '9', name: 'Dr. Deepika Singh', role: 'staff', avatar_color: '#a855f7', online: true, lastMessage: 'Team meeting notes attached', lastTime: '1d', unread: 4, email: 'dr.singh@smartheal.io', phone: '+91 10987 65432', location: 'Jaipur, RJ', joinDate: 'May 2024' },
  { id: '10', name: 'Rajesh Kumar', role: 'client', avatar_color: '#f97316', online: false, lastMessage: 'Feeling much better this week!', lastTime: '2d', unread: 0, email: 'rajesh.kumar@email.com', phone: '+91 99887 76655', location: 'Lucknow, UP', joinDate: 'Feb 2026', condition: 'Chronic Pain Management' },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', contactId: '1', text: 'Namaste Doctor, I wanted to discuss my treatment progress from last week.', time: '10:15 AM', isOwn: false },
    { id: 'm2', contactId: '1', text: 'Of course, Priya! I reviewed your session data and I\'m very pleased with your progress.', time: '10:17 AM', isOwn: true },
    { id: 'm3', contactId: '1', text: 'That\'s great to hear! I\'ve been following the exercise plan you recommended.', time: '10:18 AM', isOwn: false },
    { id: 'm4', contactId: '1', text: 'Your pain levels have decreased by 30% since we started. Let\'s schedule a follow-up session to adjust the treatment intensity.', time: '10:20 AM', isOwn: true },
    { id: 'm5', contactId: '1', text: 'That sounds perfect. Are there any openings this Thursday?', time: '10:22 AM', isOwn: false },
    { id: 'm6', contactId: '1', text: 'Let me check... Yes, I have a 2:00 PM slot available on Thursday. I\'ll also prepare the updated SmartHeal device settings for your next session.', time: '10:24 AM', isOwn: true },
    { id: 'm7', contactId: '1', text: 'Thank you for the session update!', time: '10:25 AM', isOwn: false },
  ],
  '2': [
    { id: 'm8', contactId: '2', text: 'Hey Arjun, did you get a chance to look at the new treatment protocols?', time: '9:00 AM', isOwn: true },
    { id: 'm9', contactId: '2', text: 'Yes, the SmartHeal Pro integration looks excellent. The intensity calibration is much more precise.', time: '9:05 AM', isOwn: false },
    { id: 'm10', contactId: '2', text: 'Great. Can you share your analysis with the team by end of day?', time: '9:07 AM', isOwn: true },
    { id: 'm11', contactId: '2', text: 'I\'ll review the case files today', time: '9:10 AM', isOwn: false },
  ],
  '3': [
    { id: 'm12', contactId: '3', text: 'Good morning Ananya! How is your shoulder feeling this week?', time: '11:00 AM', isOwn: true },
    { id: 'm13', contactId: '3', text: 'It\'s improving steadily. The range of motion exercises are really helping.', time: '11:15 AM', isOwn: false },
    { id: 'm14', contactId: '3', text: 'Wonderful! Keep up the great work. Your next session is Thursday at 3 PM.', time: '11:18 AM', isOwn: true },
    { id: 'm15', contactId: '3', text: 'Can we reschedule my Thursday session?', time: '11:30 AM', isOwn: false },
  ],
  '5': [
    { id: 'm16', contactId: '5', text: 'Good morning Meera! How are you feeling after yesterday\'s session?', time: '8:00 AM', isOwn: true },
    { id: 'm17', contactId: '5', text: 'Much better! The new frequency setting made a huge difference.', time: '8:15 AM', isOwn: false },
    { id: 'm18', contactId: '5', text: 'That\'s wonderful to hear. Your adherence score is at 94% this month.', time: '8:17 AM', isOwn: true },
    { id: 'm19', contactId: '5', text: 'My pain levels have decreased significantly', time: '8:30 AM', isOwn: false },
  ],
  '4': [
    { id: 'm20', contactId: '4', text: 'Vikram, the Phase 2 trial results are in. Significant improvement in recovery times.', time: 'Yesterday', isOwn: true },
    { id: 'm21', contactId: '4', text: 'That\'s excellent news. The SmartHeal protocol adjustments appear to be working.', time: 'Yesterday', isOwn: false },
    { id: 'm22', contactId: '4', text: 'Let\'s present these findings at the next board meeting.', time: 'Yesterday', isOwn: true },
    { id: 'm23', contactId: '4', text: 'The new protocol looks promising', time: 'Yesterday', isOwn: false },
  ],
  '9': [
    { id: 'm24', contactId: '9', text: 'Deepika, the quarterly report is looking great. Client outcomes are up 15%.', time: 'Yesterday', isOwn: true },
    { id: 'm25', contactId: '9', text: 'Thanks! I\'ve also included the device utilization metrics. We should discuss during the next team sync.', time: 'Yesterday', isOwn: false },
    { id: 'm26', contactId: '9', text: 'Agreed. I\'ll add it to the agenda.', time: 'Yesterday', isOwn: true },
    { id: 'm27', contactId: '9', text: 'Team meeting notes attached', time: 'Yesterday', isOwn: false },
  ],
};

const SHARED_FILES = [
  { name: 'Treatment_Protocol_v3.pdf', size: '2.4 MB', date: 'Mar 2, 2026' },
  { name: 'Session_Report_Feb.pdf', size: '1.8 MB', date: 'Feb 28, 2026' },
  { name: 'Device_Settings.json', size: '12 KB', date: 'Feb 25, 2026' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function formatCallTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Filter Tab Type ─────────────────────────────────────────────────────────

type FilterKey = 'all' | 'clients' | 'staff' | 'unread';

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Messages' },
  { key: 'clients', label: 'Clients' },
  { key: 'staff', label: 'Staff' },
  { key: 'unread', label: 'Unread' },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CommunicationHubScreen() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // State
  const [selectedContact, setSelectedContact] = useState<Contact | null>(CONTACTS[0]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES);
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Video call state
  const [inCall, setInCall] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Mobile navigation state
  const [mobileView, setMobileView] = useState<'contacts' | 'chat' | 'info'>('contacts');

  // Refs
  const chatScrollRef = useRef<ScrollView>(null);
  const localVideoRef = useRef<any>(null);
  const remoteVideoRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Filter contacts ──────────────────────────────────────────────────────

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    switch (activeFilter) {
      case 'clients': return c.role === 'client';
      case 'staff': return c.role === 'staff';
      case 'unread': return c.unread > 0;
      default: return true;
    }
  });

  // ─── Select contact ───────────────────────────────────────────────────────

  const selectContact = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    // Mark as read
    setContacts(prev =>
      prev.map(c => c.id === contact.id ? { ...c, unread: 0 } : c)
    );
    // Generate default messages if none exist
    if (!messages[contact.id]) {
      setMessages(prev => ({
        ...prev,
        [contact.id]: [
          { id: `gen-${contact.id}-1`, contactId: contact.id, text: `Hi! This is ${contact.name}.`, time: '9:00 AM', isOwn: false },
          { id: `gen-${contact.id}-2`, contactId: contact.id, text: `Hello ${contact.name.split(' ')[0]}! How can I help you today?`, time: '9:01 AM', isOwn: true },
        ],
      }));
    }
    if (isMobile) setMobileView('chat');
  }, [messages, isMobile]);

  // ─── Send message ─────────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    if (!messageText.trim() || !selectedContact) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      contactId: selectedContact.id,
      text: messageText.trim(),
      time: timeStr,
      isOwn: true,
    };
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));
    // Update contact's last message
    setContacts(prev =>
      prev.map(c => c.id === selectedContact.id
        ? { ...c, lastMessage: messageText.trim(), lastTime: 'Now' }
        : c
      )
    );
    setMessageText('');
    setTimeout(() => chatScrollRef.current?.scrollToEnd?.({ animated: true }), 100);
  }, [messageText, selectedContact]);

  // ─── Auto-scroll on new message ───────────────────────────────────────────

  useEffect(() => {
    setTimeout(() => chatScrollRef.current?.scrollToEnd?.({ animated: true }), 150);
  }, [selectedContact?.id, messages]);

  // ─── Video call controls - WebRTC ─────────────────────────────────────────

  const startCall = useCallback(async () => {
    setCameraError(null);
    if (Platform.OS !== 'web') {
      setCameraError('Video calls are only supported in web browsers.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      // Attach to local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setInCall(true);
      setIsVideoOn(true);
      setIsMuted(false);
      setCallSeconds(0);
      setShowRightPanel(true);
      if (isMobile) setMobileView('info');
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera/microphone permission denied. Please allow access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera or microphone found on this device.');
      } else {
        setCameraError('Unable to access camera. Please try again.');
      }
      // Still start call UI with no video
      setInCall(true);
      setIsVideoOn(false);
      setIsMuted(false);
      setCallSeconds(0);
      setShowRightPanel(true);
      if (isMobile) setMobileView('info');
    }
  }, [isMobile]);

  const endCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setInCall(false);
    setCallSeconds(0);
    setIsMuted(false);
    setIsVideoOn(true);
    setIsScreenSharing(false);
    setCameraError(null);
  }, []);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(prev => !prev);
  }, []);

  const toggleVideoTrack = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOn(prev => !prev);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (Platform.OS !== 'web') return;
    try {
      if (!isScreenSharing) {
        const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => {
          if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          setIsScreenSharing(false);
        };
      } else {
        if (localStreamRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  }, [isScreenSharing]);

  // Call timer
  useEffect(() => {
    if (inCall) {
      callTimerRef.current = setInterval(() => {
        setCallSeconds(s => s + 1);
      }, 1000);
    } else if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [inCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // ─── Render helpers ────────────────────────────────────────────────────────

  const currentMessages = selectedContact ? (messages[selectedContact.id] || []) : [];

  // ─── LEFT SIDEBAR: Contacts ───────────────────────────────────────────────

  const renderContacts = () => (
    <View style={[styles.contactsPanel, isMobile && styles.contactsPanelMobile]}>
      {/* Header */}
      <View style={styles.contactsHeader}>
        <Text style={styles.contactsTitle}>Messages</Text>
        <View style={styles.totalUnread}>
          <Text style={styles.totalUnreadText}>
            {contacts.reduce((sum, c) => sum + c.unread, 0)}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, activeFilter === tab.key && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab.key)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab.key && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contact List */}
      <ScrollView style={styles.contactList} showsVerticalScrollIndicator={false}>
        {filteredContacts.map(contact => {
          const isActive = selectedContact?.id === contact.id;
          return (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactItem, isActive && styles.contactItemActive]}
              onPress={() => selectContact(contact)}
              activeOpacity={0.7}
            >
              <View style={styles.contactAvatarWrap}>
                <Avatar name={contact.name} size={44} color={contact.avatar_color} />
                {contact.online && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.contactInfo}>
                <View style={styles.contactNameRow}>
                  <Text style={[styles.contactName, isActive && { color: '#ef4444' }]} numberOfLines={1}>
                    {contact.name}
                  </Text>
                  <Text style={styles.contactTime}>{contact.lastTime}</Text>
                </View>
                <View style={styles.contactMsgRow}>
                  <Text style={styles.contactPreview} numberOfLines={1}>
                    {contact.lastMessage}
                  </Text>
                  {contact.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{contact.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        {filteredContacts.length === 0 && (
          <View style={styles.emptyFilter}>
            <Text style={styles.emptyFilterText}>No contacts found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  // ─── MIDDLE: Chat ─────────────────────────────────────────────────────────

  const renderChat = () => (
    <View style={[styles.chatPanel, isMobile && styles.chatPanelMobile]}>
      {selectedContact ? (
        <>
          {/* Chat header */}
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderLeft}>
              {isMobile && (
                <TouchableOpacity onPress={() => setMobileView('contacts')} style={styles.backBtn}>
                  <ArrowLeft size={20} color="#030213" />
                </TouchableOpacity>
              )}
              <Avatar name={selectedContact.name} size={38} color={selectedContact.avatar_color} />
              <View>
                <Text style={styles.chatHeaderName}>{selectedContact.name}</Text>
                <View style={styles.chatHeaderStatusRow}>
                  <View style={[styles.statusDotSmall, { backgroundColor: selectedContact.online ? '#22c55e' : '#94a3b8' }]} />
                  <Text style={styles.chatHeaderStatus}>
                    {selectedContact.online ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.chatHeaderActions}>
              <TouchableOpacity style={styles.headerActionBtn} onPress={() => {}}>
                <Phone size={18} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionBtn} onPress={startCall}>
                <Video size={18} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionBtn}
                onPress={() => {
                  if (isMobile) {
                    setMobileView('info');
                  } else {
                    setShowRightPanel(!showRightPanel);
                  }
                }}
              >
                <MoreVertical size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={chatScrollRef}
            style={styles.messagesArea}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Date separator */}
            <View style={styles.dateSeparator}>
              <View style={styles.dateLine} />
              <Text style={styles.dateText}>Today</Text>
              <View style={styles.dateLine} />
            </View>
            {currentMessages.map((msg) => (
              <View
                key={msg.id}
                style={[styles.messageBubbleRow, msg.isOwn ? styles.ownRow : styles.otherRow]}
              >
                {!msg.isOwn && (
                  <Avatar name={selectedContact.name} size={28} color={selectedContact.avatar_color} />
                )}
                <View style={[styles.bubble, msg.isOwn ? styles.ownBubble : styles.otherBubble]}>
                  <Text style={[styles.bubbleText, msg.isOwn && styles.ownBubbleText]}>
                    {msg.text}
                  </Text>
                  <Text style={[styles.bubbleTime, msg.isOwn && styles.ownBubbleTime]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.inputActionBtn}>
              <Paperclip size={18} color="#64748b" />
            </TouchableOpacity>
            <View style={styles.inputFieldWrap}>
              <TextInput
                placeholder="Type a message..."
                value={messageText}
                onChangeText={setMessageText}
                style={styles.inputField}
                placeholderTextColor="#94a3b8"
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.emojiBtn}>
                <Smile size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!messageText.trim()}
            >
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noChatSelected}>
          <View style={styles.noChatIcon}>
            <Send size={32} color="#cbd5e1" />
          </View>
          <Text style={styles.noChatTitle}>Select a conversation</Text>
          <Text style={styles.noChatSub}>Choose a contact from the sidebar to start messaging</Text>
        </View>
      )}
    </View>
  );

  // ─── RIGHT SIDEBAR: Info / Video Call ─────────────────────────────────────

  const renderRightPanel = () => {
    if (!selectedContact) return null;

    if (inCall) {
      // ─── VIDEO CALL VIEW ──────────────────────────────────────────────
      return (
        <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
          {/* Call header */}
          <View style={styles.callHeader}>
            {isMobile && (
              <TouchableOpacity onPress={() => { endCall(); setMobileView('chat'); }} style={styles.backBtn}>
                <ArrowLeft size={20} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.callHeaderTitle}>Video Call</Text>
              <Text style={styles.callHeaderSub}>{selectedContact.name}</Text>
            </View>
            <View style={styles.callTimerBadge}>
              <View style={styles.callTimerDot} />
              <Text style={styles.callTimerText}>{formatCallTime(callSeconds)}</Text>
            </View>
          </View>

          {/* Remote video area (placeholder) */}
          <View style={styles.remoteVideoArea}>
            <View style={styles.remoteVideoPlaceholder}>
              <Avatar name={selectedContact.name} size={80} color={selectedContact.avatar_color} />
              <Text style={styles.remoteVideoName}>{selectedContact.name}</Text>
              <Text style={styles.remoteVideoStatus}>Connected</Text>
            </View>

            {/* Local video preview (PiP) */}
            <View style={styles.localVideoWrap}>
              {Platform.OS === 'web' && isVideoOn ? (
                <video
                  ref={(el: any) => {
                    localVideoRef.current = el;
                    if (el && localStreamRef.current) {
                      el.srcObject = localStreamRef.current;
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 12,
                    transform: 'scaleX(-1)',
                  } as any}
                />
              ) : (
                <View style={styles.localVideoOff}>
                  <Text style={styles.localVideoOffText}>You</Text>
                </View>
              )}
              <View style={styles.localVideoLabel}>
                <Text style={styles.localVideoLabelText}>You</Text>
              </View>
            </View>

            {cameraError && (
              <View style={styles.cameraErrorBanner}>
                <Text style={styles.cameraErrorText}>{cameraError}</Text>
              </View>
            )}
          </View>

          {/* Call Controls */}
          <View style={styles.callControls}>
            <TouchableOpacity
              style={[styles.callControlBtn, isMuted && styles.callControlBtnActive]}
              onPress={toggleMute}
            >
              {isMuted ? <MicOff size={20} color="#fff" /> : <Mic size={20} color="#fff" />}
              <Text style={styles.callControlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.callControlBtn, !isVideoOn && styles.callControlBtnActive]}
              onPress={toggleVideoTrack}
            >
              {isVideoOn ? <Video size={20} color="#fff" /> : <VideoOff size={20} color="#fff" />}
              <Text style={styles.callControlLabel}>{isVideoOn ? 'Camera' : 'Cam Off'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.callControlBtn, isScreenSharing && styles.callControlBtnActive]}
              onPress={toggleScreenShare}
            >
              <Monitor size={20} color="#fff" />
              <Text style={styles.callControlLabel}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endCallBtn} onPress={endCall}>
              <PhoneOff size={22} color="#fff" />
              <Text style={styles.callControlLabel}>End</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // ─── CONTACT INFO VIEW ────────────────────────────────────────────────
    return (
      <View style={[styles.rightPanel, styles.rightPanelInfo, isMobile && styles.rightPanelMobile]}>
        {/* Header */}
        <View style={styles.infoPanelHeader}>
          {isMobile && (
            <TouchableOpacity onPress={() => setMobileView('chat')} style={styles.backBtn}>
              <ArrowLeft size={20} color="#030213" />
            </TouchableOpacity>
          )}
          <Text style={styles.infoPanelTitle}>Contact Info</Text>
          {!isMobile && (
            <TouchableOpacity onPress={() => setShowRightPanel(false)}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.infoContent}>
          {/* Profile card */}
          <View style={styles.profileCard}>
            <Avatar name={selectedContact.name} size={64} color={selectedContact.avatar_color} />
            <Text style={styles.profileName}>{selectedContact.name}</Text>
            <View style={styles.profileRoleBadge}>
              <Text style={styles.profileRoleText}>
                {selectedContact.role === 'staff' ? 'Staff Member' : 'Client'}
              </Text>
            </View>
            <View style={styles.profileStatusRow}>
              <View style={[styles.statusDotSmall, { backgroundColor: selectedContact.online ? '#22c55e' : '#94a3b8' }]} />
              <Text style={styles.profileStatusText}>
                {selectedContact.online ? 'Online now' : 'Offline'}
              </Text>
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionBtn}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#dbeafe' }]}>
                <Phone size={16} color="#3b82f6" />
              </View>
              <Text style={styles.quickActionLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn} onPress={startCall}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#dcfce7' }]}>
                <Video size={16} color="#10b981" />
              </View>
              <Text style={styles.quickActionLabel}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#fef3c7' }]}>
                <Mail size={16} color="#f59e0b" />
              </View>
              <Text style={styles.quickActionLabel}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>Details</Text>
            <View style={styles.infoRow}>
              <Mail size={14} color="#94a3b8" />
              <Text style={styles.infoRowText}>{selectedContact.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={14} color="#94a3b8" />
              <Text style={styles.infoRowText}>{selectedContact.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={14} color="#94a3b8" />
              <Text style={styles.infoRowText}>{selectedContact.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={styles.infoRowText}>Joined {selectedContact.joinDate}</Text>
            </View>
            {selectedContact.condition && (
              <View style={styles.infoRow}>
                <Clock size={14} color="#94a3b8" />
                <Text style={styles.infoRowText}>{selectedContact.condition}</Text>
              </View>
            )}
          </View>

          {/* Shared Files */}
          <View style={styles.infoSection}>
            <View style={styles.infoSectionHeader}>
              <Text style={styles.infoSectionTitle}>Shared Files</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {SHARED_FILES.map((file, i) => (
              <TouchableOpacity key={i} style={styles.fileRow}>
                <View style={styles.fileIcon}>
                  <FileText size={16} color="#3b82f6" />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                  <Text style={styles.fileMeta}>{file.size} · {file.date}</Text>
                </View>
                <ChevronRight size={14} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Shared Media */}
          <View style={styles.infoSection}>
            <View style={styles.infoSectionHeader}>
              <Text style={styles.infoSectionTitle}>Media</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mediaGrid}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <View key={i} style={styles.mediaThumb}>
                  <ImageIcon size={16} color="#94a3b8" />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  // ─── RESPONSIVE LAYOUT ────────────────────────────────────────────────────

  if (isMobile) {
    return (
      <View style={styles.container}>
        {mobileView === 'contacts' && renderContacts()}
        {mobileView === 'chat' && renderChat()}
        {mobileView === 'info' && renderRightPanel()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderContacts()}
      {renderChat()}
      {(showRightPanel || inCall) && renderRightPanel()}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
  },

  // ─── Left: Contacts ─────────────────────────────────────────────────────
  contactsPanel: {
    width: 320,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  contactsPanelMobile: {
    width: '100%' as any,
    flex: 1,
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  contactsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#030213',
    fontFamily: Platform.select({ web: 'Inter, system-ui, sans-serif', default: undefined }),
  },
  totalUnread: {
    backgroundColor: '#ef4444',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  totalUnreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#030213',
    fontFamily: Platform.select({ web: 'Inter, system-ui, sans-serif', default: undefined }),
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  filterTabActive: {
    backgroundColor: '#ef4444',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  contactList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  contactItemActive: {
    backgroundColor: '#fef2f2',
  },
  contactAvatarWrap: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactInfo: {
    flex: 1,
    gap: 3,
  },
  contactNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
    flex: 1,
  },
  contactTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginLeft: 8,
  },
  contactMsgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactPreview: {
    fontSize: 13,
    color: '#94a3b8',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyFilter: {
    padding: 40,
    alignItems: 'center',
  },
  emptyFilterText: {
    fontSize: 14,
    color: '#94a3b8',
  },

  // ─── Middle: Chat ───────────────────────────────────────────────────────
  chatPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  chatPanelMobile: {
    borderRightWidth: 0,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    marginRight: 4,
    padding: 4,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#030213',
  },
  chatHeaderStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  statusDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#64748b',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messagesContent: {
    padding: 20,
    gap: 8,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 8,
    maxWidth: '75%',
  },
  ownRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherRow: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: '#ef4444',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#030213',
  },
  ownBubbleText: {
    color: '#fff',
  },
  bubbleTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'right',
  },
  ownBubbleTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
    backgroundColor: '#fff',
  },
  inputActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFieldWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 42,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#030213',
    fontFamily: Platform.select({ web: 'Inter, system-ui, sans-serif', default: undefined }),
  },
  emojiBtn: {
    marginLeft: 4,
    padding: 4,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  noChatSelected: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
  },
  noChatIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  noChatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#030213',
  },
  noChatSub: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 260,
  },

  // ─── Right: Info / Video Call ───────────────────────────────────────────
  rightPanel: {
    width: 340,
    backgroundColor: '#111827',
  },
  rightPanelInfo: {
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
  },
  rightPanelMobile: {
    width: '100%' as any,
    flex: 1,
  },

  // Video call styles
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  callHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  callHeaderSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },
  callTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  callTimerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  callTimerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
    fontVariant: ['tabular-nums'],
  },
  remoteVideoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  remoteVideoPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  remoteVideoName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  remoteVideoStatus: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  localVideoWrap: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 130,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#1f2937',
  },
  localVideoOff: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
  },
  localVideoOffText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  localVideoLabel: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  localVideoLabelText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  cameraErrorBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  cameraErrorText: {
    fontSize: 12,
    color: '#fca5a5',
    textAlign: 'center',
    lineHeight: 16,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  callControlBtn: {
    alignItems: 'center',
    gap: 4,
    width: 62,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  callControlBtnActive: {
    backgroundColor: 'rgba(239,68,68,0.3)',
  },
  callControlLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  endCallBtn: {
    alignItems: 'center',
    gap: 4,
    width: 62,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ef4444',
  },

  // ─── Contact Info panel ───────────────────────────────────────────────
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#030213',
    flex: 1,
  },
  infoContent: {
    paddingBottom: 24,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#030213',
    marginTop: 12,
  },
  profileRoleBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
  },
  profileRoleText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  profileStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  profileStatusText: {
    fontSize: 13,
    color: '#64748b',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  quickActionBtn: {
    alignItems: 'center',
    gap: 6,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#030213',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoRowText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#030213',
  },
  fileMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
