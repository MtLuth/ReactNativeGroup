import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {appColors} from '../themes/appColors';
import {appFonts} from '../themes/appFont';
import GlobalText from '../components/GlobalText';

const {width} = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Chọn sản phẩm yêu thích',
    description: 'Chọn lựa dễ dàng – mua sắm thông minh.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    id: 2,
    title: 'Thanh toán',
    description: 'Thanh toán nhanh chóng, an toàn và tiện lợi.',
    image: require('../assets/images/onboarding2.png'),
  },
  {
    id: 3,
    title: 'Nhận hàng',
    description: 'Theo dõi đơn hàng dễ dàng.',
    image: require('../assets/images/onboarding3.png'),
  },
];

const Onboarding = ({navigation}: {navigation: any}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({index: currentIndex + 1});
    } else {
      navigation.replace('Login');
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({index: currentIndex - 1});
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderItem = ({item}: any) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <GlobalText style={styles.title}>{item.title}</GlobalText>
      <GlobalText style={styles.description}>{item.description}</GlobalText>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.pageNumberFlex}>
          <GlobalText style={[styles.pageNumber, styles.pageNumberActive]}>
            {currentIndex + 1}
          </GlobalText>
          <Text style={styles.pageNumber}>{`/${slides.length}`}</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <GlobalText style={styles.skipText}>Bỏ qua</GlobalText>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={item => item.id.toString()}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0}
          style={styles.prevTouch}>
          {currentIndex > 0 ? (
            <GlobalText style={styles.actionText}>Trước</GlobalText>
          ) : (
            ''
          )}
        </TouchableOpacity>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext}>
          <GlobalText style={styles.actionText}>
            {currentIndex === slides.length - 1 ? 'Bắt đầu' : 'Sau'}
          </GlobalText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  topBar: {
    marginTop: 50,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageNumber: {
    color: appColors.textInactive,
    fontSize: 18,
    fontFamily: appFonts.MontserratBold,
  },
  skipText: {
    color: appColors.primary,
    fontSize: 18,
    fontFamily: appFonts.MontserratBold,
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 24,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    width: 350,
    height: 350,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
    fontFamily: appFonts.MontserratBold,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
    fontFamily: appFonts.MontserratSemiBold,
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#1E5CB7',
    width: 24,
  },
  actionText: {
    color: '#1E5CB7',
    fontSize: 16,
    fontWeight: '500',
  },
  pageNumberFlex: {
    display: 'flex',
    flexDirection: 'row',
  },
  pageNumberActive: {
    color: appColors.primary,
  },
  prevTouch: {
    width: 54,
  },
});
