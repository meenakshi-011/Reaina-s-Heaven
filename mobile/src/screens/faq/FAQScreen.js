import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const FAQ_DATA = [
  {
    category: 'Orders & Delivery',
    questions: [
      {
        q: 'Do you offer same-day delivery in Jabalpur?',
        a: 'Yes! Orders placed before 4:00 PM for bouquets and café items are eligible for same-day priority delivery within Jabalpur municipal limits (Civil Lines, Ranjhi, Napier Town, Vijay Nagar, Gorakhpur, etc.).',
      },
      {
        q: 'How are fresh flowers packaged for delivery?',
        a: 'All our bouquets are hydration-packed with eco-friendly wet wraps at the stems, protected inside breathable botanical sleeves, and delivered in sturdy upright carriers to prevent wilting or crushing.',
      },
      {
        q: 'Can I track my delivery in real time?',
        a: 'Yes! Head to the "My Orders" tab in your profile to view live tracking updates, rider status, and order timeline milestones.',
      },
    ],
  },
  {
    category: 'Café & Tiffin Services',
    questions: [
      {
        q: 'How does the Jabalpur Daily Tiffin Subscription work?',
        a: 'Our tiffin service delivers pure vegetarian, freshly cooked homestyle meals daily. You can choose lunch (12:00 PM – 1:30 PM), dinner (7:30 PM – 9:00 PM), or both. You can pause or resume deliveries anytime through our concierge with 12 hours notice.',
      },
      {
        q: 'Can I customize my meals for dietary restrictions?',
        a: 'Absolutely! We accommodate Jain meals (no onion/garlic), diabetic-friendly options, and reduced-oil preferences upon request.',
      },
      {
        q: 'Are café items available for takeaway and delivery?',
        a: 'Yes! Our full café menu — including specialty pour-overs, cold brews, artisanal brownies, and sourdough toasts — can be ordered via the app.',
      },
    ],
  },
  {
    category: 'Customization & Hampers',
    questions: [
      {
        q: 'Can I build my own customized gift hamper?',
        a: 'Yes! Visit our "Bespoke Atelier" / Customization Studio tab to pick your container (wicker basket or wooden crate), add fresh florals, specialty coffee beans, soy candles, and write a personalized handwritten card.',
      },
      {
        q: 'Do you offer corporate or wedding bulk gifting?',
        a: 'Yes, we specialize in curated artisan hampers for corporate milestones and weddings. Reach out through the Services or Contact tab for custom branding and volume pricing.',
      },
    ],
  },
  {
    category: 'Workshops & Library',
    questions: [
      {
        q: 'How do I reserve a book from The Haven Library?',
        a: 'Simply browse the "Library" section in the app, select any title, and tap "Reserve Book". Your copy will be set aside at our sanctuary café for up to 14 days.',
      },
      {
        q: 'Are materials provided for the hands-on workshops?',
        a: 'Yes! All workshops (clay pottery, floral design, candle crafting, coffee cupping) provide all necessary raw materials, tools, and take-home creations.',
      },
    ],
  },
  {
    category: 'Returns & Cancellations',
    questions: [
      {
        q: 'What is your refund policy on fresh floral orders?',
        a: 'Since fresh florals are perishable, please inspect upon delivery. If your bouquet arrived damaged or wilted, notify us within 2 hours with photos for a prompt free replacement or refund.',
      },
      {
        q: 'Can I cancel a scheduled order?',
        a: 'Orders can be cancelled free of charge before preparation begins. For custom hampers and workshop bookings, cancellations are accepted up to 24 hours prior.',
      },
    ],
  },
];

const FAQScreen = () => {
  const [search, setSearch] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null); // format: `${catIdx}-${qIdx}`

  const toggleExpand = (key) => {
    setExpandedIndex((prev) => (prev === key ? null : key));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.tagline}>HELP & GUIDANCE</Text>
        <Text style={styles.heroTitle}>Frequently Asked Questions ❓</Text>
        <Text style={styles.heroSubtitle}>
          Everything you need to know about deliveries, our Jabalpur sanctuary, and artisan care.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions or keywords..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <Text style={{ color: COLORS.textMuted }}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Categories & Questions */}
      <View style={styles.content}>
        {FAQ_DATA.map((cat, catIdx) => {
          const matchingQuestions = cat.questions.filter(
            (item) =>
              !search ||
              item.q.toLowerCase().includes(search.toLowerCase()) ||
              item.a.toLowerCase().includes(search.toLowerCase())
          );

          if (matchingQuestions.length === 0) return null;

          return (
            <View key={cat.category} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{cat.category}</Text>

              <View style={styles.questionsList}>
                {matchingQuestions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isExpanded = expandedIndex === key;

                  return (
                    <View key={qIdx} style={styles.questionBlock}>
                      <Pressable
                        style={styles.questionHeader}
                        onPress={() => toggleExpand(key)}
                      >
                        <Text style={styles.questionText}>{item.q}</Text>
                        <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
                      </Pressable>

                      {isExpanded && (
                        <View style={styles.answerBox}>
                          <Text style={styles.answerText}>{item.a}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FAQScreen;

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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  categoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  questionsList: {
    gap: 8,
  },
  questionBlock: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  questionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: 10,
    lineHeight: 20,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  answerBox: {
    backgroundColor: '#fbf9f6',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: 4,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
