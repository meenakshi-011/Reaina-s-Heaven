import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart, cartItemsCount } = useCart();

  const handleRemove = (cartItemId, name) => {
    Alert.alert(
      'Remove Item',
      `Remove "${name}" from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(cartItemId) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        emoji="🛒"
        title="Your cart is empty"
        message="Add some products from our collection to get started."
        actionLabel="Start Shopping"
        onAction={() => navigation.navigate('Products')}
      />
    );
  }

  const shippingFee = cartTotal >= 1500 ? 0 : 49;
  const finalTotal = cartTotal + shippingFee;

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={item.image ? { uri: item.image } : require('../../assets/placeholder.png')}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price?.toLocaleString('en-IN')}</Text>
        <View style={styles.qtyRow}>
          <Pressable
            style={[styles.qtyBtn, item.qty <= 1 && styles.qtyBtnDisabled]}
            onPress={() => item.qty > 1 ? updateQty(item.cartItemId, item.qty - 1) : handleRemove(item.cartItemId, item.name)}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{item.qty}</Text>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => updateQty(item.cartItemId, item.qty + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
          <Pressable
            style={styles.removeBtn}
            onPress={() => handleRemove(item.cartItemId, item.name)}
          >
            <Text style={styles.removeBtnText}>🗑</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.itemTotal}>
        ₹{(item.price * item.qty)?.toLocaleString('en-IN')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cart Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart ({cartItemsCount} items)</Text>
        <Pressable onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.cartItemId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{cartTotal.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, shippingFee === 0 && styles.freeText]}>
                {shippingFee === 0 ? 'FREE 🎉' : `₹${shippingFee}`}
              </Text>
            </View>
            {shippingFee > 0 && (
              <Text style={styles.freeHint}>
                Add ₹{(1500 - cartTotal).toLocaleString('en-IN')} more for free delivery!
              </Text>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{finalTotal.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        }
      />

      {/* Checkout Button */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>₹{finalTotal.toLocaleString('en-IN')}</Text>
          <Text style={styles.checkoutSub}>{cartItemsCount} item{cartItemsCount !== 1 ? 's' : ''}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.checkoutBtn, pressed && styles.btnPressed]}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.textPrimary },
  clearText: { fontSize: FONT_SIZES.sm, color: COLORS.error, fontWeight: '600' },
  list: { padding: SPACING.base, gap: SPACING.sm, paddingBottom: SPACING['2xl'] },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    gap: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
  },
  itemInfo: { flex: 1, gap: SPACING.xs },
  itemName: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 18 },
  itemPrice: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xs },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { borderColor: COLORS.border, opacity: 0.5 },
  qtyBtnText: { fontSize: FONT_SIZES.base, color: COLORS.accent, fontWeight: '600', lineHeight: 24 },
  qtyValue: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  removeBtn: { marginLeft: SPACING.xs, padding: 2 },
  removeBtnText: { fontSize: FONT_SIZES.base },
  itemTotal: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.primaryGreen, alignSelf: 'center' },
  summaryCard: {
    marginTop: SPACING.base,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.sm,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  summaryTitle: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  summaryValue: { fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, fontWeight: '600' },
  freeText: { color: COLORS.success, fontWeight: '700' },
  freeHint: { fontSize: FONT_SIZES.xs, color: COLORS.accent, fontStyle: 'italic' },
  totalRow: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: SPACING.xs,
  },
  totalLabel: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.textPrimary },
  totalValue: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.primaryGreen },
  checkoutBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.lg,
  },
  checkoutTotal: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.primaryGreen },
  checkoutSub: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  checkoutBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    ...SHADOWS.md,
  },
  btnPressed: { opacity: 0.85 },
  checkoutBtnText: { color: '#ffffff', fontWeight: '800', fontSize: FONT_SIZES.sm, letterSpacing: 0.5, textTransform: 'uppercase' },
});

export default CartScreen;
