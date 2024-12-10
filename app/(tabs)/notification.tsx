import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function AboutScreen() {
  const [danhSachLichHen] = useState([
    {
      id: 1,
      trangThai: "Đang tạo",
      ngay: "20/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 2,
      trangThai: "Đã xác nhận",
      ngay: "21/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 3,
      trangThai: "Đã hoàn thành",
      ngay: "22/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 4,
      trangThai: "Đã hủy",
      ngay: "23/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 5,
      trangThai: "Đang tạo",
      ngay: "24/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 6,
      trangThai: "Đang tạo",
      ngay: "24/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 7,
      trangThai: "Đang tạo",
      ngay: "24/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 8,
      trangThai: "Đang tạo",
      ngay: "24/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 9,
      trangThai: "Đang tạo",
      ngay: "24/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },
    {
      id: 10,
      trangThai: "Đang tạo",
      ngay: "24/10/2021",
      gio: "08:00",
      diaChi: "123 Nguyễn Chí Thanh, Đà Nẵng",
    },


  ]);

  const [trangThaiChon, setTrangThaiChon] = useState<string>("Đang tạo");

  // Lọc danh sách theo trạng thái
  const danhSachHienThi = danhSachLichHen.filter(
    (lichHen) => lichHen.trangThai === trangThaiChon
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Các trạng thái lịch hẹn */}
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusBtn,
              trangThaiChon === "Đang tạo" && styles.selectedStatusBtn,
            ]}
            onPress={() => setTrangThaiChon("Đang tạo")}
          >
            <Text
              style={[
                styles.statusTxt,
                trangThaiChon === "Đang tạo" && styles.selectedStatusTxt,
              ]}
            >
              Lịch hẹn đang tạo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusBtn,
              trangThaiChon === "Đã xác nhận" && styles.selectedStatusBtn,
            ]}
            onPress={() => setTrangThaiChon("Đã xác nhận")}
          >
            <Text
              style={[
                styles.statusTxt,
                trangThaiChon === "Đã xác nhận" && styles.selectedStatusTxt,
              ]}
            >
              Đã xác nhận
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
          data={danhSachHienThi}
          
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Ngày: {item.ngay}</Text>
              <Text style={styles.itemText}>Giờ: {item.gio}</Text>
              <Text style={styles.itemText}>Địa chỉ: {item.diaChi}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có lịch hẹn</Text>}
        />
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
});
