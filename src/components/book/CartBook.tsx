import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import cartBookStyles from './cartBookStyles';
import {useCart} from '../../context/CartContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

const CartBook = ({data}: any) => {
  const imageUrl = `https://thinkerslane.com/public/uploads/admin/books/${
    data.image.split(',')[0]
  }`;
  const {increaseQuantity, decreaseQuantity} = useCart();
  const totalPrice = data.price * data.quantity;

  return (
    <View style={cartBookStyles.container}>
      <FastImage
        source={{uri: imageUrl}}
        style={cartBookStyles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={cartBookStyles.textContainer}>
        <CustomText style={cartBookStyles.title}>{data.name}</CustomText>
        {data.quantity > 0 && (
          <View style={cartBookStyles.price}>
            <CustomText style={cartBookStyles.priceText}>
              Rs.{data.price}
            </CustomText>
          </View>
        )}
        <View style={cartBookStyles.quantityContainer}>
          <TouchableOpacity
            onPress={() => decreaseQuantity(data.id)}
            style={cartBookStyles.quantityButton}>
            <FontAwesome name="minus" size={20} color="#fff" />
          </TouchableOpacity>
          <CustomText style={cartBookStyles.stockLabel}>
            {data.quantity}
          </CustomText>
          <TouchableOpacity
            onPress={() => increaseQuantity(data.id)}
            style={cartBookStyles.quantityButton}>
            <FontAwesome name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={cartBookStyles.totalPriceContainer}>
          <CustomText style={cartBookStyles.totalPriceText}>
            Total: Rs.{totalPrice}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default CartBook;
