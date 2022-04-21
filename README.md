## Screensharing video cropping

This sample shows how to perform cropping on a screen sharing stream using the experimental mediacapture-transform API.

## Use Case

For some use-cases, it is important that you can specify a portion of the screen to share, because you want to prevent some business logic content to be shared. Insertable Streams, which is a new browser API, allows that. This sample application has been adapted from the one found [here](https://webrtc.github.io/samples/). Bear in mind that at present, Insertable streams support only Chrome and Chromium based browsers (https://chromestatus.com/feature/5499415634640896)

## How does it work?

Once the screen publisher selects entire screen, the getDisplayMedia() API will be called. At that point, we will create a [VideoFrame ](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame) which is a rectangle by leveraging the [mediacapture-transform API](https://github.com/w3c/mediacapture-transform). This sample application has the dimensions of the rectangle coming from the position of the map.

## How to use this application

0. Configure apiKey, sessionId and token in js/main.js and subscriber.html
1. Open the screen_publisher.html in one tab. At this point the publisher is publishing video from a camera, if you hit on share screen and select entire screen, a new stream will be created with containing the map.
2. If subscriber.html page is open, both users should be able to communicate and the map will be shared as a screen sharing stream. If you test locally and want to play both roles on the same machine, when you minimise the window that pertains to the screen-sharer, the map will disappear because you are sharing the entire screen. So it is highly recommended to test this application on two different machines.

Let's take the following image as an example. Let's suppose the application has some private content you don't want to share (we will presume this content is the green area in the image below), however the user would like to be able to share only a portion of the web application, such as the map on the right hand-side.

![Private screen](https://github.com/nexmo-se/videocropping-insertable-streams/blob/main/images/private_screen.png?raw=true)

Once the user hits on share screen and selects the specific window they want to share, a new stream will be created including only a specific portion of the screen. As it is seen in the image below, the new stream published into the session only contains the map.

![Stream shared](https://github.com/nexmo-se/videocropping-insertable-streams/blob/main/images/private_screen_sharing.png?raw=true)
