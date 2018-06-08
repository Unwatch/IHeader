// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;

var getKeys = function(obj) {
	var keys = [];
	for (var key in obj) {
		keys.push(key);
	}
	return keys;
}


function appendMessage(text) {
	document.getElementById('response').innerHTML += "<p>" + text + "</p>";
}

function updateUiState() {
	if (port) {
		document.getElementById('connect-button').style.display = 'none';
		document.getElementById('input-text').style.display = 'block';
		document.getElementById('send-message-button').style.display = 'block';
	} else {
		document.getElementById('connect-button').style.display = 'block';
		document.getElementById('input-text').style.display = 'none';
		document.getElementById('send-message-button').style.display = 'none';
	}
}

function onNativeMessage(message) {
	alert("native messaging host onNativeMessage in host.js");
	appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
	alert("native messaging host onDisconnected in host.js");
	appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
	port = null;
	updateUiState();
}

function connect() {
	alert("native messaging host connect in host.js");
	var hostName = "com.accesswebcompany.accessweb";
	appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
	port = chrome.runtime.connectNative(hostName);
	port.onMessage.addListener(onNativeMessage);
	port.onDisconnect.addListener(onDisconnected);
	updateUiState();
}

function sendNativeMessage() {
	alert("native messaging host sendNativeMessage in host.js");
	message = {
		"text": document.getElementById('input-text').value
	};
	port.postMessage(message);
	appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

document.addEventListener('DOMContentLoaded', function() {
	alert("native messaging host addEventListener in host.js");
	document.getElementById('connect-button').addEventListener(
		'click', connect);
	document.getElementById('send-message-button').addEventListener(
		'click', sendNativeMessage);
	updateUiState();
});