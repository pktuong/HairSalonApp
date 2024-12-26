import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/Localhost";
import { useUser } from "@/context/UserContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const logOut = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logout`, {
        method: "GET",
      });
      if (response.ok) {
        router.push("/login");
        setUser(null);
      }
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {user ? (
        <>
          <View style={styles.header}>
            <Image
              style={styles.avatar}
              source={{ uri: user.anh_dai_dien }} // Thay bằng link ảnh thật
            />
            <Text style={styles.name}>{user.ho_ten}</Text>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={20} color="gray" />
              <Text style={styles.contactText}>Số lần vi phạm:{user.so_lan_vi_pham}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={20} color="gray" />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              marginTop: 60,
              marginBottom: 20,
            }}
          >
            Bạn chưa đăng nhập
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              router.push("/login");
            }}
          >
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Wallet and Orders Section */}
      {/* <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>$140.00</Text>
          <Text style={styles.statsLabel}>Wallet</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>12</Text>
          <Text style={styles.statsLabel}>Orders</Text>
        </View>
      </View> */}

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
        onPress={() => {
          if (user === null) {
            router.push("/login");
          } else {
            router.push("/wishHairList");
          }
        }}
        style={styles.menuItem}>
          <FontAwesome5 name="heart" size={20} color="#555" />
          <Text style={styles.menuText}>Danh sách yêu thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome5 name="credit-card" size={20} color="#555" />
          <Text style={styles.menuText}>Phương thức thanh toán</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={20} color="#555" />
          <Text style={styles.menuText}>Cập nhật thông tin tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="local-offer" size={20} color="#555" />
          <Text style={styles.menuText}>Khuyến mãi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={20} color="#555" />
          <Text style={styles.menuText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Option */}
      {
        //Nếu user null thì không hiển thị nút logout
        user && (
          <TouchableOpacity onPress={logOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
          )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  job: {
    fontSize: 14,
    color: "gray",
  },
  contactInfo: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
    color: "gray",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statsBox: {
    alignItems: "center",
  },
  statsValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 14,
    color: "gray",
  },
  menuContainer: {
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "red",
  },
  loginButton: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 120,
    backgroundColor: "#267cde",
    marginBottom: 50,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
