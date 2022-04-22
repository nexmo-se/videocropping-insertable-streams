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
  'T1==cGFydG5lcl9pZD00NjI2NDk1MiZzaWc9YWRlOGQ1NDdkMDIzOWNlOWRiM2M1ZTI2NzcxMThkOTZhYWJlZjg4MjpzZXNzaW9uX2lkPTFfTVg0ME5qSTJORGsxTW41LU1UWTBPVFF4TlRnME1qZzROMzUxUmxnMVFqRmpOak5sWjFSQ1VEQkNSazAxTlVKQ1YxZC1mZyZjcmVhdGVfdGltZT0xNjUwNDQ3MzgyJm5vbmNlPTAuODkwMTE0NzMwNTMxMDQ2MiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjUzMDM5MzgyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

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
      // width: '100px',
      // height: '100px',
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

// const worker = new Worker('./js/worker.js', { name: 'Crop worker' });
startButton.addEventListener('click', async () => {
  // const stream = await navigator.mediaDevices.getUserMedia({video: {width: 1280, height: 720}});
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: null,
  });
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
      width: '300px',
      height: '600px',
      // fitMode: 'cover',

      // videoSource: 'screen',
    },
    handleError
  );

  session.publish(screenCroppedPublisher, handleError);
  console.log(document.getElementById('map').getBoundingClientRect());
  console.log(window.outerHeight - window.innerHeight);

  function transform(frame, controller) {
    const map = document.getElementById('map');
    const { x, y, width, height, top, right, bottom, left } =
      map.getBoundingClientRect();
    // Cropping from an existing video frame is supported by the API in Chrome 94+.

    const newFrame = new VideoFrame(frame, {
      visibleRect: {
        // x: 1084,
        x: x,
        // x: 10,
        y: 80,
        width: width,
        // y: window.outerHeight - window.innerHeight - 32,
        // y: 103,
        height: height,

        // right: right + window.pageXOffset,
        // bottom: bottom + window.pageYOffset,
        // left: left + window.pageXOffset,
      },
    });

    console.log(newFrame.codedWidth);

    frame.close();
    controller.enqueue(newFrame);
  }

  readable.pipeThrough(new TransformStream({ transform })).pipeTo(writable);
});
