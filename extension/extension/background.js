// Inject foreground.js when the url is valid, includes "espn", and the web page has finished initializing and loading
chrome.webNavigation.onCompleted.addListener((tab) => {
  if (tab.frameId == 0) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var url = activeTab.url;
      var expression =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
      var regex = new RegExp(expression);

      if (url && url.match(regex) && url.match(/espn/)) {
        chrome.tabs.executeScript(
          null,
          { file: "./foreground.js" },
          function () {
            console.log("i injected");
          }
        );
      }
    });
  }
});

// To keep track of notifications
var linkMap = {};
var moreInfo = " (click for more info!)";

// When foreground.js has detected a match, it will send a message with the matched phrase.
// Here the notification is created.
chrome.runtime.onMessage.addListener((data) => {
  if (data.type === "notification") {
    chrome.notifications.create("", data.options, function (notifID) {
      var title = data.options.title.replace(moreInfo, "");
      console.log(title + "notification sent");
      linkMap[notifID] = title;
    });
  }
});

// Register an onclick for the notification to open an info page
chrome.notifications.onClicked.addListener(function (notifID) {
  chrome.tabs.create({
    url: chrome.extension.getURL("tab.html#" + linkMap[notifID]),
  });
});
