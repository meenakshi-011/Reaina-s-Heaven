import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { getBooks } from '../../api/productApi';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const GENRES = ['All', 'Literary', 'Fiction', 'Poetry', 'Philosophy', 'Artisan'];

const FALLBACK_BOOKS = [
  {
    _id: 'b1',
    book_name: 'The Art of Slow Living',
    author: 'Eleanor Vance',
    genre: 'Philosophy',
    rating: 4.8,
    release_year: '2024',
    description: 'A gentle exploration into finding stillness, mindfulness, and quiet beauty in everyday rituals.',
    imageurl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop',
  },
  {
    _id: 'b2',
    book_name: 'Botanical Echoes',
    author: 'Julian Thorne',
    genre: 'Literary',
    rating: 4.9,
    release_year: '2023',
    description: 'Poems and botanical sketches from countryside gardens and overgrown woodlands.',
    imageurl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop',
  },
  {
    _id: 'b3',
    book_name: 'Letters to a Young Florist',
    author: 'Clara Beaumont',
    genre: 'Artisan',
    rating: 4.7,
    release_year: '2022',
    description: 'A touching tribute to the craft of floristry, flower language, and seasonal harmony.',
    imageurl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop',
  },
  {
    _id: 'b4',
    book_name: 'Quiet Nights & Warm Brews',
    author: 'Aria Sterling',
    genre: 'Poetry',
    rating: 4.6,
    release_year: '2025',
    description: 'Anthology of late-night musings, rainy evening thoughts, and coffee shop nostalgia.',
    imageurl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop',
  },
];

const BooksScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [reserveModalVisible, setReserveModalVisible] = useState(false);
  const [reserveDays, setReserveDays] = useState('7');

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      if (Array.isArray(data) && data.length > 0) {
        setBooks(data);
      } else {
        setBooks(FALLBACK_BOOKS);
      }
    } catch (err) {
      console.warn('Books load error, using curated collection:', err.message);
      setBooks(FALLBACK_BOOKS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  const genresList = ['All', ...new Set([
    ...GENRES.filter((g) => g !== 'All'),
    ...books.flatMap((b) => (Array.isArray(b.genre) ? b.genre : [b.genre])).filter(Boolean),
  ])];

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.book_name?.toLowerCase().includes(search.toLowerCase());
    const authorMatch = book.author?.toLowerCase().includes(search.toLowerCase());
    const matchesSearch = !search || titleMatch || authorMatch;

    const bookGenres = Array.isArray(book.genre) ? book.genre : [book.genre];
    const matchesGenre =
      selectedGenre === 'All' ||
      bookGenres.some((g) => g && g.toLowerCase() === selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  const handleReserve = (book) => {
    setSelectedBook(book);
    setReserveModalVisible(true);
  };

  const confirmReservation = () => {
    setReserveModalVisible(false);
    Alert.alert(
      '✨ Book Reserved!',
      `"${selectedBook.book_name}" has been reserved for you for ${reserveDays} days. Pick it up anytime from Reaina's Haven Sanctuary or during your café visit!`,
      [{ text: 'Wonderful', style: 'default' }]
    );
  };

  if (loading) return <Loading message="Opening the Sanctuary Library..." />;

  const renderBookItem = ({ item }) => {
    const genreText = Array.isArray(item.genre) ? item.genre[0] : item.genre || 'Literary';
    const ratingText = (item.rating || 4.5).toFixed(1);

    return (
      <View style={styles.bookCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.imageurl || item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop',
            }}
            style={styles.bookImage}
            resizeMode="cover"
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingNumber}>{ratingText}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.genreRow}>
            <Text style={styles.genrePill}>{genreText.toUpperCase()}</Text>
            <Text style={styles.yearText}>{item.release_year || 'Classic'}</Text>
          </View>

          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.book_name}
          </Text>
          <Text style={styles.authorText} numberOfLines={1}>
            by {item.author}
          </Text>

          {item.description || item.synopsis ? (
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description || item.synopsis}
            </Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.reserveButton,
              pressed && styles.reserveButtonPressed,
            ]}
            onPress={() => handleReserve(item)}
          >
            <Text style={styles.reserveButtonText}>Reserve Book</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.tagline}>THE HAVEN LIBRARY</Text>
        <Text style={styles.headerTitle}>Curated Stories 📖</Text>
        <Text style={styles.headerSubtitle}>
          Handpicked artisan journals, poetry, and timeless classics to accompany your coffee.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by book title or author..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')} style={styles.clearSearch}>
            <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Genre Filter Chips */}
      <View style={styles.genreListContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={genresList}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.genreList}
          renderItem={({ item }) => {
            const isSelected = selectedGenre === item;
            return (
              <Pressable
                style={[
                  styles.genreChip,
                  isSelected && styles.genreChipActive,
                ]}
                onPress={() => setSelectedGenre(item)}
              >
                <Text
                  style={[
                    styles.genreChipText,
                    isSelected && styles.genreChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Book List */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item._id || item.book_name}
        renderItem={renderBookItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji="📖"
            title="Our Shelves are Quiet"
            message="No books found matching your selection. Try clearing your search or picking another genre."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setSelectedGenre('All');
            }}
          />
        }
      />

      {/* Reserve Modal */}
      {selectedBook && (
        <Modal
          visible={reserveModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setReserveModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Reserve for Reading ☕</Text>
              <Text style={styles.modalBookName}>{selectedBook.book_name}</Text>
              <Text style={styles.modalAuthor}>by {selectedBook.author}</Text>

              <Text style={styles.modalLabel}>Select Reservation Window:</Text>
              <View style={styles.daysSelectorRow}>
                {['3', '7', '14'].map((d) => (
                  <Pressable
                    key={d}
                    style={[
                      styles.dayButton,
                      reserveDays === d && styles.dayButtonActive,
                    ]}
                    onPress={() => setReserveDays(d)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        reserveDays === d && styles.dayButtonTextActive,
                      ]}
                    >
                      {d} Days
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.modalNotice}>
                🌿 Free sanctuary perk for our guests. You can read at the café or borrow with your member card.
              </Text>

              <View style={styles.modalActionRow}>
                <Pressable
                  style={styles.cancelModalButton}
                  onPress={() => setReserveModalVisible(false)}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={styles.confirmModalButton}
                  onPress={confirmReservation}
                >
                  <Text style={styles.confirmModalButtonText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default BooksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: '#eee8e0',
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
  headerTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
  },
  clearSearch: {
    padding: SPACING.xs,
  },
  genreListContainer: {
    paddingVertical: SPACING.sm,
  },
  genreList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  genreChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  genreChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genreChipText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  genreChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  imageContainer: {
    width: 95,
    height: 135,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#eee',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(45, 58, 45, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingStar: {
    color: '#f6e05e',
    fontSize: 10,
  },
  ratingNumber: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  genreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  genrePill: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent,
    backgroundColor: '#fbf7f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  yearText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  bookTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  authorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 4,
  },
  reserveButtonPressed: {
    opacity: 0.85,
  },
  reserveButtonText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 380,
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  modalBookName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalAuthor: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  modalLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  daysSelectorRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayButtonTextActive: {
    color: '#ffffff',
  },
  modalNotice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.lg,
    backgroundColor: '#f7f4ee',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  confirmModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  confirmModalButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: '#ffffff',
  },
});
