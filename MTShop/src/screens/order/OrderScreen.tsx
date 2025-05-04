import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {appColors} from '../../themes/appColors';
import {getItem} from '../../utils/storage';
import {Icon} from 'react-native-elements';
import AppMainContainer from '../../components/container/AppMainContainer';
import AuthButton from '../../components/buttons/AuthButton';
import {appFonts} from '../../themes/appFont';

const CustomDropdown = ({data, selected, onSelect, label}: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{marginBottom: 16}}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() => setVisible(prev => !prev)}>
        <Text style={styles.dropdownText}>
          {selected?.label || `Chọn ${label}`}
        </Text>
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdownModalWrapper}>
          <ScrollView style={styles.dropdownScrollView}>
            {data.map((item: any) => (
              <TouchableOpacity
                key={item.value.toString()}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  setVisible(false);
                }}>
                <Text style={styles.dropdownText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={{paddingVertical: 10}}>
            <Text style={styles.closeBtn}>Đóng</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const OrderScreen = ({route, navigation}: any) => {
  const [address, setAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);

  const selectedItems = route.params?.selectedItems || [];

  const totalPrice = selectedItems.reduce(
    (total, item) =>
      total +
      (item.product.salePrice
        ? ((100 - item.product.salePrice) / 100) * item.product.price
        : item.product.price) *
        item.quantity,
    0,
  );

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    const res = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
    if (res.data.error === 0) {
      setProvinces(
        res.data.data.map((p: any) => ({label: p.full_name, value: p.id})),
      );
    }
  };

  const fetchDistricts = async (provinceId: string) => {
    const res = await axios.get(
      `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`,
    );
    if (res.data.error === 0) {
      setDistricts(
        res.data.data.map((d: any) => ({label: d.full_name, value: d.id})),
      );
    }
  };

  const fetchWards = async (districtId: string) => {
    const res = await axios.get(
      `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`,
    );
    if (res.data.error === 0) {
      setWards(
        res.data.data.map((w: any) => ({label: w.full_name, value: w.id})),
      );
    }
  };

  const submitOrder = async () => {
    if (
      !address ||
      !recipientName ||
      !phoneNumber ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard
    ) {
      return Toast.show({
        type: 'error',
        text2: 'Vui lòng nhập đầy đủ thông tin',
      });
    }

    const token = await getItem('accessToken');
    if (!token) {
      Toast.show({type: 'error', text2: 'Vui lòng đăng nhập'});
      return navigation.replace('Login');
    }

    const items = selectedItems.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const fullAddress = `${address}, ${selectedWard.label}, ${selectedDistrict.label}, ${selectedProvince.label}`;
    const orderData = {
      items,
      address: fullAddress,
      paymentMethod: 'COD',
      recipientName,
      phoneNumber,
    };

    setLoading(true);
    try {
      await axios.post('/order', orderData, {
        headers: {Authorization: `Bearer ${token}`},
      });
      Toast.show({type: 'success', text2: 'Đặt hàng thành công'});
      navigation.navigate('OrderTracking');
    } catch (err) {
      Toast.show({type: 'error', text2: 'Đặt hàng thất bại'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppMainContainer mainTitle="Chỉnh sửa hồ sơ" isShowingBackButton>
      <FlatList
        ListHeaderComponent={
          <>
            {selectedItems.slice(0, 2).map(item => (
              <View
                style={[
                  {display: 'flex', flexDirection: 'column', padding: 12},
                  styles.item,
                ]}
                key={item.product._id}>
                <View
                  style={{flexDirection: 'row', flex: 1, borderBottomWidth: 1}}>
                  <Image
                    source={{uri: item.product.imageUrl}}
                    style={styles.image}
                  />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.product.name}</Text>
                    <View style={styles.priceRow}>
                      {item.product.salePrice ? (
                        <>
                          <Text style={styles.oldPrice}>
                            {item.product.price.toLocaleString()} VND
                          </Text>
                          <Text style={styles.salePrice}>
                            {(
                              ((100 - item.product.salePrice) / 100) *
                              item.product.price
                            ).toLocaleString()}{' '}
                            VND
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.oldPrice}>
                          {item.product.price.toLocaleString()} VND
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 12,
                  }}>
                  <Text style={styles.itemSubtotal}>
                    Tổng cộng ({item.quantity}) :{' '}
                  </Text>
                  <Text>
                    {(item.product.salePrice
                      ? ((100 - item.product.salePrice) / 100) *
                        item.product.price *
                        item.quantity
                      : item.product.price * item.quantity
                    ).toLocaleString()}{' '}
                    VND
                  </Text>
                </View>
              </View>
            ))}

            <Text style={styles.total}>
              Tổng cộng: {totalPrice.toLocaleString()} VND
            </Text>

            <View style={styles.paymentMethodContainer}>
              <Icon
                name="money"
                type="font-awesome"
                size={18}
                color="#28a745"
              />
              <Text style={styles.paymentText}>
                Thanh toán khi nhận hàng (COD)
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nhập tên người nhận"
              value={recipientName}
              onChangeText={setRecipientName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ cụ thể (số nhà, đường...)"
              value={address}
              onChangeText={setAddress}
            />

            <CustomDropdown
              label="Tỉnh/Thành"
              data={provinces}
              selected={selectedProvince}
              onSelect={item => {
                setSelectedProvince(item);
                setSelectedDistrict(null);
                setSelectedWard(null);
                fetchDistricts(item.value);
              }}
            />
            <CustomDropdown
              label="Quận/Huyện"
              data={districts}
              selected={selectedDistrict}
              onSelect={item => {
                setSelectedDistrict(item);
                setSelectedWard(null);
                fetchWards(item.value);
              }}
            />
            <CustomDropdown
              label="Phường/Xã"
              data={wards}
              selected={selectedWard}
              onSelect={setSelectedWard}
            />

            <View style={{marginTop: 16}}>
              <AuthButton
                text="Đặt hàng"
                onPress={submitOrder}
                loading={loading}
                disabled={loading}
              />
            </View>
          </>
        }
        data={[]}
        renderItem={null}
        keyExtractor={() => 'dummy'}
        contentContainerStyle={styles.listContent}
      />
    </AppMainContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {padding: 20, backgroundColor: '#FAFAFA'},
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 12,
  },
  info: {
    flex: 1,
    paddingTop: 12,
    paddingRight: 12,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  salePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  itemSubtotal: {
    fontSize: 13,
    color: '#333',
    textAlign: 'right',
    fontFamily: appFonts.MontserratSemiBold,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
    color: '#05294B',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#e6f5ea',
    padding: 12,
    borderRadius: 10,
  },
  paymentText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#28a745',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  closeBtn: {
    textAlign: 'center',
    color: appColors.primary,
    fontWeight: 'bold',
  },
});

export default OrderScreen;
