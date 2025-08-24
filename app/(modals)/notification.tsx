import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type Notification = {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
};

const router = useRouter();

const notifications: Notification[] = [
    {
        id: '1',
        title: 'Welcome!',
        message: 'Thanks for joining TrackBite.',
        date: '2024-06-10',
        read: false,
    },
    {
        id: '2',
        title: 'New Feature',
        message: 'Check out our new tracking feature.',
        date: '2024-06-09',
        read: false,
    },
    {
        id: '3',
        title: 'Reminder',
        message: 'Don\'t forget to log your meals today!',
        date: '2024-06-08',
        read: false,
    },
    {
        id: '4',
        title: 'Weekly Summary',
        message: 'Your weekly progress report is ready.',
        date: '2024-06-07',
        read: false,
    },
    {
        id: '5',
        title: 'Update Available',
        message: 'A new app update is available. Download now!',
        date: '2024-06-06',
        read: false,
    },
    {
        id: '6',
        title: 'Goal Achieved!',
        message: 'Congratulations on reaching your goal!',
        date: '2024-06-05',
        read: true,
    },
    {
        id: '7',
        title: 'Tip of the Day',
        message: 'Stay hydrated for better results.',
        date: '2024-06-04',
        read: true,
    },
    {
        id: '8',
        title: 'Challenge Accepted',
        message: 'You have joined the June challenge!',
        date: '2024-06-03',
        read: true,
    },
    {
        id: '9',
        title: 'Friend Request',
        message: 'Alex sent you a friend request.',
        date: '2024-06-02',
        read: true,
    },
    {
        id: '10',
        title: 'Motivation',
        message: 'Keep pushing, you are doing great!',
        date: '2024-06-01',
        read: true,
    },
    {
        id: '11',
        title: 'Meal Logged',
        message: 'Your breakfast has been logged.',
        date: '2024-05-31',
        read: true,
    },
    {
        id: '12',
        title: 'Hydration Reminder',
        message: 'Drink a glass of water now.',
        date: '2024-05-30',
        read: true,
    },
    {
        id: '13',
        title: 'App Feedback',
        message: 'Let us know what you think about TrackBite.',
        date: '2024-05-29',
        read: true,
    },
    {
        id: '14',
        title: 'Progress Update',
        message: 'You are 80% to your monthly goal!',
        date: '2024-05-28',
        read: true,
    },
    {
        id: '15',
        title: 'New Badge',
        message: 'You earned the "Consistency" badge.',
        date: '2024-05-27',
        read: true,
    },
];

const NotificationItem = ({ notification, onPress }: { notification: Notification; onPress: () => void }) => (
    <>
    <TouchableOpacity className={`bg-gray-100 p-4 rounded-lg mb-3 ${!notification.read && 'border-l-4 border-blue-500 bg-blue-100'}`}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className='flex-row justify-between mb-1'>
            <Text className='text-base font-semibold'>{notification.title}</Text>
            <Text className='text-xs text-gray-500'>{notification.date}</Text>
        </View>
        <Text className='text-md text-gray-800'>{notification.message}</Text>
    </TouchableOpacity>
      <Text className='text-xs text-gray-500'>{notification.date}</Text>
    </>
    
);

const NotificationPage = () => {
    const handlePress = (id: string) => {
        // Mark notification as read
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1 && !notifications[index].read) {
            notifications[index].read = true;
        }
        // Navigation logic (example: navigate to details page)
        // Replace 'NotificationDetail' and params as needed for your app
        // import { useNavigation } from '@react-navigation/native' at the top
        // const navigation = useNavigation();
        // navigation.navigate('NotificationDetail', { notificationId: id });
    };
   // const styles = {
   //     container: tw`flex-1 bg-white p-4`,
    //    pageTitle: tw`text-2xl font-bold`,
    //    item: tw`bg-gray-100 p-4 rounded-lg mb-3`,
    //    unread: tw`border-l-4 border-blue-500`,
    //    header: tw`flex-row justify-between mb-1`,
    //    title: tw`text-base font-semibold`,
    //    date: tw`text-xs text-gray-500`,
    //    message: tw`text-sm text-gray-800`,
    //    empty: tw`text-center text-gray-500 mt-8 text-base`,
    //    backButton: tw`mr-2 p-2`,
    //    headerContainer: tw`flex-row items-center mb-4`,
   // };

    // Add go back icon in header
    // Place this inside the NotificationPage return, above the pageTitle:
    // <View style={styles.headerContainer}>
    //   <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
    //     <ArrowLeft size={24} color="#222" />
    //   </TouchableOpacity>
    //   <Text style={styles.pageTitle}>Notifications</Text>
    // </View>

    const handleGoBack = () => {
        // Use your navigation logic here
        router.back();
        // Example: navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-white py-4">
            <View className='flex-1 bg-white p-4'>
                <View className='flex-row items-center mb-4'>
                    <TouchableOpacity className='mr-2 p-2' onPress={handleGoBack}>
                        <ArrowLeft size={24} color="#222" />
                    </TouchableOpacity>
                <Text className='text-2xl font-bold'>Notifications</Text>
            </View>
            <FlatList
                contentContainerStyle={{ paddingBottom: 100, gap: 12 }}
                data={notifications}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationItem
                        notification={item}
                        onPress={() => handlePress(item.id)}
                    />
                )}
                ListEmptyComponent={<Text className='text-center text-gray-500 mt-8 text-xl'>No notifications yet.</Text>}
            />
        </View>
        </SafeAreaView>
    );
};





    

export default NotificationPage;