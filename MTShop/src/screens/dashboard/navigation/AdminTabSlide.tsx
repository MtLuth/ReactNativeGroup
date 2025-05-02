import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    BackHandler,
} from 'react-native';
import { Icon } from 'react-native-elements';

import ProductManagerScreen  from '../ProductManagerScreen';
import { useNavigation } from '@react-navigation/native';
import CategoryManagerScreen from '../CategoryManagerScreen.tsx';
interface TabDef { key:string; title:string; component:React.ComponentType<any>; }

const TAB_LIST: TabDef[] = [
    { key:'products',   title:'Sản phẩm', component:ProductManagerScreen },
    { key:'category',   title:'Danh mục', component:CategoryManagerScreen },
];

export default function AdminTabSlide() {
    const [active, setActive]         = useState('products');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigation = useNavigation();
    const ActiveComponent = useMemo(
        () => TAB_LIST.find(t => t.key === active)?.component || View,
        [active],
    );

    const drawerWidth = 250;
    const anim = useRef(new Animated.Value(-drawerWidth)).current;

    const openDrawer  = () => {
        setDrawerOpen(true);
        Animated.timing(anim, { toValue:0, duration:250, useNativeDriver:true }).start();
    };

    const closeDrawer = () => {
        Animated.timing(anim, { toValue:-drawerWidth, duration:250, useNativeDriver:true })
        .start(() => setDrawerOpen(false));
    };

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (drawerOpen) { closeDrawer(); return true; }
            return false;
        });
        return () => sub.remove();
    }, [drawerOpen]);

    return (
        <View style={{ flex:1 }}>
            <View style={styles.topBar}>
                {/* nút trái: menu hoặc back-drawer */}
                <TouchableOpacity onPress={drawerOpen ? closeDrawer : openDrawer}>
                    <Icon
                        name={drawerOpen ? 'arrow-left' : 'bars'}
                        type="font-awesome"
                        size={22}
                        color="#fff"
                    />
                </TouchableOpacity>

                <Text style={styles.topTitle}>
                    {TAB_LIST.find(t => t.key === active)?.title ?? ''}
                </Text>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="home" type="font-awesome" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <ActiveComponent />

            {drawerOpen && (
                <Animated.View
                    style={[
                        styles.drawer,
                        { width: drawerWidth, transform: [{ translateX: anim }] },
                    ]}
                >
                    <TouchableOpacity onPress={closeDrawer} style={styles.closeBtn}>
                        <Icon name="close" type="font-awesome" size={22} color="#444" />
                    </TouchableOpacity>

                    <Text style={styles.drawerHeader}>Dashboard</Text>

                    {TAB_LIST.map(t => (
                        <TouchableOpacity
                            key={t.key}
                            style={[
                                styles.drawerItem,
                                active === t.key && styles.drawerItemActive,
                            ]}
                            onPress={() => {
                                setActive(t.key);
                                closeDrawer();
                            }}
                        >
                            <Text
                                style={[
                                    styles.drawerText,
                                    active === t.key && styles.drawerTextActive,
                                ]}
                            >
                                {t.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}


        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    topBar:{
        height:50,
        backgroundColor:'#05294B',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16,
        justifyContent:'space-between',
    },
    topTitle:{ color:'#fff', fontSize:18, fontWeight:'bold' },

    drawer:{
        position:'absolute',
        height:'100%',
        left:0,
        top:0,
        backgroundColor:'#fff',
        elevation:8,
        paddingTop:60,
    },
    drawerHeader:{ fontSize:18, fontWeight:'bold', marginLeft:16, marginBottom:12 },
    drawerItem:{ paddingVertical:14, paddingHorizontal:16 },
    drawerItemActive:{ backgroundColor:'#f0f8ff' },
    drawerText:{ fontSize:16, color:'#444' },
    drawerTextActive:{ color:'#05294B', fontWeight:'bold' },
    drawerHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 6,
    },


});
