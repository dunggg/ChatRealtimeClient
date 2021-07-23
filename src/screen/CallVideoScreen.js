import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import SocketClient from '../services/SocketClient';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
const pcLocal = new RTCPeerConnection(configuration);
const pc = new RTCPeerConnection(configuration);

function CallVideoScreen({route}) {
  const email = route.params.email || null;
  const [stream, setStream] = useState(null);
  const [streamRemote, setStreamRemote] = useState(null);

  useEffect(() => {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind === 'videoinput' &&
          sourceInfo.facing === (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then(stream => {
          // Got stream!
          // stream.getTracks.forEach(track => pcLocal.addStream(stream));
          pcLocal.addStream(stream);

          // console.log(pcLocal.getRemoteStreams());
          // console.log(pcLocal.getLocalStreams());
          setStream(stream);
          console.log(stream.toURL());
          pc.onaddstream = e => {
            setStreamRemote(e.stream);
            console.log(e.stream.toURL());
          };
          pc.onicecandidate = e => {
            if (e.candidate) {
              pc.addIceCandidate(e.candidate);
            }
          };

          pcLocal.onicecandidate = e => {
            if (e.candidate) {
              pcLocal.addIceCandidate(e.candidate);
            }
          };

          pc.onconnectionstatechange = e => {
            if (pc.connectionState === 'connected') {
              console.log('pc đã kết nối');
            }
          };

          pcLocal.onconnectionstatechange = e => {
            if (pcLocal.connectionState === 'connected') {
              console.log('pc local đã kết nối');
            }
          };

          if (email) {
            pcLocal.createOffer().then(desc => {
              pcLocal.setLocalDescription(desc).then(() => {
                // Send pc.localDescription to peer

                SocketClient.callRequest(email);
                SocketClient.socket.on('answer-request-sender', () => {
                  SocketClient.callUser(email, desc, stream);
                });
              });
            });
          }
        })
        .catch(error => {
          // Log error
        });
    });

    pcLocal.onicecandidate = function (event) {
      // send event.candidate to peer
      console.log('event');
      console.log(event.candidate);
    };

    // also support setRemoteDescription, createAnswer, addIceCandidate, onnegotiationneeded, oniceconnectionstatechange, onsignalingstatechange, onaddstream
  }, []);

  useEffect(() => {
    SocketClient.socket.on('call-made', async ({socket, offer, stream}) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(new RTCSessionDescription(answer));
      // console.log('stream 2');
      // const streamRemote = MediaStream();
      // streamRemote.addTrack(stream, streamRemote);
      // console.log(streamRemote);
      // setStreamRemote(stream.id);
      SocketClient.answer(socket, answer);
    });

    SocketClient.socket.on('answer-made', async ({socket, answer}) => {
      await pcLocal.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('đã vào đây 2');
      console.log(answer);
    });

    return () => {
      setStream(null);
      setStreamRemote(null);
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <RTCView
        mirror={true}
        objectFit={'cover'}
        style={{flex: 1}}
        streamURL={streamRemote ? streamRemote.toURL() : ''}
      />
      <RTCView
        mirror={true}
        objectFit={'cover'}
        style={{flex: 1}}
        streamURL={stream ? stream.toURL() : ''}
      />
    </View>
  );
}

export default CallVideoScreen;
