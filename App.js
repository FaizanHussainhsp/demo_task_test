import {
  Alert,
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Profileheader from './src/components/profileheader';
import Modal from 'react-native-modal';
import Card from './src/components/card';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFetchBlob from 'react-native-fetch-blob';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {checkPermission} from './src/utility/permissions';

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ImageUrl, setImageUrl] = useState('');
  const [imageRef, setImageRef] = useState('');
  const [value, setValue] = useState();
  const [valueError, setValueError] = useState(false);
  const [ImagesError, setImageError] = useState(false);
  const [checkinData, setCheckinData] = useState([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    checkPermission();
  }, []);

  const openImagePicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error:', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button:', response.customButton);
      } else {
        setLoading(true);
        setImageError(false);
        const source = {uri: response.uri};
        const res = await RNFetchBlob.fs.readFile(
          response.assets[0].uri,
          'base64',
        );
        const blobData = `data:${response.assets[0].type};base64,${res}`;

        const mimeType = response.assets[0].type;
        console.log(typeof mimeType);
        const filename =
          new Date().getTime() + `.${mimeType.replace('image/', '')}`;
        const reference = storage().ref(filename);
        setImageRef(reference);

        await reference.putString(blobData, 'data_url');

        const imageUrl = await storage().ref(filename).getDownloadURL();
        setLoading(false);
        setImageUrl(imageUrl);

        console.log('Selected Image:', source);
      }
    });
  };

  const addToCheck = () => {
    if (ImageUrl == '') {
      setImageError(true);
      return;
    } else if (value == '') {
      setValueError(true);
      return;
    } else {
      const objectName = new Date().getTime().toString();
      const today = moment(); // Get today's date

      const ordinalSuffixes = {
        1: 'st',
        2: 'nd',
        3: 'rd',
        21: 'st',
        22: 'nd',
        23: 'rd',
        31: 'st',
      };

      const getOrdinalSuffix = dayOfMonth => {
        if (dayOfMonth > 20) {
          dayOfMonth %= 10;
        }
        return ordinalSuffixes[dayOfMonth] || 'th';
      };

      const formattedDate = today.format(
        'DD[' + getOrdinalSuffix(today.date()) + '] MMM, YYYY',
      );
      console.log('asgydgsaydgsaydgsaydgaysgdysagd', formattedDate);
      try {
        firestore()
          .collection('checkins')
          .doc(objectName)
          .set({
            image: ImageUrl,
            title: value,
            id: objectName,
            createData: formattedDate,
          })
          .then(() => {
            toast.show('User added!', {
              type: 'normal',
              placement: 'top ',
              duration: 4000,
              offset: 30,
              animationType: 'slide-in ',
            });
            console.log('User added!');
          });
      } catch (error) {
        console.log(error);
      }
      setValue('');
      setImageUrl('');
      setImageRef('');

      toggleModal();

      try {
        firestore()
          .collection('checkins')
          .get()
          .then(querySnapshot => {
            console.log('Total users: ', querySnapshot.size);
            const checkinsDetail = [];
            querySnapshot.forEach(documentSnapshot => {
              console.log('savdasdyas', documentSnapshot.data()),
                checkinsDetail.push({...documentSnapshot.data()});
            });
            setCheckinData(checkinsDetail);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteImage = async () => {
    try {
      setImageUrl('');
      await imageRef.delete();
    } catch (error) {
      console.log(error);
    }
  };

  const textHandler = text => {
    setValue(text);
    setValueError(false);
  };

  useEffect(() => {
    try {
      firestore()
        .collection('checkins')
        .get()
        .then(querySnapshot => {
          console.log('Total users: ', querySnapshot.size);
          const checkinsDetail = [];
          querySnapshot.forEach(documentSnapshot => {
            console.log('savdasdyas', documentSnapshot.data()),
              checkinsDetail.push({...documentSnapshot.data()});
          });
          setCheckinData(checkinsDetail);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Profileheader />
        <View
          style={{
            // width: '90%',
            height: hp(45),
            // marginHorizontal: wp(1),
            marginVertical: hp(4),
            borderRadius: 20,
            overflow: 'hidden',
            marginHorizontal: wp(5),
            //backgroundColor: 'blue',
          }}>
          <ImageBackground
            resizeMode="stretch"
            style={{height: '100%', width: '100%'}}
            source={require('./src/assets/images/container.png')}>
            <View style={{marginTop: hp(12)}}>
              <Text
                style={{
                  color: '#FFF', // or use: 'var(--white, #FFF)'
                  textAlign: 'center',
                  fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                  fontSize: 28,
                  fontStyle: 'normal',
                  fontWeight: '800',
                }}>
                Hi! 👋 James Doe
              </Text>
            </View>

            <View style={{marginHorizontal: wp(10), marginTop: hp(2)}}>
              <Text
                style={{
                  color: '#FFF', // or use: 'var(--white, #FFF)'
                  textAlign: 'center',
                  fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '600',
                }}>
                Lorem ipsus dolor sit amen, something important to say here
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: hp(5),
              }}>
              <Text
                onPress={toggleModal}
                style={{
                  color: '#ffffff', // Default to white if the variable is not defined
                  // H6/medium
                  fontFamily: 'Roboto Flex',
                  fontSize: 14,
                  fontStyle: 'normal',
                  // fontWeight: '500',
                  fontWeight: 'bold',
                  // width: '30%',
                  textAlign: 'center',
                  backgroundColor: '#7B5AFF',
                  paddingHorizontal: wp(4),
                  paddingVertical: hp(1),
                  borderRadius: 20,
                }}>
                Add Check In
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View style={{marginHorizontal: wp(5)}}>
          <Text
            style={{
              color: '#000', // or use: 'var(--black, #000)'
              fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
              fontSize: 24,
              fontStyle: 'normal',
              fontWeight: '600',
            }}>
            Added CheckIns
          </Text>
        </View>

        <View
          style={{
            // height: hp(40),
            // backgroundColor: 'blue',
            // borderRadius: 20,
            // marginTop: hp(3),
            flex: 1,
            // backgroundColor: 'blue',
          }}>
          {checkinData.length != 0 && (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={checkinData}
              renderItem={({item}) => {
                return (
                  <Card
                    image={item?.image}
                    title={item?.title}
                    createData={item?.createData}
                  />
                );
              }}
            />
          )}

          {/* <View
            style={{
              height: hp(40),
              backgroundColor: 'red',
              borderRadius: 20,
              marginVertical: hp(2),
            }}></View> */}
        </View>

        <Modal isVisible={isModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  padding: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8F8F8',
                }}>
                <Text
                  style={{
                    color: '#000', // or use: 'var(--black, #000)'
                    fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                  }}>
                  Add Check In
                </Text>
                <TouchableOpacity onPress={toggleModal}>
                  <FastImage
                    tintColor={'#000000'}
                    source={require('./src/assets/images/Close.png')}
                    style={{height: 20, width: 20}}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  marginHorizontal: wp(5),
                  color: '#000', // or use: 'var(--black, #000)'
                  fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  marginVertical: hp(2),
                }}>
                Title
              </Text>
              <TextInput
                value={value}
                onChangeText={textHandler}
                placeholder="Enter title"
                placeholderTextColor={'#D9D9D9'}
                style={{
                  marginHorizontal: wp(5),
                  borderRadius: 10,
                  borderWidth: 1,
                  paddingLeft: 10,
                  borderColor: valueError ? 'red' : '#D9D9D9',
                  color: '#000',
                  fontSize: 16,
                  // marginTop: hp(2),
                }}
              />
              <Text
                style={{
                  marginHorizontal: wp(5),
                  marginTop: hp(3),
                  color: '#000000',
                  color: '#000', // or use: 'var(--black, #000)'
                  fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                }}>
                Upload Image
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (ImageUrl == '') {
                    openImagePicker();
                  } else {
                  }
                }}
                style={{
                  paddingHorizontal: wp(1),
                  paddingVertical: hp(2),
                  // marginHorizontal: 5,
                  marginTop: hp(2),
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: ImagesError ? 'red' : '#D9D9D9',
                  borderStyle: 'dashed', // Not supported, but set for better understanding
                  overflow: 'hidden', // Needed for Android to clip the dashed border
                  marginHorizontal: wp(5),
                }}>
                {ImageUrl == '' ? (
                  <>
                    {loading ? (
                      <ActivityIndicator size="large" color="#7B5AFF" />
                    ) : (
                      <>
                        <View style={{alignItems: 'center'}}>
                          <FastImage
                            source={require('./src/assets/images/Inbox.png')}
                            style={{height: hp(10), width: wp(20)}}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#000', // or use: 'black'
                            textAlign: 'center',
                            fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                            fontSize: 15,
                            fontStyle: 'normal',
                            fontWeight: '700',
                            marginTop: hp(2),
                          }}>
                          Click or drag file to this area to upload
                        </Text>
                        <Text
                          style={{
                            color: '#B4B4B4', // or use: 'var(--neutral-400, #B4B4B4)'
                            textAlign: 'center',
                            fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                            fontSize: 13,
                            fontStyle: 'normal',
                            fontWeight: '700',
                            marginTop: hp(1),
                            // backgroundColor: 'blue',
                            // paddingHorizontal: 5,
                            marginHorizontal: 8,
                            letterSpacing: 0.2,
                            lineHeight: 20,
                          }}>
                          Support for a single or bulk upload. Strictly prohibit
                          from uploading company data or other band files
                        </Text>
                      </>
                    )}
                  </>
                ) : (
                  <View
                    style={{
                      height: hp(30),
                      // backgroundColor: 'blue',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '90%',
                        borderRadius: 20,
                        overflow: 'hidden',
                      }}>
                      <FastImage
                        // resizeMode="stretch"
                        resizeMode={FastImage.resizeMode.stretch}
                        source={{uri: ImageUrl}}
                        style={{height: '100%', width: '100%'}}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={deleteImage}
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: 0,
                        borderWidth: 1,
                        borderRadius: 20,
                      }}>
                      <Entypo name="cross" size={30} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>

              <View
                style={{
                  height: hp(10),
                  paddingVertical: hp(2),

                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  // borderWidth: 1,
                  borderColor: '#B4B4B4',
                  borderTopWidth: 0.5,
                  marginTop: hp(3),
                  // opacity: 0.5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    try {
                      deleteImage();
                      setValue('');
                      toggleModal();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    borderWidth: 1,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderColor: '#B4B4B4',
                  }}>
                  <Text
                    style={{
                      color: '#000',

                      fontFamily: 'Roboto Flex',
                      fontSize: 14,
                      fontStyle: 'normal',
                      fontWeight: '400',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={loading ? true : false}
                  onPress={addToCheck}
                  style={{
                    // backgroundColor: 'white',
                    marginHorizontal: 10,
                    borderRadius: 20,
                    borderWidth: 1,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderColor: '#B4B4B4',
                    backgroundColor: '#7B5AFF',
                  }}>
                  <Text
                    style={{
                      color: '#ffffff', // or use: 'var(--black, #000)'
                      textAlign: 'center',
                      fontFamily: 'Roboto Flex', // Note: Check if this font is available in your project
                      fontSize: 14,
                      fontStyle: 'normal',
                      fontWeight: '400',
                    }}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: hp(5),
    // paddingHorizontal: wp(5),
    // marginHorizontal: wp(5),
    backgroundColor: '#FFFFFF',
  },
});
