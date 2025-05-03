import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {socket} from '../../utils/socket';
import {decodeJWT, getItem} from '../../utils/storage';
import {showErrorToast} from '../../utils/toast';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import AppMainContainer from '../../components/container/AppMainContainer';

const screenWidth = Dimensions.get('window').width;

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchNotifications = async () => {
    try {
      const token = await getItem('accessToken');
      if (!token) return;

      const decoded = decodeJWT(token);
      const userId = decoded?.userId || decoded?._id;
      if (!userId) return;

      const res = await axios.get(`/notification/${userId}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      setNotifications(res.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error fetching notifications:', err.response?.data);
      }
      showErrorToast('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    socket.on('notification:new', data => {
      setNotifications(prev => [data, ...prev]);
    });
    return () => socket.off('notification:new');
  }, []);

  const getIconByType = type => {
    switch (type) {
      case 'ORDER_PLACED':
        return {name: 'shopping-cart', color: '#2f80ed'};
      case 'ORDER_CANCELED':
        return {name: 'times-circle', color: '#eb5757'};
      case 'ORDER_DELIVERED':
        return {name: 'check-circle', color: '#27ae60'};
      default:
        return {name: 'bell', color: '#828282'};
    }
  };

  const renderItem = ({item}) => {
    const icon = getIconByType(item.type);
    return (
      <View style={styles.card}>
        <Icon
          name={icon.name}
          type="font-awesome"
          color={icon.color}
          size={20}
          containerStyle={styles.icon}
        />
        <View style={styles.textContent}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <AppMainContainer mainTitle="Thông báo" isShowingBackButton={true}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2f80ed" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      )}
    </AppMainContainer>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    width: screenWidth - 32,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
