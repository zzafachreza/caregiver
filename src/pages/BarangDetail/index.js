import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    TextInput
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { MyButton, MyGap, MyInput } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { showMessage } from 'react-native-flash-message';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Linking } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import DatePicker from 'react-native-datepicker'

import moment from 'moment'
import 'moment/locale/id'

export default function BarangDetail({ navigation, route }) {
    const item = route.params;
    navigation.setOptions({
        headerShown: false,
    });
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    const isFocused = useIsFocused();
    const [comp, setComp] = useState({});


    const [jumlah, setJumlah] = useState('1');
    const [user, setUser] = useState({});
    const [cart, setCart] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {

        axios.post(urlAPI + '/company.php').then(c => {
            console.log(c.data);
            setComp(c.data);
        })
        axios.post(urlAPI + '/1data_foto.php', {
            fid_barang: route.params.id
        }).then(c => {
            console.log('foto', c.data);
            setData(c.data)
        })


        if (isFocused) {
            // modalizeRef.current.open();
            getData('user').then(res => {
                console.log('data user', res);
                setUser(res);
            });
            getData('cart').then(res => {
                console.log(res);
                setCart(res);
            });
        }

        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
            console.log("Keyboard Shown")
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
            console.log("Keyboard Hide")
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };

    }, [isFocused]);


    const renderCarouselItem = ({ item }) => (
        <View style={{
            // backgroundColor: colors.primary,

        }}>
            <Image
                source={{ uri: item.image }}
                style={{
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    height: 200,
                    width: 200,
                    borderRadius: 10,
                }}
            />
            <View style={{
                backgroundColor: colors.border_list,
                width: 50,
                borderRadius: 5,
                marginHorizontal: 10,
            }}>
                <Text style={{
                    fontFamily: fonts.primary[400],
                    textAlign: 'center'
                }}>{item.no}/{item.jml}</Text>
            </View>
        </View>
    );


    const modalizeRef = useRef();

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const addToCart = () => {
        const kirim = {
            fid_user: user.id,
            fid_barang: item.id,
            harga_dasar: item.harga_dasar,
            diskon: item.diskon,
            harga: item.harga_barang,
            qty: jumlah,
            uom: uom,
            note: note,
            tanggal: tanggal,
            total: item.harga_barang * jumlah
        };
        console.log('kirim tok server', kirim);
        axios
            .post(urlAPI + '/1add_cart.php', kirim)
            .then(x => {
                if (x.data == 200) {
                    showMessage({
                        type: 'success',
                        message: item.nama_barang + ' berhasil ditambahkan ke keranjang !'
                    })


                } else {
                    showMessage({
                        type: 'danger',
                        message: item.nama_barang + ' sudah ada di dikeranjang kamu !'
                    })
                }
                navigation.navigate('Cart');
            });
    };
    const [uom, setUom] = useState(route.params.satuan);
    const [note, setNote] = useState('');
    const [tanggal, setTanggal] = useState(moment().format('YYYY-MM-DD'))
    const [pilih, setPilih] = useState({
        a: true,
        b: false,
        c: false,
        d: false,
        e: false
    })

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background1,
            }}>
            <View
                style={{
                    height: 50,
                    // padding: 10,
                    paddingRight: 10,
                    backgroundColor: colors.white,

                    flexDirection: 'row',
                }}>
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Icon type="ionicon" name="arrow-back-outline" color={colors.black} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: windowWidth / 30,
                            color: colors.black,
                        }}>
                        {item.nama_barang}
                    </Text>

                </View>
                <TouchableOpacity onPress={() => {

                    if (item.suka == 0) {
                        axios.post(urlAPI + '/1add_wish.php', {
                            fid_user: user.id,
                            fid_barang: item.id
                        }).then(x => {
                            console.warn('add wishlist', x.data);

                            if (x.data == 200) {
                                showMessage({
                                    type: 'success',
                                    message: item.nama_barang + ' berhasil ditambahkan ke favorit !'
                                })
                            } else {
                                showMessage({
                                    type: 'danger',
                                    message: item.nama_barang + ' sudah ada di favorit kamu !'
                                })
                            }
                        })
                    } else {
                        showMessage({
                            type: 'danger',
                            message: item.nama_barang + ' sudah ada di favorit kamu !'
                        })
                    }

                }} style={{
                    width: 30,
                    justifyContent: 'center',


                }}>
                    <Icon type='ionicon' color={item.suka > 0 ? colors.danger : colors.black} name='heart' />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background1,
                }}>
                {!keyboardStatus &&

                    <View>
                        <Carousel
                            loop={false}
                            // layout="stack"
                            layoutCardOffset={0}
                            data={data}
                            containerCustomStyle={styles.carousel}
                            renderItem={renderCarouselItem}
                            sliderWidth={windowWidth}
                            itemWidth={windowWidth}
                            removeClippedSubviews={false}
                        />
                    </View>

                }


                <View
                    style={{
                        backgroundColor: colors.background1,
                        flex: 1,
                        padding: 10,
                    }}>

                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: windowWidth / 20,
                            color: colors.black,
                        }}>
                        {item.nama_barang}
                    </Text>
                    <Text
                        style={{
                            marginVertical: 2,
                            fontSize: windowWidth / 20,
                            color: colors.textSecondary,
                            fontFamily: fonts.secondary[400],
                        }}>
                        Rp. {new Intl.NumberFormat().format(item.harga_barang)}
                    </Text>
                    <ScrollView style={{
                        height: 30
                    }}>
                        <Text
                            style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: windowWidth / 32,
                                color: colors.black,

                            }}>
                            {item.keterangan}
                        </Text>
                    </ScrollView>
                    {/* pilihan uom */}
                    <View style={{ flexDirection: 'row' }}>

                        <TouchableOpacity onPress={() => {
                            setPilih({
                                a: true,
                                b: false,
                                c: false,
                                d: false,
                                e: false
                            });
                            setUom(item.satuan)
                        }} style={pilih.a ? styles.ok : styles.not}>
                            <Text style={pilih.a ? styles.okText : styles.notText}>{item.satuan}</Text>
                        </TouchableOpacity>


                    </View>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            flex: 1,
                            paddingRight: 5,
                        }}>
                            <View
                                style={{

                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 5,
                                    marginBottom: 5,
                                }}>
                                <Icon type="ionicon" name="calendar" color={colors.secondary} size={14} />
                                <Text
                                    style={{
                                        fontFamily: fonts.secondary[600],
                                        color: colors.secondary,
                                        left: 10,
                                        fontSize: 12,
                                    }}>
                                    Tanggal Pesan
                                </Text>
                            </View>
                            <DatePicker
                                style={{ width: '100%' }}
                                mode="date"
                                date={tanggal}
                                placeholder="select date"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                format='YYYY-MM-DD'
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                        backgroundColor: colors.zavalabs,
                                        borderColor: colors.primary,
                                        borderRadius: 10,
                                        // borderWidth: 1,
                                        height: 48,
                                        paddingLeft: 10,
                                        color: colors.black,
                                        fontSize: windowWidth / 25,
                                        fontFamily: fonts.primary[400],
                                    }
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={x => setTanggal(x)}
                            />
                        </View>


                        <View style={{
                            flex: 1,
                            paddingLeft: 5,
                        }}>
                            <MyInput colorIcon={colors.secondary} onChangeText={x => setNote(x)} iconname="create" placeholder="masukan keterangan jika perlu" multiline label="Catatan" />
                        </View>
                    </View>
                </View>


                {/* 
                <View style={{ flexDirection: 'row', padding: 10 }}>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontFamily: fonts.secondary[600],
                                color: colors.textPrimary,
                            }}>
                            Jumlah
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',

                            justifyContent: 'space-around',
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                jumlah == 1
                                    ? showMessage({
                                        type: 'danger',
                                        message: 'Minimal jumlah 1',
                                    })
                                    : setJumlah((parseFloat(jumlah.toString()) - 1).toString());
                            }}
                            style={{
                                backgroundColor: colors.secondary,
                                width: '25%',
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 0,
                            }}>
                            <Icon type="ionicon" name="remove" color={colors.white} />
                        </TouchableOpacity>
                        <TextInput value={jumlah} onChangeText={x => setJumlah(x)} keyboardType="number-pad" style={{
                            fontSize: 16, fontFamily: fonts.secondary[600], color: colors.black,
                            textAlign: 'center',
                            width: 80,

                        }} />


                        <TouchableOpacity
                            onPress={() => {
                                if (jumlah >= parseFloat(item.stok)) {
                                    showMessage({
                                        type: 'danger',
                                        message: 'Pembelian melebihi batas ya !',
                                    })
                                } else {
                                    console.log(jumlah);
                                    setJumlah((parseFloat(jumlah.toString()) + 1).toString());
                                }

                            }}
                            style={{
                                backgroundColor: colors.secondary,
                                width: '25%',
                                borderRadius: 10,
                                marginLeft: 0,

                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Icon type="ionicon" name="add" color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View> */}

                <View style={{ margin: 10, flexDirection: 'row' }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL('https://wa.me/' + comp.tlp)
                            }}
                            style={{

                                width: 50,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center'


                            }}>
                            <Icon type='ionicon' name="logo-whatsapp" color={colors.success} />

                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1,
                    }}>
                        <MyButton onPress={addToCart} warna={colors.primary} title={`Rp ${new Intl.NumberFormat().format(item.harga_barang * jumlah)}`} Icons="cart" />
                    </View>
                </View>
            </View>




        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    not: {
        width: 60,
        borderRadius: 20,
        borderWidth: 2,
        marginHorizontal: 2,
        borderColor: colors.primary,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    ok: {
        width: 60,
        marginHorizontal: 2,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    notText: {
        fontSize: windowWidth / 35,
        color: colors.primary,
        fontFamily: fonts.secondary[600],
    },
    okText: {
        fontSize: windowWidth / 35,
        color: colors.white,
        fontFamily: fonts.secondary[600],
    }
});
