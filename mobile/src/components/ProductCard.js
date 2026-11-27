import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.base * 2 - SPACING.sm) / 2;

const ProductCard = ({ product, onPress, onAddToCart }) => {
  const imgUrl = product.imageUrl || product.imageurl || product.image;
  const imageSource =
    imgUrl
      ? { uri: imgUrl }
      : require('../assets/placeholder.png');

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      {/* Product Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Type Badge */}
        {product.productType && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{product.productType}</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</Text>
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
            onPress={(e) => {
              e.stopPropagation?.();
              onAddToCart?.(product);
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
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH * 1.05,
    backgroundColor: COLORS.surfaceAlt,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  info: {
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  name: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  price: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.primaryGreen,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: {
    backgroundColor: COLORS.accentHover,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.lg,
    fontWeight: '300',
    lineHeight: 28,
  },
});

export default ProductCard;
