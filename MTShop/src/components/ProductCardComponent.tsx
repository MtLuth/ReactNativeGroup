import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  onAddToCart?: () => void;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  onAddToCart,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: image}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price.toLocaleString()} VND</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
            <Text style={styles.cartButtonText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 180,
    marginBottom: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    height: 120,
    width: '100%',
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  name: {
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
  footer: {
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 8,
  },
  cartButton: {
    backgroundColor: '#05294B',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
