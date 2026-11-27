# Reaina's Haven — React Native Mobile Application 🌿📱

A cross-platform React Native & Expo mobile application built with botanical elegance, converting the entire **Reaina's Haven** web sanctuary experience into an iOS & Android app.

---

## 🏛️ Architecture & Folder Structure

```
d:\my-app\mobile\
├── assets/                  # Icons, splash screens, placeholders
├── src/
│   ├── api/                 # Axios clients & API modules
│   │   ├── client.js        # Configured Axios instance with JWT interceptor
│   │   ├── authApi.js       # Login, register, token refresh
│   │   ├── productApi.js    # Products, Café, Books, Experiences, Admin stats
│   │   ├── orderApi.js      # Orders, order details, delivery OTP verify
│   │   ├── paymentApi.js    # Razorpay order create & verification
│   │   └── userApi.js       # Profile, wishlist, activity feed, contact, AI
│   ├── components/          # Reusable UI widgets
│   │   ├── ProductCard.js   # Botanical product display card
│   │   ├── CafeCard.js      # Café food & beverage card with veg/non-veg tags
│   │   ├── SearchBar.js     # Responsive search input
│   │   ├── Loading.js       # Organic spinner loading indicator
│   │   └── EmptyState.js    # Friendly empty state display
│   ├── constants/           # Design system
│   │   └── theme.js         # Curated palette (Earthy greens, terracotta, warm cream)
│   ├── context/             # Global React state
│   │   ├── AuthContext.js   # Authentication & AsyncStorage token session
│   │   └── CartContext.js   # Persistent shopping cart, totals, badge counters
│   ├── navigation/          # Navigation flows
│   │   ├── RootNavigator.js # App-level root stack (Guest-friendly + Modal Auth)
│   │   ├── AppNavigator.js  # Bottom tab bar + nested stacks for all screens
│   │   └── AuthNavigator.js # Login & registration screens
│   └── screens/             # Complete sanctuary screens (1:1 Web Feature Parity)
│       ├── home/            # HomeScreen (Hero, categories, avenues, story)
│       ├── products/        # ProductListScreen, ProductDetailScreen (with reviews & wishlist)
│       ├── cafe/            # CafeScreen (Complete food & drink menu)
│       ├── books/           # BooksScreen (Haven Library, genres, reading corner)
│       ├── customization/   # CustomizationScreen (Bespoke bouquet & hamper builder)
│       ├── experiences/     # ExperiencesScreen (Pottery, candle & floral workshops)
│       ├── services/        # ServicesScreen (Daily tiffin, corporate catering, decor)
│       ├── about/           # AboutUsScreen (Sanctuary story, philosophy, Jabalpur roots)
│       ├── contact/         # ContactUsScreen (Location, phone, query submission)
│       ├── faq/             # FAQScreen (Accordion FAQ categories)
│       ├── policy/          # PolicyScreen (Shipping Policy & Refund / Return terms)
│       ├── cart/            # CartScreen (Item counters, price breakdown, free delivery hint)
│       ├── checkout/        # CheckoutScreen (Shipping address, COD / Online payment)
│       ├── orders/          # OrdersScreen, OrderDetailScreen (with live status & OTP verify)
│       ├── profile/         # ProfileScreen, UserDashboardScreen (Wishlist & activity), AIAssistantScreen
│       ├── admin/           # AdminDashboardScreen (Revenue stats, orders, product CRUD)
│       └── auth/            # LoginScreen, RegisterScreen
├── .env                     # Backend API & RAG AI endpoints
├── app.json                 # Expo project configuration
└── package.json             # App dependencies
```

---

## 🌟 1:1 Website Feature Parity

| Website Route | Mobile Screen | Description |
|---|---|---|
| `/` | `HomeScreen` | Hero, quick CTAs, featured flowers, kitchen specials, sanctuary avenues |
| `/products` | `ProductListScreen` | Grid catalog, category filtering, search, quick Add-to-Cart |
| `/product/:id` | `ProductDetailScreen` | Image gallery, pricing, stock counter, wishlist toggle, verified reviews |
| `/cafe` | `CafeScreen` | 100% vegetarian & artisanal beverages, parathas, coffee, desserts |
| `/books` | `BooksScreen` | Literary haven, genre filters, philosophy, poetry, borrowing info |
| `/customization` | `CustomizationScreen` | Interactive bouquet & hamper studio, packaging options, custom cards |
| `/experiences` | `ExperiencesScreen` | Clay pottery, flower arranging, scented candle workshops |
| `/services` | `ServicesScreen` | Homestyle tiffin subscriptions, event grazing tables, wedding hampers |
| `/aboutus` | `AboutUsScreen` | Founders' journey, Jabalpur sanctuary story, artisan values |
| `/contactus` | `ContactUsScreen` | Contact details, visit info, direct inquiry form |
| `/faq` | `FAQScreen` | Categorized accordion questions on care, shipping, custom orders |
| `/shipping-policy` | `PolicyScreen (Shipping)` | Jabalpur same-day slots, pan-India courier timelines, free shipping tier |
| `/refund-policy` | `PolicyScreen (Refund)` | Fresh flower replacement, book returns, refund timeline details |
| `/cart` | `CartScreen` | Basket list, quantity adjustments, clear cart, dynamic delivery calculator |
| `/checkout` | `CheckoutScreen` | Address form, delivery notes, Cash on Delivery & Razorpay payment |
| `/orders` | `OrdersScreen` | Complete user order history with status color badges |
| `/orders/:id` | `OrderDetailScreen` | Order timeline stepper, items list, delivery address, OTP verification |
| `/dashboard` | `UserDashboardScreen` | Wishlist grid (add to cart / remove), Activity feed, Profile editing |
| `/profile` | `ProfileScreen` | User summary, quick links to all sanctuary avenues, logout |
| `/admin` | `AdminDashboardScreen` | Live revenue, total orders, users, order status update, Product & Café CRUD |
| Haven AI Chat | `AIAssistantScreen` | Dedicated botanical AI assistant connected to RAG recommendation service |

---

## 🚀 How to Run the App

1. **Install Dependencies** (if not already installed):
   ```bash
   cd mobile
   npm install
   ```

2. **Start the Expo Development Server**:
   ```bash
   npm start
   ```

3. **Run on Target**:
   - **Android Emulator / Device**: Press `a` or run `npm run android`
   - **iOS Simulator / Device**: Press `i` or run `npm run ios`
   - **Web Preview**: Press `w` or run `npm run web`
   - **Physical Phone**: Scan the displayed QR code with the **Expo Go** app (Android) or Camera (iOS).

---

## 🔐 Environment Variables (`mobile/.env`)
- `EXPO_PUBLIC_API_URL`: Backend server URL (defaults to `http://10.0.2.2:5000` for Android emulator or `http://localhost:5000` for iOS/web).
- `EXPO_PUBLIC_RAG_URL`: FastAPI RAG chatbot service (`http://10.0.2.2:8000`).
- `EXPO_PUBLIC_RAZORPAY_KEY_ID`: Razorpay key ID for payment processing.
