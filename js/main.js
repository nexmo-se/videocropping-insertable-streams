/*
 *  Copyright (c) 2021 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var apiKey = '46264952';
var sessionId =
  '1_MX40NjI2NDk1Mn5-MTY0OTQxNTg0Mjg4N351Rlg1QjFjNjNlZ1RCUDBCRk01NUJCV1d-fg';
var token =
  'T1==cGFydG5lcl9pZD00NjI2NDk1MiZzaWc9ZTU2NjU1NTU3ZDU4YzE0YmU0Y2RmMWEwNWUxYmFlOTVlYzgyMWNmZjpzZXNzaW9uX2lkPTFfTVg0ME5qSTJORGsxTW41LU1UWTBPVFF4TlRnME1qZzROMzUxUmxnMVFqRmpOak5sWjFSQ1VEQkNSazAxTlVKQ1YxZC1mZyZjcmVhdGVfdGltZT0xNjQ5NjY3OTcxJm5vbmNlPTAuODM3OTY1NDQ3MDg2MjA1OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjUwMjcyNzcxJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

if (!apiKey || !sessionId || !token) alert('fill out the config.js file');
let session;

const startButton = document.getElementById('startButton');
// const localVideo = document.getElementById('localVideo');
const croppedVideo = document.getElementById('croppedVideo');
initializeSession();

/* global MediaStreamTrackProcessor, MediaStreamTrackGenerator */
if (
  typeof MediaStreamTrackProcessor === 'undefined' ||
  typeof MediaStreamTrackGenerator === 'undefined'
) {
  alert(
    'Your browser does not support the experimental MediaStreamTrack API ' +
      'for Insertable Streams of Media. See the note at the bottom of the ' +
      'page.'
  );
}

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream

  // Create a publisher
  var publisher = OT.initPublisher(
    'publisher',
    {
      insertMode: 'append',
      width: '100px',
      height: '100px',
    },
    handleError
  );

  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      console.log('connected');
      session.publish(publisher, handleError);
    }
  });

  session.on('streamCreated', function (event) {
    console.log(event.stream);
    session.subscribe(
      event.stream,
      'subscriber',
      {
        insertMode: 'append',
        width: '200px',
        height: '200px',
      },
      handleError
    );
  });
}

const publish = (videoTracks) => {
  console.log('publish function called');
  if (
    !screenCroppedPublisher
    //&&
    // videoTracks.length > 0 &&
    // audioTracks.length > 0
  ) {
    console.log('trying to publish screen');
    stream.removeEventListener('addtrack', publish);
    const screenCroppedPublisher = OT.initPublisher(
      'croppedVideo',
      {
        videoSource: videoTracks[0],
        name: 'map',
      },
      handleError
    );
    // publisher.on('streamCreated', () => {
    //   document.getElementById('publishstream').style.display = 'block';
    // });
    screenCroppedPublisher.on('destroyed', () => {
      video.pause();
    });
  }
};

const worker = new Worker('./js/worker.js', { name: 'Crop worker' });
startButton.addEventListener('click', async () => {
  // const stream = await navigator.mediaDevices.getUserMedia({video: {width: 1280, height: 720}});
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  // localVideo.srcObject = stream;

  const [track] = stream.getTracks();
  const processor = new MediaStreamTrackProcessor({ track });
  const { readable } = processor;

  const generator = new MediaStreamTrackGenerator({ kind: 'video' });
  const { writable } = generator;
  croppedVideo.srcObject = new MediaStream([generator]);
  const videoElement = croppedVideo.captureStream();

  const videoTracks = videoElement.getVideoTracks();

  // in opera it works fine
  const screenCroppedPublisher = OT.initPublisher(
    'croppedVideo',
    {
      videoSource: videoTracks[0],
      // videoSource: 'screen',
    },
    handleError
  );

  // videoElement.addEventListener('addtrack', () => {
  //   console.log('ahora si');
  //   publish(videoTracks);
  // });
  // videoTracks.addEventListener('addtrack', () => {
  //   console.log('ahora ssii');
  // });
  session.publish(screenCroppedPublisher, handleError);

  worker.postMessage(
    {
      operation: 'crop',
      readable,
      writable,
    },
    [readable, writable]
  );
});
