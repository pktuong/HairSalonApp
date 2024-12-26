import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'


export default function HairSuggest() {
    // const {faceImg} = useLocalSearchParams<{faceImg:string}>();
    // console.log(faceImg)
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
    return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        
    </View>
  )
}

const styles = StyleSheet.create({})