import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "@/Localhost";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("screen").width;
export default function WishHairList() {
  const router = useRouter();
  const [wishList, setWishList] = useState<Array<WishList>>([]);
  const isFocused = useIsFocused();
  const { user } = useUser();
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
  interface WishList{
    id_tai_khoan: number;
    id_kieu_toc: number;
    kieu_toc: HairList;
  }
  const getHairList = async () => {
    if (user) {
      const response = await fetch(
        `${API_BASE_URL}/api/getFavoriteHairStyles/${user.id}`
      );
      const data = await response.json();
      setWishList(data.data);
    // console.log(data.data);
    }
  };
  useEffect(() => {
    if (isFocused) {
      getHairList();
    }
  }, [isFocused]);
  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <SafeAreaView>
        {
            wishList.length > 0 ? (
        <FlatList
        data={wishList}
                  keyExtractor={(item: WishList) => item.id_kieu_toc.toString()}
                  numColumns={2}
                  key={`flatlist-columns-2`}
                  renderItem={({ item }) => (
                    <View style={{ marginLeft: 10, marginTop: 10 }}>
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/hairDetail",
                            params: { item: JSON.stringify(item.kieu_toc) },
                          })
                        }
                        style={styles.cardContainer}
                      >
                        {/* <View > */}
                        {/* Ảnh dịch vụ */}
                        <View style={styles.imageContainer}>
                          <Image
                            source={item.kieu_toc.hinh_anh_kieu_toc[0].url_anh}
                            style={styles.image}
                          />
        
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
                            <Text style={styles.serviceName}>{item.kieu_toc.ten_kieu_toc}</Text>
                            <Text style={styles.serviceDetails}>{item.kieu_toc.gia_tien}</Text>
                          </View>
        
                          {/* Biểu tượng đặt lịch hẹn */}
                          <TouchableOpacity               
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

            ) : (
                <Text
                style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "#333",
                }}
                >Danh sách trống</Text>
            )
        }
      </SafeAreaView>
    </SafeAreaProvider>
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
