import {
  FlatList,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import HairCardItem from "@/components/HairCardItem";
import Icon from "react-native-vector-icons/Ionicons";
const Placeholder = require("../../assets/images/background-image.png");
import { Dropdown } from "react-native-element-dropdown";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "@/Localhost";
import { Dimensions } from "react-native";
import { Image } from "expo-image";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import { ToastAndroid } from "react-native";
const screenWidth = Dimensions.get("window").width;

export default function HairList() {
  const router = useRouter();
  const { gioi_tinh } = useLocalSearchParams<{ gioi_tinh: string }>() || "";
  const gioi_tinh_parse = Array.isArray(gioi_tinh) ? gioi_tinh[0] : gioi_tinh;
  const [hairList, setHairList] = useState<Array<HairList>>([]);
  const [hairList2, setHairList2] = useState<Array<HairList>>([]);
  const { user, setUser } = useUser();
  const { booking, setBooking } = useBooking();
  const [modalVisible, setModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [timeDuration, setTimeDuration] = useState(0);
  const [faceShape, setFaceShape] = useState<FaceShape[]>([]);
  const [faceShapeSelected, setFaceShapeSelected] = useState(0);
  interface HairList {
    id: number;
    ten_kieu_toc: string;
    gia_tien: string;
    mo_ta: string;
    thoi_luong: number;
    gioi_tinh: string;
    danh_gia_kieu_toc: {
      id: number;
      id_khach_hang: number;
      id_kieu_toc: number;
      id_chi_tiet_phieu_dat: number;
      muc_do_hai_long: number;
      phan_hoi: string;
      createdAt: string | null;
      updatedAt: string | null;
    }[];
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
  interface FaceShape {
    id: number;
    kieu_khuon_mat: string;
    hinh_anh: string;
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
    { label: "Chọn tất cả", value: "" },
    { label: "Kiểu tóc nam", value: "Nam" },
    { label: "Kiểu tóc nữ", value: "Nữ" },
  ];

  const getHairList = async () => {
    ///api/customers/getAllHairStyles
    const response = await fetch(
      `${API_BASE_URL}/api/customers/getAllHairStyles`
    );
    const data = await response.json();

    setHairList2(data.data);
    if (gioi_tinh != "" && gioi_tinh !== undefined) {
      let filteredList = hairList2;
      filteredList = filteredList.filter(
        (hairstyle) => hairstyle.gioi_tinh === gioi_tinh
      );
      setHairList(filteredList);
    } else {
      setHairList(data.data);
    }
  };

  const getFaceShape = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/hairStyles/getFaceShapes`
    );
    const data = await response.json();
    setFaceShape(data.data);
  };
  const handleFilter = () => {
    let filteredList = hairList2;
    if (gender !== "") {
      filteredList = filteredList.filter(
        (hairstyle) => hairstyle.gioi_tinh === gender
      );
    }
    if (minPrice !== "" && maxPrice !== "") {
      if (Number(minPrice) > Number(maxPrice)) {
        ToastAndroid.show("Giá tối thiểu phải nhỏ hơn giá tối đa", 2000);
        return;
      }
    }
    if (minPrice !== "") {
      filteredList = filteredList.filter(
        (item) => Number(item.gia_tien) >= Number(minPrice)
      );
    }
    if (maxPrice !== "") {
      filteredList = filteredList.filter(
        (item) => Number(item.gia_tien) <= Number(maxPrice)
      );
    }
    if (timeDuration !== 0) {
      filteredList = filteredList.filter(
        (item) => Number(item.thoi_luong) <= timeDuration
      );
    }
    if (faceShapeSelected !== 0) {
      filteredList = filteredList.filter((item) =>
        item.kieu_toc_phu_hop.some(
          (kieu_toc_phu_hop) =>
            kieu_toc_phu_hop.kieu_khuon_mat_phu_hop.id === faceShapeSelected
        )
      );
    }
    setHairList(filteredList);
    setModalVisible(false);
  };

  const handleSearchByName = () => {
    let filteredList = hairList2;
    if (timKiem !== "") {
      filteredList = filteredList.filter((item) =>
        item.ten_kieu_toc.toLowerCase().includes(timKiem.toLowerCase())
      );
    }

    if (filteredList.length === 0) {
      for (let i = 0; i < timKiem.length; i++) {
        filteredList = hairList2.filter((item) =>
          item.ten_kieu_toc.toLowerCase().includes(timKiem[i].toLowerCase())
        );
      }
    }
    setHairList(filteredList);
  };

  useEffect(() => {
    handleSearchByName();
  }, [timKiem]);

  useEffect(() => {
    if (isFocused) {
      getHairList();
      //Kiểm tra gioi_tinh có undefined không
      if (gioi_tinh && gioi_tinh !== undefined) {
        setGender(gioi_tinh);
      }
    }
  }, [isFocused]);
  useEffect(() => {
    router.setParams({ gioi_tinh: gender });
    handleFilter();
  }, [gender]);

  return (
    <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
      <SafeAreaView>
        <FlatList
          ListHeaderComponent={
            <>
              {/* Modal */}
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Bộ lọc</Text>

                    {/* Khoảng giá */}
                    <Text style={styles.label}>Khoảng giá (VND):</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 5,
                        backgroundColor: "lightgray",
                        borderRadius: 10,
                      }}
                    >
                      <TextInput
                        style={styles.inputPriceFilter}
                        placeholder="Giá tối thiếu"
                        value={minPrice}
                        keyboardType="numeric"
                        maxLength={10}
                        onChangeText={(text) => setMinPrice(text)}
                      />
                      <Text style={{ marginHorizontal: 10 }}>đến</Text>
                      <TextInput
                        style={styles.inputPriceFilter}
                        placeholder="Giá tối đa"
                        value={maxPrice}
                        onChangeText={(text) => setMaxPrice(text)}
                      />
                    </View>
                    {/* Thời lượng */}
                    <Text style={styles.label}>
                      Thời gian hoàn thành từ dưới:
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={[
                          styles.option,
                          timeDuration === 30 ? { borderColor: "#2e6dff" } : {},
                        ]}
                        onPress={() =>
                          timeDuration != 30
                            ? setTimeDuration(30)
                            : setTimeDuration(0)
                        }
                      >
                        <Text style={{ textAlign: "center" }}>30 phút</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.option,
                          timeDuration === 60 ? { borderColor: "#2e6dff" } : {},
                        ]}
                        onPress={() =>
                          timeDuration != 60
                            ? setTimeDuration(60)
                            : setTimeDuration(0)
                        }
                      >
                        <Text style={{ textAlign: "center" }}>60 phút</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.option,
                          timeDuration === 90 ? { borderColor: "#2e6dff" } : {},
                        ]}
                        onPress={() =>
                          timeDuration != 90
                            ? setTimeDuration(90)
                            : setTimeDuration(0)
                        }
                      >
                        <Text style={{ textAlign: "center" }}>90 phút</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Kiểu khuôn mặt:</Text>
                    {/* Hiển thị theo các phần tử trong mảng faceShape */}
                    <FlatList
                      data={faceShape}
                      numColumns={2} // Hiển thị 2 cột
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.faceShapeOpt,
                            faceShapeSelected === item.id && {
                              borderColor: "#2e6dff",
                            },
                          ]}
                          onPress={() =>
                            faceShapeSelected != item.id
                              ? setFaceShapeSelected(item.id)
                              : setFaceShapeSelected(0)
                          }
                        >
                          <Text style={{ textAlign: "center" }}>
                            {item.kieu_khuon_mat}
                          </Text>
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={{ justifyContent: "center" }}
                    />

                    <View style={{ flexDirection: "row" }}>
                      {/* Nút Lọc */}
                      <TouchableOpacity
                        style={styles.cancelFilter}
                        onPress={() => {
                          setMinPrice("");
                          setMaxPrice("");
                          setTimeDuration(0);
                          setFaceShapeSelected(0);
                          if (gender === "") {
                            setHairList(hairList2);
                          } else {
                            handleFilter();
                          }
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.cancelBtnText}>Hủy lọc</Text>
                      </TouchableOpacity>

                      {/* Nút Lọc */}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          handleFilter();
                        }}
                      >
                        <Text style={styles.closeButtonText}>Áp dụng</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.searchBar}>
                  <Icon name="search" size={20} color="#555" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiểu tóc..."
                    placeholderTextColor="#999"
                    value={timKiem}
                    onChangeText={(text) => setTimKiem(text)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.btnFaceScan}
                  onPress={() => {
                    if (user === null) {
                      ToastAndroid.show(
                        "Vui lòng đăng nhập để sử dụng tính năng này",
                        2000
                      );
                    } else {
                      router.push("/pickFace");
                    }
                  }}
                >
                  <Icon name="camera" size={20} color="#555" />
                  <Text style={{ fontSize: 12, fontWeight: "600" }}>
                    Nhận gợi ý
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
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
                  onPress={() => {
                    getFaceShape();
                    setModalVisible(true);
                  }}
                  style={{
                    paddingHorizontal: 10,
                    marginRight: 10,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    // Nếu có bộ lọc thì màu viền xanh
                    borderColor:
                      minPrice !== "" ||
                      maxPrice !== "" ||
                      timeDuration !== 0 ||
                      faceShapeSelected !== 0
                        ? "#FFA500"
                        : "#ddd",
                  }}
                >
                  <FontAwesome
                    name="filter"
                    size={20}
                    color={
                      minPrice !== "" ||
                      maxPrice !== "" ||
                      timeDuration !== 0 ||
                      faceShapeSelected !== 0
                        ? "#FFA500"
                        : "#555"
                    }
                  />
                </TouchableOpacity>
              </View>
            </>
          }
          data={hairList}
          keyExtractor={(item: HairList) => item.id.toString()}
          numColumns={2}
          key={`flatlist-columns-2`}
          renderItem={({ item }) => (
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <HairCardItem {...item} />
            </View>
          )}
        />
      </SafeAreaView>
      <>
        <TouchableOpacity
          onPress={
            // Kiểm tra nếu user null thì chuyển hướng đến trang đăng nhập
            () => {
              if (user === null) {
                router.push("/login");
              } else {
                router.push("/bookAppt");
              }
            }
          }
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            width: 65,
            height: 65,
            borderRadius: 50,
            backgroundColor: "#E38E49",
          }}
        >
          <Icon
            style={{}}
            name="document-text-outline"
            size={30}
            color="#fff"
          />
          <Text style={{ color: "#fff", fontSize: 12 }}>Đặt lịch</Text>
        </TouchableOpacity>
      </>
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
  btnFaceScan: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
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
  badge: {
    width: 20,
    height: 20,
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    padding: 3,
  },
  badgeText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 10,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },

  inputPriceFilter: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingVertical: 5,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  resultText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  cancelFilter: {
    flex: 1,
    marginHorizontal: 2,
    marginTop: 20,
    backgroundColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    flex: 1,
    marginHorizontal: 2,
    marginTop: 20,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  faceShapeOpt: {
    flex: 1,
    paddingVertical: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
