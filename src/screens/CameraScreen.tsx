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
    if (!image) return;
    setLoading(true);

    // Simulated API delay for result analysis
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Results', {result: 'Test Result: Positive'});
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.test} Test</Text>

      {image ? (
        <Image source={{uri: image}} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Align sample inside frame</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={captureImage}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {image ? 'Retake Image' : 'Capture Image'}
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
