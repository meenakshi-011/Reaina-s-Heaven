// ============================================================
// Reaina's Haven Mobile — Design System
// ============================================================

export const COLORS = {
  // Brand
  primary: '#166534',       // Deep botanical green (from "Joy & Comfort 🌿" and brand logo)
  primaryDark: '#0e3f20',   // Forest shadow
  primaryGreen: '#166534',  // Botanical green accent
  secondary: '#c8a97e',     // Warm gold / sand
  accent: '#a67c52',        // Warm caramel / amber CTA button & badge color
  accentHover: '#8f643e',   // Deep amber
  sage: '#8c8c73',          // Olive sage ribbon & label color
  background: '#f8f5f2',    // Signature warm cream linen canvas
  surface: '#ffffff',       // Pure white cards
  surfaceAlt: '#f4ede4',    // Soft warm beige card background
  cardBg: '#ffffff',

  // Text
  textPrimary: '#3e3e3e',   // Deep warm charcoal (matches "Create Moments")
  textSecondary: '#6b7280', // Elegant readable body gray
  textMuted: '#8c8c73',     // Muted olive / warm sand
  textLight: '#ffffff',     // Pure white text
  textBrand: '#166534',     // Botanical green text

  // UI
  border: '#e8dcc8',        // Warm sand border
  borderLight: '#f0e8dc',   // Delicate border
  divider: '#eee5d8',

  // Status
  success: '#166534',
  error: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',

  // Gradients (for use with LinearGradient)
  gradientStart: '#166534',
  gradientEnd: '#0e3f20',
  goldGradientStart: '#c8a97e',
  goldGradientEnd: '#a67c52',

  // Navigation & Tab bar
  headerBackground: '#f8f5f2',
  headerTitle: '#166534',
  tabActive: '#166534',
  tabInactive: '#8c8c73',
  tabBackground: '#f8f5f2',

  // Overlay
  overlay: 'rgba(30, 63, 32, 0.6)',
  overlayLight: 'rgba(166, 124, 82, 0.12)',
};

export const FONTS = {
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semiBold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
  // Fallback system fonts
  system: undefined,
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#2d3a2d',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2d3a2d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2d3a2d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Category data matching the actual product types in DB
export const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'Bouquet', label: 'Bouquets', emoji: '💐' },
  { id: 'Hamper', label: 'Hampers', emoji: '🧺' },
];

export const CAFE_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '☕' },
  { id: 'Desserts', label: 'Desserts', emoji: '🍰' },
  { id: 'Beverages', label: 'Beverages', emoji: '🥤' },
  { id: 'Savory', label: 'Savory', emoji: '🥐' },
  { id: 'Healthy', label: 'Healthy', emoji: '🥗' },
];

// Order status badge colors
export const ORDER_STATUS_COLORS = {
  Processing: { bg: '#FFF3CD', text: '#856404' },
  Shipped: { bg: '#CCE5FF', text: '#004085' },
  'Out for Delivery': { bg: '#D4EDDA', text: '#155724' },
  Delivered: { bg: '#D1E7DD', text: '#0F5132' },
  Cancelled: { bg: '#F8D7DA', text: '#721C24' },
};
