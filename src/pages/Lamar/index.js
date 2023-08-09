import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    Button,
    View,
    Image,
    ScrollView,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    Switch,
    SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import LottieView from 'lottie-react-native';
import { urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
export default function Lamar({ navigation }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [open, setOpen] = useState(false);
    const [kota, setKota] = useState([]);
    const [show, setShow] = useState(true);
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const validate = text => {
        // console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            // console.log('harga_barang is Not Correct');
            setData({ ...data, harga_barang: text });
            setValid(false);
            return false;
        } else {
            setData({ ...data, harga_barang: text });
            setValid(true);
            // console.log('harga_barang is Correct');
        }
    };

    const options = {
        includeBase64: true,
        quality: 1,
    };

    const getGallery = xyz => {
        launchImageLibrary(options, response => {
            // console.log('All Response = ', response);

            // console.log('Ukuran = ', response.fileSize);
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('Image Picker Error: ', response.error);
            } else {
                if (response.fileSize <= 2000000) {
                    let source = { uri: response.uri };
                    switch (xyz) {
                        case 1:
                            setData({
                                ...data,
                                foto_wajah: `data:${response.type};base64, ${response.base64}`,
                            });
                            break;
                        case 2:
                            setData({
                                ...data,
                                foto_wajah: `data:${response.type};base64, ${response.base64}`,
                            });
                            break;
                    }
                } else {
                    showMessage({
                        message: 'Ukuran Foto Terlalu Besar Max 500 KB',
                        type: 'danger',
                    });
                }
            }
        });
    };

    const [data, setData] = useState({
        fid_subkategori: 8,
        nama_barang: '',
        harga_barang: '',
        keterangan: '',
        foto_wajah: 'https://zavalabs.com/nogambar.jpg',
    });

    const simpan = () => {
        if (
            data.nama_barang.length === 0 &&
            data.harga_barang.length === 0 &&
            data.keterangan.length === 0
        ) {
            showMessage({
                message: 'Maaf Semua Field Harus Di isi !',
            });
        } else if (data.nama_barang.length === 0) {
            showMessage({
                message: 'Maaf Nama Pekerja masih kosong !',
            });
        } else if (data.harga_barang.length === 0) {
            showMessage({
                message: 'Maaf Harga / gaji masih kosong !',
            })
        } else if (data.keterangan.length === 0) {
            showMessage({
                message: 'Maaf Keterangan masih kosong !',
            });
        } else {
            setLoading(true);
            console.log(data);
            axios
                .post(urlAPI + '/register_lamar.php', data)
                .then(res => {
                    console.warn(res.data);
                    let err = res.data.split('#');

                    // console.log(err[0]);
                    if (err[0] == 50) {
                        setTimeout(() => {
                            setLoading(false);
                            showMessage({
                                message: err[1],
                                type: 'danger',
                            });
                        }, 1200);
                    } else {
                        setTimeout(() => {
                            showMessage({
                                message: res.data,
                                type: 'success'
                            });
                            navigation.goBack();
                        }, 1200);
                    }
                });
        }
    };




    return (
        <SafeAreaView style={{
            flex: 1,

        }}>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>
                <View style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={{
                            width: '90%',
                            height: 100,
                            resizeMode: 'contain'
                        }}
                    />
                </View>



                <View style={{
                    paddingHorizontal: 20,
                }}>

                    <MyPicker label="Kategori Pekerja" iconname="list" value={data.fid_subkategori} onValueChange={x => {
                        setData({
                            ...data,
                            fid_subkategori: x
                        })
                    }} data={[
                        { label: 'Caregiver', value: 8 },
                        { label: 'Babysitter', value: 8 },
                    ]} />
                    <MyGap jarak={10} />
                    <MyInput
                        label="Nama Pekerja"
                        placeholder="Masukan nama pekerja"
                        iconname="person"
                        value={data.nama_barang}
                        onChangeText={value =>
                            setData({
                                ...data,
                                nama_barang: value,
                            })
                        }
                    />



                    <MyGap jarak={10} />
                    <MyInput
                        label="keterangan"
                        iconname="create"
                        placeholder="Masukan keterangan"
                        value={data.keterangan}
                        onChangeText={value =>
                            setData({
                                ...data,
                                keterangan: value,
                            })
                        }
                    />

                    <MyGap jarak={10} />
                    <MyInput
                        label="Harga / Gaji"
                        iconname="options"
                        placeholder="Masukan harga / gaji"

                        value={data.harga_barang}
                        onChangeText={value =>
                            setData({
                                ...data,
                                harga_barang: value,
                            })
                        }
                    />





                    <TouchableOpacity onPress={() => getGallery(1)} style={{
                        width: '100%',
                        marginTop: 10,
                        height: 220,
                        padding: 10,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: colors.primary
                    }}>
                        {data.foto_wajah !== 'https://zavalabs.com/nogambar.jpg' && <Image source={{
                            uri: data.foto_wajah
                        }} style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 5,
                        }} />}
                        {data.foto_wajah == 'https://zavalabs.com/nogambar.jpg' &&
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Image source={require('../../assets/camera.png')} style={{
                                    width: 40,
                                    height: 40,
                                }} />
                                <Text style={{
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                    marginTop: 10,
                                }}>Upload Foto</Text>
                            </View>

                        }
                    </TouchableOpacity>


                    <MyGap jarak={20} />

                    <MyButton
                        warna={colors.primary}
                        title="REGISTER"
                        Icons="log-in"
                        onPress={simpan}
                    />

                    <MyGap jarak={20} />
                </View>
            </ScrollView>
            {loading && (
                <LottieView
                    source={require('../../assets/animation.json')}
                    autoPlay
                    loop
                    style={{
                        flex: 1,
                        backgroundColor: colors.primary,
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.white,
    },

});
