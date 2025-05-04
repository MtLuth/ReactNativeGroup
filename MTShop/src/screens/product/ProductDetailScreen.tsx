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
import {Icon} from 'react-native-elements';
import {appColors} from '../../themes/appColors';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {getItem} from '../../utils/storage';
import AppMainContainer from '../../components/container/AppMainContainer';
import ReviewComponent from '../../components/ReviewComponent';
import HorizontalSlideContainer from '../../components/container/HorizontalSlideContainer';
import {appFonts} from '../../themes/appFont';

const ProductDetailScreen = ({route}) => {
  const {id} = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setProduct(res.data.data);
      } catch (e) {
        showErrorToast('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const params: any = {};
        if (product?.category?._id) {
          params.category = product.category._id;
        }

        const res = await axios.get(`/product`, {params}); // <-- đúng cách truyền params
        setRelatedProducts(res.data.data?.products || []);
      } catch (e) {
        showErrorToast('Không thể tải sản phẩm liên quan');
      }
    };

    fetchDetail();
    fetchRelatedProducts();
  }, [id]);

  const renderHorizontalProduct = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.push('ProductDetail', {id: item._id})}
      style={{width: 160, marginRight: 12}}>
      <View style={{backgroundColor: '#fff', borderRadius: 10, padding: 10}}>
        <Image
          source={{uri: item.imageUrl}}
          style={{
            width: '100%',
            height: 100,
            borderRadius: 8,
            marginBottom: 6,
          }}
        />
        <Text numberOfLines={1} style={{fontWeight: '600', fontSize: 14}}>
          {item.name}
        </Text>

        <View style={{marginBottom: 4}}>
          {item.salePrice ? (
            <>
              <Text
                style={{
                  fontSize: 13,
                  color: '#999',
                  textDecorationLine: 'line-through',
                  marginBottom: 2,
                }}>
                {item.price.toLocaleString()} VND
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#05294B',
                }}>
                {item.finalPrice.toLocaleString()} VND
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#05294B',
                }}>
                {item.price.toLocaleString()} VND
              </Text>
              <View style={{height: 18}} />
            </>
          )}
        </View>

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
          <Icon name="star" type="font-awesome" size={12} color="#FFD700" />
          <Text style={{fontSize: 12, color: '#666', marginLeft: 4}}>
            {item.averageRating?.toFixed(1)} | {item.totalOrders} đã bán
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const addToCart = async () => {
    try {
      const token = await getItem('accessToken');
      if (!token) {
        showErrorToast('Bạn cần đăng nhập để mua hàng');
        return;
      }

      await axios.post(
        '/cart',
        {productId: product._id, quantity: 1},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      showSuccessToast('Đã thêm vào giỏ hàng');
    } catch {
      showErrorToast('Lỗi khi thêm vào giỏ');
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
        <Image source={{uri: product.imageUrl}} style={styles.image} />

        <View style={styles.contentBox}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Icon name="star" type="font-awesome" size={16} color="#FFD700" />
            <Text style={styles.rating}>
              {product.averageRating?.toFixed(1)}
            </Text>
            <Text style={styles.ratingCount}>
              ({product.totalReviews} đánh giá)
            </Text>
          </View>

          <View style={styles.priceRow}>
            {product.salePrice && (
              <Text style={styles.oldPrice}>
                {product.price?.toLocaleString() + ' '} VND
              </Text>
            )}
            <Text style={styles.salePrice}>
              {product.salePrice
                ? product.finalPrice.toLocaleString() + ' '
                : product.price.toLocaleString() + ' '}
              VND
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => addToCart(item._id)}
            style={{
              backgroundColor: appColors.primaryLight,
              paddingVertical: 6,
              borderRadius: 6,
              alignItems: 'center',
              width: 150,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: appFonts.MontserratBold,
              }}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Mô tả</Text>
          {product.description ? (
            <>
              <Text
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 4}>
                {product.description}
              </Text>
              {product.description.length > 80 && (
                <TouchableOpacity
                  onPress={() => setShowFullDescription(!showFullDescription)}>
                  <Text style={styles.toggleDesc}>
                    {showFullDescription ? 'Ẩn bớt' : '...Xem thêm'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noReview}>Chưa có mô tả cho sản phẩm này.</Text>
          )}
        </View>
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
          {product.reviews?.length === 0 ? (
            <Text style={styles.noReview}>Chưa có đánh giá.</Text>
          ) : (
            product.reviews.map(review => (
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

        <View style={styles.similarSection}>
          <Text style={styles.sectionTitle}>Sản phẩm tương tự</Text>
          <HorizontalSlideContainer
            data={relatedProducts}
            keyExtractor={item => item._id}
            renderItem={renderHorizontalProduct}
            horizontalSpacing={12}
          />
        </View>
      </ScrollView>
    </AppMainContainer>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#f6f6f6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '92%',
    height: 220,
    borderRadius: 14,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  contentBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 13,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 8,
  },
  oldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  toggleDesc: {
    color: appColors.primary,
    fontSize: 13,
    marginTop: 4,
  },
  noReview: {
    paddingHorizontal: 16,
    fontStyle: 'italic',
    color: '#888',
  },
  cartButton: {
    margin: 16,
    backgroundColor: appColors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  similarSection: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
});
