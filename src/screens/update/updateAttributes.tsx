import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useFormContext} from '../../context/updateContext';
import informationStyles from '../product/css/information';
import CustomPicker from '../../components/common/CustomPicker';

const ProductInputForm: React.FC = () => {
  const {formData, updateFormData} = useFormContext();
  const [quantity, setQuantity] = useState(formData.product?.quantity || '');
  const [width, setWidth] = useState(formData.product?.width || '');
  const [height, setHeight] = useState(formData.product?.height || '');
  const [length, setLength] = useState(formData.product?.length || '');
  const [binding, setBinding] = useState(formData.product?.binding || '');
  const [weight, setWeight] = useState(formData.product?.weight || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isbnNumber = formData.information?.isbnNumber || '';

  const fetchAttributesByIsbn = async (isbn: string) => {
    if (!isbn) {
      setError('ISBN number is required to fetch attributes');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'ISBN number is required to fetch attributes',
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

      if (data?.status === 200 && data?.book) {
        const book = data.book;
        const newAttributes = {
          quantity: book.quantity ? String(book.quantity) : '',
          width: book.width ? String(book.width) : '',
          height: book.height ? String(book.height) : '',
          length: book.length ? String(book.length) : '',
          binding: book.binding || '',
          weight: book.weight ? String(book.weight) : '',
        };

        setQuantity(newAttributes.quantity);
        setWidth(newAttributes.width);
        setHeight(newAttributes.height);
        setLength(newAttributes.length);
        setBinding(newAttributes.binding);
        setWeight(newAttributes.weight);
        updateFormData('product', newAttributes);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Attributes fetched successfully',
        });
      } else {
        setError('No attribute data found for this ISBN');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No attribute data found for this ISBN',
        });
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Error fetching attribute data');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching attribute data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumericInputChange = (
    key: 'quantity' | 'width' | 'height' | 'length' | 'weight',
    value: string,
  ) => {
    // Allow numbers and a single decimal point for weight, width, height, length
    const numericText = value.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    const formattedValue =
      parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : numericText;

    // Quantity should be an integer
    const finalValue =
      key === 'quantity' ? numericText.split('.')[0] : formattedValue;

    switch (key) {
      case 'quantity':
        setQuantity(finalValue);
        break;
      case 'width':
        setWidth(finalValue);
        break;
      case 'height':
        setHeight(finalValue);
        break;
      case 'length':
        setLength(finalValue);
        break;
      case 'weight':
        setWeight(finalValue);
        break;
    }
    updateFormData('product', {[key]: finalValue});
  };

  const handleBindingChange = (value: string) => {
    setBinding(value);
    updateFormData('product', {binding: value});
  };

  useEffect(() => {
    // Sync local state with formData if it changes externally (e.g., via ISBN fetch)
    setQuantity(formData.product?.quantity || '');
    setWidth(formData.product?.width || '');
    setHeight(formData.product?.height || '');
    setLength(formData.product?.length || '');
    setBinding(formData.product?.binding || '');
    setWeight(formData.product?.weight || '');
  }, [formData.product]);

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>Product Attributes</Text>
      <Text style={informationStyles.noteText}>
        Enter the attributes of the books you are selling. This will help in
        better categorization and searchability of your products.
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
          onPress={() => fetchAttributesByIsbn(isbnNumber)}
          disabled={isLoading || !isbnNumber}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={informationStyles.fetchButtonText}>
              Fetch Attributes
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={informationStyles.errorText}>{error}</Text> : null}

      <Text style={informationStyles.label}>Quantity *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Quantity"
        value={quantity}
        onChangeText={text => handleNumericInputChange('quantity', text)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <CustomPicker
        label="Binding *:"
        selectedValue={binding}
        onValueChange={handleBindingChange}
        data={[
          {id: 'hardcover', description: 'Hardcover'},
          {id: 'paperback', description: 'Paperback'},
          {id: 'spiral', description: 'Spiral'},
        ]}
        placeholder="Select Binding"
      />

      <Text style={informationStyles.label}>Weight (kg):</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Weight (e.g., 0.5)"
        value={weight}
        onChangeText={text => handleNumericInputChange('weight', text)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>Width (cm):</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Width (e.g., 15.5)"
        value={width}
        onChangeText={text => handleNumericInputChange('width', text)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>Height (cm):</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Height (e.g., 23.0)"
        value={height}
        onChangeText={text => handleNumericInputChange('height', text)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>Length (cm):</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Length (e.g., 2.5)"
        value={length}
        onChangeText={text => handleNumericInputChange('length', text)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
    </ScrollView>
  );
};

export default ProductInputForm;
