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

const Placeholder = require("../../assets/images/background-image.png");
const { width } = Dimensions.get("window");

export default function Index() {
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0); // Để theo dõi chỉ mục hiện tại
  const [hairList, setHairList] = useState<Array<object>>([]); 

  // Danh sách hình ảnh
  const images = [
    Placeholder,
    Placeholder,
    Placeholder,
    Placeholder,
    Placeholder,
  ];

  const [timKiem, setTimKiem] = useState("");

  useEffect(() => {
    if (isFocused) {
      getHairList();
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


  // Hàm xử lý khi cuộn
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView style={styles.scrollView}>
          {/* Thanh tìm kiếm */}
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#555" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm dịch vụ..."
              placeholderTextColor="#999"
              value={timKiem}
              onChangeText={(text) => setTimKiem(text)}
            />
          </View>

          {/* Slider hình ảnh */}
          <Slider images={images} />

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
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Image
                  source={Placeholder}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
                <Text style={{ textAlign: "center" }}>Dịch vụ 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Image
                  source={Placeholder}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
                <Text style={{ textAlign: "center" }}>Dịch vụ 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Image
                  source={Placeholder}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
                <Text style={{ textAlign: "center" }}>Dịch vụ 3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Image
                  source={Placeholder}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
                <Text style={{ textAlign: "center" }}>Dịch vụ 4</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Label Kiểu tóc nam */}
          <View style={styles.genderHair}>
            <Text style={styles.labelText}>Kiểu tóc nam</Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname:"/(tabs)/hairList",
                  params:{gioi_tinh:"male"}
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
                item.gioi_tinh === "Nam" && (
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
                  params:{gioi_tinh:"female"}
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
                item.gioi_tinh === "Nữ" && (
                  <HairCardItem key={index} {...item} />
                )
              ))}
            </View>
            </View>
          </ScrollView>
        </ScrollView>
        <TouchableOpacity 
        onPress={() => router.push("/bookAppt")}
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
