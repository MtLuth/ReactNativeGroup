import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import {Icon} from 'react-native-elements';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {getItem} from '../../utils/storage';

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
}

const LIMIT = 6;

export default function ProductManagerScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(products.length / LIMIT);
  const currentPageData = products.slice((page - 1) * LIMIT, page * LIMIT);

  const fetchProducts = async () => {
    setLoading(true);
    const token = await getItem('accessToken');
    try {
      const res = await axios.get('/product', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setProducts(res.data.data.products);
    } catch {
      showErrorToast('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (p: Product) => {
    // mở modal sửa giống trước...
  };

  const remove = async (id: string) => {
    const token = await getItem('accessToken');
    try {
      await axios.delete(`/product/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      showSuccessToast('Đã xoá sản phẩm');
      fetchProducts();
    } catch {
      showErrorToast('Không xoá được');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({item}: {item: Product}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{uri: item.imageUrl || 'https://via.placeholder.com/80'}}
          style={styles.thumb}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.salePrice ? (
            <View style={styles.priceRow}>
              <Text style={styles.originalPrice}>{item.price}₫</Text>
              <Text style={styles.discountPrice}>
                {Math.round(item.price * (1 - item.salePrice / 100))}₫
              </Text>
            </View>
          ) : (
            <Text style={styles.normalPrice}>{item.price}₫</Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => openEdit(item)}
            style={styles.btnAction}>
            <Icon name="edit" type="font-awesome" size={16} color="#05294B" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => remove(item._id)}
            style={[styles.btnAction, {marginLeft: 8}]}>
            <Icon name="trash" type="font-awesome" size={16} color="#e25822" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>
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
                <Text style={styles.pageBtnText}>‹</Text>
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
                <Text style={styles.pageBtnText}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#05294B',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 6,
  },
  discountPrice: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  normalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#05294B',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnAction: {
    padding: 8,
    backgroundColor: '#e6eaf0',
    borderRadius: 8,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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
    fontSize: 16,
  },
  pageNum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
  },
});
