import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

class SigninGG {
  constructor() {
    GoogleSignin.configure({
      webClientId:
        '521907511374-5ea5m8srt8gdl4h5d8npglhuia6nc7hu.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }

  async signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      return {userInfo};
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {error: 'Cancelled'};
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {error: 'PLAY_SERVICES_NOT_AVAILABLE'};
      } else {
        return {error: 'The system is busy, please try again later'};
      }
    }
  }

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    return isSignedIn;
  };

  getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser;
  };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return {userInfo};
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        return {error: 'SIGN_IN_REQUIRED'};
      } else {
        // some other error
        return {error};
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };
}

export default new SigninGG();
