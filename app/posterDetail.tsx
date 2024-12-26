import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function posterDetail() {
  const router = useRouter();
  const { poster } = useLocalSearchParams();
  const parsedItem = JSON.parse(Array.isArray(poster) ? poster[0] : poster);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              left: 5,
              zIndex: 1,
              padding: 1,
              borderRadius: 50,
            }}
            onPress={() => router.back()}
          >
            <Icon name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>
          {/* Hình ảnh bài đăng */}
          <Image
            source={{ uri: parsedItem.hinh_anh }}
            style={styles.image}
          />

          {/* Tiêu đề */}
          <View style={{ flex: 1 }}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{parsedItem.tieu_de}</Text>
              <Text style={styles.date}>
                Ngày đăng:{" "}
                {new Date(parsedItem.ngay_dang).toLocaleDateString("vi-VN")}
              </Text>
            </View>

            {/* Nội dung */}
            <View style={styles.textContainer}>
              <Text style={styles.content}>{parsedItem.noi_dung}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: screenWidth,
    aspectRatio: 16 / 9,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
