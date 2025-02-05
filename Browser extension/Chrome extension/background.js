chrome.runtime.onInstalled.addListener(() => {
    console.log("Serbski Text-to-Speech Erweiterung installiert.");
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // if (message.action === "updateStatus") {
        // console.log("TTS Status aktualisiert:", message.playing ? "Abspielen" : "Pause");
    // } else if (message.action === "updateMute") {
        // console.log("TTS Mute-Status aktualisiert:", message.muted ? "Stummgeschaltet" : "Nicht stummgeschaltet");
    // }
// });
