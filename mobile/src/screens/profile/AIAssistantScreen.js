import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { sendAIMessage } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    text: "Hi there! I'm Haven AI ✨ Your personal sanctuary assistant.\n\nI can help you with:\n• Product recommendations\n• Delivery & shipping info\n• Refund policies\n• Customization options\n• Café menu questions\n\nHow can I help you today?",
    sender: 'ai',
  },
];

const AIAssistantScreen = () => {
  const { isLoggedIn } = useAuth();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const QUICK_QUESTIONS = [
    'What flowers do you have?',
    'Do you offer delivery?',
    'Can I customize a gift?',
    'What are your café items?',
    'How do I return an item?',
  ];

  const handleSend = async (messageText) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in to chat with Haven AI.',
        [{ text: 'OK' }]
      );
      return;
    }

    const userMsg = { id: Date.now().toString(), text: textToSend, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Add thinking indicator
    const thinkingId = 'thinking-' + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, text: 'Thinking... ✨', sender: 'ai', isThinking: true },
    ]);

    try {
      const response = await sendAIMessage(textToSend, messages.filter((m) => !m.isThinking));
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== thinkingId)
          .concat({ id: Date.now().toString(), text: response, sender: 'ai' })
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== thinkingId)
          .concat({
            id: Date.now().toString(),
            text: 'Sorry, I\'m unavailable right now. Please try again later.',
            sender: 'ai',
          })
      );
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg) => {
    const isAI = msg.sender === 'ai';

    return (
      <View
        key={msg.id}
        style={[styles.messageRow, isAI ? styles.aiRow : styles.userRow]}
      >
        {isAI && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>H</Text>
          </View>
        )}
        <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
          {msg.isThinking ? (
            <View style={styles.thinkingDots}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[styles.dot, { opacity: 0.4 + i * 0.2 }]}
                />
              ))}
            </View>
          ) : (
            <Text style={[styles.bubbleText, isAI ? styles.aiText : styles.userText]}>
              {msg.text}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>H</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Haven AI</Text>
            <Text style={styles.headerStatus}>● Online · Reaina's Sanctuary</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageArea}
        contentContainerStyle={styles.messageContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(renderMessage)}

        {/* Not logged in banner */}
        {!isLoggedIn && (
          <View style={styles.loginBanner}>
            <Text style={styles.loginBannerEmoji}>🌸</Text>
            <Text style={styles.loginBannerTitle}>Join the Sanctuary</Text>
            <Text style={styles.loginBannerText}>
              Please log in to chat with our AI concierge.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      {messages.length <= 2 && isLoggedIn && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
        >
          {QUICK_QUESTIONS.map((q) => (
            <Pressable
              key={q}
              style={({ pressed }) => [styles.quickChip, pressed && styles.quickChipPressed]}
              onPress={() => handleSend(q)}
            >
              <Text style={styles.quickChipText}>{q}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={isLoggedIn ? 'Ask Haven AI anything...' : 'Please login to chat...'}
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={500}
          editable={isLoggedIn}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendBtn,
            (!isLoggedIn || !input.trim() || loading) && styles.sendBtnDisabled,
            pressed && styles.sendBtnPressed,
          ]}
          onPress={() => handleSend()}
          disabled={!isLoggedIn || !input.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendBtnText}>↑</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerAvatarText: { fontWeight: '800', color: COLORS.primary, fontSize: FONT_SIZES.base },
  headerTitle: { fontSize: FONT_SIZES.base, fontWeight: '800', color: '#fff' },
  headerStatus: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)' },
  messageArea: { flex: 1 },
  messageContent: { padding: SPACING.base, gap: SPACING.sm, paddingBottom: SPACING.lg },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm },
  aiRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiAvatarText: { color: '#fff', fontSize: FONT_SIZES.sm, fontWeight: '700', fontStyle: 'italic' },
  bubble: {
    maxWidth: '78%',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  aiBubble: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderTopLeftRadius: RADIUS.xs,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: RADIUS.xs,
  },
  bubbleText: { fontSize: FONT_SIZES.sm, lineHeight: 20 },
  aiText: { color: COLORS.textPrimary },
  userText: { color: '#fff' },
  thinkingDots: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingVertical: SPACING.xs },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  loginBanner: {
    margin: SPACING.base,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  loginBannerEmoji: { fontSize: 36 },
  loginBannerTitle: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary },
  loginBannerText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, textAlign: 'center' },
  quickRow: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, gap: SPACING.sm },
  quickChip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickChipPressed: { backgroundColor: COLORS.background },
  quickChipText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '500' },
  inputArea: {
    flexDirection: 'row',
    padding: SPACING.base,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnPressed: { opacity: 0.85 },
  sendBtnText: { color: '#fff', fontSize: FONT_SIZES.xl, fontWeight: '700', lineHeight: 38 },
});

export default AIAssistantScreen;
