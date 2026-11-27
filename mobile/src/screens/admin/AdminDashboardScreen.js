import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import {
  getAdminStats,
  getAllOrdersAdmin,
  updateOrderStatus,
  getProducts,
  createProduct,
  deleteProduct,
  getCafeItems,
  createCafeItem,
  deleteCafeItem,
  getAllUsersAdmin,
} from '../../api/productApi';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const TABS = [
  { id: 'overview', label: 'Overview', emoji: '📊' },
  { id: 'orders', label: 'Orders', emoji: '📦' },
  { id: 'products', label: 'Products', emoji: '💐' },
  { id: 'cafe', label: 'Café Menu', emoji: '☕' },
  { id: 'users', label: 'Users', emoji: '👥' },
];

const ORDER_STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminDashboardScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [cafeItems, setCafeItems] = useState([]);
  const [users, setUsers] = useState([]);

  // Filter states
  const [orderFilter, setOrderFilter] = useState('ALL');

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    price: '',
    category: 'Pottery',
    productType: 'Bouquet',
    description: '',
    imageUrl: '',
    stock: '10',
  });

  const [showAddCafe, setShowAddCafe] = useState(false);
  const [newCafe, setNewCafe] = useState({
    item_name: '',
    category: 'Breakfast',
    item_type: 'veg',
    item_price: '',
    description: '',
    imageurl: '',
  });

  const loadAll = async () => {
    try {
      const [statsData, ordersData, prodsData, cafeData, usersData] = await Promise.all([
        getAdminStats().catch(() => null),
        getAllOrdersAdmin().catch(() => []),
        getProducts().catch(() => []),
        getCafeItems().catch(() => []),
        getAllUsersAdmin().catch(() => []),
      ]);
      setStats(statsData);
      setOrders(ordersData || []);
      setProducts(prodsData || []);
      setCafeItems(cafeData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.warn('Admin load error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAll();
  };

  // ── Order actions ──
  const handleUpdateStatus = (orderId, newStatus) => {
    Alert.alert('Update Status', `Change order status to ${newStatus}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await updateOrderStatus(orderId, newStatus);
            setOrders((prev) =>
              prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
            );
            Alert.alert('Updated', `Order marked as ${newStatus}`);
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update order status');
          }
        },
      },
    ]);
  };

  // ── Product actions ──
  const handleCreateProduct = async () => {
    if (!newProd.name || !newProd.price) {
      Alert.alert('Missing Info', 'Please provide a product name and price.');
      return;
    }
    try {
      const created = await createProduct({
        ...newProd,
        price: Number(newProd.price),
        stock: Number(newProd.stock) || 10,
        imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
      });
      setProducts((prev) => [created, ...prev]);
      setShowAddProduct(false);
      setNewProd({
        name: '',
        price: '',
        category: 'Pottery',
        productType: 'Bouquet',
        description: '',
        imageUrl: '',
        stock: '10',
      });
      Alert.alert('Success', 'Product created successfully!');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = (id, name) => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            Alert.alert('Deleted', 'Product removed successfully.');
          } catch (err) {
            Alert.alert('Error', 'Failed to delete product.');
          }
        },
      },
    ]);
  };

  // ── Cafe actions ──
  const handleCreateCafe = async () => {
    if (!newCafe.item_name || !newCafe.item_price) {
      Alert.alert('Missing Info', 'Please enter item name and price.');
      return;
    }
    try {
      const created = await createCafeItem({
        ...newCafe,
        item_price: Number(newCafe.item_price),
        imageurl: newCafe.imageurl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop',
      });
      setCafeItems((prev) => [created, ...prev]);
      setShowAddCafe(false);
      setNewCafe({
        item_name: '',
        category: 'Breakfast',
        item_type: 'veg',
        item_price: '',
        description: '',
        imageurl: '',
      });
      Alert.alert('Success', 'Café item created!');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create café item');
    }
  };

  const handleDeleteCafe = (id, name) => {
    Alert.alert('Delete Item', `Remove "${name}" from café menu?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCafeItem(id);
            setCafeItems((prev) => prev.filter((c) => c._id !== id));
            Alert.alert('Deleted', 'Café item removed.');
          } catch (err) {
            Alert.alert('Error', 'Failed to delete café item.');
          }
        },
      },
    ]);
  };

  if (loading) return <Loading message="Accessing Sanctuary Admin..." />;

  // Filtered orders
  const filteredOrders = orders.filter((o) =>
    orderFilter === 'ALL' ? true : o.status?.toUpperCase() === orderFilter
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.adminBadge}>👑 SANCTUARY ADMIN CONSOLE</Text>
          <Text style={styles.adminTitle}>Management Hub</Text>
        </View>
        <Pressable style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshBtnText}>🔄</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
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
        </ScrollView>
      </View>

      {/* Main Tab Content */}
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <View style={styles.sectionWrap}>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: '#2d3a2d' }]}>
                <Text style={styles.metricEmoji}>💰</Text>
                <Text style={styles.metricVal}>₹{stats?.revenue?.toLocaleString('en-IN') || '0'}</Text>
                <Text style={styles.metricLabel}>Total Revenue</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: '#3d405b' }]}>
                <Text style={styles.metricEmoji}>📦</Text>
                <Text style={styles.metricVal}>{stats?.orders || orders.length}</Text>
                <Text style={styles.metricLabel}>Total Orders</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: '#81b29a' }]}>
                <Text style={styles.metricEmoji}>👥</Text>
                <Text style={styles.metricVal}>{stats?.users || users.length}</Text>
                <Text style={styles.metricLabel}>Sanctuary Members</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: '#e07a5f' }]}>
                <Text style={styles.metricEmoji}>🪴</Text>
                <Text style={styles.metricVal}>{products.length + cafeItems.length}</Text>
                <Text style={styles.metricLabel}>Live Catalog Items</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.subHeading}>Quick Actions</Text>
            <View style={styles.actionRow}>
              <Pressable style={styles.actionBtn} onPress={() => setShowAddProduct(true)}>
                <Text style={styles.actionBtnEmoji}>💐</Text>
                <Text style={styles.actionBtnText}>Add Product</Text>
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={() => setShowAddCafe(true)}>
                <Text style={styles.actionBtnEmoji}>☕</Text>
                <Text style={styles.actionBtnText}>Add Café Dish</Text>
              </Pressable>
            </View>

            {/* Recent Orders Overview */}
            <Text style={styles.subHeading}>Recent Orders</Text>
            {orders.slice(0, 5).map((order) => (
              <View key={order._id} style={styles.overviewOrderCard}>
                <View style={styles.orderHead}>
                  <Text style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Text>
                  <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    {order.status}
                  </Text>
                </View>
                <Text style={styles.orderClient}>{order.shippingAddress?.fullName || 'Customer'}</Text>
                <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <View style={styles.sectionWrap}>
            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {ORDER_STATUSES.map((status) => (
                <Pressable
                  key={status}
                  style={[styles.filterChip, orderFilter === status && styles.filterChipActive]}
                  onPress={() => setOrderFilter(status)}
                >
                  <Text style={[styles.filterChipText, orderFilter === status && styles.filterChipTextActive]}>
                    {status}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {filteredOrders.length === 0 ? (
              <EmptyState emoji="📦" title="No Orders" message={`No orders found with status ${orderFilter}.`} />
            ) : (
              filteredOrders.map((item) => (
                <View key={item._id} style={styles.orderCard}>
                  <View style={styles.orderHeaderRow}>
                    <View>
                      <Text style={styles.orderNumber}>#{item._id.slice(-6).toUpperCase()}</Text>
                      <Text style={styles.orderDate}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                      <Text style={styles.statusBadgeText}>{item.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.buyerName}>👤 {item.shippingAddress?.fullName || 'Guest'}</Text>
                  <Text style={styles.buyerPhone}>📞 {item.shippingAddress?.phone || 'No phone'}</Text>
                  <Text style={styles.buyerCity}>
                    📍 {item.shippingAddress?.city}, {item.shippingAddress?.postalCode}
                  </Text>

                  {/* Items brief */}
                  <View style={styles.orderItemsBox}>
                    {item.items?.map((it, idx) => (
                      <Text key={idx} style={styles.orderItemLine} numberOfLines={1}>
                        • {it.quantity}x {it.name || it.product?.name || 'Item'} (₹{it.price})
                      </Text>
                    ))}
                  </View>

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>Total: ₹{item.totalAmount}</Text>
                    <View style={styles.statusActions}>
                      {['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                        <Pressable
                          key={st}
                          style={[styles.miniStatusBtn, item.status === st && { opacity: 0.3 }]}
                          disabled={item.status === st}
                          onPress={() => handleUpdateStatus(item._id, st)}
                        >
                          <Text style={styles.miniStatusText}>{st[0] + st.slice(1).toLowerCase()}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <View style={styles.sectionWrap}>
            <Pressable style={styles.primaryAddBtn} onPress={() => setShowAddProduct(true)}>
              <Text style={styles.primaryAddBtnText}>+ Add New Floral/Product</Text>
            </Pressable>

            {products.map((p) => (
              <View key={p._id} style={styles.catalogCard}>
                <Image source={{ uri: p.imageUrl }} style={styles.catalogThumb} />
                <View style={styles.catalogInfo}>
                  <Text style={styles.catalogName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.catalogMeta}>
                    {p.category} • ₹{p.price} • Stock: {p.stock ?? 10}
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteProduct(p._id, p.name)}
                >
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* ── CAFE TAB ── */}
        {activeTab === 'cafe' && (
          <View style={styles.sectionWrap}>
            <Pressable style={styles.primaryAddBtn} onPress={() => setShowAddCafe(true)}>
              <Text style={styles.primaryAddBtnText}>+ Add New Café Menu Item</Text>
            </Pressable>

            {cafeItems.map((c) => (
              <View key={c._id} style={styles.catalogCard}>
                <Image source={{ uri: c.imageurl }} style={styles.catalogThumb} />
                <View style={styles.catalogInfo}>
                  <Text style={styles.catalogName} numberOfLines={1}>
                    {c.item_name}
                  </Text>
                  <Text style={styles.catalogMeta}>
                    {c.category} • ₹{c.item_price} • {c.item_type === 'veg' ? '🌱 Pure Veg' : '🥩 Non-Veg'}
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteCafe(c._id, c.item_name)}
                >
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <View style={styles.sectionWrap}>
            <Text style={styles.subHeading}>Registered Community ({users.length})</Text>
            {users.map((u) => (
              <View key={u._id} style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarTxt}>
                    {u.name?.slice(0, 2).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                </View>
                <View style={[styles.roleBadge, u.role === 'ADMIN' && { backgroundColor: '#e07a5f' }]}>
                  <Text style={styles.roleBadgeTxt}>{u.role || 'CUSTOMER'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── MODAL: ADD PRODUCT ── */}
      <Modal visible={showAddProduct} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Botanical Product</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Product Name (e.g. Amber Forest Hamper)"
                value={newProd.name}
                onChangeText={(t) => setNewProd({ ...newProd, name: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Price in ₹"
                keyboardType="numeric"
                value={newProd.price}
                onChangeText={(t) => setNewProd({ ...newProd, price: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Category (e.g. Bouquet, Hamper, Pottery)"
                value={newProd.category}
                onChangeText={(t) => setNewProd({ ...newProd, category: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Initial Stock (e.g. 15)"
                keyboardType="numeric"
                value={newProd.stock}
                onChangeText={(t) => setNewProd({ ...newProd, stock: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={newProd.imageUrl}
                onChangeText={(t) => setNewProd({ ...newProd, imageUrl: t })}
              />
              <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder="Description"
                multiline
                value={newProd.description}
                onChangeText={(t) => setNewProd({ ...newProd, description: t })}
              />
              <View style={styles.modalBtnRow}>
                <Pressable style={styles.cancelBtn} onPress={() => setShowAddProduct(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.submitBtn} onPress={handleCreateProduct}>
                  <Text style={styles.submitBtnText}>Create</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── MODAL: ADD CAFE ITEM ── */}
      <Modal visible={showAddCafe} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Café Dish / Beverage</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Item Name (e.g. Hibiscus Iced Tea)"
                value={newCafe.item_name}
                onChangeText={(t) => setNewCafe({ ...newCafe, item_name: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Price in ₹"
                keyboardType="numeric"
                value={newCafe.item_price}
                onChangeText={(t) => setNewCafe({ ...newCafe, item_price: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Category (Breakfast, Beverages, Desserts)"
                value={newCafe.category}
                onChangeText={(t) => setNewCafe({ ...newCafe, category: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={newCafe.imageurl}
                onChangeText={(t) => setNewCafe({ ...newCafe, imageurl: t })}
              />
              <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder="Description / Ingredients"
                multiline
                value={newCafe.description}
                onChangeText={(t) => setNewCafe({ ...newCafe, description: t })}
              />
              <View style={styles.modalBtnRow}>
                <Pressable style={styles.cancelBtn} onPress={() => setShowAddCafe(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.submitBtn} onPress={handleCreateCafe}>
                  <Text style={styles.submitBtnText}>Create Item</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return '#3b82f6';
    case 'SHIPPED':
      return '#8b5cf6';
    case 'DELIVERED':
      return '#10b981';
    case 'CANCELLED':
      return '#ef4444';
    default:
      return '#f59e0b';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminBadge: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  adminTitle: {
    color: '#fff',
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
  },
  refreshBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  refreshBtnText: {
    fontSize: 18,
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabsScroll: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
  },
  tabEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  mainScroll: {
    flex: 1,
  },
  sectionWrap: {
    padding: SPACING.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metricCard: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  metricEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: '#fff',
  },
  metricLabel: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  subHeading: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnEmoji: {
    fontSize: 18,
  },
  actionBtnText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  overviewOrderCard: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  orderHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontWeight: '800',
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  orderClient: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  orderAmount: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  filterScroll: {
    marginBottom: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#fff',
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  orderNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  orderDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  buyerName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  buyerPhone: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  buyerCity: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  orderItemsBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.xs,
  },
  orderItemLine: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    lineHeight: 18,
  },
  orderFooter: {
    marginTop: SPACING.xs,
  },
  orderTotal: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniStatusBtn: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  miniStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
  },
  primaryAddBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryAddBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: FONT_SIZES.sm,
  },
  catalogCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  catalogThumb: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  catalogInfo: {
    flex: 1,
  },
  catalogName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  catalogMeta: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: SPACING.xs,
  },
  deleteBtnText: {
    fontSize: 18,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  userAvatarTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  roleBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  roleBadgeTxt: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
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
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
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
  submitBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  submitBtnText: {
    fontWeight: '800',
    color: '#fff',
  },
});

export default AdminDashboardScreen;
