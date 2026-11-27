import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  RefreshControl,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { getExperiences } from '../../api/productApi';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const FALLBACK_EXPERIENCES = [
  {
    _id: 'exp1',
    title: 'Botanical Clay & Pottery Sculpting',
    subtitle: 'Learn hand-building pottery techniques and imprint fresh foliage into artisan ceramic bowls.',
    duration: '2.5 Hours',
    slots: '4 slots left',
    price: 1299,
    instructor: 'Aarav Patel (Ceramicist)',
    date: 'Saturday, 11:00 AM',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop',
    includes: ['All raw clay & glazes', 'Kiln firing of your piece', 'Sanctuary herbal tea & cookies'],
  },
  {
    _id: 'exp2',
    title: 'Floral Architecture & Bouquet Making',
    subtitle: 'Master the art of spiral hand-tied bouquets, color harmony, and preserving fresh seasonal stems.',
    duration: '2 Hours',
    slots: '6 slots left',
    price: 1499,
    instructor: 'Reaina Sen (Founder & Lead Florist)',
    date: 'Sunday, 4:00 PM',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    includes: ['Exotic fresh cut stems', 'Floral shears & ribbon set', 'Take home your deluxe bouquet'],
  },
  {
    _id: 'exp3',
    title: 'Hand-Poured Soy Wax & Aroma Workshop',
    subtitle: 'Blend botanical essential oils and craft your own amber glass scented candle with cotton wicks.',
    duration: '1.5 Hours',
    slots: '5 slots left',
    price: 999,
    instructor: 'Meera Deshmukh',
    date: 'Next Friday, 5:30 PM',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop',
    includes: ['Organic soy wax flakes', 'Pure essential oil blends', '2 custom candles to take home'],
  },
  {
    _id: 'exp4',
    title: 'Specialty Coffee Brewing & Sensory Cupping',
    subtitle: 'Explore V60 pour-overs, AeroPress, French press notes, and taste single-origin Indian microlots.',
    duration: '2 Hours',
    slots: '3 slots left',
    price: 899,
    instructor: 'Karan Sharma (Head Barista)',
    date: 'Sunday, 10:00 AM',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop',
    includes: ['4 coffee varieties tasted', 'Brew ratio reference guide', '250g freshly roasted beans bag'],
  },
];

const ExperiencesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [attendees, setAttendees] = useState(1);
  const [bookingName, setBookingName] = useState(user?.name || '');
  const [bookingPhone, setBookingPhone] = useState(user?.phone || '');

  const fetchExp = async () => {
    try {
      const data = await getExperiences();
      if (Array.isArray(data) && data.length > 0) {
        setExperiences(data);
      } else {
        setExperiences(FALLBACK_EXPERIENCES);
      }
    } catch (err) {
      console.warn('Experiences load error, fallback used:', err.message);
      setExperiences(FALLBACK_EXPERIENCES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExp();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchExp();
  };

  const handleOpenBooking = (exp) => {
    setSelectedExp(exp);
    setBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!bookingName.trim() || !bookingPhone.trim()) {
      Alert.alert('Required Info', 'Please enter your name and phone number to book.');
      return;
    }

    setBookingModal(false);
    const total = (selectedExp.price || 999) * attendees;
    Alert.alert(
      '🎉 Workshop Booked!',
      `You are confirmed for "${selectedExp.title}" for ${attendees} guest(s).\nTotal: ₹${total.toLocaleString('en-IN')}.\nLocation: Reaina's Haven Sanctuary, Jabalpur.\nDetails sent to ${bookingPhone}.`,
      [{ text: 'Wonderful!', style: 'default' }]
    );
  };

  if (loading) return <Loading message="Loading sanctuary experiences..." />;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.tagline}>HANDS-ON GATHERINGS</Text>
        <Text style={styles.heroTitle}>Sanctuary Experiences 🎨</Text>
        <Text style={styles.heroSubtitle}>
          Slow down and create with your hands. Intimate weekend workshops held inside our botanical garden in Jabalpur.
        </Text>
      </View>

      <View style={styles.list}>
        {experiences.map((exp) => (
          <View key={exp._id || exp.title} style={styles.expCard}>
            <Image
              source={{ uri: exp.image || exp.imageurl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop' }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>{exp.date || 'Upcoming'}</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.metaRow}>
                <Text style={styles.metaItem}>⏱️ {exp.duration || '2 Hours'}</Text>
                <Text style={styles.slotPill}>{exp.slots || 'Limited Seats'}</Text>
              </View>

              <Text style={styles.expTitle}>{exp.title}</Text>
              <Text style={styles.expSubtitle}>{exp.subtitle || exp.description}</Text>

              {exp.instructor ? (
                <Text style={styles.instructorText}>Instructor: {exp.instructor}</Text>
              ) : null}

              {exp.includes && (
                <View style={styles.includesBox}>
                  <Text style={styles.includesHeader}>What's Included:</Text>
                  {exp.includes.map((inc, i) => (
                    <Text key={i} style={styles.includeItem}>• {inc}</Text>
                  ))}
                </View>
              )}

              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.priceLabel}>Fee per guest</Text>
                  <Text style={styles.priceValue}>₹{(exp.price || 999).toLocaleString('en-IN')}</Text>
                </View>

                <Pressable
                  style={({ pressed }) => [styles.bookBtn, pressed && styles.bookBtnPressed]}
                  onPress={() => handleOpenBooking(exp)}
                >
                  <Text style={styles.bookBtnText}>Book Workshop</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Booking Modal */}
      {selectedExp && (
        <Modal
          visible={bookingModal}
          transparent
          animationType="slide"
          onRequestClose={() => setBookingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalBadge}>WORKSHOP RESERVATION</Text>
                <Text style={styles.modalTitle}>{selectedExp.title}</Text>
                <Text style={styles.modalSub}>{selectedExp.date} • {selectedExp.duration}</Text>

                <Text style={styles.fieldLabel}>Your Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={bookingName}
                  onChangeText={setBookingName}
                  placeholder="Full name"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.fieldLabel}>Mobile / WhatsApp Number *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={bookingPhone}
                  onChangeText={setBookingPhone}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.fieldLabel}>Number of Guests</Text>
                <View style={styles.counterRow}>
                  {[1, 2, 3, 4].map((num) => (
                    <Pressable
                      key={num}
                      style={[styles.numBtn, attendees === num && styles.numBtnActive]}
                      onPress={() => setAttendees(num)}
                    >
                      <Text style={[styles.numBtnText, attendees === num && styles.numBtnTextActive]}>
                        {num}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Workshop Fee:</Text>
                  <Text style={styles.totalValue}>
                    ₹{((selectedExp.price || 999) * attendees).toLocaleString('en-IN')}
                  </Text>
                </View>

                <Text style={styles.bookingNote}>
                  🌿 Pay upon arrival at Reaina's Haven café or via UPI. Cancellation is free up to 24 hours prior.
                </Text>

                <View style={styles.btnRow}>
                  <Pressable style={styles.cancelBtn} onPress={() => setBookingModal(false)}>
                    <Text style={styles.cancelBtnText}>Back</Text>
                  </Pressable>
                  <Pressable style={styles.confirmBtn} onPress={handleConfirmBooking}>
                    <Text style={styles.confirmBtnText}>Confirm Booking</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default ExperiencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: '#efe9df',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
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
  list: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  expCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 190,
  },
  dateBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(45, 58, 45, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  dateBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  slotPill: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b7791f',
    backgroundColor: '#fefcbf',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  expTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  expSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  instructorText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: 10,
  },
  includesBox: {
    backgroundColor: '#fbf9f6',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 14,
  },
  includesHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  includeItem: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  priceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  bookBtnPressed: {
    opacity: 0.85,
  },
  bookBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    padding: SPACING.xl,
    maxHeight: '85%',
  },
  modalBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  counterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  numBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  numBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  numBtnText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  numBtnTextActive: {
    color: '#ffffff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.accent,
  },
  bookingNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: '#ffffff',
  },
});
