import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL } from "@/Localhost";

export default function ResetPassword() {
  const router = useRouter();
  const {email} = useLocalSearchParams<{email:string}>()
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordValidVisible, setPasswordValidVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState("");

  const isPasswordMatch = password === passwordValid;
  const changePassword = () => {
    if (!passwordValid || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return;
    }

    if (!isPasswordMatch) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    //Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    try {
        fetch(`${API_BASE_URL}/api/authentication/reset-password`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email: email,
            password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.message) {
                Alert.alert("Thông báo", data.message);
                router.push("/login")
            }
            });
        } catch (error) {
            console.error("Error:", error);
        }        
  };

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
              marginTop: 120,
              fontSize: 30,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Đặt lại mật khẩu
          </Text>
          <View
            style={{
              justifyContent: "center",
              marginTop: 50,
              alignContent: "center",
              marginHorizontal: 20,
            }}
          >
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
            <TouchableOpacity
              style={{
                backgroundColor: "rgb(0, 80, 130)",
                padding: 15,
                borderRadius: 25,
                marginTop: 50,
                width: 200,
                alignSelf: "center",
              }}
              onPress={() => changePassword()}
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
});
