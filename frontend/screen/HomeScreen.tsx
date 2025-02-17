import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Icon} from 'react-native-elements';

const HomeScreen = navigation => {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  axios.defaults.baseURL = 'http://192.168.1.138:8080';

  useEffect(() => {
    fetchCategories();
    fetchBestSellers();
    fetchProducts();
  }, [navigation]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/v1/category');
      setCategories(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('An unexpected error occurred');
      }
    }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await axios.get('api/v1/product');
      setProducts(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('An unexpected error occurred');
      }
    }
  };

  const fetchProducts = async () => {
    // Gọi API lấy danh sách sản phẩm theo giá tăng dần (lazy loading)
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="heartbeat"
          type="font-awesome"
          color="#f50"
          onPress={() => console.log('hello')}
        />
        <TextInput placeholder="Search" style={styles.searchInput} />
        <TouchableOpacity>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{uri: 'https://via.placeholder.com/40'}}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Slide Show */}
        <View style={styles.slideShow}>
          <Text style={styles.slideShowText}>Slide show</Text>
        </View>

        {/* Danh sách category */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity key={category._id} style={styles.categoryItem}>
                <Text>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 10 sản phẩm bán chạy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
          {bestSellers.map(product => (
            <View key={product.id} style={styles.productItem}>
              <Image
                source={{uri: product.imageUrl}}
                style={styles.productImage}
              />
              <Text>{product.name}</Text>
            </View>
          ))}
        </View>

        {/* Lazy loading sản phẩm */}
        <View style={styles.section}>
          <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.productItem}>
                <Image
                  source={{uri: item.imageUrl}}
                  style={styles.productImage}
                />
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.price}</Text>
                </View>
              </View>
            )}
            onEndReached={() => setPage(page + 1)}
            onEndReachedThreshold={0.5}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
  },

  icon: {fontSize: 18},

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },

  slideShow: {
    height: 150,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  slideShowText: {
    color: '#fff',
    fontSize: 18,
  },

  section: {
    padding: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  categoryItem: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#90EE90',
    borderRadius: 10,
  },

  productItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
  },

  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },

  lazyLoadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },

  navigation: {
    height: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navigationText: {
    color: '#fff',
    fontSize: 18,
  },

  productFlexBox: {
    display: 'flex',
  },
});

export default HomeScreen;
