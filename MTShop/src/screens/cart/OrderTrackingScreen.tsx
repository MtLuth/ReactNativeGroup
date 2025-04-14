import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {appColors} from '../../themes/appColors';

const statusMap = {
  new: 'Đơn hàng mới',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị hàng',
  shipping: 'Đang giao',
  completed: 'Đã giao',
  cancelled: 'Đã huỷ',
  cancel_requested: 'Yêu cầu huỷ',
};

const OrderTrackingScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/order/history');
      setOrders(res.data.data);
    } catch (err) {
      console.log('Lỗi khi tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderId}>#{item._id.slice(-5)}</Text>
            <Text>Tổng tiền: {item.total.toLocaleString()} VND</Text>
            <Text>Trạng thái: {statusMap[item.status]}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  orderItem: {
    padding: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: appColors.primary,
  },
});
