import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",  // 👈 all screens in (modal) open as modals
        headerShown: false,     // or true if you want headers
        animation: "slide_from_bottom", // iOS style
        gestureEnabled: true,   // enable swipe to close on iOS
        gestureDirection: "vertical", // swipe down to close on iOS
      }}
    />
  );
}
