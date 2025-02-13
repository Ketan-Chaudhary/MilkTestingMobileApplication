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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, typography} from '../styles';

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

  // Function to store the test result locally
  const storeResultLocally = async (test: string, result: string) => {
    try {
      // Fetch existing results from AsyncStorage
      const existingResults = await AsyncStorage.getItem('testResults');
      const resultsArray = existingResults ? JSON.parse(existingResults) : [];

      // Add the new result
      const newResult = {
        test,
        result,
        date: new Date().toISOString(), // Add a timestamp
      };
      resultsArray.push(newResult);

      // Save the updated results back to AsyncStorage
      await AsyncStorage.setItem('testResults', JSON.stringify(resultsArray));
    } catch (error) {
      console.error('Failed to save result:', error);
    }
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
      const response = await fetch('http://65.2.69.148:8160/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (data?.result) {
        // Store the result locally before navigating
        await storeResultLocally(route.params.test, data.result);
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
      <Text style={typography.title}>{route.params.test} Test</Text>

      {image ? (
        <Image source={{uri: image}} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name="image-off" size={50} color={colors.textSecondary} />
          <Text style={typography.caption}>No image captured</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={captureImage}
        disabled={loading}>
        <Icon
          name={image ? 'camera-retake' : 'camera'}
          size={24}
          color={colors.surface}
        />
        <Text style={styles.buttonText}>
          {image ? 'Recapture Image' : 'Capture Image'}
        </Text>
      </TouchableOpacity>

      {image && (
        <TouchableOpacity
          style={[styles.button, styles.analyzeButton]}
          onPress={analyzeImage}
          disabled={loading}>
          <Icon name="magnify" size={24} color={colors.surface} />
          <Text style={styles.buttonText}>
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color={colors.primary} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  placeholder: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    justifyContent: 'center',
  },
  analyzeButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    ...typography.body,
    marginLeft: 10,
    color: colors.surface,
  },
});

export default CameraScreen;
