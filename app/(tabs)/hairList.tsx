import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import HairCardItem from "@/components/HairCardItem";
import Icon from "react-native-vector-icons/Ionicons";
const Placeholder = require("../../assets/images/background-image.png");

import { Dropdown } from "react-native-element-dropdown";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "@/Localhost";
import { Dimensions } from "react-native";
import { Image } from "expo-image";

const screenWidth = Dimensions.get("window").width;
export default function HairList() {
  const router = useRouter();
  const {gioi_tinh} = useLocalSearchParams();
  const gioi_tinh_parse = Array.isArray(gioi_tinh) ? gioi_tinh[0] : gioi_tinh;
  const [hairList, setHairList] = useState<Array<HairList>>([]);
  interface HairList {
    id: number;
    ten_kieu_toc: string;
    gia_tien: string;
    mo_ta: string;
    gioi_tinh: string;
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

  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Đổi trạng thái
  };

  const isFocused = useIsFocused();
  const [timKiem, setTimKiem] = React.useState("");

  // const [hairList, setHairList] = useState<Array<object>>([]);
  const [gender, setGender] = useState("");

  const genderOptions = [
    { label: "Kiểu tóc nam", value: "male" },
    { label: "Kiểu tóc nữ", value: "female" },
  ];

  useEffect(() => {
    if (isFocused) {
      if(gioi_tinh_parse){
        setGender(gioi_tinh_parse);
      }
      // console.log("gioi_tinh: ", gioi_tinh_parse);
      getHairList();
    }
  }, [isFocused]);

  const getHairList = async () => {
    ///api/customers/getAllHairStyles
    const response = await fetch(
      `${API_BASE_URL}/api/customers/getAllHairStyles`
    );
    const data = await response.json();
    setHairList(data.data);
  };
  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <SafeAreaView>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.searchBar}>
                  <Icon name="search" size={20} color="#555" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiểu tóc..."
                    placeholderTextColor="#999"
                    value={timKiem}
                    onChangeText={(text) => setTimKiem(text)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.btnFaceScan}
                  onPress={() => router.push("/detectFace")}
                >
                  <Icon name="camera" size={20} color="#555" />
                  <Text style={{ fontSize: 12, fontWeight: "600" }}>
                    Nhận gợi ý
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                {/* Drop down box chọn kiểu tóc theo giới tính */}
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={genderOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn kiểu tóc"
                  value={gender}
                  onChange={(item) => setGender(item.value)}
                />
                {/* btn lọc */}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    marginRight: 10,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                >
                  <FontAwesome name="filter" size={20} color="#555" />
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: "red",
                      borderRadius: 10,
                      padding: 3,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      1
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          }
          data={hairList}
          keyExtractor={(item: HairList) => item.id.toString()}
          numColumns={2}
          key={`flatlist-columns-2`}
          renderItem={({ item }) => (
            <View style={{ marginLeft: 10, marginTop: 10 }}>
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
                  <Image
                    source={item.hinh_anh_kieu_toc[0].url_anh}
                    style={styles.image}
                  />

                  {/* Biểu tượng yêu thích */}
                  <TouchableOpacity
                    style={styles.iconHeart}
                    onPress={toggleFavorite}
                  >
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
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceName}>{item.ten_kieu_toc}</Text>
                    <Text style={styles.serviceDetails}>{item.gia_tien}</Text>
                  </View>

                  {/* Biểu tượng đặt lịch hẹn */}
                  <TouchableOpacity
                    // onPress={() => router.push("/bookAppt")}
                    //in ra thong tin cua kieu toc
                    onPress={() => {
                      console.log("Kieu toc: ", item);
                    }}
                    style={styles.iconBookingContainer}
                  >
                    <Icon name="calendar" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                {/* </View> */}
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  btnFaceScan: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },

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
