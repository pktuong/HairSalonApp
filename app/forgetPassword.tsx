import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { API_BASE_URL } from "@/Localhost";

export default function ForgetPassword() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [hashedOTP, setHashedOTP] = useState("");
  const [email, setEmail] = useState("");
  const handleOTPChange = (text: any) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue <= 10000) {
      setVerificationCode(numericValue);
    } else {
      Alert.alert("Cảnh báo", "Mã OTP chỉ chứa tối đa 4 ký tự.");
    }
  };

  const handleResendVerificationCode = () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    } else {
      //Kiểm tra định dạng email
      const emailValidation = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
      if (!emailValidation.test(email)) {
        Alert.alert("Lỗi", "Email không hợp lệ");
        return;
      }
      sendOTPVerifiEmail();
    }
  };

  const sendOTPVerifiEmail = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/authentication/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Lỗi", data.message || "Gửi mã OTP thất bại");
      } else {
        setHashedOTP(data.data.hashedOTP);
        setIsCountdownActive(true);
        setCountdown(60);
      }
      //   console.log("otp code: ", res.data.data.otp);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      // setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/authentication/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: verificationCode,
          hashedOTP: hashedOTP,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Lỗi", data.message || "Xác thực OTP thất bại");
      } else {
        Alert.alert("Thông báo", "Xác thực OTP thành công", [
          {
            text: "OK",
            onPress: () => {
              router.push(`/resetPassword?email=${email}`);
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    if (countdown === 0) {
      setIsCountdownActive(false);
    }
    return () => clearTimeout(timer);
  }, [isCountdownActive, countdown]);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity
            style={{
              // position: "absolute",
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: 50,
              width: 35,
              height: 35,
              marginTop: 5,
              marginLeft: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              marginTop: 100,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Quên mật khẩu
          </Text>
          <View
            style={{
              justifyContent: "center",
              marginTop: 80,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                marginLeft: 25,
                fontWeight: "400",
                color: "#fff",
              }}
            >
              Vui lòng xác thực tài khoản email
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ email của bạn"
              keyboardType="email-address"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 50,
                backgroundColor: "#fff",
                borderRadius: 25,
                paddingHorizontal: 5,
                marginVertical: 10,
                marginHorizontal: 20,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor: "#fff",
                  borderRadius: 25,
                  marginLeft: 10,
                  justifyContent: "space-between",
                  marginVertical: 10,
                  fontSize: 16,
                  color: "#000",
                }}
                placeholder="Nhập mã OTP trong email"
                keyboardType="numeric"
                placeholderTextColor="#ccc"
                value={verificationCode}
                onChangeText={handleOTPChange}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  isCountdownActive ? styles.disabledButton : null,
                ]}
                onPress={handleResendVerificationCode}
                disabled={isCountdownActive}
              >
                <Text style={styles.buttonText}>
                  {isCountdownActive
                    ? `Gửi lại sau ${countdown}s`
                    : "Gửi mã OTP"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "rgb(0, 80, 130)",
                padding: 15,
                borderRadius: 25,
                marginTop: 50,
                width: 200,
                alignSelf: "center",
              }}
              onPress={verifyOTP}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#249fd4",
  },
  input: {
    marginHorizontal: 20,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
    color: "#000",
  },

  button: {
    // width: "40%",
    backgroundColor: "#1e3799",
    borderRadius: 50,
    justifyContent: "center",
    // marginLeft: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});
