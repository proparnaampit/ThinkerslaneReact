import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useFormContext} from '../../context/updateContext';
import informationStyles from '../product/css/information';

const PriceInputScreen: React.FC = () => {
  const {formData, updateFormData} = useFormContext();
  const [price, setPrice] = useState(formData.pricing?.price || '');
  const [offeredPrice, setOfferedPrice] = useState(
    formData.pricing?.offered_price || '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isbnNumber = formData.information?.isbnNumber || '';

  const fetchPriceDataByIsbn = async (isbn: string) => {
    if (!isbn) {
      setError('ISBN number is required to fetch pricing data');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'ISBN number is required to fetch pricing data',
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
        const newPricing = {
          price: book.price ? String(book.price) : '',
          offered_price: book.offered_price
            ? String(book.offered_price)
            : book.price
            ? String(book.price)
            : '',
        };

        setPrice(newPricing.price);
        setOfferedPrice(newPricing.offered_price);
        updateFormData('pricing', newPricing);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Pricing data fetched successfully',
        });
      } else {
        setError('No pricing data found for this ISBN');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No pricing data found for this ISBN',
        });
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Error fetching pricing data');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching pricing data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: 'price' | 'offered_price', value: string) => {
    // Allow numbers and a single decimal point
    const numericText = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point and valid number format
    const parts = numericText.split('.');
    const formattedValue =
      parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : numericText;

    if (key === 'price') {
      setPrice(formattedValue);
    } else {
      setOfferedPrice(formattedValue);
    }
    updateFormData('pricing', {[key]: formattedValue});
  };

  useEffect(() => {
    // Sync local state with formData if it changes externally (e.g., via ISBN fetch)
    setPrice(formData.pricing?.price || '');
    setOfferedPrice(formData.pricing?.offered_price || '');
  }, [formData.pricing]);

  return (
    <View style={informationStyles.container}>
      <Text style={informationStyles.header}>Pricing</Text>
      <Text style={informationStyles.noteText}>
        Enter the Price of the books you are selling. This will be used to
        calculate the total price for the customer.
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
          onPress={() => fetchPriceDataByIsbn(isbnNumber)}
          disabled={isLoading || !isbnNumber}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={informationStyles.fetchButtonText}>Fetch Pricing</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={informationStyles.errorText}>{error}</Text> : null}

      <Text style={informationStyles.label}>Original Price *:</Text>
      <TextInput
        style={informationStyles.input}
        value={price}
        onChangeText={text => handleInputChange('price', text)}
        keyboardType="numeric"
        placeholder="Enter original price"
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>Offered Price *:</Text>
      <TextInput
        style={informationStyles.input}
        value={offeredPrice}
        onChangeText={text => handleInputChange('offered_price', text)}
        keyboardType="numeric"
        placeholder="Enter offered price"
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default PriceInputScreen;
