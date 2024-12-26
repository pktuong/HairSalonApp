import { useBooking } from "@/context/BookingContext";
import { useUser } from "@/context/UserContext";
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
  gia_tien: number;
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
  const { user, setUser } = useUser();
  const { booking, setBooking } = useBooking();

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
          <Text style={styles.serviceName}>{ten_kieu_toc}</Text>
          <Text style={styles.serviceDetails}>{gia_tien}</Text>
        </View>

        {/* Biểu tượng đặt lịch hẹn */}
        <TouchableOpacity
          // onPress={() => router.push("/bookAppt")}
          //in ra thong tin cua kieu toc
          onPress={() => {
            if (user === null) {
              router.push("/login");
            } else {
              if (booking) {
                // Tạo bản sao của chi_tiet_phieu_dat
                const updatedChiTietPhieuDat = [
                  ...booking.chi_tiet_phieu_dat,
                ];
                // Cập nhật kiểu tóc cho phần tử đầu tiên
                if (updatedChiTietPhieuDat[0]) {
                  updatedChiTietPhieuDat[0] = {
                    ...updatedChiTietPhieuDat[0], // Giữ nguyên các thuộc tính khác
                    kieu_toc: {
                      id_kieu_toc: item.id, // Cập nhật id kiểu tóc
                      ten_kieu_toc: item.ten_kieu_toc,
                      gia: Number(item.gia_tien),
                      hinh_anh: item.hinh_anh_kieu_toc[0].url_anh,
                    }, // Cập nhật kieu_toc
                  };
                }
                // Cập nhật lại booking với chi_tiet_phieu_dat mới
                setBooking({
                  ...booking, // Giữ nguyên các thuộc tính khác của booking
                  chi_tiet_phieu_dat: updatedChiTietPhieuDat, // Gán chi_tiet_phieu_dat mới
                });
              } else {
                const now = new Date();
                const today = new Date(
                  now.getTime() + 7 * 60 * 60 * 1000
                );

                const tomorow = new Date();
                tomorow.setDate(tomorow.getDate() + 1);
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
