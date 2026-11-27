import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCafeItems } from '../../api/productApi';
import { useCart } from '../../context/CartContext';
import CafeCard from '../../components/CafeCard';
import SearchBar from '../../components/SearchBar';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const CafeScreen = ({ navigation }) => {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    try {
      const data = await getCafeItems();
      setItems(data || []);
      // Extract unique main categories
      const cats = ['all', ...new Set(data.map((i) => i.category?.trim()).filter(Boolean))];
      setCategories(cats);
    } catch (err) {
      console.warn('Cafe load error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase()) ||
      item.subCategory?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || item.category?.trim() === activeCategory?.trim();
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loading message="Loading café menu..." />;

  return (
    <View style={styles.container}>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>☕ Our Kitchen</Text>
        <Text style={styles.heroSubtitle}>100% Handmade · No Preservatives</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search café items..."
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.chip, activeCategory === cat && styles.chipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
              {cat === 'all' ? '☕ All' : cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Item count */}
      <Text style={styles.countText}>
        {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadItems(); }}
            tintColor={COLORS.primary}
          />
        }
        renderItem={({ item }) => (
          <CafeCard
            item={item}
            onPress={() => navigation.navigate('CafeDetail', { itemId: item._id })}
            onAddToCart={(c) => addToCart(c, 1)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="☕"
            title="No items found"
            message="Try a different search or category."
            actionLabel="Clear"
            onAction={() => { setSearch(''); setActiveCategory('all'); }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  heroBanner: {
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  heroTitle: { fontSize: FONT_SIZES['2xl'], fontWeight: '800', color: COLORS.textPrimary },
  heroSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.accent, marginTop: 4, fontWeight: '600', letterSpacing: 0.5 },
  searchWrapper: { padding: SPACING.base },
  categoryRow: { paddingHorizontal: SPACING.base, gap: SPACING.sm, paddingBottom: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },
  countText: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  list: { paddingHorizontal: SPACING.base, paddingBottom: SPACING['2xl'] },
  columnWrapper: { justifyContent: 'space-between' },
});

export default CafeScreen;
