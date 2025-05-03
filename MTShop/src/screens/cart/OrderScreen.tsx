import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
    (total, item) => total + item.product.price * item.quantity,
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
    <AppMainContainer
      mainTitle="Đặt hàng"
      isShowingBackButton={true}
      isShowRightIcon={false}>
      <FlatList
        ListHeaderComponent={
          <>
            {selectedItems.map(item => (
              <View key={item._id} style={styles.item}>
                <Image
                  source={{uri: item.product.imageUrl}}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.product.name}</Text>
                  <Text>
                    {item.product.price.toLocaleString()} VND x {item.quantity}
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

            {/* New Inputs for Name and Phone */}
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

            {/* Dropdowns */}
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

            <AuthButton
              text="Đặt hàng"
              onPress={submitOrder}
              loading={loading}
              disabled={loading}
            />
          </>
        }
        data={[]}
        contentContainerStyle={styles.listContent}
        renderItem={null}
        keyExtractor={() => 'dummy'}
      />
    </AppMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  listContent: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'right',
    color: '#1E3A8A',
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
  button: {
    backgroundColor: appColors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  dropdownModal: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});

export default OrderScreen;
