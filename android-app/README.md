# HaramBlur Android Example

This directory provides a minimal React Native example that demonstrates how the blur logic can be reused on Android devices. It loads the same Human and NSFW models used by the browser extension via `tfjs-react-native`.

## Prerequisites

-   Node.js and Yarn or npm
-   Android Studio or the Android SDK
-   `expo` CLI for easier testing (`npm install -g expo-cli`)

## Getting Started

```bash
cd android-app
npm install
npm run android
```

This will launch the React Native packager and build the app on a connected Android emulator or device.

The example allows picking an image from the gallery, runs the face and NSFW detectors, and blurs the image when unwanted content is found.

## Background Blur Service

To blur content from other applications (e.g. YouTube or Facebook), a background service must capture the screen using the `MediaProjection` API and process each frame through the detector. A rough outline:

1. Request the `MEDIA_PROJECTION` permission and start a `Service` using `MediaProjectionManager`.
2. Capture frames from the screen and convert them to tensors.
3. Run the detectors from `detector.js` and overlay a blur view on detected regions.

Implementing a full background service is beyond the scope of this simple example, but the provided React Native code shows how detection can run on-device.
