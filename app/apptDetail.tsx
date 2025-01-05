import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { API_BASE_URL } from "@/Localhost";
import { useUser } from "@/context/UserContext";
import { FontAwesome } from "@expo/vector-icons";

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
  const { item } = useLocalSearchParams();
  // const appointment: LichHen = JSON.parse(Array.isArray(item) ? item[0] : item);
  const [appointment, setAppointment] = useState<LichHen>(
    JSON.parse(Array.isArray(item) ? item[0] : item)
  );
  const router = useRouter();
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [idDanhGiaKieuToc, setIdDanhGiaKieuToc] = useState(0);
  const [idDanhGiaDichVu, setIdDanhGiaDichVu] = useState(0);
  const [idKT_DV, setIdKT_DV] = useState(0);
  const [idCTPD_DV, setIdCTPD_DV] = useState(0);
  const [soSao, setSoSao] = useState(0);
  const [phanHoi, setPhanHoi] = useState("");

  const cancelAppt = async (id: number) => {
    Alert.alert(
      "Thông báo",
      "Hủy lịch hẹn liên tiếp 5 lần sẽ bị tạm khóa chức năng đặt lịch hẹn?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            const response = await fetch(
              `${API_BASE_URL}/api/customerUpdateAppt/${id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  trang_thai_lich_hen: "Đã hủy",
                  id_tai_khoan: user!.id,
                }),
              }
            );
            if (response.ok) {
              Alert.alert("Hủy lịch hẹn thành công");
              router.back();
            } else {
              Alert.alert("Hủy lịch hẹn không thành công");
            }
          },
        },
      ]
    );
  };

  const acceptAppt = async (id: number) => {
    const response = await fetch(
      `${API_BASE_URL}/api/customerUpdateAppt/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trang_thai_lich_hen: "Đã hoàn thành",
          id_tai_khoan: user!.id,
        }),
      }
    );
    if (response.ok) {
      Alert.alert("Thông báo","Xác nhận hoàn thành lịch hẹn thành công");
      router.back();
    } else {
      Alert.alert("Thông báo","Xác nhận hoàn thành lịch hẹn không thành công");
    }
  }

  const getApptDetail = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/getApptDetail/${appointment.id}`
    );
    if (response.ok) {
      const data: LichHen = await response.json();
      setAppointment(data);
    }
  };

  const getRatingHair = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/getHairRating/${id}`);
    if (response.ok) {
      const data: DanhGiaKieuToc = await response.json();
      setIdDanhGiaKieuToc(data.id);
      setSoSao(data.muc_do_hai_long);
      setPhanHoi(data.phan_hoi);
    }
  };

  const getServiceRating = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/getServiceRating/${id}`);
    if (response.ok) {
      const data: DanhGiaDichVu = await response.json();
      setIdDanhGiaDichVu(data.id);
      setSoSao(data.muc_do_hai_long);
      setPhanHoi(data.phan_hoi);
    }
  };

  const addRatingHair = async () => {
    const response = await fetch(`${API_BASE_URL}/api/addHairRating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_khach_hang: user!.id,
        id_kieu_toc: idKT_DV,
        id_chi_tiet_phieu_dat: idCTPD_DV,
        muc_do_hai_long: soSao,
        phan_hoi: phanHoi,
      }),
    });
    resetAll();
    if (response.ok) {
      getApptDetail();
      Alert.alert("Đánh giá thành công");
      setModalVisible(false);
    } else {
      Alert.alert("Đánh giá không thành công");
    }
  };

  const addRatingService = async () => {
    const response = await fetch(`${API_BASE_URL}/api/addServiceRating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_khach_hang: user!.id,
        id_dich_vu: idKT_DV,
        id_chi_tiet_dich_vu: idCTPD_DV,
        muc_do_hai_long: soSao,
        phan_hoi: phanHoi,
      }),
    });
    resetAll();
    if (response.ok) {
      getApptDetail();
      Alert.alert("Đánh giá thành công");
      setModalVisible(false);
    } else {
      Alert.alert("Đánh giá không thành công");
    }
  };

  const suaDanhGiaKieuToc = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/updateHairRating/${idDanhGiaKieuToc}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          muc_do_hai_long: soSao,
          phan_hoi: phanHoi,
        }),
      }
    );
    setIdDanhGiaKieuToc(0);
    if (response.ok) {
      Alert.alert("Cập nhật đánh giá thành công");
      setModalVisible(false);
    } else {
      Alert.alert("Cập nhật đánh giá không thành công");
    }
  };

  const suaDanhGiaDichVu = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/updateServiceRating/${idDanhGiaDichVu}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          muc_do_hai_long: soSao,
          phan_hoi: phanHoi,
        }),
      }
    );
    resetAll();
    if (response.ok) {
      Alert.alert("Cập nhật đánh giá thành công");
      setModalVisible(false);
    } else {
      Alert.alert("Cập nhật đánh giá không thành công");
    }
  };

  const resetAll = () => {
    setIdDanhGiaKieuToc(0);
    setIdDanhGiaDichVu(0);
    setSoSao(0);
    setPhanHoi("");
  };

  const showAddRating = () => {
    console.log("idKT_DV", idKT_DV);
    console.log("idCTPD_DV", idCTPD_DV);
    console.log("soSao", soSao);
    console.log("phanHoi", phanHoi);
  };

  const danhGia = async () => {
    if (idDanhGiaKieuToc > 0) {
      suaDanhGiaKieuToc();
    }
    if (idDanhGiaKieuToc == -1) {
      addRatingHair();
    }
    if (idDanhGiaDichVu > 0) {
      suaDanhGiaDichVu();
    }
    if (idDanhGiaDichVu == -1) {
      addRatingService();
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                Đánh giá của bạn
              </Text>
              <View style={styles.voteContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setSoSao(star)} // Cập nhật giá trị rating
                    activeOpacity={0.7}
                  >
                    <FontAwesome
                      name="star"
                      size={25}
                      color={star <= soSao ? "#FFD700" : "#DDDDDD"} // Màu vàng nếu rating >= star
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ fontSize: 15 }}>Phản hồi:</Text>
              <TextInput
                style={{ borderColor: "rgb(205, 205, 205)", borderWidth: 1 }}
                onChangeText={(text) => setPhanHoi(text)}
                value={phanHoi}
                multiline={true}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    resetAll();
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "rgb(160, 160, 160)",
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Hủy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    danhGia();
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "rgb(20, 34, 130)",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
          <View style={[styles.section,{marginBottom: 80,}]}>
            <Text style={styles.title}>Chi tiết lịch hẹn</Text>
            {appointment.chiTietPhieuDats.map((chiTiet, index) => (
              <View key={index} style={styles.detailContainer}>
                <Text
                  style={[
                    styles.subTitle,
                    { fontSize: 18, textAlign: "center", marginTop: 18 },
                  ]}
                >
                  Khách hàng: {chiTiet.ten_khach_hang}
                </Text>

                {/* Kiểu tóc */}
                {chiTiet.kieuToc ? (
                  <>
                    <Text style={styles.subTitle}>Kiểu tóc:</Text>
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
                      {/* btn đánh giá kieutoc */}
                      {appointment.trang_thai_lich_hen == "Đã hoàn thành" ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              if (chiTiet.danhGiaKieuToc.length > 0) {
                                getRatingHair(chiTiet.danhGiaKieuToc[0].id);
                                setModalVisible(true);
                              } else {
                                setIdKT_DV(chiTiet.id_kieu_toc!);
                                setIdCTPD_DV(chiTiet.id);
                                setIdDanhGiaKieuToc(-1);
                                setModalVisible(true);
                              }
                            }}
                            style={{
                              backgroundColor: "rgb(17, 42, 141)",
                              marginLeft: 5,
                              padding: 10,
                              borderRadius: 10,
                            }}
                          >
                            <Text
                              style={{ color: "#f9f9f9", fontWeight: "500" }}
                            >
                              {chiTiet.danhGiaKieuToc.length > 0
                                ? "Sửa đánh giá"
                                : "Đánh giá"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                  </>
                ) : (
                  <Text style={styles.text}>Không chọn kiểu tóc</Text>
                )}

                {/* Dịch vụ */}
                {chiTiet.chiTietDichVus.map((dichVu, idx) => (
                  <View key={idx}>
                    <Text style={styles.subTitle}>Dịch vụ {idx + 1}:</Text>
                    <View style={styles.itemContainer}>
                      {/* Thông tin */}
                      <View style={{ flex: 1 }}>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
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
                      </View>
                      {/* nút đánh giá */}
                      {appointment.trang_thai_lich_hen == "Đã hoàn thành" ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              if (dichVu.DanhGiaDichVus.length > 0) {
                                getServiceRating(dichVu.DanhGiaDichVus[0].id);
                                setModalVisible(true);
                              } else {
                                setIdKT_DV(dichVu.id_dich_vu);
                                setIdCTPD_DV(dichVu.id);
                                setIdDanhGiaDichVu(-1);
                                setModalVisible(true);
                              }
                            }}
                            style={{
                              backgroundColor: "rgb(17, 42, 141)",
                              marginLeft: 5,
                              padding: 10,
                              borderRadius: 10,
                            }}
                          >
                            <Text
                              style={{ color: "#f9f9f9", fontWeight: "500" }}
                            >
                              {dichVu.DanhGiaDichVus.length > 0
                                ? "Sửa đánh giá"
                                : "Đánh giá"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        {appointment.trang_thai_lich_hen === "Đã đặt" ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              position: "absolute",
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                const now = new Date();
                const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);
                const apptTime = new Date(appointment.thoi_gian_hen);
                if(apptTime.getTime() - today.getTime() >= 1000 * 60 * 60){
                  cancelAppt(appointment.id);
                }else{
                  Alert.alert("Thông báo","Chỉ được hủy trước thời gian hẹn 1 tiếng");
                }
              }}
              style={[styles.cancelBtn]}
            >
              <Text style={{ color: "red", fontWeight: "500", fontSize: 15 }}>
                Hủy lịch hẹn
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
    marginBottom: 30,
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
    fontSize: 16,
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
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    marginHorizontal: 5,
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
