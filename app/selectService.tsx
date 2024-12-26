import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

import { Dropdown } from "react-native-element-dropdown";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "@/Localhost";
import { Dimensions } from "react-native";
import { Image } from "expo-image";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";

const screenWidth = Dimensions.get("window").width;

export default function SelectService() {
  const router = useRouter();
  const { gioi_tinh } = useLocalSearchParams();
  const gioi_tinh_parse = Array.isArray(gioi_tinh) ? gioi_tinh[0] : gioi_tinh;
  const [serviceList, setServiceList] = useState<Array<ServiceList>>([]);
  const { user, setUser } = useUser();
  const { booking, setBooking } = useBooking();
  const { indexAddService } = useLocalSearchParams();
 

  interface ServiceList {
    id: number;
    ten_dich_vu: string;
    mo_ta: string;
    hinh_anh: string;
    thoi_luong: number;
    gia_tien: number;
  }

  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Đổi trạng thái
  };

  const isFocused = useIsFocused();
  const [timKiem, setTimKiem] = React.useState("");

  // const [hairList, setHairList] = useState<Array<object>>([]);
  const [gender, setGender] = useState("");

  const genderOptions = [
    { label: "Kiểu tóc nam", value: "male" },
    { label: "Kiểu tóc nữ", value: "female" },
  ];

  useEffect(() => {
    if (isFocused) {
      if (gioi_tinh_parse) {
        setGender(gioi_tinh_parse);
      }
      // console.log("gioi_tinh: ", gioi_tinh_parse);
      getServiceList();
    }
  }, [isFocused]);


  const getServiceList = async () => {
    const response = await fetch(`${API_BASE_URL}/api/services/getAllServices`);
    const data = await response.json();
    setServiceList(data);
    console.log("data: ", data);
  };
  const toggleService = (service: ServiceList) => {
    if (booking) {
      const updatedChiTietPhieuDat = [...booking.chi_tiet_phieu_dat];
      const currentServices =
        updatedChiTietPhieuDat[Number(indexAddService)].dich_vu;

      console.log("currentServices", currentServices)

      // Kiểm tra nếu dịch vụ đã có trong danh sách
      const existingServiceIndex = currentServices.findIndex(
        (dichVu) => dichVu.id_dich_vu === service.id
      );

      if (existingServiceIndex > -1) {
        // Xóa dịch vụ khỏi danh sách
        updatedChiTietPhieuDat[Number(indexAddService)].dich_vu =
          currentServices.filter((dichVu) => dichVu.id_dich_vu !== service.id);
      } else {
        // Thêm dịch vụ mới
        const newService = {
          id_dich_vu: service.id,
          ten_dich_vu: service.ten_dich_vu,
          phi_dich_vu: Number(service.gia_tien),
        };
        // if (currentServices[0].id_dich_vu === 0 || currentServices.length==0) {
        //   updatedChiTietPhieuDat[Number(indexAddService)].dich_vu = [newService];
        // }else{
        //   updatedChiTietPhieuDat[Number(indexAddService)].dich_vu = [
        //     ...currentServices,
        //     newService,
        //   ];
        // }
        if(currentServices.length>=1){
          if (currentServices[0].id_dich_vu === 0){
            updatedChiTietPhieuDat[Number(indexAddService)].dich_vu = [newService];
          }else{
            updatedChiTietPhieuDat[Number(indexAddService)].dich_vu = [
                  ...currentServices,
                  newService,
                ];
          }
        }else{
          updatedChiTietPhieuDat[Number(indexAddService)].dich_vu = [newService];
        }
      }

      // Cập nhật trạng thái booking
      setBooking({
        ...booking,
        chi_tiet_phieu_dat: updatedChiTietPhieuDat,
      });
    }
  };
  
  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <SafeAreaView>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.btnBack}
                  onPress={() => router.back()}
                >
                  <Icon name="arrow-back-outline" size={30} color="#555" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                  <Icon name="search" size={20} color="#555" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm dịch vụ..."
                    placeholderTextColor="#999"
                    value={timKiem}
                    onChangeText={(text) => setTimKiem(text)}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row", display: "none" }}>
                {/* Drop down box chọn kiểu tóc theo giới tính */}
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={genderOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn kiểu tóc"
                  value={gender}
                  onChange={(item) => setGender(item.value)}
                />
                {/* btn lọc */}
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    marginRight: 10,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                >
                  <FontAwesome name="filter" size={20} color="#555" />
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: "red",
                      borderRadius: 10,
                      padding: 3,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      1
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          }
          data={serviceList}
          keyExtractor={(item: ServiceList) => item.id.toString()}
          numColumns={2}
          key={`flatlist-columns-2`}
          renderItem={({ item }) => (
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  console.log(booking?.chi_tiet_phieu_dat[0].kieu_toc)
                }
                style={styles.cardContainer}
              >
                {/* <View > */}
                {/* Ảnh dịch vụ */}
                <View style={styles.imageContainer}>
                  <Image source={item.hinh_anh} style={styles.image} />
                </View>

                {/* Tên và thông tin dịch vụ */}
                <View style={styles.infoContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceName}>{item.ten_dich_vu}</Text>
                    <Text style={styles.serviceDetails}>{item.gia_tien}</Text>
                  </View>

                  {/* Biểu tượng đặt lịch hẹn */}
                  <TouchableOpacity
                    onPress={() => toggleService(item)}
                    style={[styles.iconBookingContainer,{
                      backgroundColor: booking?.chi_tiet_phieu_dat[Number(indexAddService)].dich_vu.some(
                        (dichVu) => dichVu.id_dich_vu === item.id
                      )
                        ? "lightgreen"
                        : "#FFA500",
                    }]}
                  >
                    <Icon
                      name={
                        booking?.chi_tiet_phieu_dat[
                          Number(indexAddService)
                        ].dich_vu.some(
                          (dichVu) => dichVu.id_dich_vu === item.id
                        )
                          ? "checkmark"
                          : "add"
                      }
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                {/* </View> */}
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  btnBack: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    marginRight: 10,
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },

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
