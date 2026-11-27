import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import CafeScreen from '../screens/cafe/CafeScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderSuccessScreen from '../screens/checkout/OrderSuccessScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AIAssistantScreen from '../screens/profile/AIAssistantScreen';
import UserDashboardScreen from '../screens/profile/UserDashboardScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import BooksScreen from '../screens/books/BooksScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import ExperiencesScreen from '../screens/experiences/ExperiencesScreen';
import CustomizationScreen from '../screens/customization/CustomizationScreen';
import AboutUsScreen from '../screens/about/AboutUsScreen';
import ContactUsScreen from '../screens/contact/ContactUsScreen';
import FAQScreen from '../screens/faq/FAQScreen';
import PolicyScreen from '../screens/policy/PolicyScreen';

import { useCart } from '../context/CartContext';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Header Options ─────────────────────────────────────────────────────────
const getDefaultHeaderOptions = (title) => ({
  title,
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700', fontSize: FONT_SIZES.base },
  headerBackTitle: '',
});

// ─── Home Stack ─────────────────────────────────────────────────────────────
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{
        title: "Reaina's Haven",
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '800', fontSize: FONT_SIZES.lg },
      }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={getDefaultHeaderOptions('Product Details')}
    />
    <Stack.Screen
      name="Cafe"
      component={CafeScreen}
      options={getDefaultHeaderOptions('Sanctuary Café')}
    />
    <Stack.Screen
      name="Customization"
      component={CustomizationScreen}
      options={getDefaultHeaderOptions('Custom Floral Studio')}
    />
    <Stack.Screen
      name="Books"
      component={BooksScreen}
      options={getDefaultHeaderOptions('The Haven Library')}
    />
    <Stack.Screen
      name="Experiences"
      component={ExperiencesScreen}
      options={getDefaultHeaderOptions('Sanctuary Workshops')}
    />
    <Stack.Screen
      name="Services"
      component={ServicesScreen}
      options={getDefaultHeaderOptions('Tiffins & Artisan Services')}
    />
    <Stack.Screen
      name="AboutUs"
      component={AboutUsScreen}
      options={getDefaultHeaderOptions('About Our Sanctuary')}
    />
    <Stack.Screen
      name="Contact"
      component={ContactUsScreen}
      options={getDefaultHeaderOptions('Contact & Visit Us')}
    />
    <Stack.Screen
      name="FAQ"
      component={FAQScreen}
      options={getDefaultHeaderOptions('Frequently Asked Questions')}
    />
    <Stack.Screen
      name="ShippingPolicy"
      component={PolicyScreen}
      initialParams={{ type: 'shipping' }}
      options={getDefaultHeaderOptions('Shipping Policy')}
    />
    <Stack.Screen
      name="RefundPolicy"
      component={PolicyScreen}
      initialParams={{ type: 'refund' }}
      options={getDefaultHeaderOptions('Refund Policy')}
    />
    <Stack.Screen
      name="AIAssistant"
      component={AIAssistantScreen}
      options={getDefaultHeaderOptions('Haven AI Assistant')}
    />
    <Stack.Screen
      name="UserDashboard"
      component={UserDashboardScreen}
      options={getDefaultHeaderOptions('My Sanctuary Dashboard')}
    />
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={getDefaultHeaderOptions('Sanctuary Admin Console')}
    />
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={getDefaultHeaderOptions('My Cart')}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={getDefaultHeaderOptions('Checkout')}
    />
    <Stack.Screen
      name="OrderSuccess"
      component={OrderSuccessScreen}
      options={{
        ...getDefaultHeaderOptions('Order Confirmed'),
        headerLeft: () => null,
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

// ─── Products/Explore Stack ─────────────────────────────────────────────────
const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
    <Stack.Screen
      name="ProductList"
      component={ProductListScreen}
      options={getDefaultHeaderOptions('Shop Botanicals & Gifts')}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={getDefaultHeaderOptions('Product Details')}
    />
    <Stack.Screen
      name="Cafe"
      component={CafeScreen}
      options={getDefaultHeaderOptions('Café Menu')}
    />
    <Stack.Screen
      name="Customization"
      component={CustomizationScreen}
      options={getDefaultHeaderOptions('Custom Floral Studio')}
    />
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={getDefaultHeaderOptions('My Cart')}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={getDefaultHeaderOptions('Checkout')}
    />
    <Stack.Screen
      name="OrderSuccess"
      component={OrderSuccessScreen}
      options={{
        ...getDefaultHeaderOptions('Order Confirmed'),
        headerLeft: () => null,
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

// ─── Cart Stack ──────────────────────────────────────────────────────────────
const CartStack = () => (
  <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
    <Stack.Screen
      name="CartMain"
      component={CartScreen}
      options={getDefaultHeaderOptions('My Cart')}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={getDefaultHeaderOptions('Checkout')}
    />
    <Stack.Screen
      name="OrderSuccess"
      component={OrderSuccessScreen}
      options={{
        ...getDefaultHeaderOptions('Order Confirmed'),
        headerLeft: () => null,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={getDefaultHeaderOptions('Product Details')}
    />
  </Stack.Navigator>
);

// ─── Orders Stack ────────────────────────────────────────────────────────────
const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
    <Stack.Screen
      name="OrdersList"
      component={OrdersScreen}
      options={getDefaultHeaderOptions('My Orders')}
    />
    <Stack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={getDefaultHeaderOptions('Order Details')}
    />
  </Stack.Navigator>
);

// ─── Profile Stack ────────────────────────────────────────────────────────────
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={getDefaultHeaderOptions('My Profile')}
    />
    <Stack.Screen
      name="UserDashboard"
      component={UserDashboardScreen}
      options={getDefaultHeaderOptions('Sanctuary Dashboard')}
    />
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={getDefaultHeaderOptions('Admin Console')}
    />
    <Stack.Screen
      name="AIAssistant"
      component={AIAssistantScreen}
      options={{
        ...getDefaultHeaderOptions('Haven AI'),
        headerStyle: { backgroundColor: COLORS.primary },
      }}
    />
    <Stack.Screen name="Orders" component={OrdersScreen} options={getDefaultHeaderOptions('My Orders')} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={getDefaultHeaderOptions('Order Details')} />
    <Stack.Screen
      name="Customization"
      component={CustomizationScreen}
      options={getDefaultHeaderOptions('Custom Floral Studio')}
    />
    <Stack.Screen
      name="Books"
      component={BooksScreen}
      options={getDefaultHeaderOptions('The Haven Library')}
    />
    <Stack.Screen
      name="Experiences"
      component={ExperiencesScreen}
      options={getDefaultHeaderOptions('Sanctuary Workshops')}
    />
    <Stack.Screen
      name="Services"
      component={ServicesScreen}
      options={getDefaultHeaderOptions('Tiffins & Artisan Services')}
    />
    <Stack.Screen
      name="AboutUs"
      component={AboutUsScreen}
      options={getDefaultHeaderOptions('Sanctuary Story')}
    />
    <Stack.Screen
      name="Contact"
      component={ContactUsScreen}
      options={getDefaultHeaderOptions('Contact Us')}
    />
    <Stack.Screen
      name="FAQ"
      component={FAQScreen}
      options={getDefaultHeaderOptions('Frequently Asked Questions')}
    />
    <Stack.Screen
      name="ShippingPolicy"
      component={PolicyScreen}
      initialParams={{ type: 'shipping' }}
      options={getDefaultHeaderOptions('Shipping Policy')}
    />
    <Stack.Screen
      name="RefundPolicy"
      component={PolicyScreen}
      initialParams={{ type: 'refund' }}
      options={getDefaultHeaderOptions('Refund Policy')}
    />
  </Stack.Navigator>
);

// ─── Tab Icon ─────────────────────────────────────────────────────────────────
const TabIcon = ({ emoji, label, focused, badge }) => (
  <View style={{ alignItems: 'center', marginTop: 4 }}>
    <View style={{ position: 'relative' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>
      {badge > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -8,
            backgroundColor: '#e53e3e',
            borderRadius: 10,
            minWidth: 18,
            height: 18,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </View>
  </View>
);

// ─── Tab Navigator ────────────────────────────────────────────────────────────
const AppNavigator = () => {
  const { cartItemsCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tabBackground,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsStack}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛍️" label="Explore" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛒" label="Cart" focused={focused} badge={cartItemsCount} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📦" label="Orders" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
