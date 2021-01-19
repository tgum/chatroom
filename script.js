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

	if (text === "") {
		alert("You have to write something")
		return null;
	}

	var data = {
		sender: sessionStorage.user,
		content: rot13(text),
		time: time.getHours() + ":" + minutes,
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
		var newLi = document.createElement("li");
		var name = "<div class='detailbox'><span class='user'>" + allMessages[keys[i]].sender + "</span>"
		var time = "<span class='time'>" + allMessages[keys[i]].time + "</span></div>"
		var content = "<span class='content'>" + rot13(allMessages[keys[i]].content) + "</span>"
		if (content.includes("\n")) {
			content = content.replaceAll("\n", "<br>")
		}
		newLi.innerHTML = name + time + content.replace("\n", "<br>");
		document.getElementById("messages").appendChild(newLi);
	}
	if (keys.length > 100) {
		let userRef = database.ref('messages/' + keys[keys.length - 1]);
		userRef.remove()
	}
}

function errData(err) {
	console.error(err);
}

window.onclick = e => {
	if (e.target.className === "user") {
		document.getElementById("textBox").value += "@" + e.target.textContent + " "
		document.getElementById("textBox").focus()
	}
}
