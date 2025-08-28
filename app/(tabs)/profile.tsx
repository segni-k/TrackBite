// app/(tabs)/profile.tsx

import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Share,
  Pressable,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Removed PreferenceSwitch component as requested.

export default function Profile() {
  const router = useRouter();

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [settingsModal, setSettingsModal] = useState<string | null>(null);
  const [name, setName] = useState("Mamiheru");
  const [age, setAge] = useState("25");
  const [profilePic, setProfilePic] = useState(
    "https://randomuser.me/api/portraits/men/1.jpg"
  );
  const [burnedCaloriesEnabled, setBurnedCaloriesEnabled] = useState(true);
  const [rolloverCaloriesEnabled, setRolloverCaloriesEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)/login");
  };

  const referralCode = "TRACK123";
  const referralLink = `https://trackbite.app/invite?code=${referralCode}`;

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Join me on TrackBite! Use my referral code: ${referralCode} or this link: ${referralLink}`,
      });
    } catch (error) {
      console.log("Error sharing referral link:", error);
    }
  };

  const settings = [
    {
      label: "Personal Information",
      key: "personal_info",
      icon: <Entypo name="user" size={26} color="#333" />,
    },
    {
      label: "Adjust Macros",
      key: "adjust_macros",
      icon: <MaterialIcons name="edit" size={26} color="#333" />,
    },
    {
      label: "Goals & Current Progress",
      key: "goals_progress",
      icon: <FontAwesome5 name="bullseye" size={26} color="#333" />,
    },
    {
      label: "Weight history",
      key: "weight",
      icon: <MaterialIcons name="bar-chart" size={26} color="#333" />,
    },
    {
      label: "Language",
      key: "language",
      icon: <Ionicons name="language" size={26} color="#333" />,
    },
  ];
  const preferences = [
    {
      label: "Add Burned Calories",
      value: burnedCaloriesEnabled,
      setter: setBurnedCaloriesEnabled,
      icon: (
        <FontAwesome5
          name="fire"
          size={20}
          color={burnedCaloriesEnabled ? "#4F46E5" : "#9CA3AF"}
        />
      ),
    },
    {
      label: "Rollover Calories",
      value: rolloverCaloriesEnabled,
      setter: setRolloverCaloriesEnabled,
      icon: (
        <MaterialIcons
          name="swap-horiz"
          size={20}
          color={rolloverCaloriesEnabled ? "#4F46E5" : "#9CA3AF"}
        />
      ),
    },
    {
      label: "Enable Notifications",
      value: notificationsEnabled,
      setter: setNotificationsEnabled,
      icon: (
        <Ionicons
          name="notifications-outline"
          size={20}
          color={notificationsEnabled ? "#4F46E5" : "#9CA3AF"}
        />
      ),
    },
  ];

  // PreferenceSwitch functional component
  function PreferenceSwitch({
    label,
    value,
    disk,
    onValueChange,
    icon,
  }: {
    label: string;
    value: boolean;
    disk?: string
    onValueChange: (val: boolean) => void;
    icon: React.ReactNode;
  }) {
    return (
      <View className={` ${label==="Enable Notifications" ? "border-none" : "border-b border-gray-200"} flex-row items-center justify-between mb-3 py-3 `}>
        <View className="flex-row items-center gap-2">
          {icon}
          <View className="items-start justify-start align-center">
            <Text className=" text-xl font-semibold text-gray-700 mb-2">{label}</Text>
            {disk && <Text className="text-sm text-gray-500">{disk}</Text>}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onValueChange(!value)}
          className={`w-14 h-8 rounded-full ${value ? "bg-indigo-500" : "bg-gray-300"} flex-row items-center px-1`}
        >
          <View
            className={`w-5 h-5 rounded-full bg-white ${value ? "ml-7" : ""}`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              elevation: 2,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-white px-4 pt-8"
    >
      <SafeAreaView>
        {/* Profile Info */}
        <TouchableOpacity
          className="flex-row items-center mb-6 shadow-md bg-white rounded-2xl p-4"
          onPress={() => setEditProfileVisible(true)}
        >
          <Image
            source={{ uri: profilePic }}
            style={{ resizeMode: "cover" }}
            className="w-16 h-16 rounded-full mr-4"
            onError={() =>
              setProfilePic(
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              )
            }
          />
          <View>
            <Text className="text-xl font-bold text-gray-800">{name}</Text>
            <Text className="text-gray-500">{age} years old</Text>
          </View>
        </TouchableOpacity>

        {/* Edit Profile Modal */}
        <Modal visible={editProfileVisible} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-bold mb-4">Edit Profile</Text>
              <TextInput
                className="border rounded px-3 py-2 mb-3"
                value={name}
                onChangeText={setName}
                placeholder="Name"
              />
              <TextInput
                className="border rounded px-3 py-2 mb-3"
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                keyboardType="numeric"
              />
              <TouchableOpacity
                className="bg-blue-500 py-2 rounded"
                onPress={() => setEditProfileVisible(false)}
              >
                <Text className="text-white text-center font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Invite Friend */}
        <TouchableOpacity
          className="flex-row items-center bg-gray-100 rounded-xl p-4 mb-6"
          onPress={() => setInviteModalVisible(true)}
        >
          <Ionicons name="share-social-outline" size={24} color="#4F46E5" />
          <Text className="ml-3 text-base font-semibold text-gray-700">
            Invite Friend with Referral
          </Text>
        </TouchableOpacity>

        {/* Invite Modal */}
        <Modal visible={inviteModalVisible} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-bold mb-2">Invite a Friend</Text>
              <Text className="mb-2">Share this link or promo code:</Text>
              <Text className="mb-2 font-mono text-blue-600">
                {referralLink}
              </Text>
              <Text className="mb-4 font-bold text-gray-800">
                Code: {referralCode}
              </Text>
              <TouchableOpacity
                className="bg-indigo-500 py-2 rounded mb-2"
                onPress={handleShareReferral}
              >
                <Text className="text-white text-center font-bold">Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2"
                onPress={() => setInviteModalVisible(false)}
              >
                <Text className="text-center text-gray-500">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Settings List */}
        <View className="mt-2 border border-gray-200 rounded-3xl p-4 shadow-lg bg-white">
          {settings.map((item) => (
            <TouchableOpacity
              key={item.key}
              className={` ${item.key === "language" ? "boarder-none" : "border-b border-gray-200"} flex-row items-center py-4 `}
              onPress={() => setSettingsModal(item.key)}
            >
              {item.icon}
              <Text className="ml-4 text-xl font-semibold text-gray-700">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Modals */}
        <Modal
          visible={settingsModal === "personal"}
          transparent
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-bold mb-4">
                Edit Personal Details
              </Text>
              {/* Add your edit fields here */}
              <TouchableOpacity
                className="bg-blue-500 py-2 rounded"
                onPress={() => setSettingsModal(null)}
              >
                <Text className="text-white text-center font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={settingsModal === "macros"}
          transparent
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-bold mb-4">
                Adjust Macronutrients
              </Text>
              {/* Add your edit fields here */}
              <TouchableOpacity
                className="bg-blue-500 py-2 rounded"
                onPress={() => setSettingsModal(null)}
              >
                <Text className="text-white text-center font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={settingsModal === "goal"}
          transparent
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-bold mb-4">
                Goal & Current Weight
              </Text>
              {/* Add your edit fields here */}
              <TouchableOpacity
                className="bg-blue-500 py-2 rounded"
                onPress={() => setSettingsModal(null)}
              >
                <Text className="text-white text-center font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={settingsModal === "language"}
          transparent
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-bold mb-4">Language</Text>
              {/* Add your edit fields here */}
              <TouchableOpacity
                className="bg-blue-500 py-2 rounded"
                onPress={() => setSettingsModal(null)}
              >
                <Text className="text-white text-center font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Preferences View */}
        <View className="mt-6 mb-6 bg-gray-50 rounded-3xl p-4 border border-gray-200 shadow-md">
          <View className="flex-row items-center align-center gap-4 mb-4">
            <View className="w-12 h-7 rounded-full bg-indigo-500 flex-row items-center px-1">
              <View
                className={`w-5 h-5 rounded-full bg-white ml-6`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                }}
              />
            </View>
            <Text className="text-lg font-bold mb-4 py-3 text-gray-800 border-b border-gray-200">
              Preferences
            </Text>
          </View>
          <PreferenceSwitch
            label="Add Burned Calories"
            value={burnedCaloriesEnabled}
            disk="Add Burned Calories to daily goals"
            onValueChange={setBurnedCaloriesEnabled}
            icon={<Ionicons name="flame-outline" size={26} color="#333" />}
          />
          <PreferenceSwitch
            label="Rollover Calories"
            value={rolloverCaloriesEnabled}
            disk="Rollover unused calories to the next day"
            onValueChange={setRolloverCaloriesEnabled}
            icon={
              <MaterialIcons
                name="swap-horizontal-circle"
                size={26}
                color="#333"
              />
            }
          />
          <PreferenceSwitch
            label="Enable Notifications"
            value={notificationsEnabled}
            disk="Enable notifications for daily reminders"
            onValueChange={setNotificationsEnabled}
            icon={
              <Ionicons name="notifications-outline" size={26} color="#333" />
            }
          />
        </View>
        {/* Terms & Support View */}
        <View className="mb-8 px-4 py-2 bg-white rounded-2xl shadow-md border-b border-l border-right border-gray-200">
          <Pressable
            className="py-4 border-b border-gray-200 flex-row items-center"
            onPress={() => router.push("/(modals)/terms")}
          >
            <Ionicons name="document-text-outline" size={26} color="#333" />
            <Text className="ml-4 text-xl font-semibold text-gray-700">
              Terms & Conditions
            </Text>
          </Pressable>
          <Pressable
            className="py-4 border-b border-gray-200 flex-row items-center"
            onPress={() => router.push("/(modals)/privacy-policy")}
          >
            <Ionicons name="shield-checkmark-outline" size={26} color="#333" />
            <Text className="ml-4 text-xl font-semibold text-gray-700">Privacy Policy</Text>
          </Pressable>
          <Pressable
            className="py-4 border-b border-gray-200 flex-row items-center"
            onPress={() => router.push("/(modals)/support")}
          >
            <MaterialIcons name="support-agent" size={26} color="#333" />
            <Text className="ml-4 text-xl font-semibold text-gray-700">Support Email</Text>
          </Pressable>
          <Pressable
            className="py-4 flex-row items-center"
            onPress={() => {
              // Add your delete account logic here
              setDeleteModalVisible(true);
            }}
          >
            <MaterialIcons name="delete-outline" size={26} color="#EF4444" />
            <Text className="ml-4 text-xl  text-red-600">Delete Account</Text>
          </Pressable>
        </View>

        {/* Delete Account Modal */}
        <Modal visible={deleteModalVisible} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-xl p-6 w-80">
              <Text className="text-lg font-bold mb-4 text-red-600">
                Delete Account
              </Text>
              <Text className="mb-4 text-gray-700">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </Text>
              <TouchableOpacity
                className="bg-red-500 py-2 rounded mb-2"
                onPress={() => {
                  // Add your delete account logic here
                  setDeleteModalVisible(false);
                }}
              >
                <Text className="text-white text-center font-bold">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2"
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text className="text-center text-gray-500">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Logout Button at Bottom */}
        <View className="mb-16">
          <TouchableOpacity
            className="bg-white px-8 py-6 rounded-2xl flex-row justify-start gap-4 shadow-md items-center align-center"
            onPress={handleLogout}
          >
            <Feather name="log-out" size={26} color="#333" />
            <Text className="text-gray-800 font-semibold text-xl text-center">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
/* (Removed duplicate PreferenceSwitch and stray state declarations) */
