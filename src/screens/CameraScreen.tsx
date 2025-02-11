import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const CameraScreen: React.FC<Props> = ({route, navigation}) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const captureImage = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: false,
    };

    launchCamera(options, async response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0]?.uri ?? null;
        setImage(uri);
        if (uri) await analyzeImage(uri);
      }
    });
  };

  const analyzeImage = async (imageUri: string) => {
    if (!imageUri) return;

    setLoading(true);
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
      navigation.navigate('Results', {result: data.result}); // Navigate to Results screen
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.test} Test</Text>
      {image && <Image source={{uri: image}} style={styles.image} />}
      <TouchableOpacity
        style={styles.button}
        onPress={captureImage}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Capture Image'}
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#6200ee" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
