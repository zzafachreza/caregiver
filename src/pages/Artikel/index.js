import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native';
import { colors } from '../../utils/colors';
import { Image } from 'react-native';
import { fonts } from '../../utils/fonts';
import RenderHtml from 'react-native-render-html';

export default function Artikel({ navigation, route }) {

    const item = route.params;
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white
        }}>
            <Image source={{
                uri: item.foto
            }} style={{
                width: '100%',
                height: 250
            }} />
            <Text style={{
                margin: 10,
                fontFamily: fonts.secondary[600],
                fontSize: 20
            }}>{item.judul}</Text>
            <View style={{
                margin: 10,
            }}>
                <RenderHtml
                    contentWidth={'100%'}
                    source={{
                        html: item.keterangan
                    }}
                />
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})