import { useState } from "react";
import { View, Text, Button, Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";
import { Ionicons } from "@expo/vector-icons";

export default function BirthDateScreen() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setProfile({ birthDate: selectedDate });
    setPickerVisible(false);
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-8 text-gray-700">When were you born?</Text>

      <Pressable
        onPress={() => setPickerVisible(true)}
        className=" p-3 bg-gray-200 rounded-lg w-2/3 items-center flex-row gap-2"
      >
        <Ionicons name="calendar-outline" size={24} color="blue" />
        <Text
          className={`text-bold text-blue-500 text-lg `}
        >
          Select Date({date ? date.toDateString() : "GC"})
        </Text>
      </Pressable>
      {date && <Text className="mt-4 text-lg">Selected: {date.toDateString()}</Text>}
      
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
      />

           <View className="flex-row items-center gap-9 mt-8">
             <Pressable
               onPress={() => router.back()}
               className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200" 
             >
               <Text
                 className={`text-semibold text-blue-500 text-lg `}
               >
                 Back
               </Text>
             </Pressable>
             <Pressable
               onPress={() => router.push("/(profile-setup)/activityLevel")}
               disabled={!date}
               className={` p-3 bg-gray-200 rounded-lg w-1/3 items-center ${!date ? "bg-gray-200" : "bg-green-500"} `}
             >
               <Text
                 className={`text-semibold text-lg ${!date ? "text-gray-400" : "text-white"}`}
               >
                 Next
               </Text>
             </Pressable>
           </View>
    </View>
  );
}
