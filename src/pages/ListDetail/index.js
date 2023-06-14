import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { urlAPI } from '../../utils/localStorage';
import { MyButton, MyGap } from '../../components';

export default function ListDetail({ navigation, route }) {
  const [item, setItem] = useState(route.params);
  navigation.setOptions({ title: 'Detail Pesanan' });
  const [data, setData] = useState(route.params);
  const [buka, setBuka] = useState(true);
  const [dataDetail, setDataDetail] = useState([]);

  useEffect(() => {
    DataDetail();

  }, []);
  let nama_icon = '';

  if (data.status == "DONE") {
    nama_icon = 'checkmark-circle-outline';
  } else {
    nama_icon = 'close-circle-outline';
  }


  const DataDetail = () => {
    axios
      .post(urlAPI + '/transaksi_detail.php', {
        kode: item.kode,
      })
      .then(res => {
        console.warn('detail transaksi', res.data);
        setDataDetail(res.data);
        setBuka(true);
      });
  }

  const MyDetail = ({ label, value }) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,

      }}>
        <Text
          style={{
            flex: 0.5,
            fontFamily: fonts.secondary[400],
            padding: 3,
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>
          {label}
        </Text>
        <Text style={{
          padding: 3,
          marginRight: 10,
        }}>:</Text>
        <Text
          style={{
            padding: 3,
            flex: 1,
            fontFamily: fonts.secondary[600],

            fontSize: windowWidth / 25,
            color: colors.black,

          }}>
          {value}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.zavalabs
      }}>

      {!buka && <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>}
      {buka &&
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 10, flex: 1 }}>

          {item.status !== 'PENDING' && (
            <View style={{
              backgroundColor: colors.white,
              marginVertical: 5,
            }}>

              <View style={{
                flexDirection: 'row'
              }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.secondary[600],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}>
                  {item.status}
                </Text>


              </View>

              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  padding: 10,
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>
                {item.kode}
              </Text>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.secondary[400],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                  Tanggal
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                  {item.tanggal}, {item.jam} WIB
                </Text>
              </View>


            </View>

          )}
          <View style={{
            backgroundColor: colors.white,
            marginVertical: 5,
          }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                padding: 10,
                fontSize: windowWidth / 30,
                color: colors.black,
              }}>
              Detail
            </Text>

            {dataDetail.map(i => {
              return (
                <View style={{
                  flexDirection: 'row',
                  padding: 10,
                }}>

                  <View style={{
                    paddingRight: 10,
                  }}>
                    <Image source={{
                      uri: i.image
                    }} style={{
                      width: 50, height: 50
                    }} />
                  </View>

                  <View style={{
                    flex: 1,
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 35,
                      color: colors.black,
                    }}>{i.nama_barang}</Text>
                    <Text style={{
                      fontFamily: fonts.secondary[800],
                      fontSize: windowWidth / 25,
                      color: colors.primary,
                    }}>{i.nama_subkategori}</Text>


                  </View>

                  <View style={{
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 25,
                      color: colors.black,
                      paddingHorizontal: 10,
                      borderRadius: 5,

                    }}>Rp. {new Intl.NumberFormat().format(i.total)}</Text>
                  </View>
                </View>
              )
            })}
          </View>


          <View style={{
            backgroundColor: colors.white,
            marginVertical: 5,
          }}>

            <Text
              style={{
                flex: 1,
                fontFamily: fonts.secondary[600],
                padding: 10,
                fontSize: windowWidth / 30,
                color: colors.black,

              }}>
              Data Dibawah ini menunjukan orang yang akan dirawat
            </Text>

            <MyDetail label="Nama" value={item.nama_pesanan} />
            <MyDetail label="Jenis Kelamin" value={item.jk_pesanan} />
            <MyDetail label="Umur" value={item.umur_pesanan} />
            <MyDetail label="Catatan yang akan dirawat" value={item.catatan_pesanan} />
            <MyDetail label="Alamat" value={item.alamat_pesanan} />
            <MyDetail label="Catatan Kerja" value={item.catatan_kerja} />


          </View>


          <MyGap jarak={10} />

          {item.status == 'SUDAH DIKIRIM' && (<MyButton onPress={() => {
            axios.post(urlAPI + '/1transaksi_selesai.php', {
              kode: item.kode
            }).then(res => {
              console.log(res);
              setItem({
                ...item,
                status: 'SELESAI'
              })

            })
          }} title='Pesanan Selesai' warna={colors.primary} colorText={colors.white} Icons="checkmark-circle" iconColor={colors.white} />)}


          {item.status == 'PENDING' && (<MyButton onPress={() => {



            axios.post(urlAPI + '/1add_cart_new.php', {
              kode: route.params.kode,
              fid_user: route.params.fid_user
            }).then(res => {
              console.log(res.data);
              navigation.navigate('Cart');
            })

          }} title='Masukan ke keranjang' warna={colors.primary} colorText={colors.white} Icons="checkmark-circle" iconColor={colors.white} />)}


          <MyGap jarak={20} />
        </ScrollView>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.primary,

    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    height: 80,
    margin: 5,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    textAlign: 'center',
  },
  date: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    textAlign: 'center',
  },
});
