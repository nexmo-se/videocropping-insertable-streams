## Screensharing video cropping

This sample shows how to perform cropping on a screen sharing stream using the experimental mediacapture-transform API in a Worker.

## Use Case

For some use-cases, it is important that you can select a portion of the screen to share, because you want to prevent some business logic content to be shared. Insertable Streams, which is a new browser API, allows that. This sample application has been adapted from the one found [here](https://webrtc.github.io/samples/).

## How does it work?

Once the screen publisher selects entire screen, the getDisplayMedia() API will be called. At that point a web worker will be use to crop the entire screen. This is done in worker.js by creating a [VideoFrame ](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame) which is a rectangle. This sample application has the value hardcoded, but you can dynamically let the user compose a rectangle and then calculate the coordinates of the rectangle and pass it to the transform function to only share a portion of the user's screen.

## How to use this application

To run the sample application locally you need to expose the HTML files with Live server or a similar utility because web workers can't run locally with file:// paths.

0. Populate the credentials file
1. Open the screen_publisher.html in one tab and subscriber.html on a different tab (ideally in different machines)
2. At this point both users should see each other.
3. The publisher can hit on share screen, select entire screen and only a portion of the screen (the map) will be shared. If you test locally and want to play both roles on the same machine, when you minimise the window that pertains to the screen-sharer, the map will disappear because you are sharing the entire screen.

Let's take the following image as an example. Let's suppose the application has some private content you don't want to share (we will presume this content is the green area in the image below), however the user would like to be able to share only a portion of the web application, such as the map on the right hand-side.

![Private screen](https://raw.githubusercontent.com/nexmo-se/videocropping-insertable-streams/main/images/private_screen.png?token=GHSAT0AAAAAABJETI6BKP3GSUBXT5LHLWO2YS6VZGQ)

Once the user hits on share screen and selects entire screen, a new stream will be created including only a specific portion of the screen. As it is seen in the image below, the new stream published into the session only contains the map.

![Stream shared](https://github.com/nexmo-se/videocropping-insertable-streams/blob/main/images/private_screen_sharing.png?raw=true)
