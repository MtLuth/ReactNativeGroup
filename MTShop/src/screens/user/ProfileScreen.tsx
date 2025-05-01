import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';

import { appColors } from '../../themes/appColors';
import { HomeStyle } from '../../styles/homeStyle';
import { getItem, removeItem } from '../../utils/storage';
import { showErrorToast } from '../../utils/toast';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const [token, storedRole] = await Promise.all([
        getItem('accessToken'),
        getItem('role'),
      ]);
      setRole(storedRole || '');
      const res = await axios.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.message);
    } catch {
      showErrorToast('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onSignOutPress = () => {
    removeItem('accessToken');
    removeItem('role');
    navigation.replace('Login');
  };

  if (loading) {
    return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
    );
  }

  return (
      <ScrollView style={styles.container}>
        <View style={HomeStyle.header}>
          <Image
              source={{ uri: user?.avatar || 'https://i.stack.imgur.com/l60Hf.png' }}
              style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
            <TouchableOpacity>
              <Text style={styles.editProfile}>Xem & chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.optionList}>
          {role === 'admin' && (
              <OptionItem
                  icon="dashboard"
                  label="Dashboard"
                  onPress={() => navigation.navigate('DashboardScreen')}
              />
          )}

          <OptionItem
              icon="list"
              label="Đơn mua"
              onPress={() => navigation.navigate('OrderTracking')}
          />
          <OptionItem icon="question-circle" label="Trung tâm hỗ trợ" />
          <OptionItem icon="sign-out" label="Đăng xuất" onPress={onSignOutPress} />
        </View>
      </ScrollView>
  );
};

const OptionItem = ({
                      icon,
                      label,
                      onPress,
                    }: {
  icon: string;
  label: string;
  onPress?: () => void;
}) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <Icon name={icon} type="font-awesome" color="#555" size={20} />
      <Text style={styles.optionLabel}>{label}</Text>
      <Icon name="chevron-right" type="font-awesome" color="#ccc" size={14} />
    </TouchableOpacity>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f4f4f4'},
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  userInfo: {marginLeft: 16},
  userName: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  editProfile: {fontSize: 14, color: '#ddd', marginTop: 4},
  optionList: {marginTop: 12, backgroundColor: '#fff', paddingHorizontal: 16},
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLabel: {flex: 1, fontSize: 16, marginLeft: 16, color: '#333'},
});
