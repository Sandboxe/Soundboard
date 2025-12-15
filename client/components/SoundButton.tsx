import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  WithSpringConfig,
} from "react-native-reanimated";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SoundButtonProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  onPress: () => void;
  isPlaying?: boolean;
  style?: ViewStyle;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 200,
  overshootClamping: false,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SoundButton({
  label,
  icon,
  color,
  onPress,
  isPlaying = false,
  style,
}: SoundButtonProps) {
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderWidth: 2,
    borderColor: `rgba(255, 255, 255, ${borderOpacity.value})`,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handlePress = () => {
    borderOpacity.value = withSequence(
      withSpring(0.5, { damping: 20, stiffness: 300 }),
      withSpring(0, { damping: 20, stiffness: 300 })
    );
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={`Play ${label} sound`}
      accessibilityRole="button"
      style={[
        styles.button,
        { backgroundColor: color },
        animatedStyle,
        borderStyle,
        style,
      ]}
    >
      <Feather name={icon} size={48} color="#FFFFFF" />
      <ThemedText style={styles.label}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 120,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: Spacing.sm,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
