import { Image } from "expo-image";
import { ImageSourcePropType } from "react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ListHair({
  images,
}: {
  images: ImageSourcePropType[];
}) {
  // funct click
  const handleClick = (index: number) => {
    console.log(`Clicked on image ${index}`);
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollListHair}
    >
      <View style={{ flexDirection: "row" }}>
        {images.map((image, index) => (
          <TouchableOpacity
            onPress={() => handleClick(index)}
            key={index}
            style={{ marginRight: 10 }}
          >
            <Image
              source={image}
              style={styles.imageListHair}
            />
            <Text style={{ textAlign: "center" }}>Kiểu tóc {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
