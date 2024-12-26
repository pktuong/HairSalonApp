import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../Localhost";
import { useUser } from "@/context/UserContext";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user,setUser } = useUser();
  

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }
    
    try {
      // URL của API
      const response = await fetch(`${API_BASE_URL}/api/authentication/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          mat_khau: password,
        }),
      });

      const data = await response.json();

      setUser(data.data);

      if (response.ok) {
        // alert Đăng nhập thành công, ok thì chuyển sang home screen
        Alert.alert("Thông báo", "Đăng nhập thành công", [
          {
            text: "OK",
            onPress: () => {
              router.push("/");

            },
          },
        ]
        );
        // Lưu token hoặc điều hướng tới màn hình tiếp theo
        // console.log("Data:", data.data);
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
        style={{ width: 100, height: 140, tintColor: "#fff", marginTop: -100, marginBottom: 20 }}
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
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật Khẩu"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />

      {/* Login Button */}
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Nếu bạn chưa có tài khoản? </Text>
        <TouchableOpacity 
        onPress = {() => router.push("/signup")}
        >
          <Text style={styles.signUpText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

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
});
