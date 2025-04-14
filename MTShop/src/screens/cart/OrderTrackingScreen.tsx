import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {appColors} from '../../themes/appColors';
import {getItem} from '../../utils/storage';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import dayjs from 'dayjs';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const statusMap: Record<string, {label: string; color: string}> = {
  Pending: {label: 'Đơn hàng mới', color: '#FFA500'}, // orange
  Confirmed: {label: 'Đã xác nhận', color: '#007bff'}, // blue
  Preparing: {label: 'Đang chuẩn bị hàng', color: '#6c757d'}, // gray
  Shipping: {label: 'Đang giao hàng', color: '#17a2b8'}, // cyan
  Completed: {label: 'Đã giao', color: '#28a745'}, // green
  Cancelled: {label: 'Đã huỷ', color: '#dc3545'}, // red
  Cancel_Requested: {label: 'Yêu cầu huỷ', color: '#fd7e14'}, // orange-dark
};

const OrderTrackingScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const fetchOrders = async () => {
    try {
      const token = getItem('accessToken');
      if (!token) {
        showErrorToast('Vui lòng đăng nhập để xem đơn hàng');
        return;
      }

      const res = await axios.get('/order', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.data || []);
    } catch (err) {
      showErrorToast('Lỗi khi tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };
  const handleCancelRequest = async (orderId: string) => {
    try {
      const token = getItem('accessToken');
      if (!token) return showErrorToast('Bạn chưa đăng nhập');

      await axios.put(
        `/order/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showSuccessToast('Đã gửi yêu cầu huỷ đơn hàng');
      fetchOrders();
    } catch (error) {
      showErrorToast('Không thể gửi yêu cầu huỷ');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Main', {screen: 'Home'})}>
          <Icon name="arrow-left" type="font-awesome" color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <View style={{width: 24}} />
      </View>
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          const status = statusMap[item.status] || {
            label: item.status,
            color: '#6c757d',
          };
          return (
            <TouchableOpacity
              style={styles.orderItem}
              onPress={() =>
                navigation.navigate('OrderDetail', {orderId: item._id})
              }>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{item._id.slice(-6)}</Text>
                <Text style={[styles.status, {color: status.color}]}>
                  {status.label}
                </Text>
              </View>
              <Text style={styles.date}>
                Ngày đặt:{' '}
                <Text style={{fontWeight: 'bold'}}>
                  {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                </Text>
              </Text>
              <Text style={styles.total}>
                Tổng tiền:{' '}
                <Text style={{color: appColors.primary}}>
                  {item.total.toLocaleString()} VND
                </Text>
              </Text>
              {(item.status === 'Pending' ||
                item.status === 'Confirmed' ||
                item.status === 'Preparing') && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelRequest(item._id)}>
                  <Text style={styles.cancelButtonText}>
                    Gửi yêu cầu huỷ đơn
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có đơn hàng nào.</Text>
        }
      />
    </View>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#fce4e4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },

  cancelButtonText: {
    color: '#c82333',
    fontWeight: '600',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.primary,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: appColors.primary,
  },
  orderItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  status: {
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  total: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});
