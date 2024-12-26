import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function AppointmentDetail() {
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
  const { item } = useLocalSearchParams();
  const appointment: LichHen = JSON.parse(Array.isArray(item) ? item[0] : item);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <ScrollView style={styles.container}>
          {/* Thông tin chung về lịch hẹn */}
          <View style={styles.section}>
            <Text style={styles.title}>Thông tin lịch hẹn</Text>
            <Text style={styles.text}>
              Thời gian hẹn: {appointment.thoi_gian_hen_formatted}
            </Text>
            <Text style={styles.text}>
              Phương thức thanh toán: {appointment.phuong_thuc_thanh_toan}
            </Text>
            <Text style={styles.text}>
              Tổng tiền: {appointment.tong_tien} VND
            </Text>
            <Text style={styles.text}>
              Trạng thái: {appointment.trang_thai_lich_hen}
            </Text>
            <Text style={styles.text}>
              Thời gian đặt:{" "}
              {new Date(appointment.thoi_gian_dat).toLocaleString()}
            </Text>
          </View>

          {/* Chi tiết phiếu đặt */}
          <View style={styles.section}>
            <Text style={styles.title}>Chi tiết khách hàng</Text>
            {appointment.chiTietPhieuDats.map((chiTiet, index) => (
              <View key={index} style={styles.detailContainer}>
                <Text style={styles.subTitle}>
                  Khách hàng: {chiTiet.ten_khach_hang}
                </Text>

                {/* Kiểu tóc */}
                {chiTiet.kieuToc ? (
                  <View style={styles.itemContainer}>
                    <Image
                      source={{
                        uri: chiTiet.kieuToc.hinh_anh_kieu_toc[0].url_anh,
                      }}
                      style={styles.image}
                    />

                    <View style={styles.serviceInfo}>
                      <Text style={styles.text}>
                        Kiểu tóc: {chiTiet.kieuToc.ten_kieu_toc}
                      </Text>
                      <Text style={styles.text}>
                        Giá: {chiTiet.kieuToc.gia_tien} VND
                      </Text>
                      <Text style={styles.text}>
                        Thời lượng: {chiTiet.kieuToc.thoi_luong} phút
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.text}>Không chọn kiểu tóc</Text>
                )}

                {/* Dịch vụ */}
                <Text style={styles.subTitle}>Dịch vụ:</Text>
                {chiTiet.chiTietDichVus.map((dichVu, idx) => (
                  <View key={idx} style={styles.itemContainer}>
                    <Image
                      source={{ uri: dichVu.CTDV_DV.hinh_anh }}
                      style={styles.image}
                    />
                    <View style={styles.serviceInfo}>
                      <Text style={styles.text}>
                        {dichVu.CTDV_DV.ten_dich_vu}
                      </Text>
                      <Text style={styles.text}>
                        Phí dịch vụ: {dichVu.phi_dich_vu} VND
                      </Text>
                      <Text style={styles.text}>
                        Thời lượng: {dichVu.CTDV_DV.thoi_luong} phút
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        {
            appointment.trang_thai_lich_hen === "Đã đặt" ?  (
                <TouchableOpacity style={styles.cancelBtn}>
                <Text style={{ color: "#fff" }}>Hủy lịch hẹn</Text>
                </TouchableOpacity>
            ) : null
        }
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#555",
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailContainer: {
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  cancelBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
});
