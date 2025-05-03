import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import AppMainContainer from '../../components/container/AppMainContainer';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';
import ProductCard from '../../components/ProductCardComponent';
import {Product} from '../../models/product';
import {appColors} from '../../themes/appColors';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import MTShopSearchBar from '../../components/input/SearchBarComponent';
import {getItem} from '../../utils/storage';
import {useCart} from '../../context/CartContext';

const limit = 10;

const ProductFilterScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {searchText, context, categoryId} = route.params;
  const [searchContent, setSearchContent] = useState(searchText);
  const [category, setCategory] = useState(categoryId);
  const {cartCount, updateCart} = useCart();

  const fetchProducts = async (pageNumber = 1, search = '') => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const params: any = {
        page: pageNumber,
        limit,
        search,
      };
      if (context === 'best-sellers') {
        params.sortBy = 'totalOrders';
        params.sortOrder = 'desc';
      }
      if (category) {
        params.category = category;
      }
      console.log('params', params);

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
      showErrorToast('Lỗi tìm kiếm sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = getItem('accessToken');
      if (!token) return;
      const res = await axios.get('/cart', {
        headers: {Authorization: `Bearer ${token}`},
      });
      updateCart(res.data.data.length);
    } catch (error) {
      showErrorToast('Lỗi lấy giỏ hàng');
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const token = getItem('accessToken');
      if (!token) {
        showErrorToast('Bạn cần đăng nhập để mua hàng');
        return;
      }
      await axios.post(
        '/cart',
        {productId, quantity: 1},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      fetchCartCount();
      showSuccessToast('Đã thêm vào giỏ hàng');
    } catch (error) {
      showErrorToast('Lỗi khi thêm vào giỏ hàng');
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(1, searchContent);
  }, [searchContent]);

  const handleSearch = (text: string) => {
    console.log('text', text);
    setSearchContent(text);
    setCategory('');
    setPage(1);
    setHasMore(true);
    setProducts([]);
  };

  const renderItem = ({item}: {item: Product}) => (
    <ProductCard
      image={item.imageUrl}
      name={item.name}
      price={item.price}
      rating={item.averageRating}
      reviewCount={item.totalReviews}
      soldCount={item.totalOrders}
      onAddToCart={() => addToCart(item._id)} // ✅ gọi hàm mới
      onPress={() => navigation.navigate('ProductDetail', {id: item._id})}
    />
  );

  return (
    <AppMainContainer isShowingBackButton={true}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        onEndReached={() => fetchProducts(page, searchContent)}
        onEndReachedThreshold={1}
        ListHeaderComponent={
          <View>
            <MTShopSearchBar
              placeholder="Nhập tên sản phẩm"
              defaultValue={searchContent}
              onSubmit={handleSearch}
            />
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color={appColors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text>Không tìm thấy sản phẩm nào.</Text>
            </View>
          ) : null
        }
      />
    </AppMainContainer>
  );
};

export default ProductFilterScreen;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  row: {
    paddingHorizontal: 0,
    gap: 12,
    justifyContent: 'space-between',
  },
  loading: {
    padding: 16,
    alignItems: 'center',
  },
  empty: {
    marginTop: 32,
    alignItems: 'center',
  },
});
