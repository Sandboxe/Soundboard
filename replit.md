# Sound Board App

A fun mobile sound effect app built with Expo React Native. Press colorful buttons to instantly play different sound effects.

## Features
- 6 sound effect buttons: Applause, Airhorn, Drum, Bell, Laugh, Tada
- Colorful, playful UI with icons and labels
- Visual feedback with scale animations when pressed
- Settings screen with volume control and haptic feedback toggle
- Works on iOS, Android, and web

## Tech Stack
- Expo SDK 54
- React Native with React Navigation
- expo-av for audio playback
- expo-haptics for haptic feedback
- AsyncStorage for persisting settings

## Project Structure
```
client/
├── screens/
│   ├── HomeScreen.tsx      # Main sound board with buttons
│   └── SettingsScreen.tsx  # Volume and haptic settings
├── components/
│   ├── SoundButton.tsx     # Individual sound effect button
│   ├── HeaderTitle.tsx     # Custom header with app icon
│   └── ...                 # Shared components
├── navigation/
│   └── RootStackNavigator.tsx  # Stack navigation
└── constants/
    └── theme.ts            # Colors, spacing, typography
```

## Sound Generation
Sounds are generated programmatically using the Web Audio API to create simple tones. Each button has a unique frequency and duration configured in HomeScreen.tsx.

## Running the App
- **Web**: Visit the deployment URL
- **Mobile**: Scan the QR code with Expo Go

## Settings Persistence
Volume and haptic feedback preferences are saved to AsyncStorage and persist across app sessions.
