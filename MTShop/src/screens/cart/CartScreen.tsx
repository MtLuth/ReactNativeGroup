import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {appColors} from '../../themes/appColors';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {getItem} from '../../utils/storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import CartItemComponent from '../../components/cart/CartItemComponent';
import AppMainContainer from '../../components/container/AppMainContainer';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {navType} = route.params || {};
  const tabBarHeight = navType === 'stack' ? 0 : useBottomTabBarHeight();

  const toggleSelect = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId],
    );
  };

  const getSelectedItems = () => {
    return cartItems.filter((item: CartItem) =>
      selectedItems.includes(item._id),
    );
  };

  const getTotal = () =>
    getSelectedItems().reduce(
      (total, item: CartItem) => total + item.product.price * item.quantity,
      0,
    );

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

  const removeItem = async (cartItemId: any) => {
    try {
      const token = getItem('accessToken');
      if (!token) {
        return;
      }

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

  const increaseQuantity = async (item: CartItem) => {
    try {
      const token = getItem('accessToken');
      await axios.put(
        `/cart/${item._id}`,
        {quantity: item.quantity + 1},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchCart();
    } catch (err) {
      showErrorToast('Không thể tăng số lượng');
    }
  };

  const decreaseQuantity = async (item: CartItem) => {
    if (item.quantity <= 1) return;
    try {
      const token = getItem('accessToken');
      await axios.put(
        `/cart/${item._id}`,
        {quantity: item.quantity - 1},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchCart();
    } catch (err) {
      showErrorToast('Không thể giảm số lượng');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={appColors.primary} />;
  }

  return (
    <View style={styles.outerContainer}>
      <AppMainContainer
        mainTitle="Giỏ hàng"
        isShowingBackButton={true}
        isShowRightIcon={false}>
        <FlatList
          data={cartItems}
          keyExtractor={(item: CartItem) => item._id}
          renderItem={({item}: {item: CartItem}) => (
            <CartItemComponent
              name={item.product.name}
              image={item.product.imageUrl}
              price={item.product.price}
              quantity={item.quantity}
              selected={selectedItems.includes(item._id)}
              onSelect={() => toggleSelect(item._id)}
              onIncrease={() => increaseQuantity(item)}
              onDecrease={() => decreaseQuantity(item)}
              onRemove={() => removeItem(item._id)}
            />
          )}
          contentContainerStyle={{paddingBottom: 16}}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', padding: 40}}>
              Giỏ hàng trống.
            </Text>
          }
        />
      </AppMainContainer>

      <View style={[styles.footer, {marginBottom: tabBarHeight}]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>
            {getTotal().toLocaleString()} VND
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.orderButton,
            {opacity: selectedItems.length > 0 ? 1 : 0.5},
          ]}
          disabled={selectedItems.length === 0}
          onPress={() =>
            navigation.navigate('Order', {selectedItems: getSelectedItems()})
          }>
          <Text style={styles.orderButtonText}>
            Đặt hàng ({selectedItems.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  backArrow: {
    fontSize: 20,
    color: '#000',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primary,
  },

  itemContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  remove: {
    fontSize: 18,
    color: '#f33',
    marginLeft: 10,
  },
  footer: {
    padding: 16,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  orderButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  outerContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});
