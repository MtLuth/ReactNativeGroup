import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {Icon} from 'react-native-elements';
import {getItem} from '../../utils/storage';
import {showErrorToast, showSuccessToast} from '../../utils/toast';

const STATUS_MAP: Record<string, string> = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Preparing: 'Đang chuẩn bị',
  Shipping: 'Đang giao',
  Completed: 'Hoàn tất',
  Canceled: 'Đã hủy',
};

const SYSTEM_STATUS = Object.keys(STATUS_MAP);

const LIMIT = 6;

export default function OrderManagerScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(orders.length / LIMIT);

  const fetchOrders = async () => {
    setLoading(true);
    const token = await getItem('accessToken');
    try {
      const res = await axios.get('/order/admin/all', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setOrders(res.data.data);
    } catch {
      showErrorToast('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const token = await getItem('accessToken');
    try {
      await axios.put(
        `/order/admin/${orderId}/status`,
        {status: newStatus},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      showSuccessToast('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch {
      showErrorToast('Lỗi khi cập nhật trạng thái');
    }
  };

  const confirmChange = (orderId: string, currentStatus: string) => {
    const order: any = orders.find(o => o._id === orderId);
    if (!order) return;

    const detailMessage =
      `Người nhận: ${order.recipientName}\n` +
      `SĐT: ${order.phoneNumber}\n` +
      `Tổng tiền: ${order.total.toLocaleString()}₫\n` +
      `Trạng thái hiện tại: ${STATUS_MAP[currentStatus]}`;

    Alert.alert(
      'Cập nhật trạng thái đơn hàng',
      detailMessage,
      [
        ...SYSTEM_STATUS.map(statusKey => ({
          text: STATUS_MAP[statusKey],
          onPress: () => updateStatus(orderId, statusKey),
          style: statusKey === currentStatus ? 'default' : 'default',
        })),
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({item}: any) => (
    <View style={styles.card}>
      <Text style={styles.id}>Mã đơn hàng: {item._id}</Text>
      <Text style={styles.label}>Người nhận: {item.recipientName}</Text>
      <Text style={styles.label}>SĐT: {item.phoneNumber}</Text>
      <Text style={styles.label}>
        Tổng tiền: {item.total.toLocaleString()}₫
      </Text>
      <Text style={styles.label}>
        Trạng thái:{' '}
        <Text style={styles.status}>
          {STATUS_MAP[item.status] || item.status}
        </Text>
      </Text>

      <TouchableOpacity
        onPress={() => confirmChange(item._id, item.status)}
        style={styles.btn}>
        <Icon name="edit" type="font-awesome" size={14} color="#fff" />
        <Text style={styles.btnText}>Đổi trạng thái</Text>
      </TouchableOpacity>
    </View>
  );

  const currentData = orders.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý đơn hàng</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#05294B" />
      ) : (
        <>
          <FlatList
            data={currentData}
            keyExtractor={(item: any) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 16}}
          />

          {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                onPress={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}>
                <Text style={styles.pageBtnText}>Trang trước</Text>
              </TouchableOpacity>

              <Text style={styles.pageNum}>
                {page}/{totalPages}
              </Text>

              <TouchableOpacity
                onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={[
                  styles.pageBtn,
                  page === totalPages && styles.pageBtnDisabled,
                ]}>
                <Text style={styles.pageBtnText}>Trang sau</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f9f9f9'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#05294B'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  id: {fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: '#444'},
  label: {fontSize: 13, marginBottom: 2, color: '#555'},
  status: {fontWeight: 'bold', color: '#007bff'},
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#05294B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  btnText: {color: '#fff', marginLeft: 8, fontSize: 13, fontWeight: '600'},

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  pageBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#05294B',
    borderRadius: 6,
  },
  pageBtnDisabled: {
    backgroundColor: '#ccc',
  },
  pageBtnText: {
    color: '#fff',
    fontSize: 13,
  },
  pageNum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
