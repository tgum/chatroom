function rot13(str) {
  var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
  var index     = x => input.indexOf(x);
  var translate = x => index(x) > -1 ? output[index(x)] : x;
  return str.split('').map(translate).join('');
}

var firebaseConfig = {
  apiKey: "AIzaSyBSNTYqIkFl3clQDdV5tpNMdyFhXT8gv44",
  authDomain: "message-teest.firebaseapp.com",
  projectId: "message-teest",
  storageBucket: "message-teest.appspot.com",
  messagingSenderId: "981048070980",
  appId: "1:981048070980:web:5c147607b3f809a4bb3d11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var ref = database.ref("messages");
var allMessages
ref.on("value", gotData, errData)
function encode() {
  var text = document.getElementById("textBox").value;
  var data = {
      sender: sessionStorage.user,
      content: rot13(text)
  }
  ref.push(data);
  document.getElementById("textBox").value = ""
  document.getElementById("textBox").focus()
}
document.getElementById("submit").addEventListener("click", encode)

function gotData(data) {
allMessages = data.val();
var keys = Object.keys(allMessages)
document.getElementById("messages").innerHTML = ""
for (var i = 0; i < keys.length; i++) {
  var newLi = document.createElement("li")
  newLi.innerHTML = "<span>" + allMessages[keys[i]].sender + "</span>: " + rot13(allMessages[keys[i]].content)
  document.getElementById("messages").appendChild(newLi)
}
}

function errData(err) {
console.error(err)
}
