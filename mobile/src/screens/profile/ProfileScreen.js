import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/userApi';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const { user, isLoggedIn, logout, isAdmin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }
      const load = async () => {
        try {
          const data = await getUserProfile();
          setProfile(data.user);
        } catch (err) {
          console.warn('Profile load error:', err.message);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [isLoggedIn])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  if (!isLoggedIn) {
    return (
      <EmptyState
        emoji="🌿"
        title="Join the Sanctuary"
        message="Sign in to view your profile, orders, and wishlist."
        actionLabel="Login"
        onAction={() => navigation.navigate('Auth', { screen: 'Login' })}
      />
    );
  }

  if (loading) return <Loading message="Loading profile..." />;

  const displayUser = profile || user;
  const initials = displayUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const menuItems = [
    ...(isAdmin || displayUser?.role === 'ADMIN'
      ? [
          {
            emoji: '👑',
            label: 'Sanctuary Admin Console',
            badge: 'Admin',
            highlight: true,
            onPress: () => navigation.navigate('AdminDashboard'),
          },
        ]
      : []),
    {
      emoji: '🌿',
      label: 'My Sanctuary Dashboard',
      onPress: () => navigation.navigate('UserDashboard'),
    },
    {
      emoji: '📦',
      label: 'My Orders',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      emoji: '❤️',
      label: 'Saved Wishlist',
      onPress: () => navigation.navigate('UserDashboard'),
    },
    {
      emoji: '✨',
      label: 'Haven AI Assistant',
      onPress: () => navigation.navigate('AIAssistant'),
    },
    {
      emoji: '🌸',
      label: 'Custom Bouquet & Hamper Studio',
      onPress: () => navigation.navigate('Customization'),
    },
    {
      emoji: '📚',
      label: 'The Haven Library & Books',
      onPress: () => navigation.navigate('Books'),
    },
    {
      emoji: '🎨',
      label: 'Botanical Workshops & Experiences',
      onPress: () => navigation.navigate('Experiences'),
    },
    {
      emoji: '🍱',
      label: 'Tiffin & Artisan Services',
      onPress: () => navigation.navigate('Services'),
    },
    {
      emoji: '📖',
      label: 'About Sanctuary Story',
      onPress: () => navigation.navigate('AboutUs'),
    },
    {
      emoji: '🚚',
      label: 'Shipping Policy',
      onPress: () => navigation.navigate('ShippingPolicy'),
    },
    {
      emoji: '🔄',
      label: 'Refund Policy',
      onPress: () => navigation.navigate('RefundPolicy'),
    },
    {
      emoji: '❓',
      label: 'Frequently Asked Questions',
      onPress: () => navigation.navigate('FAQ'),
    },
    {
      emoji: '📞',
      label: 'Contact & Sanctuary Location',
      onPress: () => navigation.navigate('Contact'),
    },
  ];


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{displayUser?.name}</Text>
        <Text style={styles.userEmail}>{displayUser?.email}</Text>
        {displayUser?.role && displayUser.role !== 'CUSTOMER' && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{displayUser.role.replace(/_/g, ' ')}</Text>
          </View>
        )}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Orders', value: profile?.wishlist?.length ?? '—', emoji: '📦' },
          { label: 'Wishlist', value: profile?.wishlist?.length || 0, emoji: '❤️' },
          { label: 'Member Since', value: displayUser?.createdAt ? new Date(displayUser.createdAt).getFullYear() : '—', emoji: '🌿' },
        ].map((stat, idx) => (
          <View key={idx} style={styles.statItem}>
            <Text style={styles.statEmoji}>{stat.emoji}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View style={styles.menuCard}>
        {menuItems.map((item, idx) => (
          <Pressable
            key={idx}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              idx < menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={item.onPress}
          >
            <Text style={styles.menuEmoji}>{item.emoji}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </View>

      {/* Logout */}
      <Pressable
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>🚪 Sign Out</Text>
      </Pressable>

      <Text style={styles.version}>Reaina's Haven Mobile v1.0</Text>
      <View style={{ height: SPACING['3xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING['2xl'],
    gap: SPACING.sm,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: FONT_SIZES['2xl'], fontWeight: '800', color: COLORS.primary },
  userName: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: '#fff' },
  userEmail: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.7)' },
  roleBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.base,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  roleText: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: COLORS.primary },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    margin: SPACING.base,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statEmoji: { fontSize: FONT_SIZES.lg },
  statValue: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  menuCard: {
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.base,
  },
  menuItemPressed: { backgroundColor: COLORS.background },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuEmoji: { fontSize: FONT_SIZES.lg, width: 28 },
  menuLabel: { flex: 1, fontSize: FONT_SIZES.base, color: COLORS.textPrimary, fontWeight: '500' },
  menuArrow: { fontSize: FONT_SIZES.xl, color: COLORS.textMuted },
  logoutBtn: {
    margin: SPACING.base,
    marginTop: SPACING.base,
    backgroundColor: '#fff1f0',
    borderWidth: 1,
    borderColor: '#ffa39e',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.base,
    alignItems: 'center',
  },
  logoutBtnPressed: { opacity: 0.8 },
  logoutText: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.error },
  version: { textAlign: 'center', fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: SPACING.sm },
});

export default ProfileScreen;
