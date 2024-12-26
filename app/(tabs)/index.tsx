import HairCardItem from "@/components/HairCardItem";
import ListHair from "@/components/ListHair";
import Slider from "@/components/Slider";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "../../Localhost";
import { useUser } from "@/context/UserContext";

const Placeholder = require("../../assets/images/background-image.png");
const { width } = Dimensions.get("window");

export default function Index() {
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0); // Để theo dõi chỉ mục hiện tại
  const [hairList, setHairList] = useState<Array<object>>([]); 
  const { user, setUser } = useUser();
  const [services, setServices] = useState<Array<object>>([]);

  interface Poster {    
    id: number;
    tieu_de: string;
    noi_dung: string;
    ngay_dang: string;
    id_tai_khoan: number;
    hien_thi: boolean;
    hinh_anh: string;
    createdAt: string;
    updatedAt: string;
  }

  const [posters, setPosters] = useState<Array<Poster>>([]);

  const [timKiem, setTimKiem] = useState("");

  useEffect(() => {
    if (isFocused) {
      getHairList();
      getServices();
      getPosters();
    }
  }, [isFocused]);

  const getHairList = async () => {
    ///api/customers/getAllHairStyles
    const response = await fetch(
      `${API_BASE_URL}/api/customers/getAllHairStyles`
    );
    const data = await response.json();
    setHairList(data.data);
  };
  const getServices = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/services/getAllServices`
    );
    const data = await response.json();
    setServices(data);
  }

  const getPosters = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/posters/getAllPosters`
    );
    const data = await response.json();
    setPosters(data);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView style={styles.scrollView}>
          {/* Thanh tìm kiếm */}
          

          {/* Slider hình ảnh */}
          <Slider posters={posters} />

          {/* Label Dịch vụ */}
          <View style={styles.genderHair}>
            <Text style={styles.labelText}>Dịch vụ</Text>

            <TouchableOpacity
              onPress={() => {
                console.log(hairList);
              }}
              style={{ marginRight: 10 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text>Xem tất cả</Text>
                <Icon
                  style={{ marginTop: 2 }}
                  name="chevron-forward"
                  size={20}
                  color="#555"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Danh sách dịch vụ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: 10 }}
          >
            <View style={{ flexDirection: "row" }}>
              {services.map((item: any, index: number) => (
                <TouchableOpacity key={index} style={{ marginRight: 10 }}>
                <Image
                  source={item.hinh_anh}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
                <Text style={{ textAlign: "center" }}>{item.ten_dich_vu}</Text>
              </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Label Kiểu tóc nam */}
          <View style={styles.genderHair}>
            <Text style={styles.labelText}>Kiểu tóc nam</Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname:"/(tabs)/hairList",
                  params:{gioi_tinh:"Nam"}
                });
              }}
              style={{ marginRight: 10 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text>Xem tất cả</Text>
                <Icon
                  style={{ marginTop: 2 }}
                  name="chevron-forward"
                  size={20}
                  color="#555"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Danh sách kiểu tóc nam*/}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollListHair}
          >
            <View style={{ flexDirection: "row" }}>
                {hairList.map((item: any, index: number) => (
                  item.gioi_tinh === "Nam" && index < 4 && (
                    <HairCardItem key={index} {...item} />
                  )
                ))}

            </View>
          </ScrollView>
          {/* Label Kiểu tóc nữ */}
          <View style={styles.genderHair}>
            <Text style={styles.labelText}>Kiểu tóc nữ</Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname:"/(tabs)/hairList",
                  params:{gioi_tinh:"Nữ"}
                });
              }}
              style={{ marginRight: 10 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text>Xem tất cả</Text>
                <Icon
                  style={{ marginTop: 2 }}
                  name="chevron-forward"
                  size={20}
                  color="#555"
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* Danh sách kiểu tóc nữ*/}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollListHair}
          >
            <View style={{ flexDirection: "row" }}>
              
            <View style={{ flexDirection: "row" }}>
              {hairList.map((item: any, index: number) => (
                item.gioi_tinh === "Nữ" && index < 4 && (
                  <HairCardItem key={index} {...item} />
                )
              ))}
            </View>
            </View>
          </ScrollView>
        </ScrollView>
        <TouchableOpacity 
        onPress={
          // Kiểm tra nếu user null thì chuyển hướng đến trang đăng nhập
          () => {
            if(user === null){
              router.push("/login");
            }else{
              router.push("/bookAppt")
            }
          }
        }
        style={{
          position:"absolute",
          bottom:10,
          right:10,
          alignItems:"center",
          justifyContent:"center",
          alignContent:"center",
          width:65, height:65, borderRadius:50, backgroundColor:"#E38E49"}}>
            <Icon style={{}} name="document-text-outline" size={30} color="#fff"/>
            <Text style={{color:"#fff", fontSize:12}}>Đặt lịch</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
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
  imageSlider: {
    width: width - 10,
    height: 180,
    borderRadius: 18,
    marginHorizontal: 5,
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#555",
  },
  genderHair: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    // verticalAlign:"bottom",
  },
  labelText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  scrollListHair: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  imageListHair: {
    width: 200,
    height: 130,
    borderRadius: 10,
  },
});
