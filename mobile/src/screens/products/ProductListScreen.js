import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { getProducts } from '../../api/productApi';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'Bouquet', label: 'Bouquets', emoji: '💐' },
  { id: 'Hamper', label: 'Hampers', emoji: '🧺' },
];

const ProductListScreen = ({ navigation }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || p.productType === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading message="Loading products..." />;

  if (error) {
    return (
      <EmptyState
        emoji="⚠️"
        title="Oops!"
        message={error}
        actionLabel="Try Again"
        onAction={loadProducts}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Search & Filters */}
      <View style={styles.header}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search bouquets, hampers..."
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTER_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.chip, activeFilter === cat.id && styles.chipActive]}
              onPress={() => setActiveFilter(cat.id)}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  activeFilter === cat.id && styles.chipLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Product Count */}
      <Text style={styles.countText}>
        {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
      </Text>

      {/* Product Grid */}
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
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
            onAddToCart={(p) => addToCart(p, 1)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🌸"
            title="No products found"
            message="Try a different search or filter."
            actionLabel="Clear Search"
            onAction={() => {
              setSearch('');
              setActiveFilter('all');
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.base,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  filtersRow: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipEmoji: { fontSize: FONT_SIZES.sm },
  chipLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '600' },
  chipLabelActive: { color: '#fff' },
  countText: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['2xl'],
  },
  columnWrapper: { justifyContent: 'space-between' },
});

export default ProductListScreen;
