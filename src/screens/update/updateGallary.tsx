import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import ImagePicker, {
  Image as PickedImage,
} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {useFormContext} from '../../context/updateContext';
import informationStyles from '../product/css/information';

interface FileData {
  id: string;
  uri: string;
  name: string;
  mimeType: string;
}

const FilePickerComponent: React.FC = () => {
  const {formData, addImage, removeImage, replaceImage} = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isbnNumber = formData.information?.isbnNumber || '';
  const images = formData.images || [];

  const generateUniqueId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const fetchImagesByIsbn = async (isbn: string) => {
    if (!isbn) {
      setError('ISBN number is required to fetch images');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'ISBN number is required to fetch images',
      });
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://staging.thinkerslane.com/thAdmin/getBookByIsbn?isbn_number=${isbn}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();

      if (data?.status === 200 && data?.book?.images?.length > 0) {
        const newImages = data.book.images.map((img: any, index: number) => ({
          id: generateUniqueId(),
          name: img.name || `image_${Date.now()}_${index}.jpg`,
          mimeType: img.mimeType || 'image/jpeg',
          base64: img.base64 || img.url, // Assuming API returns base64 or URL
        }));

        if (newImages.length > 5) {
          newImages.length = 5; // Limit to 5 images
        }

        addImage(newImages);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Images fetched successfully',
        });
      } else {
        // Fallback to Google Books API for thumbnail
        const googleResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
        );
        const googleData = await googleResponse.json();

        if (googleData.items && googleData.items.length > 0) {
          const book = googleData.items[0].volumeInfo;
          if (book.imageLinks?.thumbnail) {
            const newImage = {
              id: generateUniqueId(),
              name: `cover_${Date.now()}.jpg`,
              mimeType: 'image/jpeg',
              base64: book.imageLinks.thumbnail, // Use URL as base64 placeholder
            };
            addImage([newImage]);
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Cover image fetched from Google Books',
            });
          } else {
            setError('No images found for this ISBN');
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'No images found for this ISBN',
            });
          }
        } else {
          setError('No images found for this ISBN');
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No images found for this ISBN',
          });
        }
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Error fetching images');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching images',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pickFile = async () => {
    try {
      const currentImages = Array.isArray(formData.images)
        ? formData.images
        : [];
      if (currentImages.length >= 5) {
        Alert.alert('Limit Reached', 'You can only select up to 5 images.');
        return;
      }

      const results: PickedImage[] = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        includeBase64: true,
        maxFiles: 5 - currentImages.length,
        cropping: false,
        compressImageQuality: 0.8,
      });

      const newImages = results.map((result, index) => ({
        id: generateUniqueId(),
        name: result.filename ?? `image_${Date.now()}_${index}.jpg`,
        mimeType: result.mime ?? 'image/jpeg',
        base64: `data:${result.mime};base64,${result.data}`,
      }));

      addImage(newImages);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${newImages.length} image${
          newImages.length > 1 ? 's' : ''
        } added`,
      });
    } catch (err: any) {
      if (err.message === 'User cancelled image selection') {
        console.log('User cancelled image picker');
      } else {
        console.error('Error picking images:', err);
        Alert.alert('Error', 'Failed to pick images. Please try again.');
      }
    }
  };

  const removeFile = useCallback(
    (id: string) => {
      removeImage(id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Image removed',
      });
    },
    [removeImage],
  );

  const replaceFile = useCallback(
    async (id: string) => {
      try {
        const result: PickedImage = await ImagePicker.openPicker({
          mediaType: 'photo',
          multiple: false,
          includeBase64: true,
          cropping: false,
          compressImageQuality: 0.8,
        });

        const newImage = {
          id,
          name: result.filename ?? `image_${Date.now()}.jpg`,
          mimeType: result.mime ?? 'image/jpeg',
          base64: `data:${result.mime};base64,${result.data}`,
        };

        replaceImage(id, newImage);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Image replaced',
        });
      } catch (err: any) {
        if (err.message === 'User cancelled image selection') {
          console.log('User cancelled image picker');
        } else {
          console.error('Error replacing image:', err);
          Alert.alert('Error', 'Failed to replace image.');
        }
      }
    },
    [replaceImage],
  );

  const renderImageItem = useCallback(
    (item: FileData, index: number) => (
      <View key={item.id} style={informationStyles.imageWrapper}>
        <View style={informationStyles.imageContainer}>
          <Image
            source={{uri: item.uri}}
            style={informationStyles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={informationStyles.crossButton}
            onPress={() => removeFile(item.id)}>
            <Text style={informationStyles.crossButtonText}>×</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={informationStyles.replaceButton}
            onPress={() => replaceFile(item.id)}>
            <MaterialCommunityIcons
              name="file-replace"
              size={14}
              color="white"
            />
          </TouchableOpacity>
          {index === 0 && (
            <View style={informationStyles.coverBadge}>
              <AntDesign name="star" size={14} color="white" />
              <Text style={informationStyles.coverText}>Cover</Text>
            </View>
          )}
        </View>
        <Text
          style={informationStyles.fileName}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.name}
        </Text>
      </View>
    ),
    [removeFile, replaceFile],
  );

  const pairedFiles = [];
  for (let i = 0; i < images.length; i += 2) {
    pairedFiles.push(images.slice(i, i + 2));
  }

  const renderRow = ({item, index}: {item: FileData[]; index: number}) => (
    <View style={informationStyles.row} key={`row-${index}`}>
      {item[0] && renderImageItem(item[0], index * 2)}
      {item[1] && renderImageItem(item[1], index * 2 + 1)}
    </View>
  );

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>Image Gallery</Text>
      <Text style={informationStyles.noteText}>
        The first image will serve as the cover image ({5 - images.length} image
        {5 - images.length !== 1 ? 's' : ''} remaining)
      </Text>

      <Text style={informationStyles.label}>ISBN NUMBER:</Text>
      <View style={informationStyles.inputContainer}>
        <TextInput
          style={[informationStyles.ISBNinput, {flex: 1}]}
          placeholder="ISBN from Basic Information"
          value={isbnNumber}
          editable={false}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={informationStyles.fetchButton}
          onPress={() => fetchImagesByIsbn(isbnNumber)}
          disabled={isLoading || !isbnNumber}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={informationStyles.fetchButtonText}>Fetch Images</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={informationStyles.errorText}>{error}</Text> : null}

      {images.length === 0 && (
        <TouchableOpacity style={informationStyles.button} onPress={pickFile}>
          <Icon name="cloud-upload" size={33} color="#223d79" />
          <Text style={informationStyles.noteTextCenter}>
            Browse files to upload
          </Text>
        </TouchableOpacity>
      )}

      {pairedFiles.map((pair, index) => renderRow({item: pair, index}))}

      {images.length > 0 && images.length < 5 && (
        <TouchableOpacity
          style={[informationStyles.button, informationStyles.addMoreButton]}
          onPress={pickFile}>
          <Text style={informationStyles.addMoreButtonText}>
            Add More Images
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default FilePickerComponent;
