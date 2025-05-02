import React, { useEffect, useState, useCallback } from 'react';
import {
    View, FlatList, Text, TouchableOpacity, StyleSheet, Modal,
    TextInput, ActivityIndicator, Image, PermissionsAndroid, Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import axios from 'axios';
// @ts-ignore
import debounce from 'lodash.debounce';

import { appColors } from '../../themes/appColors';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import {requestGalleryPermission} from "../../utils/permissions.ts";

interface Product { _id:string; name:string; price:number; imageUrl?:string }
const LIMIT = 10;

export default function ProductManagerScreen() {
    /* ------------- state ------------- */
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage]         = useState(1);
    const [total, setTotal]       = useState(1);
    const [loading, setLoading]   = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch]     = useState('');

    /* modal & form */
    const [modal , setModal ] = useState(false);
    const [editing, setEditing] = useState<Product|null>(null);
    const [form, setForm]       = useState({ name:'', price:'', imageUrl:'' });
    const [picker, setPicker]   = useState<Asset|null>(null);   // ảnh mới

    /* ------------- API ------------- */
    const fetchProducts = async (p=1) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await axios.get('/product', { params:{ page:p, limit:LIMIT, search } });
            p === 1 ? setProducts(res.data.data.products)
                : setProducts(prev => [...prev, ...res.data.data.products]);
            setPage(p);
            setTotal(res.data.data.totalPages || 1);
        } catch { showErrorToast('Không thể tải sản phẩm'); }
        finally { setLoading(false); setRefreshing(false); }
    };

    const onSearch = useCallback(debounce((q)=>{ setSearch(q); fetchProducts(1); },300),[]);

    const pick = async () => {
        const ok = await requestGalleryPermission();
        if (!ok) {
            showErrorToast('Ứng dụng cần quyền truy cập ảnh');
            return;
        }

        launchImageLibrary({ mediaType: 'photo' }, res => {
            if (res.assets?.length) setPicker(res.assets[0]);
        });
    };

    const uploadImage = async () => {
        if (!picker) return form.imageUrl;
        const data = new FormData();
        data.append('file', { uri:picker.uri, name:picker.fileName, type:picker.type } as any);
        const r = await axios.post('/media/upload', data, {
            headers:{ 'Content-Type':'multipart/form-data' },
        });
        return r.data.url;
    };

    /* ------------- save / delete ------------- */
    const save = async () => {
        try {
            const url = await uploadImage();
            if (editing) {
                await axios.put(`/product/${editing._id}`, { name:form.name, price:form.price, imageUrl:url });
                showSuccessToast('Đã cập nhật');
            } else {
                await axios.post('/product', { name:form.name, price:form.price, imageUrl:url });
                showSuccessToast('Đã thêm');
            }
            setModal(false); fetchProducts(1);
        } catch { showErrorToast('Lỗi khi lưu'); }
    };
    const remove = async (id:string) => {
        try { await axios.delete(`/product/${id}`); showSuccessToast('Đã xoá'); fetchProducts(1); }
        catch { showErrorToast('Không xoá được'); }
    };

    /* ------------- init ------------- */
    useEffect(()=>{ fetchProducts(1); }, []);

    /* ------------- list row ------------- */
    const Row = ({ item }:{ item:Product }) => (
        <View style={styles.row}>
            <Image source={{ uri:item.imageUrl || 'https://via.placeholder.com/60' }} style={styles.thumb}/>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity onPress={()=>openEdit(item)}><Icon name="edit" type="font-awesome" size={16}/></TouchableOpacity>
            <TouchableOpacity onPress={()=>remove(item._id)} style={{marginLeft:14}}>
                <Icon name="trash" type="font-awesome" color="red" size={16}/>
            </TouchableOpacity>
        </View>
    );

    /* ------------- pagination component giữ nguyên ------------- */
    const goPage = (p:number) => { if (p<1||p>total) return; fetchProducts(p); };
    const PageButtons = () => { /* ... giữ nguyên code như trước ... */ };

    /* ------------- modal helpers ------------- */
    const openAdd = () => {
        setEditing(null); setForm({ name:'', price:'', imageUrl:'' }); setPicker(null); setModal(true);
    };
    const openEdit = (p:Product) => {
        setEditing(p);
        setForm({ name:p.name, price:String(p.price), imageUrl:p.imageUrl||'' });
        setPicker(null);
        setModal(true);
    };

    /* ------------- render ------------- */
    return (
        <View style={styles.container}>
            {/* ---------- search ---------- */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Icon name="search" type="font-awesome" size={14} color="#777"/>
                    <TextInput placeholder="Tìm sản phẩm..." style={styles.searchInput}
                               onChangeText={txt=>onSearch(txt)} clearButtonMode="while-editing"/>
                </View>
                <TouchableOpacity style={styles.add} onPress={openAdd}>
                    <Icon name="plus" type="font-awesome" color="#fff" size={14}/>
                    <Text style={{color:'#fff',marginLeft:6}}>Thêm</Text>
                </TouchableOpacity>
            </View>

            {/* ---------- list ---------- */}
            {loading && page===1 ? (
                <ActivityIndicator size="large" color={appColors.primary}/>
            ) : (
                <>
                    <FlatList
                        data={products}
                        keyExtractor={i=>i._id}
                        renderItem={Row}
                        ItemSeparatorComponent={()=> <View style={styles.sep}/>}
                        onRefresh={()=>{setRefreshing(true); fetchProducts(1);}}
                        refreshing={refreshing}
                    />
                    <PageButtons/>
                </>
            )}

            {/* ---------- modal ---------- */}
            <Modal visible={modal} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.box}>
                        <Text style={styles.modalTitle}>{editing?'Sửa':'Thêm'} sản phẩm</Text>

                        {/* preview ảnh */}
                        {(picker || form.imageUrl) && (
                            <Image
                                source={{ uri: picker?.uri || form.imageUrl }}
                                style={styles.preview}
                            />
                        )}

                        <TouchableOpacity style={styles.imageBtn} onPress={pick}>
                            <Icon name="image" type="font-awesome" color="#fff" size={14}/>
                            <Text style={{color:'#fff',marginLeft:6}}>
                                {picker ? 'Đổi ảnh' : (form.imageUrl ? 'Thay ảnh' : 'Chọn ảnh')}
                            </Text>
                        </TouchableOpacity>
                        {picker && <Text style={styles.fileName}>{picker.fileName}</Text>}

                        <TextInput style={styles.input} placeholder="Tên" value={form.name}
                                   onChangeText={name=>setForm({...form,name})}/>
                        <TextInput style={styles.input} placeholder="Giá" value={form.price}
                                   onChangeText={price=>setForm({...form,price})} keyboardType="numeric"/>

                        <View style={styles.btnRow}>
                            <TouchableOpacity onPress={()=>setModal(false)} style={styles.cancel}><Text>Huỷ</Text></TouchableOpacity>
                            <TouchableOpacity onPress={save} style={styles.save}><Text style={{color:'#fff'}}>Lưu</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
    container:{flex:1,backgroundColor:'#fff',padding:16},
    searchRow:{flexDirection:'row',alignItems:'center',marginBottom:10},
    searchBox:{flexDirection:'row',alignItems:'center',flex:1,
        borderWidth:1,borderColor:'#ddd',borderRadius:30,paddingHorizontal:10},
    searchInput:{flex:1,marginLeft:6,paddingVertical:4},
    add:{flexDirection:'row',alignItems:'center',backgroundColor:appColors.primary,
        paddingHorizontal:12,paddingVertical:8,borderRadius:8,marginLeft:10},
    row:{flexDirection:'row',alignItems:'center',paddingVertical:8},
    thumb:{width:60,height:60,borderRadius:6,backgroundColor:'#eee',marginRight:8},
    name:{flex:1},
    price:{width:80},
    sep:{height:1,backgroundColor:'#eee'},
    overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center'},
    box:{backgroundColor:'#fff',margin:20,padding:20,borderRadius:10},
    modalTitle:{fontSize:18,fontWeight:'bold',marginBottom:10},
    input:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:8,marginBottom:10},
    imageBtn:{flexDirection:'row',alignItems:'center',backgroundColor:appColors.primary,
        padding:8,borderRadius:6},
    fileName:{fontSize:12,marginTop:6},
    btnRow:{flexDirection:'row',justifyContent:'flex-end',marginTop:20},
    cancel:{padding:8,marginRight:12},
    save:{backgroundColor:appColors.primary,paddingHorizontal:16,paddingVertical:8,borderRadius:6},

    pageRow:{flexDirection:'row',justifyContent:'center',alignItems:'center',marginVertical:10},
    pageBtn:{paddingHorizontal:8},
    pageText:{color:'#444'},
    pageDisabled:{color:'#bbb'},
    pageNum:{paddingHorizontal:8,paddingVertical:4,marginHorizontal:2,borderRadius:4},
    pageActive:{backgroundColor:appColors.primary},
    pageActiveText:{color:'#fff'},
    preview:{ width:120,height:120,borderRadius:8,alignSelf:'center',marginBottom:10 },
});
