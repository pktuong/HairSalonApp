import { Image } from "expo-image";
import { useState } from "react";
import { ImageSourcePropType, ScrollView, StyleSheet, View } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Slider({ images }: { images: ImageSourcePropType[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

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
        {images.map((image, index) => (
          <Image key={index} source={image} style={styles.imageSlider} />
        ))}
      </ScrollView>

      <View style={styles.indicatorsContainer}>
        {images.map((_, index) => (
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
