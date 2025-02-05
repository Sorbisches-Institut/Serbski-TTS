// Funktion zur Filterung von leeren Elementen
function cleanElements(elements_list) {
    let elements_clean = [];
    
    elements_list.forEach(el => {
        // Überprüfe, ob das Element Textinhalt hat (auch bei span, h1, etc.)
        const text = el.innerText.trim();
        
        // Wenn Text vorhanden ist, füge das Element zum Array hinzu
        if (text) {
            elements_clean.push(el);
        }
    });
    
    return elements_clean;
}

if (!window.serbskiTTSInitialized) {
    let elements_list = [];
    let read_counter = 0;
    let isPlaying = false;
	let selectedLanguage = 'hsb'; // Standardwert, falls keine Sprache ausgewählt wurde

    function sendText() {
    console.log("Lesen: ", read_counter, " von ", elements_list.length); // Debugging-Ausgabe
    const currentElement = elements_list[read_counter];
    
    if (!currentElement) {
        console.error("Kein Element gefunden für index: ", read_counter);
        return; // Falls kein Element gefunden wird, die Funktion stoppen
    }

    const text_to_speech = currentElement.textContent.trim();
    console.log("Text zum Vorlesen: ", text_to_speech); // Debugging-Ausgabe
    
    if (!text_to_speech) {
        console.log("Kein Text zum Vorlesen, überspringe...");
        return; // Wenn kein Text vorhanden, überspringen
    }

    // Entferne Hervorhebung von vorherigem Element
    elements_list.forEach(el => el.classList.remove("readerFocus"));

    // Füge die Hervorhebung zum aktuellen Element hinzu
    currentElement.classList.add("readerFocus");

    const dynamicText = encodeURIComponent(text_to_speech);
    console.log(`Text: ${dynamicText}`);
    
    const url = `https://tts-juro-matej.serbski-institut.de/marytts/process?INPUT_TEXT=${dynamicText}&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&AUDIO=WAVE_FILE&LOCALE=${selectedLanguage}`;

    const existingAudio = document.getElementById("serbskiAudio");
    if (existingAudio) existingAudio.remove(); // Entferne bestehende Audio-Tags

    const audio = new Audio(url);
    audio.id = "serbskiAudio";
    document.body.appendChild(audio);

    audio.onplaying = () => {
        isPlaying = true;
        chrome.runtime.sendMessage({ action: "updateStatus", playing: true });
    };

    audio.onpause = () => {
        isPlaying = false;
        chrome.runtime.sendMessage({ action: "updateStatus", playing: false });
    };

    audio.onended = () => {
        // Entferne die Hervorhebung, wenn das aktuelle Element fertig ist
        currentElement.classList.remove("readerFocus");

        if (read_counter < elements_list.length - 1) {
            read_counter++;
            sendText(); // Rekursiv das nächste Element vorlesen
        } else {
            audio.remove();
        }
    };

    audio.play();
	}


    function initTTS() {
    // Suche nur Elemente innerhalb des Hauptinhalts
    const mainContent = document.querySelector('main, #content, .content, .main-content, #article, .article, .content-area, .post-content, #m-content, .node-content .field--name-body #t3-content');
    if (!mainContent) {
        alert("Der Hauptinhalt konnte nicht gefunden werden.");
        return;
    }

    // Filtere nur relevante Text-Inhalte
    let elementsFound = mainContent.querySelectorAll('h1, h2, h3, h4, h5, p, span, li');

    // Entferne leere Elemente
    elementsFound = cleanElements(elementsFound);

    // Debugging: Ausgeben der Elemente, die gefunden wurden
    console.log("Gefundene Elemente:", elementsFound);

    // Setze den Zähler zurück
    read_counter = 0;

    // Stelle sicher, dass Elemente vorhanden sind
    if (elementsFound.length === 0) {
        alert("Keine lesbaren Inhalte im Hauptbereich gefunden.");
        return;
    }
	
	// Aktualisiere global die `elements_list`-Liste
    elements_list = elementsFound;

	
    // Entferne alte Hervorhebungen
    elements_list.forEach(el => el.classList.remove("readerFocus"));

    // Starte die Text-to-Speech Funktion
    sendText();
    }


    // Nachrichten vom Popup empfangen
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "startTTS") {
			selectedLanguage = message.language || 'hsb';
            console.log('Sprache ausgewählt:', selectedLanguage);
            initTTS();
        } else if (message.action === "playPauseTTS") {
            const audio = document.getElementById("serbskiAudio");
            if (audio) isPlaying ? audio.pause() : audio.play();
        } else if (message.action === "nextTTS") {
            const audio = document.getElementById("serbskiAudio");
            if (audio) audio.pause(); // Stop current audio
            elements_list[read_counter].classList.remove("readerFocus");
            read_counter++;
            if (read_counter < elements_list.length) {
                sendText();
            }
        } else if (message.action === "prevTTS") {
            const audio = document.getElementById("serbskiAudio");
            if (audio) audio.pause(); // Stop current audio
            elements_list[read_counter].classList.remove("readerFocus");
            read_counter--;
            if (read_counter >= 0) {
                sendText();
            }
		}
    });

    // Markiere das Skript als initialisiert
    window.serbskiTTSInitialized = true;
}
