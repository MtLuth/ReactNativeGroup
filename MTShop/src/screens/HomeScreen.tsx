import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Icon, Image} from 'react-native-elements';
import axios from 'axios';
import {Style} from '../styles/style';
import {HomeStyle} from '../styles/homeStyle';
import {appColors} from '../themes/appColors';
import ProductCard from '../components/ProductCardComponent';
import {showErrorToast, showSuccessToast} from '../utils/toast';
import {Product} from '../models/product';
import {getItem} from '../utils/storage';
import AppMainContainer from '../components/container/AppMainContainer';

const {height} = Dimensions.get('window');

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');
  const modalAnim = useRef(new Animated.Value(height)).current;
  const navigation = useNavigation<any>();
  const [cartCount, setCartCount] = useState(0);

  const limit = 6;

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/category');
      setCategories([{_id: '', name: 'Tất cả'}, ...res.data.data]);
    } catch (error) {
      showErrorToast('Không thể tải danh mục');
    }
  };

  const onOpenCategoryModal = () => {
    fetchCategories();
    setShowModal(true);
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onCloseCategoryModal = () => {
    Animated.timing(modalAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
    });
  };

  const fetchProducts = async (
    pageNumber = 1,
    selectedCategory = category,
    search = searchText,
  ) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const params: any = {
        page: pageNumber,
        limit,
      };

      if (selectedCategory && selectedCategory !== '1111') {
        params.category = selectedCategory;
      }

      if (search) {
        params.search = search;
      }

      const res = await axios.get(`/product`, {params});
      const newProducts = res.data?.data?.products || [];

      if (pageNumber === 1) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      if (newProducts.length < limit) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      showErrorToast('Đã có lỗi khi tải sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      fetchProducts(1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, category]),
  );

  const addToCart = async (productId: string) => {
    try {
      const token = await getItem('accessToken');
      if (!token) {
        showErrorToast('Bạn cần đăng nhập để mua hàng');
        return;
      }

      await axios.post(
        '/cart',
        {productId, quantity: 1},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      showSuccessToast('Đã thêm vào giỏ hàng');
      await fetchCartCount();
    } catch (error) {
      showErrorToast('Lỗi khi thêm vào giỏ hàng' + error);
    }
  };

  const renderItem = ({item}: {item: Product}) => (
    <ProductCard
      image={item.imageUrl}
      name={item.name}
      price={item.price}
      rating={item.averageRating}
      reviewCount={item.totalReviews}
      soldCount={item.totalOrders}
      onAddToCart={() => addToCart(item._id)}
      onPress={() => navigation.navigate('ProductDetail', {id: item._id})}
    />
  );
  const fetchCartCount = async () => {
    try {
      const token = await getItem('accessToken');
      if (!token) return;

      const res = await axios.get('/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartCount(res.data.data.length);
      console.log('Số lượng giỏ hàng:', res.data.data.length);
      console.log('Chi tiết:', res.data.data);
    } catch (error) {
      showErrorToast('Lỗi lấy số lượng giỏ hàng:' + error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartCount();
    }, []),
  );
  return (
    <AppMainContainer>
      {/* <View style={HomeStyle.header}>
        <TouchableOpacity onPress={onOpenCategoryModal}>
          <Icon name="filter" type="font-awesome" color={appColors.accent} />
        </TouchableOpacity>
        <TextInput
          style={HomeStyle.searchInput}
          placeholder="Tìm tên sản phẩm..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={{padding: 5}}>
          <Icon
            name="shopping-cart"
            type="font-awesome"
            color={appColors.accent}
            size={24}
          />
          {cartCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: -6,
                top: -4,
                backgroundColor: 'red',
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}>
              <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>
                {cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View> */}
      {/* Modal Animated */}
      <Modal visible={showModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {transform: [{translateY: modalAnim}]},
            ]}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item._id}
              renderItem={({item}) => {
                const isSelected = category === item._id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      isSelected && styles.selectedCategoryItem,
                    ]}
                    onPress={() => {
                      const selected = item._id;
                      setCategory(selected);
                      setPage(1);
                      setHasMore(true);
                      fetchProducts(1, selected, searchText);
                      onCloseCategoryModal();
                    }}>
                    <View style={styles.categoryRow}>
                      <Text
                        style={[
                          styles.categoryText,
                          isSelected && styles.selectedCategoryText,
                        ]}>
                        {item.name}
                      </Text>
                      {isSelected && (
                        <Icon
                          name="check"
                          type="font-awesome"
                          size={16}
                          color={appColors.primary}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={onCloseCategoryModal}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        numColumns={2}
        contentContainerStyle={HomeStyle.productList}
        columnWrapperStyle={HomeStyle.row}
        onEndReached={() => fetchProducts(page)}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Image
            source={{
              uri: 'https://i.ibb.co/1G2Y1Bkb/online-shopping-web-banner-template-design-flat-design-style-online-shopping-web-banner-vector-illus.jpg',
            }}
            style={styles.banner}
            resizeMode="cover"
          />
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color={appColors.primary} />
            </View>
          ) : null
        }
      />
    </AppMainContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  loading: {
    padding: 16,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 160,
    marginBottom: 12,
    borderRadius: 10,
    marginTop: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  categoryText: {
    fontSize: 16,
    marginLeft: 14,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: '#05294B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedCategoryItem: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  selectedCategoryText: {
    color: appColors.primary,
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 14,
  },
});
