import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  LogBox,
  Image,
  Text,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import SocketClient from '../services/SocketClient';
import {useSelector} from 'react-redux';

const renderMessageImage = props => {
  return (
    <View
      style={{
        borderRadius: 15,
        padding: 2,
      }}>
      <Image
        resizeMode="contain"
        style={{
          width: 200,
          height: 200,
          padding: 6,
          borderRadius: 15,
          resizeMode: 'cover',
        }}
        source={{uri: 'https://placeimg.com/140/140/any'}}
      />
    </View>
  );
};

const Chat = ({user}) => {
  const [messages, setMessages] = useState([]);
  const {email, photo} = useSelector(state => state.user);

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

    SocketClient.getMessages(email, user.email);

    SocketClient.socket.on('send-list-message', messages => {
      const messsageFrom = messages.messageFrom.map(message => {
        return {
          _id: message.id,
          text: message.message,
          createdAt: new Date(message.createdAt),
          user: {
            _id: 1,
          },
        };
      });
      const messageTo = messages.messageTo.map(message => {
        return {
          _id: message.id,
          text: message.message,
          createdAt: new Date(message.createdAt),
          user: {
            _id: 2,
            name: user.name,
            avatar: user.photo,
          },
        };
      });
      const messageArr = [...messsageFrom, ...messageTo];
      messageArr.sort(function (o1, o2) {
        return o2.createdAt - o1.createdAt;
      });
      setMessages(messageArr);
    });

    SocketClient.socket.on('reply-private', message => {
      if (typeof message === 'string') {
        return;
      }
      onSend([
        {
          _id: message.id,
          text: message.text,
          createdAt: new Date(message.date),
          user: {
            _id: 2,
            name: user.name,
            avatar: user.photo,
          },
        },
      ]);
    });

    SocketClient.seen(email, user.email);

    return () => {
      setMessages([]);
    };
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      // showUserAvatar={true}
      // renderUsernameOnMessage={true}
      // renderCustomView={() => (
      //   <View>
      //     <Button title="abc" />
      //     <Image
      //       style={{height: 50, width: 50}}
      //       source={{uri: 'https://placeimg.com/140/140/any'}}
      //     />
      //   </View>
      // )}
      renderTicks={message => {
        message.active = false;
        // console.log(message);
        if (message.user._id !== 2 && message.active === true) {
          return <Text style={{fontSize: 10}}>✓✓</Text>;
        }
        return null;
      }}
      onLoadEarlier={() => {
        // console.log('Đang tải tin nhắn');
      }}
      // renderAccessory={() => {
      //   return <Button title="tải tin nhắn" />;
      // }}
      loadEarlier={true}
      isLoadingEarlier={false}
      isTyping={true}
      renderMessageImage={renderMessageImage}
      onSend={messages => {
        onSend(messages);
        SocketClient.sendPrivate(
          email,
          user.email,
          messages[0].text,
          messages[0]._id,
          photo,
        );
      }}
      user={{
        _id: 1,
        name: 'dung',
        avatar: 'https://placeimg.com/140/140/any',
      }}
    />
  );
};

function MessageScreen({route}) {
  const {user} = route.params;
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />

      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Chat user={user} />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(MessageScreen);
