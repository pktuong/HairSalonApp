import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { ImageSourcePropType, ScrollView, StyleSheet, View } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
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
export default function Slider({ posters }: { posters: Poster[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
    const router = useRouter();
  
 
  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: any } };
  }) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {posters.map((poster, index) => (
          <TouchableOpacity key={index} onPress={() => router.push({pathname:"/posterDetail", params:{poster:JSON.stringify(poster)}}) }>
          <Image key={index} source={{ uri: poster.hinh_anh }} style={styles.imageSlider} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.indicatorsContainer}>
        {posters.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    imageSlider: {
      width: width-10,
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
  });
