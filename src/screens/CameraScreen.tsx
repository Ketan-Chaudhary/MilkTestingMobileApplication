import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const CameraScreen: React.FC<Props> = ({route, navigation}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const captureImage = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: false,
    };

    launchCamera(options, response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0]?.uri ?? null;
        setImage(uri);
      } else if (response.errorCode) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    });
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Please capture an image first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'test.jpg',
    } as any);

    try {
      const response = await fetch('http://65.0.99.47:8160/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (data?.result) {
        navigation.navigate('Results', {result: data.result});
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.test} Test</Text>

      {image ? (
        <Image source={{uri: image}} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image captured</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={captureImage}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {image ? 'Recapture Image' : 'Capture Image'}
        </Text>
      </TouchableOpacity>

      {image && (
        <TouchableOpacity
          style={[styles.button, styles.analyzeButton]}
          onPress={analyzeImage}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </Text>
        </TouchableOpacity>
      )}

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
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  placeholder: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  analyzeButton: {
    backgroundColor: '#03dac6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
