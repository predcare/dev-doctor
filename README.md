# 🩺 DoctoPredApp (Pred Care Doctor App)

> **Pred Care Doctor** is a feature-rich, high-performance cross-platform mobile application built with **React Native** (v0.78.3) and **TypeScript**. Designed specifically for medical practitioners, it enables doctors to seamlessly manage patient records, schedule appointments, handle video consultation meetings, generate digital prescriptions, configure invoices, set weekly availability slots, and receive real-time push notifications.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack & Dependencies](#%EF%B8%8F-tech-stack--dependencies)
- [📁 Folder & File Architecture](#-folder--file-architecture)
- [🗺️ App Navigation & Screen Hierarchy](#%EF%B8%8F-app-navigation--screen-hierarchy)
- [📱 Page-Wise API Endpoint & Payload Breakdown](#-page-wise-api-endpoint--payload-breakdown)
- [🌐 API Endpoints & Integration](#-api-endpoints--integration)
- [⚙️ State Management & Data Flow](#%EF%B8%8F-state-management--data-flow)
- [🎨 Styling & Theme System](#-styling--theme-system)
- [🚀 Getting Started](#-getting-started)
- [📜 Available Scripts](#-available-scripts)

---

## ✨ Features

- **🔐 Authentication & Security**: OTP-based login flow with persistent JWT token storage (`AsyncStorage`) and auto-logout handle on token expiration (401 response interceptor).
- **📊 Home Dashboard**: Quick overview of daily appointments, patient statistics, quick action shortcuts, and active consultation alerts.
- **👨‍⚕️ Doctor Profile Management**: Update medical specialization, registration number, qualification details, clinic address, and avatar image.
- **👥 Patient Record Management**: Add new patients, link existing patients via mobile, edit patient demographics, and inspect detailed patient histories.
- **📅 Appointment Scheduling & Management**: View daily schedule, book appointments, reschedule existing slots, and filter past/upcoming consultations.
- **📹 Teleconsultation & Video Calls**: Integrated in-app video meeting interface supporting Floating Picture-in-Picture (PiP) window overlay during navigation.
- **📑 Digital Prescription Builder**: Create, update, draft, view, export to PDF, and share medical prescriptions directly with patients via email.
- **🧾 Invoice & Billing Management**: Create customizable medical invoices, configure tax/fee structures, upload digital signatures, and list past transactions.
- **⏰ Flexible Doctor Availability**: Define custom work schedules, clinic times, break hours, and dynamic appointment slot intervals.
- **🔔 Real-time Notifications**: Firebase Cloud Messaging (FCM) integration for push notifications on new bookings, reschedules, and call invites.

---

## 🛠️ Tech Stack & Dependencies

### Core Framework & Runtime
| Package | Version | Description |
| :--- | :--- | :--- |
| **`react`** | `19.0.0` | Core UI library |
| **`react-native`** | `0.78.3` | Mobile application framework |
| **`typescript`** | `^5.7.0` | Static typing and interfaces |
| **`node`** | `>= 18` | Required runtime environment |

### Navigation
| Package | Version | Description |
| :--- | :--- | :--- |
| **`@react-navigation/native`** | `^7.3.16` | Routing core |
| **`@react-navigation/native-stack`** | `^7.18.8` | Native Stack Navigator |
| **`@react-navigation/bottom-tabs`** | `^7.18.16` | Bottom Tab Navigator |
| **`react-native-screens`** | `^4.18.0` | Native screen primitive optimizations |
| **`react-native-safe-area-context`** | `^5.8.1` | Inset and safe area handling |

### Data Fetching, State & Forms
| Package | Version | Description |
| :--- | :--- | :--- |
| **`axios`** | `^1.20.0` | HTTP client with global interceptors |
| **`@tanstack/react-query`** | `^5.102.8` | Async server-state management & caching |
| **`zustand`** | `^5.0.15` | Global client-state stores |
| **`react-hook-form`** | `^7.85.0` | Form state management |
| **`yup`** | `^1.7.1` | Schema validation |
| **`@hookform/resolvers`** | `^5.7.1` | Form validation bridge for Yup |

### Storage, Notifications & Utilities
| Package | Version | Description |
| :--- | :--- | :--- |
| **`@react-native-async-storage/async-storage`** | `^1.24.0` | Local key-value storage |
| **`@react-native-firebase/app`** | `^21.14.0` | Firebase core app SDK |
| **`@react-native-firebase/messaging`** | `^21.14.0` | FCM Push notifications |
| **`react-native-image-picker`** | `^8.2.1` | Camera and gallery asset picker |
| **`react-native-svg`** | `^15.15.5` | Vector SVG rendering |
| **`react-native-toast-message`** | `^2.4.0` | Global toast notification banner |
| **`dayjs`** | `^1.11.23` | Date parsing & formatting |
| **`eventemitter3`** | `^5.0.4` | App-wide event bus |

---

## 📁 Folder & File Architecture

```text
predcaredoctor/
├── App.tsx                          # Application entry wrapper with Global Providers & Modals
├── index.js                         # React Native registerComponent entry point
├── package.json                     # Dependency manifests & NPM scripts
├── tsconfig.json                    # TypeScript configuration
├── android/                         # Android native project codebase
├── ios/                             # iOS native project codebase
└── src/                             # Main application source code
    ├── api/                         # Axios client & route definitions
    │   ├── apiClient.ts             # Axios instance, Bearer token interceptor, global error handler
    │   └── endpoints.ts             # API Base URLs & Endpoint path constants
    │
    ├── assets/                      # Static assets, local graphics & media files
    │
    ├── components/                  # UI Components directory
    │   ├── commons/                 # Reusable UI overlays & shared controls
    │   │   ├── BackdropLoader/      # Global loading backdrop spinner
    │   │   ├── CommonConfirmModal/  # Reusable confirmation modal
    │   │   ├── CommonEmptyCard/     # Standard empty state component
    │   │   ├── CommonErrorCard/     # Error display card
    │   │   ├── DatePickerModal/     # Date selection picker modal
    │   │   ├── EventListener/       # Global application event handler
    │   │   ├── OtpInput.tsx         # OTP pin code input field
    │   │   ├── PopupAlert/          # Global pop-up alert dialog
    │   │   ├── SectionHeader/       # Reusable screen section title header
    │   │   ├── SignatureControl/    # Canvas signature drawing component
    │   │   └── UploadOptionsModal/  # Image upload selection popup
    │   ├── Modules/                 # Feature-specific composite modules
    │   │   ├── AccountSettings/     # Account setting profile cards & options
    │   │   ├── Availability/        # Availability scheduling time blocks
    │   │   ├── Dashboard/           # Dashboard stats & quick action cards
    │   │   ├── Invoice/             # Invoice templates & billing line items
    │   │   ├── Notifications/       # Notification list items
    │   │   ├── PatientDetails/      # Patient profile info, history & prescription tabs
    │   │   ├── Patients/            # Patient list cards & search controls
    │   │   └── Profile/             # Doctor profile form modules
    │   ├── providers/               # App-wide context providers (ReactQueryProvider)
    │   ├── Skeletons/               # Animated skeleton loader placeholders
    │   └── ui/                      # Base UI primitives, custom tabs, navigation menus & SVGs
    │       ├── CustomMenu/          # Dropdown menu wrapper
    │       ├── CustomTabs/          # Customized tab bar selector
    │       ├── FloatingMeetingWidget.tsx # Floating PiP call widget during consultation
    │       └── icons/               # SVG icon components (Home, Patient, Schedule, etc.)
    │
    ├── config/                      # Application environment constants & static configuration
    │
    ├── hooks/                       # Custom React Hooks
    │   ├── commons/                 # Shared event and notification hooks
    │   ├── react-query/             # React Query custom hooks organized by domain
    │   │   ├── auth/                # Auth login & OTP query hooks
    │   │   ├── availability/        # Availability slot hooks
    │   │   ├── common/              # Master data query hooks (countries, states, cities)
    │   │   ├── patients/            # Patient management query hooks
    │   │   ├── prescriptions/       # Prescription creation & fetch hooks
    │   │   ├── profile/             # Profile query hooks
    │   │   ├── support/             # Help & support query hooks
    │   │   └── query.keys.ts        # Centralized React Query key Enums
    │   └── useFirebaseMessaging.ts  # Push notification listeners hook
    │
    ├── Layout/                      # Common container layouts & wrappers
    │
    ├── lib/                         # Core library helpers & services
    │   ├── common/                  # AsyncStorage helpers & storage keys definition
    │   ├── functions/               # Helper utilities & notification toast triggers (_helpers.lib)
    │   └── services/                # Global event emitter bus setup
    │
    ├── navigation/                  # React Navigation stack & tab configuration
    │   ├── AppNavigator.tsx         # Main Stack & Bottom Tab Navigators setup
    │   ├── DoctorCallContext.tsx    # Context store for active call state
    │   ├── DoctorFloatingPiP.tsx    # Floating Call Picture-in-Picture window overlay
    │   └── withScreenFocus.tsx      # Screen focus Higher-Order Component
    │
    ├── resources/                   # Static regional data (countries, states, cities datasets)
    │
    ├── route/                       # Navigation TypeScript declarations & Route name constants
    │   └── index.ts                 # ROUTES object, RootStackParamList & DashboardTabParamList types
    │
    ├── Screens/                     # Application Screen components
    │   ├── Auth/                    # Authentication screens
    │   │   └── LoginScreen.tsx      # Mobile OTP authentication screen
    │   ├── DashboardScreen/         # Primary dashboard feature screens
    │   │   ├── AddPatientScreen.tsx              # Add new patient form screen
    │   │   ├── AvailabilityScreen.tsx            # Manage slot schedules screen
    │   │   ├── BookAppointmentScreen.tsx        # Book patient appointment screen
    │   │   ├── CreateInvoiceScreen.tsx           # Generate billing invoice screen
    │   │   ├── DoctorAppointmentsScreen.tsx      # Appointment list screen
    │   │   ├── DoctorMeetingScreen.tsx           # Video call teleconsultation screen
    │   │   ├── DoctorProfileScreen.tsx           # View & edit doctor profile screen
    │   │   ├── EditPatientScreen.tsx             # Edit patient information screen
    │   │   ├── HomeScreen.tsx                    # Main doctor home dashboard
    │   │   ├── InvoiceListScreen.tsx             # Billing history screen
    │   │   ├── InvoiceSettingsScreen.tsx         # Invoice settings & signature configuration
    │   │   ├── NotificationsScreen.tsx           # System notifications screen
    │   │   ├── PatientDetailsScreen.tsx          # Patient detail summary screen
    │   │   ├── PatientsScreen.tsx                # Patient directory list screen
    │   │   ├── PrescriptionSettingsScreen.tsx    # Rx template & header/footer setup
    │   │   ├── PrescriptionViewScreen.tsx        # Rx PDF preview screen
    │   │   ├── RescheduleAppointmentScreen.tsx   # Reschedule booking screen
    │   │   └── SettingScreen.tsx                 # Account settings screen
    │   ├── ComingSoonScreen.tsx     # Placeholder screen for upcoming modules (Analytics/Reports)
    │   └── SplashScreen.tsx         # Initial splash loading screen
    │
    ├── styled/                      # Emotion / Styled Components design tokens & styles
    │   ├── theme.styled.ts          # Central theme color palette, typography & spacing
    │   └── *.styled.ts              # Screen-specific styled component files
    │
    ├── typescripts/                 # Shared TypeScript interfaces & types
    │   ├── enums/                   # Global application enums
    │   ├── interfaces/              # Data model & API response interface definitions
    │   └── types/                   # Type aliases
    │
    ├── utils/                       # Date formatters, validation utilities, text helpers
    │
    └── zustand/                     # Global client state management
        └── stores/                  # Zustand store modules
            ├── useAlertStore.ts     # Global alert dialog state store
            ├── useAuthStore.ts      # Authentication & user session store
            └── useLoadingStore.ts   # Global loading backdrop store
```

---

## 🗺️ App Navigation & Screen Hierarchy

The application utilizes a composite navigation architecture combining **Native Stack Navigator** with a **Bottom Tab Navigator**.

```mermaid
graph TD
    A[Splash Screen] -->|Unauthenticated| B[Login Screen]
    A -->|Authenticated| C[Main Tabs Navigator]
    B -->|Verify OTP| C

    subgraph Main Tabs Navigator (Bottom Bar)
        C1[Home Screen]
        C2[Patients Screen]
        C3[Schedule Screen]
        C4[Reports Screen - Coming Soon]
        C5[Account Settings Screen]
    end

    C --> C1
    C --> C2
    C --> C3
    C --> C4
    C --> C5

    C1 -->|Quick Link| D[Notifications Screen]
    C1 -->|Quick Link| E[Doctor Profile Screen]
    C1 -->|Start Consultation| F[Doctor Meeting Screen]
    C2 -->|Add New| G[Add Patient Screen]
    C2 -->|Select Patient| H[Patient Details Screen]
    H -->|Edit| I[Edit Patient Screen]
    H -->|Generate Invoice| J[Create Invoice Screen]
    H -->|View Rx| K[Prescription View Screen]
    C3 -->|Book New| L[Book Appointment Screen]
    C3 -->|Reschedule| M[Reschedule Appointment Screen]
    C5 -->|Configure Rx| N[Prescription Settings Screen]
    C5 -->|Configure Invoice| O[Invoice Settings Screen]
    C5 -->|Manage Slots| P[Availability Screen]
    C5 -->|View Invoices| Q[Invoice List Screen]
```

### Route Definitions (`ROUTES`)

| Route Name | Screen Component | Description |
| :--- | :--- | :--- |
| `Splash` | `SplashScreen` | App initialization & session validation |
| `Login` | `LoginScreen` | Doctor OTP authentication |
| `MainTabs` | `DashboardTabNavigator` | Root bottom tab container |
| `Home` | `HomeScreen` | Home dashboard tab |
| `Patients` | `PatientsScreen` | Patient directory tab |
| `Schedule` | `DoctorAppointmentsScreen` | Timetable & appointment list tab |
| `Reports` | `ComingSoonScreen` | Health analytics tab (Coming Soon) |
| `Account` | `SettingScreen` | Account settings overview tab |
| `DoctorProfile` | `DoctorProfileScreen` | View & update doctor profile details |
| `AddPatient` | `AddPatientScreen` | Register new patient record |
| `EditPatient` | `EditPatientScreen` | Update patient profile |
| `PatientDetails` | `PatientDetailsScreen` | Detailed patient history, consultations & Rx history |
| `Availability` | `AvailabilityScreen` | Manage working schedule & slot duration |
| `BookAppointment` | `BookAppointmentScreen` | Schedule consultation for patient |
| `DoctorAppointments` | `DoctorAppointmentsScreen` | Full list of doctor appointments |
| `RescheduleAppointment`| `RescheduleAppointmentScreen`| Modify appointment date/time |
| `DoctorMeeting` | `DoctorMeetingScreen` | Video consultation room with PiP overlay |
| `PrescriptionSettings` | `PrescriptionSettingsScreen` | Configure prescription header, signature & fields |
| `PrescriptionView` | `PrescriptionViewScreen` | Render & export prescription PDF |
| `InvoiceSettings` | `InvoiceSettingsScreen` | Configure invoice header & tax settings |
| `InvoiceList` | `InvoiceListScreen` | Manage created invoices |
| `CreateInvoice` | `CreateInvoiceScreen` | Generate patient bill/invoice |
| `Notifications` | `NotificationsScreen` | System notification drawer |

---

## 📱 Page-Wise API Endpoint & Payload Breakdown

This section details the primary core page APIs, HTTP methods, route paths, request payloads, and expected responses.

---

### 1. 🔑 Login Screen (`LoginScreen.tsx`)
**APIs Used**: `2` APIs

#### 1.1 Send OTP API
- **Endpoint**: `POST /doctor/auth/send-otp`
- **Hook**: `useSendOtp()`
- **Description**: Sends a 6-digit OTP code to the doctor's registered mobile number or email address.
- **Request Payload**:
  ```json
  {
    "identifier": "9876543210",
    "method": "mobile"
  }
  ```
- **Response Structure**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "OTP sent successfully to 9876543210"
  }
  ```

#### 1.2 Verify OTP API
- **Endpoint**: `POST /doctor/auth/verify-otp`
- **Hook**: `useVerifyOTP()`
- **Description**: Verifies the OTP, authenticates the doctor, generates a Bearer JWT token, and returns user profile details.
- **Request Payload**:
  ```json
  {
    "identifier": "9876543210",
    "platform": "android",
    "otp": "123456",
    "fcm_token": "fcm_token_string_sample",
    "device_name": "Samsung Galaxy S23"
  }
  ```
- **Response Structure**:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 12,
        "name": "Dr. Alex Johnson",
        "email": "dralex@predcare.in",
        "mobile_number": "9876543210",
        "role": "doctor"
      }
    }
  }
  ```

---

### 2. 🏠 Doctor Profile API (`HomeScreen.tsx` / `DoctorProfileScreen.tsx`)
**APIs Used**: `1` API

#### 2.1 Fetch Doctor Profile API
- **Endpoint**: `GET /doctor/own-profile`
- **Hook**: `useProfile()`
- **Description**: Retrieves the logged-in doctor's detailed professional and personal profile.
- **Request Parameters**: None (Header contains `Authorization: Bearer <token>`)
- **Response Structure**:
  ```json
  {
    "status": 200,
    "doctor": {
      "id": 12,
      "name": "Dr. Alex Johnson",
      "specialization": "Cardiologist",
      "registration_number": "REG-884920",
      "experience_years": 12,
      "email": "dralex@predcare.in",
      "mobile": "+919876543210",
      "clinic_name": "PredCare Health Clinic",
      "clinic_address": "123 Medical Hub, Bandra West, Mumbai",
      "profile_image": "storage/doctors/avatars/doc_12.jpg"
    }
  }
  ```

---



## 🌐 API Endpoints & Integration

- **Base URL**: `https://api-stage.predcare.in`
- **API Version Path**: `/api/v1`

### Endpoints Registry

```typescript
export const endpoints = {
  auth: {
    sendOtp: '/doctor/auth/send-otp',
    verifyOtp: '/doctor/auth/verify-otp',
    users: '/doctor/auth/users',
  },
  profile: {
    get: '/doctor/own-profile',
    update: '/doctors/user/',
  },
  patients: {
    get: '/doctor/patients/doctor/',
    delete: '/doctor/patients/',
    linkExisting: '/doctor/patients/link-existing',
    newCreate: '/doctor/patients/add',
    sendCred: '/doctor/patients/send-credentials',
  },
};
```

### Axios Interceptor Behavior (`apiClient.ts`)

1. **Request Interceptor**: Reads `AUTH_TOKEN` from `AsyncStorage` and automatically attaches `Authorization: Bearer <token>` to request headers.
2. **Response Interceptor**:
   - For `POST`/`PUT`/`PATCH`/`DELETE` success actions on configured endpoints, displays global success/warning toast alerts (`globalSuccess`, `globalWarning`).
   - Handles `401 Unauthorized` responses by emitting `events.logoutCurrentUser` on the global EventEmitter, notifying the app to clear session storage and navigate to `LoginScreen`.
   - Manages network failure codes (`ERR_NETWORK`) by popping global error toasts.

---

## ⚙️ State Management & Data Flow

### 1. Server State (TanStack React Query v5)
- All network interactions use custom query/mutation hooks.
- Query keys are defined centrally in `src/hooks/react-query/query.keys.ts`:
  - `AuthQueryKey` (`SEND_OTP`, `VERIFY_OTP`, `GET_USERS`)
  - `ProfileQueryKeys` (`Profile`, `UpdateProfile`)
  - `PatientsQueryKeys` (`Patients`, `LinkExisting`, `NewCreate`, `SendCred`)
  - `PrescriptionQueryKeys` (`Settings`, `UploadSignature`, `ByDoctor`, `ByPatient`, `Create`, `Update`, `Pdf`)
  - `InvoiceQueryKeys` (`Settings`, `UploadSignature`)
  - `DoctorAvailabilityQueryKeys` (`ByDoctor`, `AvailableSlots`, `ById`)
  - `AppointmentsQueryKeys` (`BookedSlots`, `Book`)

### 2. Client State (Zustand)
- **`useAuthStore`**: Manages current authenticated user session, token presence, and doctor metadata.
- **`useAlertStore`**: Controls visibility, title, message, and callbacks for the app-wide modal popup dialog.
- **`useLoadingStore`**: Controls full-screen transparent loading overlay backdrop during heavy async tasks.

---

## 🎨 Styling & Theme System

Styling is implemented using styled-component objects with centralized tokens defined in `src/styled/theme.styled.ts`:

```typescript
export const theme = {
  colors: {
    primary: '#0F766E',       // Teal primary theme color
    primaryLight: '#CCFBF1',  // Soft teal background fill
    secondary: '#0284C7',     // Sky blue secondary accent
    background: '#F8FAFC',    // Slate background tint
    cardBg: '#FFFFFF',        // White surface background
    textDark: '#0F172A',      // Dark slate primary text
    textMuted: '#64748B',     // Slate muted text
    border: '#E2E8F0',        // Light border divider
    danger: '#EF4444',        // Red warning/error
    success: '#10B981',       // Green status indicator
  },
  typography: {
    fontFamily: 'System',
    fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 26 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
};
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [React Native CLI](https://reactnative.dev/docs/environment-setup) setup
- **Android**: Android Studio with SDK build tools & Emulator (or physical device)
- **iOS** *(macOS only)*: Xcode with CocoaPods (`pod install`) & iOS Simulator

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/iamsahilmallick/pred-doctor-app.git
   cd predcaredoctor
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install CocoaPods (iOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro Bundler**
   ```bash
   npm start
   ```

5. **Run the Application**
   - **Android**:
     ```bash
     npm run android
     ```
   - **iOS**:
     ```bash
     npm run ios
     ```

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm start` | Starts the Metro bundler server |
| `npm run android` | Builds and launches the app on Android |
| `npm run ios` | Builds and launches the app on iOS Simulator |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm test` | Runs unit tests via Jest |

---

<p align="center">
  <i>Built for <b>Pred Care</b> Medical Healthcare System.</i>
</p>
