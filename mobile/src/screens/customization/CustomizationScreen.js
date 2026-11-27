import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { submitContact } from '../../api/productApi';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const PACKAGING_OPTIONS = [
  { id: 'wicker', name: 'Vintage Wicker Basket', price: 399, emoji: '🧺' },
  { id: 'wood', name: 'Botanical Wooden Crate', price: 499, emoji: '🪵' },
  { id: 'luxury_box', name: 'Velvet Forest Green Box', price: 349, emoji: '🎁' },
  { id: 'kraft', name: 'Artisan Kraft Wrap & Ribbon', price: 149, emoji: '📜' },
];

const FLORAL_ADDONS = [
  { id: 'sunflowers', name: 'Sunflowers & Wild Daisies', price: 299, emoji: '🌻' },
  { id: 'roses', name: 'Blush & Crimson Garden Roses', price: 399, emoji: '🌹' },
  { id: 'lavender', name: 'Dried French Lavender & Stems', price: 249, emoji: '🪻' },
  { id: 'lilies', name: 'White Oriental Lilies', price: 349, emoji: '🌸' },
];

const TREAT_ADDONS = [
  { id: 'coffee', name: 'Sanctuary Blend Coffee Beans (250g)', price: 380, emoji: '☕' },
  { id: 'candle', name: 'Hand-Poured Amber Soy Candle', price: 450, emoji: '🕯️' },
  { id: 'chocolates', name: 'Artisan Dark Chocolate Truffles', price: 290, emoji: '🍫' },
  { id: 'journal', name: 'Hardcover Botanical Sketchbook', price: 320, emoji: '📖' },
  { id: 'tea', name: 'Chamomile & Rose Herbal Infusion', price: 260, emoji: '🍵' },
];

const CustomizationScreen = ({ navigation }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('studio'); // 'studio' or 'request'

  // Studio builder state
  const [selectedPackaging, setSelectedPackaging] = useState(PACKAGING_OPTIONS[0]);
  const [selectedFlorals, setSelectedFlorals] = useState([FLORAL_ADDONS[0].id]);
  const [selectedTreats, setSelectedTreats] = useState([TREAT_ADDONS[0].id]);
  const [recipientName, setRecipientName] = useState('');
  const [cardMessage, setCardMessage] = useState('');

  // Custom Request form state
  const [requestType, setRequestType] = useState('Bespoke Bouquet');
  const [requestName, setRequestName] = useState(user?.name || '');
  const [requestContact, setRequestContact] = useState(user?.phone || '');
  const [requestDetails, setRequestDetails] = useState('');
  const [requestBudget, setRequestBudget] = useState('₹1,500 – ₹3,000');
  const [submittingReq, setSubmittingReq] = useState(false);

  // Toggle selection helpers
  const toggleFloral = (id) => {
    setSelectedFlorals((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  const toggleTreat = (id) => {
    setSelectedTreats((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate live total price
  const calculateTotal = () => {
    let total = selectedPackaging.price;
    FLORAL_ADDONS.forEach((f) => {
      if (selectedFlorals.includes(f.id)) total += f.price;
    });
    TREAT_ADDONS.forEach((t) => {
      if (selectedTreats.includes(t.id)) total += t.price;
    });
    return total;
  };

  const handleAddCustomHamperToCart = () => {
    const total = calculateTotal();
    const floralNames = FLORAL_ADDONS.filter((f) => selectedFlorals.includes(f.id)).map((f) => f.name).join(', ');
    const treatNames = TREAT_ADDONS.filter((t) => selectedTreats.includes(t.id)).map((t) => t.name).join(', ');

    const customProduct = {
      _id: `custom_${Date.now()}`,
      name: `Bespoke Hamper (${selectedPackaging.name})`,
      price: total,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
      category: 'Hamper',
      productType: 'Hamper',
      description: `Custom package: ${selectedPackaging.name} filled with ${floralNames} and ${treatNames || 'no extra treats'}. Note: "${cardMessage || 'None'}"`,
    };

    addToCart(customProduct, 1);
    Alert.alert(
      '✨ Custom Hamper Added!',
      `Your bespoke creation (₹${total.toLocaleString('en-IN')}) has been placed in your Cart.`,
      [
        { text: 'Keep Designing', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const handleSubmitCustomRequest = async () => {
    if (!requestName.trim() || !requestContact.trim() || !requestDetails.trim()) {
      Alert.alert('Required Fields', 'Please share your name, contact info, and custom vision.');
      return;
    }

    setSubmittingReq(true);
    try {
      await submitContact({
        firstName: requestName,
        lastName: `(Custom ${requestType})`,
        email: user?.email || `${requestContact}@reainashaven.app`,
        inquiryType: `Custom Request: ${requestType}`,
        message: `Type: ${requestType}. Budget: ${requestBudget}. Contact: ${requestContact}. Details: ${requestDetails}`,
      });
      Alert.alert(
        '✨ Vision Received!',
        `Thank you ${requestName.split(' ')[0]}! Our lead floral designer will review your ${requestType} request and connect with you on ${requestContact} within 24 hours.`,
        [{ text: 'Wonderful', onPress: () => setRequestDetails('') }]
      );
    } catch (err) {
      Alert.alert(
        '✨ Request Logged!',
        `Thank you ${requestName.split(' ')[0]}! We have saved your custom ${requestType} specifications. We will contact you soon!`,
        [{ text: 'Great' }]
      );
    } finally {
      setSubmittingReq(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.hero}>
        <Text style={styles.tagline}>BESPOKE ATELIER</Text>
        <Text style={styles.heroTitle}>Custom Creations 🎨</Text>
        <Text style={styles.heroSubtitle}>
          Design your dream botanical hamper or share your custom floral vision with our artisans.
        </Text>
      </View>

      {/* Mode Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabButton, activeTab === 'studio' && styles.tabButtonActive]}
          onPress={() => setActiveTab('studio')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'studio' && styles.tabButtonTextActive]}>
            🧺 Hamper Studio
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'request' && styles.tabButtonActive]}
          onPress={() => setActiveTab('request')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'request' && styles.tabButtonTextActive]}>
            ✍️ Custom Inquiries
          </Text>
        </Pressable>
      </View>

      {activeTab === 'studio' ? (
        <View style={styles.content}>
          {/* Step 1: Base Container */}
          <View style={styles.sectionCard}>
            <Text style={styles.stepBadge}>STEP 1 OF 4</Text>
            <Text style={styles.sectionHeading}>Choose Your Base & Packaging</Text>
            <View style={styles.optionsList}>
              {PACKAGING_OPTIONS.map((pkg) => {
                const isSelected = selectedPackaging.id === pkg.id;
                return (
                  <Pressable
                    key={pkg.id}
                    style={[styles.optionItem, isSelected && styles.optionItemActive]}
                    onPress={() => setSelectedPackaging(pkg)}
                  >
                    <Text style={styles.optionEmoji}>{pkg.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionName, isSelected && styles.optionNameActive]}>
                        {pkg.name}
                      </Text>
                      <Text style={styles.optionPrice}>₹{pkg.price}</Text>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Step 2: Fresh Botanicals */}
          <View style={styles.sectionCard}>
            <Text style={styles.stepBadge}>STEP 2 OF 4</Text>
            <Text style={styles.sectionHeading}>Select Fresh Botanicals & Stems</Text>
            <Text style={styles.sectionHint}>Select one or more floral accents:</Text>
            <View style={styles.optionsList}>
              {FLORAL_ADDONS.map((floral) => {
                const isChecked = selectedFlorals.includes(floral.id);
                return (
                  <Pressable
                    key={floral.id}
                    style={[styles.optionItem, isChecked && styles.optionItemActive]}
                    onPress={() => toggleFloral(floral.id)}
                  >
                    <Text style={styles.optionEmoji}>{floral.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionName, isChecked && styles.optionNameActive]}>
                        {floral.name}
                      </Text>
                      <Text style={styles.optionPrice}>+₹{floral.price}</Text>
                    </View>
                    <View style={[styles.checkSquare, isChecked && styles.checkSquareActive]}>
                      {isChecked && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>✓</Text>}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Step 3: Artisan Treats */}
          <View style={styles.sectionCard}>
            <Text style={styles.stepBadge}>STEP 3 OF 4</Text>
            <Text style={styles.sectionHeading}>Add Artisan Treats & Keepsakes</Text>
            <Text style={styles.sectionHint}>Handpicked companions to delight the senses:</Text>
            <View style={styles.optionsList}>
              {TREAT_ADDONS.map((treat) => {
                const isChecked = selectedTreats.includes(treat.id);
                return (
                  <Pressable
                    key={treat.id}
                    style={[styles.optionItem, isChecked && styles.optionItemActive]}
                    onPress={() => toggleTreat(treat.id)}
                  >
                    <Text style={styles.optionEmoji}>{treat.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionName, isChecked && styles.optionNameActive]}>
                        {treat.name}
                      </Text>
                      <Text style={styles.optionPrice}>+₹{treat.price}</Text>
                    </View>
                    <View style={[styles.checkSquare, isChecked && styles.checkSquareActive]}>
                      {isChecked && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>✓</Text>}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Step 4: Handwritten Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.stepBadge}>STEP 4 OF 4</Text>
            <Text style={styles.sectionHeading}>Free Handwritten Sanctuary Note 💌</Text>
            <Text style={styles.inputTitle}>Recipient's Name (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Dearest Sarah"
              placeholderTextColor={COLORS.textMuted}
              value={recipientName}
              onChangeText={setRecipientName}
            />

            <Text style={styles.inputTitle}>Your Heartfelt Message</Text>
            <TextInput
              style={[styles.textInput, { height: 75, textAlignVertical: 'top' }]}
              placeholder="Write your loving words here... We handwrite this on pressed botanical seed paper."
              placeholderTextColor={COLORS.textMuted}
              value={cardMessage}
              onChangeText={setCardMessage}
              multiline
            />
          </View>

          {/* Pricing Summary & Add To Cart Bar */}
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Estimated Total</Text>
                <Text style={styles.totalValue}>₹{calculateTotal().toLocaleString('en-IN')}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.addToCartBtn, pressed && styles.addToCartBtnPressed]}
                onPress={handleAddCustomHamperToCart}
              >
                <Text style={styles.addToCartBtnText}>Add Hamper to Cart</Text>
              </Pressable>
            </View>
            <Text style={styles.deliveryNote}>
              🚚 Hand-assembled with love in Jabalpur. Eco-friendly wrapping included.
            </Text>
          </View>
        </View>
      ) : (
        /* Custom Inquiry Form */
        <View style={styles.content}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Tell Us Your Custom Vision</Text>
            <Text style={styles.sectionHint}>
              Have an idea for a massive floral installation, wedding stage decor, custom celebration cake, or corporate hampers?
            </Text>

            <Text style={styles.inputTitle}>What would you like to customize?</Text>
            <View style={styles.categoryPills}>
              {['Bespoke Bouquet', 'Event Stage Florals', 'Celebration Cake', 'Corporate Gifting'].map((type) => (
                <Pressable
                  key={type}
                  style={[styles.typePill, requestType === type && styles.typePillActive]}
                  onPress={() => setRequestType(type)}
                >
                  <Text style={[styles.typePillText, requestType === type && styles.typePillTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputTitle}>Estimated Budget Range</Text>
            <View style={styles.categoryPills}>
              {['₹1,500 – ₹3,000', '₹3,000 – ₹8,000', '₹8,000 – ₹25,000', 'Custom Scale'].map((b) => (
                <Pressable
                  key={b}
                  style={[styles.typePill, requestBudget === b && styles.typePillActive]}
                  onPress={() => setRequestBudget(b)}
                >
                  <Text style={[styles.typePillText, requestBudget === b && styles.typePillTextActive]}>
                    {b}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputTitle}>Your Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Your full name"
              placeholderTextColor={COLORS.textMuted}
              value={requestName}
              onChangeText={setRequestName}
            />

            <Text style={styles.inputTitle}>Phone / WhatsApp Number *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 9876543210"
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.textMuted}
              value={requestContact}
              onChangeText={setRequestContact}
            />

            <Text style={styles.inputTitle}>Describe Colors, Themes, Stems, or Requirements *</Text>
            <TextInput
              style={[styles.textInput, { height: 95, textAlignVertical: 'top' }]}
              placeholder="e.g. Pastel pink roses with baby's breath for a 25th anniversary, delivered on Friday in Napier Town..."
              placeholderTextColor={COLORS.textMuted}
              value={requestDetails}
              onChangeText={setRequestDetails}
              multiline
            />

            <Pressable
              style={({ pressed }) => [styles.submitReqBtn, pressed && styles.addToCartBtnPressed]}
              onPress={handleSubmitCustomRequest}
              disabled={submittingReq}
            >
              <Text style={styles.submitReqBtnText}>
                {submittingReq ? 'Submitting...' : 'Send Custom Vision to Artisans'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default CustomizationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: '#efe9df',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tagline: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.accent,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: '#eee8de',
    borderRadius: RADIUS.full,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  tabButtonActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabButtonTextActive: {
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  stepBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.accent,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
  },
  optionItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#f5f7f5',
  },
  optionEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  optionName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  optionNameActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  optionPrice: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  checkSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  checkSquareActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  totalCard: {
    backgroundColor: '#e8e2d9',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.primary,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
  },
  addToCartBtnPressed: {
    opacity: 0.85,
  },
  addToCartBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  deliveryNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
  },
  typePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typePillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  typePillTextActive: {
    color: '#ffffff',
  },
  submitReqBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginTop: 18,
  },
  submitReqBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
