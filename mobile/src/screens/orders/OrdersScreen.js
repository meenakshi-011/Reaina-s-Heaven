import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyOrders } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS, ORDER_STATUS_COLORS } from '../../constants/theme';

const OrdersScreen = ({ navigation }) => {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setError(null);
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoggedIn]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrders();
    }, [loadOrders])
  );

  if (!isLoggedIn) {
    return (
      <EmptyState
        emoji="🔐"
        title="Please Login"
        message="Sign in to view your orders."
        actionLabel="Login"
        onAction={() => navigation.navigate('Auth', { screen: 'Login' })}
      />
    );
  }

  if (loading) return <Loading message="Loading your orders..." />;

  if (error) {
    return (
      <EmptyState
        emoji="⚠️"
        title="Couldn't load orders"
        message={error}
        actionLabel="Try Again"
        onAction={loadOrders}
      />
    );
  }

  const renderOrder = ({ item }) => {
    const statusColors = ORDER_STATUS_COLORS[item.status] || ORDER_STATUS_COLORS['Processing'];
    const orderIdShort = item._id?.slice(-8).toUpperCase();
    const date = new Date(item.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <Pressable
        style={({ pressed }) => [styles.orderCard, pressed && styles.orderCardPressed]}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>#{orderIdShort}</Text>
            <Text style={styles.orderDate}>{date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Items Preview */}
        <View style={styles.itemsPreview}>
          {item.orderItems?.slice(0, 2).map((oi, idx) => (
            <Text key={idx} style={styles.itemName} numberOfLines={1}>
              • {oi.name} × {oi.qty}
            </Text>
          ))}
          {item.orderItems?.length > 2 && (
            <Text style={styles.moreItems}>
              +{item.orderItems.length - 2} more item{item.orderItems.length - 2 !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{item.totalPrice?.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentText}>
              {item.isPaid ? '✅ Paid' : item.paymentMethod}
            </Text>
          </View>
          <Text style={styles.viewDetails}>View →</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadOrders(); }}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji="📦"
            title="No orders yet"
            message="Your orders will appear here once you place them."
            actionLabel="Start Shopping"
            onAction={() => navigation.navigate('Home')}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.base, gap: SPACING.base, paddingBottom: SPACING['2xl'] },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    gap: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  orderCardPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 1 },
  orderDate: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusText: { fontSize: FONT_SIZES.xs, fontWeight: '700' },
  itemsPreview: { gap: 3 },
  itemName: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  moreItems: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontStyle: 'italic' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  totalLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  totalValue: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.primary },
  paymentBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  paymentText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontWeight: '600' },
  viewDetails: { fontSize: FONT_SIZES.sm, color: COLORS.accent, fontWeight: '700' },
});

export default OrdersScreen;
