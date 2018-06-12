chrome.browserAction.onClicked.addListener(function(tab) {
  //var manager_url = chrome.extension.getURL("main.html");
  //focusOrCreateTab(manager_url);
  connect();
});

// 建立native messaging host之间的通讯。
var port = null;
var hostName = "com.accesswebcompany.accessweb";

function connect() {
  alert("Connecting to native messaging host " + hostName + "in background.js");
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

//向native messaging host之间的发消息
function sendNativeMessage(message) {
  alert("sendNativeMessage in background.js");
  console.log("sendNativeMessage in background.js");
  port.postMessage(message);
}

var requestUrl;
var requestUrlCount = 0;

function sendRequest(requestUrl_host) {
  if (requestUrl_host === requestUrl) {
    if (requestUrlCount <= 5) {
      requestUrlCount++;
      var xhr = new XMLHttpRequest();
      //xhr.open("GET", requestUrl, true);
      xhr.open("GET", requestUrl_host, true);

      console.log(requestUrl + "  sendRequest  in background.js");
      //xhr.onreadystatechange = function() {
      //};
      xhr.send();
    } else {
        requestUrlCount = 0;
    }
  }
}

//接收native host消息
function onNativeMessage(message) {
  alert("onNativeMessage in background.js");
  console.log("onNativeMessage=>" + JSON.stringify(message));
  sendRequest(message);
}

function onDisconnected() {
  alert("native messaging host onDisconnected in host.js");
  appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  //updateUiState();
}
//重定向请求
/*
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    alert("chrome.webRequest.onBeforeRequest.addListener in background.js");
    alert(details.url);
    details.url = "http://192.168.1.174:8000/agent_authority";
    return {redirectUrl : details.url};
  },
  //{urls: ["<all_urls>"]},
  {urls: [
    "http://192.168.1.174:8000/service"
    //"main_frame",
    //"sub_frame",
    //"stylesheet",
    //"script",
    //"image",
    //"object",
    //"xmlhttprequest",
    //"other"
    ]},
  ["blocking"]);
*/

var isNewRequset = true;
var randomcode = "123";
//修改request请求http header
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    //alert("chrome.webRequest.onBeforeSendHeaders.addListener in background.js");
    //alert(details.url);
    console.log("chrome.webRequest.onBeforeSendHeaders.addListener in background.js");
    console.log(details.url);
    //if (details.url !== "http://192.168.1.174:8000/agent_authority")
    //{
    //  return {requestHeaders: details.requestHeaders};
    //}
    var exists = false;
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name.toLowerCase() === 'user') {
        exists = true;
        details.requestHeaders[i].value = 'justin';
        break;
      }
    }
    if (!exists) { //不存在就添加
      details.requestHeaders.push({
        name: 'user',
        value: 'justin'
      });
    }

    exists = false;
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name.toLowerCase() === 'mid') {
        exists = true;
        details.requestHeaders[i].value = '987654321';
        break;
      }
    }
    if (!exists) { //不存在就添加
      details.requestHeaders.push({
        name: 'mid',
        value: '987654321'
      });
    }

    if (isNewRequset) {
      randomcode = '123';
    }

    exists = false;
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name.toLowerCase() === 'randomcode') {
        exists = true;
        details.requestHeaders[i].value = randomcode;
        break;
      }
    }
    if (!exists) { //不存在就添加
      details.requestHeaders.push({
        name: 'randomcode',
        value: randomcode
      });
    }

    return {
      requestHeaders: details.requestHeaders
    };
  }, {
    urls: ["<all_urls>"]
  },
  //{urls: [
  //"http://192.168.1.174:8000/agent_authority"
  //"main_frame",
  //"sub_frame",
  //"stylesheet",
  //"script",
  //"image",
  //"object",
  //"xmlhttprequest",
  //"other"
  //]},
  ["blocking", "requestHeaders"]);

//校验请求有效性
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    //alert("chrome.webRequest.onHeadersReceived.addListener in background.js");
    //alert(details.url);
    console.log("chrome.webRequest.onHeadersReceived.addListener in background.js");
    console.log(details.url);
    requestUrl = "";
    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase() === 'randomcode') {
        randomcode = details.responseHeaders[i].value;
        console.log(randomcode);
        requestUrl = details.url;
        console.log(requestUrl + " randomcode chrome.webRequest.onHeadersReceived in background.js");
        sendNativeMessage(randomcode);
        //return {cancel: true};
        break;
      }
    }

    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase() === 'vaild') {
        var vaild = details.responseHeaders[i].value;
        console.log(vaild);
        console.log(requestUrl + "  vaild  chrome.webRequest.onHeadersReceived in background.js");
        isNewRequset = true;
        return {
          cancel: true
        };
        break;
      }
    }
    requestUrl = details.url;
    sendNativeMessage(requestUrl);
    return {
      cancel: true
    };
    isNewRequset = false;
    return {
      responseHeaders: details.responseHeaders
    };
  }, {
    urls: ["<all_urls>"]
  },
  //{urls: [
  //"http://192.168.1.174:8000/service"
  //"main_frame",
  //"sub_frame",
  //"stylesheet",
  //"script",
  //"image",
  //"object",
  //"xmlhttprequest",
  //"other"
  //]},
  ["blocking", "responseHeaders"]);