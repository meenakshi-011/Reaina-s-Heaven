import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.base * 2 - SPACING.sm) / 2;

// CafeCard mirrors the quantityOptions pricing system from cafe schema
const CafeCard = ({ item, onPress, onAddToCart }) => {
  const basePrice =
    item.quantityOptions?.length > 0
      ? item.quantityOptions[0].price
      : item.price || 0;

  const imageSource = item.imageurl
    ? { uri: item.imageurl }
    : require('../assets/placeholder.png');

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {/* Veg/Non-veg indicator */}
        <View style={[styles.foodBadge, item.item_type === 'non-veg' && styles.nonVegBadge]}>
          <View style={[styles.foodDot, item.item_type === 'non-veg' && styles.nonVegDot]} />
        </View>
        {/* Healthy badge */}
        {item.is_healthy && (
          <View style={styles.healthyBadge}>
            <Text style={styles.healthyText}>🌿 Healthy</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {item.subCategory || item.category}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.item_name}
        </Text>
        {/* Spice level */}
        {item.spiceLevel && item.spiceLevel !== 'Mild' && (
          <Text style={styles.spice}>
            {item.spiceLevel === 'Spicy' ? '🌶️🌶️' : '🌶️'} {item.spiceLevel}
          </Text>
        )}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>₹{basePrice}</Text>
            {item.quantityOptions?.length > 1 && (
              <Text style={styles.options}>{item.quantityOptions.length} sizes</Text>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
            onPress={(e) => {
              e.stopPropagation?.();
              onAddToCart?.(item);
            }}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.base,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: COLORS.surfaceAlt,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  foodBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#388e3c',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nonVegBadge: { borderColor: '#d32f2f' },
  foodDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#388e3c',
  },
  nonVegDot: { backgroundColor: '#d32f2f' },
  healthyBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(39, 174, 96, 0.9)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  healthyText: { color: '#fff', fontSize: FONT_SIZES.xs, fontWeight: '600' },
  info: { padding: SPACING.md, gap: 3 },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  name: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
    lineHeight: 18,
  },
  spice: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  price: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.primary },
  options: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: { backgroundColor: '#8b5e35' },
  addBtnText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '300', lineHeight: 28 },
});

export default CafeCard;
