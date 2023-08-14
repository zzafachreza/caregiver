import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text, BackHandler,
  View,
  SafeAreaView,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import { windowWidth, fonts } from '../../utils/fonts';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function Account({ navigation, route }) {
  const [user, setUser] = useState({});
  const [com, setCom] = useState({});
  const isFocused = useIsFocused();
  const [wa, setWA] = useState('');



  useEffect(() => {
    if (isFocused) {
      getData('user').then(res => {
        setUser(res);
        console.error(res);
      });

    }
  }, [isFocused]);

  const btnKeluar = () => {
    storeData('user', null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Splash' }],
    });

  };

  const kirimWa = x => {
    Linking.openURL(
      'https://api.whatsapp.com/send?phone=' +
      x +
      '&text=Halo%20NIAGA%20BUSANA',
    );
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.background1,
    }}>
      <Text style={{
        fontFamily: fonts.secondary[800],
        textAlign: 'center',
        fontSize: 22,
        padding: 10,
        marginBottom: 10,
        backgroundColor: colors.primary,
        color: colors.white
      }}>PROFILE</Text>
      <View style={{ padding: 10 }}>


        {/* data detail */}
        <View style={{ padding: 10 }}>
          <ScrollView>
            <View
              style={{
                marginVertical: 3,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Username
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.username}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Email
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.email}
              </Text>
            </View>


            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Nama Lengkap
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.nama_lengkap}
              </Text>
            </View>



            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Telepon / Whatsapp
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.telepon}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                }}>
                Alamat
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  color: colors.primary,
                }}>
                {user.alamat}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 3,
                padding: 10,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                  marginBottom: 10,
                }}>
                Foto KTP
              </Text>
              <Image

                source={{
                  uri: urlAPI.replace("api", "") + user.foto_ktp
                }}

                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 10,
                }}

              />
            </View>
            <View style={{
              flexDirection: 'row'
            }}>
              <View style={{
                flex: 1,
                paddingRight: 5,
              }}>
                <MyButton
                  onPress={() => navigation.navigate('EditProfile')}
                  title="Edit Profile"
                  colorText={colors.white}
                  iconColor={colors.white}
                  warna={colors.primary}
                  Icons="create-outline"
                />
              </View>
              <View style={{
                flex: 1,
                paddingRight: 5,
              }}>
                <MyButton
                  onPress={btnKeluar}
                  title="Keluar"
                  colorText={colors.white}
                  iconColor={colors.white}
                  warna={colors.black}
                  Icons="log-out-outline"
                />
              </View>

            </View>
          </ScrollView>
        </View>

        {/* button */}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
