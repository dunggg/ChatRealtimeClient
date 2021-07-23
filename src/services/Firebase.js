import messaging from '@react-native-firebase/messaging';
import Notification from './PushNotification';

class FireBaseClient {
  constructor() {}

  async currentToken() {
    try {
      await Notification.createChannelGroup();
      await Notification.createChannel();
      const fcmToken = await messaging().getToken();
      return Promise.resolve(fcmToken);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  onMessageBackground() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const {data} = remoteMessage;
      if (!data.message) {
        return await Notification.localNotification(data);
      }
      return await Notification.localNotificationMessage(data);
    });
  }

  onMessageForeground() {
    messaging().onMessage(async remoteMessage => {
      const {data} = remoteMessage;
      if (!data.message) {
        return await Notification.localNotification(data);
      }
      // return await Notification.localNotificationMessage(data);
    });
  }
}

export default new FireBaseClient();
