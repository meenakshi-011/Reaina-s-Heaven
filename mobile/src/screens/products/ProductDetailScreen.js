import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { getProductById, getReviews, createReview } from '../../api/productApi';
import { toggleWishlist, getUserProfile } from '../../api/userApi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const { user, isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodData, reviewsData, profileData] = await Promise.all([
          getProductById(productId),
          getReviews().catch(() => []),
          isLoggedIn ? getUserProfile().catch(() => null) : null,
        ]);
        setProduct(prodData);
        // Filter reviews for this product or general
        setReviews(
          reviewsData?.filter(
            (r) =>
              r.productName?.toLowerCase() === prodData.name?.toLowerCase() ||
              r.section === prodData.productType?.toLowerCase()
          ) || []
        );
        if (profileData?.user?.wishlist) {
          const hasItem = profileData.user.wishlist.some(
            (w) => (typeof w === 'object' ? w._id === productId : w === productId)
          );
          setInWishlist(hasItem);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load product details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId, isLoggedIn]);

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      Alert.alert('Sign In', 'Please sign in to save items to your wishlist.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) },
      ]);
      return;
    }
    try {
      await toggleWishlist(product._id);
      setInWishlist((prev) => !prev);
      Alert.alert(
        inWishlist ? 'Removed' : 'Saved ❤️',
        inWishlist ? 'Removed from wishlist' : 'Added to your sanctuary wishlist!'
      );
    } catch (e) {
      Alert.alert('Error', 'Could not update wishlist');
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    addToCart(product, qty);
    setTimeout(() => {
      setAddingToCart(false);
      Alert.alert(
        '✨ Added to Cart!',
        `${product.name} × ${qty} added successfully.`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          {
            text: 'View Cart',
            onPress: () => navigation.navigate('Cart'),
          },
        ]
      );
    }, 400);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigation.navigate('Cart');
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      Alert.alert('Review Required', 'Please share your thoughts on this botanical piece.');
      return;
    }
    setSubmittingReview(true);
    try {
      const newRev = await createReview({
        userName: user?.name || 'Sanctuary Friend',
        userCity: 'Jabalpur',
        productName: product.name,
        section: product.productType?.toLowerCase() || 'general',
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviews((prev) => [newRev, ...prev]);
      setShowReviewModal(false);
      setReviewComment('');
      setReviewRating(5);
      Alert.alert('Thank you! 🌿', 'Your review has been shared with the community.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loading message="Loading sanctuary piece..." />;
  if (!product) return null;

  const imageSource = product.imageUrl
    ? { uri: product.imageUrl }
    : require('../../assets/placeholder.png');

  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />

          {/* Type Badge */}
          {product.productType && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{product.productType}</Text>
            </View>
          )}

          {/* Wishlist Button */}
          <Pressable style={styles.wishlistBtn} onPress={handleToggleWishlist}>
            <Text style={styles.wishlistHeart}>{inWishlist ? '❤️' : '🤍'}</Text>
          </Pressable>

          {/* Stock Badge */}
          <View style={[styles.stockBadge, (product.stock ?? 10) < 5 && styles.stockLow]}>
            <Text style={styles.stockText}>
              {(product.stock ?? 10) < 5 ? `Only ${product.stock} left!` : 'In Stock'}
            </Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoCard}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</Text>

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this botanical</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Includes */}
          {product.includes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's Included</Text>
              <View style={styles.includesBox}>
                <Text style={styles.includesEmoji}>🌸</Text>
                <Text style={styles.includesText}>{product.includes}</Text>
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.qtySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.qtyRow}>
              <Pressable
                style={[styles.qtyBtn, qty <= 1 && styles.qtyBtnDisabled]}
                onPress={() => qty > 1 && setQty(qty - 1)}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </Pressable>
              <Text style={styles.qtyValue}>{qty}</Text>
              <Pressable
                style={[styles.qtyBtn, qty >= (product.stock || 20) && styles.qtyBtnDisabled]}
                onPress={() => qty < (product.stock || 20) && setQty(qty + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* AI Helper Banner */}
          <Pressable
            style={styles.aiHelper}
            onPress={() => navigation.navigate('AIAssistant')}
          >
            <Text style={styles.aiHelperEmoji}>✨</Text>
            <View style={styles.aiHelperText}>
              <Text style={styles.aiHelperTitle}>Ask Haven AI about this item</Text>
              <Text style={styles.aiHelperDesc}>Stem care advice, delivery timelines & custom notes</Text>
            </View>
            <Text style={styles.aiHelperArrow}>→</Text>
          </Pressable>

          {/* Reviews Header */}
          <View style={styles.reviewsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Customer Reviews ({reviews.length})</Text>
              <Text style={styles.reviewSub}>Verified notes from botanical patrons</Text>
            </View>
            <Pressable style={styles.writeReviewBtn} onPress={() => setShowReviewModal(true)}>
              <Text style={styles.writeReviewText}>+ Write Review</Text>
            </Pressable>
          </View>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <Text style={styles.noReviewsText}>Be the first to review this sanctuary piece!</Text>
          ) : (
            reviews.slice(0, 4).map((rev, idx) => (
              <View key={rev._id || idx} style={styles.reviewCard}>
                <View style={styles.reviewHead}>
                  <Text style={styles.reviewUser}>🌿 {rev.userName}</Text>
                  <Text style={styles.reviewRating}>{'★'.repeat(rev.rating)}</Text>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))
          )}

          {/* Policy Info */}
          <View style={styles.policyRow}>
            {[
              { emoji: '🚚', text: 'Free delivery above ₹1,500' },
              { emoji: '🌿', text: '100% handmade stems' },
              { emoji: '🔄', text: 'Sanctuary freshness guarantee' },
            ].map((item, i) => (
              <View key={i} style={styles.policyItem}>
                <Text>{item.emoji}</Text>
                <Text style={styles.policyText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <Pressable
          style={({ pressed }) => [styles.addCartBtn, pressed && styles.btnPressed]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.addCartBtnText}>Add to Cart 🛒</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.buyNowBtn, pressed && styles.btnPressed]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyNowBtnText}>Buy Now ✨</Text>
        </Pressable>
      </View>

      {/* Write Review Modal */}
      <Modal visible={showReviewModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Share Your Review</Text>
            <Text style={styles.modalSub}>{product.name}</Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Pressable key={s} onPress={() => setReviewRating(s)}>
                  <Text style={[styles.starBtn, reviewRating >= s && styles.starActive]}>★</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              multiline
              placeholder="What made this botanical piece special to you?"
              value={reviewComment}
              onChangeText={setReviewComment}
            />

            <View style={styles.modalBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowReviewModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.submitRevBtn, submittingReview && { opacity: 0.6 }]}
                disabled={submittingReview}
                onPress={handleSubmitReview}
              >
                <Text style={styles.submitRevBtnText}>
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  imageContainer: {
    width,
    height: width * 0.85,
    backgroundColor: COLORS.surfaceAlt,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  typeBadge: {
    position: 'absolute',
    top: SPACING.base,
    left: SPACING.base,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  wishlistBtn: {
    position: 'absolute',
    top: SPACING.base,
    right: SPACING.base,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  wishlistHeart: {
    fontSize: 20,
  },
  stockBadge: {
    position: 'absolute',
    bottom: SPACING.base,
    left: SPACING.base,
    backgroundColor: 'rgba(45, 58, 45, 0.85)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  stockLow: {
    backgroundColor: '#e53e3e',
  },
  stockText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  price: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.primary,
  },
  section: {
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  includesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  includesEmoji: { fontSize: 20 },
  includesText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    flex: 1,
  },
  qtySection: {
    marginTop: SPACING.sm,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: 6,
  },
  qtyBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { opacity: 0.3 },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  qtyValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  aiHelper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b2f27',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  aiHelperEmoji: { fontSize: 24 },
  aiHelperText: { flex: 1 },
  aiHelperTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
    color: '#fff',
  },
  aiHelperDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  aiHelperArrow: {
    fontSize: FONT_SIZES.base,
    color: COLORS.secondary,
    fontWeight: '800',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  reviewSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  writeReviewBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  writeReviewText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noReviewsText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginVertical: SPACING.sm,
  },
  reviewCard: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  reviewHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviewRating: {
    color: '#f59e0b',
    fontSize: 12,
  },
  reviewComment: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  policyRow: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  policyText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  actionBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  addCartBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.full,
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addCartBtnText: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: FONT_SIZES.sm,
    letterSpacing: 0.5,
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    padding: SPACING.md,
    alignItems: 'center',
  },
  buyNowBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: FONT_SIZES.sm,
    letterSpacing: 0.5,
  },
  btnPressed: { opacity: 0.8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  modalSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  starRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  starBtn: {
    fontSize: 28,
    color: COLORS.borderLight,
  },
  starActive: {
    color: '#f59e0b',
  },
  reviewInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.sm,
    height: 90,
    marginBottom: SPACING.md,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  submitRevBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  submitRevBtnText: {
    fontWeight: '800',
    color: '#fff',
  },
});

export default ProductDetailScreen;
