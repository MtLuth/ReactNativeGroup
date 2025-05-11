import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('Pending');
  const [modalVisible, setModalVisible] = useState(false);

  const totalPages = Math.ceil(filteredOrders.length / LIMIT);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await getItem('accessToken');
      const res = await axios.get('/order/admin/all', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setOrders(res.data.data);
      setFilteredOrders(res.data.data); // Initially show all orders
    } catch (error) {
      showErrorToast('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!selectedOrderId) return;
    try {
      const token = await getItem('accessToken');
      await axios.put(
        `/order/admin/${selectedOrderId}/status`,
        {status: selectedStatus},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      showSuccessToast('Cập nhật trạng thái thành công');
      setModalVisible(false);
      fetchOrders();
    } catch (error) {
      showErrorToast('Lỗi khi cập nhật trạng thái');
    }
  };

  const filterOrders = (status: string) => {
    if (status === 'All') {
      setFilteredOrders(orders); // Show all orders if 'All' is selected
    } else {
      setFilteredOrders(orders.filter(order => order.status === status)); // Filter by selected status
    }
    setPage(1); // Reset to page 1 when filtering
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
        style={styles.btn}
        onPress={() => {
          setSelectedOrderId(item._id);
          setSelectedStatus(item.status);
          setModalVisible(true);
        }}>
        <Icon name="edit" type="font-awesome" size={14} color="#fff" />
        <Text style={styles.btnText}>Đổi trạng thái</Text>
      </TouchableOpacity>
    </View>
  );

  const currentData = filteredOrders.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý đơn hàng</Text>

      {/* Dropdown to filter by status */}
      <View style={styles.filterWrapper}>
        <Text style={styles.filterLabel}>Lọc theo trạng thái:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownText}>
            {STATUS_MAP[selectedStatus] || 'Tất cả'}
          </Text>
        </TouchableOpacity>
      </View>

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

      {/* Modal để chọn trạng thái */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn trạng thái</Text>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedStatus('All');
                filterOrders('All');
                setModalVisible(false);
              }}>
              <Text style={styles.dropdownItemText}>Tất cả</Text>
            </TouchableOpacity>
            {SYSTEM_STATUS.map(statusKey => (
              <TouchableOpacity
                key={statusKey}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedStatus(statusKey);
                  filterOrders(statusKey);
                  setModalVisible(false);
                }}>
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedStatus === statusKey && {
                      fontWeight: 'bold',
                      color: '#007bff',
                    },
                  ]}>
                  {STATUS_MAP[statusKey]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f9f9f9'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#05294B'},
  filterWrapper: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  filterLabel: {fontSize: 14, color: '#555', marginRight: 8},
  dropdown: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownText: {fontSize: 14, color: '#333'},
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  modalBtn: {
    backgroundColor: '#05294B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelBtn: {
    backgroundColor: '#999',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
