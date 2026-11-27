import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params || {};
  const orderIdShort = order?._id?.slice(-8).toUpperCase() || '--------';

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Animation */}
      <View style={styles.successCircle}>
        <Text style={styles.successEmoji}>✅</Text>
      </View>

      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.subtitle}>
        Thank you for choosing Reaina's Haven. 🌿
      </Text>
      <Text style={styles.subtitle}>
        We've sent a confirmation to your email.
      </Text>

      {/* Order ID Card */}
      <View style={styles.orderCard}>
        <Text style={styles.orderIdLabel}>Order ID</Text>
        <Text style={styles.orderId}>#{orderIdShort}</Text>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment</Text>
          <Text style={styles.infoValue}>
            {order?.isPaid ? '✅ Paid' : order?.paymentMethod || 'Cash on Delivery'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={[styles.infoValue, styles.statusText]}>{order?.status || 'Processing'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total</Text>
          <Text style={styles.infoValue}>₹{order?.totalPrice?.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* What's Next */}
      <View style={styles.nextCard}>
        <Text style={styles.nextTitle}>What happens next?</Text>
        {[
          { emoji: '📦', text: 'Your order is being prepared with care.' },
          { emoji: '📧', text: 'Confirmation email sent to your inbox.' },
          { emoji: '🚚', text: 'We\'ll notify you when it\'s on its way.' },
          { emoji: '🔐', text: 'OTP confirmation on delivery for your safety.' },
        ].map((item, i) => (
          <View key={i} style={styles.nextItem}>
            <Text style={styles.nextEmoji}>{item.emoji}</Text>
            <Text style={styles.nextText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <Pressable
        style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.primaryBtnText}>View My Orders →</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    gap: SPACING.xl,
    paddingBottom: SPACING['4xl'],
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING['2xl'],
    ...SHADOWS.md,
  },
  successEmoji: { fontSize: 48 },
  title: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  orderCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.sm,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  orderIdLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  orderId: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  divider: { height: 1, backgroundColor: COLORS.borderLight, marginVertical: SPACING.xs },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  infoValue: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.textPrimary },
  statusText: { color: COLORS.success },
  nextCard: {
    width: '100%',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  nextTitle: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary },
  nextItem: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  nextEmoji: { fontSize: FONT_SIZES.lg },
  nextText: { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  primaryBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.base + 2,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: FONT_SIZES.base },
  secondaryBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.base + 2,
    alignItems: 'center',
  },
  secondaryBtnPressed: { backgroundColor: COLORS.overlayLight },
  secondaryBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZES.base },
  btnPressed: { opacity: 0.85 },
});

export default OrderSuccessScreen;
