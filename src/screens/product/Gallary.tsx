import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import ImagePicker, {
  Image as PickedImage,
} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import galleryStyles from './css/pricing';
import {useFormContext} from '../context/FormContextType';

interface FileData {
  id: string;
  uri: string;
  name: string | null;
  type: string | null;
}

const FilePickerComponent = () => {
  const {formData, addImage, removeImage, replaceImage} = useFormContext();

  const generateUniqueId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const pickFile = async () => {
    try {
      const currentImages: any = Array.isArray(formData?.images)
        ? formData.images
        : [];
      console.log(
        'Current image IDs before pick:',
        currentImages.map((img: any) => img.id),
      );

      const results: PickedImage[] = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        includeBase64: true,
        maxFiles: 5 - currentImages.length,
        cropping: false,
        compressImageQuality: 0.8,
      });

      if (currentImages.length + results.length > 5) {
        Alert.alert('Limit Reached', 'You can only select up to 5 images.');
        return;
      }

      const newImages = results.map((result, index) => {
        const id = generateUniqueId();
        return {
          id,
          name: result.filename ?? `image_${Date.now()}_${index}.jpg`,
          mimeType: result.mime ?? 'image/jpeg',
          base64: `data:${result.mime};base64,${result.data}`,
        };
      });

      addImage(newImages);
    } catch (err: any) {
      if (err.message === 'User cancelled image selection') {
        console.log('User cancelled image picker');
      } else {
        console.error('Error picking images:', err);
        Alert.alert('Error', 'Failed to pick images. Please try again.');
      }
    }
  };

  const removeFile = (id: string) => {
    removeImage(id);
  };

  const replaceFile = async (id: string) => {
    try {
      const result: PickedImage = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: false,
        includeBase64: true,
        cropping: false,
        compressImageQuality: 0.8,
      });

      const newImage = {
        id, // Reuse the same ID
        name: result.filename ?? `image_${Date.now()}.jpg`,
        mimeType: result.mime ?? 'image/jpeg',
        base64: `data:${result.mime};base64,${result.data}`,
      };

      replaceImage(id, newImage);
    } catch (err: any) {
      if (err.message === 'User cancelled image selection') {
        console.log('User cancelled image picker');
      } else {
        console.error('Error replacing image:', err);
        Alert.alert('Error', 'Failed to replace image.');
      }
    }
  };

  // Deduplicate images by ID
  const images = Array.isArray(formData?.images)
    ? Array.from(
        new Map(
          formData.images.map(img => [
            img.id,
            {id: img.id, uri: img.base64, name: img.name, type: img.mimeType},
          ]),
        ).values(),
      )
    : [];

  const pairedFiles = [];
  for (let i = 0; i < images.length; i += 2) {
    pairedFiles.push(images.slice(i, i + 2));
  }

  const renderImageItem = useCallback(
    (item: FileData, index: number) => (
      <View key={item.id} style={galleryStyles.imageWrapper}>
        <View style={galleryStyles.imageContainer}>
          <Image
            source={{uri: item.uri}}
            style={galleryStyles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={galleryStyles.crossButton}
            onPress={() => removeFile(item.id)}>
            <Text style={galleryStyles.crossButtonText}>×</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={galleryStyles.replaceButton}
            onPress={() => replaceFile(item.id)}>
            <MaterialCommunityIcons
              name="file-replace"
              size={14}
              color="white"
            />
          </TouchableOpacity>
          {index === 0 && (
            <View style={galleryStyles.coverBadge}>
              <AntDesign name="star" size={14} color="white" />
              <Text style={galleryStyles.coverText}>Cover</Text>
            </View>
          )}
        </View>
        <Text
          style={galleryStyles.fileName}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.name}
        </Text>
      </View>
    ),
    [removeFile, replaceFile],
  );

  const renderRow = ({item, index}: {item: FileData[]; index: number}) => (
    <View style={galleryStyles.row} key={`row-${index}`}>
      {item[0] && renderImageItem(item[0], index * 2)}
      {item[1] && renderImageItem(item[1], index * 2 + 1)}
    </View>
  );

  return (
    <View style={galleryStyles.container}>
      <Text style={galleryStyles.noteTextCenter}>
        The first image will serve as the cover image
      </Text>
      <Text style={galleryStyles.noteTextCenter}>
        ({5 - images.length} image{5 - images.length > 1 ? 's' : ''} remaining)
      </Text>
      {pairedFiles.length === 0 && (
        <TouchableOpacity style={galleryStyles.button} onPress={pickFile}>
          <Icon name="cloud-upload" size={33} color="black" />
        </TouchableOpacity>
      )}
      {images.length <= 0 && (
        <Text style={galleryStyles.noteTextCenter}>Browse file to upload</Text>
      )}

      {pairedFiles.map((pair, index) => renderRow({item: pair, index}))}

      {images.length >= 1 && (
        <TouchableOpacity
          style={[galleryStyles.button, galleryStyles.addMoreButton]}
          onPress={pickFile}>
          <Text style={galleryStyles.addMoreButtonText}>Add More Files</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FilePickerComponent;
