import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {appColors} from '../../themes/appColors';
import {getItem} from '../../utils/storage';
import {Icon} from 'react-native-elements';

const OrderScreen = ({route, navigation}) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedItems = route.params?.selectedItems || [];

  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const submitOrder = async () => {
    if (!address) {
      return Toast.show({type: 'error', text2: 'Vui lòng nhập địa chỉ'});
    }

    const token = getItem('accessToken');
    if (!token) {
      Toast.show({type: 'error', text2: 'Vui lòng đăng nhập'});
      return navigation.replace('Login');
    }

    const items = selectedItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    setLoading(true);
    try {
      await axios.post(
        '/order',
        {items, address, paymentMethod: 'COD'},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      Toast.show({type: 'success', text2: 'Đặt hàng thành công'});
      navigation.navigate('OrderTracking');
    } catch (err) {
      Toast.show({type: 'error', text2: 'Đặt hàng thất bại'});
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="font-awesome" color="#000" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt hàng</Text>
        <View style={{width: 20}} /> {/* Giữ khoảng cách bên phải cân bằng */}
      </View>

      <FlatList
        data={selectedItems}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image source={{uri: item.product.imageUrl}} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text>
                {item.product.price.toLocaleString()} VND x {item.quantity}
              </Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>
        Tổng cộng: {totalPrice.toLocaleString()} VND
      </Text>

      <View style={styles.paymentMethodContainer}>
        <Icon name="money" type="font-awesome" size={18} color="#28a745" />
        <Text style={styles.paymentText}>Thanh toán khi nhận hàng (COD)</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ giao hàng"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={submitOrder}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Xác nhận đặt hàng</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  item: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'right',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#eaf8ec',
    borderRadius: 8,
  },
  paymentText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#28a745',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: appColors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primary,
  },
});
