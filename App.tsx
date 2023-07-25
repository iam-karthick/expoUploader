import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, ScrollView, Text, View, Button, Image, FlatList } from "react-native";
import * as FilesSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

const imageDir = FilesSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FilesSystem.getInfoAsync(imageDir);
  if (!dirInfo.exists) {
    await FilesSystem.makeDirectoryAsync(imageDir, { intermediates: true });
  }
};

export default function App() {
  const [images, setImg] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImg();
  }, []);

  const loadImg = async () => {
    await ensureDirExists();
    const files = await FilesSystem.readDirectoryAsync(imageDir);
    if (files.length > 0) {
      setImg(files.map((res) => imageDir + res));
    }
  };

  const selectImage = async (useLibrary: boolean) => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };
    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }
    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  const saveImg = async (URL: string) => {
    await ensureDirExists();
    const fileName = "img" + new Date().getTime() + ".jpg";
    const dist = imageDir + fileName;
    await FileSystem.copyAsync({ from: URL, to: dist });
    setImg([...images, dist]);
  };

  //Delete Image
  const deleteImage = async (uri:string) =>{
    await FilesSystem.deleteAsync(uri);
    setImg(images.filter((res)=>res != uri))
  }

  //Upload Image
  const uploadImage = async(uri:string)=>{
  //setLoading(true);
  //------------- add your backend config --------------//
  // setLoading(false);
  }

  // UI For Images
  const renderItem =({item}:{item: string})=>{
    const fileName = item.split('/').pop();

    return(
      <View style={{flexDirection:"row",margin:1,alignItems:'center',gap:5}}>
        <Image style={{width:80,height:80}} source={{uri:item}}/>
        <Text style={{flex:1}}>{fileName}</Text>
        <Ionicons.Button name="cloud-upload" onPress={()=> uploadImage(item)}/>
        <Ionicons.Button name="trash" onPress={()=> deleteImage(item)}/>
      </View>
    )
  }

  // Main UI
  return (
    <SafeAreaView style={{ flex: 1, gap: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 20,
        }}
      >
        <Button title="Gallery" onPress={() => selectImage(true)} />
        <Button title="Capture" onPress={() => selectImage(false)} />
      </View>

      <Text style={{textAlign:'center',fontSize:20,fontWeight:500}}>Gallery</Text>
      <FlatList data={images} renderItem={renderItem}/>
      <ScrollView>
          
      </ScrollView>
    </SafeAreaView>
  );
}
