import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome, AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../Localhost";
import { useUser } from "@/context/UserContext";
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { user, setUser } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      // URL của API
      const response = await fetch(
        `${API_BASE_URL}/api/authentication/customer-sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            mat_khau: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // alert Đăng nhập thành công, ok thì chuyển sang home screen
        setUser(data.data);
        Alert.alert("Thông báo", "Đăng nhập thành công", [
          {
            text: "OK",
            onPress: () => {
              router.push("/");
            },
          },
        ]);
      } else {
        // Đăng nhập thất bại
        Alert.alert("Lỗi", data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server");
    }
  };

  const handleSignUp = () => {
    Alert.alert("Sign up pressed!");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={styles.backButton}
        >
            <Ionicons name="arrow-back" size={24} color="black" />
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
          Đăng nhập
        </Text>

        {/* Inputs */}
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
        {/* Forgot Password */}
        <TouchableOpacity
          style={{
            borderColor: "rgb(255, 255, 255)",
            borderRadius: 50,
            borderWidth: 1,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignSelf: "flex-end",
            marginRight: 10,
          }}
          onPress={() => router.push("/forgetPassword")}
        >
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Nếu bạn chưa có tài khoản? </Text>
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: "rgb(0, 99, 112)" }]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.loginText}>ĐĂNG KÝ</Text>
        </TouchableOpacity>

        {/* Social Login */}
        {/* <Text style={styles.orText}>Hoặc</Text>
      <Text style={styles.socialLoginText}>Đăng nhập với tài khoản</Text>
      <View style={styles.socialIcons}>
        <TouchableOpacity style={styles.icon}>
          <FontAwesome name="facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <AntDesign name="google" size={24} color="#db4a39" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <AntDesign name="twitter" size={24} color="#1da1f2" />
        </TouchableOpacity>
      </View> */}
      </SafeAreaView>
    </SafeAreaProvider>
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
    top: 30,
    left: 5,    
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    
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
  
  eyeIcon: {
    padding: 5,
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
  loginButton: {
    // width: "100%",
    paddingHorizontal: 50,
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
    marginVertical: 20,
  },
  footerText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 16,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});
