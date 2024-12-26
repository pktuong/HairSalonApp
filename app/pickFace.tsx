import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

import * as FileSystem from "expo-file-system";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "@/Localhost";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
const screenWidth = Dimensions.get("window").width;

export default function PickFace() {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [hairList, setHairList] = useState<Array<HairList>>([]);
  const [hairList2, setHairList2] = useState<Array<HairList>>([]);

  const { user, setUser } = useUser();
  const { booking, setBooking } = useBooking();
  const [rating, setRating] = useState("");
  interface HairList {
    id: number;
    ten_kieu_toc: string;
    gia_tien: number;
    mo_ta: string;
    gioi_tinh: string;
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
  // const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] =
  //   MediaLibrary.usePermissions();
  const router = useRouter();
  // const [previousImage, setPreviousImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [gender, setGender] = useState("");

  const genderOptions = [
    { label: "Chọn tất cả", value: "" },
    { label: "Kiểu tóc nam", value: "Nam" },
    { label: "Kiểu tóc nữ", value: "Nữ" },
  ];
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Bạn cần cấp quyền truy cập camera để sử dụng tính năng này
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      Alert.alert(
        "Ảnh đã được chụp!",
        "Hãy chọn vùng khuôn mặt để kết quả chính xác hơn",
        [
          {
            text: "OK",
            onPress: async () => {
              const asset = await MediaLibrary.createAssetAsync(
                takedPhoto!.uri
              );
              pickImage();
            },
          },
        ]
      );
    }
  };

  // const savePicture = async () => {
  //   if (photo) {
  //     try {
  //       const asset = await MediaLibrary.createAssetAsync(photo.uri);
  //       Alert.alert("Ảnh đã được lưu!");
  //       // setPhoto(null);
  //       getLastSavedImage();
  //     } catch (err) {
  //       console.error("Error while saving the picture:", err);
  //     }
  //   }
  // };

  // const getLastSavedImage = async () => {
  //   if (mediaLibraryPermissionResponse?.status === "granted") {
  //     const dcimAlbum = await MediaLibrary.getAlbumAsync("DCIM");
  //     if (dcimAlbum) {
  //       const { assets } = await MediaLibrary.getAssetsAsync({
  //         album: dcimAlbum,
  //         sortBy: [[MediaLibrary.SortBy.creationTime, false]],
  //         mediaType: MediaLibrary.MediaType.photo,
  //         first: 1,
  //       });
  //       if (assets.length > 0) {
  //         setPhoto(assets[0].uri);
  //       } else {
  //         setPreviousImage(null);
  //       }
  //     } else {
  //       setPreviousImage(null);
  //     }
  //   }
  // };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const FaceShapeList = [
    {
      eng: "Oval",
      vn: "Mặt trái xoan",
    },
    {
      eng: "Round",
      vn: "Mặt tròn",
    },
    {
      eng: "Square",
      vn: "Mặt vuông",
    },
    {
      eng: "Oblong",
      vn: "Mặt dài",
    },
    {
      eng: "Heart",
      vn: "Mặt trái tim",
    },
  ];
  const getHairSuggest = async () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", {
      uri: photo,
      name: "image.jpg",
      type: "image/jpg",
    } as any);
    const response = await fetch(`https://faceshapebe.onrender.com/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
    if (response.ok) {
      const result = await response.json();
      setRating(result.confidence.toString());
      //Lấy kiểu tóc dựa vào result.shape so sánh với FaceShapeList và gọi API
      const faceShape = result.shape;
      const faceShapeName = FaceShapeList.find(
        (shape) => shape.eng === faceShape
      )?.vn;
      console.log(faceShapeName);
      const response2 = await fetch(
        `${API_BASE_URL}/api/getHairStylesByFaceShape/${faceShapeName}`,
        {
          method: "GET",
        }
      );
      if (response2.ok) {
        const result2 = await response2.json();
        setHairList(result2.data);
        setHairList2(result2.data);
      } else {
        throw new Error(`Error getting hair styles: ${response2.statusText}`);
      }
    } else {
      throw new Error(`Error creating appointment: ${response.statusText}`);
    }
    setLoading(false);
  };

  
    const handleFilter = (gt:string) => {
      let filteredList = hairList2;
      if (gt !== "") {
        filteredList = filteredList.filter(
          (hairstyle) => hairstyle.gioi_tinh === gt
        );
      }
      if (filteredList.length === 0) {
        setHairList([])
      }else{
        setHairList(filteredList)
      }
    };

  


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        {hairList2.length > 0 ? (
          <FlatList
            ListHeaderComponent={
              <View style={{ flex: 1 }}>
                {/* Button back */}
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 20,
                    left: 15,
                    zIndex: 1,
                    padding: 1,
                    borderRadius: 50,
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                  onPress={() => router.back()}
                >
                  <Icon name="chevron-back" size={30} color="#fff" />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    marginTop: 80,
                  }}
                >
                  Khuôn mặt của bạn có tỉ lệ {rating}% là :
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    marginVertical: 20,
                  }}
                >
                  {
                    hairList2[0].kieu_toc_phu_hop[0].kieu_khuon_mat_phu_hop
                      .kieu_khuon_mat
                  }
                </Text>
                <Text style={{ textAlign: "center", fontSize: 20, margin: 10 }}>
                  Các kiểu tóc phù hợp với bạn:
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={genderOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn kiểu tóc"
                  value={gender}
                  onChange={(item) => {
                    setGender(item.value)
                    handleFilter(item.value)
                  }}
                />
              </View>
            }
            data={hairList}
            keyExtractor={(item: HairList) => item.id.toString()}
            numColumns={2}
            key={`flatlist-columns-2`}
            renderItem={({ item }) => (
              <View style={{ marginLeft: 10, marginTop: 10 }}>
                <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/hairDetail",
                    params: { item: JSON.stringify(item) },
                  })
                }
                style={styles.cardContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={item.hinh_anh_kieu_toc[0].url_anh}
                      style={styles.image}
                    />
                  </View>

                  {/* Tên và thông tin dịch vụ */}
                  <View style={styles.infoContainer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceName}>
                        {item.ten_kieu_toc}
                      </Text>
                      <Text style={styles.serviceDetails}>{item.gia_tien}</Text>
                    </View>

                    {/* Biểu tượng đặt lịch hẹn */}
                    <TouchableOpacity
                      // onPress={() => router.push("/bookAppt")}
                      //in ra thong tin cua kieu toc
                      onPress={() => {
                        if (booking) {
                          // Tạo bản sao của chi_tiet_phieu_dat
                          const updatedChiTietPhieuDat = [
                            ...booking.chi_tiet_phieu_dat,
                          ];
                          // Cập nhật kiểu tóc cho phần tử đầu tiên
                          if (updatedChiTietPhieuDat[0]) {
                            updatedChiTietPhieuDat[0] = {
                              ...updatedChiTietPhieuDat[0], // Giữ nguyên các thuộc tính khác
                              kieu_toc: {
                                id_kieu_toc: item.id, // Cập nhật id kiểu tóc
                                ten_kieu_toc: item.ten_kieu_toc,
                                gia: Number(item.gia_tien),
                                hinh_anh: item.hinh_anh_kieu_toc[0].url_anh,
                              }, // Cập nhật kieu_toc
                            };
                          }
                          // Cập nhật lại booking với chi_tiet_phieu_dat mới
                          setBooking({
                            ...booking, // Giữ nguyên các thuộc tính khác của booking
                            chi_tiet_phieu_dat: updatedChiTietPhieuDat, // Gán chi_tiet_phieu_dat mới
                          });
                        } else {
                          const now = new Date();
                          const today = new Date(
                            now.getTime() + 7 * 60 * 60 * 1000
                          );

                          const tomorow = new Date();
                          tomorow.setDate(tomorow.getDate() + 1);
                          const data = {
                            id_tai_khoan: user!.id,
                            ngay_hen: tomorow,
                            gio_hen: "",
                            phuong_thuc_thanh_toan: "Tiền mặt",
                            tong_tien: 0,
                            thoi_gian_dat: today,
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
                          };
                          setBooking(data);
                        }
                        router.push("/bookAppt");
                      }}
                      style={styles.iconBookingContainer}
                    >
                      <Icon name="calendar" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  {/* </View> */}
                </TouchableOpacity>
              </View>
            )}
          />
        ) : !photo ? (
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            {/* Button back */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 15,
                left: 15,
                zIndex: 1,
                padding: 1,
                borderRadius: 50,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              onPress={() => router.back()}
            >
              <Icon name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Tạo một khung elip để bao quanh khuôn mặt */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  zIndex: 1,
                  marginTop: 100,
                  width: 350,
                  height: 550,
                  borderColor: "#fff",
                  borderWidth: 2,
                  borderRadius: 10,
                }}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { width: 50, height: 50 }]}
                onPress={toggleCameraFacing}
              >
                <AntDesign name="retweet" size={27} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 2 }]}
                onPress={handleTakePhoto}
              >
                <AntDesign name="camera" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { width: 50, height: 50 }]}
                onPress={pickImage}
              >
                <Icon name="image" size={27} color="#fff" />
              </TouchableOpacity>

              {/* {photo && <Image source={{ uri: "data:image/jpg;base64," + photo.base64  }} style={{width:100, height:100}} />} */}
            </View>
          </CameraView>
        ) : (
          <View
            style={{
              backgroundColor: "black",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 15,
                left: 15,
                zIndex: 1,
                padding: 1,
                borderRadius: 50,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              onPress={() => router.back()}
            >
              <Icon name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: photo }}
              style={{ flex: 1, resizeMode: "contain", margin: 90 }}
            />
            <View style={styles.bottomControlsContainer}>
              <TouchableOpacity
                style={{
                  backgroundColor: "blue",
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() =>
                  // setPhoto(null)
                  getHairSuggest()
                }
              >
                <Text style={styles.buttonText}>Nhận gợi ý</Text>
              </TouchableOpacity>
            </View>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: 10 }}>Đang xử lý...</Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    margin: 64,
  },
  button: {
    // flex: 1,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "darkgray",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },

  bottomControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
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
