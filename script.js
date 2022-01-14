const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  c1 = document.getElementById("output-canvas");
  ctx1 = c1.getContext("2d");

  c_tmp = document.createElement("canvas");
  c_tmp.setAttribute("width", 720);
  c_tmp.setAttribute("height", 560);
  ctx_tmp = c_tmp.getContext("2d");

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    ctx_tmp.drawImage(video, 0, 0, canvas.width, canvas.height);

    // for (let data of resizedDetections) {
    //   let positions = data.landmarks.positions;
    //   const wx = Math.abs(positions[0].x - positions[16].x) * 1.22;
    //   const wy =
    //     Math.abs(positions[8].y - Math.min(positions[19].y, positions[24].y)) *
    //     1.5;
    //   var img = document.getElementById("scream");

    //   ctx_tmp.drawImage(
    //     img,
    //     positions[0].x - wx * 0.07,
    //     positions[8].y - wy,
    //     wx,
    //     wy
    //   );
    // }

    for (let data of resizedDetections) {
      let positions = data.landmarks.positions;
      var leftear = document.getElementById("scream1");
      var rightear = document.getElementById("scream2");
      var nose = document.getElementById("scream3");
      let lefteye = Math.abs(positions[21].x - positions[17].x) * 1.7;
      let righteye = Math.abs(positions[26].x - positions[22].x) * 1.7;
      let centernose = Math.abs(positions[48].x - positions[54].x);
      const wx = Math.abs(positions[0].x - positions[16].x) * 1.22;
      const wy = Math.abs(
        positions[8].y - Math.min(positions[19].y, positions[24].y)
      );

      ctx_tmp.drawImage(
        leftear,
        positions[0].x - lefteye * 0.1,
        positions[19].y - lefteye * 1.4,
        lefteye,
        lefteye * 1.1
      );
      ctx_tmp.drawImage(
        rightear,
        positions[22].x,
        positions[25].y - righteye * 1.4,
        righteye,
        righteye * 1.1
      );
      ctx_tmp.drawImage(
        nose,
        positions[48].x - centernose * 1.2 * 0.03,
        positions[28].y,
        centernose * 1.2,
        centernose * 0.8
      );
    }

    let frame2 = ctx_tmp.getImageData(0, 0, canvas.width, canvas.height);
    ctx1.putImageData(frame2, 0, 0);

    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 0);
});
