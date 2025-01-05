import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "@/Localhost";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

export default function AboutScreen() {
  const [trangThaiChon, setTrangThaiChon] = useState<string>("Đã đặt");
  const router = useRouter();
  const { user } = useUser();
  const isFocused = useIsFocused();
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);
  const [danhSachGoc, setDanhSachGoc] = useState<LichHen[]>([]);
  const [timKiem, setTimKiem] = useState("");
  const [isAscending, setIsAscending] = useState(true);

  // const toggleSortAppt = () => {
  //   setIsAscending((prev) => !prev);
  // };

  type CTDV_DV = {
    id: number;
    ten_dich_vu: string;
    mo_ta: string;
    hinh_anh: string;
    thoi_luong: number;
    gia_tien: string;
    createdAt: string;
    updatedAt: string;
  };

  type ChiTietDichVu = {
    id: number;
    id_chi_tiet_phieu_dat: number;
    id_dich_vu: number;
    phi_dich_vu: string;
    createdAt: string;
    updatedAt: string;
    CTDV_DV: CTDV_DV;
    DanhGiaDichVus: DanhGiaDichVu[];
  };

  type KieuToc = {
    id: number;
    ten_kieu_toc: string;
    gioi_tinh: string;
    mo_ta: string;
    thoi_luong: number;
    gia_tien: string;
    createdAt: string;
    updatedAt: string;
    hinh_anh_kieu_toc: HinhAnhKieuToc[];
  } | null;

  type HinhAnhKieuToc = {
    id: number;
    id_kieu_toc: number;
    url_anh: string;
    createdAt: string | null;
    updatedAt: string | null;
  };

  type ChiTietPhieuDat = {
    id: number;
    id_phieu_dat: number;
    ten_khach_hang: string;
    id_kieu_toc: number | null;
    phi_lam_toc: string | null;
    createdAt: string;
    updatedAt: string;
    kieuToc: KieuToc;
    danhGiaKieuToc: DanhGiaKieuToc[];
    chiTietDichVus: ChiTietDichVu[];
  };
  type DanhGiaKieuToc = {
    id: number;
    id_khach_hang: number;
    id_kieu_toc: number;
    id_chi_tiet_phieu_dat: number;
    muc_do_hai_long: number;
    phan_hoi: string;
    createdAt: string;
    updatedAt: string;
  };

  type DanhGiaDichVu = {
    id: number;
    id_khach_hang: number;
    id_dich_vu: number;
    id_chi_tiet_dich_vu: number;
    muc_do_hai_long: number;
    phan_hoi: string;
    createdAt: string;
    updatedAt: string;
  };

  type LichHen = {
    id: number;
    id_tai_khoan: number;
    thoi_gian_hen: string;
    phuong_thuc_thanh_toan: string;
    tong_tien: string;
    trang_thai_lich_hen: string;
    id_nhan_vien: number | null;
    thoi_gian_dat: string;
    createdAt: string;
    updatedAt: string;
    chiTietPhieuDats: ChiTietPhieuDat[];
    thoi_gian_hen_formatted: string;
  };

  // const danhSachHienThi = danhSachLichHen.filter(
  //   (lichHen) => lichHen.trang_thai_lich_hen === trangThaiChon
  // );

  useEffect(() => {
    if (isFocused) {
      getListAppts();
    }
  }, [isFocused]);

  const getListAppts = async () => {
    try {
      if (!user) return;
      const response = await fetch(
        `${API_BASE_URL}/api/getApptByCustomer?id=${user.id}&trang_thai_lich_hen=${trangThaiChon}`
      );
      const data = await response.json();
      setDanhSachLichHen(data);
      setDanhSachGoc(data);
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sortApptByDate = () => {
    setDanhSachLichHen((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const timeA = new Date(a.thoi_gian_hen).getTime();
        const timeB = new Date(b.thoi_gian_hen).getTime();
        return isAscending ? timeA - timeB : timeB - timeA;
      });
      return sorted;
    });
    setIsAscending(!isAscending); // Đảo trạng thái sắp xếp
  };

  useEffect(() => {
    getListAppts();
  }, [trangThaiChon]);

  useEffect(() => {
    // Nếu ô tìm kiếm trống, trả về danh sách ban đầu
    if (timKiem === "") {
      setDanhSachLichHen(danhSachGoc);
      return;
    }
  
    // Hàm lọc
    const filteredAppts = danhSachGoc.filter((lichHen) => {
      return lichHen.chiTietPhieuDats.some((chiTietPhieuDat) => {
        const tenKieuToc = chiTietPhieuDat.kieuToc?.ten_kieu_toc || "";
        const foundKieuToc = tenKieuToc
          .toLowerCase()
          .includes(timKiem.toLowerCase());
  
        const foundDichVu = chiTietPhieuDat.chiTietDichVus.some(
          (chiTietDichVu) =>
            chiTietDichVu.CTDV_DV?.ten_dich_vu
              .toLowerCase()
              .includes(timKiem.toLowerCase())
        );
  
        return foundKieuToc || foundDichVu;
      });
    });
  
    setDanhSachLichHen(filteredAppts);
  }, [timKiem, danhSachGoc]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {user ? (
          <View>
            {/* Các trạng thái lịch hẹn */}
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  trangThaiChon === "Đã đặt" && styles.selectedStatusBtn,
                ]}
                onPress={() => setTrangThaiChon("Đã đặt")}
              >
                <Text
                  style={[
                    styles.statusTxt,
                    trangThaiChon === "Đã đặt" && styles.selectedStatusTxt,
                  ]}
                >
                  Lịch hẹn đang chờ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  trangThaiChon === "Đã hoàn thành" && styles.selectedStatusBtn,
                ]}
                onPress={() => setTrangThaiChon("Đã hoàn thành")}
              >
                <Text
                  style={[
                    styles.statusTxt,
                    trangThaiChon === "Đã hoàn thành" &&
                      styles.selectedStatusTxt,
                  ]}
                >
                  Đã hoàn thành
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  trangThaiChon === "Đã hủy" && styles.selectedStatusBtn,
                ]}
                onPress={() => setTrangThaiChon("Đã hủy")}
              >
                <Text
                  style={[
                    styles.statusTxt,
                    trangThaiChon === "Đã hủy" && styles.selectedStatusTxt,
                  ]}
                >
                  Đã hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  trangThaiChon === "Đã lỡ hẹn" && styles.selectedStatusBtn,
                ]}
                onPress={() => setTrangThaiChon("Đã lỡ hẹn")}
              >
                <Text
                  style={[
                    styles.statusTxt,
                    trangThaiChon === "Đã lỡ hẹn" && styles.selectedStatusTxt,
                  ]}
                >
                  Đã lỡ hẹn
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 10,
              }}
            >
              {/* Ô tìm kiếm */}
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "rgb(194, 194, 194)",
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 10,
                }}
                placeholder="Tìm kiếm theo kiểu tóc hoặc dịch vụ"
                value={timKiem}
                onChangeText={(text) => setTimKiem(text)}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  textAlignVertical: "center",
                }}
              >
                {" "}
                Ngày hẹn:{" "}
              </Text>
              <TouchableOpacity
                onPress={sortApptByDate}
                style={{
                  paddingHorizontal: 10,
                  borderColor: "rgb(194, 194, 194)",
                  borderWidth: 1,
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={
                    isAscending
                      ? "sort-clock-ascending-outline"
                      : "sort-clock-descending-outline"
                  }
                  size={25}
                  color="#007BFF"
                />
              </TouchableOpacity>
            </View>

            {/* Danh sách lịch hẹn */}
            <FlatList
              data={danhSachLichHen}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/apptDetail",
                      params: { item: JSON.stringify(item) },
                    })
                  }
                  style={styles.item}
                >
                  <Text
                    style={[
                      styles.itemText,
                      { fontSize: 15, fontWeight: "500" },
                    ]}
                  >
                    Ngày hẹn:{" "}
                    {item.thoi_gian_hen_formatted.substring(
                      5,
                      item.thoi_gian_hen_formatted.length
                    )}
                  </Text>
                  <Text style={styles.itemText}>
                    Giờ: {item.thoi_gian_hen_formatted.substring(0, 5)}
                  </Text>
                  <Text style={styles.itemText}>
                    Phương thức thanh toán: {item.phuong_thuc_thanh_toan}
                  </Text>
                  <Text
                    style={[
                      styles.itemText,
                      { color: "red", fontWeight: "500", textAlign: "right" },
                    ]}
                  >
                    Tổng tiền: {item.tong_tien}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không có lịch hẹn</Text>
              }
            />
          </View>
        ) : (
          <View>
            <Text style={styles.emptyText}>
              Vui lòng đăng nhập để xem lịch hẹn
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                router.push("/login");
              }}
            >
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statusBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    borderColor: "lightblue",
    borderWidth: 1,
  },
  selectedStatusBtn: {
    backgroundColor: "#007BFF",
    borderColor: "#0056b3",
  },
  statusTxt: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedStatusTxt: {
    color: "#fff",
  },
  item: {
    backgroundColor: "#f0f8ff",
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
    fontStyle: "italic",
  },
  loginButton: {
    marginTop: 20,
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
