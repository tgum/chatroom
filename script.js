if (sessionStorage.user == undefined) {
	location.href = "index.html"
}

function sendNotification(notificationMessage) {
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}

		// Let's check whether notification permissions have already been granted
	else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
			var notification = new Notification(notificationMessage);
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== "denied") {
		Notification.requestPermission().then(function (permission) {
			// If the user accepts, let's create a notification
			if (permission === "granted") {
				var notification = new Notification(notificationMessage);
			}
		});
	}
}

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
var firstFetch = true
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
	var keys = Object.keys(allMessages).reverse();
	if (firstFetch == false && allMessages[keys[0]].sender !== sessionStorage.user) {
		sendNotification("new message by " + allMessages[keys[0]].sender)
	}
	document.getElementById("messages").innerHTML = "";
	for (var i = 0; i < keys.length; i++) {
		if (allMessages[keys[i]].recipient === sessionStorage.user || allMessages[keys[i]].recipient === undefined || allMessages[keys[i]].sender === sessionStorage.user || allMessages[keys[i]].recipient === null) {
			var newLi = document.createElement("li");
			name = "<strong>" + allMessages[keys[i]].sender + "</strong>:<br>"
			content = "<span class='content'>" + rot13(allMessages[keys[i]].content) + "</span><br>"
			time = "<span class='time'>" +  allMessages[keys[i]].time + "</span>"
			newLi.innerHTML = name + content + time;
			document.getElementById("messages").appendChild(newLi);
		}
	}
	firstFetch = false
	console.log(keys.length)
	if (keys.length > 100) {
		firstFetch = true
		let userRef = database.ref('messages/' + keys[keys.length - 1]);
		userRef.remove()
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
	var onlineP = document.getElementById("online");
	onlineP.innerHTML = ""
	for (var i = 0; i < keys.length; i++) {
		var newUser = "<span class='at'>@</span>" + onlineUsers[keys[i]].name + " "
		onlineP.innerHTML += newUser
	}
}

function onQuit() {
	onlineUsersRef = database.ref("online-users")
	onlineUsersRef.on("value", data => {
		onlineUsers = data.val();
		var keys = Object.keys(onlineUsers)
		keys = keys.slice(1, keys.length);
		for (var i = 0; i < keys.length; i++) {
			if (onlineUsers[keys[i]].name == sessionStorage.user) {
				let userRef = database.ref('online-users/' + keys[i]);
				userRef.remove()
			}
		}
	}, errData);
}

window.onbeforeunload = function(){
	onQuit();
};
