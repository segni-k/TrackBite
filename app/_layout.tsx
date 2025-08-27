// app/_layout.tsx
import '../global.css';
import { Slot } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Slot />
      </ProfileProvider>
    </AuthProvider>
  );
}
