import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface ProductCardProps {
  image: any;
  name: string;
  price: number;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  onAddToCart,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{uri: image}} style={styles.image} resizeMode="cover" />
      </View>

      <View style={{paddingHorizontal: 8}}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price.toLocaleString()}</Text>
      </View>
      <View style={{padding: 8, paddingVertical: 16}}>
        <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
          <Text style={styles.cartButtonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 180,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: 120,
    width: '100%',
  },
  name: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#05294B',
    marginTop: 4,
  },
  cartButton: {
    backgroundColor: '#05294B',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
