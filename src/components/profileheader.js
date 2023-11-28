import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';

const ProfileHeader = () => {
  return (
    <View style={styles.profile}>
      <View style={{width: wp(15)}}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={require('../assets/images/base.png')}
          style={{height: '100%', width: '100%'}}
        />
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.roundedAvatar}>
          <FastImage
            source={require('../assets/images/Avatar.png')}
            resizeMode={FastImage.resizeMode.contain}
            style={{height: '100%', width: '100%', borderRadius: 50}}
          />
        </View>
        <View>
          <Entypo name="chevron-down" color="#718096" size={30} />
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(8),
    borderRadius: 50,
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    marginHorizontal: wp(5),
    marginTop: hp(8),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1, // for Android
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  roundedAvatar: {
    height: 45,
    width: 45,
    backgroundColor: 'yellow',
    borderRadius: 50,
    marginRight: 5,
    overflow: 'hidden', // Clip the image within the rounded border
  },
});
