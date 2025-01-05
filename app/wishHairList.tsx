import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "@/Localhost";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/Ionicons";
import HairCardItem from "@/components/HairCardItem";
import { useBooking } from "@/context/BookingContext";

const screenWidth = Dimensions.get("screen").width;
export default function WishHairList() {
  const router = useRouter();
  const { booking, setBooking } = useBooking();
  const [wishList, setWishList] = useState<Array<WishList>>([]);
  const isFocused = useIsFocused();
  const { user } = useUser();
  interface HairList {
    id: number;
    ten_kieu_toc: string;
    gia_tien: string;
    mo_ta: string;
    thoi_luong: number;
    gioi_tinh: string;
    danh_gia_kieu_toc: {
      id: number;
      id_khach_hang: number;
      id_kieu_toc: number;
      id_chi_tiet_phieu_dat: number;
      muc_do_hai_long: number;
      phan_hoi: string;
      createdAt: string | null;
      updatedAt: string | null;
    }[];
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
  interface WishList {
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
        {wishList.length > 0 ? (
          <FlatList
            data={wishList}
            keyExtractor={(item: WishList) => item.id_kieu_toc.toString()}
            numColumns={2}
            key={`flatlist-columns-2`}
            renderItem={({ item }) => (
              <View style={{ marginLeft: 10, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/hairDetail?idHair=${item.id_kieu_toc}`)
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
                      {item.kieu_toc.danh_gia_kieu_toc.length === 0 ? (
                        <Icon name="star-outline" size={16} color="#FFD700" />
                      ) : (
                        <>
                          <Icon name="star" size={16} color="#FFD700" />
                          <Text style={styles.ratingText}>
                            {(
                              item.kieu_toc.danh_gia_kieu_toc.reduce(
                                (total, current) =>
                                  total + current.muc_do_hai_long,
                                0
                              ) / item.kieu_toc.danh_gia_kieu_toc.length
                            ).toFixed(1)}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>

                  {/* Tên và thông tin dịch vụ */}
                  <View style={styles.infoContainer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceName}>
                        {item.kieu_toc.ten_kieu_toc}
                      </Text>
                      <Text style={styles.serviceDetails}>
                        {item.kieu_toc.gia_tien}
                      </Text>
                    </View>

                    {/* Biểu tượng đặt lịch hẹn */}
                    <TouchableOpacity
                      onPress={() => {
                        if (user === null) {
                          router.push("/login");
                        } else if (user.trang_thai_tai_khoan == "Bị khóa") {
                          Alert.alert(
                            "Cảnh báo",
                            "Tài khoản bạn đã bị khóa chức năng đặt lịch hẹn do vi phạm nhiều lần"
                          );
                        } else {
                          if (booking) {
                            // Tạo bản sao của chi_tiet_phieu_dat
                            const updatedChiTietPhieuDat = [
                              ...booking.chi_tiet_phieu_dat,
                            ];
                            // Cập nhật kiểu tóc cho phần tử cuối cùng
                            if (updatedChiTietPhieuDat[updatedChiTietPhieuDat.length - 1]) {
                              updatedChiTietPhieuDat[updatedChiTietPhieuDat.length - 1] = {
                                ...updatedChiTietPhieuDat[updatedChiTietPhieuDat.length - 1], // Giữ nguyên các thuộc tính khác
                                kieu_toc: {
                                  id_kieu_toc: item.kieu_toc.id, // Cập nhật id kiểu tóc
                                  ten_kieu_toc: item.kieu_toc.ten_kieu_toc,
                                  gia: Number(item.kieu_toc.gia_tien),
                                  hinh_anh: item.kieu_toc.hinh_anh_kieu_toc[0].url_anh,
                                }, // Cập nhật kiểu tóc mới
                              };
                            }
                            
                            // Cập nhật lại booking với chi_tiet_phieu_dat mới
                            setBooking({
                              ...booking, // Giữ nguyên các thuộc tính khác của booking
                              chi_tiet_phieu_dat: updatedChiTietPhieuDat, // Gán chi_tiet_phieu_dat mới
                            });
                          } else {
                            const now = new Date();
                            const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);
          
                            const tomorow = new Date();
                            tomorow.setDate(tomorow.getDate());
                            const data = {
                              id_tai_khoan: user.id,
                              ngay_hen: tomorow,
                              gio_hen: "",
                              phuong_thuc_thanh_toan: "Tiền mặt",
                              tong_tien: 0,
                              thoi_gian_dat: today,
                              chi_tiet_phieu_dat: [
                                {
                                  ten_khach_hang: user.ho_ten,
                                  kieu_toc: {
                                    id_kieu_toc: 0,
                                    ten_kieu_toc: "",
                                    gia: 0,
                                    hinh_anh: "",
                                  },
                                  dich_vu: [
                                    {
                                      id_dich_vu: 0,
                                      ten_dich_vu: "",
                                      phi_dich_vu: 0,
                                    },
                                  ],
                                },
                              ],
                            };
                            setBooking(data);
                          }
                          router.push("/bookAppt");
                        }
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
        ) : (
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 18,
              fontStyle: "italic",
              color: "#333",
            }}
          >
            Danh sách trống
          </Text>
        )}
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
    borderRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 190,
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
