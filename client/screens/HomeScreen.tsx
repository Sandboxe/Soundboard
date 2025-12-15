import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SoundButton } from "@/components/SoundButton";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, SoundButtonColors } from "@/constants/theme";

const VOLUME_KEY = "@soundboard_volume";
const HAPTIC_KEY = "@soundboard_haptic";

interface SoundConfig {
  id: string;
  label: string;
  icon: "thumbs-up" | "alert-triangle" | "disc" | "bell" | "smile" | "star";
  color: string;
  frequency: number;
  duration: number;
}

const SOUNDS: SoundConfig[] = [
  { id: "applause", label: "Applause", icon: "thumbs-up", color: SoundButtonColors.applause, frequency: 400, duration: 800 },
  { id: "airhorn", label: "Airhorn", icon: "alert-triangle", color: SoundButtonColors.airhorn, frequency: 800, duration: 600 },
  { id: "drum", label: "Drum", icon: "disc", color: SoundButtonColors.drum, frequency: 150, duration: 300 },
  { id: "bell", label: "Bell", icon: "bell", color: SoundButtonColors.bell, frequency: 1000, duration: 500 },
  { id: "laugh", label: "Laugh", icon: "smile", color: SoundButtonColors.laugh, frequency: 600, duration: 700 },
  { id: "tada", label: "Tada", icon: "star", color: SoundButtonColors.tada, frequency: 523, duration: 600 },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const volumeRef = useRef(1);
  const hapticEnabledRef = useRef(true);

  useEffect(() => {
    loadSettings();
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadSettings = async () => {
    try {
      const savedVolume = await AsyncStorage.getItem(VOLUME_KEY);
      const savedHaptic = await AsyncStorage.getItem(HAPTIC_KEY);
      if (savedVolume !== null) {
        volumeRef.current = parseFloat(savedVolume);
      }
      if (savedHaptic !== null) {
        hapticEnabledRef.current = savedHaptic === "true";
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const playSound = useCallback(async (config: SoundConfig) => {
    await loadSettings();
    
    if (hapticEnabledRef.current && Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setPlayingId(config.id);

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: generateToneDataUri(config.frequency, config.duration) },
        { volume: volumeRef.current }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
      setPlayingId(null);
    }
  }, []);

  const rows = [];
  for (let i = 0; i < SOUNDS.length; i += 2) {
    rows.push(SOUNDS.slice(i, i + 2));
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((sound) => (
            <SoundButton
              key={sound.id}
              label={sound.label}
              icon={sound.icon}
              color={sound.color}
              isPlaying={playingId === sound.id}
              onPress={() => playSound(sound)}
              style={row.indexOf(sound) === 0 ? styles.leftButton : styles.rightButton}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function generateToneDataUri(frequency: number, durationMs: number): string {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * (durationMs / 1000));
  const samples = new Float32Array(numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.min(1, Math.min(t * 20, (durationMs / 1000 - t) * 10));
    samples[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
  }

  const wavData = encodeWav(samples, sampleRate);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(wavData)));
  return `data:audio/wav;base64,${base64}`;
}

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return buffer;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  leftButton: {
    marginRight: Spacing.sm,
  },
  rightButton: {
    marginLeft: Spacing.sm,
  },
});
