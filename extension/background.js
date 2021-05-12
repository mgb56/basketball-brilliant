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

// function dfs(node, captions) {
//   if (node.children.length === 0) {
//     if (node.innerHTML) {
//       // console.log(node.innerHTML);
//       captions.push(node.innerHTML);
//       return;
//     }
//   }
//   for (var i = 0; i < node.children.length; i++) {
//     dfs(node.children[i], captions);
//   }
//   return captions;
// }

// function createWindow(prev, curr) {
//   var crossSize = 10;
//   if (curr.length < crossSize) {
//     crossSize = curr.length;
//   }

//   var prevCrossIndex = prev.lastIndexOf(curr.substring(0, crossSize));
//   if (prevCrossIndex == -1) {
//     return prev + " " + curr;
//   }
//   return prev.substring(0, prevCrossIndex - 1) + " " + curr;
// }

// var phrases = [
//   "in the",
//   "to the",
//   "on the",
//   "of the",
//   "you",
//   "me",
//   "triple double",
// ];
// var prevSegment = null;
// var numSegments = 0;

// function processResponse(textResponse) {
//   let startIndex = textResponse.indexOf("timedtext");
//   if (startIndex === -1) return;

//   numSegments += 1;

//   // console.log(startIndex);
//   // console.log(textResponse.substring(startIndex - 10, startIndex + 10));

//   var timedText = textResponse.substring(
//     startIndex - 1,
//     textResponse.length - 1
//   );
//   // console.log(timedText);
//   var parser = new DOMParser();
//   var html = parser.parseFromString(timedText, "text/html");
//   // console.log(html);

//   var body = html.querySelector("timedtext");
//   // console.log(body);

//   var captions = [];
//   captions = dfs(body, captions);
//   captions = captions.join("");
//   // console.log(captions);

//   // store in an array all the words of the caption
//   captions = captions.split(/\s+/);
//   // console.log(captions);

//   captions = captions.map((word) =>
//     word.toLowerCase().replace(/[.,!?\\-]/, "")
//   );

//   captions = captions.join(" ");
//   console.log("captions:", captions);

//   if (numSegments == 1) {
//     prevSegment = captions;
//     return;
//   }

//   var window = createWindow(prevSegment, captions);
//   console.log("window:", window);
//   var matches = [];
//   for (var phrase of phrases) {
//     // check if there's a space after phrase or it's the end of the window
//     var index = window.search(phrase);
//     if (
//       index !== -1 &&
//       (index + phrase.length == window.length ||
//         window[index + phrase.length] == " ") &&
//       !matches.includes(phrase)
//     )
//       matches.push(phrase);
//   }

//   prevSegment = captions;

//   return matches;
// }

var linkMap = {};
var moreInfo = " (click for more info!)";

chrome.runtime.onMessage.addListener((data) => {
  if (data.type === "notification") {
    chrome.notifications.create("", data.options, function (notifID) {
      var title = data.options.title.replace(moreInfo, "");
      console.log(title + "notification sent");
      linkMap[notifID] = title;
    });
  }
});

chrome.notifications.onClicked.addListener(function (notifID) {
  chrome.tabs.create({
    url: chrome.extension.getURL("tab.html#" + linkMap[notifID]),
  });
});

// let numRequests = 0;
// let prevRequest = null;
// let prevMatches = null;
// chrome.webRequest.onBeforeRequest.addListener(
//   function (info) {
//     if (numRequests > 20 || prevRequest == info.url) return;

//     // console.log(info.url);
//     numRequests += 1;
//     prevRequest = info.url;

//     fetch(info.url, {
//       method: "GET",
//     })
//       .then((response) => response.text())
//       .then((textResponse) => {
//         // console.log(textResponse);
//         var matches = processResponse(textResponse);
//         // console.log("prevMatches:", prevMatches);
//         // console.log("matches:", matches);

//         // TODO: detects phrase multiple times when the phrase is part of >=3 segments
//         //  simplest way is probably to look at the overlap of caption segments and
//         //  set a timer on each matched phrase to prevent it from being detected for a certain num of segs
//         //
//         //  or, make the window only include from the last few words in prev, instead of the whole thing
//         if (prevMatches && matches)
//           matches = matches.filter((e) => !prevMatches.includes(e));

//         prevMatches = matches;

//         if (matches.length > 0) {
//           for (var match of matches) {
//             chrome.notifications.create(
//               "",
//               {
//                 title: match,
//                 message: match + " info",
//                 iconUrl: "images/logo.png",
//                 type: "basic",
//               }
//               // () => console.log(match + "notification sent")zs
//             );
//           }

//           // Foreground is necessary to make sure the livestream tab is active

//           // chrome.tabs.query(
//           //   { active: true, currentWindow: true },
//           //   function (tabs) {
//           //     chrome.tabs.sendMessage(
//           //       tabs[0].id,
//           //       { matches: matches },
//           //       function (response) {
//           //         console.log(response.ack);
//           //         chrome.notifications.create(
//           //           "",
//           //           {
//           //             title: "Test",
//           //             message: "This is a test message",
//           //             iconUrl: "images/get_started16.png",
//           //             type: "basic",
//           //           },
//           //           () => console.log("notification sent")
//           //         );
//           //       }
//           //     );
//           //   }
//           // );
//         } else return;
//         // console.log("no matches");
//       })
//       .catch((err) => console.log(err));
//   },
//   {
//     urls: ["https://*.googlevideo.com/videoplayback*mime=text*"],
//   }
// );

// use chrome.tabs.sendMessage to send identified phrases to foreground
// use chrome.runtime.onMessage to receive phrase in foreground

// chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
//   // receive url from foreground and fetch data
//   // fetch(request.url, {
//   //   method: "GET",
//   //   // headers: { "Content-type": "application/json; charset=UTF-8" }
//   // })
//   //   .then((response) => response.json())
//   //   .then((jsonResponse) => {
//   //     console.log(jsonResponse);
//   //     // call method to process html and add to sliding window
//   //     // when phrase detected, send phrase to foreground

//   //     sendResponse({ translatedText: jsonResponse });
//   //   })
//   //   .catch((err) => console.log(err));

//   sendResponse({
//     bg: request.fg + " from background",
//   });
//   return true; // to prevent message port from being closed
// });
