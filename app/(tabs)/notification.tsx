import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "@/Localhost";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";


export default function AboutScreen() {
  const [trangThaiChon, setTrangThaiChon] = useState<string>("Đã đặt");  
  const router = useRouter();
  const { user } = useUser();
  const isFocused = useIsFocused();
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);

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
    hinh_anh_kieu_toc: HinhAnhKieuToc[] 
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
    chiTietDichVus: ChiTietDichVu[];
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
      if(!user) return;
      const response = await fetch(`${API_BASE_URL}/api/getApptByCustomer?id=${user.id}&trang_thai_lich_hen=${trangThaiChon}`);
      const data = await response.json();
      setDanhSachLichHen(data);
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getListAppts();
  }, [trangThaiChon]);

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
              trangThaiChon === "Đã thanh toán" && styles.selectedStatusBtn,
            ]}
            onPress={() => setTrangThaiChon("Đã thanh toán")}
          >
            <Text
              style={[
                styles.statusTxt,
                trangThaiChon === "Đã thanh toán" && styles.selectedStatusTxt,
              ]}
            >
              Đã thanh toán
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
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
                trangThaiChon === "Đã hoàn thành" && styles.selectedStatusTxt,
              ]}
            >
              Đã hoàn thành
            </Text>
          </TouchableOpacity>
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
        </View>

        {/* Danh sách lịch hẹn */}
        <FlatList
          data={danhSachLichHen}
          
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
            onPress={() => router.push({pathname:"/apptDetail", 
              params: { item: JSON.stringify(item) }
            })}
            style={styles.item}>
              <Text style={styles.itemText}>Ngày hẹn: {item.thoi_gian_hen_formatted.substring(5,item.thoi_gian_hen_formatted.length)}</Text>
              <Text style={styles.itemText}>Giờ: {item.thoi_gian_hen_formatted.substring(0,5)}</Text>
              <Text style={styles.itemText}>Tổng tiền: {item.tong_tien}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
          <Text style={styles.emptyText}>Không có lịch hẹn</Text>
        }
        />
        </View>):(
          <View>
            <Text style={styles.emptyText}>Vui lòng đăng nhập để xem lịch hẹn</Text>
            <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              router.push("/login");
            }}
          >
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>)}
        
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
