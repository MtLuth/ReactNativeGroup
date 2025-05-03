import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {getItem} from '../../utils/storage';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {appColors} from '../../themes/appColors';
import AppMainContainer from '../../components/container/AppMainContainer';
import {Icon} from 'react-native-elements';

const ProfileDetailScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [editing, setEditing] = useState({fullName: false, phoneNumber: false});
  const [formData, setFormData] = useState({fullName: '', phoneNumber: ''});
  const [updating, setUpdating] = useState(false);

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Cho phép truy cập ảnh',
            message: 'Ứng dụng cần quyền truy cập ảnh để cập nhật avatar',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Cho phép truy cập ảnh',
            message: 'Ứng dụng cần quyền truy cập ảnh để cập nhật avatar',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const fetchUser = async () => {
    try {
      const token = getItem('accessToken');
      const res = await axios.get('/user', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setUser(res.data.message);
      setFormData({
        fullName: res.data.message.fullName,
        phoneNumber: res.data.message.phoneNumber || '',
      });
    } catch (err) {
      showErrorToast('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseAvatar = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      showErrorToast('Không có quyền truy cập thư viện ảnh');
      return;
    }
    console.log('Permission granted:', hasPermission);
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
      },
      response => {
        console.log(
          'Image Picker response:',
          JSON.stringify(response, null, 2),
        );
      },
    );
  };

  const handleSaveChanges = async () => {
    try {
      setUpdating(true);
      const token = await getItem('accessToken');

      await axios.put(
        `/user/${user._id}`,
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      showSuccessToast('Cập nhật hồ sơ thành công');
      setEditing({fullName: false, phoneNumber: false});
      fetchUser();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showErrorToast(
          err.response?.data?.message || 'Không thể cập nhật thông tin',
        );
      } else {
        showErrorToast('Không thể cập nhật thông tin');
      }
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <AppMainContainer mainTitle="Chỉnh sửa hồ sơ" isShowingBackButton>
      <ScrollView style={styles.container}>
        <View style={styles.avatarWrapper}>
          <TouchableOpacity
            onPress={async () => {
              await handleChooseAvatar();
            }}>
            <Image
              source={{uri: newAvatar || user.avatar}}
              style={styles.avatar}
            />
            <Text style={styles.changeText}>Đổi ảnh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <EditableField
            label="Họ tên"
            value={formData.fullName}
            isEditing={editing.fullName}
            onChange={text => setFormData({...formData, fullName: text})}
            onEdit={() => setEditing({...editing, fullName: true})}
          />
          <EditableField
            label="Số điện thoại"
            value={formData.phoneNumber}
            isEditing={editing.phoneNumber}
            onChange={text => setFormData({...formData, phoneNumber: text})}
            onEdit={() => setEditing({...editing, phoneNumber: true})}
          />
          <LabelAndValue label="Email" value={user.email} />
        </View>

        {(editing.fullName || editing.phoneNumber) && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
            disabled={updating}>
            <Text style={styles.saveText}>
              {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </AppMainContainer>
  );
};

const EditableField = ({
  label,
  value,
  isEditing,
  onChange,
  onEdit,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (text: string) => void;
  onEdit: () => void;
}) => (
  <View style={styles.item}>
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {!isEditing && (
        <TouchableOpacity onPress={onEdit}>
          <Icon
            name="edit"
            type="feather"
            size={18}
            color={appColors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
    {isEditing ? (
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholder={`Nhập ${label.toLowerCase()}`}
      />
    ) : (
      <Text style={styles.value}>{value || 'Chưa cập nhật'}</Text>
    )}
  </View>
);

const LabelAndValue = ({label, value}: {label: string; value: string}) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default ProfileDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  changeText: {
    marginTop: 6,
    fontSize: 14,
    color: appColors.primary,
    alignSelf: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  item: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#555',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 4,
    color: '#000',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
