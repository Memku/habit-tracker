## Build apk

Prerequisites
```
npm install
```

Dev (opens android emulator if installed)
```
npx tauri android dev
```

Build (generates apk and aab files)
```
npx tauri andorid build
```
Next you can send apk file to your phone and install.
It will be there:
```
src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk
```
