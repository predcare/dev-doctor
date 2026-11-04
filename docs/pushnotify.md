# Push Notifications + Incoming Call Ringing Plan: PRED Doctor App (Android and iOS)

**Status:** plan only, no code changed yet. Implementation starts after review.
**Goal:** the doctor app gets exactly the same push notification and incoming call ringing code as the patient app (`predcarepatient`), with the same files and folders, on Android and iOS. When a patient joins the consultation room, the doctor's phone rings in every app state (open, background, closed, locked). Answer joins the video call; Decline stops the ring.
**Source:** the patient app's current code, read file by file on 2026-11-04. Every file below is a copy of the patient file, with only the changes needed for the doctor app (marked `// doctor:`).

## Rules for this work

1. **Copy, then align.** Each new file is the patient file with the doctor app's paths, routes, stores and texts. The logic doesn't change.
2. **Nothing is removed from `ios/` or `android/`.** Native files only get added lines. There's one exception, the 4 `HEADER_SEARCH_PATHS` lines in `ios/Podfile`, explained in step 3.3.
3. **Out of scope:** the backend, and the Firebase / Apple console setup (Firebase apps, SHA fingerprints, signing report and APNs key are already done).
4. **Existing doctor code stays.** These files are **not** changed: `SocketListeners.tsx`, `GlobalIncomingCallBanner.tsx`, `IncomingCallBanner.tsx`, `useIncomingCallStore.ts`, `useJoinVideoCall.ts`, `useDevicePermissions.ts`, `src/config/notification.constants.ts`, all meeting hooks, the PiP native code, `MainApplication.kt` and `SettingScreen.tsx`.

---

## 1. Behaviour after this plan (same as the patient app)

| Platform | App open | Background | Closed | Locked |
| --- | --- | --- | --- | --- |
| **Android** | PRED Doctor call notification (heads-up), ringing, **Decline / Answer** | Same | Same (FCM data push → background handler) | Same, on the lock screen; Answer → unlock → joins |
| **iOS** | CallKit call screen (from FCM `onMessage`) | CallKit (VoIP push → `AppDelegate+PushKit.swift`) | CallKit (VoIP push) | CallKit; Answer → unlock → joins |

- Android uses CallKeep **self-managed** mode with PRED Doctor's own Notifee call notification. No phone permission or calling-account prompt is needed.
- iOS uses CallKit, set up natively in `AppDelegate`, and PushKit VoIP pushes.
- After Answer, the system call ends and the doctor's existing join runs, opening the `DoctorMeeting` screen.
- Stale-call protection is the same as the patient app: handled calls are kept for 12 h, there's a 45 s answer window, and `MainActivity` drops replayed notification extras.
- Other pushes (appointments, "Patient is waiting", EMR) show a Notifee banner when the app is open, and a tap opens the right screen.

---

## 2. Files and folders

`A` = new file, copied from the patient app and aligned. `M+` = existing doctor file, **lines added only**. `M` = existing doctor file, a few lines replaced (named in the step).

```text
predcaredoctor/
├── .gitignore                                          M+  *.p8, *.p12
├── package.json                                        M+  4 packages (step 1)
├── index.js                                            M+  background push, notification and CallKeep handlers
├── App.tsx                                             M+  setupPush, CallKeep listeners, VoIP token, <NotificationEventListener/>
├── notifyfiles/                                        -   delete after step 2.1 / 3.1 copy the files
│
├── android/
│   ├── build.gradle                                    M+  google-services classpath
│   └── app/
│       ├── build.gradle                                M+  apply google-services plugin
│       ├── google-services.json                        A   from notifyfiles/
│       └── src/main/
│           ├── AndroidManifest.xml                     M+  FOREGROUND_SERVICE_PHONE_CALL, VoiceConnectionService, FCM meta-data
│           ├── res/raw/ringtone.mp3                    -   already there (used by the call channel)
│           └── java/com/predcaredoctor/MainActivity.kt M+  onCreate, onNewIntent, dropReplayedNotification
│
├── ios/
│   ├── Podfile                                         M   dynamic frameworks (+ 4 header-path lines replaced)
│   ├── predcaredoctor.xcodeproj/project.pbxproj        M+  done by Xcode
│   └── predcaredoctor/
│       ├── AppDelegate.swift                           M+  Firebase, CallKit setup, PushKit registration
│       ├── AppDelegate+PushKit.swift                   A   VoIP push → CallKit
│       ├── GoogleService-Info.plist                    A   from notifyfiles/
│       ├── predcaredoctor.entitlements                 A   aps-environment (Xcode creates it)
│       ├── Info.plist                                  M+  `fetch` background mode
│       ├── ringtone.caf                                A   copied from the patient app
│       └── Images.xcassets/CallKitBlank.imageset/      A   copied from the patient app
│
└── src/
    ├── Features/
    │   ├── Auth/LoginScreen.tsx                        M   real device info in the OTP payload, + syncPushToken
    │   └── SplashScreen/SplashScreen.tsx               M+  initial notification, call replay, pending answer, token sync
    ├── hooks/commons/useDeviceInfo.ts                  A
    ├── lib/commons/
    │   ├── asyncStorage.ts                             M+  DEVICE_ID, VOIP_TOKEN keys
    │   ├── file.utils.ts                               M+  openOrShareFile (used by the download notification)
    │   └── navigation.utils.ts                         M+  setTargetRoute
    ├── route/index.ts                                  M+  isComingFromNotification param on AppointmentDetails
    ├── services/api/endpoints.ts                       M+  notifications.registerToken
    ├── zustand/stores/useAuthStore.ts                  M   logout keeps DEVICE_ID and VOIP_TOKEN
    │
    ├── services/notifications/                         A   whole folder, same as the patient app
    │   ├── index.ts
    │   ├── notification.core.ts
    │   ├── notification.types.ts
    │   ├── notificationDispatcher.ts
    │   ├── components/NotificationEventListener.tsx
    │   ├── handlers/downloadNotification.handler.ts
    │   ├── handlers/meetingNotification.handler.ts
    │   ├── handlers/pushNotification.handler.ts
    │   ├── push/pushDisplay.ts
    │   ├── push/pushSetup.ts
    │   └── push/pushToken.ts
    │
    └── services/calls/                                 A   whole folder, same as the patient app
        ├── call.types.ts
        ├── callPayload.ts
        ├── callKeepSetup.ts
        ├── callPermissionPrompt.ts
        ├── callService.ts
        ├── androidRing.ts
        ├── handledCalls.ts
        ├── joinIncomingCall.ts
        ├── deviceSync.ts
        └── voipToken.ts
```

### Doctor alignment (applied in every copied file)

| Patient app | Doctor app |
| --- | --- |
| `src/lib/common/…` | `src/lib/commons/…` |
| `AppRoute.MEETING` | `AppRoute.DOCTOR_MEETING` |
| Caller is a doctor: `caller_role: 'doctor'`, default name `'Your doctor'` | Caller is a patient: `caller_role: 'patient'`, default name `'Your patient'` |
| `user_type: 'patient'` | `user_type: 'doctor'` |
| `'PRED Care'` (CallKit / Telecom label) | `'PRED Doctor'` (the doctor app's `CFBundleDisplayName`) |
| `getApptInfo`, `AppointmemntQueryKey.INFO`, `doctorInfo` | `getMyAppointmentInfo`, `MyAppointmentsQueryKeys.MyAppointmentsInfo`, `patientInfo` |
| `openJoinTracks` / `releaseJoinTracks` from the patient's `useJoinVideoCall.ts` | Same two helpers, inside `joinIncomingCall.ts`, built from the doctor's `meetingMediaTracks.ts` (so `useJoinVideoCall.ts` isn't touched) |
| Patient routes (`SCHEDULE`, `DOCTOR_DETAILS`, `DOCTORS`) | Doctor routes (`APPOINTMENT_DETAILS`, `APPOINTMENTS`, and the in-app notification list routing) |
| Join from a push: no gate | Join from a push: `ensureClinicAccess()`, the same gate as every doctor Join button |
| `initializeI18n()` / `LanguageProvider` | Not in the doctor app; not added |

---

## 3. Step 1: packages

```bash
npm install @react-native-firebase/app@^27.1.0 @react-native-firebase/messaging@^27.1.0 \
  react-native-callkeep@^4.6.1 react-native-voip-push-notification@^3.3.3
```

These are the same versions as the patient app. `@notifee/react-native`, `react-native-permissions`, `react-native-sound`, `@videosdk.live/react-native-incallmanager` and `@react-native-async-storage/async-storage` are already installed.

**`.gitignore`** (add at the end):

```gitignore
*.p8
*.p12
```

---

## 4. Step 2: Android (lines added only)

### 2.1 Config file

```bash
cp notifyfiles/google-services.json android/app/google-services.json
```

### 2.2 `android/build.gradle`

In `buildscript.dependencies`, add one line under the existing three:

```groovy
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
        classpath("com.google.gms:google-services:4.5.0")   // new
    }
```

### 2.3 `android/app/build.gradle`

Add one line after the existing plugins (lines 1–3):

```groovy
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"
apply plugin: "com.google.gms.google-services"   // new
```

### 2.4 `android/app/src/main/AndroidManifest.xml`

The manifest already has `xmlns:tools`, `POST_NOTIFICATIONS`, `WAKE_LOCK`, `SYSTEM_ALERT_WINDOW` and the Notifee `ForegroundService`. All of them stay. Add two blocks.

**After the `BACKGROUND & STABILITY` permissions block:**

```xml
    <!-- ============================================
         INCOMING CALL RINGING (react-native-callkeep, self-managed mode)
    ============================================= -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_PHONE_CALL" />
    <!-- MANAGE_OWN_CALLS comes from CallKeep's manifest; self-managed mode needs nothing to be asked. -->
```

**Inside `<application>`, after the existing `app.notifee.core.ForegroundService` service:**

```xml
    <!-- ============================================
         INCOMING CALL CONNECTION SERVICE (react-native-callkeep)
    ============================================= -->
    <service
        android:name="io.wazo.callkeep.VoiceConnectionService"
        android:label="PRED Doctor"
        android:permission="android.permission.BIND_TELECOM_CONNECTION_SERVICE"
        android:foregroundServiceType="phoneCall|microphone|camera"
        android:exported="true">
        <intent-filter>
            <action android:name="android.telecom.ConnectionService" />
        </intent-filter>
    </service>
    <!-- ============================================
         PUSH NOTIFICATION DEFAULTS (FCM)
    ============================================= -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_channel_id"
        android:value="default_channel_id"
        tools:replace="android:value" />
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_icon"
        android:resource="@mipmap/ic_launcher" />
```

### 2.5 `android/app/src/main/java/com/predcaredoctor/MainActivity.kt`

All existing code (PiP, `onResume`, `onPause`, `onUserLeaveHint` and the rest) stays. Add two imports and three members, exactly as in the patient app.

**Imports** (beside the existing ones):

```kotlin
import android.content.Intent
import android.os.Bundle
```

**Members** (right after `createReactActivityDelegate()`, before `onResume()`):

```kotlin
  override fun onCreate(savedInstanceState: Bundle?) {
    dropReplayedNotification(intent, savedInstanceState)
    super.onCreate(savedInstanceState)
  }

  // singleTask: a notification tap while the activity exists arrives here. Without setIntent,
  // getIntent() keeps the first launch's notification, and Notifee/Firebase would hand that old
  // notification back as the launch tap after a JS reload.
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
  }

  // Opening from Recents, or Android restoring the activity after it killed the app, starts it with
  // the original launch intent, including the extras of the notification that first opened it
  // (for example an old incoming call's Answer). That isn't a new tap, so the extras are removed
  // and the old call can't join again.
  private fun dropReplayedNotification(intent: Intent?, savedInstanceState: Bundle?) {
    if (intent == null) return
    val fromHistory = intent.flags and Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY != 0
    if (fromHistory || savedInstanceState != null) {
      intent.replaceExtras(Bundle())
    }
  }
```

`MainApplication.kt` doesn't change. `res/raw/ringtone.mp3` is already in the doctor app.

**Check:** `npx react-native run-android` builds.

---

## 5. Step 3: iOS

### 3.1 Files to copy

```bash
cp notifyfiles/GoogleService-Info.plist ios/predcaredoctor/GoogleService-Info.plist
cp ../predcarepatient/ios/predcarepatient/ringtone.caf ios/predcaredoctor/ringtone.caf
cp -R ../predcarepatient/ios/predcarepatient/Images.xcassets/CallKitBlank.imageset \
      ios/predcaredoctor/Images.xcassets/CallKitBlank.imageset
```

In Xcode (`ios/predcaredoctor.xcworkspace`), right-click the `predcaredoctor` group → **Add Files to "predcaredoctor"…**, and tick the **predcaredoctor** target for each of:

- `GoogleService-Info.plist`
- `ringtone.caf`
- `AppDelegate+PushKit.swift` (created in 3.5)

**Check:** Build Phases → Copy Bundle Resources lists `GoogleService-Info.plist` and `ringtone.caf`. `CallKitBlank` shows in `Images.xcassets`. Then delete `notifyfiles/`.

### 3.2 Capabilities (Xcode → target `predcaredoctor` → Signing & Capabilities → All)

1. **+ Capability → Push Notifications.** This creates `ios/predcaredoctor/predcaredoctor.entitlements`:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
   	<key>aps-environment</key>
   	<string>development</string>
   </dict>
   </plist>
   ```

2. **Background Modes:** `audio`, `voip` and `remote-notification` are already ticked. Also tick **Background fetch**. `Info.plist` then has:

   ```xml
   <key>UIBackgroundModes</key>
   <array>
   	<string>audio</string>
   	<string>voip</string>
   	<string>fetch</string>               <!-- new -->
   	<string>remote-notification</string>
   </array>
   ```

### 3.3 `ios/Podfile`

Firebase Apple SDK 13+ is Swift-Package only and needs dynamic frameworks, as in the patient Podfile.

**Add** inside `target 'predcaredoctor' do`, after the `react-native-webrtc` pod line:

```ruby
  pod 'react-native-webrtc', :path => '../node_modules/@videosdk.live/react-native-webrtc'

  use_frameworks! :linkage => :dynamic   # new
```

**Replace only these 4 existing lines** in `post_install`. This is the one replacement in the native folders. With dynamic frameworks, `HEADER_SEARCH_PATHS` becomes an Array, and the current string interpolation would turn it into one broken path, which breaks the InCallManager import. The patient Podfile has the same fix.

```ruby
        # existing (remove):
        config.build_settings['HEADER_SEARCH_PATHS'] ||= '$(inherited) '
        incall_path = '"$(SRCROOT)/../node_modules/@videosdk.live/react-native-incallmanager/ios/RNInCallManager"'
        unless config.build_settings['HEADER_SEARCH_PATHS'].include?(incall_path)
          config.build_settings['HEADER_SEARCH_PATHS'] = "#{config.build_settings['HEADER_SEARCH_PATHS']} #{incall_path}"
        end
```

```ruby
        # new (same InCallManager path, Array-safe), from the patient Podfile:
        # This setting is an Array with dynamic frameworks, so don't interpolate it into a string.
        header_paths = Array(config.build_settings['HEADER_SEARCH_PATHS'] || '$(inherited)')
        incall_path = '"$(SRCROOT)/../node_modules/@videosdk.live/react-native-incallmanager/ios/RNInCallManager"'
        header_paths << incall_path unless header_paths.include?(incall_path)
        config.build_settings['HEADER_SEARCH_PATHS'] = header_paths

        # Dynamic frameworks must link everything they use, but these podspecs don't declare it.
        undeclared_frameworks = {
          'react-native-image-picker' => ['MobileCoreServices'],
          'RNSound' => ['AVFoundation'],
        }[target.name]
        if undeclared_frameworks
          config.build_settings['OTHER_LDFLAGS'] = ['$(inherited)'] + undeclared_frameworks.flat_map { |name| ['-framework', name] }
        end
```

Everything else stays as it is: `setup_permissions`, the `USE_FRAMEWORKS` env block, the 15.1 deployment target loop and the Release-only `dwarf-with-dsym`. The patient's `react-native-razorpay` entry is left out, because the doctor app has no Razorpay.

### 3.4 `ios/predcaredoctor/AppDelegate.swift`

Add three imports and two calls. `SceneDelegate`, `ReactNativeDelegate` and the rest stay as they are.

```swift
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase                 // new
import RNCallKeep               // new
import RNVoipPushNotification   // new

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  // ...unchanged properties

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()   // new

    // new: CallKit for incoming patient calls. Set up natively so a VoIP push can show a call before
    // JS starts; CallKeep's JS setup() isn't called on iOS.
    RNCallKeep.setup([
      "appName": "PRED Doctor",
      "supportsVideo": false,
      "includesCallsInRecents": false,
      "maximumCallGroups": "1",
      "maximumCallsPerCallGroup": "1",
      "ringtoneSound": "ringtone.caf",
      // Transparent icon: without one, CallKit shows the app icon on the call screen.
      "imageName": "CallKitBlank",
    ])
    // new: registers PushKit with this AppDelegate as its delegate (see AppDelegate+PushKit.swift).
    RNVoipPushNotificationManager.voipRegistration()

    let delegate = ReactNativeDelegate()          // existing code from here on, unchanged
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    ...
```

The bridging header (`predcaredoctor-Bridging-Header.h`) doesn't change; the patient app didn't need it either.

### 3.5 `ios/predcaredoctor/AppDelegate+PushKit.swift` (new)

```swift
import PushKit
import RNCallKeep
import RNVoipPushNotification

// VoIP pushes for incoming patient calls. A VoIP push wakes the app even when it's closed, and iOS
// requires every one to be reported to CallKit, or it terminates the app and stops VoIP delivery.
extension AppDelegate: PKPushRegistryDelegate {
  func pushRegistry(
    _ registry: PKPushRegistry,
    didUpdate credentials: PKPushCredentials,
    for type: PKPushType
  ) {
    // Sends the VoIP token to JS (voipToken.ts), which sends it to the backend.
    RNVoipPushNotificationManager.didUpdate(credentials, forType: type.rawValue)
  }

  func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {}

  func pushRegistry(
    _ registry: PKPushRegistry,
    didReceiveIncomingPushWith payload: PKPushPayload,
    for type: PKPushType,
    completion: @escaping () -> Void
  ) {
    let data = payload.dictionaryPayload
    // Same fields as the backend's FCM call push.
    let uuid = (data["uuid"] as? String).flatMap { $0.isEmpty ? nil : $0 } ?? UUID().uuidString
    let callerName = (data["caller_name"] as? String) ?? "Your patient" // doctor: was "Your doctor"
    let isCancel = (data["type"] as? String) == "CALL_CANCELLED"

    RNVoipPushNotificationManager.didReceiveIncomingPush(with: payload, forType: type.rawValue)

    // A cancel is reported as well (same uuid, so CallKit sees the same call), then ended at once.
    RNCallKeep.reportNewIncomingCall(
      uuid,
      handle: "PRED Doctor", // doctor: was "PRED Care"
      handleType: "generic",
      hasVideo: false,
      localizedCallerName: callerName,
      supportsHolding: false,
      supportsDTMF: false,
      supportsGrouping: false,
      supportsUngrouping: false,
      fromPushKit: true,
      payload: data as? [String: Any],
      withCompletionHandler: {
        if isCancel {
          RNCallKeep.endCall(withUUID: uuid, reason: 2) // REMOTE_ENDED
        }
        completion()
      }
    )
  }
}
```

### 3.6 Install and build

```bash
cd ios && pod install && cd ..
npx react-native run-ios --device
```

**Check:**

- [ ] `pod install` prints `RNFBApp: Using SPM for Firebase dependency resolution`
- [ ] Debug and Release both build
- [ ] **An existing video call still works: camera, mic, PiP (`pipmode`), InCallManager.** This is the first build of the doctor app with dynamic frameworks.

---

## 6. Step 4: shared doctor files (small additions)

### 4.1 `src/lib/commons/asyncStorage.ts` (M+)

```ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@auth_storage',
  FCM_TOKEN: '@fcm_token',
  DEVICE_ID: '@device_id', // new
  // iOS PushKit token. Kept on logout: PushKit only sends it at app launch.
  VOIP_TOKEN: '@voip_token', // new
} as const;
```

### 4.2 `src/zustand/stores/useAuthStore.ts` (M, one line)

In `logout`, keep the device keys, as the patient app does:

```ts
await clearStorageExcept([STORAGE_KEYS.FCM_TOKEN, STORAGE_KEYS.DEVICE_ID, STORAGE_KEYS.VOIP_TOKEN]);
```

### 4.3 `src/lib/commons/navigation.utils.ts` (M+)

`pendingRoute` already exists; add the setter (patient app, same name), above `consumeTargetRoute`:

```ts
export function setTargetRoute(route: { name: string; params?: any }): void {
  pendingRoute = route;
}
```

### 4.4 `src/lib/commons/file.utils.ts` (M+)

`downloadNotification.handler.ts` needs `openOrShareFile`. The doctor file already has `getFileViewer`. Add `Share` to the existing `react-native` import:

```ts
import { NativeModules, PermissionsAndroid, Platform, Share } from 'react-native';
```

Then add this function (copied from the patient file) below `sanitizeFilename`:

```ts
/**
 * Safely opens a file in the system default viewer with an automatic fallback
 * to the native React Native Share sheet (supporting "Save to Files" on iOS).
 */
export const openOrShareFile = async (
  filePath: string,
  title: string = 'Document'
): Promise<boolean> => {
  const FileViewer = getFileViewer();
  if (FileViewer && typeof FileViewer.open === 'function') {
    try {
      await FileViewer.open(filePath, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      });
      return true;
    } catch (viewerErr) {
      console.log('[file.utils] FileViewer failed, attempting Share fallback:', viewerErr);
    }
  }

  try {
    const shareUrl = Platform.OS === 'ios' ? filePath : `file://${filePath}`;
    await Share.share({
      title,
      url: shareUrl,
      message: Platform.OS === 'android' ? title : undefined,
    });
    return true;
  } catch (shareErr) {
    console.log('[file.utils] Share fallback error:', shareErr);
    return false;
  }
};
```

The existing `saveOrOpenFile` / `handleInvoicePdfAction` don't change. The patient app also shows a "Download complete" notification from `saveOrOpenFile`; hooking the doctor's invoice and prescription downloads to it is a separate change, not part of this plan.

### 4.5 `src/services/api/endpoints.ts` (M+)

```ts
  notifications: {
    getAll: '/notifications',
    delete: '/notifications/',
    counts: `/notifications/count`,
    clearNotify: `/notifications/clear-all`,
    registerToken: '/notifications/register-token', // new
  },
```

### 4.6 `src/route/index.ts` (M+)

`AppointmentDetailsScreen` already reads `route.params?.isComingFromNotification`. Add it to the type:

```ts
  AppointmentDetails: { appointmentId?: string; isComingFromNotification?: boolean } | undefined;
```

### 4.7 `src/hooks/commons/useDeviceInfo.ts` (A)

```ts
import { Platform } from 'react-native';
import { APP_VERSION } from '../../config/constants';
import { getItem, setItem, STORAGE_KEYS } from '../../lib/commons/asyncStorage'; // doctor: lib/commons
import { getSavedPushToken } from '../../services/notifications/push/pushToken';

export type TDeviceInfo = {
  device_id: string;
  device_name: string;
  platform: string;
  fcm_token: string;
  os_version: string;
  app_version: string;
};

// React Native has no device ID, so generate one and keep it. It stays through
// logout, and a reinstall creates a new one. It identifies the install; it isn't a secret.
const getDeviceId = async (): Promise<string> => {
  const savedId = await getItem(STORAGE_KEYS.DEVICE_ID);
  if (savedId) return savedId;

  const newId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
  await setItem(STORAGE_KEYS.DEVICE_ID, newId);
  return newId;
};

export const getDeviceInfo = async (): Promise<TDeviceInfo> => {
  const [deviceId, fcmToken] = await Promise.all([getDeviceId(), getSavedPushToken()]);

  if (Platform.OS === 'android') {
    const { Brand, Model, Release } = Platform.constants;
    return {
      device_id: deviceId,
      device_name: `${Brand} ${Model}`,
      platform: Platform.OS,
      fcm_token: fcmToken,
      os_version: Release,
      app_version: APP_VERSION,
    };
  }

  return {
    device_id: deviceId,
    // iOS only exposes the device type here, not the exact model.
    device_name: Platform.OS === 'ios' && Platform.isPad ? 'iPad' : 'iPhone',
    platform: Platform.OS,
    fcm_token: fcmToken,
    os_version: String(Platform.Version),
    app_version: APP_VERSION,
  };
};

// Call getDeviceInfo() when submitting, so the payload has the latest FCM token.
export const useDeviceInfo = () => ({ getDeviceInfo });
```

---

## 7. Step 5: `src/services/notifications/` (new folder, all files)

### 5.1 `index.ts`

```ts
export * from './notification.types';
export * from './notification.core';
export * from './notificationDispatcher';
export * from './handlers/downloadNotification.handler';
export * from './push/pushSetup';
export * from './push/pushToken';
export { default as NotificationEventListener } from './components/NotificationEventListener';
```

### 5.2 `notification.core.ts`

```ts
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
} from '@notifee/react-native';
import { Platform } from 'react-native';

export const NOTIFICATION_CHANNELS = {
  // The id must match default_notification_channel_id in AndroidManifest.xml.
  DEFAULT: {
    id: 'default_channel_id',
    name: 'General',
    description: 'General updates from PRED Doctor', // doctor
    importance: AndroidImportance.HIGH,
  },
  DOWNLOADS: {
    id: 'pdf_downloads',
    name: 'Document Downloads',
    description: 'Notifications for downloaded prescriptions, invoices, and reports', // doctor
    importance: AndroidImportance.DEFAULT,
  },
  APPOINTMENTS: {
    id: 'appointments',
    name: 'Appointments',
    description: 'Updates for appointments and patients waiting in consultation', // doctor
    importance: AndroidImportance.HIGH,
  },
  MEETING_ONGOING: {
    id: 'meeting-ongoing',
    name: 'Ongoing Consultation',
    description: 'Shown while a video consultation is in progress',
    importance: AndroidImportance.LOW,
  },
} as const;

export const createMeetingOngoingChannel = async (): Promise<string> => {
  return notifee.createChannel({
    id: NOTIFICATION_CHANNELS.MEETING_ONGOING.id,
    name: NOTIFICATION_CHANNELS.MEETING_ONGOING.name,
    description: NOTIFICATION_CHANNELS.MEETING_ONGOING.description,
    importance: NOTIFICATION_CHANNELS.MEETING_ONGOING.importance,
    visibility: AndroidVisibility.PUBLIC,
    vibration: false,
  });
};

/**
 * Initializes required Android notification channels. Safe to call idempotently.
 */
export const initNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  try {
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.DEFAULT.id,
      name: NOTIFICATION_CHANNELS.DEFAULT.name,
      description: NOTIFICATION_CHANNELS.DEFAULT.description,
      importance: NOTIFICATION_CHANNELS.DEFAULT.importance,
      visibility: AndroidVisibility.PUBLIC,
    });
    await notifee.createChannel({
      id: NOTIFICATION_CHANNELS.DOWNLOADS.id,
      name: NOTIFICATION_CHANNELS.DOWNLOADS.name,
      description: NOTIFICATION_CHANNELS.DOWNLOADS.description,
      importance: NOTIFICATION_CHANNELS.DOWNLOADS.importance,
      visibility: AndroidVisibility.PUBLIC,
      vibration: false,
    });
    await createMeetingOngoingChannel();
  } catch (err) {
    console.warn('[NotificationCore] Failed to create notification channels:', err);
  }
};

/**
 * Requests notification permissions for Android 13+ (POST_NOTIFICATIONS) and iOS.
 * Returns true if granted/provisional, false if denied.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch (err) {
    console.warn('[NotificationCore] Permission request failed:', err);
    return false;
  }
};

/**
 * Checks current notification permission status without prompting.
 */
export const getNotificationPermissionStatus = async (): Promise<boolean> => {
  try {
    const settings = await notifee.getNotificationSettings();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch (err) {
    console.warn('[NotificationCore] Failed to get permission settings:', err);
    return false;
  }
};
```

The doctor's `useAndroidCallForegroundService.ts` already creates the `meeting-ongoing` channel. `MEETING_ONGOING` uses the same id, so both share one channel and the hook doesn't change.

### 5.3 `notification.types.ts`

The backend uses the same `event_action` values for both apps, so this is verbatim.

```ts
export enum NotificationCategory {
  PDF_DOWNLOAD = 'PDF_DOWNLOAD',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  CONSULTATION_ALERT = 'CONSULTATION_ALERT',
  LAB_REPORT = 'LAB_REPORT',
  MEETING_ONGOING = 'MEETING_ONGOING',
}

// The event_action values the backend sends in a push's data.
export const NotificationEventActions = {
  INCOMING_VIDEO_CALL: 'incoming_video_call',
  PATIENT_JOINED_CALL: 'patient_joined_call',
  DOCTOR_JOINED_CALL: 'doctor_joined_call',
  CALL_ENDED: 'call_ended',
  PRESCRIPTION_CREATED: 'prescription_created',
  PRESCRIPTION_UPDATED: 'prescription_updated',
  EMR_DOCUMENT_SHARED: 'emr_document_shared',
  EMR_DOCUMENT_UPLOADED: 'emr_document_uploaded',
  DOCTOR_AVAILABILITY_CREATED: 'doctor_availability_created',
  DOCTOR_AVAILABILITY_UPDATED: 'doctor_availability_updated',
  DOCTOR_AVAILABILITY_STATUS_CHANGED: 'doctor_availability_status_changed',
  DOCTOR_AVAILABILITY_DELETED: 'doctor_availability_deleted',
  APPOINTMENT_BOOKED: 'appointment_booked',
  APPOINTMENT_CONFIRMED: 'appointment_confirmed',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  APPOINTMENT_RESCHEDULED: 'appointment_rescheduled',
  APPOINTMENT_COMPLETED: 'appointment_completed',
  APPOINTMENT_REMINDER: 'appointment_reminder',
} as const;

// Firebase and Notifee both type a message's data loosely, so fields are read defensively.
export type PushNotificationData = { [key: string]: unknown };

export interface PdfDownloadNotificationData {
  type: NotificationCategory.PDF_DOWNLOAD;
  filePath: string;
  fileName: string;
  mimeType?: string;
  title?: string;
}

export interface AppointmentNotificationData {
  type: NotificationCategory.APPOINTMENT_REMINDER;
  appointmentId: string | number;
  patientName?: string; // doctor: was doctorName
}

export type AppNotificationData =
  | PdfDownloadNotificationData
  | AppointmentNotificationData
  | { type: string; [key: string]: any };
```

### 5.4 `notificationDispatcher.ts` (verbatim)

```ts
import notifee, { Event, EventType } from '@notifee/react-native';
import { getInitialNotification, getMessaging } from '@react-native-firebase/messaging';
import { CALL_ACTION_ANSWER, CALL_ACTION_DECLINE } from '../calls/androidRing';
import { callFromPush } from '../calls/callPayload';
import { answerCall, declineCall } from '../calls/callService';
import { handleDownloadNotificationPress } from './handlers/downloadNotification.handler';
import { handleMeetingNotificationPress } from './handlers/meetingNotification.handler';
import { handlePushNotificationPress } from './handlers/pushNotification.handler';
import { NotificationCategory, PdfDownloadNotificationData } from './notification.types';

/**
 * Central router for notification press interactions.
 * New notification types can be mapped here without touching callers or App.tsx.
 */
export const routeNotificationPress = async (event: Event): Promise<void> => {
  const { type, detail } = event;

  // Incoming call ring: Answer and Decline buttons (ACTION_PRESS) and a tap on the notification.
  const incomingCall = callFromPush(detail.notification?.data);
  if (incomingCall) {
    const actionId = detail.pressAction?.id;
    if (actionId === CALL_ACTION_DECLINE) {
      await declineCall(incomingCall.callId, incomingCall);
    } else if (actionId === CALL_ACTION_ANSWER || type === EventType.PRESS) {
      await answerCall(incomingCall.callId, incomingCall);
    }
    return;
  }

  if (type !== EventType.PRESS || !detail.notification?.data) {
    return;
  }

  const data = detail.notification.data;

  // Backend pushes carry event_action; the types below are for notifications the app creates.
  if (data.event_action) {
    handlePushNotificationPress(data);
    return;
  }

  switch (data.type) {
    case NotificationCategory.PDF_DOWNLOAD:
      await handleDownloadNotificationPress(data as unknown as PdfDownloadNotificationData);
      break;

    case NotificationCategory.APPOINTMENT_REMINDER:
      // Future handler registration
      break;

    case NotificationCategory.CONSULTATION_ALERT:
      // Future handler registration
      break;

    case NotificationCategory.MEETING_ONGOING:
      handleMeetingNotificationPress();
      break;

    // Anything else is a backend push shown by displayPush while the app was open.
    default:
      handlePushNotificationPress(data);
      break;
  }
};

let initialNotificationCheck: Promise<void> | null = null;

/**
 * Handles the notification tap that opened the app, if any. It runs once and never rejects,
 * so SplashScreen can safely wait for it before choosing the first screen.
 */
export const processInitialNotification = (): Promise<void> => {
  initialNotificationCheck ??= (async () => {
    // Notifee sees banners shown by displayPush; Firebase sees those shown by the phone.
    const [notifeeInitial, firebaseInitial] = await Promise.all([
      notifee.getInitialNotification().catch(err => {
        console.warn('[NotificationDispatcher] Notifee initial notification error:', err);
        return null;
      }),
      getInitialNotification(getMessaging()).catch(err => {
        console.warn('[NotificationDispatcher] Firebase initial notification error:', err);
        return null;
      }),
    ]);

    try {
      if (notifeeInitial?.notification?.data) {
        await routeNotificationPress({
          type: EventType.PRESS,
          detail: {
            notification: notifeeInitial.notification,
            pressAction: notifeeInitial.pressAction,
          },
        });
      } else if (firebaseInitial) {
        handlePushNotificationPress(firebaseInitial.data);
      }
    } catch (err) {
      console.warn('[NotificationDispatcher] Initial notification press failed:', err);
    }
  })();

  return initialNotificationCheck;
};

/**
 * Registers background notification event listener.
 * Safe to invoke once at the application entry point (index.js).
 */
export const registerBackgroundNotificationHandler = (): void => {
  notifee.onBackgroundEvent(async event => {
    await routeNotificationPress(event);
  });
};
```

### 5.5 `components/NotificationEventListener.tsx` (verbatim)

```tsx
import notifee from '@notifee/react-native';
import React, { useEffect } from 'react';
import { initNotificationChannels } from '../notification.core';
import { processInitialNotification, routeNotificationPress } from '../notificationDispatcher';

/**
 * Headless listener component that manages notification lifecycles:
 * 1. Initializes Android notification channels on app startup.
 * 2. Handles foreground notification interactions (tap to open).
 * 3. Handles cold-start initial notification if app was opened via notification tap.
 */
export const NotificationEventListener: React.FC = () => {
  useEffect(() => {
    // 1. Initialize notification channels
    initNotificationChannels();

    // 2. Handle cold start if app opened via notification tap
    processInitialNotification();

    // 3. Subscribe to foreground notification events
    const unsubscribe = notifee.onForegroundEvent(event => {
      routeNotificationPress(event);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default NotificationEventListener;
```

### 5.6 `handlers/downloadNotification.handler.ts`

This is verbatim except the import path (`lib/commons`). It needs `openOrShareFile` from step 4.4.

```ts
import notifee from '@notifee/react-native';
import { openOrShareFile } from '../../../lib/commons/file.utils'; // doctor: lib/commons
import {
  initNotificationChannels,
  NOTIFICATION_CHANNELS,
  requestNotificationPermission,
} from '../notification.core';
import { NotificationCategory, PdfDownloadNotificationData } from '../notification.types';

export interface ShowDownloadNotificationParams {
  filePath: string;
  fileName: string;
  title?: string;
  message?: string;
}

/**
 * Dispatches a completed download notification to the Android / iOS notification tray.
 */
export const showDownloadCompleteNotification = async ({
  filePath,
  fileName,
  title = 'Download Complete',
  message,
}: ShowDownloadNotificationParams): Promise<string | null> => {
  try {
    await initNotificationChannels();

    const granted = await requestNotificationPermission();
    if (!granted) {
      console.log('[DownloadNotification] Notification permission not granted, skipping tray notification.');
      return null;
    }

    const payload: PdfDownloadNotificationData = {
      type: NotificationCategory.PDF_DOWNLOAD,
      filePath,
      fileName,
      mimeType: 'application/pdf',
      title,
    };

    const notificationId = await notifee.displayNotification({
      title,
      body: message || `${fileName} is ready. Tap to view.`,
      data: payload as unknown as { [key: string]: string | number | object },
      android: {
        channelId: NOTIFICATION_CHANNELS.DOWNLOADS.id,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
        autoCancel: true,
      },
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          banner: true,
          badge: true,
          sound: true,
        },
      },
    });

    return notificationId;
  } catch (err) {
    console.warn('[DownloadNotification] Failed to display notification:', err);
    return null;
  }
};

/**
 * Handles user tap on a PDF download notification.
 * Opens the file in the default viewer with fallback to system share sheet.
 */
export const handleDownloadNotificationPress = async (
  data: PdfDownloadNotificationData
): Promise<void> => {
  if (!data?.filePath) return;
  try {
    await openOrShareFile(data.filePath, data.fileName || 'Document');
  } catch (err) {
    console.warn('[DownloadNotification] Failed to open document from notification tap:', err);
  }
};
```

### 5.7 `handlers/meetingNotification.handler.ts`

```ts
import { navigationRef } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import useMeetingStore from '../../../zustand/stores/useMeetingStore';

export const handleMeetingNotificationPress = (): void => {
  const meetingState = useMeetingStore.getState();
  if (!meetingState.callInfo?.meetingId) return;

  if (meetingState.pipMode !== 'NATIVE_PIP') {
    meetingState.setPipMode('NORMAL');
  }

  // doctor: DOCTOR_MEETING (patient: MEETING)
  if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name !== AppRoute.DOCTOR_MEETING) {
    navigationRef.navigate(AppRoute.DOCTOR_MEETING as never);
  }
};
```

The doctor's `MeetingPipMode` is `'NORMAL' | 'IN_APP_PIP' | 'NATIVE_PIP'`, the same as the patient app, so this file is the same apart from the route.

### 5.8 `handlers/pushNotification.handler.ts`

The structure matches the patient file. Only the route table is the doctor's.

```ts
import { ensureClinicAccess } from '../../../lib/commons/auth.Utils';
import { setTargetRoute } from '../../../lib/commons/navigation.utils';
import { resolveNotificationModalNavigation } from '../../../lib/commons/notificationModal.utils';
import { navigate, navigationRef, resetRoot } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { callFromPush } from '../../calls/callPayload';
import { answerCall } from '../../calls/callService';
import { NotificationEventActions, PushNotificationData } from '../notification.types';

// doctor: pushes that belong to one appointment open AppointmentDetails.
const APPOINTMENT_ACTIONS: string[] = [
  NotificationEventActions.PATIENT_JOINED_CALL, // "Patient is waiting for Consultation"
  NotificationEventActions.CALL_ENDED,
  NotificationEventActions.APPOINTMENT_BOOKED,
  NotificationEventActions.APPOINTMENT_CONFIRMED,
  NotificationEventActions.APPOINTMENT_CANCELLED,
  NotificationEventActions.APPOINTMENT_RESCHEDULED,
  NotificationEventActions.APPOINTMENT_COMPLETED,
  NotificationEventActions.APPOINTMENT_REMINDER,
];

// Screens a tap must not navigate away from: the setup steps the doctor still has to finish, and a live call.
const PROTECTED_ROUTES: string[] = [
  AppRoute.EMAIL_VERIFY,
  AppRoute.POLICY_ACCEPTANCE,
  AppRoute.DOCTOR_MEETING, // doctor: was MEETING
];

const resolvePushRoute = (data: PushNotificationData = {}): { name: string; params?: object } => {
  const action = String(data.event_action ?? '');

  if (APPOINTMENT_ACTIONS.includes(action)) {
    // data.id is the numeric appointment ID; data.appointment_id is a display code the API can't load.
    return data.id
      ? {
          name: AppRoute.APPOINTMENT_DETAILS,
          params: { appointmentId: String(data.id), isComingFromNotification: true },
        }
      : { name: AppRoute.APPOINTMENTS };
  }

  // doctor: everything else (EMR, patients, …) uses the same routing as the in-app notification list.
  return resolveNotificationModalNavigation(data);
};

export const handlePushNotificationPress = (data?: PushNotificationData): void => {
  // A tap on the incoming call notification (the iOS system alert) answers the call.
  const incomingCall = callFromPush(data);
  if (incomingCall) {
    answerCall(incomingCall.callId, incomingCall);
    return;
  }

  const route = resolvePushRoute(data);
  const currentRoute = navigationRef.isReady() ? navigationRef.getCurrentRoute()?.name : undefined;

  // Still starting up: SplashScreen opens this route once it knows the doctor can see it.
  if (!currentRoute || currentRoute === AppRoute.SPLASH) {
    setTargetRoute(route);
    return;
  }

  if (!useAuthStore.getState().isLoggedIn || PROTECTED_ROUTES.includes(currentRoute)) return;
  // doctor: same gate as NotificationScreen.handleNotificationPress.
  if (!ensureClinicAccess()) return;

  if (route.name === AppRoute.HOME) {
    // navigate() could stack a second Home on top of the existing one.
    resetRoot(AppRoute.HOME);
  } else {
    navigate(route.name as never, route.params as never);
  }
};
```

### 5.9 `push/pushDisplay.ts` (verbatim)

```ts
import notifee from '@notifee/react-native';
import type { RemoteMessage } from '@react-native-firebase/messaging';
import { NOTIFICATION_CHANNELS } from '../notification.core';

// Only used while the app is open; the system shows pushes in the background and closed states.
export const displayPush = async (message: RemoteMessage) => {
  // Data-only messages have nothing to show and would otherwise appear as a blank notification.
  if (!message.notification) return;

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    // Needed so tapping the banner can open the right screen.
    data: message.data,
    android: {
      channelId: NOTIFICATION_CHANNELS.DEFAULT.id,
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default' },
      autoCancel: true,
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: { banner: true, badge: true, sound: true },
    },
  });
};
```

### 5.10 `push/pushSetup.ts` (verbatim)

```ts
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import type { PushData } from '../../calls/call.types';
import { callFromPush, cancelFromPush } from '../../calls/callPayload';
import { cancelCall, ringIncomingCall } from '../../calls/callService';
import { syncPushToken } from '../../calls/deviceSync';
import { handlePushNotificationPress } from '../handlers/pushNotification.handler';
import { displayPush } from './pushDisplay';
import { ensurePushToken, listenForTokenRefresh } from './pushToken';

// Call ring and cancel pushes. Returns true when the message was a call message.
export const handleCallMessage = async (data?: PushData): Promise<boolean> => {
  const call = callFromPush(data);
  if (call) {
    await ringIncomingCall(call);
    return true;
  }
  const cancel = cancelFromPush(data);
  if (cancel) {
    await cancelCall(cancel);
    return true;
  }
  return false;
};

// Runs outside React, so it's registered from index.js.
export const registerBackgroundPushHandler = () => {
  setBackgroundMessageHandler(getMessaging(), async message => {
    if (__DEV__) console.log('[Push] Background message:', JSON.stringify(message, null, 2));
    await handleCallMessage(message.data).catch(err =>
      console.warn('[Push] Background call message failed:', err),
    );
  });
};

// Returns a function that stops the message, tap and token listeners.
export const setupPush = async () => {
  // A token failure (e.g. on the iOS Simulator) shouldn't stop the listeners below.
  await ensurePushToken().catch(err => console.warn('[Push] Token setup failed:', err));
  // Keeps the backend's copy current; does nothing until the doctor is logged in.
  syncPushToken();

  const stopMessages = onMessage(getMessaging(), async message => {
    if (__DEV__) console.log('[Push] Foreground message:', JSON.stringify(message, null, 2));
    // A call shows the call UI instead of a notification banner.
    const isCallMessage = await handleCallMessage(message.data).catch(err => {
      console.warn('[Push] Foreground call message failed:', err);
      return false;
    });
    if (isCallMessage) return;
    return displayPush(message);
  });
  // A tap on a notification the phone showed while the app was in the background.
  const stopOpened = onNotificationOpenedApp(getMessaging(), message =>
    handlePushNotificationPress(message.data),
  );
  const stopTokenRefresh = listenForTokenRefresh();
  // Sends a refreshed token to the backend, so calls keep ringing on this phone.
  const stopTokenSync = onTokenRefresh(getMessaging(), token => syncPushToken(token));

  return () => {
    stopMessages();
    stopOpened();
    stopTokenRefresh();
    stopTokenSync();
  };
};
```

### 5.11 `push/pushToken.ts`

```ts
import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import { getItem, setItem, STORAGE_KEYS } from '../../../lib/commons/asyncStorage'; // doctor: lib/commons
import { requestNotificationPermission } from '../notification.core';

// Returns the saved token, or '' so login still works without one.
export const getSavedPushToken = async (): Promise<string> => {
  return (await getItem(STORAGE_KEYS.FCM_TOKEN)) ?? '';
};

// Asks for permission and fetches a token only when none is saved yet.
// If permission is denied, nothing is saved and this tries again on the next app open.
export const ensurePushToken = async (): Promise<void> => {
  let token = await getSavedPushToken();

  if (!token) {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    token = await getToken(getMessaging());
    await setItem(STORAGE_KEYS.FCM_TOKEN, token);
  }

  if (__DEV__) console.log('FCM token:', token);
};

// Returns the listener's unsubscribe function.
export const listenForTokenRefresh = () => {
  return onTokenRefresh(getMessaging(), token => setItem(STORAGE_KEYS.FCM_TOKEN, token));
};
```

---

## 8. Step 6: `src/services/calls/` (new folder, all files)

### 6.1 `call.types.ts`

```ts
// One incoming patient call, read from the backend's INCOMING_CALL push.
export type IncomingCall = {
  callId: string; // backend uuid, lower case
  appointmentId: string;
  meetingId: string;
  callerName: string;
  callerImage: string;
  expiresAtMs: number;
};

// From the CALL_CANCELLED push. The backend can send an empty uuid when the caller leaves the room,
// so a cancel can match on the appointment instead.
export type CallCancel = { callId?: string; appointmentId?: string };

export type PushData = Record<string, unknown> | undefined;
```

### 6.2 `callPayload.ts`

```ts
import type { CallCancel, IncomingCall, PushData } from './call.types';

export const INCOMING_CALL_TYPE = 'INCOMING_CALL';
export const CALL_CANCELLED_TYPE = 'CALL_CANCELLED';
const DEFAULT_TIMEOUT_S = 30;
// doctor: the doctor app is rung by patients (the patient app checks for 'doctor').
const CALLER_ROLE = 'patient';

// Reads the backend push data (all values are strings). Also reads back the data saved on the
// Android ring notification, which uses the same field names.
export const callFromPush = (data: PushData): IncomingCall | null => {
  if (data?.type !== INCOMING_CALL_TYPE || !data.uuid || !data.appointment_id) return null;
  // The doctor app only takes calls from patients.
  if (data.caller_role && data.caller_role !== CALLER_ROLE) return null;

  const startedAt = Number(data.timestamp) || Date.now();
  const timeoutMs = (Number(data.timeout_seconds) || DEFAULT_TIMEOUT_S) * 1000;
  return {
    callId: String(data.uuid).toLowerCase(),
    appointmentId: String(data.appointment_id),
    meetingId: String(data.meeting_id ?? ''),
    callerName: String(data.caller_name || 'Your patient'),
    callerImage: String(data.caller_image ?? ''),
    expiresAtMs: startedAt + timeoutMs,
  };
};

export const cancelFromPush = (data: PushData): CallCancel | null => {
  if (data?.type !== CALL_CANCELLED_TYPE) return null;
  return {
    callId: String(data.uuid || '').toLowerCase() || undefined,
    appointmentId: String(data.appointment_id || '') || undefined,
  };
};

// Notifee data values must be strings. The push's `token` is left out on purpose: join always
// fetches a fresh one.
export const callToData = (call: IncomingCall): Record<string, string> => ({
  type: INCOMING_CALL_TYPE,
  uuid: call.callId,
  appointment_id: call.appointmentId,
  meeting_id: call.meetingId,
  caller_name: call.callerName,
  caller_role: CALLER_ROLE,
  caller_image: call.callerImage,
  timestamp: String(call.expiresAtMs - DEFAULT_TIMEOUT_S * 1000),
  timeout_seconds: String(DEFAULT_TIMEOUT_S),
});
```

### 6.3 `callKeepSetup.ts`

```ts
import { NativeModules, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';

// iOS: CallKit draws the incoming call screen. Android: self-managed mode (CallKeep's Android
// self-managed guide). PRED Doctor shows its own call notification (androidRing.ts), so the doctor's
// Answer tap opens the app; no phone permission or calling-account setup is needed.
const CALLKEEP_OPTIONS = {
  ios: {
    appName: 'PRED Doctor', // doctor
    supportsVideo: false,
    includesCallsInRecents: false,
    maximumCallGroups: '1',
    maximumCallsPerCallGroup: '1',
    ringtoneSound: 'ringtone.caf',
    imageName: 'CallKitBlank',
  },
  android: {
    // Required by CallKeep's types; not shown in self-managed mode.
    alertTitle: 'PRED Doctor calls', // doctor
    alertDescription: "Your patients' video calls ring in PRED Doctor.", // doctor
    cancelButton: 'Cancel',
    okButton: 'OK',
    additionalPermissions: [],
    selfManaged: true,
    // The call must keep ringing if the background JS instance stops.
    endCallsWhenReactNativeStops: false,
  },
};

let nativeSetupDone = false;

/**
 * Registers the calling account without any prompt. Safe in the FCM background handler, where
 * there's no screen for a prompt. iOS is set up natively in AppDelegate.
 */
export const ensureCallKeep = async (): Promise<void> => {
  if (Platform.OS !== 'android' || nativeSetupDone) return;
  try {
    // The native part of RNCallKeep.setup(), without the JS permission alert.
    NativeModules.RNCallKeep?.setup(CALLKEEP_OPTIONS.android);
    nativeSetupDone = true;
  } catch (err) {
    console.warn('[CallKeep] Native setup failed:', err);
  }
};

/**
 * Asks for the phone permission and opens the calling-account settings if the account is off.
 * Needs a screen, so call it only while the app is open. Android only.
 */
export const setupCallKeepWithPrompt = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  try {
    await RNCallKeep.setup(CALLKEEP_OPTIONS);
    nativeSetupDone = true;
  } catch {
    // The doctor tapped "Not now"; calls fall back to the Notifee ring.
  }
};

// iOS always has CallKit. Android needs the calling account to be on.
export const canShowSystemCall = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') return true;
  try {
    return Boolean(await RNCallKeep.hasPhoneAccount());
  } catch {
    return false;
  }
};
```

### 6.4 `callPermissionPrompt.ts`

This is kept for the same folder as the patient app. Like the patient app, **it isn't called anywhere**, because self-managed mode never needs the calling account.

```ts
import { Alert, Platform } from 'react-native';
import { getItem, setItem } from '../../lib/commons/asyncStorage'; // doctor: lib/commons
import { canShowSystemCall, setupCallKeepWithPrompt } from './callKeepSetup';

const LAST_PROMPT_KEY = '@call_account_prompted_at';
// Asks again at most every 3 days while the calling account is still off.
const PROMPT_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Android: explains why PRED Doctor needs to manage calls, then runs CallKeep's setup, which asks
 * for the phone permission and opens the calling-account settings. Does nothing once the account
 * is on, and nothing on iOS.
 */
export const promptCallAccountIfNeeded = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  if (await canShowSystemCall()) return;

  const lastPrompt = Number(await getItem(LAST_PROMPT_KEY)) || 0;
  if (Date.now() - lastPrompt < PROMPT_INTERVAL_MS) return;
  await setItem(LAST_PROMPT_KEY, String(Date.now()));

  Alert.alert(
    'Get patient calls like a phone call',
    "Your patients' video calls can ring on the full call screen, even when PRED Doctor is closed. Allow PRED Doctor to manage calls on the next screens.",
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'Continue', onPress: () => setupCallKeepWithPrompt() },
    ],
    { cancelable: true },
  );
};
```

### 6.5 `androidRing.ts`

```ts
import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { NotificationEventActions } from '../notifications/notification.types';
import { NOTIFICATION_CHANNELS } from '../notifications/notification.core';
import type { IncomingCall } from './call.types';
import { callToData } from './callPayload';

export const CALL_ACTION_ANSWER = 'call_answer';
export const CALL_ACTION_DECLINE = 'call_decline';

const RING_CHANNEL = {
  id: 'incoming_call',
  name: 'Incoming patient calls', // doctor
  description: 'Rings when a patient joins a video consultation', // doctor
};

// Android won't change a channel's sound or importance after it's created.
const createRingChannel = () =>
  notifee.createChannel({
    id: RING_CHANNEL.id,
    name: RING_CHANNEL.name,
    description: RING_CHANNEL.description,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'ringtone', // res/raw/ringtone.mp3
    vibration: true,
    vibrationPattern: [300, 1000, 500, 1000],
  });

export const showAndroidRing = async (call: IncomingCall): Promise<void> => {
  // Created here too: in the background, NotificationEventListener hasn't mounted.
  await createRingChannel();

  await notifee.displayNotification({
    id: call.callId,
    title: call.callerName,
    body: 'PRED Doctor · Incoming video consultation', // doctor
    data: callToData(call),
    android: {
      channelId: RING_CHANNEL.id,
      smallIcon: 'ic_launcher',
      category: AndroidCategory.CALL,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      ongoing: true,
      autoCancel: false,
      loopSound: true,
      // Stops the ring if the cancel push never arrives.
      timeoutAfter: Math.max(call.expiresAtMs - Date.now(), 5000),
      pressAction: { id: 'default', launchActivity: 'default' },
      // Notifee renders HTML in action titles: red Decline, green Answer.
      actions: [
        {
          title: '<font color="#E53935"><b>Decline</b></font>',
          pressAction: { id: CALL_ACTION_DECLINE },
        },
        {
          title: '<font color="#2E7D32"><b>Answer</b></font>',
          pressAction: { id: CALL_ACTION_ANSWER, launchActivity: 'default' },
        },
      ],
    },
  });
};

export const stopAndroidRing = (callId: string): Promise<void> =>
  notifee.cancelNotification(callId).catch(() => {});

// A visible result also keeps FCM from lowering the priority of the high-priority cancel push.
export const showMissedCall = async (call: IncomingCall): Promise<void> => {
  const channel = NOTIFICATION_CHANNELS.APPOINTMENTS;
  await notifee.createChannel({
    id: channel.id,
    name: channel.name,
    description: channel.description,
    importance: channel.importance,
    visibility: AndroidVisibility.PUBLIC,
  });

  await notifee.displayNotification({
    id: `missed-${call.callId}`,
    title: 'Missed call',
    body: `${call.callerName} was waiting for the consultation. Open the appointment to join.`, // doctor
    // Opens the appointment through the push tap routing (APPOINTMENT_ACTIONS → AppointmentDetails).
    data: {
      event_action: NotificationEventActions.APPOINTMENT_REMINDER,
      id: call.appointmentId,
    },
    android: {
      channelId: channel.id,
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default', launchActivity: 'default' },
      autoCancel: true,
    },
  });
};
```

### 6.6 `handledCalls.ts`

This is verbatim except the import path.

```ts
import { getObject, setObject } from '../../lib/commons/asyncStorage'; // doctor: lib/commons

// Calls this phone has already dealt with, kept across app restarts. Android hands the old ring
// notification back as the "launch" notification after a JS reload or a relaunch, and iOS can
// return an old call alert. Without this list such a call looks new and would join again.
//
// 'answered': the doctor pressed Answer and the app is about to join (Android stops the ring
// first, so the join may run in a newer JS instance).
// 'done': joined, declined, cancelled, expired or timed out. Never acted on again.
export type HandledState = 'answered' | 'done';
type HandledRecord = { state: HandledState; at: number };

const STORAGE_KEY = '@handled_calls';
// Long enough to cover any replay of an old notification; call uuids are unique per call.
const KEEP_MS = 12 * 60 * 60 * 1000;
const MAX_RECORDS = 50;

let records: Record<string, HandledRecord> = {};
let loading: Promise<void> | null = null;

const prune = (all: Record<string, HandledRecord>) => {
  const now = Date.now();
  return Object.fromEntries(
    Object.entries(all)
      .filter(([, record]) => now - record.at < KEEP_MS)
      .sort(([, a], [, b]) => b.at - a.at)
      .slice(0, MAX_RECORDS),
  );
};

/** Reads the saved list once per JS instance. Safe to await many times; never rejects. */
export const loadHandledCalls = (): Promise<void> => {
  loading ??= getObject<Record<string, HandledRecord>>(STORAGE_KEY)
    .then(saved => {
      // Records written before the load finished win over the saved copy.
      records = prune({ ...(saved ?? {}), ...records });
    })
    .catch(() => {});
  return loading;
};

export const getHandledCall = (callId: string): HandledRecord | undefined => records[callId];

export const isCallHandled = (callId: string): boolean => Boolean(records[callId]);

/** Saves the call's state. 'done' is final and is never changed back to 'answered'. */
export const markCallHandled = (callId: string, state: HandledState, at = Date.now()): void => {
  const current = records[callId];
  if (current?.state === 'done') return;
  if (current?.state === state) return;
  records = prune({ ...records, [callId]: { state, at } });
  setObject(STORAGE_KEY, records);
};
```

### 6.7 `callService.ts`

The logic is verbatim. Only the import path, the `PRED Doctor` label and the toast text change.

```ts
import { AppState, Platform } from 'react-native';
import RNCallKeep, { CONSTANTS } from 'react-native-callkeep';
import { showInfoToast } from '../../lib/commons/toast.utils'; // doctor: lib/commons
import { navigationRef } from '../../navigation/navigationRef';
import { AppRoute } from '../../route';
import { useIncomingCallStore } from '../../zustand/stores/useIncomingCallStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';
import { showAndroidRing, showMissedCall, stopAndroidRing } from './androidRing';
import type { CallCancel, IncomingCall, PushData } from './call.types';
import { canShowSystemCall, ensureCallKeep } from './callKeepSetup';
import { callFromPush } from './callPayload';
import { getHandledCall, isCallHandled, loadHandledCalls, markCallHandled } from './handledCalls';
import type { HandledState } from './handledCalls';
import { joinIncomingCall } from './joinIncomingCall';

// doctor: name shown by Telecom / CallKit.
const CALL_HANDLE = 'PRED Doctor';

// Every ring goes through here, whatever started it. Calls are keyed by the backend uuid, so a
// push that arrives twice rings once. Calls already dealt with are kept in handledCalls, which
// survives restarts, so an old notification handed back at launch never rings or joins again.
const calls = new Map<string, IncomingCall>();
// Ends a ring whose cancel push never arrives.
const ringTimers = new Map<string, ReturnType<typeof setTimeout>>();
// Calls currently on the system call screen (Android Telecom or CallKit).
const onSystemScreen = new Set<string>();
// An answered call waiting for the app to come to the front.
let pendingAnswer: { call: IncomingCall; answeredAt: number } | null = null;
let joinWhenActive: ReturnType<typeof AppState.addEventListener> | null = null;
let answerTimer: ReturnType<typeof setTimeout> | null = null;
let listening = false;

const REMOTE_ENDED = CONSTANTS.END_CALL_REASONS.REMOTE_ENDED;
// Allowance for a phone clock that's slightly wrong.
const CLOCK_ALLOWANCE_MS = 30_000;
// How long an answered call may wait for the doctor to unlock and open the app. After this, opening
// the app doesn't join by itself.
const ANSWER_JOIN_WINDOW_MS = 45_000;

export const isCallExpired = (call: IncomingCall): boolean =>
  Date.now() > call.expiresAtMs + CLOCK_ALLOWANCE_MS;

const isAppActive = () => AppState.currentState === 'active';

const isBannerShowing = (appointmentId: string) => {
  const store = useIncomingCallStore.getState();
  return store.visible && String(store.appointmentId) === appointmentId;
};

const isRinging = (appointmentId: string) =>
  [...calls.values()].some(
    call => call.appointmentId === appointmentId && onSystemScreen.has(call.callId),
  );

// One sound per call: while the system call rings, the socket's in-app banner (which plays its own
// ringtone) is hidden. The socket code isn't changed; this reacts to the store instead.
const hideBannerWhileRinging = () => {
  const store = useIncomingCallStore.getState();
  if (store.visible && isRinging(String(store.appointmentId))) store.hideCallBanner();
};
useIncomingCallStore.subscribe(hideBannerWhileRinging);

// When the ring time is up and nobody answered, the ring is cleared everywhere: otherwise the call
// stays "ringing" here, its system call is never ended, and later in-app banners for the same
// appointment stay hidden.
const endRingWhenExpired = (call: IncomingCall) => {
  if (ringTimers.has(call.callId)) return;
  const delay = Math.max(call.expiresAtMs + CLOCK_ALLOWANCE_MS - Date.now(), 0);
  ringTimers.set(
    call.callId,
    setTimeout(async () => {
      ringTimers.delete(call.callId);
      if (!calls.has(call.callId) || pendingAnswer?.call.callId === call.callId) return;
      const showMissed = Platform.OS === 'android' && !isAppActive();
      await stopRinging(call.callId, call.appointmentId);
      if (showMissed) await showMissedCall(call);
    }, delay),
  );
};

// Keeps a call shown natively (iOS VoIP push) so Answer can find its appointment.
export const rememberCall = (data: PushData): void => {
  const call = callFromPush(data);
  if (call && !isCallHandled(call.callId)) {
    calls.set(call.callId, call);
    onSystemScreen.add(call.callId);
    // An already-expired call is left for replayInitialCallEvents to answer or end.
    if (!isCallExpired(call)) endRingWhenExpired(call);
    hideBannerWhileRinging();
  }
};

export const ringIncomingCall = async (call: IncomingCall): Promise<void> => {
  await loadHandledCalls();
  if (calls.has(call.callId) || isCallHandled(call.callId) || isCallExpired(call)) return;
  // Already in a consultation.
  if (useMeetingStore.getState().callInfo?.meetingId) return;
  calls.set(call.callId, call);
  endRingWhenExpired(call);

  // iOS with the app in the background: the backend's alert (or its VoIP push) rings.
  if (Platform.OS === 'ios' && !isAppActive()) return;

  await ensureCallKeep();

  if (Platform.OS === 'android') {
    // Self-managed (CallKeep's Android guide): Telecom registers the call, so Android respects an
    // ongoing phone call, Do Not Disturb and headsets, and PRED Doctor's own call notification is the
    // incoming-call UI in every app state. Its Answer opens the app, which Android always allows for
    // a tap on the app's own notification. Shown directly (not only on `showIncomingCallUi`) so it
    // still rings when Telecom refuses the call (`createIncomingConnectionFailed`).
    try {
      RNCallKeep.displayIncomingCall(call.callId, CALL_HANDLE, call.callerName, 'generic', false);
    } catch (err) {
      console.warn('[CallService] displayIncomingCall failed:', err);
    }
    onSystemScreen.add(call.callId);
    hideBannerWhileRinging();
    await showAndroidRing(call);
    // Cancelled or declined while the notification was being shown.
    if (isCallHandled(call.callId)) await stopAndroidRing(call.callId);
    return;
  }

  const systemScreenAvailable = await canShowSystemCall();
  if (!systemScreenAvailable) {
    console.warn('[CallService] System call screen is not available on this phone.');
  }

  // iOS with the app open: CallKit.
  try {
    // hasVideo false: the screen shows just the app name, without "Video". The video consultation
    // itself runs in the app after Answer.
    RNCallKeep.displayIncomingCall(call.callId, CALL_HANDLE, call.callerName, 'generic', false);
    if (systemScreenAvailable) onSystemScreen.add(call.callId);
  } catch (err) {
    console.warn('[CallService] displayIncomingCall failed:', err);
  }
  hideBannerWhileRinging();
};

const matchesCall = (call: IncomingCall, callId?: string, appointmentId?: string) =>
  call.callId === callId || (!!appointmentId && call.appointmentId === appointmentId);

const clearPendingAnswer = () => {
  pendingAnswer = null;
  joinWhenActive?.remove();
  joinWhenActive = null;
  if (answerTimer) clearTimeout(answerTimer);
  answerTimer = null;
};

// Keeps an answer until ANSWER_JOIN_WINDOW_MS after `answeredAt`. When the window passes, the answer
// is dropped and the system call (still showing as connected) is ended. `answeredAt` is the time of
// the Answer press, so holding the same answer again never makes the window longer.
const holdAnswer = (call: IncomingCall, answeredAt: number) => {
  clearPendingAnswer();
  pendingAnswer = { call, answeredAt };
  answerTimer = setTimeout(() => {
    if (pendingAnswer?.call.callId === call.callId) stopRinging(call.callId, call.appointmentId);
  }, Math.max(answeredAt + ANSWER_JOIN_WINDOW_MS - Date.now(), 0));
};

// Clears the ring everywhere. Takes the appointment too, because a fresh background JS instance
// (for example a Decline press after the app was closed) has an empty `calls` map.
// `outcome` 'answered' is for an Answer whose join hasn't run yet; anything else ends the call for good.
const stopRinging = async (
  callId: string,
  appointmentId?: string,
  outcome: HandledState = 'done',
  answeredAt?: number,
): Promise<void> => {
  if (
    outcome === 'done' &&
    pendingAnswer &&
    matchesCall(pendingAnswer.call, callId, appointmentId)
  ) {
    clearPendingAnswer();
  }
  markCallHandled(callId, outcome, answeredAt);
  onSystemScreen.delete(callId);
  const timer = ringTimers.get(callId);
  if (timer) clearTimeout(timer);
  ringTimers.delete(callId);
  const call = calls.get(callId);
  calls.delete(callId);

  const bannerAppointment = appointmentId ?? call?.appointmentId;
  if (bannerAppointment && isBannerShowing(bannerAppointment)) {
    useIncomingCallStore.getState().hideCallBanner();
  }

  await endSystemCall(callId);
};

// Removes the ring notification (Android) and closes the system call (and CallKit's in-call screen
// after Answer).
const endSystemCall = async (callId: string): Promise<void> => {
  if (Platform.OS === 'android') await stopAndroidRing(callId);
  try {
    RNCallKeep.reportEndCallWithUUID(callId, REMOTE_ENDED);
  } catch {
    // No system call to end.
  }
};

// CALL_CANCELLED push. The uuid can be empty, so match the appointment too.
export const cancelCall = async ({ callId, appointmentId }: CallCancel): Promise<void> => {
  const matches = [...calls.values()].filter(call => matchesCall(call, callId, appointmentId));
  // An answered call that's waiting for the app: the patient left, so opening the app must not join.
  const answered = pendingAnswer?.call;
  if (answered && matchesCall(answered, callId, appointmentId) && !matches.includes(answered)) {
    matches.push(answered);
  }
  const showMissed = !isAppActive();

  for (const call of matches) {
    await stopRinging(call.callId, call.appointmentId);
    if (showMissed && Platform.OS === 'android') await showMissedCall(call);
  }

  // A cancel can reach a fresh background instance that never saw the ring.
  if (matches.length === 0 && callId) {
    markCallHandled(callId, 'done');
    await endSystemCall(callId);
  }
};

// The backend has no decline route, so this only stops this phone ringing.
export const declineCall = async (callId: string, known?: IncomingCall): Promise<void> => {
  await loadHandledCalls();
  const key = callId.toLowerCase();
  if (isCallHandled(key)) {
    // Already dealt with (or answered and about to join): only make sure no system call is left.
    if (getHandledCall(key)?.state === 'done') endSystemCall(key);
    return;
  }
  await stopRinging(key, known?.appointmentId);
};

const isStartingUp = () => {
  const route = navigationRef.isReady() ? navigationRef.getCurrentRoute()?.name : undefined;
  return !route || route === AppRoute.SPLASH;
};

const startJoin = async (call: IncomingCall, answeredAt: number) => {
  if (isStartingUp()) {
    // Cold start: SplashScreen joins after it has checked the login.
    holdAnswer(call, answeredAt);
    return;
  }
  markCallHandled(call.callId, 'done');
  await joinIncomingCall(call.appointmentId, call.callerName);
};

const showCallEndedToast = () =>
  // doctor: patient wording
  showInfoToast('The patient is no longer waiting. Open the appointment to join.', 'Call ended');

/**
 * Answer on the call notification, the system call screen or a tap on the call alert. Also runs for
 * the notification that launched the app, which on Android can be an old one handed back again
 * (JS reload, relaunch): a call already dealt with is ignored, and an expired one never joins.
 * `allowLate` is for answers replayed from before JS started, already checked against their window.
 */
export const answerCall = async (
  callId: string,
  known?: IncomingCall,
  { allowLate = false }: { allowLate?: boolean } = {},
): Promise<void> => {
  await loadHandledCalls();
  const key = callId.toLowerCase();
  const call = known ?? calls.get(key);
  if (!call || pendingAnswer?.call.callId === key) return;

  const handled = getHandledCall(key);
  if (handled?.state === 'done') return;

  // Answered already, but the JS instance that took the Answer is gone (Android starts the app's
  // UI after the background handler stopped the ring). Join only within the original window.
  if (handled?.state === 'answered') {
    if (Date.now() - handled.at > ANSWER_JOIN_WINDOW_MS) {
      markCallHandled(key, 'done');
      return;
    }
  } else if (!allowLate && isCallExpired(call)) {
    // Answered so late that the patient has likely gone; the doctor can join from the appointment.
    // Checked in every app state: the app is already active while a cold start replays the
    // notification that opened it.
    await stopRinging(key, call.appointmentId);
    showCallEndedToast();
    return;
  }
  const answeredAt = handled?.at ?? Date.now();

  if (isAppActive()) {
    // Ends the system call. The consultation then runs in the app's own video call screen.
    await stopRinging(key, call.appointmentId, 'answered', answeredAt);
    await startJoin(call, answeredAt);
    return;
  }

  if (Platform.OS === 'android') {
    // The Answer tap on PRED Doctor's notification is opening the app (after the unlock, if locked):
    // stop the ring now and join as soon as the app is in front.
    await stopRinging(key, call.appointmentId, 'answered', answeredAt);
  } else {
    // iOS, locked or in the background: CallKit stays on the connected call until the app is in
    // front (tapping the app there opens it). Kept so a later cancel can find it.
    calls.set(key, call);
  }
  holdAnswer(call, answeredAt);
  joinWhenActive = AppState.addEventListener('change', state => {
    // During a cold start SplashScreen takes the answer once the login is checked.
    if (state !== 'active' || isStartingUp()) return;
    const waiting = consumePendingAnswer();
    if (waiting) joinIncomingCall(waiting.appointmentId, waiting.callerName);
  });
};

/**
 * The answered call to join now, if it's still within ANSWER_JOIN_WINDOW_MS. Either way the pending
 * answer is cleared, its system call ended and the call marked done, so opening the app later (or a
 * replay of the same notification) never joins by itself.
 */
export const consumePendingAnswer = (): IncomingCall | null => {
  const pending = pendingAnswer;
  clearPendingAnswer();
  if (!pending) return null;
  const { call, answeredAt } = pending;
  stopRinging(call.callId, call.appointmentId);
  if (Date.now() - answeredAt > ANSWER_JOIN_WINDOW_MS) return null;
  return call;
};

type InitialEvent = { name: string; data: any };

/**
 * Runs the answers and declines the doctor made on the system call screen before the app's JS
 * was ready (closed app, locked phone). SplashScreen awaits this before consumePendingAnswer.
 */
export const replayInitialCallEvents = async (): Promise<void> => {
  await loadHandledCalls();
  try {
    const events = ((await RNCallKeep.getInitialEvents()) ?? []) as InitialEvent[];
    RNCallKeep.clearInitialEvents();
    // The display event carries the push payload, so the answer can find the appointment.
    events
      .filter(e => e.name === 'RNCallKeepDidDisplayIncomingCall')
      .forEach(e => rememberCall(e.data?.payload));
    for (const event of events) {
      const callUUID = event.data?.callUUID;
      if (!callUUID) continue;
      if (event.name === 'RNCallKeepPerformAnswerCallAction') {
        // Only a call this instance knows, answered while it could still be joined. Anything else
        // (unknown or too old) just has its system call ended, so it doesn't join by itself.
        const call = calls.get(String(callUUID).toLowerCase());
        if (call && Date.now() <= call.expiresAtMs + ANSWER_JOIN_WINDOW_MS) {
          await answerCall(callUUID, undefined, { allowLate: true });
        } else {
          await declineCall(callUUID);
        }
      }
      if (event.name === 'RNCallKeepPerformEndCallAction') await declineCall(callUUID);
    }
  } catch (err) {
    console.warn('[CallService] Initial call events failed:', err);
  }
};

/**
 * Answer and Decline on the system call screen. Registered from index.js, so it also works when
 * the app was closed and only the background JS is running. Safe to call more than once.
 */
export const startCallKeepListeners = async (): Promise<void> => {
  if (listening) return;
  listening = true;
  await Promise.all([ensureCallKeep(), loadHandledCalls()]);
  RNCallKeep.addEventListener('didDisplayIncomingCall', ({ payload }) => {
    rememberCall(payload as PushData);
  });
  RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
    answerCall(callUUID);
  });
  RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
    declineCall(callUUID);
  });
};
```

### 6.8 `joinIncomingCall.ts`

The steps are the same as the patient file: skip if already in a call, check permissions, open the tracks in parallel, load fresh appointment info, stop if the consultation has ended, get a fresh token, set the call info and navigate. The stores and APIs are the doctor's, as in the doctor's `useJoinVideoCall.ts`.

```ts
import { Platform } from 'react-native';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import {
  createCameraTrack,
  createMicTrack,
  setPendingTracks,
  stopStream,
} from '../../hooks/commons/meeting/meetingMediaTracks';
import {
  getApptToken,
  getMyAppointmentInfo,
} from '../../hooks/react-query/appointments/appointments.func';
import { MyAppointmentsQueryKeys } from '../../hooks/react-query/query.keys';
import { ensureClinicAccess } from '../../lib/commons/auth.Utils';
import { showErrorToast, showInfoToast } from '../../lib/commons/toast.utils';
import { navigate } from '../../navigation/navigationRef';
import { AppRoute } from '../../route';
import { ConsultStatus } from '../../typescripts/enums';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';
import { useMeetingStore } from '../../zustand/stores/useMeetingStore';

const CALL_PERMISSIONS =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
    : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO];

// An appointment in one of these states has no call left to join.
const ENDED_STATUSES: string[] = [
  ConsultStatus.COMPLETED,
  ConsultStatus.CANCELLED,
  ConsultStatus.NO_SHOW,
];

type TJoinTracks = Awaited<ReturnType<typeof openJoinTracks>>;

const hasCallPermissions = async (): Promise<boolean> => {
  const result = await requestMultiple(CALL_PERMISSIONS);
  return CALL_PERMISSIONS.every(
    permission => result[permission] === RESULTS.GRANTED || result[permission] === RESULTS.LIMITED
  );
};

// doctor: the patient app exports these two from useJoinVideoCall.ts. Here they're local, so the
// doctor's useJoinVideoCall.ts doesn't change. Same behaviour: never rejects, a failed track is
// undefined and the SDK opens that device itself.
const openJoinTracks = async () => {
  const [micResult, cameraResult] = await Promise.allSettled([
    createMicTrack(),
    useMeetingStore.getState().isCamOn ? createCameraTrack('hd') : Promise.resolve(undefined),
  ]);
  return {
    mic: micResult.status === 'fulfilled' ? micResult.value : undefined,
    camera: cameraResult.status === 'fulfilled' ? cameraResult.value : undefined,
  };
};

const releaseJoinTracks = ({ camera, mic }: TJoinTracks) => {
  stopStream(camera);
  stopStream(mic);
};

/**
 * Joins a call answered from a push (Android Answer button, CallKit Answer or a tap on the call
 * notification). Same steps as useJoinVideoCall, which stays as it is, but runs outside React. The
 * meeting token always comes from getApptToken, never from the push.
 */
export const joinIncomingCall = async (appointmentId: string, patientName: string): Promise<void> => {
  // Already in a consultation (for example the same answer reaching here twice).
  if (useMeetingStore.getState().callInfo?.meetingId) return;

  // doctor: same gate as every Join button (inactive clinic or expired subscription).
  if (!ensureClinicAccess()) return;

  if (!(await hasCallPermissions())) {
    showErrorToast('Camera and microphone permissions are required to join the video consultation.');
    return;
  }

  const { showLoader, hideLoader } = useLoadingStore.getState();
  // Open the mic and camera while the appointment and token load; handed to the provider on
  // success, released on any failure.
  const tracksPromise = openJoinTracks();
  let tracksHandedOver = false;

  try {
    showLoader('Joining Video Call...');

    const apptResponse = await queryClient.fetchQuery({
      // Same key as useMyAppointmentInfo({ id }).
      queryKey: [MyAppointmentsQueryKeys.MyAppointmentsInfo, { id: appointmentId }],
      queryFn: () => getMyAppointmentInfo(appointmentId),
      // Never a cached copy: the appointment's status decides whether there is still a call.
      staleTime: 0,
    });
    const apptInfo = apptResponse?.data;
    if (!apptInfo) {
      showErrorToast('Failed to load appointment details');
      return;
    }

    const status = String(apptInfo.appointment_status || '').toLowerCase();
    if (ENDED_STATUSES.includes(status)) {
      showInfoToast('This consultation has already ended.', 'Call ended');
      return;
    }

    const tokenRes = await getApptToken(appointmentId);
    const videoCallData = tokenRes?.data;
    if (!tokenRes?.success || !videoCallData) {
      showErrorToast(tokenRes?.message || 'Unable to join the video consultation.');
      return;
    }

    setPendingTracks(await tracksPromise);
    tracksHandedOver = true;
    // doctor: same shape as useJoinVideoCall's setCallInfo.
    const patientId = videoCallData.patient?.id ?? apptInfo.patient?.id ?? apptInfo.patient_id;
    useMeetingStore.getState().setCallInfo({
      token: videoCallData.token,
      meeting_id: videoCallData.meeting_id,
      appointment: videoCallData.appointment || apptInfo,
      patientInfo: {
        name: videoCallData.patient?.name ?? apptInfo.patient?.name ?? patientName,
        patientId: patientId ? String(patientId) : undefined,
      },
    });

    navigate(AppRoute.DOCTOR_MEETING);
  } catch (error) {
    console.error('[joinIncomingCall] Join failed:', error);
    showErrorToast('Failed to join the call. Please try again.');
  } finally {
    if (!tracksHandedOver) releaseJoinTracks(await tracksPromise);
    hideLoader();
  }
};
```

When implementing, run `tsc`. If `videoCallData.appointment` and `apptInfo` have different types, cast as the doctor's `useJoinVideoCall.ts` does for `appointment`.

### 6.9 `deviceSync.ts`

This is verbatim except the paths and `user_type`.

```ts
import { Platform } from 'react-native';
import { getDeviceInfo } from '../../hooks/commons/useDeviceInfo';
import { getItem, setItem, STORAGE_KEYS } from '../../lib/commons/asyncStorage'; // doctor: lib/commons
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import axiosInstance from '../api/apiClient';
import { endpoints } from '../api/endpoints';

const VOIP_TOKEN_KEY = STORAGE_KEYS.VOIP_TOKEN;
// What was last sent successfully. Logout clears it, so the next login sends once.
const SYNCED_KEY = '@push_token_synced';
let queue: Promise<void> = Promise.resolve();

/**
 * Sends this phone's push tokens to the backend, so call pushes reach it after a token refresh.
 * Login already sends the FCM token; this covers the times in between.
 * Pass a new token when it's known, because local storage may not be updated yet.
 * `voip_token` (iOS) is for CallKit when the app is closed.
 */
export const syncPushToken = (freshToken?: string, freshVoipToken?: string): Promise<void> => {
  // Several callers fire on every app start. They run one at a time, so after the first request
  // the rest match the saved fingerprint and send nothing; a new token is never dropped.
  queue = queue.then(() => doSync(freshToken, freshVoipToken));
  return queue;
};

const doSync = async (freshToken?: string, freshVoipToken?: string): Promise<void> => {
  if (freshVoipToken) await setItem(VOIP_TOKEN_KEY, freshVoipToken);

  const userId = useAuthStore.getState().userData?.id;
  if (!userId) return;

  try {
    const info = await getDeviceInfo();
    const fcmToken = freshToken || info.fcm_token;
    if (!fcmToken) return;
    const voipToken = Platform.OS === 'ios' ? (await getItem(VOIP_TOKEN_KEY)) || undefined : undefined;

    // Skip when the backend already has exactly these tokens for this user and device.
    const fingerprint = [userId, info.device_id, fcmToken, voipToken ?? ''].join('|');
    if ((await getItem(SYNCED_KEY)) === fingerprint) return;

    await axiosInstance.post(endpoints.notifications.registerToken, {
      user_id: String(userId),
      user_type: 'doctor', // doctor: was 'patient'
      fcm_token: fcmToken,
      platform: info.platform,
      device_id: info.device_id,
      device_name: info.device_name,
      ...(voipToken ? { voip_token: voipToken, apns_env: __DEV__ ? 'sandbox' : 'production' } : {}),
    });
    await setItem(SYNCED_KEY, fingerprint);
  } catch (err) {
    console.warn('[DeviceSync] register-token failed:', err);
  }
};
```

The doctor's `apiClient.ts` also has `export default axiosInstance`, so the import is the same as in the patient app.

### 6.10 `voipToken.ts` (verbatim)

```ts
import { Platform } from 'react-native';
import VoipPushNotification from 'react-native-voip-push-notification';
import { syncPushToken } from './deviceSync';

let started = false;

/**
 * iOS: gets the PushKit VoIP token and sends it to the backend. The backend needs it to send
 * VoIP pushes, which wake a closed iPhone and show the CallKit call screen.
 * AppDelegate registers PushKit at launch; registerVoipToken() re-sends the cached token.
 */
export const startVoipToken = (): void => {
  if (Platform.OS !== 'ios' || started) return;
  started = true;
  VoipPushNotification.addEventListener('register', token => {
    if (token) syncPushToken(undefined, token);
  });
  VoipPushNotification.registerVoipToken();
};
```

---

## 9. Step 7: wiring the entry points

### 7.1 `index.js` (M+)

This is the patient file without `initializeI18n` (not in the doctor app). The existing `register()` and Notifee foreground service stay.

```js
import notifee from '@notifee/react-native';
import { register } from '@videosdk.live/react-native-sdk';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { startCallKeepListeners } from './src/services/calls/callService';            // new
import {
  registerBackgroundNotificationHandler,
  registerBackgroundPushHandler,
} from './src/services/notifications';                                                  // new

registerBackgroundNotificationHandler();                                                // new
registerBackgroundPushHandler();                                                        // new
// Answer and Decline on the call notification / CallKit, also when only the background JS is running.
startCallKeepListeners().catch(err => console.warn('[CallKeep] Listener setup failed:', err)); // new
register();

if (Platform.OS === 'android') {
  // Keeps the call's camera|microphone foreground service alive until stopForegroundService().
  notifee.registerForegroundService(() => new Promise(() => {}));
}

AppRegistry.registerComponent(appName, () => App);
```

### 7.2 `App.tsx` (M+)

All existing components stay in the same order, including `SwitchClinicModal`. Add the imports, the `useEffect`, and `<NotificationEventListener />` after `<EventListener />`, where the patient app has it.

```tsx
import { useEffect } from 'react';                                                     // new
import { StatusBar, useColorScheme } from 'react-native';
// ...existing imports unchanged...
import NotificationEventListener from './src/services/notifications/components/NotificationEventListener'; // new
import { startCallKeepListeners } from './src/services/calls/callService';                                 // new
import { startVoipToken } from './src/services/calls/voipToken';                                           // new
import { setupPush } from './src/services/notifications/push/pushSetup';                                   // new

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // new: same as the patient App.tsx
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    setupPush()
      .then(stopListening => {
        if (cancelled) stopListening();
        else unsubscribe = stopListening;
      })
      .catch(err => console.warn('[Push] Setup failed:', err));

    // Answer and Decline on the system call screen (also registered in index.js for background JS).
    startCallKeepListeners().catch(err => console.warn('[CallKeep] Listener setup failed:', err));
    // iOS: PushKit VoIP token for CallKit when the app is closed.
    startVoipToken();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return (
    <ReactQueryProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NetworkEventListener />
        <SocketProvider />
        <SocketListeners />
        <AppNavigator />
        <MeetingSessionHost />
        <EventListener />
        <NotificationEventListener />{/* new */}
        <HideDuringAndroidPip>
          <GlobalIncomingCallBanner />
          <GlobalOfflineBanner />
          <GlobalUnstableConnectionBanner />
          <GlobalToast />
          <GlobalPopupAlert />
          <SwitchClinicModal />
          <BackdropLoader />
          <GlobalNoInternetBlocker />
        </HideDuringAndroidPip>
      </SafeAreaProvider>
    </ReactQueryProvider>
  );
}
```

### 7.3 `src/Features/SplashScreen/SplashScreen.tsx` (M+)

These are the same added lines as in the patient Splash. The doctor's existing branches (email verify, policy, target route, main tabs, login) stay as they are.

**Imports:**

```ts
import { consumePendingAnswer, replayInitialCallEvents } from '../../services/calls/callService';
import { syncPushToken } from '../../services/calls/deviceSync';
import { joinIncomingCall } from '../../services/calls/joinIncomingCall';
import { processInitialNotification } from '../../services/notifications/notificationDispatcher';
```

**`authenticateAndLoad`:**

```ts
        if (res?.data) {
          setUserData(res.data);
          // Keeps the backend's FCM token current, so call pushes reach this phone.   // new
          syncPushToken();                                                              // new
          return res.data;
        }
```

**`startAuthentication`:**

```ts
    const startAuthentication = async () => {
      if (!isMounted) return;
      const doctorData = await authenticateAndLoad();
      // new: a tap that opened the app sets the target route; a call tap sets the pending answer.
      await processInitialNotification();
      // new: answers made on CallKit before the app's JS was ready.
      await replayInitialCallEvents();
      // new: set when the app was opened by answering an incoming call.
      const pendingCall = consumePendingAnswer();
      // Move immediately after authentication/API completes
      if (onFinish) {
        onFinish();
      } else if (navigation) {
        if (doctorData) {
          if (!doctorData?.email_verified_at) {
            resetAndNavigate(navigation, AppRoute.EMAIL_VERIFY, { email: doctorData?.email });
          } else if (!doctorData.has_accepted_policies) {
            resetAndNavigate(navigation, AppRoute.POLICY_ACCEPTANCE);
          } else if (doctorData.has_accepted_policies) {
            const target = consumeTargetRoute();
            if (target && target.name !== AppRoute.HOME) {
              navigation?.reset({ index: 0, routes: [target as any] });
            } else {
              resetToMainTabs(navigation);
            }
            // new: the doctor answered a call before the app had started.
            if (pendingCall) {
              joinIncomingCall(pendingCall.appointmentId, pendingCall.callerName);
            }
          } else {
            resetAndNavigate(navigation, AppRoute.POLICY_ACCEPTANCE);
          }
        } else {
          resetToLogin(navigation);
        }
      }
    };
```

### 7.4 `src/Features/Auth/LoginScreen.tsx` (M)

The patient login sends the real device info. In `onSubmitVerifyOtp`, replace the two empty device lines and the empty payload fields:

```ts
import { getDeviceInfo } from '../../hooks/commons/useDeviceInfo';   // new import
import { syncPushToken } from '../../services/calls/deviceSync';     // new import

    const cleanIdentifier = identifier.trim();
    const deviceInfo = await getDeviceInfo();       // replaces activeDeviceId / activeDeviceName

    const payload: ILoginVerifyOtpPayload = {
      ...(loginMode === 'email'
        ? { email: cleanIdentifier.toLowerCase() }
        : { phone_number: cleanIdentifier }),
      otp: _data.otp,
      user_type: UserRoles.DOCTOR,
      device_id: deviceInfo.device_id,
      device_name: deviceInfo.device_name,
      platform: Platform.OS as 'android' | 'ios',
      fcm_token: deviceInfo.fcm_token,
      os_version: deviceInfo.os_version,
      app_version: deviceInfo.app_version,
    };
```

In `onSuccess`, after `setUserData(profileRes?.data);`:

```ts
                // Login only sends the FCM token; this also sends the iOS VoIP token.
                syncPushToken();
```

Everything else in `LoginScreen.tsx` stays.

---

## 10. Checks after implementing

```bash
npx tsc --noEmit                                  # no new type errors
git diff --stat                                   # only the files in section 2
git diff android ios | grep '^-' | grep -v '^---' # removed lines: only the 4 Podfile header-path lines
```

## 11. Test checklist (physical devices; the iOS Simulator has no CallKit, VoIP or FCM token)

**Push**

- [ ] First start asks for notification permission; `FCM token:` shows in the log (Android and iPhone)
- [ ] Login: the backend `active_devices` row has the real `device_id`, `fcm_token`, `platform` and `role_type = doctor`
- [ ] Opening the app 3 times sends `register-token` at most once; logout and login send it once
- [ ] Firebase console test message: shows in the foreground (Notifee banner), background and closed, on both platforms
- [ ] Tap on "Patient is waiting" (app closed, background and open) → `AppointmentDetails` for that appointment
- [ ] Tap on any other push → the same screen the in-app notification list opens

**Android ring**

- [ ] App open, background, closed, locked: the call notification rings → Answer → `DoctorMeeting`; Decline → stops
- [ ] Patient leaves early, or no answer in 30 s: ring stops; "Missed call" shows when the app isn't on screen; a tap opens the appointment
- [ ] One ringtone only
- [ ] After a call, reopen the app from Recents or reload JS: no join

**iOS ring**

- [ ] App open: CallKit → Answer → joins; Decline → stops
- [ ] Background, closed, locked: CallKit (VoIP push) → Answer → unlock → joins
- [ ] A tap on an old alert in Notification Centre: "Call ended", no join

**Existing doctor flows (unchanged)**

- [ ] Join from Home, Appointments, AppointmentDetails, ConsultTab and MeetingStatus; the in-app banner Join
- [ ] PiP (Android and iOS), the ongoing-call foreground service, Time-up end, SwitchClinicModal
- [ ] Inactive clinic or expired subscription: Answer shows the clinic-access alert and doesn't join

## 12. Build order

1. Step 1 + 2 (packages, Android) → Android builds.
2. Step 3 (iOS) → iOS builds, and **an existing video call with PiP still works**.
3. Step 4 + 5 (shared files, `services/notifications/`) + 7.1, 7.2 → Firebase console test message works in every state.
4. Step 6 (`services/calls/`) + 7.3, 7.4 → Android ring end to end, then iOS CallKit.
5. Sections 10 and 11, then release.
