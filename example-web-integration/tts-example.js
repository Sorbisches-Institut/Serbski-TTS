var elements;
var read_counter;
var isPlaying = false;
var isMuted = false;
var text_language;

function sendTranslation() {

	text_to_translate = elements[read_counter].textContent.trim();
	
	if (text_to_translate) {
			elements[read_counter].classList.add("readerFocus");
    	console.log(text_to_translate);
    	dynamicText = encodeURIComponent(text_to_translate);

    	url = 'https://tts-juro-matej.serbski-institut.de/marytts/process?INPUT_TEXT='+dynamicText+'&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&AUDIO=WAVE_FILE&LOCALE='+text_language;
    	console.log(url);
        var audioDestination = document.getElementById("audioDestination");
        while (audioDestination.childNodes.length > 0) {
        	audioDestination.removeChild(audioDestination.firstChild);
        }
        
        mimeType = "audio/wav"; // for some reason Chrome likes this better
        var audioTag = document.createElement('audio');
		if(! audioTag.canPlayType || audioTag.canPlayType(mimeType)=="no" || audioTag.canPlayType(mimeType)=="") {
			alert("cannot use audio tag for "+mimeType);
	        audioDestination.innerHTML = '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '
	          + ' codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="200" height="16">'
	          + '<param name="src" value="' + url + '" />'
			  + '<param name="controller" value="true" />'
			  + '<param name="qtsrcdontusebrowser" value="true" />'
			  + '<param name="autoplay" value="true" />'
			  + '<param name="autostart" value="1" />'
			  + '<param name="pluginspage" value="http://www.apple.com/quicktime/download/" />\n'
			  + '<!--[if !IE]> <-->\n'
			  + '<object data="'+url+'" width="200" height="16">'
			  + '<param name="src" value="' + url + '" />'
			  + '<param name="controller" value="true" />'
			  + '<param name="autoplay" value="true" />'
			  + '<param name="autostart" value="1" />'
			  + '<param name="pluginurl" value="http://www.apple.com/quicktime/download/" />'
		      + '</object>\n'
			  + '<!--> <![endif]-->\n'
			  + '</object>';
		} else {
	        audioDestination.innerHTML = '<audio id="serbskiAudio" src="' + url + '" autoplay>'
			  + '</audio>';
		}
	
		aud = document.getElementById("serbskiAudio");

		aud.onplaying = function() {
			$("#button_translate_play_pause").html('<i class="fas fa-pause-circle"></i>');
  			isPlaying = true;
		};
		aud.onpause = function() {
			$("#button_translate_play_pause").html('<i class="fas fa-play-circle"></i>');
  			isPlaying = false;
		};

		aud.onended = function() {
			if (read_counter < elements.length) {
			// if (read_counter < 5) {
				elements[read_counter].classList.remove("readerFocus");
				read_counter++;
				sendTranslation(text_language);
			}
		}
	}
	else {
		if (read_counter < elements.length) {
			read_counter++;
			sendTranslation();
		}
	}
}

function translateSerbskiPrev() {
	elements[read_counter].classList.remove("readerFocus");
	read_counter--;
	sendTranslation();
}

function translateSerbskiNext() {
	elements[read_counter].classList.remove("readerFocus");
	read_counter++;
	sendTranslation();
}

function translateSerbski(language) {

	if (language === undefined) {
		text_language = 'hsb';
	}
	else {
		text_language = language;
	}

	elements = document.getElementById('page-content-main').querySelectorAll('h1, h2, h3, h4, h5, p, span, li');
	elements_array = Array.from(elements).map(el => el.textContent.trim());
	console.log(elements.length);

	elements.forEach(function(item){
		item.classList.remove("readerFocus");
	});

	read_counter = 0;
	sendTranslation(text_language);

	text_complete = elements_array.join(' ');
	dynamicText = encodeURIComponent(text_complete);

    url = 'https://tts-juro-matej.serbski-institut.de/marytts/process?INPUT_TEXT='+dynamicText+'&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&AUDIO=WAVE_FILE&LOCALE='+text_language;
		$("#button_translate_download").attr("onclick","window.open('"+url+"','_blank')");

	document.getElementById("textToSpeech").style.display = 'block';
}

function closeTranslateSerbski() {
	var audioDestination = document.getElementById("audioDestination");
    while (audioDestination.childNodes.length > 0) {
    	audioDestination.removeChild(audioDestination.firstChild);
    }
    read_counter = 0;
    document.getElementById("textToSpeech").style.display = 'none';

    elements.forEach(function(item){
			item.classList.remove("readerFocus");
		});
}

function toggleTranslatePlay() {
  isPlaying ? document.getElementById("serbskiAudio").pause() : document.getElementById("serbskiAudio").play();
};

function toggleTranslateMute() {
	if (document.getElementById("serbskiAudio").muted == false) {
		document.getElementById("serbskiAudio").muted = true;
		$("#button_translate_mute").html('<i class="fas fa-volume-mute"></i>');
	}
	else {
		document.getElementById("serbskiAudio").muted = false;
		$("#button_translate_mute").html('<i class="fas fa-volume-up"></i>');
	}
}

$(function() {
	jQuery( "#playerTextToSpeech" ).draggable();
});