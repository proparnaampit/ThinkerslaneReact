import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert, Platform, PermissionsAndroid } from 'react-native';
import ImagePicker, { Image as PickedImage } from 'react-native-image-crop-picker';

interface FileData {
  uri: string;
  name: string | null;
  type: string | null;
}

const FilePickerComponent = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [formData, setFormData] = useState<FormData>(new FormData());

  // Pick multiple images
  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  const pickFile = async () => {
    

    try {
      const results: PickedImage[] = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        maxFiles: 5 - files.length,
        cropping: false,
        compressImageQuality: 0.8,
      });

      if (files.length + results.length > 5) {
        Alert.alert('Limit Reached', 'You can only select up to 5 images.');
        return;
      }

      const formattedResults: FileData[] = results.map((result, index) => ({
        uri: result.path,
        name: result.filename ?? `image${Date.now()}_${index}.jpg`,
        type: result.mime ?? 'image/jpeg',
      }));

      setFiles(prevFiles => [...prevFiles, ...formattedResults]);
    } catch (err: any) {
      if (err.message === 'User cancelled image selection') {
        console.log('User cancelled image picker');
      } else {
        console.error('Error picking images:', err);
        Alert.alert('Error', 'Failed to pick images. Please try again.');
      }
    }
  };

  // Remove a file
  const removeFile = (uri: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.uri !== uri));
  };

  // Update FormData when files change
  useEffect(() => {
    const newFormData = new FormData();
    files.forEach((file, index) => {
      const fileData: FileData = {
        uri: file.uri,
        name: file.name ?? `image${index}.jpg`,
        type: file.type ?? 'image/jpeg',
      };
      newFormData.append(`file${index}`, fileData as any);
    });
    setFormData(newFormData);
    console.log('FormData updated:', newFormData);
  }, [files]);

  // Upload files to server
  const uploadFiles = async () => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      Alert.alert('Success', 'Images uploaded successfully!');
      console.log('Upload response:', result);
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Failed to upload images. Please try again.');
    }
  };

  const replaceFile = async (uri: string) => {
    
    try {
      const result: PickedImage = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: false,
        cropping: false,
        compressImageQuality: 0.8,
      });
      const newFile: FileData = {
        uri: result.path,
        name: result.filename ?? `image${Date.now()}.jpg`,
        type: result.mime ?? 'image/jpeg',
      };
      setFiles(prevFiles => prevFiles.map(file => (file.uri === uri ? newFile : file)));
    } catch (err: any) {
      if (err.message === 'User cancelled image selection') {
        console.log('User cancelled image picker');
      } else {
        console.error('Error replacing image:', err);
        Alert.alert('Error', 'Failed to replace image.');
      }
    }
  };

  // Create pairs of files for two images per row
  const pairedFiles = [];
  for (let i = 0; i < files.length; i += 2) {
    pairedFiles.push(files.slice(i, i + 2));
  }



  // Render each image item
  const renderImageItem = useCallback(
    (item: FileData, index: number) => (
      <View key={item.uri} style={styles.imageWrapper}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.crossButton}
            onPress={() => removeFile(item.uri)}
          >
            <Text style={styles.crossButtonText}>×</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.replaceButton}
            onPress={() => replaceFile(item.uri)}
          >
            <Text style={styles.replaceButtonText}>Replace</Text>
          </TouchableOpacity>
          {index === 0 && (
            <View style={styles.coverBadge}>
              <Text style={styles.coverText}>Cover Image</Text>
            </View>
          )}
        </View>
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
      </View>
    ),
    [removeFile, replaceFile]
  );

  // Render each row (two images)
  const renderRow = ({ item, index }: { item: FileData[]; index: number }) => (
    <View style={styles.row} key={`row-${index}`}>
      {item[0] && renderImageItem(item[0], index * 2)}
      {item[1] && renderImageItem(item[1], index * 2 + 1)}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>The first image will serve as the cover image.</Text>
      <Text style={styles.header}>Gallery</Text>
      <Text style={styles.title}>File Picker</Text>

      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>
          {files.length < 5 ? `Choose Images (${5 - files.length} remaining)` : 'Replace Images'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, files.length === 0 && styles.disabledButton]}
        onPress={uploadFiles}
        disabled={files.length === 0}
      >
        <Text style={styles.buttonText}>Upload Images</Text>
      </TouchableOpacity>

      {files.length > 0 ? (
        <FlatList
          data={pairedFiles}
          renderItem={renderRow}
          keyExtractor={(_, index) => `row-${index}`}
          style={styles.fileList}
        />
      ) : (
        <Text style={styles.noFilesText}>No images selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  fileList: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  imageWrapper: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  crossButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  coverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  noFilesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  replaceButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 3,
  },
  replaceButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default FilePickerComponent;