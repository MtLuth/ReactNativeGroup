import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {appColors} from '../../themes/appColors';

const OrderScreen = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const submitOrder = async () => {
    if (!address)
      return Toast.show({type: 'error', text2: 'Vui lòng nhập địa chỉ'});
    setLoading(true);
    try {
      await axios.post('/order', {address, paymentMethod: 'COD'});
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
      <Text style={styles.label}>Địa chỉ giao hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
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
          <Text style={styles.buttonText}>Xác nhận đặt hàng (COD)</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  label: {fontSize: 16, marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: appColors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
});
