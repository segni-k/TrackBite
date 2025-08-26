// app/(auth)/terms.tsx
import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable, BackHandler, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TermsScreen() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user already accepted
  useEffect(() => {
    const checkAcceptance = async () => {
      const accepted = await AsyncStorage.getItem("termsAccepted");
      if (accepted === "true") {
        router.replace("/(tabs)/home"); // skip screen if already accepted
      } else {
        setLoading(false);
      }
    };
    checkAcceptance();
  }, []);

  const handleAccept = async () => {
    if (isChecked) {
      await AsyncStorage.setItem("termsAccepted", "true");
      router.replace("/(tabs)/home");
    }
  };

  const handleDecline = async () => {
    await AsyncStorage.clear();
    Alert.alert(
      "Terms Declined",
      "You must accept the Terms & Conditions to use TrackBite.",
      [
        { text: "Exit App", onPress: () => BackHandler.exitApp() },
        { text: "Back to Login", onPress: () => router.replace("/(auth)/login") }
      ]
    );
  };

  const openPrivacyPolicy = () => {
    // OPTION 1: Open an external link
    // Linking.openURL("https://yourdomain.com/privacy-policy");
    
    // OPTION 2: Navigate to an internal screen
     router.push("/(modals)/privacy-policy");
  };

  if (loading) return null;

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center mb-4 text-gray-900">
        Terms & Conditions
      </Text>

      <ScrollView className="flex-1 mb-5">
        <Text className="text-gray-700 mb-3">
          Welcome to TrackBite! Please read these Terms & Conditions carefully
          before using our app. By accessing or using TrackBite, you agree to be
          bound by these terms.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          1. Acceptance of Terms
        </Text>
        <Text className="text-gray-700 mb-3">
          By creating an account or using TrackBite, you confirm that you have
          read, understood, and agree to these Terms & Conditions.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          2. Use of the App
        </Text>
        <Text className="text-gray-700 mb-3">
          You agree to use TrackBite only for personal health tracking purposes.
          You may not misuse, resell, or exploit any part of the service.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          3. Health Disclaimer
        </Text>
        <Text className="text-gray-700 mb-3">
          TrackBite provides calorie and nutrition estimates but does not
          replace professional medical advice. Always consult a healthcare
          provider for medical guidance.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          4. Data & Privacy
        </Text>
        <Text className="text-gray-700 mb-3">
          Your data is stored securely. By using TrackBite, you consent to the
          collection and processing of your personal data as described in our
          Privacy Policy.
        </Text>

        {/* Privacy Policy Link */}
        <Pressable onPress={openPrivacyPolicy}>
          <Text className="text-blue-600 underline mb-5">
            Read our Privacy Policy
          </Text>
        </Pressable>

        <Text className="font-semibold text-gray-900 mb-1">
          5. User Responsibilities
        </Text>
        <Text className="text-gray-700 mb-3">
          You are responsible for maintaining the confidentiality of your
          account. Any activity under your account is your responsibility.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">
          6. Limitation of Liability
        </Text>
        <Text className="text-gray-700 mb-3">
          TrackBite is not liable for any health issues, data loss, or damages
          resulting from use of the app. Use at your own risk.
        </Text>

        <Text className="font-semibold text-gray-900 mb-1">7. Changes</Text>
        <Text className="text-gray-700 mb-3">
          We may update these Terms from time to time. Continued use means you
          accept the new Terms.
        </Text>

        <Text className="text-gray-700 italic mb-10">
          Last updated: August 2025
        </Text>
      </ScrollView>

      {/* Custom Checkbox */}
      <Pressable
        onPress={() => setIsChecked(!isChecked)}
        className="flex-row items-center mb-5"
      >
        <View
          className={`h-6 w-6 rounded-md border-2 mr-2 items-center justify-center ${
            isChecked ? "bg-green-500 border-green-500" : "border-gray-400"
          }`}
        >
          {isChecked && <Text className="text-white font-bold">✓</Text>}
        </View>
        <Text className="text-gray-800">
          I have read and agree to the Terms & Conditions
        </Text>
      </Pressable>

      {/* Accept button */}
      <Pressable
        disabled={!isChecked}
        onPress={handleAccept}
        className={`p-4 rounded-2xl mb-3 ${
          isChecked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <Text className="text-center text-white font-semibold text-lg">
          Accept & Continue
        </Text>
      </Pressable>

      {/* Decline button */}
      <Pressable
        onPress={handleDecline}
        className="p-4 rounded-2xl bg-red-500"
      >
        <Text className="text-center text-white font-semibold text-lg">
          Decline
        </Text>
      </Pressable>
    </View>
  );
}
