import { Image } from "expo-image";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Dimensions, TouchableOpacity } from "react-native";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect, Key } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function HairDetail() {
  const router = useRouter();
  // const { name, price, description, rating } = useGlobalSearchParams();
  const { item } = useLocalSearchParams();
  const parsedItem = JSON.parse(Array.isArray(item) ? item[0] : item);
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Đổi trạng thái
  };

  const images = parsedItem.hinh_anh_kieu_toc.map((image: any) => ({
    uri: image.url_anh,
  }));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <>
    <ScrollView>
      <Stack.Screen options={{ headerShown: false }}></Stack.Screen>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 25,
            left: 5,
            zIndex: 1,
            padding: 1,
            borderRadius: 50,
          }}
          onPress={() => router.back()}
        >
          <Icon name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Hiển thị hình ảnh */}
        <View style={{ flexDirection: "row" }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
          >
            {images.map((image: any, index: Key | null | undefined) => (
              <Image key={index} source={image} style={styles.imageSlider} />
            ))}
          </ScrollView>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>

        {/* Giá kiểu tóc */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingTop: 5,
          }}
        >
          <Text style={styles.hairPriceText}>{parsedItem.gia_tien}</Text>

          {/* Nút thêm vào yêu thích */}
          <TouchableOpacity style={styles.iconHeart} onPress={toggleFavorite}>
            <Icon
              name={isFavorite ? "heart" : "heart-outline"} // Thay đổi icon
              size={25}
              color={isFavorite ? "#ff4d4d" : "gray"} // Màu đỏ khi đã yêu thích
            />
          </TouchableOpacity>
        </View>

        {/* Tên kiểu tóc */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
          {parsedItem.ten_kieu_toc}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
          <Icon name="time" size={20} color="#555" />
          <Text style={{ fontSize: 15, color: "#555" }}> {parsedItem.thoi_luong} phút</Text>
        </View>

        {/* Mô tả kiểu tóc */}
        <Text style={{ fontSize: 16, color: "#555", margin: 10 }}>
          {parsedItem.mo_ta}
        </Text>
        <Text style={{ fontSize: 16, color: "#555", margin: 10 }}>
          {parsedItem.description}
        </Text>
        <Text style={{ fontSize: 16, color: "#555", margin: 10 }}>
          {parsedItem.description}
        </Text>
        <Text style={{ fontSize: 16, color: "#555", margin: 10 }}>
          {parsedItem.description}
        </Text>
        <Text style={{ fontSize: 16, color: "#555", margin: 10 }}>
          {parsedItem.description}
        </Text>

        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            {/* {parsedItem.rating} */}4.3
            <Text style={{ fontSize: 15, color: "#555" }}>/5</Text>
          </Text>
          <Icon name="chevron-forward" size={20} color="#555" />
        </View>


      </View>
      
    </ScrollView>
    <TouchableOpacity
    style={{
      backgroundColor: "red",
      padding: 10,
      borderRadius: 10,
      alignItems: "center",
      position: "absolute",
      bottom: 10,
      left: 10,
      right: 10,     
    }}
    onPress={() => router.push("/bookAppt")}
  >
    <Text style={{ color: "#fff", fontSize: 18 }}>Thêm vào lịch hẹn</Text>
  </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSlider: {
    width: width,
    height: 250,
  },
  counterContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 5,
  },
  counterText: {
    color: "white",
    fontSize: 14,
  },
  hairPriceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    flex: 1,
    textAlign: "left",
  },
  iconHeart: {
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom:70,
  },
  ratingText: {
    color: "#555",
    marginLeft: 4,
    fontSize: 15,
  },
});
