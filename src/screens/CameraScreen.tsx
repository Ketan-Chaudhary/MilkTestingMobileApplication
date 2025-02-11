import React, {useState} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const CameraScreen: React.FC<Props> = ({route}) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const captureImage = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: false,
    };

    launchCamera(options, async response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0]?.uri ?? null; // Handle undefined case
        setImage(uri);
        if (uri) await analyzeImage(uri);
      }
    });
  };

  const analyzeImage = async (imageUri: string) => {
    if (!imageUri) return; // Prevent null errors

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'test.jpg',
    } as any);

    try {
      const response = await fetch('http://43.204.214.166:8160/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.test} Test</Text>
      {image && <Image source={{uri: image}} style={styles.image} />}
      <Button title="Capture Image" onPress={captureImage} />
      {result ? <Text style={styles.result}>Result: {result}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  image: {width: 200, height: 200, marginTop: 10},
  result: {fontSize: 18, marginTop: 10, color: 'green'},
});

export default CameraScreen;
