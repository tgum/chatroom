function rot13(str) {
	var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
	var index     = x => input.indexOf(x);
	var translate = x => index(x) > -1 ? output[index(x)] : x;
	return str.split('').map(translate).join('');
}

var devMode = false

var devFirebaseConfig = {
	apiKey: "AIzaSyBhIbcYDG4g1cG3PUf_pGSPMsx7rvYLu88",
	authDomain: "scores-ba434.firebaseapp.com",
	databaseURL: "https://scores-ba434-default-rtdb.firebaseio.com",
	projectId: "scores-ba434",
	storageBucket: "scores-ba434.appspot.com",
	messagingSenderId: "49489500280",
	appId: "1:49489500280:web:ba94d770db3807e42f758d"
};

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
firebase.initializeApp(devMode ? devFirebaseConfig : firebaseConfig);
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
		code = code.replaceAll("<", "&lt;")
		var complete = text.slice(0, firstIndex) + code + text.slice(lastIndex + separator.length, text.length)
		text = complete
	}

	text = text.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
					.replace(/\*(.*)\*/gim, "<em>$1</em>")
					.replace(/__(.*)__/gim, "<strong>$1</strong>")
					.replace(/_(.*)_/gim, "<em>$1</em>")
					.replace(/^# (.*)/gim, "<h1>$1</h1>")
					.replace(/^## (.*)/gim, "<h2>$1</h2>")
					.replace(/^### (.*)/gim, "<h3>$1</h3>")
					.replace(/^#### (.*)/gim, "<h4>$1</h4>")
					.replace(/^##### (.*)/gim, "<h5>$1</h5>")
					.replace(/^###### (.*)/gim, "<h6>$1</h6>")
					.replace(/!\[(.*)\]\((.*)\)/gim, "<img src='$2' alt='$1'>")
					.replace(/\[(.*)\]\((.*)\)/gim, "<a href='$2'>$1</a>")
					.replace(/~~(.*)~~/gim, "<s>$1</s>")
					.replace(/\s{5}$/gim, "<br>")
					.replace(/\n\n/gim, "<br>")
					.replace(/(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/, "<a href=\"$1\">$1</a>")

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
		if (!dates.includes(allMessages[keys[i]].fullDate)) {
			dates.push(allMessages[keys[i]].fullDate)

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
			newUl.className = allMessages[keys[i]].fullDate.replaceAll(" ", "_")
			document.getElementById("calendar").appendChild(newDetails)
			// document.getElementById(allMessages[keys[i]].date).appendChild(newSummary)
			// document.getElementById(allMessages[keys[i]].date).appendChild(newUl)
			newDetails.appendChild(newSummary)
			newDetails.appendChild(newUl)
		}
	}

	for (var i = 0; i < keys.length; i++) {
		var newLi = document.createElement("li");
		var name = "<div class='user+time'><span class='user' onclick='addUserTextarea(this)'>" + allMessages[keys[i]].sender + "</span>"
		var time = "<span class='time'>" + allMessages[keys[i]].time + "</span></div>"
		var content = "<div class='content'>" + rot13(allMessages[keys[i]].content).trim() + "</div>"
		newLi.innerHTML = name + time + content.replace(/\n/g, "<br>");
		document.getElementsByClassName(allMessages[keys[i]].fullDate.replaceAll(" ", "_"))[0].appendChild(newLi)
	}
}

function errData(err) {
	console.error(err);
}

function addUserTextarea(object) {
	document.getElementById("textBox").value += "@" + object.textContent + " ";
	document.getElementById("textBox").focus()
}

let keys = {
	shift: false,
	enter: false
}
let input = document.getElementById("textBox")
let button = document.getElementById("submit");
input.addEventListener("keydown", function(event) {
	if (event.keyCode === 16) {
		// event.preventDefault();
		keys.shift = true
	}
	else if (event.keyCode === 13) {
		// event.preventDefault();
		keys.enter = true;
	}
	if (keys.shift && keys.enter) {
		event.preventDefault()
		button.click();
		keys.enter = false;
		keys.shift = false;
	}
});
input.addEventListener("keyup", event => {
	if (event.keyCode === 16) {
		// event.preventDefault();
		keys.shift = false
	}
	else if (event.keyCode === 13) {
		// event.preventDefault();
		keys.enter = false
	}
});
