import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Server from '../dev/Server';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const height = Dimensions.get('window').height * 0.08;

function ViewListRequestFriend({navigation}) {
  const switchScreen = () => {
    navigation.navigate('ListRequestFriendScreen');
  };

  return (
    <TouchableOpacity
      onPress={switchScreen}
      style={styles.container_list_request}>
      <Image
        style={styles.icon_list_request}
        source={require('../assets/icon_friends.png')}
      />
      <Text style={styles.text_list_request}>Lời mời kết bạn</Text>
    </TouchableOpacity>
  );
}

const Item = ({item}) => (
  <View style={styles.item}>
    <ImageBackground
      imageStyle={styles.item_img_backgroud_style}
      style={styles.item_img_backgroud}
      source={{uri: item.photo}}>
      {item.active ? <View style={styles.view_active} /> : null}
    </ImageBackground>
    <Text style={styles.item_title}>{item.name}</Text>
  </View>
);

const renderItem = ({item}) => <Item item={item} />;

function FriendsTab({navigation}) {
  const {email} = useSelector(state => state.user);
  const [data, setData] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (email !== '') {
      fetch(Server.url + '/users/list-friend?email=' + email)
        .then(response => response.json())
        .then(result => {
          if (result.statusCode === 200) {
            setData(result.data);
          }
        })
        .catch(err => console.error('error', err));
    }

    return () => {
      setData([]);
    };
  }, [email, isFocused]);

  return (
    <View style={styles.container}>
      <ViewListRequestFriend navigation={navigation} />
      <View style={styles.container2}>
        <FlatList
          data={data}
          renderItem={renderItem}
          extraData={renderItem}
          keyExtractor={item => item.email}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 9,
    width: width,
    marginTop: height * 0.2,
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: '#FAFAFA',
  },
  item_title: {
    fontSize: 20,
    flex: 8,
  },
  item_img_backgroud: {
    width: height,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_img_backgroud_style: {
    borderRadius: height * 0.5,
  },
  container_list_request: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9F5F2',
  },
  text_list_request: {
    flex: 8,
    marginLeft: 20,
    fontSize: 20,
  },
  icon_list_request: {
    height: '100%',
    flex: 2,
  },
  view_active: {
    backgroundColor: '#58FA58',
    height: height * 0.15,
    width: height * 0.15,
    borderRadius: height * 0.08,
    alignSelf: 'flex-end',
  },
});

export default FriendsTab;
