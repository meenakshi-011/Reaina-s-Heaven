import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import { createOrder } from '../../api/orderApi';
import { createRazorpayOrder, verifyPayment } from '../../api/paymentApi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const PAYMENT_METHODS = [
  { id: 'Cash on Delivery', label: 'Cash on Delivery', emoji: '💵' },
  { id: 'Razorpay', label: 'Pay Online (Razorpay)', emoji: '💳' },
];

// Reusable labelled input
const InputField = ({ label, value, onChangeText, placeholder, keyboardType, maxLength, multiline }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
      keyboardType={keyboardType}
      maxLength={maxLength}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      textAlignVertical={multiline ? 'top' : 'auto'}
    />
  </View>
);

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const scrollRef = useRef(null);

  // Customer Details
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Delivery Address
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Jabalpur');
  const [stateName, setStateName] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('');
  const [instructions, setInstructions] = useState('');

  // GPS
  const [locationCoords, setLocationCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  // UI
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  const shippingFee = cartTotal >= 1500 ? 0 : 49;
  const totalPrice = cartTotal + shippingFee;

  // ── GPS Use My Location ────────────────────────────────────────
  const handleUseMyLocation = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Denied',
          'Please allow location access from device settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = pos.coords;
      setLocationCoords({ latitude, longitude });

      // Reverse geocode to autofill fields
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (place) {
        if (place.streetNumber || place.street) {
          setStreet([place.streetNumber, place.street].filter(Boolean).join(' '));
        }
        if (place.district || place.subregion) {
          setArea(place.district || place.subregion || '');
        }
        if (place.city) setCity(place.city);
        if (place.region) setStateName(place.region);
        if (place.postalCode) setPincode(place.postalCode);
        setLocationLabel(
          [place.name, place.street, place.city, place.postalCode].filter(Boolean).join(', ')
        );
      } else {
        setLocationLabel(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      }

      Alert.alert(
        '✅ Location Captured',
        'Your current location has been autofilled. Please review and complete the remaining fields.'
      );
    } catch (err) {
      console.warn('GPS error:', err.message);
      Alert.alert('Location Error', 'Could not fetch your location. Please fill the address manually.');
    } finally {
      setGpsLoading(false);
    }
  };

  // ── Open Maps for Tracking ─────────────────────────────────────
  const handleOpenTrackingMap = () => {
    // Reaina's Haven store coordinates (Jabalpur)
    const storeLat = 23.1815;
    const storeLng = 79.9864;

    if (locationCoords) {
      const url =
        Platform.OS === 'ios'
          ? `maps://app?saddr=${storeLat},${storeLng}&daddr=${locationCoords.latitude},${locationCoords.longitude}`
          : `https://maps.google.com/maps?saddr=${storeLat},${storeLng}&daddr=${locationCoords.latitude},${locationCoords.longitude}`;
      Linking.canOpenURL(url).then((supported) => {
        Linking.openURL(
          supported
            ? url
            : `https://maps.google.com/?q=${locationCoords.latitude},${locationCoords.longitude}`
        );
      });
    } else {
      Linking.openURL(
        `https://maps.google.com/?q=${storeLat},${storeLng}&label=Reaina%27s+Haven+Jabalpur`
      );
    }
  };

  // ── Form Validation ────────────────────────────────────────────
  const validateForm = () => {
    if (!customerName.trim()) return "Please enter your full name.";
    const phoneClean = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim() || phoneClean.length < 10)
      return "Please enter a valid 10-digit mobile number.";
    if (!house.trim()) return "Please enter your House / Flat / Building number.";
    if (!area.trim()) return "Please enter your Area / Locality.";
    if (!city.trim()) return "Please enter your city.";
    if (!stateName.trim()) return "Please enter your state.";
    const pinClean = pincode.replace(/\D/g, '');
    if (!pincode.trim() || pinClean.length !== 6)
      return "Please enter a valid 6-digit pincode.";
    return null;
  };

  // ── Build Order Payload ────────────────────────────────────────
  const buildOrderPayload = () => ({
    customer: {
      name: customerName.trim(),
      phone: customerPhone.trim(),
    },
    deliveryAddress: {
      house: house.trim(),
      street: street.trim(),
      area: area.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      landmark: landmark.trim(),
      instructions: instructions.trim(),
    },
    ...(locationCoords && {
      location: {
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        exactLocation: locationLabel || `${area}, ${city}`,
      },
    }),
    orderItems: cartItems.map((item) => ({
      name: item.name || item.item_name,
      qty: item.qty,
      quantity: item.qty,
      image: item.image || item.imageUrl || item.imageurl || '',
      price: item.price,
      product: item._id,
      ingredients: item.ingredients || [],
      includes: item.includes || '',
      selectedQty: item.selectedQty,
    })),
    paymentMethod,
    itemsPrice: cartTotal,
    taxPrice: 0,
    shippingPrice: shippingFee,
    totalPrice,
  });

  // ── Place Order ────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please log in to place your order.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log In', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) },
      ]);
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add items before placing an order.');
      return;
    }

    const error = validateForm();
    if (error) {
      Alert.alert('Missing Information', error);
      return;
    }

    setLoading(true);
    try {
      const payload = buildOrderPayload();
      const createdOrder = await createOrder(payload);

      if (paymentMethod === 'Cash on Delivery') {
        clearCart();
        navigation.replace('OrderSuccess', { order: createdOrder });
      } else {
        // Razorpay
        const razorpayOrder = await createRazorpayOrder(createdOrder._id);
        let RazorpayCheckout = null;
        try { RazorpayCheckout = require('react-native-razorpay')?.default; } catch (_) {}

        if (RazorpayCheckout) {
          const options = {
            description: "Reaina's Haven Order",
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: razorpayOrder.currency,
            key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            name: "Reaina's Haven",
            order_id: razorpayOrder.id,
            prefill: { email: user.email, name: user.name },
            theme: { color: '#166534' },
          };
          const paymentData = await RazorpayCheckout.open(options);
          const result = await verifyPayment({
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
            db_order_id: createdOrder._id,
          });
          clearCart();
          navigation.replace('OrderSuccess', { order: result.order });
        } else {
          // Expo Go fallback
          Alert.alert(
            '💳 Payment',
            `Order #${createdOrder.orderId || createdOrder._id?.slice(-6).toUpperCase()} created!\n\nRazorpay native module is not linked in Expo Go. Use your production build for online payments.`,
            [
              { text: 'Switch to COD & Confirm', onPress: () => { clearCart(); navigation.replace('OrderSuccess', { order: createdOrder }); } },
              { text: 'Confirm (Dev)', onPress: () => { clearCart(); navigation.replace('OrderSuccess', { order: createdOrder }); } },
            ]
          );
        }
      }
    } catch (err) {
      console.error('Order error:', err?.response?.data || err.message);
      if (err.code === 2) {
        Alert.alert('Payment Cancelled', 'Order was created but payment was cancelled. You can retry from My Orders.');
        clearCart();
        navigation.navigate('Orders');
      } else {
        const msg = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
        Alert.alert('Order Failed', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* CUSTOMER DETAILS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Customer Details</Text>
          <InputField label="Full Name *" value={customerName} onChangeText={setCustomerName} placeholder="Your full name" />
          <InputField label="Mobile Number *" value={customerPhone} onChangeText={setCustomerPhone} placeholder="10-digit mobile number" keyboardType="phone-pad" maxLength={13} />
        </View>

        {/* DELIVERY ADDRESS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>📍 Delivery Address</Text>
            <Pressable style={[styles.gpsBtn, gpsLoading && styles.gpsBtnDisabled]} onPress={handleUseMyLocation} disabled={gpsLoading}>
              {gpsLoading
                ? <ActivityIndicator size="small" color={COLORS.primary} />
                : <Text style={styles.gpsBtnText}>📡 Use My Location</Text>}
            </Pressable>
          </View>

          {locationLabel ? (
            <View style={styles.locationPill}>
              <Text style={styles.locationPillIcon}>✅</Text>
              <Text style={styles.locationPillText} numberOfLines={2}>{locationLabel}</Text>
            </View>
          ) : null}

          <InputField label="House / Flat / Building *" value={house} onChangeText={setHouse} placeholder="e.g. Flat 4B, Sai Residency" />
          <InputField label="Street / Road" value={street} onChangeText={setStreet} placeholder="e.g. MG Road, Civil Lines" />
          <InputField label="Area / Locality *" value={area} onChangeText={setArea} placeholder="e.g. Napier Town, Gorakhpur" />
          <InputField label="Landmark (near)" value={landmark} onChangeText={setLandmark} placeholder="e.g. Near DPS School" />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField label="City *" value={city} onChangeText={setCity} placeholder="Jabalpur" />
            </View>
            <View style={{ flex: 1 }}>
              <InputField label="Pincode *" value={pincode} onChangeText={setPincode} placeholder="482001" keyboardType="numeric" maxLength={6} />
            </View>
          </View>

          <InputField label="State *" value={stateName} onChangeText={setStateName} placeholder="Madhya Pradesh" />
          <InputField label="Delivery Instructions" value={instructions} onChangeText={setInstructions} placeholder="Any special delivery notes (optional)" multiline />
        </View>

        {/* DELIVERY TRACKING MAP */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🗺️ Delivery Tracking</Text>
          <View style={styles.mapBox}>
            {/* Visual route banner */}
            <View style={styles.mapBanner}>
              <View style={styles.mapPin}>
                <Text style={styles.mapPinEmoji}>🏪</Text>
                <Text style={styles.mapPinLabel}>Store</Text>
                <Text style={styles.mapPinSub}>Reaina's Haven{'\n'}Jabalpur</Text>
              </View>
              <View style={styles.mapRoute}>
                <View style={styles.mapDashedLine} />
                <Text style={styles.mapRouteEmoji}>🛵</Text>
              </View>
              <View style={styles.mapPin}>
                <Text style={styles.mapPinEmoji}>📍</Text>
                <Text style={styles.mapPinLabel}>You</Text>
                <Text style={styles.mapPinSub}>
                  {locationCoords ? `${locationCoords.latitude.toFixed(3)}°N` : 'Your door'}
                </Text>
              </View>
            </View>

            {/* Info rows */}
            <View style={styles.mapInfoSection}>
              <View style={styles.mapInfoRow}>
                <Text style={styles.mapInfoIcon}>⏱️</Text>
                <View>
                  <Text style={styles.mapInfoTitle}>Estimated Delivery</Text>
                  <Text style={styles.mapInfoValue}>30–60 min (Jabalpur) · 1–2 days (outstation)</Text>
                </View>
              </View>
              <View style={styles.mapInfoRow}>
                <Text style={styles.mapInfoIcon}>📡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapInfoTitle}>Live Location Status</Text>
                  <Text style={styles.mapInfoValue}>
                    {locationCoords
                      ? `📍 Captured (${locationCoords.latitude.toFixed(4)}, ${locationCoords.longitude.toFixed(4)})`
                      : 'Tap "Use My Location" above to enable live tracking'}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.openMapBtn, pressed && { opacity: 0.8 }]}
              onPress={handleOpenTrackingMap}
            >
              <Text style={styles.openMapBtnText}>
                {locationCoords ? '🗺️ View Delivery Route on Maps' : '📌 View Store on Google Maps'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* PAYMENT METHOD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💳 Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              style={[styles.paymentOption, paymentMethod === method.id && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <View style={[styles.radio, paymentMethod === method.id && styles.radioActive]}>
                {paymentMethod === method.id && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.paymentEmoji}>{method.emoji}</Text>
              <Text style={[styles.paymentLabel, paymentMethod === method.id && styles.paymentLabelActive]}>
                {method.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ORDER SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.cartItemId || item._id} style={styles.summaryItem}>
              <Text style={styles.summaryItemName} numberOfLines={1}>
                {item.name || item.item_name} × {item.qty}
              </Text>
              <Text style={styles.summaryItemPrice}>
                ₹{(item.price * item.qty)?.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{cartTotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, shippingFee === 0 && styles.freeText]}>
              {shippingFee === 0 ? '🎉 FREE' : `₹${shippingFee}`}
            </Text>
          </View>
          {shippingFee === 0 && (
            <Text style={styles.freeNote}>Free delivery on orders above ₹1,500 🌿</Text>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{totalPrice.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* POLICY NOTE */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            🕐 Same-day delivery cutoff: 1:00 PM IST{'\n'}
            🚚 Delivery area: Jabalpur & nearby zones{'\n'}
            📦 Orders dispatched within 1–2 business days{'\n'}
            🔐 OTP confirmation required on delivery
          </Text>
        </View>

        {/* PLACE ORDER BUTTON */}
        <Pressable
          id="place-order-btn"
          style={({ pressed }) => [
            styles.orderBtn,
            pressed && styles.orderBtnPressed,
            (loading || cartItems.length === 0) && styles.orderBtnDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? (
            <View style={styles.orderBtnInner}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.orderBtnText}>Processing…</Text>
            </View>
          ) : (
            <Text style={styles.orderBtnText}>
              {paymentMethod === 'Cash on Delivery'
                ? `🌿 Place Order · ₹${totalPrice.toLocaleString('en-IN')}`
                : `💳 Pay ₹${totalPrice.toLocaleString('en-IN')} Securely →`}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.base, gap: SPACING.base, paddingBottom: 100 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.base,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTitle: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // GPS Button
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    minWidth: 44,
    justifyContent: 'center',
  },
  gpsBtnDisabled: { opacity: 0.6 },
  gpsBtnText: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: COLORS.primary },

  // Location Pill
  locationPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    backgroundColor: '#e8f5e9',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  locationPillIcon: { fontSize: 13 },
  locationPillText: { flex: 1, fontSize: FONT_SIZES.xs, color: COLORS.primary, fontWeight: '600', lineHeight: 18 },

  // Inputs
  row: { flexDirection: 'row', gap: SPACING.sm },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : 10,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
  },
  textArea: { minHeight: 68, paddingTop: SPACING.sm },

  // Map
  mapBox: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.borderLight },
  mapBanner: {
    backgroundColor: '#e8f5e9',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapPin: { alignItems: 'center', gap: 2, flex: 1 },
  mapPinEmoji: { fontSize: 30 },
  mapPinLabel: { fontSize: FONT_SIZES.xs, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },
  mapPinSub: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', lineHeight: 14 },
  mapRoute: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  mapDashedLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary + '50',
  },
  mapRouteEmoji: { fontSize: 22 },
  mapInfoSection: { backgroundColor: COLORS.surface, padding: SPACING.base, gap: SPACING.sm },
  mapInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  mapInfoIcon: { fontSize: 15, marginTop: 1 },
  mapInfoTitle: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: COLORS.textPrimary },
  mapInfoValue: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, lineHeight: 18, marginTop: 1 },
  openMapBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.base,
    alignItems: 'center',
  },
  openMapBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZES.sm },

  // Payment
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  paymentOptionActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(22,101,52,0.04)' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  paymentEmoji: { fontSize: FONT_SIZES.base },
  paymentLabel: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, fontWeight: '500' },
  paymentLabelActive: { color: COLORS.primary, fontWeight: '700' },

  // Summary
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryItemName: { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, fontWeight: '500' },
  summaryItemPrice: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.borderLight },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  summaryValue: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, fontWeight: '600' },
  freeText: { color: COLORS.success },
  freeNote: { fontSize: FONT_SIZES.xs, color: COLORS.success, fontStyle: 'italic' },
  totalRow: { paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderLight, marginTop: SPACING.xs },
  totalLabel: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary },
  totalValue: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.primary },

  // Note
  noteBox: { backgroundColor: '#fef9e7', borderRadius: RADIUS.md, padding: SPACING.base, borderWidth: 1, borderColor: '#f0d27e' },
  noteText: { fontSize: FONT_SIZES.sm, color: '#7d6608', lineHeight: 22 },

  // Order Button
  orderBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.base + 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  orderBtnPressed: { opacity: 0.85 },
  orderBtnDisabled: { opacity: 0.55 },
  orderBtnInner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  orderBtnText: { color: '#fff', fontWeight: '800', fontSize: FONT_SIZES.base + 1, letterSpacing: 0.3 },
});

export default CheckoutScreen;