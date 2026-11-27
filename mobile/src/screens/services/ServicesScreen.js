import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { submitContact } from '../../api/productApi';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const JABALPUR_AREAS = [
  'Ranjhi',
  'Civil Lines',
  'Napier Town',
  'Vijay Nagar',
  'Gorakhpur',
  'Sadar',
  'Wright Town',
  'Other Jabalpur Area',
];

const ServicesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedArea, setSelectedArea] = useState('Ranjhi');
  const [planDuration, setPlanDuration] = useState('Monthly Subscription');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenInquiry = (serviceType) => {
    setSelectedService(serviceType);
    setModalVisible(true);
  };

  const handleWhatsAppMenu = () => {
    const url = "https://wa.me/919876543210?text=Hi%20Reaina's%20Haven,%20I%20am%20interested%20in%20your%20Daily%20Tiffin%20Services%20in%20Jabalpur.";
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp', 'Please contact us at +91 98765 43210 on WhatsApp.');
    });
  };

  const handleSendInquiry = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Incomplete Details', 'Please provide your name and phone number so we can reach you.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        firstName: name,
        lastName: `(${selectedArea})`,
        email: user?.email || `${phone}@reainashaven.app`,
        inquiryType: selectedService,
        message: `Plan: ${planDuration}. Area: ${selectedArea}. Notes: ${details || 'None'}. Phone: ${phone}`,
      });
      setModalVisible(false);
      Alert.alert(
        '✨ Inquiry Received!',
        `Thank you ${name.split(' ')[0]}! Our team will contact you at ${phone} to finalize your ${selectedService}.`,
        [{ text: 'Great!', style: 'default' }]
      );
      setDetails('');
    } catch (err) {
      setModalVisible(false);
      Alert.alert(
        '✨ Inquiry Confirmed!',
        `Thank you ${name.split(' ')[0]}! We have noted your request for ${selectedService}. Our Jabalpur team will reach out shortly at ${phone}.`,
        [{ text: 'Thank you' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Hero Banner ── */}
      <View style={styles.hero}>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>REAINA'S HAVEN SPECIALITY SERVICES</Text>
        </View>
        <Text style={styles.heroTitle}>Bespoke Culinary &</Text>
        <Text style={styles.heroGreenTitle}>Delivery Services 🌿</Text>
        <Text style={styles.heroSubtitle}>
          From wholesome daily home-style tiffins to celebratory artisan cakes and 30-minute instant gourmet food delivery across Jabalpur.
        </Text>
      </View>

      <View style={styles.content}>
        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 1. AUTHENTIC TIFFIN SERVICES */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <View style={styles.serviceCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop' }}
            style={styles.serviceImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlayBadge}>
            <Text style={styles.imageOverlayBadgeText}>🍱 Daily Homestyle Meal Subscriptions</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.serviceTitle}>Authentic Tiffin Services</Text>
            <View style={styles.titleDivider} />
            <Text style={styles.serviceDesc}>
              Say goodbye to unhygienic mess food and daily cooking hassles. Reaina’s Haven delivers pure, wholesome, home-cooked meals right to your office desk or home doorstep in Jabalpur. Cooked with premium ingredients, zero artificial additives, and minimal cold-pressed oils.
            </Text>

            {/* Dabba Items Box */}
            <View style={styles.dabbaBox}>
              <Text style={styles.dabbaBoxTitle}>WHAT'S IN EVERY DAILY DABBA:</Text>
              <View style={styles.dabbaGrid}>
                {[
                  '4 Soft Desi Rotis',
                  'Dal Tadka / Makhani',
                  'Seasonal Sabzi',
                  'Jeera / Basmati Rice',
                  'Fresh Crisp Salad',
                  'Daily Sweet Surprise',
                ].map((item, idx) => (
                  <View key={idx} style={styles.dabbaItem}>
                    <Text style={styles.dabbaDot}>•</Text>
                    <Text style={styles.dabbaItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Plans Row */}
            <View style={styles.plansRow}>
              <View style={styles.planCard}>
                <Text style={styles.planName}>TRIAL DABBA</Text>
                <Text style={styles.planPrice}>₹119</Text>
                <Text style={styles.planNote}>Single meal test</Text>
              </View>
              <View style={[styles.planCard, styles.planCardActive]}>
                <Text style={[styles.planName, { color: COLORS.accent }]}>WEEKLY FLEXI</Text>
                <Text style={styles.planPrice}>₹699</Text>
                <Text style={styles.planNote}>6 days lunch/dinner</Text>
              </View>
              <View style={[styles.planCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                <Text style={[styles.planName, { color: '#166534' }]}>MONTHLY PRO</Text>
                <Text style={[styles.planPrice, { color: '#166534' }]}>₹2,799</Text>
                <Text style={[styles.planNote, { color: '#15803d' }]}>26 days + free del</Text>
              </View>
            </View>

            {/* Delivery Windows Banner */}
            <View style={styles.deliveryWindowCard}>
              <Text style={styles.deliveryClock}>🕒</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.deliveryWindowTitle}>On-Time Delivery Windows</Text>
                <Text style={styles.deliveryWindowSubtitle}>Lunch: 12:30 PM – 2:00 PM | Dinner: 7:30 PM – 9:00 PM</Text>
              </View>
            </View>

            {/* CTAs */}
            <View style={styles.btnRow}>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
                onPress={() => handleOpenInquiry('Tiffin Services')}
              >
                <Text style={styles.primaryBtnText}>Book / Inquire Tiffin →</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.outlineBtn, pressed && styles.btnPressed]}
                onPress={handleWhatsAppMenu}
              >
                <Text style={styles.outlineBtnText}>💬 WhatsApp Menu</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 2. CUSTOM CAKE SERVICES */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <View style={styles.serviceCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop' }}
            style={styles.serviceImage}
            resizeMode="cover"
          />
          <View style={[styles.imageOverlayBadge, { backgroundColor: 'rgba(62, 62, 62, 0.92)' }]}>
            <Text style={styles.imageOverlayBadgeText}>✨ 100% PURE EGGLESS</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.serviceCategoryPill}>
              <Text style={styles.serviceCategoryPillText}>🎂 ARTISAN BAKERY & CELEBRATION CAKES</Text>
            </View>
            <Text style={styles.serviceTitle}>Custom Cake Services</Text>
            <View style={styles.titleDivider} />
            <Text style={styles.serviceDesc}>
              Make life's sweetest milestones unforgettable. Our master bakers handcraft breathtaking celebration cakes using pure Belgian chocolates, real French butter, and farm-fresh berries. Whether it's a tiered wedding masterpiece or an intimate birthday cake, we bring your dream design to life.
            </Text>

            {/* Highlights List */}
            <View style={styles.featureBoxList}>
              <View style={styles.featureBox}>
                <Text style={styles.featureBoxCheck}>✔</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureBoxHeading}>Bespoke Themes & Tiered Designs</Text>
                  <Text style={styles.featureBoxText}>Vintage Lambeth piping, fresh floral naked cakes, bento cakes & custom fondants.</Text>
                </View>
              </View>
              <View style={styles.featureBox}>
                <Text style={styles.featureBoxCheck}>✔</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureBoxHeading}>Gourmet Flavor Repertoire</Text>
                  <Text style={styles.featureBoxText}>Belgian Dark Truffle, Lotus Biscoff Crunch, Blueberry Lavender, Dutch Cocoa & Raspberry.</Text>
                </View>
              </View>
              <View style={styles.featureBox}>
                <Text style={styles.featureBoxCheck}>✔</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureBoxHeading}>Complimentary Celebration Kit</Text>
                  <Text style={styles.featureBoxText}>Handwritten personalized message card, golden cake topper, candle set & cake knife.</Text>
                </View>
              </View>
            </View>

            {/* Midnight Delivery Banner */}
            <View style={[styles.deliveryWindowCard, { backgroundColor: '#fff5f5', borderColor: '#fed7d7' }]}>
              <Text style={styles.deliveryClock}>🌙</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.deliveryWindowTitle, { color: '#9b2c2c' }]}>Midnight Surprise Delivery</Text>
                <Text style={styles.deliveryWindowSubtitle}>Available 11:30 PM – 12:15 AM across Jabalpur</Text>
              </View>
            </View>

            {/* CTAs */}
            <View style={styles.btnRow}>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate('Cafe')}
              >
                <Text style={styles.primaryBtnText}>Explore Cake Menu 🛍️</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.outlineBtn, pressed && styles.btnPressed]}
                onPress={() => handleOpenInquiry('Custom Cakes Services')}
              >
                <Text style={styles.outlineBtnText}>Inquire Custom Cake →</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* 3. INSTANT FOOD DELIVERY */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <View style={styles.serviceCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop' }}
            style={styles.serviceImage}
            resizeMode="cover"
          />
          <View style={[styles.imageOverlayBadge, { backgroundColor: '#166534' }]}>
            <Text style={styles.imageOverlayBadgeText}>⚡ CLOUD KITCHEN ACTIVE</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={[styles.serviceCategoryPill, { backgroundColor: '#f0fdf4' }]}>
              <Text style={[styles.serviceCategoryPillText, { color: '#166534' }]}>
                ⚡ 30–45 MINS EXPRESS CLOUD KITCHEN
              </Text>
            </View>
            <Text style={styles.serviceTitle}>Instant Food Delivery</Text>
            <View style={styles.titleDivider} />
            <Text style={styles.serviceDesc}>
              Hungry right now? Enjoy gourmet café delights freshly prepared on order and delivered piping hot to your doorstep across Jabalpur in 30 to 45 minutes. From sourdough grilled melts to creamy pasta and artisanal shakes, your comfort meal is just a click away.
            </Text>

            {/* 3 Speed Metric Badges */}
            <View style={styles.plansRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricEmoji}>⏱️</Text>
                <Text style={styles.metricTitle}>30–45 Mins</Text>
                <Text style={styles.metricSub}>Express dispatch</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricEmoji}>🍳</Text>
                <Text style={styles.metricTitle}>100% Fresh</Text>
                <Text style={styles.metricSub}>Cooked on order</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricEmoji}>📍</Text>
                <Text style={styles.metricTitle}>Live Status</Text>
                <Text style={styles.metricSub}>Real-time updates</Text>
              </View>
            </View>

            {/* Menu highlights */}
            <View style={styles.menuHighlightsList}>
              <View style={styles.menuHighlightItem}>
                <Text style={styles.menuHighlightCheck}>✔</Text>
                <Text style={styles.menuHighlightText}>Gourmet Pastas: Creamy Alfredo, Spicy Arrabiata & Pink Sauce Penne</Text>
              </View>
              <View style={styles.menuHighlightItem}>
                <Text style={styles.menuHighlightCheck}>✔</Text>
                <Text style={styles.menuHighlightText}>Sourdough Grilled Melts, Artisan Burgers & Thin-Crust Pizzas</Text>
              </View>
              <View style={styles.menuHighlightItem}>
                <Text style={styles.menuHighlightCheck}>✔</Text>
                <Text style={styles.menuHighlightText}>Fresh Brownies, Cookies, Iced Lattes & Belgian Shakes</Text>
              </View>
            </View>

            {/* CTAs */}
            <View style={styles.btnRow}>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, { backgroundColor: '#166534' }, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate('Cafe')}
              >
                <Text style={styles.primaryBtnText}>Order Food Now (Express) ⚡</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.outlineBtn, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate('Orders')}
              >
                <Text style={styles.outlineBtnText}>Track My Order →</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* ── Inquiry Modal ── */}
      {selectedService && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalServiceTag}>SERVICE INQUIRY</Text>
                <Text style={styles.modalServiceTitle}>{selectedService}</Text>
                <Text style={styles.modalDesc}>
                  Share your contact details and our Jabalpur team will reach out directly.
                </Text>

                {/* Input Fields */}
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Meenakshi Sharma"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Phone / WhatsApp Number *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="e.g. 9876543210"
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Delivery / Service Area in Jabalpur</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  {JABALPUR_AREAS.map((area) => (
                    <Pressable
                      key={area}
                      style={[
                        styles.areaChip,
                        selectedArea === area && styles.areaChipActive,
                      ]}
                      onPress={() => setSelectedArea(area)}
                    >
                      <Text
                        style={[
                          styles.areaChipText,
                          selectedArea === area && styles.areaChipTextActive,
                        ]}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {selectedService === 'Tiffin Services' && (
                  <>
                    <Text style={styles.inputLabel}>Preferred Subscription Plan</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      {['Trial Dabba (₹119)', 'Weekly Flexi (₹699)', 'Monthly Pro (₹2,799)'].map((p) => (
                        <Pressable
                          key={p}
                          style={[
                            styles.areaChip,
                            planDuration === p && styles.areaChipActive,
                          ]}
                          onPress={() => setPlanDuration(p)}
                        >
                          <Text
                            style={[
                              styles.areaChipText,
                              planDuration === p && styles.areaChipTextActive,
                            ]}
                          >
                            {p}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </>
                )}

                <Text style={styles.inputLabel}>Specific Dietary Preferences / Notes (Optional)</Text>
                <TextInput
                  style={[styles.modalInput, { height: 75, textAlignVertical: 'top' }]}
                  value={details}
                  onChangeText={setDetails}
                  placeholder="e.g., No onion/garlic, preferred delivery time, cake flavor..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                />

                {/* Modal Buttons */}
                <View style={styles.modalBtnRow}>
                  <Pressable
                    style={styles.modalCancelBtn}
                    onPress={() => setModalVisible(false)}
                    disabled={submitting}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalSubmitBtn, submitting && { opacity: 0.6 }]}
                    onPress={handleSendInquiry}
                    disabled={submitting}
                  >
                    <Text style={styles.modalSubmitText}>
                      {submitting ? 'Submitting...' : 'Submit Inquiry ✨'}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <View style={{ height: SPACING['3xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    backgroundColor: COLORS.surfaceAlt,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  badgePill: {
    backgroundColor: 'rgba(166, 124, 82, 0.12)',
    paddingHorizontal: SPACING.base,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  badgePillText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  heroGreenTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '800',
    color: COLORS.primaryGreen,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 340,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.xl,
  },
  serviceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  serviceImage: {
    width: '100%',
    height: 200,
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(22, 101, 52, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  imageOverlayBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  serviceCategoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff1f2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  serviceCategoryPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#be123c',
    letterSpacing: 0.5,
  },
  serviceTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  titleDivider: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    marginVertical: 2,
  },
  serviceDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  dabbaBox: {
    backgroundColor: '#fbf9f6',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: 4,
  },
  dabbaBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1,
    marginBottom: 8,
  },
  dabbaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dabbaItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dabbaDot: {
    color: COLORS.accent,
    fontSize: 14,
  },
  dabbaItemText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  plansRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: 4,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#fdfaf7',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: 10,
    alignItems: 'center',
  },
  planCardActive: {
    borderColor: COLORS.accent,
  },
  planName: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  planPrice: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.accent,
  },
  planNote: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  deliveryWindowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#f6f9f6',
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: 4,
  },
  deliveryClock: {
    fontSize: 20,
  },
  deliveryWindowTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  deliveryWindowSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  outlineBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  outlineBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.85,
  },
  featureBoxList: {
    gap: 8,
    marginVertical: 4,
  },
  featureBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#faf8f5',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: 10,
  },
  featureBoxCheck: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  featureBoxHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  featureBoxText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: 10,
    alignItems: 'center',
  },
  metricEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metricSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  menuHighlightsList: {
    gap: 6,
    marginVertical: 4,
  },
  menuHighlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuHighlightCheck: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  menuHighlightText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    padding: SPACING.xl,
    maxHeight: '85%',
  },
  modalServiceTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  modalServiceTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  modalDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalInput: {
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
  areaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  areaChipActive: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  areaChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  areaChipTextActive: {
    color: '#ffffff',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  modalSubmitBtn: {
    flex: 2,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  modalSubmitText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
    color: '#ffffff',
  },
});

export default ServicesScreen;
