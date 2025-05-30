import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import informationStyles from '../../screens/product/css/information';

interface BarcodeScannerProps {
  isVisible: boolean;
  onCodeScanned: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isVisible,
  onCodeScanned,
  onClose,
}) => {
  const device = useCameraDevice('back');
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cornerPulseAnim = useRef(new Animated.Value(1)).current;

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0].value) {
        onCodeScanned(codes[0].value);
      }
    },
  });

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(cornerPulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(cornerPulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
    return () => {
      scanLineAnim.setValue(0);
      cornerPulseAnim.setValue(1);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  if (!device) {
    return (
      <View style={styles.cameraContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
        <TouchableOpacity
          style={informationStyles.fetchButton}
          onPress={onClose}>
          <Text style={informationStyles.fetchButtonText}>Close Scanner</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [
                {
                  translateY: scanLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 120],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.cornerTopLeft,
            {transform: [{scale: cornerPulseAnim}]},
          ]}
        />
        <Animated.View
          style={[
            styles.cornerTopRight,
            {transform: [{scale: cornerPulseAnim}]},
          ]}
        />
        <Animated.View
          style={[
            styles.cornerBottomLeft,
            {transform: [{scale: cornerPulseAnim}]},
          ]}
        />
        <Animated.View
          style={[
            styles.cornerBottomRight,
            {transform: [{scale: cornerPulseAnim}]},
          ]}
        />
      </View>
      <TouchableOpacity
        style={[informationStyles.fetchButton, styles.closeButton]}
        onPress={onClose}>
        <Text style={informationStyles.fetchButtonText}>Close Scanner</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay for contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 140,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
  },
  scanLine: {
    width: 180,
    height: 2,
    backgroundColor: '#00FF00', // Green scan line
    position: 'absolute',
    top: 30, // Center within scan area (200 - 140 / 2)
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 25,
    left: 75,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 25,
    right: 75,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 25,
    left: 75,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 25,
    right: 75,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});

export default BarcodeScanner;
