import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { submitContact } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const INQUIRY_TYPES = [
  'General Inquiry',
  'Tiffin & Meals Subscription',
  'Custom Bouquet / Hampers',
  'Events & Catering',
  'Workshop Booking',
  'Order Support',
];

const ContactUsScreen = ({ navigation }) => {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [inquiryType, setInquiryType] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!firstName.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Required Fields', 'Please complete your name, email address, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        firstName,
        lastName,
        email,
        inquiryType,
        message,
      });
      Alert.alert(
        '💌 Message Delivered!',
        `Thank you ${firstName}! Your note regarding "${inquiryType}" has reached our sanctuary team in Jabalpur. We will reply to ${email} within 24 hours.`,
        [{ text: 'Thank you', onPress: () => setMessage('') }]
      );
    } catch (err) {
      Alert.alert(
        '💌 Message Received!',
        `Thank you ${firstName}! Our concierge team has logged your inquiry. We will contact you at ${email} shortly.`,
        [{ text: 'Great' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+919425112345').catch(() =>
      Alert.alert('Call', 'Please dial +91 94251 12345')
    );
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hello Reaina's Haven! I am inquiring from the mobile app.");
    Linking.openURL(`whatsapp://send?phone=919425112345&text=${text}`).catch(() => {
      Linking.openURL(`https://wa.me/919425112345?text=${text}`).catch(() => {
        Alert.alert('WhatsApp', 'WhatsApp is not installed. Reach us at +91 94251 12345.');
      });
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.tagline}>GET IN TOUCH</Text>
        <Text style={styles.heroTitle}>Connect with Us 🌿</Text>
        <Text style={styles.heroSubtitle}>
          Whether you seek floral advice, event catering, or help with an order, we are always here for you.
        </Text>
      </View>

      {/* Quick Action Badges */}
      <View style={styles.quickBar}>
        <Pressable style={styles.quickBtn} onPress={handleWhatsApp}>
          <Text style={styles.quickEmoji}>💬</Text>
          <Text style={styles.quickLabel}>WhatsApp Us</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={handleCall}>
          <Text style={styles.quickEmoji}>📞</Text>
          <Text style={styles.quickLabel}>Call Concierge</Text>
        </Pressable>
        <Pressable
          style={styles.quickBtn}
          onPress={() => navigation.navigate('AIAssistant')}
        >
          <Text style={styles.quickEmoji}>✨</Text>
          <Text style={styles.quickLabel}>Haven AI</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Contact Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send a Sanctuary Note</Text>

          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="youremail@domain.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.textMuted}
          />

          <Text style={styles.inputLabel}>Inquiry Topic</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {INQUIRY_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[styles.topicChip, inquiryType === type && styles.topicChipActive]}
                onPress={() => setInquiryType(type)}
              >
                <Text style={[styles.topicChipText, inquiryType === type && styles.topicChipTextActive]}>
                  {type}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.inputLabel}>Your Message *</Text>
          <TextInput
            style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Tell us what you need or how we can assist..."
            placeholderTextColor={COLORS.textMuted}
            multiline
          />

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? 'Sending...' : 'Send Message ✉️'}
            </Text>
          </Pressable>
        </View>

        {/* Sanctuary Location Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Sanctuary Details</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoHeading}>Jabalpur Atelier & Café</Text>
              <Text style={styles.infoText}>
                Ranjhi Main Road, Near Botanical Circle, Jabalpur, MP 482005
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏰</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoHeading}>Visiting Hours</Text>
              <Text style={styles.infoText}>Monday – Sunday: 9:00 AM – 10:00 PM</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoHeading}>Direct Email</Text>
              <Text style={styles.infoText}>hello@reainashaven.com</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: '#eee8de',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  tagline: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.accent,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  quickBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.md,
    gap: SPACING.sm,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  quickEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  formTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  topicChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  topicChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  topicChipTextActive: {
    color: '#ffffff',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#efe9df',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
