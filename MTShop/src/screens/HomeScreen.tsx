import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import axios from 'axios';
import {Style} from '../styles/style';
import {HomeStyle} from '../styles/homeStyle';
import {appColors} from '../themes/appColors';
import ProductCard from '../components/ProductCardComponent';
import {showErrorToast} from '../utils/toast';
import {Product} from '../models/product';

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 6;

  const fetchProducts = async (pageNumber = 1) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`/product?page=${pageNumber}&limit=${limit}`);
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
      showErrorToast('Something went wrong');
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
    }, []),
  );

  const renderItem = ({item}: {item: Product}) => (
    <ProductCard
      image={item.imageUrl}
      name={item.name}
      price={item.price}
      onAddToCart={() => console.log(`Added ${item.name}`)}
    />
  );

  return (
    <View style={Style.container}>
      {/* Header */}
      <View style={HomeStyle.header}>
        <TouchableOpacity>
          <Icon name="filter" type="font-awesome" color={appColors.accent} />
        </TouchableOpacity>
        <TextInput
          style={HomeStyle.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity>
          <Icon
            name="shopping-cart"
            type="font-awesome"
            color={appColors.accent}
          />
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
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
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color={appColors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  loading: {
    padding: 16,
    alignItems: 'center',
  },
});
