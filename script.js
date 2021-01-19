function rot13(str) {
	var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
	var index     = x => input.indexOf(x);
	var translate = x => index(x) > -1 ? output[index(x)] : x;
	return str.split('').map(translate).join('');
}

var firebaseConfig = {
	apiKey: "AIzaSyBhIbcYDG4g1cG3PUf_pGSPMsx7rvYLu88",
	authDomain: "scores-ba434.firebaseapp.com",
	databaseURL: "https://scores-ba434-default-rtdb.firebaseio.com",
	projectId: "scores-ba434",
	storageBucket: "scores-ba434.appspot.com",
	messagingSenderId: "49489500280",
	appId: "1:49489500280:web:ba94d770db3807e42f758d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var ref = database.ref("messages");
var allMessages;
var time = new Date()
ref.on("value", readMessages, errData);
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var daysWeek = ["Sunday", "Monday", "Tuesday", "Wensday", "Thursday", "Friday", "Saturday"]
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
	document.getElementById("messages").innerHTML = "";
	document.getElementById("details").innerHTML = ""
	var dates = []
	for (var i = 0; i < keys.length; i++) {
		var date = new Date();
		if (!dates.includes(allMessages[keys[i]].date)) {
			dates.push(allMessages[keys[i]].date)
			var newDetails = document.createElement("details")
			var newSummary = document.createElement("summary")
			var newUl = document.createElement("ul")
			newSummary.textContent = allMessages[keys[i]].fullDate
			newDetails.id = allMessages[keys[i]].date
			var nowDate = daysWeek[date.getDay()] + ", " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
			if (allMessages[keys[i]].fullDate === nowDate) {
				newDetails.open = true
			}
			newUl.className = allMessages[keys[i]].date
			document.getElementById("details").appendChild(newDetails)
			document.getElementById(allMessages[keys[i]].date).appendChild(newSummary)
			document.getElementById(allMessages[keys[i]].date).appendChild(newUl)
		}
	}

	for (var i = 0; i < keys.length; i++) {
		var newPara = document.createElement("p");
		name = "<strong class='user' onclick='addUserTextarea(this)'>" + allMessages[keys[i]].sender + "</strong>:<br>"
		time = "<span class='time'>The " + allMessages[keys[i]].date + "ᵗʰ at " + allMessages[keys[i]].time + "</span>"
		time = "<span class='time'>" + allMessages[keys[i]].time + "</span>"
		content = "<div class='content'>" + rot13(allMessages[keys[i]].content) + "</div><br>"
		newPara.innerHTML = name + content.replace("\n", "<br>") + time;
		document.getElementsByClassName(allMessages[keys[i]].date)[0].appendChild(newPara)
	}
	if (keys.length > 100) {
		let userRef = database.ref('messages/' + keys[keys.length - 1]);
		userRef.remove()
	}
}

function errData(err) {
	console.error(err);
}

function addUserTextarea(object) {
	document.getElementById("textBox").value += "@" + object.textContent + " ";
	document.getElementById("textBox").focus()
}
