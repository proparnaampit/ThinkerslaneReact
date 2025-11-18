import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import addOrderStyles from '../../screens/order/addOrderStyles';

interface QRScannerProps {
  isVisible: boolean;
  onCodeScanned: (code: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  isVisible,
  onCodeScanned,
  onClose,
}) => {
  const device = useCameraDevice('back');
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cornerPulseAnim = useRef(new Animated.Value(1)).current;

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'], // 👈 only QR codes
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0].value) {
        onCodeScanned(codes[0].value);
      }
    },
  });

  useEffect(() => {
    if (isVisible) {
      // Scan line animation (loop up and down)
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

      // Corner pulse animation (scale in/out)
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
        <TouchableOpacity style={addOrderStyles.fetchButton} onPress={onClose}>
          <Text style={addOrderStyles.fetchButtonText}>Close Scanner</Text>
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
        {/* Animated scan line */}
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [
                {
                  translateY: scanLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 140],
                  }),
                },
              ],
            },
          ]}
        />
        {/* Animated pulsing corners */}
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
        style={[addOrderStyles.fetchButton, styles.closeButton]}
        onPress={onClose}>
        <Text style={addOrderStyles.fetchButtonText}>Close Scanner</Text>
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
    height: 250,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 220,
    height: 180,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
  },
  scanLine: {
    width: 200,
    height: 2,
    backgroundColor: '#00FF00',
    position: 'absolute',
    top: 35,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 35,
    left: 60,
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 35,
    right: 60,
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 35,
    left: 60,
    width: 25,
    height: 25,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 35,
    right: 60,
    width: 25,
    height: 25,
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

export default QRScanner;
