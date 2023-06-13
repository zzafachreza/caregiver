import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList, Pressable,
  TouchableWithoutFeedback,
  Image,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';

import LottieView from 'lottie-react-native';
import { getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyGap, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';
import { color } from 'react-native-reanimated';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


const UploadFoto = ({ onPress1, onPress2, label, foto }) => {
  return (
    <View
      style={{
        marginHorizontal: 10,
        color: colors.textPrimary,
        marginVertical: 10,
        borderColor: colors.border,
      }}>
      <Text
        style={{
          fontFamily: fonts.secondary[400],
          color: colors.textPrimary,
        }}>
        {label}
      </Text>

      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={{
          flex: 2,
        }}>
          <Image
            source={{
              uri: foto,
            }}
            style={{
              width: '100%',
              aspectRatio: 2,
            }}
            resizeMode="center"
          />
        </View>
        <View
          style={{
            flex: 1,
            paddingRight: 5,
          }}>
          <MyButton
            onPress={onPress1}
            title="KAMERA"
            Icons="camera"
            warna={colors.primary}
          />
        </View>
        <View
          style={{
            flex: 1,
            paddingLeft: 5,
          }}>
          <MyButton
            colorText={colors.white}
            onPress={onPress2}
            Icons="images"
            iconColor={colors.white}
            title="GALLERY"
            warna={colors.secondary}
          />
        </View>
      </View>
    </View>
  );
};


export default function Checkout({ navigation, route }) {
  const item = route.params;
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [company, setCompany] = useState({});
  const [paket, setPaket] = useState([]);

  const [kirim, setKirim] = useState(route.params);
  const [user, setUser] = useState({});
  const [kurir, setKurir] = useState([
    {
      nama_kirim: 'Antar',
    },
    {
      nama_kirim: 'Ambil Sendiri',
    }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState([]);
  const [comp, setComp] = useState({});
  const [pilih, setPilih] = useState({
    a: true,
    b: false
  })

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // console.log('pembayaran', data);
  const [foto1, setfoto1] = useState(
    'https://zavalabs.com/nogambar.jpg',
  );

  const options = {
    includeBase64: true,
    quality: 0.3,
  };

  const getCamera = xyz => {
    launchCamera(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('Image Picker Error: ', response.error);
      } else {
        let source = { uri: response.uri };
        switch (xyz) {
          case 1:
            setKirim({
              ...kirim,
              foto: `data:${response.type};base64, ${response.base64}`,
            });
            setfoto1(`data:${response.type};base64, ${response.base64}`);
            break;
        }
      }
    });

  };

  const getGallery = xyz => {
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('Image Picker Error: ', response.error);
      } else {
        let source = { uri: response.uri };
        switch (xyz) {
          case 1:
            setKirim({
              ...kirim,
              foto: `data:${response.type};base64, ${response.base64}`,
            });
            setfoto1(`data:${response.type};base64, ${response.base64}`);
            break;
        }
      }
    });
  };



  useEffect(() => {
    requestCameraPermission();
    axios.post(urlAPI + '/company.php').then(c => {
      console.log(c.data);
      setComp(c.data);
    })

    axios.post(urlAPI + '/1data_bank.php').then(c => {
      console.log('bacnk', c.data);
      // setComp(c.data);
      setBank(c.data);
      setKirim({
        ...kirim,
        bank: c.data[0].nama_bank,
      })
    })


    getData('user').then(res => {
      console.error(res)
      setUser(res);
      setKirim({
        ...kirim,
        catatan: '',
        metode: 'Transfer',
      })
    });



  }, []);



  const simpan = () => {


    if (kirim.bank == null) {
      showMessage({
        message: 'Silahkan pilih bank !',
        type: 'danger'
      })
    } else {
      setLoading(true)
      console.log('kirim', kirim);
      axios.post(urlAPI + '/1add_transaksi.php', kirim).then(rr => {
        console.log(rr.data)
        console.log('https://api.whatsapp.com/send?phone=' + comp.tlp + rr.data);
        setTimeout(() => {
          setLoading(false);
          showMessage({
            type: 'success',
            message: 'Transaksi kamu berhasil dikirim'
          });

          // Linking.openURL('https://api.whatsapp.com/send?phone=' + comp.tlp + rr.data)

          navigation.replace('ListData');
        }, 1500)
      })

    }


  };


  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background1 }}>
        <ScrollView>

          {/* data penerima */}

          <View style={{
            backgroundColor: colors.zavalabs,
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border_list,
          }}>
            <Text style={{
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30
            }}>Pesananmu siap diteruskan ke toko, silahkan tulis catatan apabila ada yang ingin di tanyakan</Text>
            {/* <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.textPrimary,

            }}>{user.nama_lengkap}</Text>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.textPrimary
            }}>{user.telepon}</Text>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.textPrimary
            }}>{user.alamat}</Text> */}
          </View>









          <View style={{
            padding: 10,
          }}>
            <MyInput onChangeText={x => setKirim({
              ...kirim,
              catatan: x
            })} placeholder="Masukan catatan untuk pesanan" iconname="create-outline" label="Catatan untuk Pesanan" />
          </View>


          <View
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5,
              marginVertical: 10
            }}>
            <Icon type="ionicon" name="wallet-outline" color={colors.primary} size={16} />
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                color: colors.black,
                left: 10,
                fontSize: 12,
              }}>
              Pilih Pembayaran
            </Text>
          </View>


          <MyGap jarak={20} />

          {bank.map(i => {
            return (
              <TouchableOpacity onPress={() => {
                setKirim({
                  ...kirim,
                  bank: i.nama_bank
                })
              }} style={{
                backgroundColor: i.nama_bank == kirim.bank ? colors.border_list : colors.white,
                padding: 10,
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: colors.border_list
              }}>
                <View style={{
                  flex: 1,
                }}>
                  <Text style={{
                    fontFamily: fonts.primary[600],
                    color: colors.black,
                    fontSize: 12,
                  }}>{i.nama_bank}</Text>
                  <Text style={{
                    fontFamily: fonts.primary[400],
                    color: colors.black,
                    fontSize: 12,
                  }}>{i.rekening_bank}</Text>
                  <Text style={{
                    fontFamily: fonts.primary[400],
                    color: colors.black,
                    fontSize: 12,
                  }}>A.N {i.atas_nama}</Text>
                </View>
                <Image source={{
                  uri: i.image
                }} style={{
                  width: 80,
                  height: 50,
                  resizeMode: 'contain'
                }} />
              </TouchableOpacity>
            )
          })

          }




        </ScrollView>

        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
          <Text style={{
            flex: 1,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30
          }}>Total Transaksi</Text>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 25
          }}>
            Rp. {new Intl.NumberFormat().format(route.params.harga_total)}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
          <Text style={{
            flex: 1,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30
          }}>Pengiriman dan biaya penanganan</Text>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 25
          }}>
            Rp. {new Intl.NumberFormat().format(8500)}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
          <Text style={{
            flex: 1,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30
          }}>Total Pembayaran</Text>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 20
          }}>
            Rp. {new Intl.NumberFormat().format(parseFloat(route.params.harga_total) + 8500)}
          </Text>
        </View>

        <UploadFoto
          onPress1={() => getCamera(1)}
          onPress2={() => getGallery(1)}
          label="Upload Bukti Pembayaran"
          foto={foto1}
        />



        <View style={{ padding: 10, backgroundColor: colors.white, }}>
          <MyButton
            onPress={simpan}
            title="TERUSKAN ORDER KE TOKO"
            warna={colors.primary}
            Icons="cloud-upload"
            style={{
              justifyContent: 'flex-end',
            }}
          />
        </View>




      </SafeAreaView>
      {
        loading && (
          <LottieView
            source={require('../../assets/animation.json')}
            autoPlay
            loop
            style={{ backgroundColor: colors.primary }}
          />
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    flex: 1,
    marginBottom: 15,
    textAlign: "center"
  }
});
