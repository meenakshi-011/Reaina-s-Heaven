import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const PILLARS = [
  {
    emoji: '🌸',
    title: 'Artisan Florals',
    desc: 'Locally nurtured stems arranged with wild botanical grace, bringing living poetry into your home.',
  },
  {
    emoji: '☕',
    title: 'Sanctuary Café',
    desc: 'Specialty pour-overs, single-origin roasts, and soulful homemade vegetarian fare crafted fresh daily.',
  },
  {
    emoji: '🧺',
    title: 'Mindful Hampers',
    desc: 'Bespoke gifts of slow-poured candles, curated literature, and hand-wrapped artisanal confections.',
  },
  {
    emoji: '📖',
    title: 'Curated Stories',
    desc: 'A quiet haven library for slowing down, savoring tea, and reconnecting with timeless literature.',
  },
];

const AboutUsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.badgeContainer}>
          <Text style={styles.estBadge}>EST. 2026 • JABALPUR</Text>
        </View>
        <Text style={styles.heroTitle}>The Sanctuary Story 🌿</Text>
        <Text style={styles.heroSubtitle}>
          A botanical haven dedicated to the delicate art of slow living, mindful florals, and warm community.
        </Text>
      </View>

      {/* Hero Image */}
      <View style={styles.imageCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?q=80&w=1332&auto=format&fit=crop',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.imageCaption}>
          <Text style={styles.captionTag}>OUR PHILOSOPHY</Text>
          <Text style={styles.captionText}>"Slow down and let nature nourish your rhythm."</Text>
        </View>
      </View>

      {/* Narrative Section */}
      <View style={styles.content}>
        <View style={styles.storyCard}>
          <Text style={styles.storyHeading}>How It Began</Text>
          <Text style={styles.storyParagraph}>
            Reaina's Haven was born out of a simple belief: the most precious moments in life unfold when we pause and take notice. 
            Nestled in the heart of Jabalpur, our physical sanctuary and digital shop were founded to weave together the intoxicating fragrance of fresh blossoms, the soothing aroma of specialty coffee, and the soul-stirring depth of classic literature.
          </Text>
          <Text style={styles.storyParagraph}>
            Every bouquet is hand-tied by our florists, each daily tiffin meal is cooked using pure homestyle recipes, and every gift hamper is assembled with personalized handwritten stationery on seed paper.
          </Text>
        </View>

        {/* 4 Pillars */}
        <Text style={styles.sectionTitle}>The Four Sanctuary Pillars</Text>
        <View style={styles.pillarsGrid}>
          {PILLARS.map((pillar, idx) => (
            <View key={idx} style={styles.pillarCard}>
              <Text style={styles.pillarEmoji}>{pillar.emoji}</Text>
              <Text style={styles.pillarTitle}>{pillar.title}</Text>
              <Text style={styles.pillarDesc}>{pillar.desc}</Text>
            </View>
          ))}
        </View>

        {/* Sanctuary Location Box */}
        <View style={styles.locationBox}>
          <Text style={styles.locationTag}>VISIT OUR SANCTUARY</Text>
          <Text style={styles.locationTitle}>Reaina's Haven Sanctuary & Café</Text>
          <Text style={styles.locationAddress}>
            📍 Ranjhi Main Road, Near Botanical Circle, Jabalpur, Madhya Pradesh 482005
          </Text>
          <Text style={styles.locationHours}>
            ⏰ Open Daily: 9:00 AM – 10:00 PM
          </Text>
          <Text style={styles.locationPhone}>
            📞 Concierge: +91 94251 12345
          </Text>
        </View>

        {/* Quick Nav Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.actionBtnPrimary}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.actionBtnPrimaryText}>Browse Botanicals 💐</Text>
          </Pressable>
          <Pressable
            style={styles.actionBtnSecondary}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.actionBtnSecondaryText}>Say Hello 💬</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutUsScreen;

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
  badgeContainer: {
    marginBottom: 6,
  },
  estBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 2,
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
  imageCard: {
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
    backgroundColor: COLORS.surface,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  imageCaption: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  captionTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  captionText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  storyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  storyHeading: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  storyParagraph: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  pillarsGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  pillarCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  pillarEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  pillarTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  pillarDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  locationBox: {
    backgroundColor: '#efe9df',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  locationTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  locationTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  locationAddress: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  locationHours: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationPhone: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '700',
  },
  buttonRow: {
    gap: SPACING.md,
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  actionBtnPrimaryText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  actionBtnSecondaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
});
