// app/(auth)/privacy-policy.tsx
import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center mb-4 text-gray-900">
        Privacy Policy
      </Text>

      <ScrollView className="flex-1 mb-5">
        <Text className="text-gray-700 mb-3">
          TrackBite respects your privacy. This Privacy Policy explains how we
          collect, use, and protect your personal information when you use our
          app.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          1. Information We Collect
        </Text>
        <Text className="text-gray-700 mb-3">
          We may collect personal information such as your name, email address,
          and health-related data (like meals, calories, and activity logs) to
          provide personalized services.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          2. How We Use Your Information
        </Text>
        <Text className="text-gray-700 mb-3">
          Your data is used to track your nutrition, improve recommendations, and
          enhance your overall app experience. We do not sell or share your data
          with third parties for advertising.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          3. Data Security
        </Text>
        <Text className="text-gray-700 mb-3">
          We use industry-standard encryption and secure storage methods to
          protect your data. However, no system is completely secure, and you
          use the app at your own risk.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          4. Third-Party Services
        </Text>
        <Text className="text-gray-700 mb-3">
          TrackBite may integrate with third-party services (e.g., Google Sign-In,
          fitness trackers). These services have their own privacy policies that
          you should review.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          5. Your Rights
        </Text>
        <Text className="text-gray-700 mb-3">
          You have the right to request access, correction, or deletion of your
          personal data. Contact us if you wish to exercise these rights.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          6. Updates
        </Text>
        <Text className="text-gray-700 mb-3">
          We may update this Privacy Policy from time to time. Continued use of
          TrackBite means you accept the updated policy.
        </Text>

        <Text className="text-gray-700 italic mb-10">
          Last updated: August 2025
        </Text>
      </ScrollView>

      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        className="p-4 rounded-2xl bg-blue-500"
      >
        <Text className="text-center text-white font-semibold text-lg">
          Back
        </Text>
      </Pressable>
    </View>
  );
}
