import React, { JSX, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const auth = getAuth(); // use the default initialized Firebase app's Auth instance

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordScreen(): JSX.Element {
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState<number>(0);

    // Debounced validation
    useEffect(() => {
        const id = setTimeout(() => {
            setIsValidEmail(EMAIL_RE.test(email.trim()));
        }, 250);
        return () => clearTimeout(id);
    }, [email]);

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => {
            setCooldown((s) => {
                if (s <= 1) {
                    clearInterval(t);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const friendlyError = (code: string) => {
        switch (code) {
            case "auth/user-not-found":
                return "No account exists with that email.";
            case "auth/invalid-email":
                return "That email address is invalid.";
            case "auth/too-many-requests":
                return "Too many attempts. Try again later.";
            default:
                return "Unable to send reset email. Please try again.";
        }
    };

    const handleSubmit = async () => {
        setTouched(true);
        setMessage(null);
        setError(null);

        if (!isValidEmail) {
            setError("Enter a valid email address.");
            return;
        }
        if (cooldown > 0) {
            setError(`Please wait ${cooldown}s before resending.`);
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setMessage("If an account exists for that email, a reset link has been sent.");
            setCooldown(RESEND_COOLDOWN_SECONDS);
            setError(null);
        } catch (err: any) {
            const code = err?.code ?? "";
            setError(friendlyError(code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1"
            style={{ backgroundColor: "#071129" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 p-6 justify-center">
                    <View
                        className="mx-2 p-6 rounded-2xl"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.03)",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.06)",
                            shadowColor: "#000",
                            shadowOpacity: 0.4,
                            shadowRadius: 10,
                            elevation: 6,
                        }}
                        accessible
                        accessibilityRole="summary"
                    >
                        <Text className="text-white text-[20px] font-semibold mb-1">Reset your password</Text>
                        <Text className="text-[#bcd2ff] text-[13px] opacity-90 mb-4">
                            Enter the email associated with your account and we'll send a secure link to reset your password.
                        </Text>

                        <View className="mb-2">
                            <Text className="text-[#cfe0ff] text-[12px] mb-2">Email</Text>
                            <TextInput
                                className={`bg-[rgba(8,12,20,0.6)] text-[#e9f2ff] py-3 px-4 rounded-xl border ${
                                    touched && !isValidEmail ? "border-red-400" : "border-[rgba(255,255,255,0.06)]"
                                } text-[14px]`}
                                value={email}
                                onChangeText={setEmail}
                                onBlur={() => setTouched(true)}
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="you@company.com"
                                placeholderTextColor="#9fb3ff88"
                                editable={!loading}
                                accessibilityLabel="Email"
                                accessibilityHint="Enter the email used for your account"
                            />
                            <Text className="text-[#9fb3ff] text-[12px] mt-2 mb-2">
                                {touched && !isValidEmail ? "Please provide a valid email address." : "We'll send a password reset link to this address."}
                            </Text>

                            <TouchableOpacity
                                className={`flex-row items-center justify-center bg-[#3b82f6] py-3 rounded-xl ${loading || !isValidEmail || cooldown > 0 ? "opacity-60" : ""}`}
                                onPress={handleSubmit}
                                activeOpacity={0.9}
                                disabled={loading || !isValidEmail || cooldown > 0}
                                accessibilityRole="button"
                                accessibilityState={{ disabled: loading || !isValidEmail || cooldown > 0 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-extrabold text-[14px]">Send reset link</Text>
                                )}
                                {cooldown > 0 && <Text className="text-white ml-2 text-[13px]">— {cooldown}s</Text>}
                            </TouchableOpacity>
                        </View>

                        <View className="mt-4 min-h-[40px]" accessibilityLiveRegion="polite">
                            {message ? (
                                <Text
                                    className="py-2 px-3 rounded-md text-[13px]"
                                    style={{
                                        backgroundColor: "rgba(34,197,94,0.12)",
                                        color: "#b7ffd9",
                                        borderWidth: 1,
                                        borderColor: "rgba(34,197,94,0.15)",
                                    }}
                                >
                                    {message}
                                </Text>
                            ) : null}
                            {error ? (
                                <Text
                                    className="py-2 px-3 rounded-md text-[13px]"
                                    style={{
                                        backgroundColor: "rgba(255,85,85,0.08)",
                                        color: "#ffd4d4",
                                        borderWidth: 1,
                                        borderColor: "rgba(255,85,85,0.12)",
                                    }}
                                >
                                    {error}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
