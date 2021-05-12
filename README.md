# basketball-brilliant

Basketball Brilliant is a Chrome extension that allows viewers to learn basketball jargon while watching live games. Check it out [here](https://chrome.google.com/webstore/detail/basketball-brilliant/elpojhmkjmomlcmccbchnhpjdpfoopfe)!

It works by extracting captions from livestreams and searching the captions for key phrases. Originally, the plan was to do phrase detection through the live commentator audio, and efforts toward this phrase detection are also included here.

extension/ includes all the files used to create the Chrome extension.

Inside extension/:

- background.\* is the background page that waits for browser actions
- foreground.js is the content script injected onto the live stream web page
- tab.\* is the info page
- manifest.json is the config file for the extension
- images/ includes the logo in different sizes

phrase_detection/ includes some of the files used to experiment with different speech-to-text and wake word detection engines.

[DeepSpeech](https://github.com/mozilla/DeepSpeech) and [Pocketsphinx](https://github.com/cmusphinx/pocketsphinx) are both speech recognition engines that have speech-to-text capabilities. Experiments on the transcription of NBA game audio can be found in phrase_detection/phrase_detection_services. The models used can be downloaded from their respective repo's.

[Picovoice](https://picovoice.ai) and [Snowboy](https://github.com/seasalt-ai/snowboy) are wake word detection engines. Picvoice models can be created through its Porcupine console, and Snowboy models can be created by following instructions on its repo. Some example Picovoice models for common basketball phrases can be found in phrase_detection/models/picovoice/.

To try out these experiments, install the dependencies with: `pip install -r requirements.txt`. Then follow the directions listed in the repo.
