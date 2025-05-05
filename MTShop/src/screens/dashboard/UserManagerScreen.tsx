import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {Icon} from 'react-native-elements';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {getItem} from '../../utils/storage';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
}

const LIMIT = 6;

export default function UserManagerScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(users.length / LIMIT);
  const currentPageData = users.slice((page - 1) * LIMIT, page * LIMIT);

  const fetchUsers = async () => {
    setLoading(true);
    const token = await getItem('accessToken');
    try {
      const res = await axios.get('/user/all', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setUsers(res.data.data);
    } catch {
      showErrorToast('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (
    userId: string,
    currentRole: string | undefined,
  ) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const token = await getItem('accessToken');
    try {
      await axios.put(
        `/user/${userId}/role`,
        {role: newRole},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      showSuccessToast(`Chuyển vai trò thành ${newRole}`);
      fetchUsers();
    } catch {
      showErrorToast('Không thể cập nhật vai trò');
    }
  };

  const renderItem = ({item}: {item: User}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>

        <View style={styles.roleRow}>
          <Text
            style={[
              styles.roleLabel,
              item.role === 'admin' && styles.adminRole,
            ]}>
            {item.role || 'user'}
          </Text>
          <TouchableOpacity
            onPress={() => toggleRole(item._id, item.role)}
            style={styles.btnToggle}>
            <Text style={styles.btnToggleText}>
              {item.role === 'admin' ? 'Chuyển về user' : 'Chuyển thành admin'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý người dùng</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            data={currentPageData}
            keyExtractor={item => item._id}
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
  container: {flex: 1, padding: 16, backgroundColor: '#f8f9fa'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#05294B'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 8,
  },
  name: {fontSize: 16, fontWeight: '600', color: '#333'},
  email: {fontSize: 14, color: '#666', marginTop: 2},

  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  roleLabel: {
    backgroundColor: '#e0ecff',
    color: '#1a73e8',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontSize: 13,
    fontWeight: '500',
  },
  adminRole: {
    backgroundColor: '#ffe8d9',
    color: '#e25822',
  },
  btnToggle: {
    backgroundColor: '#05294B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnToggleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

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
