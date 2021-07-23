import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import SocketClient from '../services/SocketClient';
import {useIsFocused} from '@react-navigation/native';
import dateFormat from 'dateformat';

const {width} = Dimensions.get('window');
const height = Dimensions.get('window').height * 0.08;

const formatTime = time => {
  return dateFormat(time, 'h:MM TT');
};

const ImageSeen = ({photo}) => {
  return <Image style={styles.img_seen} source={{uri: photo}} />;
};
const TextSeen = () => {
  return (
    <Image
      style={styles.text_seen}
      source={require('../assets/tick-seen.png')}
    />
  );
};

const Item = ({item, email, photo}) => (
  <View style={styles.item}>
    <ImageBackground
      imageStyle={styles.img_img_background}
      style={styles.img_background}
      source={{uri: item.photo}}>
      {item.active ? <View style={styles.view_active} /> : null}
    </ImageBackground>
    <View style={styles.view_item}>
      <Text style={styles.title}>{item.name}</Text>
      {item.lastMessage ? (
        <View style={styles.view_content_item}>
          <Text
            style={
              item.lastMessage.email !== email
                ? item.lastMessage.seen
                  ? styles.textMessage
                  : styles.textMessageActive
                : styles.textMessage
            }>
            {item.lastMessage.email === email ? 'You: ' : ''}
            {item.lastMessage.message}
          </Text>
          <View style={styles.view_seen_item}>
            {item.lastMessage.email === email ? (
              item.lastMessage.seen ? (
                <ImageSeen photo={item.photo} />
              ) : (
                <TextSeen />
              )
            ) : null}
            <Text style={styles.text_time_send}>
              {formatTime(item.lastMessage.createdAt)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  </View>
);

const App = ({user, navigation}) => {
  const [listUser, setListUser] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (user.email !== '') {
      SocketClient.getUserMessages(user.email);
    }

    SocketClient.socket.on('reply-private', message => {
      if (typeof message === 'string') {
        return;
      }
      if (isFocused) {
        SocketClient.getUserMessages(user.email);
      }
    });

    SocketClient.socket.on('send-user-message', result => {
      if (result) {
        setListUser(result);
      }
    });

    SocketClient.socket.on('server-response-seen', result => {
      setListUser(result);
    });

    return () => {
      setListUser([]);
    };
  }, [user, isFocused]);

  const pressItem = item => {
    navigation.navigate('MessageScreen', {user: item});
    SocketClient.joinRoomChat(user, item);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => pressItem(item)}>
      <Item item={item} email={user.email} photo={user.photo} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={listUser}
      renderItem={renderItem}
      extraData={listUser}
      keyExtractor={item => item.email}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    flexDirection: 'row',
    height,
    width,
    borderBottomColor: 'pink',
    borderBottomWidth: 1,
    marginBottom: width * 0.02,
  },
  title: {
    fontSize: 22,
  },
  textMessage: {
    fontSize: 17,
    flex: 8,
  },
  textMessageActive: {
    fontSize: 17,
    flex: 8,
    fontWeight: 'bold',
  },
  img_seen: {
    flex: 1,
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: width * 0.1,
  },
  text_seen: {
    flex: 1,
    width: '20%',
  },
  img_img_background: {
    borderRadius: height * 0.5,
  },
  view_item: {
    flex: 7,
    marginLeft: 25,
  },
  view_content_item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view_seen_item: {
    flex: 2,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_time_send: {
    fontSize: 13,
    flex: 1,
    textAlign: 'center',
    color: 'red',
  },
  img_background: {
    width: height,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view_active: {
    backgroundColor: '#58FA58',
    height: height * 0.15,
    width: height * 0.15,
    borderRadius: height * 0.08,
    alignSelf: 'flex-end',
  },
});

export default React.memo(App);
