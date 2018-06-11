chrome.browserAction.onClicked.addListener(function(tab) {
  //var manager_url = chrome.extension.getURL("main.html");
  //focusOrCreateTab(manager_url);
  connect();
});

// 建立native messaging host之间的通讯。
var port = null;
var hostName = "com.accesswebcompany.accessweb";
function connect() {
  alert("connect in background.js");
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

//
function sendNativeMessage() {
  alert("native messaging host sendNativeMessage in host.js");
  message = {
    "text": document.getElementById('input-text').value
  };
  port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

//接收native host消息
function onNativeMessage(message) {
  alert("onNativeMessage in background.js");
  console.log("onNativeMessage=>" + JSON.stringify(message));
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      data: JSON.stringify(message)
    }, function(response) {
      console.log(JSON.stringify(message));
    });
  });
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
      if (details.requestHeaders[i].name === 'user') {
        exists = true;
        details.requestHeaders[i].value = 'justin';
        break;
      }
    }
    if (!exists) {//不存在就添加
      details.requestHeaders.push({ name: 'user', value: 'justin'});
    }

    exists = false;
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'mid') {
        exists = true;
        details.requestHeaders[i].value = '987654321';
        break;
      }
    }
    if (!exists) {//不存在就添加
      details.requestHeaders.push({ name: 'mid', value: '987654321'});
    }

    exists = false;
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'randomcode') {
        exists = true;
        details.requestHeaders[i].value = '123456';
        break;
      }
    }
    if (!exists) {//不存在就添加
      details.requestHeaders.push({ name: 'randomcode', value: '123456'});
    }

    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["<all_urls>"]},
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

    var isValid = true;
    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name === 'valid') {
        isValid = false;
        break;
      }
    }

    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name === 'randomcode') {
        isValid = false;
        var randomcode = details.responseHeaders[i].value;
        //details.url
        break;
      }
    }

    return {responseHeaders : details.responseHeaders};
  },
  {urls: ["<all_urls>"]},
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
