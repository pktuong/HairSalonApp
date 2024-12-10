import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
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

      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  const savePicture = async () => {
    if (photo) {
      try {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert("Ảnh đã được lưu!", asset.uri);
        setPhoto(null);
        getLastSavedImage();
      } catch (err) {
        console.error("Error while saving the picture:", err);
      }
    }
  };
  const getLastSavedImage = async () => {
    if (mediaLibraryPermissionResponse?.status === "granted") {
      const dcimAlbum = await MediaLibrary.getAlbumAsync("DCIM");
      if (dcimAlbum) {
        const { assets } = await MediaLibrary.getAssetsAsync({
          album: dcimAlbum,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          mediaType: MediaLibrary.MediaType.photo,
          first: 1,
        });
        if (assets.length > 0) {
          setPreviousImage(assets[0].uri);
        } else {
          setPreviousImage(null);
        }
      } else {
        setPreviousImage(null);
      }
    }
  };
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };
  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          {/* Button back */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 25,
              left: 5,
              zIndex: 1,
              padding: 1,
              borderRadius: 50,
            }}
            onPress={() => router.back()}
          >
            <Icon name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <AntDesign name="retweet" size={44} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
              <AntDesign name="camera" size={44} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={pickImage}
            >
              <Icon name="image" size={44} color="black" />
            </TouchableOpacity>

            {photo && <Image source={{ uri: photo }} style={{width:100, height:100}} />}
          </View>
        </CameraView>
      ) : (
        <>
          <Image
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
            style={styles.camera}
          />
          <View style={styles.bottomControlsContainer}>
            <TouchableOpacity onPress={savePicture}>
              <Text style={styles.buttonText}>Lưu ảnh</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "gray",
    borderRadius: 10,
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
});
