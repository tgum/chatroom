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
var allMessages;
var time = new Date()
ref.on("value", readMessages, errData);
function encode() {
	var text = document.getElementById("textBox").value;
	time = new Date();
	var minutes = time.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes.toString();
	}

	var recipient = null
	if (text.charAt(0) === "@") {
		var recipient = text.split(" ")[0].replace("@", "");
		text = text.split(" ").pop().toString().replace(",", " ")
	}

	var data = {
		sender: sessionStorage.user,
		content: rot13(text),
		time: time.getHours() + ":" + minutes,
		recipient: recipient
	}
	ref.push(data);
	document.getElementById("textBox").value = "";
	document.getElementById("textBox").focus();
}
document.getElementById("submit").addEventListener("click", encode);

function readMessages(data) {
	allMessages = data.val();
	var keys = Object.keys(allMessages).reverse();;
	document.getElementById("messages").innerHTML = "";
	for (var i = 0; i < keys.length; i++) {
		if (allMessages[keys[i]].recipient === sessionStorage.user || allMessages[keys[i]].recipient === undefined || allMessages[keys[i]].sender === sessionStorage.user || allMessages[keys[i]].recipient === null) {
			var newLi = document.createElement("li");
			name = "<strong>" + allMessages[keys[i]].sender + "</strong>:<br>"
			content = "<span class='content' disabled>" + rot13(allMessages[keys[i]].content) + "</span><br>"
			time = "<span class='time'>" +  allMessages[keys[i]].time + "</span>"
			newLi.innerHTML = name + content + time;
			document.getElementById("messages").appendChild(newLi);
		}
	}
}

function errData(err) {
	console.error(err);
}

onlineUsersRef = database.ref("online-users")
onlineUsersRef.on("value", readUsers, errData);
onlineUsersRef.push({
	name: sessionStorage.user
})

function readUsers(data) {
	onlineUsers = data.val();
	var keys = Object.keys(onlineUsers)
	keys = keys.slice(1, keys.length);
	var onlineUl = document.getElementById("online");
	onlineUl.innerHTML = ""
	for (var i = 0; i < keys.length; i++) {
		var newUser = document.createElement("li")
		newUser.innerHTML = "<span class='at'>@</span>" + onlineUsers[keys[i]].name
		onlineUl.appendChild(newUser)
	}
}

function onQuit() {
	onlineUsers = data.val();
	var keys = Object.keys(onlineUsers)
	keys = keys.slice(1, keys.length);
	for (var i = 0; i < keys.length; i++) {
		if (onlineUsers[keys[i]] == sessionStorage.user) {
			let userRef = database.ref('online-users/' + keys[i]);
			userRef.remove()
		}
	}
}

window.onbeforeunload = function(){
	onQuit();
};
