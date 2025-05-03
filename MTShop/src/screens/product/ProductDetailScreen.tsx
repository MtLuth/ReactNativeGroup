import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {appColors} from '../../themes/appColors';
import {showErrorToast} from '../../utils/toast';
import ReviewComponent from '../../components/ReviewComponent';
import AppMainContainer from '../../components/container/AppMainContainer';
import {getItem} from '../../utils/storage';

const ProductDetailScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        showErrorToast('Không thể tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = await getItem('accessToken');
      if (!token) {
        showErrorToast('Bạn cần đăng nhập để thêm vào giỏ hàng');
        return;
      }

      await axios.post(
        '/cart',
        {productId: product._id, quantity: 1},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      showSuccessToast('Sản phẩm đã được thêm vào giỏ hàng');
    } catch (error) {
      showErrorToast('Lỗi khi thêm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (!product) return null;

  return (
    <AppMainContainer isShowingBackButton={true}>
      <ScrollView style={styles.scrollContainer}>
        {/* Product Image */}
        <Image source={{uri: product.imageUrl}} style={styles.image} />

        <View style={styles.productInfo}>
          {/* Product Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Product Rating and Sales Info */}
          <View style={styles.infoRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐ {product.averageRating?.toFixed(1) || 0}
              </Text>
              <Text style={styles.reviewText}>
                ({product.totalReviews || 0} đánh giá)
              </Text>
            </View>
            <Text style={styles.soldText}>
              Đã bán: {product.totalOrders || 0}
            </Text>
          </View>

          {/* Price */}
          <Text style={styles.price}>{product.price.toLocaleString()} VND</Text>
        </View>

        {/* Product Description */}
        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Product Reviews */}
        <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
        {product.reviews.length === 0 ? (
          <Text style={styles.noReview}>Chưa có đánh giá nào.</Text>
        ) : (
          product.reviews.map((review: any) => (
            <ReviewComponent
              key={review._id}
              avt={review.user.avatar}
              fullName={review.user.fullName}
              rating={review.rating}
              comment={review.comment}
              createdAt={review.createdAt}
            />
          ))
        )}

        {/* Add to Cart Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppMainContainer>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginRight: 6,
  },
  reviewText: {
    fontSize: 13,
    color: '#666',
  },
  soldText: {
    fontSize: 13,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.primary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  noReview: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
