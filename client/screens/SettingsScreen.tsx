import React, { useState, useEffect } from "react";
import { View, StyleSheet, Switch, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, SoundButtonColors } from "@/constants/theme";

const VOLUME_KEY = "@soundboard_volume";
const HAPTIC_KEY = "@soundboard_haptic";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [volume, setVolume] = useState(1);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedVolume = await AsyncStorage.getItem(VOLUME_KEY);
      const savedHaptic = await AsyncStorage.getItem(HAPTIC_KEY);
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume));
      }
      if (savedHaptic !== null) {
        setHapticEnabled(savedHaptic === "true");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    try {
      await AsyncStorage.setItem(VOLUME_KEY, value.toString());
    } catch (error) {
      console.error("Failed to save volume:", error);
    }
  };

  const handleHapticToggle = async (value: boolean) => {
    setHapticEnabled(value);
    try {
      await AsyncStorage.setItem(HAPTIC_KEY, value.toString());
    } catch (error) {
      console.error("Failed to save haptic setting:", error);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <ThemedView style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Audio
        </ThemedText>
        
        <View style={[styles.settingRow, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.settingInfo}>
            <ThemedText type="body">Volume</ThemedText>
            <ThemedText type="small" style={{ color: theme.tabIconDefault }}>
              {Math.round(volume * 100)}%
            </ThemedText>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor={SoundButtonColors.applause}
              maximumTrackTintColor={theme.backgroundTertiary}
              thumbTintColor={SoundButtonColors.applause}
            />
          </View>
        </View>

        <View style={[styles.settingRow, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.settingInfo}>
            <ThemedText type="body">Haptic Feedback</ThemedText>
            <ThemedText type="small" style={{ color: theme.tabIconDefault }}>
              Vibrate when pressing buttons
            </ThemedText>
          </View>
          <Switch
            value={hapticEnabled}
            onValueChange={handleHapticToggle}
            trackColor={{ false: theme.backgroundTertiary, true: SoundButtonColors.applause }}
            thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          About
        </ThemedText>
        
        <View style={[styles.settingRow, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="body">Sound Board</ThemedText>
          <ThemedText type="small" style={{ color: theme.tabIconDefault }}>
            Version 1.0.0
          </ThemedText>
        </View>
      </ThemedView>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  sliderContainer: {
    width: 120,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
