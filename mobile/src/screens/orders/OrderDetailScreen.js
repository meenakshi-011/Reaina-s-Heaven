import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getOrderById, verifyDeliveryOTP } from '../../api/orderApi';
import Loading from '../../components/Loading';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS, ORDER_STATUS_COLORS } from '../../constants/theme';

const STATUS_STEPS = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderDetailScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP from your email.');
      return;
    }
    setVerifying(true);
    try {
      const result = await verifyDeliveryOTP(orderId, otp);
      setOrder(result.order);
      Alert.alert('✅ Delivery Verified!', 'Your delivery has been confirmed.');
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed.';
      Alert.alert('OTP Failed', msg);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <Loading message="Loading order details..." />;
  if (!order) return null;

  const orderIdShort = order._id?.slice(-8).toUpperCase();
  const statusColors = ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS['Processing'];
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.orderId}>#{orderIdShort}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                dateStyle: 'long',
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {order.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Progress */}
      {order.status !== 'Cancelled' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Order Progress</Text>
          <View style={styles.progressRow}>
            {STATUS_STEPS.map((step, idx) => (
              <View key={step} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressDot,
                    idx <= currentStepIndex && styles.progressDotActive,
                  ]}
                >
                  {idx <= currentStepIndex && <Text style={styles.progressCheck}>✓</Text>}
                </View>
                {idx < STATUS_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.progressLine,
                      idx < currentStepIndex && styles.progressLineActive,
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.progressLabel,
                    idx <= currentStepIndex && styles.progressLabelActive,
                  ]}
                  numberOfLines={2}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* OTP Verification */}
      {order.status === 'Delivered' && !order.isOTPVerified && (
        <View style={[styles.card, styles.otpCard]}>
          <Text style={styles.cardTitle}>🔐 Verify Delivery OTP</Text>
          <Text style={styles.otpHint}>
            Enter the 6-digit OTP sent to your email to confirm delivery.
          </Text>
          <View style={styles.otpRow}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor={COLORS.textMuted}
            />
            <Pressable
              style={[styles.otpBtn, verifying && styles.otpBtnDisabled]}
              onPress={handleVerifyOTP}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.otpBtnText}>Verify</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
      {order.status === 'Delivered' && order.isOTPVerified && (
        <View style={[styles.card, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.verifiedText}>✅ Delivery Verified</Text>
        </View>
      )}

      {/* Order Items */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📦 Order Items</Text>
        {order.orderItems?.map((item, idx) => (
          <View key={idx} style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              {item.ingredients?.length > 0 && (
                <Text style={styles.itemIngredients}>
                  Ingredients: {item.ingredients.join(', ')}
                </Text>
              )}
              <Text style={styles.itemQty}>Qty: {item.qty}</Text>
            </View>
            <Text style={styles.itemPrice}>₹{item.price?.toLocaleString('en-IN')}</Text>
          </View>
        ))}
      </View>

      {/* Shipping Address */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚚 Delivery Address</Text>
        <Text style={styles.addressText}>
          {order.shippingAddress?.address}{'\n'}
          {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}{'\n'}
          {order.shippingAddress?.country}
        </Text>
      </View>

      {/* Payment Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💳 Payment</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Method</Text>
          <Text style={styles.paymentValue}>{order.paymentMethod}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Status</Text>
          <Text style={[styles.paymentValue, order.isPaid && styles.paidText]}>
            {order.isPaid ? '✅ Paid' : '⏳ Pending'}
          </Text>
        </View>
        <View style={[styles.paymentRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.totalPrice?.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={{ height: SPACING['3xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  orderDate: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusText: { fontSize: FONT_SIZES.xs, fontWeight: '800' },
  card: {
    margin: SPACING.sm,
    marginTop: 0,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTitle: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary },
  // Progress
  progressRow: { flexDirection: 'row', alignItems: 'flex-start' },
  progressStep: { flex: 1, alignItems: 'center' },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  progressCheck: { color: '#fff', fontSize: 12, fontWeight: '800' },
  progressLine: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressLineActive: { backgroundColor: COLORS.primary },
  progressLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  progressLabelActive: { color: COLORS.primary, fontWeight: '700' },
  // OTP
  otpCard: { backgroundColor: '#fff9e6', borderColor: '#f0d27e' },
  otpHint: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  otpRow: { flexDirection: 'row', gap: SPACING.sm },
  otpInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
  },
  otpBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBtnDisabled: { opacity: 0.7 },
  otpBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZES.base },
  verifiedText: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.success, textAlign: 'center' },
  // Items
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  orderItemInfo: { flex: 1, gap: 3 },
  itemName: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textPrimary },
  itemIngredients: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontStyle: 'italic' },
  itemQty: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  itemPrice: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.primary },
  // Address
  addressText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 22 },
  // Payment
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  paymentLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  paymentValue: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textPrimary },
  paidText: { color: COLORS.success },
  totalRow: { paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderLight, marginTop: SPACING.xs },
  totalLabel: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary },
  totalValue: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.primary },
});

export default OrderDetailScreen;
