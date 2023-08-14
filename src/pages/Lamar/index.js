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

import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
} from 'react-native-document-picker'
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
    const [path, setPath] = useState('');
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
                                foto_lamaran: `data:${response.type};base64, ${response.base64}`,
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
        email_pekerja: '',
        telepon_pekerja: '',
        keterangan: '',
        foto_wajah: 'https://zavalabs.com/nogambar.jpg',
        foto_lamaran: 'https://zavalabs.com/nogambar.jpg',
    });

    const simpan = async () => {
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


            const formData = new FormData();

            formData.append('fid_subkategori', data.fid_subkategori);
            formData.append('nama_barang', data.nama_barang);
            formData.append('harga_barang', data.harga_barang);
            formData.append('keterangan', data.keterangan);
            formData.append('email_pekerja', data.email_pekerja);
            formData.append('telepon_pekerja', data.telepon_pekerja);
            formData.append('keterangan', data.keterangan);
            formData.append('foto_wajah', data.foto_wajah);
            formData.append('nama_pdf', path.name);
            formData.append('file_attachment', path);

            // console.log(formData);

            // let zavalabs = await fetch(
            //     urlAPI + '/register_lamar.php',
            //     {
            //         method: 'post',
            //         body: formData,
            //         headers: {
            //             'Content-Type': 'multipart/form-data; ',
            //         },
            //     }
            // );

            axios.post(urlAPI + '/register_lamar.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {
                showMessage({
                    type: 'success',
                    message: 'Data Kamu Berhasil Di Kirim'
                })

                navigation.goBack();
            })

            // let responseJson = await zavalabs.json();





            // console.log(data);
            // axios
            //     .post(urlAPI + '/register_lamar.php', data)
            //     .then(res => {
            //         console.warn(res.data);
            //         let err = res.data.split('#');

            //         // console.log(err[0]);
            //         if (err[0] == 50) {
            //             setTimeout(() => {
            //                 setLoading(false);
            //                 showMessage({
            //                     message: err[1],
            //                     type: 'danger',
            //                 });
            //             }, 1200);
            //         } else {
            //             setTimeout(() => {
            //                 showMessage({
            //                     message: res.data,
            //                     type: 'success'
            //                 });
            //                 navigation.goBack();
            //             }, 1200);
            //         }
            //     });
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
                        keyboardType='number-pad'

                        value={data.harga_barang}
                        onChangeText={value =>
                            setData({
                                ...data,
                                harga_barang: value,
                            })
                        }
                    />

                    <MyGap jarak={10} />
                    <MyInput
                        label="Email"
                        iconname="mail"
                        placeholder="Masukan alamat email"

                        value={data.email_pekerja}
                        onChangeText={value =>
                            setData({
                                ...data,
                                email_pekerja: value,
                            })
                        }
                    />

                    <MyGap jarak={10} />
                    <MyInput
                        label="Telepon"
                        iconname="call"
                        placeholder="Masukan telepon"
                        keyboardType='phone-pad'

                        value={data.telepon_pekerja}
                        onChangeText={value =>
                            setData({
                                ...data,
                                telepon_pekerja: value,
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


                    <TouchableOpacity onPress={async () => {

                        try {
                            const res = await DocumentPicker.pick({
                                // Provide which type of file you want user to pick
                                type: [DocumentPicker.types.pdf],
                                // There can me more options as well
                                // DocumentPicker.types.allFiles
                                // DocumentPicker.types.images
                                // DocumentPicker.types.plainText
                                // DocumentPicker.types.audio
                                // DocumentPicker.types.pdf
                            });
                            // Printing the log realted to the file
                            console.log('res : ' + JSON.stringify(res));
                            // Setting the state to show single file attributes
                            console.log('sizw', res[0].size)
                            if (res[0].size > 5000000) {
                                alert('Maaf dokumen pdf maksimal 5 Mb')
                            } else {
                                setPath(res[0]);
                            }


                        } catch (err) {
                            setSingleFile(null);
                            // Handling any exception (If any)
                            if (DocumentPicker.isCancel(err)) {
                                // If user canceled the document selection
                                alert('Canceled');
                            } else {
                                // For Unknown Error
                                alert('Unknown Error: ' + JSON.stringify(err));
                                throw err;
                            }
                        }
                    }} style={{
                        width: '100%',
                        marginTop: 10,
                        height: 100,
                        padding: 10,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: colors.primary
                    }}>

                        <Text style={{ fontFamily: fonts.secondary[600], fontSize: 12, textAlign: 'center' }}>{path.name}.pdf</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: 12,
                            marginTop: 10,
                        }}>Upload Pdf Lamaran (Max 5 MB)</Text>


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
