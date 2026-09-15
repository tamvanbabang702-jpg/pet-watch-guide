# Running Healthy Pet Checker on Android (Capacitor)

The app is fully offline: no backend, no authentication, no network calls. All data
lives in `localStorage` on the device, so it packages cleanly as a native Android app.

## Requirements

- Node.js 20+
- Android Studio (latest stable) with the Android SDK and a JDK 21 toolchain

## One-time setup

```sh
npm install
npm run build          # produces the static client bundle
npx cap add android    # creates the ./android Gradle project
npx cap sync android
```

## Open in Android Studio

```sh
npx cap open android
```

Android Studio imports `./android` as a normal Gradle project. Run it on an emulator
or a connected device from the toolbar.

## After any code change

```sh
npm run build
npx cap sync android
```

`cap sync` copies the fresh web build into the native project and updates plugins.

## Notes

- `capacitor.config.ts` sets the app id `app.lovable.healthypetchecker`, the app name,
  and `webDir: dist/client`. Change the app id before publishing under your own account.
- The app requests no runtime permissions and needs no internet permission to function.
- Safe-area insets are handled in CSS, so notches and gesture bars are respected.
- App icons and the splash screen are replaced in `android/app/src/main/res` (or via
  `@capacitor/assets`).
