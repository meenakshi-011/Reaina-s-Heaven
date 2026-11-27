import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const PolicyScreen = ({ route }) => {
  const initialTab = route?.params?.type === 'refund' ? 'refund' : 'shipping';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.tagline}>OFFICIAL POLICIES</Text>
        <Text style={styles.heroTitle}>Sanctuary Terms & Care 📜</Text>
        <Text style={styles.heroSubtitle}>
          Transparency, fresh stem guarantees, and delivery commitments across Jabalpur and nationwide.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'shipping' && styles.tabBtnActive]}
          onPress={() => setActiveTab('shipping')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'shipping' && styles.tabBtnTextActive]}>
            🚚 Shipping Policy
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'refund' && styles.tabBtnActive]}
          onPress={() => setActiveTab('refund')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'refund' && styles.tabBtnTextActive]}>
            🔄 Refund & Returns
          </Text>
        </Pressable>
      </View>

      {/* Policy Content */}
      <View style={styles.content}>
        {activeTab === 'shipping' ? (
          <View style={styles.policyCard}>
            <Text style={styles.sectionHeading}>1. Jabalpur Local Delivery</Text>
            <Text style={styles.paragraph}>
              All fresh floral bouquets, daily tiffin subscriptions, and freshly brewed café items are delivered directly by our dedicated sanctuary fleet within Jabalpur municipal limits.
            </Text>
            <View style={styles.bulletBox}>
              <Text style={styles.bulletItem}>• Same-day delivery for orders placed before 4:00 PM.</Text>
              <Text style={styles.bulletItem}>• Express 90-minute delivery available for central zones (Civil Lines, Napier Town, Wright Town).</Text>
              <Text style={styles.bulletItem}>• Morning delivery slot: 8:00 AM – 11:30 AM.</Text>
              <Text style={styles.bulletItem}>• Evening delivery slot: 4:00 PM – 8:00 PM.</Text>
            </View>

            <Text style={styles.sectionHeading}>2. Pan-India Shipping</Text>
            <Text style={styles.paragraph}>
              Non-perishable artisan products — including dry botanical bouquets, curated books, hand-poured soy candles, roasted whole-bean coffees, and gift accessories — ship pan-India via express air courier within 3–5 business days.
            </Text>

            <Text style={styles.sectionHeading}>3. Eco-Friendly Hydration Packaging</Text>
            <Text style={styles.paragraph}>
              We never compromise freshness. All fresh flowers are wrapped in moisture-retaining botanical packs that maintain stem hydration for up to 18 hours in transit. Outer carriers are crafted from 100% recyclable kraft paper and compostable jute cords.
            </Text>

            <Text style={styles.sectionHeading}>4. Delivery Fees & Free Thresholds</Text>
            <Text style={styles.paragraph}>
              Orders above ₹999 within Jabalpur qualify for complimentary zero-fee delivery. Standard city delivery fee for smaller orders is ₹49.
            </Text>
          </View>
        ) : (
          <View style={styles.policyCard}>
            <Text style={styles.sectionHeading}>1. Fresh Floral Guarantee</Text>
            <Text style={styles.paragraph}>
              Because fresh flowers are natural, living botanicals, minor variations in petal shade and seasonal foliage are natural. However, we guarantee that all delivered stems are fresh, vibrant, and properly conditioned.
            </Text>

            <Text style={styles.sectionHeading}>2. Damaged or Wilted Stems</Text>
            <Text style={styles.paragraph}>
              If your bouquet arrives damaged, broken, or in unacceptable condition, please notify our concierge within 2 hours of delivery with a photo. We will immediately dispatch a fresh replacement or process a full refund to your original payment method.
            </Text>
            <View style={styles.bulletBox}>
              <Text style={styles.bulletItem}>• 2-Hour photo reporting window for perishable flowers.</Text>
              <Text style={styles.bulletItem}>• 48-Hour reporting window for non-perishable books & hampers.</Text>
              <Text style={styles.bulletItem}>• Zero return friction: No need to ship damaged flowers back.</Text>
            </View>

            <Text style={styles.sectionHeading}>3. Order Cancellations</Text>
            <Text style={styles.paragraph}>
              Orders can be cancelled free of charge up to 3 hours before the scheduled delivery window. Once the florist has cut the stems or the cafe has prepared the meal, cancellations are subject to a 50% prep fee.
            </Text>

            <Text style={styles.sectionHeading}>4. Refund Timelines</Text>
            <Text style={styles.paragraph}>
              Refunds approved by our team are issued instantly for UPI/Wallet transactions, and within 3–5 business days for credit/debit cards.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PolicyScreen;

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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: '#eee8de',
    borderRadius: RADIUS.full,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  tabBtnActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  tabBtnText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  policyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletBox: {
    backgroundColor: '#fbf9f6',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: 8,
    gap: 6,
  },
  bulletItem: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
