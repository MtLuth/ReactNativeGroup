import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import axios, {isAxiosError} from 'axios';
import {getItem} from '../../utils/storage';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {appColors} from '../../themes/appColors';
import AppMainContainer from '../../components/container/AppMainContainer';
import {appFonts} from '../../themes/appFont';
import AuthButton from '../../components/buttons/AuthButton';

const ReviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {productId, orderId, productName, productImage} =
    route.params || ({} as any);

  const submitReview = async () => {
    if (!comment.trim()) {
      showErrorToast('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      const token = await getItem('accessToken');
      await axios.post(
        '/review',
        {
          product: productId,
          order: orderId,
          rating,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      showSuccessToast('Đánh giá thành công');
      navigation.goBack();
    } catch (error) {
      if (isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || 'Lỗi');
      } else {
        showErrorToast('Lỗi');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppMainContainer
      mainTitle="Đánh giá sản phẩm"
      isShowingBackButton={true}
      isShowRightIcon={false}>
      <View style={styles.container}>
        <View style={styles.productInfo}>
          <Image source={{uri: productImage}} style={styles.productImage} />
          <Text style={styles.productName}>{productName}</Text>
        </View>
        <Text style={styles.label}>Chọn số sao:</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Icon
                name="star"
                type="font-awesome"
                size={28}
                color={star <= rating ? '#FFD700' : '#ccc'}
                style={{marginHorizontal: 4}}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Nhận xét của bạn:</Text>
        <TextInput
          style={styles.textInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm"
          multiline
          numberOfLines={4}
        />

        <AuthButton
          text="Gửi đánh giá"
          onPress={submitReview}
          loading={submitting}
        />
      </View>
    </AppMainContainer>
  );
};

export default ReviewScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: appColors.textPrimary,
    fontFamily: appFonts.MontserratBold,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    fontFamily: appFonts.MontserratRegular,
  },
  submitButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  productInfo: {
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    borderRadius: 0,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
    fontFamily: appFonts.MontserratBold,
    paddingTop: 10,
  },
});
