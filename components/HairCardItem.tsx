import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// [{"createdAt": null, "gia_tien": "150000", "gioi_tinh": "Nam", "hinh_anh_kieu_toc": [[Object], [Object], [Object]],
//  "id": 1, "kieu_toc_phu_hop": [[Object], [Object]], "mo_ta": "Kiểu tóc dài hiện đại", 
// "ten_kieu_toc": "Tóc dài", "updatedAt": "2024-11-28T08:13:31.000Z"},

interface HairCardItemProps {
  id: number;
  ten_kieu_toc: string;
  gia_tien: string;
  mo_ta: string;
  gioi_tinh: string;
  thoi_luong: number;
  hinh_anh_kieu_toc: {
    id: number;
    id_kieu_toc: number;
    url_anh: string;
    createdAt: string | null;
    updatedAt: string | null;
  }[];
  kieu_toc_phu_hop: {
    id: number;
    id_kieu_khuon_mat: number;
    id_kieu_toc: number;
    createdAt: string | null;
    updatedAt: string | null;
    kieu_khuon_mat_phu_hop: {
      id: number;
      kieu_khuon_mat: string;
      hinh_anh: string;
      createdAt: string | null;
      updatedAt: string | null;
    };
  }[];
}


const screenWidth = Dimensions.get("window").width;

export default function HairCardItem({
  id,
  ten_kieu_toc,
  gia_tien,
  mo_ta,
  thoi_luong,
  gioi_tinh,
  hinh_anh_kieu_toc,
  kieu_toc_phu_hop,
}: HairCardItemProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Đổi trạng thái
  };
  const item = {
    id,
    ten_kieu_toc,
    gia_tien,
    mo_ta,
    thoi_luong,
    hinh_anh_kieu_toc,
    gioi_tinh,
    // rating,
    kieu_toc_phu_hop,    
  };
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/hairDetail",
          params: { item: JSON.stringify(item) },
        })
      }
      style={styles.cardContainer}
    >
      {/* <View > */}
      {/* Ảnh dịch vụ */}
      <View style={styles.imageContainer}>
        <Image source={hinh_anh_kieu_toc[0].url_anh} style={styles.image} />

        {/* Biểu tượng yêu thích */}
        <TouchableOpacity style={styles.iconHeart} onPress={toggleFavorite}>
          <Icon
            name={isFavorite ? "heart" : "heart-outline"} // Thay đổi icon
            size={20}
            color={isFavorite ? "#ff4d4d" : "#fff"} // Màu đỏ khi đã yêu thích
          />
        </TouchableOpacity>

        {/* Đánh giá */}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            {/* {rating} */}
            4.3
            <Text style={{ fontSize: 12, color: "#fff" }}>/5</Text>
          </Text>
        </View>
      </View>

      {/* Tên và thông tin dịch vụ */}
      <View style={styles.infoContainer}>
        <View style={{ flex:1}}>
          <Text style={styles.serviceName}>{ten_kieu_toc}</Text>
          <Text style={styles.serviceDetails}>{gia_tien}</Text>
        </View>

        {/* Biểu tượng đặt lịch hẹn */}
        <TouchableOpacity
          // onPress={() => router.push("/bookAppt")}
          //in ra thong tin cua kieu toc
          onPress={() => {
            router.push("/bookAppt")}}
          style={styles.iconBookingContainer}
        >
          <Icon name="calendar" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: screenWidth / 2 - 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 15,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
  },
  iconHeart: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 15,
  },
  ratingContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
  },
  infoContainer: {
    flexDirection: "row",
    margin: 5,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    // marginBottom: 5,
  },
  serviceDetails: {
    fontSize: 14,
    color: "#999",
  },
  iconBookingContainer: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 20,
  },
});
