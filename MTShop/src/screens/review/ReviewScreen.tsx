import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import axios, {isAxiosError} from 'axios';
import {getItem} from '../../utils/storage';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import {appColors} from '../../themes/appColors';

const ReviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {productId, orderId} = route.params;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    if (!comment.trim()) {
      showErrorToast('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      const token = await getItem('accessToken');
      await axios.post(
        'http://10.0.2.2:8080/api/v1/review',
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
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá sản phẩm</Text>

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
        placeholder="Hãy chia sẻ cảm nhận Fcủa bạn về sản phẩm"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={submitReview}
        disabled={submitting}>
        <Text style={styles.submitText}>
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Text>
      </TouchableOpacity>
    </View>
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
    color: '#333',
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
});
