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
		databaseURL: "https://message-teest-default-rtdb.firebaseio.com",
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
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var daysWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
function sendMessage() {
	var text = document.getElementById("textBox").value;
	if (text.includes("%%")) {
		var separator = "%%"
		var firstIndex = text.indexOf(separator)
		var lastIndex = text.lastIndexOf(separator)
		var code = text.slice(firstIndex + separator.length, lastIndex)
		code = code.replaceAll("\n", "`br`")
		code = code.replaceAll("<", "&lt;")
		code = code.replaceAll("`br`", "<br>")
		var complete = text.slice(0, firstIndex) + code + text.slice(lastIndex + separator.length, text.length)
		text = complete
	}

	time = new Date();
	var date = daysWeek[time.getDay()] + ", " + time.getDate() + " " + months[time.getMonth()] + " " + time.getFullYear();
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
		date: time.getDate(),
		fullDate: date
	}
	ref.push(data);
	document.getElementById("textBox").value = "";
	document.getElementById("textBox").focus();
}
document.getElementById("submit").addEventListener("click", sendMessage);

function readMessages(data) {
	allMessages = data.val();
	var keys = Object.keys(allMessages).reverse();
	document.getElementById("calendar").innerHTML = ""
	var dates = []
	for (var i = 0; i < keys.length; i++) {
		var date = new Date();
		if (!dates.includes(allMessages[keys[i]].date)) {
			dates.push(allMessages[keys[i]].date)

			var newDetails = document.createElement("details")
			var newSummary = document.createElement("summary")
			var newUl = document.createElement("ul")

			newSummary.textContent = allMessages[keys[i]].fullDate
			newDetails.className = "day"
			newDetails.id = allMessages[keys[i]].date
			var nowDate = daysWeek[date.getDay()] + ", " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
			if (allMessages[keys[i]].fullDate === nowDate) {
				newDetails.open = true
			}
			newUl.className = allMessages[keys[i]].date
			document.getElementById("calendar").appendChild(newDetails)
			document.getElementById(allMessages[keys[i]].date).appendChild(newSummary)
			document.getElementById(allMessages[keys[i]].date).appendChild(newUl)
		}
	}

	for (var i = 0; i < keys.length; i++) {
		var newLi = document.createElement("li");
		var name = "<div class='user+time+box'><span class='user' onclick='addUserTextarea(this)'>" + allMessages[keys[i]].sender + "</span>"
		var time = "<span class='time'>" + allMessages[keys[i]].time + "</span></div>"
		var content = "<div class='content'>" + rot13(allMessages[keys[i]].content) + "</div>"
		newLi.innerHTML = name + time + content.replace("\n", "<br>");
		document.getElementsByClassName(allMessages[keys[i]].date)[0].appendChild(newLi)
	}
}

function errData(err) {
	console.error(err);
}

function addUserTextarea(object) {
	document.getElementById("textBox").value += "@" + object.textContent + " ";
	document.getElementById("textBox").focus()
}
