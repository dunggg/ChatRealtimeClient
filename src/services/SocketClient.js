import {io} from 'socket.io-client';
import Server from '../dev/Server';

class SocketClient {
  constructor() {
    this.socket = io(Server.url);
  }
  addEmail(email) {
    this.socket.emit('update-email', email);
  }
  sendPrivate(emailFrom, emailTo, message, idMessage, photo) {
    this.socket.emit('send-private', {
      emailFrom,
      emailTo,
      message,
      idMessage,
      photo,
    });
  }
  joinRoomChat(from, to) {
    this.socket.emit('join-room-chat', {from, to});
  }

  getMessages(emailFrom, emailTo) {
    this.socket.emit('get-list-message', {emailFrom, emailTo});
  }

  getUserMessages(email) {
    this.socket.emit('get-user-message', email);
  }
  seen(emailFrom, emailTo) {
    this.socket.emit('seen', {emailFrom, emailTo});
  }
  callRequest(email) {
    this.socket.emit('call-request', email);
  }
  callMadeAnswerRequest(id) {
    this.socket.emit('made-answer-request', id);
  }
  callUser(email, offer, stream) {
    console.log(stream);
    this.socket.emit('call-user', email, offer, stream);
  }
  answer(idSocket, answer) {
    this.socket.emit('make-answer', {idSocket, answer});
  }
}

module.exports = new SocketClient();
