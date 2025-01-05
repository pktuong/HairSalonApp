import { Image } from "expo-image";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_BASE_URL } from "@/Localhost";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import { Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import React from "react";

export default function BookingAppointment() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const isFocused = useIsFocused();
  const { booking, setBooking } = useBooking();
  const [showPicker, setShowPicker] = useState(false); // Hiển thị Date Picke
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>();
  const [soNguoi, setSoNguoi] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("Chuyển khoản");
  const tomorow = new Date();
  tomorow.setDate(tomorow.getDate());
  const [date, setDate] = useState(booking?.ngay_hen || tomorow);

  interface DatePickerEvent {
    type: string;
    nativeEvent: any;
  }

  interface TimeSlot {
    time: string;
    available: boolean;
    slotNum: number;
  }

  type ChiTietPhieuDat = {
    ten_khach_hang: string;
    kieu_toc: KieuToc;
    dich_vu: DichVu[];
  };
  type DichVu = {
    id_dich_vu: number;
    ten_dich_vu: string;
    phi_dich_vu: number;
  };
  type KieuToc = {
    id_kieu_toc: number;
    ten_kieu_toc: string;
    gia: number;
    hinh_anh: string;
  };

  const [list_chi_tiet_phieu_dat, setChiTietPhieuDat] = useState<
    ChiTietPhieuDat[]
  >(() => {
    if (!user) {
      return [];
    }
    return [
      {
        id: 0,
        ten_khach_hang: user.ho_ten,
        kieu_toc: {
          id_kieu_toc: 0,
          ten_kieu_toc: "",
          gia: 0,
          hinh_anh: "",
        },
        dich_vu: [{ id_dich_vu: 0, ten_dich_vu: "", phi_dich_vu: 0 }],
      },
    ];
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "7:30 AM", available: true, slotNum: 3 },
    { time: "8:00 AM", available: true, slotNum: 3 },
    { time: "8:30 AM", available: true, slotNum: 3 },
    { time: "9:00 AM", available: true, slotNum: 3 },
    { time: "9:30 AM", available: true, slotNum: 3 },
    { time: "10:00 AM", available: true, slotNum: 3 },
    { time: "10:30 AM", available: true, slotNum: 3 },
    { time: "11:00 AM", available: true, slotNum: 3 },
    { time: "11:30 AM", available: true, slotNum: 3 },
    { time: "1:30 PM", available: true, slotNum: 3 },
    { time: "2:00 PM", available: true, slotNum: 3 },
    { time: "2:30 PM", available: true, slotNum: 3 },
    { time: "3:00 PM", available: true, slotNum: 3 },
    { time: "3:30 PM", available: true, slotNum: 3 },
    { time: "4:00 PM", available: true, slotNum: 3 },
  ]);

  const getApptsByDate = async (date: Date) => {
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/getFreeTime/${formattedDate}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching appointments: ${response.statusText}`);
      }
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error("Error:", error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  };

  const convertTo12Hour = (time: string) => {
    let [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
  };

  const onChangeDateTime = async (
    event: DatePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setShowPicker(false); // Ẩn picker sau khi chọn ngày
    if (currentDate.getTime() !== date.getTime()) {
      setDate(currentDate);
      getApptsByDate(currentDate); // Lấy danh sách khung giờ trống
      setSelectedSlot(undefined); // Reset selected slot
      setSelectedTime(null); // Reset selected time
      if (booking) {
        setBooking({ ...booking, ngay_hen: currentDate, gio_hen: "" });
      }
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleTimeSelect = (item: TimeSlot) => {
    if (item.slotNum < soNguoi) {
      Alert.alert(
        "Cảnh báo",
        "Số người bạn thêm đã vượt quá số lượng còn trống"
      );
      return;
    }
    setSelectedTime(item.time); // Chọn khung giờ
    setSelectedSlot(item);
    if (booking) {
      setBooking({ ...booking, gio_hen: item.time });
    }
  };

  // Hàm tăng số người
  const tangSoNguoi = () => {
    if (soNguoi == selectedSlot?.slotNum) {
      Alert.alert("Cảnh báo", "Số người trong khung giờ đã đầy");
      return;
    }
    if (soNguoi < 3) {
      setSoNguoi((prev) => prev + 1);
      setChiTietPhieuDat((prev) => [
        ...prev,
        {
          ten_khach_hang: "",
          kieu_toc: {
            id_kieu_toc: 0,
            ten_kieu_toc: "",
            gia: 0,
            hinh_anh: "",
          },
          dich_vu: [{ id_dich_vu: 0, ten_dich_vu: "", phi_dich_vu: 0 }],
        },
      ]);
      if (booking) {
        setBooking({
          ...booking,
          chi_tiet_phieu_dat: [
            ...booking.chi_tiet_phieu_dat,
            {
              ten_khach_hang: "",
              kieu_toc: {
                id_kieu_toc: 0,
                ten_kieu_toc: "",
                gia: 0,
                hinh_anh: "",
              },
              dich_vu: [{ id_dich_vu: 0, ten_dich_vu: "", phi_dich_vu: 0 }],
            },
          ],
        });
      }
    } else {
      Alert.alert("Cảnh báo", "Số người tối đa là 3");
    }
  };

  // Hàm giảm số người
  const giamSoNguoi = () => {
    if (soNguoi > 1) {
      setSoNguoi((prev) => prev - 1);
      setChiTietPhieuDat((prev) => prev.slice(0, -1)); // Xóa object cuối cùng
      if (booking) {
        setBooking({
          ...booking,
          chi_tiet_phieu_dat: booking.chi_tiet_phieu_dat.slice(0, -1),
        });
      }
    }
  };

  // Cập nhật thông tin từng người
  const updateName = (
    index: number,
    field: keyof ChiTietPhieuDat,
    value: string
  ) => {
    setChiTietPhieuDat((prev) =>
      prev.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      )
    );
    if (booking) {
      setBooking({
        ...booking,
        chi_tiet_phieu_dat: booking.chi_tiet_phieu_dat.map((person, i) =>
          i === index ? { ...person, [field]: value } : person
        ),
      });
    }
  };

  const convertTo24Hour = (time: string) => {
    const match = time.match(/(\d+):(\d+)\s?(AM|PM)/);
    if (!match) {
      throw new Error("Invalid time format");
    }
    const [hour, minute, period] = match.slice(1);
    let hours24 = parseInt(hour, 10);
    if (period === "PM" && hours24 !== 12) hours24 += 12;
    if (period === "AM" && hours24 === 12) hours24 = 0;
    return `${String(hours24).padStart(2, "0")}:${minute}:00`;
  };
  const showData = () => {
    console.log("==========Data==========");
    // console.log("Selected time:", selectedTime);
    console.log("Date:", date);
    // console.log("People list:", peopleList);
    // console.log("Payment method:", paymentMethod);
    console.log("Booking:", booking);
    console.log(paymentMethod);
  };

  const removeDichVu = (chiTietIndex: number, idDichVu: number) => {
    if (booking) {
      const updatedChiTietPhieuDat = [...booking.chi_tiet_phieu_dat];

      // Lọc bỏ dịch vụ có idDichVu trong mảng dich_vu của đối tượng chỉ định
      updatedChiTietPhieuDat[chiTietIndex] = {
        ...updatedChiTietPhieuDat[chiTietIndex],
        dich_vu: updatedChiTietPhieuDat[chiTietIndex].dich_vu.filter(
          (dichVu) => dichVu.id_dich_vu !== idDichVu
        ),
      };

      // Cập nhật lại booking
      setBooking({
        ...booking,
        chi_tiet_phieu_dat: updatedChiTietPhieuDat,
      });
    }
  };

  const calculateTotal = (chiTietPhieuDat: ChiTietPhieuDat[]) => {
    return chiTietPhieuDat.reduce((tong, item) => {
      const giaKieuToc = Number(item.kieu_toc.gia) || 0; // Giá kiểu tóc
      const tongPhiDichVu = item.dich_vu.reduce((tongDichVu, dichVu) => {
        return tongDichVu + (Number(dichVu.phi_dich_vu) || 0); // Phí dịch vụ
      }, 0);
      return tong + giaKieuToc + tongPhiDichVu; // Tổng tiền của từng khách hàng
    }, 0);
  };

  const kiemTraDaChonKieuTocHoacDichVu = (
    chiTietPhieuDat: ChiTietPhieuDat[]
  ) => {
    for (let item of chiTietPhieuDat) {
      const daChonKieuToc = item.kieu_toc.id_kieu_toc !== 0;
      const daChonDichVu = item.dich_vu.some(
        (dichVu) => dichVu.id_dich_vu !== 0
      );

      // Nếu chưa chọn kiểu tóc hoặc dịch vụ
      if (!daChonKieuToc && !daChonDichVu) {
        return false;
      }
    }
    return true; // Tất cả khách hàng đều đã chọn ít nhất một trong hai
  };

  const createAppointment = async () => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    const now = new Date();

    // Thêm 7 giờ (chênh lệch với UTC)
    const today = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    if (selectedTime === null) {
      Alert.alert("Cảnh báo", "Vui lòng chọn khung giờ");
      return;
    }
    // console.log("=========Booking==========");
    console.log("Date:", booking?.chi_tiet_phieu_dat[1]);
    if (!kiemTraDaChonKieuTocHoacDichVu(list_chi_tiet_phieu_dat)) {
      Alert.alert("Cảnh báo", "Vui lòng chọn kiểu tóc hoặc dịch vụ");
      return;
    } else {
      if (paymentMethod === "Chuyển khoản") {
        callPayment();
      }
      if (paymentMethod === "Tiền mặt") {
        try {
          const response = await fetch(`${API_BASE_URL}/api/createAppt`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(booking),
          });
          if (response.ok) {
            Alert.alert("Thông báo", "Tạo lịch hẹn thành công", [
              {
                text: "OK",
                onPress: () => {
                  const tomorow = new Date();
                  tomorow.setDate(tomorow.getDate());
                  setBooking({
                    id_tai_khoan: user.id,
                    ngay_hen: tomorow,
                    gio_hen: "",
                    phuong_thuc_thanh_toan: "Tiền mặt",
                    tong_tien: 0,
                    thoi_gian_dat: new Date(),
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
                  });
                  router.push("/");
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
    }
  };

  const callPayment = async () => {    
    const resPayment = await fetch(`${API_BASE_URL}/api/createPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalPrice: calculateTotal(list_chi_tiet_phieu_dat),
      }),
    });
    const data = await resPayment.json();
    console.log(data);
    router.push({
      pathname: "/momoPayment",
      params: { payUrl: data.order_url, transID: data.transID },
    });
  };

  useEffect(() => {
    if (isFocused) {
      getApptsByDate(date);
      if (booking) {
        setDate(booking.ngay_hen);
        // cập nhật lại selected time và selected slot
        timeSlots.forEach((item) => {
          if (item.time == booking.gio_hen) {
            setSelectedTime(item.time);
            setSelectedSlot(item);
          }
        });
        //cập nhật list_chi_tiet_phieu_dat
        setChiTietPhieuDat(booking.chi_tiet_phieu_dat);
        //cập nhật lại số người
        setSoNguoi(booking.chi_tiet_phieu_dat.length);
      }
    }
  }, [isFocused]);
  useEffect(() => {
    console.log("Time slots updated:", timeSlots);
  }, [timeSlots]);
  useEffect(() => {
    console.log(date);
  }, [date]);
  useEffect(() => {
    console.log("Selected time:", selectedTime);
    console.log("Selected slot:", selectedSlot);
  }, [selectedTime, selectedSlot]);
  useEffect(() => {
    const i = list_chi_tiet_phieu_dat;
  }, [list_chi_tiet_phieu_dat]);
  useEffect(() => {
    if (paymentMethod && booking) {
      setBooking({
        ...booking,
        phuong_thuc_thanh_toan: paymentMethod,
      });
    }
  }, [paymentMethod]);
  return (
    <>
      <FlatList
        style={{ marginBottom: 70 }}
        ListHeaderComponent={
          <>
            <Stack.Screen
              options={{
                headerTitle: "Tạo lịch hẹn",
                headerTitleAlign: "center",
              }}
            ></Stack.Screen>
            <View style={styles.areaChonNgay}>
              <Text style={styles.tieuDe}>Chọn ngày:</Text>
              <View style={styles.datePickerContainer}>
                <Text style={styles.dateText}>
                  {date.toLocaleDateString("vi-VN")}
                </Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    padding: 5,
                  }}
                  onPress={showDatePicker}
                >
                  <Icon name="calendar-outline" size={25} color="#000" />
                </TouchableOpacity>
              </View>

              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  minimumDate={tomorow}
                  onChange={onChangeDateTime}
                />
              )}
            </View>
            <Text style={[styles.tieuDe, { marginLeft: 10 }]}>
              Chọn khung giờ:
            </Text>
          </>
        }
        data={timeSlots}
        numColumns={5}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.timeSlot,
              item.available
                ? selectedTime === item.time
                  ? styles.selectedSlot
                  : styles.availableSlot
                : styles.disabledSlot,
            ]}
            disabled={!item.available}
            onPress={() => handleTimeSelect(item)}
          >
            <Text
              style={[
                styles.timeText,
                !item.available && styles.disabledText,
                { flex: 1, textAlign: "center" },
              ]}
            >
              {item.time}
            </Text>
            <View
              style={{
                height: 20,
              }}
            >
              <Text
                style={[
                  styles.timeText,
                  !item.available && styles.disabledText,
                ]}
              >
                Còn:{item.slotNum}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
          {
            // kiểm tra nếu tất cả phần tử trong timeslots có available = false thì hiển thị text Khung giờ khả dụng đã hết, vui lòng chọn ngày khác
            timeSlots.every((item) => item.available === false) && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "red",
                  marginTop: 10,
                }}
              >
                Khung giờ khả dụng đã hết, vui lòng chọn ngày khác
              </Text>
            )
          }
            <FlatList
              ListHeaderComponent={
                <View style={{ marginLeft: 10, marginBottom: 15 }}>
                  <View style={styles.row}>
                    <Text style={styles.soNguoiTxt}>Số người:</Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        onPress={giamSoNguoi}
                        style={styles.button}
                      >
                        <Icon name="remove" size={30} color="#555" />
                      </TouchableOpacity>
                      <Text style={styles.number}>{soNguoi}</Text>
                      <TouchableOpacity
                        onPress={tangSoNguoi}
                        style={styles.button}
                      >
                        <Icon name="add" size={30} color="#555" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }
              data={list_chi_tiet_phieu_dat}
              keyExtractor={(_, index) => index.toString()}
              extraData={list_chi_tiet_phieu_dat}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    paddingTop: 10,
                    // paddingLeft: 10,
                    marginBottom: 15,
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Tên */}
                  <Text style={[styles.tieuDe, { marginLeft: 10 }]}>
                    Khách hàng {index + 1}:
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập họ tên..."
                    maxLength={50} // Giới hạn số ký tự
                    value={item.ten_khach_hang}
                    onChangeText={(text) =>
                      updateName(index, "ten_khach_hang", text)
                    }
                  />
                  {/* Kiểu tóc */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 10,
                      borderWidth: 1,
                      borderRadius: 50,
                      paddingHorizontal: 10,
                      marginHorizontal: 10,
                      paddingVertical: 8,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text
                      style={[
                        styles.tieuDe,
                        {
                          marginLeft: 10,
                          flex: 1,
                        },
                      ]}
                    >
                      Chọn kiểu tóc:
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/selectHair",
                          params: { indexAdd: index },
                        })
                      }
                    >
                      <Icon name="add-circle-outline" size={25} color="#000" />
                    </TouchableOpacity>
                  </View>
                  {item.kieu_toc.ten_kieu_toc != "" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Image
                        source={item.kieu_toc.hinh_anh}
                        style={styles.image}
                      />
                      <View style={{ flex: 7 }}>
                        <Text style={{ fontSize: 16 }}>
                          {item.kieu_toc.ten_kieu_toc}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            marginTop: 10,
                            marginLeft: 10,
                          }}
                        >
                          {item.kieu_toc.gia}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => {
                            let newArr = [...list_chi_tiet_phieu_dat];
                            newArr[index].kieu_toc = {
                              id_kieu_toc: 0,
                              ten_kieu_toc: "",
                              gia: 0,
                              hinh_anh: "",
                            };
                            setChiTietPhieuDat(newArr);
                          }}
                        >
                          {/* delete icon */}
                          <Icon
                            name="close-circle-outline"
                            size={25}
                            color="#e32002"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}

                  {/* Dịch vụ */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 10,
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      borderRadius: 50,
                      marginHorizontal: 10,
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={[styles.tieuDe, { flex: 1, marginLeft: 10 }]}>
                      Chọn dịch vụ:
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/selectService",
                          params: { indexAddService: index },
                        })
                      }
                    >
                      <Icon name="add-circle-outline" size={25} color="#000" />
                    </TouchableOpacity>
                  </View>

                  {item.dich_vu.map(
                    (dv) =>
                      dv.ten_dich_vu != "" && (
                        <View
                          key={dv.id_dich_vu}
                          style={{
                            flexDirection: "row",
                            paddingHorizontal: 10,
                            marginHorizontal: 10,
                            marginVertical: 5,
                            alignItems: "center",
                            paddingVertical: 12,
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 10,
                          }}
                        >
                          <Text style={{ fontSize: 16, flex: 2 }}>
                            {dv.ten_dich_vu}
                          </Text>
                          <Text style={{ fontSize: 16, flex: 2 }}>
                            {dv.phi_dich_vu}
                          </Text>
                          <View style={{}}>
                            <TouchableOpacity
                              onPress={() => {
                                let newArr = [...list_chi_tiet_phieu_dat];
                                newArr[index].dich_vu = newArr[
                                  index
                                ].dich_vu.filter(
                                  (item) => item.id_dich_vu !== dv.id_dich_vu
                                );
                                setChiTietPhieuDat(newArr);
                              }}
                            >
                              {/* delete icon */}
                              <Icon
                                name="close-circle-outline"
                                size={25}
                                color="#e32002"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                  )}
                </View>
              )}
            />
            <View style={{ marginHorizontal: 10 }}>
              <Text style={styles.tieuDe}>Chọn phương thức thanh toán</Text>

              {/* Thanh toán online */}
              <TouchableOpacity
                style={[
                  styles.option,
                  paymentMethod === "online" && styles.selectedOption,
                ]}
                onPress={() => setPaymentMethod("Chuyển khoản")}
              >
                <Icon
                  name={
                    paymentMethod === "Chuyển khoản"
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={25}
                  color={paymentMethod === "Chuyển khoản" ? "#007BFF" : "#ccc"}
                />
                <Text style={styles.optionText}>Thanh toán online</Text>
              </TouchableOpacity>
              {/* Thanh toán tại cửa hàng */}
              <TouchableOpacity
                style={[
                  styles.option,
                  paymentMethod === "in-store" && styles.selectedOption,
                ]}
                onPress={() => setPaymentMethod("Tiền mặt")}
              >
                <Icon
                  name={
                    paymentMethod === "Tiền mặt"
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={25}
                  color={paymentMethod === "Tiền mặt" ? "#007BFF" : "#ccc"}
                />
                <Text style={styles.optionText}>Thanh toán tại cửa hàng</Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />
      {/* Phần tổng tiền và xác nhận */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 10,
          position: "absolute",
          bottom: 0,
          left: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          right: 0,
          // Thêm border top mỏng
          borderTopWidth: 1,
          borderTopColor: "#ccc",
        }}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ fontSize: 15 }}>Tổng hóa đơn:</Text>
          <Text style={{ color: "red", fontSize: 19, fontWeight: "bold" }}>
            {calculateTotal(list_chi_tiet_phieu_dat).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>

        <TouchableOpacity
          onPress={
            () => {
              createAppointment();
            }
            // createAppointment
          }
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: "red",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  areaChonNgay: {
    marginTop: 20,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 10,
  },
  datePickerContainer: {
    marginRight: 10,
    backgroundColor: "#fff",
    width: 150,
    justifyContent: "space-between",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  tieuDe: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    flex: 2,
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 10,
  },
  input: {
    // height: 40,
    fontSize: 18,
    marginLeft: 15,
  },

  timeSlot: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  availableSlot: {
    backgroundColor: "#e0f7fa", // Màu nền cho khung giờ khả dụng
    borderWidth: 1,
    borderColor: "#00acc1",
  },
  selectedSlot: {
    backgroundColor: "#80deea", // Màu nền khi được chọn
    borderWidth: 1,
    borderColor: "#00838f",
  },
  disabledSlot: {
    backgroundColor: "#e0e0e0", // Màu nền cho khung giờ không khả dụng
    borderWidth: 1,
    borderColor: "#bdbdbd",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledText: {
    color: "#9e9e9e", // Màu chữ cho khung giờ không khả dụng
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  soNguoiTxt: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 20,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  number: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
  },

  option: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#007BFF",
    backgroundColor: "#E6F0FF",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
  },
});
