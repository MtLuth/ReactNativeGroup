import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Text,
    Animated,
    Dimensions,
    Modal,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import { Product } from '../../models/product';
import ProductCard from '../../components/ProductCardComponent';
import { showErrorToast } from '../../utils/toast';
import { appColors } from '../../themes/appColors';

const { height } = Dimensions.get('window');
const limit = 8;

const SearchScreen = () => {
    const navigation = useNavigation<any>();

    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [category, setCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const modalAnim = useRef(new Animated.Value(height)).current;

    const openModal = () => {
        fetchCategories();
        setShowModal(true);
        Animated.timing(modalAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalAnim, {
            toValue: height,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setShowModal(false));
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/category');
            setCategories([{ _id: '', name: 'Tất cả' }, ...res.data.data]);
        } catch {
            showErrorToast('Không thể tải danh mục');
        }
    };

    const fetchProducts = async (
        pageNumber = 1,
        selectedCategory = category,
        search = searchText,
    ) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const params: any = { page: pageNumber, limit };
            if (selectedCategory) params.category = selectedCategory;
            if (search) params.search = search;

            const res = await axios.get('/product', { params });
            const data: Product[] = res.data?.data?.products ?? [];

            pageNumber === 1 ? setProducts(data) : setProducts(prev => [...prev, ...data]);
            setHasMore(data.length === limit);
            if (data.length === limit) setPage(prev => prev + 1);
        } catch {
            showErrorToast('Đã có lỗi khi tải sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setPage(1);
            setHasMore(true);
            fetchProducts(1);
        }, [searchText, category]),
    );

    const renderProduct = ({ item }: { item: Product }) => (
        <ProductCard
            image={item.imageUrl}
            name={item.name}
            price={item.price}
            rating={item.averageRating}
            reviewCount={item.totalReviews}
            soldCount={item.totalOrders}
            onAddToCart={() => {}}
            onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
        />
    );

    return (
        <View style={styles.container}>
            {/* header search */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openModal}>
                    <Icon name="filter" type="font-awesome" color={appColors.accent} />
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm tên sản phẩm..."
                    value={searchText}
                    onChangeText={setSearchText}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                        setPage(1);
                        setHasMore(true);
                        fetchProducts(1, category, searchText);
                    }}
                />
            </View>

            <Modal visible={showModal} transparent animationType="none">
                <View style={styles.modalOverlay}>
                    <Animated.View style={[styles.modalContainer, { transform: [{ translateY: modalAnim }] }]}>
                        <Text style={styles.modalTitle}>Chọn danh mục</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={i => i._id}
                            renderItem={({ item }) => {
                                const selected = item._id === category;
                                return (
                                    <TouchableOpacity
                                        style={[styles.categoryItem, selected && styles.selectedCategoryItem]}
                                        onPress={() => {
                                            setCategory(item._id);
                                            closeModal();
                                        }}
                                    >
                                        <Text style={[styles.categoryText, selected && styles.selectedCategoryText]}>
                                            {item.name}
                                        </Text>
                                        {selected && <Icon name="check" type="font-awesome" size={16} color={appColors.primary} />}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item._id}
                numColumns={2}
                contentContainerStyle={styles.productList}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
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

export default SearchScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
    },

    /* list */
    productList: { paddingBottom: 16 },

    loading: { padding: 16, alignItems: 'center' },

    /* modal */
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: height * 0.6,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    categoryItem: {
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryText: { fontSize: 16 },
    selectedCategoryItem: { backgroundColor: '#f0f8ff' },
    selectedCategoryText: { color: appColors.primary, fontWeight: 'bold' },
    closeButton: {
        marginTop: 16,
        alignSelf: 'center',
        backgroundColor: '#05294B',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeButtonText: { color: '#fff', fontWeight: 'bold' },
});
