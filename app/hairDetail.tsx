import { Image } from "expo-image";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect, Key } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "@/context/UserContext";
import { API_BASE_URL } from "@/Localhost";
import { useIsFocused } from "@react-navigation/native";
import { useBooking } from "@/context/BookingContext";
const { width } = Dimensions.get("window");

export default function HairDetail() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const { booking, setBooking } = useBooking();
  const { idHair } = useLocalSearchParams<{ idHair: string }>();
  // const parsedId = JSON.parse(Array.isArray(idHair) ? idHair[0] : idHair);
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const [hairDetail, setHairDetail] = useState<HairDetail | null>(null);
  const [rating, setRating] = useState(0);
  const isFocused = useIsFocused();

  // const images = parsedItem.hinh_anh_kieu_toc.map((image: any) => ({
  //   uri: image.url_anh,
  // }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentIndex(index);
  };

  type HairDetail = {
    id: number;
    ten_kieu_toc: string;
    gioi_tinh: string;
    mo_ta: string;
    thoi_luong: number;
    gia_tien: string;
    hinh_anh_kieu_toc: {
      id: number;
      url_anh: string;
    }[];
    danh_gia_kieu_toc: {
      id: number;
      muc_do_hai_long: number;
      phan_hoi: string;
      createdAt: string | null;
      TaiKhoanDanhGia: {
        id: number;
        ho_ten: string;
        anh_dai_dien: string;
      };
    }[];
    kieu_toc_phu_hop: {
      id_kieu_khuon_mat: number;
      kieu_khuon_mat_phu_hop: {
        kieu_khuon_mat: string;
        hinh_anh: string;
      };
    }[];
  };

  const getHairStyle = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/customers/getHairStyleById/${idHair}`
    );
    const data = await response.json();
    setHairDetail(data.data);
    // tính trung bình cộng muc_do_hai_long
    let avgRating = 0;
    avgRating =
      data.data.danh_gia_kieu_toc.reduce(
        (sum: number, { muc_do_hai_long }: { muc_do_hai_long: number }) =>
          sum + muc_do_hai_long,
        0
      ) / data.data.danh_gia_kieu_toc.length;
    if (isNaN(avgRating)) {
      avgRating = 0;
    }
    setRating(avgRating);
  };

  const checkFavorite = async () => {
    if (user) {
      const response = await fetch(
        `${API_BASE_URL}/api/checkFavoriteHairStyle?id_tai_khoan=${user.id}&id_kieu_toc=${idHair}`
      );
      const data = await response.json();
      setIsFavorite(data.isExisted);
    }
  };
  const deleteFavorite = async () => {
    if (user) {
      await fetch(`${API_BASE_URL}/api/deleteFavoriteHairStyle`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_tai_khoan: user.id,
          id_kieu_toc: idHair,
        }),
      });
    }
  };
  const addFavorite = async () => {
    if (user) {
      await fetch(`${API_BASE_URL}/api/addFavoriteHairStyle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_tai_khoan: user.id,
          id_kieu_toc: idHair,
        }),
      });
    }
  };

  const formatPrice = (price: string) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    if (isFocused) {
      getHairStyle();
      checkFavorite();
    }
  }, [isFocused]);

  return hairDetail != null ? (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginBottom: 50 }}>
        <Stack.Screen options={{ headerShown: false }}></Stack.Screen>
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 25,
              left: 5,
              zIndex: 1,
              borderRadius: 50,
              alignItems: "baseline",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onPress={() => router.back()}
          >
            <Icon
              name="chevron-back"
              style={{ padding: 3 }}
              size={30}
              color="#fff"
            />
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
              {hairDetail.hinh_anh_kieu_toc.map(
                (image: any, index: Key | null | undefined) => (
                  <Image
                    contentFit="scale-down"
                    key={index}
                    source={{ uri: image.url_anh }}
                    style={styles.imageSlider}
                  />
                )
              )}
            </ScrollView>
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {currentIndex + 1} / {hairDetail.hinh_anh_kieu_toc.length}
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: "#fff" }}>
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
              <Text style={styles.hairPriceText}>
                {formatPrice(hairDetail.gia_tien)} đ
              </Text>
              {user ? (
                <TouchableOpacity
                  style={styles.iconHeart}
                  onPress={() => {
                    if (isFavorite) {
                      deleteFavorite();
                    } else {
                      addFavorite();
                    }
                    setIsFavorite(!isFavorite);
                  }}
                >
                  <Icon
                    name={isFavorite ? "heart" : "heart-outline"} // Thay đổi icon
                    size={25}
                    color={isFavorite ? "#ff4d4d" : "gray"} // Màu đỏ khi đã yêu thích
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Tên kiểu tóc */}
            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
              {hairDetail!.ten_kieu_toc}
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 10 }}
            >
              <Icon name="time" size={20} color="#555" />
              <Text style={{ fontSize: 15, color: "#555" }}>
                {" "}
                {hairDetail.thoi_luong} phút
              </Text>
            </View>

            {/* Mô tả kiểu tóc */}
            <View style={{ minHeight: 350 }}>
              <Text style={{ fontSize: 16, color: "#555", margin: 10 }}>
                {hairDetail.mo_ta}
              </Text>
              <Text style={{ fontSize: 16, color: "#555", margin: 10 }}>
                Kiểu khuôn mặt được gợi ý:
                {hairDetail.kieu_toc_phu_hop.map(
                  (item: any, index: Key | null | undefined) => (
                    <Text key={index} style={{ fontSize: 16, color: "#555" }}>
                      {" "}
                      {item.kieu_khuon_mat_phu_hop.kieu_khuon_mat}
                    </Text>
                  )
                )}
              </Text>
            </View>
          </View>

          {rating != 0 ? (
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { fontSize: 16 }]}>
                Mức độ hài lòng:{" "}
              </Text>
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              <Icon name="star" size={20} color="#FFD700" />
            </View>
          ) : (
            <View style={styles.ratingContainer}>
              <Icon name="star-outline" size={20} color="#FFD700" />
              <Text style={[styles.ratingText, { fontSize: 16 }]}>
                Chưa có đánh giá
              </Text>
            </View>
          )}

          {/* danh_gia_kieu_toc */}
          <View style={{}}>
            {hairDetail.danh_gia_kieu_toc.map(
              (item: any, index: Key | null | undefined) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 5,
                    backgroundColor: "#f9f9f9",
                    padding: 10,
                  }}
                >
                  <Image
                    source={{ uri: item.TaiKhoanDanhGia.anh_dai_dien }}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, color: "#555" }}>
                      {item.TaiKhoanDanhGia.ho_ten}
                    </Text>
                    <Text style={{ fontSize: 10, color: "#555" }}>
                      {/* chuyển creatAt từ 2024-12-27T05:11:02.000Z sang ngày giờ  */}
                      {new Date(item.createdAt!).toLocaleString()}
                    </Text>
                    {/* Hiển thị số sao theo muc_do_hai_long */}
                    <View style={{ flexDirection: "row" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name="star"
                          size={16}
                          color={
                            star <= item.muc_do_hai_long ? "#FFD700" : "#555"
                          }
                        />
                      ))}
                    </View>

                    <Text style={{ fontSize: 14, color: "#555" }}>
                      {item.phan_hoi}
                    </Text>
                  </View>
                </View>
              )
            )}
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
        onPress={
          // Kiểm tra nếu user null thì chuyển hướng đến trang đăng nhập
          () => {
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
                      id_kieu_toc: hairDetail.id,
                      ten_kieu_toc: hairDetail.ten_kieu_toc,
                      gia: Number(hairDetail.gia_tien),
                      hinh_anh: hairDetail.hinh_anh_kieu_toc[0].url_anh,
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
          }
        }
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Thêm vào lịch hẹn</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View></View>
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
    // borderRadius: 12,
    marginTop: 10,
    backgroundColor: "rgb(255, 255, 255)",
  },
  ratingText: {
    color: "#000",
    marginLeft: 4,
    fontSize: 20,
    fontWeight: "bold",
    textAlignVertical: "bottom",
  },
});
