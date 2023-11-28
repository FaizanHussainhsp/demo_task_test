import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

const Card = ({image, title, createData}) => {
  return (
    <View
      style={{
        // height: hp(50),
        backgroundColor: '#ffff',
        borderRadius: 20,

        marginVertical: hp(2),
        marginHorizontal: wp(5),
        paddingHorizontal: wp(3),
        // paddingVertical: hp(2),
        paddingTop: hp(2),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, // for Android
      }}>
      <View
        style={{
          height: hp(25),
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: 'red',
        }}>
        <FastImage
          source={{uri: image}}
          resizeMode={FastImage.resizeMode.stretch}
          style={{height: '100%', width: '100%'}}
        />
        <Text
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            backgroundColor: '#7B5AFF',
            paddingHorizontal: wp(3),
            paddingVertical: hp(1),
            borderRadius: 50,
            // color: '#ffff',
            color: '#FFF', // or use: 'var(--white, #FFF)'
            // textAlign: 'center',
            fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
            fontSize: 17,
            fontStyle: 'normal',
            fontWeight: '600',
          }}>
          Checked In
        </Text>
      </View>
      <Text
        style={{
          color: '#000', // or use: 'var(--black, #000)'
          fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
          fontSize: 20,
          fontStyle: 'normal',
          fontWeight: '700',
          marginVertical: hp(1.5),
        }}>
        {title}
      </Text>
      <Text
        style={{
          color: '#718096', // or use: 'var(--muted-700, #718096)'
          fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
          fontSize: 16,
          fontStyle: 'normal',
          fontWeight: '400',
        }}>
        {createData}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: hp(2),
        }}>
        <View
          style={{
            height: 45,
            width: 45,
            borderRadius: 50,
            marginRight: wp(3),
          }}>
          <FastImage
            source={require('../assets/images/Avatar.png')}
            resizeMode={FastImage.resizeMode.stretch}
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <Text
          style={{
            color: '#000', // or use: 'var(--black, #000)'
            fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '700',
          }}>
          Owner:
        </Text>
        <Text
          style={{
            color: '#000', // or use: 'var(--black, #000)'
            fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '400',
            marginHorizontal: wp(1),
          }}>
          john Don
        </Text>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({});
