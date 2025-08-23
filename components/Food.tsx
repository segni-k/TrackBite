import React from 'react';
import { View, Text, Image } from 'react-native';


// components/Food.tsx

export type FoodProps = {
    emoji: string; // Use emoji instead of name
    image: string;
    calories: number;
    content: string;
    title: string;
};


const FoodComponent = ({ title, emoji, image, calories, content }: FoodProps) => (
    <View className="bg-stone-100 rounded-xl shadow-md m-3 flex-row items-center overflow-hidden items-center gap-3 shadow">
        <Image source={{ uri: image }} width={110} height={110} resizeMode='cover' className="rounded-xl" />
        <View className="flex-1 h-30 gap-3 ">
            <Text className="text-2xl text-gray-700 font-semibold">{title}</Text>

            <View className='flex-row items-center gap-2'>
             <Text className="text-2xl mb-1">{emoji}</Text>
             <Text className="text-3xl font-semibold text-gray-700 mb-1">{calories} kilo calories</Text>
            </View>
            <Text className="text-lg text-gray-700">{content}</Text>
        </View>
    </View>
);

export default FoodComponent;
