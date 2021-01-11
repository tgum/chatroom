if (sessionStorage.user == undefined) {
	location.href = "index.html"
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
ref.on("value", readMessages, errData);
function sendMessage() {
	var text = document.getElementById("textBox").value;
	time = new Date();
	var minutes = time.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes.toString();
	}

	var recipient = null
	if (text.charAt(0) === "@") {
		var recipient = text.split(" ")[0].replace("@", "");
		text = text.replace(text.split(" ")[0], "")
	}

	if (text === "") {
		alert("You have to write something")
		return null;
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
document.getElementById("submit").addEventListener("click", sendMessage);

function readMessages(data) {
	allMessages = data.val();
	var keys = Object.keys(allMessages).reverse();
	document.getElementById("messages").innerHTML = "";
	for (var i = 0; i < keys.length; i++) {
		if (allMessages[keys[i]].recipient === sessionStorage.user || allMessages[keys[i]].recipient === undefined || allMessages[keys[i]].sender === sessionStorage.user || allMessages[keys[i]].recipient === null) {
			var newLi = document.createElement("li");
			name = "<strong class='user'>" + allMessages[keys[i]].sender + "</strong>:<br>"
			content = "<div class='content'>" + rot13(allMessages[keys[i]].content) + "</div><br>"
			time = "<span class='time'>" +  allMessages[keys[i]].time + "</span>"
			if (content.includes("\n")) {
				content = content.replaceAll("\n", "<br>")
			}
			newLi.innerHTML = name + content.replace("\n", "<br>") + time;
			document.getElementById("messages").appendChild(newLi);
		}
	}
	if (keys.length > 100) {
		let userRef = database.ref('messages/' + keys[keys.length - 1]);
		userRef.remove()
	}
}

function errData(err) {
	console.error(err);
}

/*function onQuit() {
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
};*/

var keys = {
	shift: false,
	enter: false
}
var input = document.getElementById("textBox")
var button = document.getElementById("submit");
document.getElementById("textBox").addEventListener("keydown", function(event) {
	if (event.keyCode === 16) {
		event.preventDefault();
		keys.shift = true
	}
	else if (event.keyCode === 13) {
		event.preventDefault();
		keys.enter = true;
	}
	if (event.keyCode === 13 && keys.shift === false) {
		console.log("enter")
		document.getElementById("textBox").value += "\n"
	}
	if (keys.shift && keys.enter) {
		button.click();
		keys.enter = false;
		keys.shift = false;
	}
});
document.getElementById("textBox").addEventListener("keyup", event => {
	if (event.keyCode === 16) {
		event.preventDefault();
		keys.shift = false
	}
	else if (event.keyCode === 13) {
		event.preventDefault();
		keys.enter = false
	}
});

window.onclick = e => {
	if (e.target.className === "user") {
		document.getElementById("textBox").value += "@" + e.target.textContent + " "
		document.getElementById("textBox").focus()
	}
}
