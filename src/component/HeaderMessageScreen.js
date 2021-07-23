import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const width = Dimensions.get('window').width * 0.13;

function HeaderMessageScreen({navigation, route}) {
  const {user} = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{flex: 1}}>
        <Image
          source={require('../assets/arrow_back_icon.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'center',
          }}
        />
      </TouchableOpacity>
      <View style={{flex: 6, flexDirection: 'row'}}>
        <ImageBackground
          imageStyle={{borderRadius: 100, resizeMode: 'center'}}
          source={{uri: user.photo}}
          style={{flex: 1}}></ImageBackground>
        <View style={{flex: 3}}>
          <Text>{user.name}</Text>
          <Text>{user.active ? 'active' : 'inactive'}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CallVideoScreen', {email: user.email});
        }}
        style={{flex: 1}}>
        <Image
          source={require('../assets/call_phone_icon.png')}
          style={{width: '100%', height: '50%', resizeMode: 'center'}}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{flex: 1}}>
        <Image
          source={require('../assets/call_phone_icon.png')}
          style={{width: '100%', height: '50%', resizeMode: 'center'}}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: width,
  },
});

export default React.memo(HeaderMessageScreen);
