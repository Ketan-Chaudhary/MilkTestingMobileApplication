import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCameraFormat,
} from 'react-native-vision-camera';
import ImagePicker from 'react-native-image-crop-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, typography} from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const CameraScreen: React.FC<Props> = ({route, navigation}) => {
  const camera = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off'); // Flash state
  const device = useCameraDevice('back');

  const format = useCameraFormat(device, [
    {photoAspectRatio: 4 / 3},
    {photoResolution: 'max'},
    {fps: 30},
  ]);

  const GridOverlay = () => (
    <View style={styles.gridContainer}>
      <View style={styles.stripGuide}>
        <View style={styles.guideNotchTop} />
        <View style={styles.guideNotchBottom} />
      </View>
    </View>
  );

  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (status !== 'granted') {
          Alert.alert(
            'Permission required',
            'Camera access is needed to take photos',
          );
          navigation.goBack();
        }
      } else if (!hasPermission) {
        const requested = await requestPermission();
        if (!requested) {
          Alert.alert(
            'Permission required',
            'Camera access is needed to take photos',
          );
          navigation.goBack();
        }
      }
    };

    checkPermissions();
  }, [hasPermission, requestPermission, navigation]);

  // Capture and crop image
  const captureImage = async () => {
    if (!camera.current || !device) {
      Alert.alert('Error', 'Camera not ready');
      return;
    }

    setLoading(true);
    try {
      const photo = await camera.current.takePhoto({
        flash: flashMode, // Use flash mode here
        enableShutterSound: false,
      });

      // Crop image using react-native-image-crop-picker
      const croppedImage = await ImagePicker.openCropper({
        path: `file://${photo.path}`,
        width: 300,
        height: 1200,
        cropping: true,
        mediaType: 'photo',
        cropperCircleOverlay: false,
        compressImageQuality: 0.9,
        freeStyleCropEnabled: true,
        cropperCancelText: 'Cancel',
        cropperChooseText: 'Select',
      });

      setCapturedPhoto(croppedImage.path);
      setIsActive(false);
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    setIsActive(true);
  };

  // Analyze the captured image
  const analyzeImage = async (imagePath: string) => {
    if (!imagePath) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: `file://${imagePath}`,
        type: 'image/jpeg',
        name: 'test.jpg',
      } as any);

      const response = await fetch('http://35.154.224.216:8160/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (data?.result) {
        await storeResultLocally(route.params.test, data.result);
        navigation.navigate('Results', {result: data.result});
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger image analysis
  const handleAnalyze = async () => {
    if (capturedPhoto) {
      await analyzeImage(capturedPhoto);
    }
  };

  // Store result locally
  const storeResultLocally = async (test: string, result: string) => {
    try {
      const existingResults = await AsyncStorage.getItem('testResults');
      const resultsArray = existingResults ? JSON.parse(existingResults) : [];
      resultsArray.push({
        test,
        result,
        date: new Date().toISOString(),
      });
      await AsyncStorage.setItem('testResults', JSON.stringify(resultsArray));
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

  // Flash toggle function
  const toggleFlashMode = () => {
    if (flashMode === 'off') {
      setFlashMode('on');
    } else if (flashMode === 'on') {
      setFlashMode('auto');
    } else {
      setFlashMode('off');
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.permissionText}>Requesting camera access...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={typography.title}>Camera not available</Text>
        <Text style={styles.permissionText}>
          Could not access camera device
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <>
          <Image
            source={{uri: `file://${capturedPhoto}`}}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
          />
          <View style={styles.previewButtonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.retakeButton]}
              onPress={handleRetake}>
              <Icon name="camera-retake" size={24} color={colors.surface} />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.analyzeButton]}
              onPress={handleAnalyze}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <>
                  <Icon name="magnify" size={24} color={colors.surface} />
                  <Text style={styles.buttonText}>Analyze</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            photo={true}
            format={format}
          />
          <GridOverlay />
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={captureImage}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.surface} size={32} />
              ) : (
                <Icon name="camera-iris" size={40} color={colors.surface} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={toggleFlashMode}>
              <Icon
                name={
                  flashMode === 'off'
                    ? 'flash-off'
                    : flashMode === 'on'
                    ? 'flash'
                    : 'flash-auto'
                }
                size={30}
                color={colors.surface}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  gridContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  stripGuide: {
    width: '20%',
    height: '80%',
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'relative',
  },
  guideNotchTop: {
    position: 'absolute',
    top: -2,
    left: '50%',
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginLeft: -20,
  },
  guideNotchBottom: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginLeft: -20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 20,
    elevation: 5,
    shadowColor: colors.text,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  previewButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
  },
  retakeButton: {
    backgroundColor: colors.secondary,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...typography.body,
    marginLeft: 10,
    color: colors.surface,
    fontWeight: 'bold',
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default CameraScreen;
