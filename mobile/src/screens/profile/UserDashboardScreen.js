import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getUserProfile, updateUserProfile, getUserActivity, toggleWishlist } from '../../api/userApi';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const TABS = [
  { id: 'wishlist', label: 'Wishlist', emoji: '❤️' },
  { id: 'activity', label: 'Activity', emoji: '⚡' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
];

const UserDashboardScreen = ({ navigation }) => {
  const { user, login } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('wishlist');
  const [profile, setProfile] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Settings form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      const [profileData, actData] = await Promise.all([
        getUserProfile().catch(() => null),
        getUserActivity().catch(() => []),
      ]);

      if (profileData?.user) {
        setProfile(profileData.user);
        setName(profileData.user.name || '');
        setEmail(profileData.user.email || '');
        setWishlist(profileData.user.wishlist || []);
      }
      setActivities(actData || []);
    } catch (err) {
      console.warn('Dashboard load error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      setWishlist((prev) => prev.filter((p) => (typeof p === 'object' ? p._id !== productId : p !== productId)));
      Alert.alert('Removed', 'Item removed from your wishlist.');
    } catch (err) {
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    Alert.alert(
      'Added to Cart! 🛒',
      `${product.name} added to your basket.`,
      [
        { text: 'Keep Browsing', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setUpdating(true);
    try {
      const res = await updateUserProfile({ name, email });
      Alert.alert('Success', 'Profile updated successfully!');
      if (res?.user) {
        setProfile(res.user);
      }
    } catch (err) {
      Alert.alert('Update Failed', err.response?.data?.message || 'Could not update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading message="Loading your sanctuary dashboard..." />;

  const displayUser = profile || user;

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>
            {displayUser?.name?.slice(0, 2).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{displayUser?.name || 'Sanctuary Friend'}</Text>
          <Text style={styles.userEmail}>{displayUser?.email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeTxt}>🌱 Sanctuary Member</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            style={[styles.tabItem, activeTab === t.id && styles.tabItemActive]}
            onPress={() => setActiveTab(t.id)}
          >
            <Text style={styles.tabEmoji}>{t.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === t.id && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* ── WISHLIST TAB ── */}
        {activeTab === 'wishlist' && (
          <View style={styles.tabContent}>
            {wishlist.length === 0 ? (
              <EmptyState
                emoji="❤️"
                title="Your Wishlist is Empty"
                message="Save botanical bouquets, artisanal treats, and books to revisit anytime."
                actionLabel="Explore Botanicals"
                onAction={() => navigation.navigate('Products')}
              />
            ) : (
              <View style={styles.wishlistGrid}>
                {wishlist.map((item, idx) => {
                  const prod = typeof item === 'object' ? item : { _id: item, name: 'Sanctuary Item', price: 999 };
                  return (
                    <View key={prod._id || idx} style={styles.wishCard}>
                      <Image
                        source={{
                          uri: prod.imageUrl || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
                        }}
                        style={styles.wishImage}
                      />
                      <View style={styles.wishBody}>
                        <Text style={styles.wishTitle} numberOfLines={1}>
                          {prod.name}
                        </Text>
                        <Text style={styles.wishPrice}>₹{prod.price}</Text>

                        <View style={styles.wishBtnRow}>
                          <Pressable style={styles.cartBtn} onPress={() => handleMoveToCart(prod)}>
                            <Text style={styles.cartBtnTxt}>+ Cart</Text>
                          </Pressable>
                          <Pressable
                            style={styles.removeBtn}
                            onPress={() => handleRemoveWishlist(prod._id)}
                          >
                            <Text style={styles.removeBtnTxt}>✕</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ── ACTIVITY FEED TAB ── */}
        {activeTab === 'activity' && (
          <View style={styles.tabContent}>
            {activities.length === 0 ? (
              <EmptyState
                emoji="⚡"
                title="No Activities Yet"
                message="Your recent interactions, orders, and wishlist updates will be tracked here."
              />
            ) : (
              activities.map((act, index) => (
                <View key={act._id || index} style={styles.actCard}>
                  <View style={styles.actIconBox}>
                    <Text style={styles.actIconEmoji}>
                      {act.type === 'order' ? '📦' : act.type === 'wishlist' ? '❤️' : '🌿'}
                    </Text>
                  </View>
                  <View style={styles.actDetails}>
                    <Text style={styles.actAction}>{act.action || 'Activity'}</Text>
                    <Text style={styles.actNote}>{act.details || 'Sanctuary interaction recorded.'}</Text>
                    <Text style={styles.actTime}>
                      {new Date(act.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ── PROFILE SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <View style={styles.tabContent}>
            <View style={styles.settingsCard}>
              <Text style={styles.formTitle}>Edit Sanctuary Profile</Text>

              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.fieldInput}
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
              />

              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Pressable
                style={[styles.saveBtn, updating && { opacity: 0.6 }]}
                disabled={updating}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveBtnTxt}>{updating ? 'Saving Changes...' : 'Save Profile Changes'}</Text>
              </Pressable>
            </View>

            {/* Quick Links Card */}
            <View style={styles.quickLinksCard}>
              <Text style={styles.quickTitle}>Quick Navigation</Text>
              <Pressable
                style={styles.quickRow}
                onPress={() => navigation.navigate('Orders')}
              >
                <Text style={styles.quickRowText}>📦 View Order History</Text>
                <Text style={styles.quickArrow}>→</Text>
              </Pressable>
              <Pressable
                style={styles.quickRow}
                onPress={() => navigation.navigate('AIAssistant')}
              >
                <Text style={styles.quickRowText}>✨ Chat with Haven AI</Text>
                <Text style={styles.quickArrow}>→</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: '#fff',
  },
  userEmail: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  memberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  memberBadgeTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  mainScroll: {
    flex: 1,
  },
  tabContent: {
    padding: SPACING.md,
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  wishCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  wishImage: {
    width: '100%',
    height: 120,
  },
  wishBody: {
    padding: SPACING.sm,
  },
  wishTitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  wishPrice: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 4,
  },
  wishBtnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  cartBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  cartBtnTxt: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  removeBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: RADIUS.sm,
  },
  removeBtnTxt: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  actCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  actIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  actIconEmoji: {
    fontSize: 18,
  },
  actDetails: {
    flex: 1,
  },
  actAction: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  actNote: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  actTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: '#fff',
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  formTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveBtnTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: FONT_SIZES.sm,
  },
  quickLinksCard: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  quickTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  quickRowText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  quickArrow: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
});

export default UserDashboardScreen;
