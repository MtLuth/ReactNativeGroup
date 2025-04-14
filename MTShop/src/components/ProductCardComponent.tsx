import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

const ProductCard = ({
  image,
  name,
  price,
  onAddToCart,
  onPress,
  rating = 0,
  reviewCount = 0,
  soldCount = 0,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{uri: image}} style={styles.image} />

      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>

      {/* Đánh giá & số lượt mua */}
      <View style={styles.infoRow}>
        <View style={styles.ratingContainer}>
          <Icon name="star" type="font-awesome" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>
            {rating.toFixed(1)} ({reviewCount})
          </Text>
        </View>
        <Text style={styles.soldText}>{soldCount} đã bán</Text>
      </View>

      <Text style={styles.price}>{price.toLocaleString()} VND</Text>

      <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
        <Icon name="shopping-cart" type="font-awesome" color="#fff" size={16} />
        <Text style={styles.cartButtonText}> Thêm vào giỏ</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 8,
    flex: 1,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#444',
  },
  soldText: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    color: '#05294B',
    fontSize: 14,
    marginBottom: 10,
  },
  cartButton: {
    backgroundColor: '#05294B',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default ProductCard;
