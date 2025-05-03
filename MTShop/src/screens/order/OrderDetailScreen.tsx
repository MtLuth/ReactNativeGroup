import React, {use, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {appColors} from '../../themes/appColors';
import {showErrorToast} from '../../utils/toast';
import {getItem} from '../../utils/storage';
import AppMainContainer from '../../components/container/AppMainContainer';
import {appFonts} from '../../themes/appFont';

const OrderDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {orderId} = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = async () => {
    try {
      const token = await getItem('accessToken');
      const res = await axios.get(`/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Order detail:', res.data);
      setOrder(res.data.data);
    } catch (error) {
      showErrorToast('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrderDetail();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (!order) return null;

  const statusMap = {
    Pending: {label: 'Đang xử lý', color: '#FFA500'},
    Confirmed: {label: 'Đã xác nhận', color: '#007bff'},
    Preparing: {label: 'Đang chuẩn bị hàng', color: '#6c757d'},
    Shipping: {label: 'Đang giao hàng', color: '#17a2b8'},
    Completed: {label: 'Đã giao', color: '#28a745'},
    Cancelled: {label: 'Đã huỷ', color: '#dc3545'},
    Cancel_Requested: {label: 'Yêu cầu huỷ', color: '#fd7e14'},
  };

  const statusInfo = statusMap[order.status] || {
    label: order.status,
    color: '#6c757d',
  };

  return (
    <AppMainContainer isShowingBackButton={true} isShowRightIcon={false}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Chi tiết đơn hàng</Text>

        <Text style={styles.label}>
          Mã đơn: <Text style={styles.value}>#{order._id.slice(-6)}</Text>
        </Text>
        <Text style={styles.label}>
          Người đặt:{' '}
          <Text style={styles.value}>
            {order.user.fullName} ({order.user.email})
          </Text>
        </Text>
        <Text style={styles.label}>
          Người nhận: <Text style={styles.value}>{order.recipientName}</Text>
        </Text>
        <Text style={styles.label}>
          Số điện thoại: <Text style={styles.value}>{order.phoneNumber}</Text>
        </Text>
        <Text style={styles.label}>
          Ngày đặt:{' '}
          <Text style={styles.value}>
            {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
          </Text>
        </Text>
        <Text style={styles.label}>
          Trạng thái:{' '}
          <Text style={[styles.value, {color: statusInfo.color}]}>
            {statusInfo.label}
          </Text>
        </Text>

        <Text style={[styles.sectionTitle, {marginTop: 20}]}>Sản phẩm:</Text>
        {order.items.map(item => (
          <TouchableOpacity
            key={item._id}
            style={styles.itemRow}
            onPress={() =>
              navigation.navigate('ProductDetail', {
                id: item.product._id,
              })
            }>
            <View style={styles.imageWrapper}>
              <Image
                source={{uri: item.product.imageUrl}}
                style={styles.productImage}
              />
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.quantity}>x{item.quantity}</Text>
              <Text style={styles.price}>
                {(item.product.price * item.quantity).toLocaleString()} VND
              </Text>
            </View>
            {order.status === 'Completed' && (
              <TouchableOpacity
                style={[
                  styles.reviewButton,
                  item.isReviewed && styles.reviewedButton,
                ]}
                disabled={item.isReviewed}
                onPress={() => {
                  if (!item.isReviewed) {
                    navigation.navigate('Review', {
                      productId: item.product._id,
                      orderId: order._id,
                      productName: item.product.name,
                      productImage: item.product.imageUrl,
                    });
                  }
                }}>
                <Text
                  style={[
                    styles.reviewButtonText,
                    item.isReviewed && styles.reviewedButtonText,
                  ]}>
                  {item.isReviewed ? 'Đã đánh giá' : 'Đánh giá'}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>
            {order.total.toLocaleString()} VND
          </Text>
        </View>
      </ScrollView>
    </AppMainContainer>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemRow: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.primary,
  },
  reviewButton: {
    backgroundColor: appColors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  reviewedButton: {
    backgroundColor: '#fff',
  },
  reviewedButtonText: {
    color: appColors.success,
    fontFamily: appFonts.MontserratBold,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: appFonts.MontserratBold,
  },
  totalRow: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.primary,
  },
});
