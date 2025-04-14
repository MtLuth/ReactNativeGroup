import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import {appColors} from '../../themes/appColors';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {getItem} from '../../utils/storage';

const CartScreen = ({navigation}) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = getItem('accessToken');

      const res = await axios.get('/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data.data);
    } catch (err) {
      showErrorToast('Lỗi khi lấy giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async cartItemId => {
    try {
      const token = getItem('assetToken');
      if (!token) return;

      await axios.delete(`/cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('Đã xoá sản phẩm khỏi giỏ hàng');
      fetchCart();
    } catch (err) {
      showErrorToast('Không thể xoá sản phẩm');
    }
  };

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item._id}
        renderItem={({item}: any) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <Image
                source={{uri: item.product.imageUrl}}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.product.name}</Text>
                <Text>
                  {item.product.price.toLocaleString()} VND x {item.quantity}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item._id)}>
              <Text style={styles.remove}>Xoá</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>
          Tổng cộng: {getTotal().toLocaleString()} VND
        </Text>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigation.navigate('Order')}>
          <Text style={styles.orderButtonText}>Tiến hành đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  remove: {color: 'red', marginTop: 5},
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  total: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  orderButton: {
    backgroundColor: appColors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: {color: '#fff', fontWeight: 'bold'},
});
