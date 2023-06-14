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
export default function Register({ navigation }) {
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
      // console.log('Email is Not Correct');
      setData({ ...data, email: text });
      setValid(false);
      return false;
    } else {
      setData({ ...data, email: text });
      setValid(true);
      // console.log('Email is Correct');
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
                foto_ktp: `data:${response.type};base64, ${response.base64}`,
              });
              break;
            case 2:
              setData({
                ...data,
                foto_ktp: `data:${response.type};base64, ${response.base64}`,
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
    nama_lengkap: '',
    email: '',
    username: '',
    foto_ktp: 'https://zavalabs.com/nogambar.jpg',
    password: '',
    telepon: '',
    alamat: ''
  });

  const simpan = () => {
    if (
      data.nama_lengkap.length === 0 &&
      data.password.length === 0 &&
      data.telepon.length === 0
    ) {
      showMessage({
        message: 'Maaf Semua Field Harus Di isi !',
      });
    } else if (data.nama_lengkap.length === 0) {
      showMessage({
        message: 'Maaf Nama Lengkap masih kosong !',
      });
    } else if (data.telepon.length === 0) {
      showMessage({
        message: 'Maaf Telepon masih kosong !',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Maaf Password masih kosong !',
      });
    } else {
      setLoading(true);
      console.log(data);
      axios
        .post(urlAPI + '/register.php', data)
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
              navigation.replace('Success', {
                messege: res.data,
              });
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
          <MyGap jarak={10} />
          <MyInput
            label="Nama Lengkap"
            placeholder="Masukan nama lengkap"
            iconname="person"
            value={data.nama_lengkap}
            onChangeText={value =>
              setData({
                ...data,
                nama_lengkap: value,
              })
            }
          />



          <MyGap jarak={10} />
          <MyInput
            label="Username"
            iconname="at"
            placeholder="Masukan username"
            value={data.username}
            onChangeText={value =>
              setData({
                ...data,
                username: value,
              })
            }
          />

          <MyGap jarak={10} />
          <MyInput
            label="Email"
            iconname="mail"
            placeholder="Masukan email"

            value={data.email}
            onChangeText={value =>
              setData({
                ...data,
                email: value,
              })
            }
          />


          <MyGap jarak={10} />
          <MyInput
            label="Telepon"
            iconname="call"
            placeholder="Masukan nomor telepon"
            keyboardType="phone-pad"
            value={data.telepon}
            onChangeText={value =>
              setData({
                ...data,
                telepon: value,
              })
            }
          />

          <MyGap jarak={10} />
          <MyInput
            label="Alamat"
            iconname="map"
            placeholder="Masukan alamat lengkap"
            value={data.alamat}
            onChangeText={value =>
              setData({
                ...data,
                alamat: value,
              })
            }
          />






          <MyGap jarak={10} />
          <MyInput
            label="Password"
            iconname="key"
            placeholder="Masukan password"
            secureTextEntry={show}
            value={data.password}
            onChangeText={value =>
              setData({
                ...data,
                password: value,
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
            {data.foto_ktp !== 'https://zavalabs.com/nogambar.jpg' && <Image source={{
              uri: data.foto_ktp
            }} style={{
              width: '100%',
              height: 200,
              borderRadius: 5,
            }} />}
            {data.foto_ktp == 'https://zavalabs.com/nogambar.jpg' &&
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
                }}>Upload Foto KTP</Text>
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
