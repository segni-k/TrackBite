// components/Ring.tsx
import React from "react";
import Svg, { Circle } from "react-native-svg";
import { View, Text } from "react-native";

type Props = {
  size?: number;
  stroke?: number;
  value: number; // current grams
  goal?: number;  // target grams
  label: string;
  color: string; // e.g. "#ef4444"
};

export default function Ring({
  size = 82,
  stroke = 5,
  value,
  goal,
  label,
  color,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, goal ? value / goal : 0));
  const dashOffset = circumference * (1 - pct);

  return (
    <View className="items-center">
      <View>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-lg font-bold" style={{ color }}>
            {Math.round(value)}
          </Text>
          <Text className="text-xs text-gray-500">/ {goal} g</Text>
        </View>
      </View>
      <Text className="text-sm mt-2 text-gray-700">{label}</Text>
    </View>
  );
}
