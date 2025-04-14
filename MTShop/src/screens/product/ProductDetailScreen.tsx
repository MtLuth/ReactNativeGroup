import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {appColors} from '../../themes/appColors';
import {showErrorToast} from '../../utils/toast';
import ReviewComponent from '../../components/ReviewComponent';

const ProductDetailScreen = ({route}) => {
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (!product) return null;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Ảnh sản phẩm */}
        <Image source={{uri: product.imageUrl}} style={styles.image} />

        {/* Tên và giá */}
        <Text style={styles.name}>{product.name}</Text>

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

        <Text style={styles.price}>{product.price.toLocaleString()} VND</Text>

        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{product.description}</Text>
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
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 16,
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
});
