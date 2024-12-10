import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
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

export default function BookingAppointment() {
  const router = useRouter();
  // const [date, setDate] khai báo ngày mai
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
});;
  const [showPicker, setShowPicker] = useState(false); // Hiển thị Date Picke
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  interface DatePickerEvent {
    type: string;
    nativeEvent: any;
  }

  interface TimeSlot {
    time: string;
    available: boolean;
    slotNum: number;
  }

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

  useEffect(() => {
    console.log("Time slots updated:", timeSlots);
  }, [timeSlots]);

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

  const onChangeDateTime = async (
    event: DatePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setShowPicker(false); // Ẩn picker sau khi chọn ngày
    setDate(currentDate);
    getApptsByDate(currentDate); // Lấy danh sách khung giờ trống
  };

  useEffect(() => {
    console.log(date);
  }, [date]);

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time); // Chọn khung giờ
  };
  const [nameTxt, setName] = useState("");
  const kieuToc = [
    {
      id: 1,
      name: "Kiểu tóc nam 1",
      price: "100.000đ",
      image: require("../assets/images/background-image.png"),
    },
  ];
  type Person = { id: string; name: string; service: string; style: string };
  const [soNguoi, setSoNguoi] = useState(1);
  const [peopleList, setPeopleList] = useState<Person[]>([
    { id: "1", name: "", service: "", style: "" },
  ]);

  // Hàm tăng số người
  const tangSoNguoi = () => {
    setSoNguoi((prev) => prev + 1);
    setPeopleList((prev) => [
      ...prev,
      { id: `${prev.length + 1}`, name: "", service: "", style: "" },
    ]);
  };

  // Hàm giảm số người
  const giamSoNguoi = () => {
    if (soNguoi > 1) {
      setSoNguoi((prev) => prev - 1);
      setPeopleList((prev) => prev.slice(0, -1)); // Xóa object cuối cùng
    }
  };

  // Cập nhật thông tin từng người
  const updatePersonInfo = (
    index: number,
    field: keyof Person,
    value: string
  ) => {
    setPeopleList((prev) =>
      prev.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      )
    );
  };
  const [paymentMethod, setPaymentMethod] = useState<string>("online");
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
                  minimumDate={date}
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
            onPress={() => handleTimeSelect(item.time)}
          >
            <Text
              style={[styles.timeText, !item.available && styles.disabledText, {flex: 1, textAlign: "center"}]}
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
              data={peopleList}
              keyExtractor={(item) => item.id}
              extraData={peopleList}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    paddingTop: 10,
                    paddingLeft: 10,
                    marginBottom: 15,
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Tên */}
                  <Text style={styles.tieuDe}>Khách hàng {index + 1}:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập họ tên..."
                    maxLength={50} // Giới hạn số ký tự
                    value={item.name}
                    onChangeText={(text) =>
                      updatePersonInfo(index, "name", text)
                    }
                  />
                  {/* Kiểu tóc */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={[styles.tieuDe, { flex: 1 }]}>
                      Kiểu tóc đã chọn:
                    </Text>
                    <TouchableOpacity>
                      <Icon name="add-circle-outline" size={25} color="#000" />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      alignItems: "center",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Image source={kieuToc[0].image} style={styles.image} />
                    <View style={{ flex: 7 }}>
                      <Text style={{ fontSize: 16 }}>{kieuToc[0].name}</Text>
                      <Text
                        style={{ fontSize: 16, marginTop: 10, marginLeft: 10 }}
                      >
                        {kieuToc[0].price}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity>
                        {/* change icon */}
                        <Icon name="create-outline" size={25} color="#000" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Dịch vụ */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={[styles.tieuDe, { flex: 1 }]}>Dịch vụ:</Text>
                    <TouchableOpacity>
                      <Icon name="add-circle-outline" size={25} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      marginRight: 10,
                      marginVertical: 5,
                      alignItems: "center",
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontSize: 16, flex: 2 }}>
                      {kieuToc[0].name}
                    </Text>
                    <Text style={{ fontSize: 16, flex: 2 }}>
                      {kieuToc[0].price}
                    </Text>
                    <View style={{}}>
                      <TouchableOpacity>
                        {/* change icon */}
                        <Icon name="close" size={25} color="#e32002" />
                      </TouchableOpacity>
                    </View>
                  </View>
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
                onPress={() => setPaymentMethod("online")}
              >
                <Icon
                  name={
                    paymentMethod === "online"
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={25}
                  color={paymentMethod === "online" ? "#007BFF" : "#ccc"}
                />
                <Text style={styles.optionText}>Thanh toán online</Text>
              </TouchableOpacity>
              {/* Thanh toán tại cửa hàng */}
              <TouchableOpacity
                style={[
                  styles.option,
                  paymentMethod === "in-store" && styles.selectedOption,
                ]}
                onPress={() => setPaymentMethod("in-store")}
              >
                <Icon
                  name={
                    paymentMethod === "in-store"
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={25}
                  color={paymentMethod === "in-store" ? "#007BFF" : "#ccc"}
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
            500.000đ
          </Text>
        </View>
        <TouchableOpacity
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
