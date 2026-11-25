import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import informationStyles from './css/information';
import {useFormContext} from '../context/FormContextType';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import Toast from 'react-native-toast-message';
import MLKitOcr from 'react-native-mlkit-ocr';
import axios from 'axios';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

const LongDescription = () => {
  const {formData, updateFormData} = useFormContext();
  const [longDescription, setLongDescription] = useState(
    formData.information?.longDescription || '',
  );

  const [showCamera, setShowCamera] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const camera = useRef<Camera>(null);

  const device: any = useCameraDevice('back');

  const captureAndScan = async () => {
    if (!camera.current) return;

    const photo = await camera.current.takePhoto({flash: 'on'});
    const fileUri = `file://${photo.path}`;

    try {
      const textBlocks = await MLKitOcr.detectFromUri(fileUri);
      const combinedText = textBlocks
        .map(b => b.text.trim())
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (combinedText && combinedText.length > 0) {
        setLongDescription(combinedText);
      } else {
        const path =
          Platform.OS === 'android'
            ? photo.path
            : photo.path.replace('file://', '');
        const base64Image = await RNFS.readFile(path, 'base64');

        const formData = new FormData();
        formData.append('apikey', 'K84224185188957');
        formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
        formData.append('language', 'ben');

        const response = await axios.post(
          'https://api.ocr.space/parse/image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        const parsedText = response.data?.ParsedResults?.[0]?.ParsedText || '';
        setLongDescription(parsedText.trim().replace(/\s+/g, ' '));
      }

      setShowCamera(false);
    } catch (error) {
      console.error('OCR Error:', error);
      Toast.show({
        type: 'error',
        text1: 'OCR failed',
        text2: 'Please try again.',
      });
    }
  };

  const openCamera = async (type: 'camera' | 'scanner') => {
    const permission: any = await Camera.requestCameraPermission();
    if (permission === 'granted') {
      if (type === 'camera') {
        setShowScanner(false);
        setShowCamera(true);
      } else if (type === 'scanner') {
        setShowCamera(false);
        setShowScanner(true);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Camera permission denied',
      });
    }
  };

  const format = useCameraFormat(device, [
    {photoResolution: {width: 1280, height: 720}},
  ]);
  useEffect(() => {
    updateFormData('information', {
      longDescription,
    });
  }, [longDescription]);

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.label}>Long Description:</Text>
      <TouchableOpacity
        style={[informationStyles.cameraButton, {marginLeft: 5}]}
        onPress={() => openCamera('camera')}>
        <MaterialIcons
          name="linked-camera"
          size={32}
          color={showScanner ? 'red' : '#223d79'}
          style={{marginLeft: 5}}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        {/* Camera Modal */}
        <Modal visible={showCamera} animationType="slide">
          <View style={styles.modalContent}>
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={showCamera}
              format={format}
              photo={true}
              photoQualityBalance="quality"
            />
            {/* Overlays */}
            <View style={styles.topOverlay} />
            <View style={styles.bottomOverlay} />
            <View style={styles.leftOverlay} />
            <View style={styles.rightOverlay} />
            <View style={styles.frame} />

            <TouchableOpacity
              onPress={captureAndScan}
              style={styles.captureButton}>
              <Text>Capture & OCR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.captureclose,
                {marginBottom: 70, backgroundColor: '#223d79'},
              ]}
              onPress={() => setShowCamera(false)}>
              <Text style={styles.closescanner}>Close Scanner</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      <TextInput
        style={[informationStyles.input, {height: 550}]}
        placeholder="Enter Long Description"
        value={longDescription}
        onChangeText={value => {
          setLongDescription(value);
          updateFormData('information', {
            ...formData.basic_information,
            longDescription: value,
          });
        }}
        multiline
      />
    </ScrollView>
  );
};

export default LongDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    height: '50%',
    justifyContent: 'center',
  },
  camera: {
    flex: 0.5,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  leftOverlay: {
    position: 'absolute',
    top: '30%',
    bottom: '30%',
    left: 0,
    width: '10%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rightOverlay: {
    position: 'absolute',
    top: '30%',
    bottom: '30%',
    right: 0,
    width: '10%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  frame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: '40%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
  },
  captureclose: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 50,
  },
  closescanner: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
