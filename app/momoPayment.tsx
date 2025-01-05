import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { API_BASE_URL } from "@/Localhost";
import { BackHandler, Alert } from "react-native";
import { useBooking } from "@/context/BookingContext";
import { useUser } from "@/context/UserContext";
import { useIsFocused } from "@react-navigation/native";

export default function MomoPayment() {
  const router = useRouter();
  const { payUrl, transID } = useLocalSearchParams<{
    payUrl: string;
    transID: string;
  }>();

  const { booking, setBooking } = useBooking();
  const { user, setUser } = useUser();

  const checkPaymentStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/api/checkPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transID: transID,
      }),
    });

    const data = await response.json();
    return data.data.return_code;
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;
    const handleBackPress = () => {
      (async () => {
        const paymentStatus = await checkPaymentStatus();
        if (paymentStatus === 1) {
          //Thanh toán thành công
          try {
            const response = await fetch(`${API_BASE_URL}/api/createAppt`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(booking),
            });
            
            const tomorow = new Date();
            tomorow.setDate(tomorow.getDate());
            setBooking({
              id_tai_khoan: user!.id,
              ngay_hen: tomorow,
              gio_hen: "",
              phuong_thuc_thanh_toan: "Tiền mặt",
              tong_tien: 0,
              thoi_gian_dat: new Date(),
              chi_tiet_phieu_dat: [
                {
                  ten_khach_hang: user!.ho_ten,
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
            });
            
            if (response.ok) {
              Alert.alert("Thông báo", "Tạo lịch hẹn thành công", [
                {
                  text: "OK",
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
            } else {
              throw new Error(
                `Error creating appointment: ${response.statusText}`
              );
            }
            const result = await response.json();
            console.log("Result:", result);
          } catch (error) {
            console.error("Error:", error);
          }
        }
        if (paymentStatus === 3) {
          //Thanh toán thất bại
          Alert.alert(
            "Xác nhận thoát",
            "Bạn có chắc chắn muốn thoát màn hình?",
            [
              { text: "Hủy", style: "cancel" },
              { text: "Đồng ý", onPress: () => router.back() }, 
            ]
          );
        }
      })();
      return true; // Chặn hành động mặc định
    };

    // Thêm sự kiện BackHandler và kiểm tra 
    const backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Dọn dẹp sự kiện khi component bị huỷ
    return () => backHandlerListener.remove();
  }, [isFocused]);

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? 20 : 0,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <WebView source={{ uri: payUrl }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({});
