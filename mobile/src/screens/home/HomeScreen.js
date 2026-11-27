import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProducts } from '../../api/productApi';
import { getCafeItems } from '../../api/productApi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';
import CafeCard from '../../components/CafeCard';
import SearchBar from '../../components/SearchBar';
import Loading from '../../components/Loading';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Category chips for quick filter
const HOME_CATEGORIES = [
  { id: 'all', label: 'All Products', emoji: '✨' },
  { id: 'Bouquet', label: 'Bouquets', emoji: '💐' },
  { id: 'Hamper', label: 'Hampers', emoji: '🧺' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addToCart, cartItemsCount } = useCart();

  const [products, setProducts] = useState([]);
  const [cafeItems, setCafeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      const [prods, cafe] = await Promise.all([getProducts(), getCafeItems()]);
      setProducts(prods || []);
      setCafeItems(cafe || []);
    } catch (err) {
      console.warn('Home load error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' ||
      activeCategory === 'cafe' ||
      p.productType === activeCategory ||
      p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCafe = cafeItems.filter((c) => {
    const matchesSearch =
      !search ||
      c.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading) return <Loading message="Loading your sanctuary..." />;

  const featuredProducts = products.slice(0, 6);
  const featuredCafe = cafeItems.slice(0, 4);

  const renderProductCard = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('Products', { screen: 'ProductDetail', params: { productId: item._id } })}
      onAddToCart={(p) => addToCart(p, 1)}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>
            {user ? `Hello, ${user.name?.split(' ')[0]}! 🌿` : 'Welcome 🌿'}
          </Text>
          <Text style={styles.heroTitle}>Reaina's Haven</Text>
          <Text style={styles.heroSubtitle}>
            Flowers · Café · Hampers · Books
          </Text>
          <Text style={styles.heroDesc}>
            Handcrafted with love from Jabalpur
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search flowers, café, hampers..."
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {HOME_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[styles.chip, activeCategory === cat.id && styles.chipActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={styles.chipEmoji}>{cat.emoji}</Text>
            <Text style={[styles.chipLabel, activeCategory === cat.id && styles.chipLabelActive]}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Quick CTAs */}
      <View style={styles.ctaRow}>
        <Pressable
          style={[styles.ctaCard, { backgroundColor: '#166534' }]}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.ctaEmoji}>💐</Text>
          <Text style={styles.ctaTitle}>Shop Gifts</Text>
          <Text style={styles.ctaDesc}>Bouquets & Hampers</Text>
        </Pressable>
        <Pressable
          style={[styles.ctaCard, { backgroundColor: '#a67c52' }]}
          onPress={() => navigation.navigate('Cafe')}
        >
          <Text style={styles.ctaEmoji}>☕</Text>
          <Text style={styles.ctaTitle}>Café Menu</Text>
          <Text style={styles.ctaDesc}>100% Handmade Treats</Text>
        </Pressable>
      </View>

      {/* Featured Products */}
      {(activeCategory === 'all' || activeCategory === 'Bouquet' || activeCategory === 'Hamper') && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💐 Gifts & Flowers</Text>
            <Pressable onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All →</Text>
            </Pressable>
          </View>
          <FlatList
            data={search ? filteredProducts : featuredProducts}
            keyExtractor={(item) => item._id}
            renderItem={renderProductCard}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products found.</Text>
            }
          />
        </View>
      )}

      {/* Café Section */}
      {(activeCategory === 'all' || activeCategory === 'cafe') && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>☕ From Our Kitchen</Text>
            <Pressable onPress={() => navigation.navigate('Cafe')}>
              <Text style={styles.seeAll}>See All →</Text>
            </Pressable>
          </View>
          <FlatList
            data={search ? filteredCafe : featuredCafe}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CafeCard
                item={item}
                onPress={() =>
                  navigation.navigate('Cafe', { screen: 'CafeDetail', params: { itemId: item._id } })
                }
                onAddToCart={(c) => addToCart(c, 1)}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No café items found.</Text>
            }
          />
        </View>
      )}

      {/* Speciality Services (Tiffin, Custom Cakes, Instant Delivery) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>✨ Speciality Services</Text>
          <Pressable onPress={() => navigation.navigate('Services')}>
            <Text style={styles.seeAll}>All Services →</Text>
          </Pressable>
        </View>

        <View style={styles.servicesStack}>
          {/* 1. Tiffin Services */}
          <Pressable
            style={styles.serviceItemCard}
            onPress={() => navigation.navigate('Services', { scrollTo: 'tiffin' })}
          >
            <View style={styles.serviceItemHeader}>
              <View style={[styles.serviceEmojiBadge, { backgroundColor: '#f0fdf4' }]}>
                <Text style={styles.serviceEmoji}>🍱</Text>
              </View>
              <View style={styles.serviceItemText}>
                <View style={styles.serviceTagRow}>
                  <Text style={styles.serviceItemBadge}>DAILY HOMESTYLE TIFFIN</Text>
                  <Text style={styles.servicePriceHint}>From ₹119</Text>
                </View>
                <Text style={styles.serviceItemTitle}>Authentic Tiffin Services</Text>
                <Text style={styles.serviceItemSubtitle} numberOfLines={2}>
                  Pure, wholesome home-cooked thalis delivered to your office desk or home in Jabalpur.
                </Text>
              </View>
            </View>
            <View style={styles.serviceItemFooter}>
              <Text style={styles.serviceWindowText}>🕒 Lunch 12:30–2:00 PM · Dinner 7:30–9:00 PM</Text>
              <Text style={styles.serviceActionText}>Subscribe / Test →</Text>
            </View>
          </Pressable>

          {/* 2. Custom Cake Services */}
          <Pressable
            style={styles.serviceItemCard}
            onPress={() => navigation.navigate('Services', { scrollTo: 'cakes' })}
          >
            <View style={styles.serviceItemHeader}>
              <View style={[styles.serviceEmojiBadge, { backgroundColor: '#fff1f2' }]}>
                <Text style={styles.serviceEmoji}>🎂</Text>
              </View>
              <View style={styles.serviceItemText}>
                <View style={styles.serviceTagRow}>
                  <Text style={[styles.serviceItemBadge, { color: '#be123c', backgroundColor: '#ffe4e6' }]}>
                    100% PURE EGGLESS
                  </Text>
                  <Text style={styles.servicePriceHint}>Artisan Bakery</Text>
                </View>
                <Text style={styles.serviceItemTitle}>Custom Cake Services</Text>
                <Text style={styles.serviceItemSubtitle} numberOfLines={2}>
                  Bespoke celebration cakes with Belgian chocolate, French butter & farm-fresh berries.
                </Text>
              </View>
            </View>
            <View style={styles.serviceItemFooter}>
              <Text style={styles.serviceWindowText}>🌙 Midnight Surprise Delivery 11:30 PM–12:15 AM</Text>
              <Text style={styles.serviceActionText}>Custom Cakes →</Text>
            </View>
          </Pressable>

          {/* 3. Instant Food Delivery */}
          <Pressable
            style={styles.serviceItemCard}
            onPress={() => navigation.navigate('Services', { scrollTo: 'instant-delivery' })}
          >
            <View style={styles.serviceItemHeader}>
              <View style={[styles.serviceEmojiBadge, { backgroundColor: '#ecfdf5' }]}>
                <Text style={styles.serviceEmoji}>⚡</Text>
              </View>
              <View style={styles.serviceItemText}>
                <View style={styles.serviceTagRow}>
                  <Text style={[styles.serviceItemBadge, { color: '#166534', backgroundColor: '#dcfce7' }]}>
                    30–45 MINS DISPATCH
                  </Text>
                  <Text style={styles.servicePriceHint}>Cloud Kitchen</Text>
                </View>
                <Text style={styles.serviceItemTitle}>Instant Food Delivery</Text>
                <Text style={styles.serviceItemSubtitle} numberOfLines={2}>
                  Gourmet pastas, sourdough melts, thin-crust pizzas & artisan shakes delivered hot.
                </Text>
              </View>
            </View>
            <View style={styles.serviceItemFooter}>
              <Text style={styles.serviceWindowText}>🍳 100% Fresh Cooked on Order</Text>
              <Text style={styles.serviceActionText}>Order Express →</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Sanctuary Story & About Card */}
      <Pressable
        style={styles.storyCard}
        onPress={() => navigation.navigate('AboutUs')}
      >
        <View style={styles.storyContent}>
          <Text style={styles.storyBadge}>OUR STORY</Text>
          <Text style={styles.storyTitle}>A Haven for Slow Living 🌿</Text>
          <Text style={styles.storyDesc}>
            Discover our Jabalpur sanctuary — where fresh botanical blooms, specialty coffee, and quiet book corners meet.
          </Text>
          <Text style={styles.storyLink}>Read the Sanctuary Story →</Text>
        </View>
      </Pressable>

      {/* AI Assistant CTA */}
      <View style={styles.aiCard}>
        <Text style={styles.aiEmoji}>✨</Text>
        <View style={styles.aiText}>
          <Text style={styles.aiTitle}>Haven AI Assistant</Text>
          <Text style={styles.aiDesc}>
            Ask me about bouquets, same-day delivery, or gift suggestions!
          </Text>
        </View>
        <Pressable
          style={styles.aiBtn}
          onPress={() => navigation.navigate('AIAssistant')}
        >
          <Text style={styles.aiBtnText}>Chat →</Text>
        </Pressable>
      </View>

      {/* Clickable Policies Quick Links */}
      <View style={styles.policyRow}>
        <Pressable
          style={styles.policyItem}
          onPress={() => navigation.navigate('ShippingPolicy')}
        >
          <Text style={styles.policyEmoji}>🚚</Text>
          <Text style={styles.policyLabel}>Free delivery above ₹1,500</Text>
        </Pressable>
        <Pressable
          style={styles.policyItem}
          onPress={() => navigation.navigate('RefundPolicy')}
        >
          <Text style={styles.policyEmoji}>🔄</Text>
          <Text style={styles.policyLabel}>Sanctuary Care & Refund</Text>
        </Pressable>
        <Pressable
          style={styles.policyItem}
          onPress={() => navigation.navigate('FAQ')}
        >
          <Text style={styles.policyEmoji}>❓</Text>
          <Text style={styles.policyLabel}>Customer FAQ & Help</Text>
        </Pressable>
      </View>

      <View style={{ height: SPACING['3xl'] }} />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['3xl'],
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: RADIUS['2xl'],
    borderBottomRightRadius: RADIUS['2xl'],
  },
  heroContent: { gap: SPACING.xs },
  greeting: {
    fontSize: FONT_SIZES.base,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.base,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  heroDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  searchWrapper: {
    marginHorizontal: SPACING.base,
    marginTop: -SPACING.xl,
    zIndex: 10,
  },
  categoriesRow: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  chipActive: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  chipEmoji: { fontSize: FONT_SIZES.sm },
  chipLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipLabelActive: { color: COLORS.textLight },
  ctaRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  ctaCard: {
    flex: 1,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    gap: SPACING.xs,
    ...SHADOWS.md,
  },
  ctaEmoji: { fontSize: 28 },
  ctaTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: '#fff',
  },
  ctaDesc: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.85)' },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.base },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  seeAll: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontWeight: '700',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    padding: SPACING.xl,
  },
  aiCard: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  aiEmoji: { fontSize: 32 },
  aiText: { flex: 1, gap: 2 },
  aiTitle: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.textPrimary },
  aiDesc: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, lineHeight: 16 },
  aiBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  aiBtnText: { color: '#ffffff', fontWeight: '700', fontSize: FONT_SIZES.sm },
  policyRow: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    gap: SPACING.sm,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  policyEmoji: { fontSize: FONT_SIZES.lg },
  policyLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  servicesStack: {
    gap: SPACING.md,
  },
  serviceItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
    gap: SPACING.sm,
  },
  serviceItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  serviceEmojiBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: {
    fontSize: 22,
  },
  serviceItemText: {
    flex: 1,
    gap: 3,
  },
  serviceTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceItemBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryGreen,
    backgroundColor: 'rgba(22, 101, 52, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    letterSpacing: 0.5,
  },
  servicePriceHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    fontWeight: '700',
  },
  serviceItemTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  serviceItemSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  serviceItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  serviceWindowText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  serviceActionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
    color: COLORS.accent,
  },
  storyCard: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  storyBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  storyTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  storyDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 8,
  },
  storyLink: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
    color: COLORS.primary,
  },
});


export default HomeScreen;
