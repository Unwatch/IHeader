(function() {
  var prefix = '[HTTP]:';
  var log = [
    prefix + '进入网络监听模式',
    prefix + '退出网络监听模式'
  ];
  Message.on('Listening', function(data, sender, cb){
    alert("Listening in content.js");
    console.warn(log[0]);
  });
  Message.on('ListeningCancel', function(data, sender, cb){
    alert("ListeningCancel in content.js");
    console.warn(log[1]);
  });
  window.addEventListener('beforeunload',function(){
    alert("beforeunload in content.js");
    Message.send('beforeunload');
  });
  Message.send('pageInit');
})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  alert("chrome.runtime.onMessage.addListener in content.js");
  if (request.data != null) {
    alert("chrome.runtime.onMessage.addListener in content.js");
    console.log("get response from extension" + request.data);
    appendMessage("get response from extension" + request.data);

    console.log("create custom event");
    var evt = new CustomEvent('Event');
    evt.initCustomEvent('customEvent', true, true, {
      'data': request.data
    });
    console.log("fire custom event");
    document.getElementById('response_div_id').dispatchEvent(evt)
  }
});