// context/ProfileContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type Profile = {
  name?: string;
  gender?: string;
  height?: number;
  weight?: number;
  birthDate?: Date;
  activityLevel?: string;
  goal?: string;
};

type ProfileContextType = {
  profile: Profile;
  setProfile: (data: Partial<Profile>) => void;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: {},
  setProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<Profile>({});

  const setProfile = (data: Partial<Profile>) =>
    setProfileState((prev) => ({ ...prev, ...data }));

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
