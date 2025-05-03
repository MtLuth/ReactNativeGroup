import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {appColors} from '../../themes/appColors';
import {getItem} from '../../utils/storage';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import dayjs from 'dayjs';
import {Icon} from 'react-native-elements';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AppMainContainer from '../../components/container/AppMainContainer';
import SmallIconButton from '../../components/buttons/SmallIconButton';

const {height} = Dimensions.get('window');

const statusMap = {
  Pending: {label: 'Đang xử lý', color: '#FFA500'},
  Confirmed: {label: 'Đã xác nhận', color: '#007bff'},
  Preparing: {label: 'Đang chuẩn bị hàng', color: '#6c757d'},
  Shipping: {label: 'Đang giao hàng', color: '#17a2b8'},
  Completed: {label: 'Đã giao', color: appColors.success},
  Cancelled: {label: 'Đã huỷ', color: appColors.error},
  Cancel_Requested: {label: 'Yêu cầu huỷ', color: '#fd7e14'},
};

const OrderTrackingScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const filterAnim = useRef(new Animated.Value(height)).current;
  const navigation = useNavigation();

  const openFilterModal = () => {
    setShowFilterModal(true);
    Animated.timing(filterAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(filterAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowFilterModal(false));
  };

  const fetchOrders = async () => {
    try {
      const token = await getItem('accessToken');
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

  const handleCancelRequest = async orderId => {
    try {
      const token = await getItem('accessToken');
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

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <AppMainContainer
      mainTitle="Lịch sử đơn hàng"
      isShowingBackButton={true}
      isShowRightIcon={false}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          marginBottom: 12,
        }}>
        <SmallIconButton
          text="Lọc"
          icon={
            <Icon
              name="filter"
              type="feather"
              size={16}
              color={appColors.primary}
            />
          }
          onPress={openFilterModal}
        />
      </View>

      <Modal visible={showFilterModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {transform: [{translateY: filterAnim}]},
            ]}>
            <Text style={styles.modalTitle}>Lọc theo trạng thái</Text>
            {[
              ['', {label: 'Tất cả', color: '#000'}],
              ...Object.entries(statusMap),
            ].map(([key, value]) => {
              const isSelected = filterStatus === key;
              return (
                <TouchableOpacity
                  key={key || 'all'}
                  style={[styles.filterItem, isSelected && styles.selectedItem]}
                  onPress={() => {
                    setFilterStatus(key);
                    closeFilterModal();
                  }}>
                  <Text
                    style={[
                      styles.filterText,
                      isSelected && {color: appColors.primary},
                    ]}>
                    {value.label}
                  </Text>
                  {isSelected && (
                    <Icon
                      name="check"
                      type="font-awesome"
                      size={16}
                      color={appColors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => {
                setFilterStatus('');
                closeFilterModal();
              }}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <FlatList
        data={filteredOrders}
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
    </AppMainContainer>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 10,
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  filterText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: appColors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
