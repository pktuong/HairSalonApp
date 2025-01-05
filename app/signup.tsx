import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../Localhost";
import Icon from "react-native-vector-icons/Ionicons";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState("");
  const [ho_ten, setHoTen] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordValidVisible, setPasswordValidVisible] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [hashedOTP, setHashedOTP] = useState("");

  const isPasswordMatch = password === passwordValid;

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

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    if (!isPasswordMatch) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }
    //Kiểm tra định dạng email
    const emailValidation = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (!emailValidation.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    //Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      // URL của API
      const response = await fetch(
        `${API_BASE_URL}/api/authentication/customer-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ho_ten: ho_ten,
            email: email,
            mat_khau: password,
            otp: verificationCode,
            hashedOTP: hashedOTP,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // alert Đăng nhập thành công, ok thì chuyển sang home screen
        Alert.alert("Thông báo", "Đăng ký thành công", [
          {
            text: "OK",
            onPress: () => {
              router.push("/login");
            },
          },
        ]);
        console.log("Data:", data.data);
      } else {
        // Đăng nhập thất bại
        Alert.alert("Đăng kí thất bại", data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      Alert.alert("Lỗi", "Đăng ký thất bại");
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
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      <Image
        source={require("../assets/images/logo.svg")}
        style={{
          width: 100,
          height: 140,
          tintColor: "#fff",
          marginTop: -100,
          marginBottom: 20,
        }}
      />
      <Text style={{ color: "#fff", fontSize: 24, marginBottom: 50 }}>
        Đăng ký tài khoản
      </Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Họ tên"
        placeholderTextColor="#ccc"
        value={ho_ten}
        onChangeText={(text) => setHoTen(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={{ flex: 1, height: 50, fontSize: 16, color: "#000" }}
          placeholder="Mật khẩu"
          placeholderTextColor="#ccc"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!isPasswordVisible)} // Đảo ngược trạng thái
        >
          <Icon
            name={isPasswordVisible ? "eye-off" : "eye"} // Thay đổi icon theo trạng thái
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={{ flex: 1, height: 50, fontSize: 16, color: "#000" }}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#ccc"
          secureTextEntry={!isPasswordValidVisible}
          value={passwordValid}
          onChangeText={(text) => setPasswordValid(text)}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordValidVisible(!isPasswordValidVisible)} // Đảo ngược trạng thái
        >
          <Icon
            name={isPasswordValidVisible ? "eye-off" : "eye"} // Thay đổi icon theo trạng thái
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 50,
          backgroundColor: "#fff",
          borderRadius: 25,
          paddingHorizontal: 5,
          marginVertical: 10,
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
            {isCountdownActive ? `Gửi lại sau ${countdown}s` : "Gửi mã OTP"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
        <Text style={styles.loginText}>ĐĂNG KÝ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#249fd4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#1e3799",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
  signUpText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  orText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 10,
  },
  socialLoginText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  icon: {
    backgroundColor: "#fff",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  list_items: {
    marginVertical: 1,
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
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
