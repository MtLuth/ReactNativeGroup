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
import {showErrorToast} from '../../utils/toast';
import MTShopSearchBar from '../../components/input/SearchBarComponent';

const limit = 10;

const ProductFilterScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {searchText, context} = route.params;
  const [searchContent, setSearchContent] = useState(searchText);

  const fetchProducts = async (pageNumber = 1, search = '') => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching products:', pageNumber, search);
      const res = await axios.get(`/product`, {
        params: {
          page: pageNumber,
          limit,
          search,
        },
      });

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

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(1, searchContent);
  }, [searchContent]);

  const handleSearch = (text: string) => {
    setPage(1);
    setHasMore(true);
    setProducts([]);
    fetchProducts(1, text);
  };

  const renderItem = ({item}: {item: Product}) => (
    <ProductCard
      image={item.imageUrl}
      name={item.name}
      price={item.price}
      rating={item.averageRating}
      reviewCount={item.totalReviews}
      soldCount={item.totalOrders}
      onAddToCart={() => {}}
      onPress={() => navigation.navigate('ProductDetail', {id: item._id})}
    />
  );

  return (
    <AppMainContainer>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        onEndReached={() => fetchProducts(page, searchText)}
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
  },
  row: {
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
