import React, { useEffect, useState, useCallback } from 'react';
import {
    View, FlatList, Text, TouchableOpacity, StyleSheet, Modal,
    TextInput, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import debounce from 'lodash.debounce';

import { appColors } from '../../themes/appColors';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface Category { _id:string; name:string; description?:string }
const LIMIT = 10;

export default function CategoryManagerScreen() {
    /* ---------- state ---------- */
    const [list, setList]   = useState<Category[]>([]);
    const [page, setPage]   = useState(1);
    const [total, setTotal] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    /* modal */
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Category|null>(null);
    const [form, setForm] = useState({ name:'', description:'' });

    /* ---------- API ---------- */
    const fetchData = async (p=1) => {
        if (loading) return;
        setLoading(true);
        try {
            const r = await axios.get('/category', { params:{ page:p, limit:LIMIT, search } });
            const { categories, totalPages } = r.data.data;
            p === 1 ? setList(categories) : setList(prev => [...prev, ...categories]);
            setTotal(totalPages); setPage(p);
        } catch { showErrorToast('Không thể tải danh mục'); }
        finally { setLoading(false); setRefreshing(false); }
    };

    /* ---------- search ---------- */
    const onSearch = useCallback(debounce((q)=>{ setSearch(q); fetchData(1); },300),[]);

    /* ---------- save / delete ---------- */
    const save = async () => {
        try {
            const payload = { name:form.name, description:form.description };
            if (editing) {
                await axios.put(`/category/${editing._id}`, payload);
                showSuccessToast('Đã cập nhật');
            } else {
                await axios.post('/category', payload);
                showSuccessToast('Đã thêm');
            }
            setModal(false); fetchData(1);
        } catch { showErrorToast('Lỗi khi lưu'); }
    };

    const remove = async (id:string) => {
        try { await axios.delete(`/category/${id}`); showSuccessToast('Đã xoá'); fetchData(1); }
        catch { showErrorToast('Không xoá được'); }
    };

    /* ---------- list ---------- */
    const Row = ({ item }:{ item:Category }) => (
        <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity onPress={()=>openEdit(item)}>
                <Icon name="edit" type="font-awesome" size={16}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>remove(item._id)} style={{marginLeft:14}}>
                <Icon name="trash" type="font-awesome" size={16} color="red"/>
            </TouchableOpacity>
        </View>
    );

    /* ---------- pagination ---------- */
    const goPage = (p:number) => { if (p<1||p>total) return; fetchData(p); };
    const Pager = () => {
        if (total <= 1) return null;
        const around = 2, start = Math.max(1,page-around), end = Math.min(total,page+around);
        const nums = []; for (let i=start;i<=end;i++) nums.push(i);
        return (
            <View style={styles.pageRow}>
                <TouchableOpacity disabled={page===1} onPress={()=>goPage(page-1)}>
                    <Text style={[styles.pageText,page===1&&styles.pageDisabled]}>{'‹ Prev'}</Text>
                </TouchableOpacity>
                {nums.map(n=>(
                    <TouchableOpacity key={n} onPress={()=>goPage(n)} style={[styles.pageNum,n===page&&styles.pageActive]}>
                        <Text style={n===page?styles.pageActiveText:styles.pageText}>{n}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity disabled={page===total} onPress={()=>goPage(page+1)}>
                    <Text style={[styles.pageText,page===total&&styles.pageDisabled]}>{'Next ›'}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    /* ---------- helpers ---------- */
    const openAdd = () => { setEditing(null); setForm({name:'',description:''}); setModal(true); };
    const openEdit= (c:Category) => { setEditing(c); setForm({name:c.name,description:c.description||''}); setModal(true); };

    /* ---------- init ---------- */
    useEffect(()=>{ fetchData(1); }, []);

    /* ---------- render ---------- */
    return (
        <View style={styles.container}>
            {/* search + add */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Icon name="search" type="font-awesome" size={14} color="#777"/>
                    <TextInput placeholder="Tìm danh mục..." style={styles.searchInput}
                               onChangeText={txt=>onSearch(txt)} clearButtonMode="while-editing"/>
                </View>
                <TouchableOpacity style={styles.add} onPress={openAdd}>
                    <Icon name="plus" type="font-awesome" color="#fff" size={14}/>
                    <Text style={{color:'#fff',marginLeft:6}}>Thêm</Text>
                </TouchableOpacity>
            </View>

            {loading && page===1 ? (
                <ActivityIndicator size="large" color={appColors.primary}/>
            ) : (
                <>
                    <FlatList
                        data={list} keyExtractor={i=>i._id} renderItem={Row}
                        ItemSeparatorComponent={()=> <View style={styles.sep}/>}
                        onRefresh={()=>{setRefreshing(true);fetchData(1);}}
                        refreshing={refreshing}
                    />
                    <Pager/>
                </>
            )}

            {/* modal */}
            <Modal visible={modal} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.box}>
                        <Text style={styles.modalTitle}>{editing?'Sửa':'Thêm'} danh mục</Text>

                        <TextInput style={styles.input} placeholder="Tên" value={form.name}
                                   onChangeText={name=>setForm({...form,name})}/>
                        <TextInput style={styles.input} placeholder="Mô tả" value={form.description}
                                   onChangeText={description=>setForm({...form,description})}/>

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

/* ---------- styles (ảnh & picker đã bỏ) ---------- */
const styles = StyleSheet.create({
    container:{flex:1,backgroundColor:'#fff',padding:16},
    searchRow:{flexDirection:'row',alignItems:'center',marginBottom:10},
    searchBox:{flexDirection:'row',alignItems:'center',flex:1,
        borderWidth:1,borderColor:'#ddd',borderRadius:30,paddingHorizontal:10},
    searchInput:{flex:1,marginLeft:6,paddingVertical:4},
    add:{flexDirection:'row',alignItems:'center',backgroundColor:appColors.primary,
        paddingHorizontal:12,paddingVertical:8,borderRadius:8,marginLeft:10},

    row:{flexDirection:'row',alignItems:'center',paddingVertical:8},
    name:{flex:1},
    sep:{height:1,backgroundColor:'#eee'},

    overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center'},
    box:{backgroundColor:'#fff',margin:20,padding:20,borderRadius:10},
    modalTitle:{fontSize:18,fontWeight:'bold',marginBottom:10},
    input:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:8,marginBottom:10},
    btnRow:{flexDirection:'row',justifyContent:'flex-end',marginTop:20},
    cancel:{padding:8,marginRight:12},
    save:{backgroundColor:appColors.primary,paddingHorizontal:16,paddingVertical:8,borderRadius:6},

    pageRow:{flexDirection:'row',justifyContent:'center',alignItems:'center',marginVertical:10},
    pageText:{color:'#444',paddingHorizontal:8},
    pageDisabled:{color:'#bbb'},
    pageNum:{paddingHorizontal:8,paddingVertical:4,marginHorizontal:2,borderRadius:4},
    pageActive:{backgroundColor:appColors.primary},
    pageActiveText:{color:'#fff'},
});
