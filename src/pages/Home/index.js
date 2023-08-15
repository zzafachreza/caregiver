import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData, urlAPI, MYAPP } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';
import MyHeader from '../../components/MyHeader';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [artikel, setArtikel] = useState([]);
  const [kategori, setKategori] = useState([]);

  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');
  const [comp, setComp] = useState({});

  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      // console.log(obj);

      // alert(obj.notification.title)



      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'caregiver', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });


    getDataBarang();

    axios.post(urlAPI + '/company.php').then(c => {

      setComp(c.data);
    })

    axios.post(urlAPI + '/1data_artikel.php').then(aa => {
      console.log('artikel', aa.data);
      setArtikel(aa.data);

    })

    if (isFocused) {
      __getDataUserInfo();
    }
    return unsubscribe;
  }, [isFocused]);


  const __renderItemArtikel = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Artikel', item)}>
        <View style={{
          margin: 5,
          width: 220,
          justifyContent: 'center',
          padding: 10,
          backgroundColor: colors.white,
        }}>
          <Image source={{
            uri: item.foto
          }} style={{
            width: 200,
            borderRadius: 10,
            height: 130
          }} />
          <Text style={{
            marginTop: 5,
            height: 60,
            fontFamily: fonts.secondary[600],
            fontSize: 14
          }}>{item.judul}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }




  const getDataBarang = () => {
    axios.post(urlAPI + '/1data_subkategori.php').then(res => {

      setProduk(res.data);
    })
  }



  const __getDataUserInfo = () => {
    getData('user').then(users => {
      console.log(users);
      setUser(users);

      getData('token').then(res => {
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;

  const _renderItemProduk = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {
        // if (item.sewa > 0) {
        //   Alert.alert(MYAPP, 'Unit sudah ada yang pesan');
        // } else {
        //   navigation.navigate('BarangDetail', item)
        // }
        navigation.navigate('Barang', item)

      }} style={{
        marginHorizontal: 5,
        borderRadius: 5,

        borderColor: colors.secondary,
        // overflow: 'hidden',
        flex: 0.5,
        marginVertical: 5,

      }}>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <Image style={{
            opacity: item.sewa > 0 ? 0.3 : 1,
            width: '70%',
            height: 100,
            resizeMode: 'contain',
            borderRadius: 10,

          }} source={{
            uri: item.image
          }} />
          <Text style={{
            color: colors.black,
            padding: 5,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 22,
          }}>{item.nama_subkategori}</Text>
        </View>
        {item.sewa > 0 && <Text style={{
          textAlign: 'center',
          position: 'absolute',
          right: -5,
          top: -5,
          borderRadius: 5,
          paddingHorizontal: 5,
          color: colors.white,
          backgroundColor: colors.danger,
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 28,
        }}>Booked</Text>}
        <Text style={{
          textAlign: 'center',
          color: item.sewa > 0 ? colors.border : colors.black,
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 32,
        }}>{item.nama_barang}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <ScrollView style={{
        backgroundColor: colors.background1
      }}>

        <View style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Image source={require('../../assets/logo.png')} style={{
            width: 50,
            height: 50,
            marginVertical: 5,
          }} />
          <Text style={{
            left: 10,
            color: colors.primary,
            fontFamily: fonts.secondary[800],
            fontSize: 30,
          }}>CAREGIVER</Text>
        </View>

        <MyCarouser />


        {/* list Kategoti */}
        <View>



          <View style={{
            flex: 1,
          }}>
            <FlatList numColumns={2} data={produk} renderItem={_renderItemProduk} />

            <FlatList showsHorizontalScrollIndicator={false} horizontal data={artikel} renderItem={__renderItemArtikel} />
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
