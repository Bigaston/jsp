let ep_title;
let pod_title;
let ep_img;
let audio_url;
let ep_duration;
let disp_img;

let duration = document.getElementById("audio-duration");

let playbutton = document.getElementById("play");
playbutton.addEventListener('click', playAudio);

let bar = document.getElementById("progressbar")
bar.addEventListener("click", changeTime);

let player = document.getElementById("audiosound");

player.addEventListener("canplay", () => {
	let durationObj = convertHMS(player.duration)
	duration.innerHTML = durationObj.heure + ":" + durationObj.minute + ":" + durationObj.seconde;

	setInterval(updateTime, 500);
})

document.getElementsByClassName("timeJump")[0].addEventListener("click", jumpTime)
document.getElementsByClassName("timeJump")[1].addEventListener("click", jumpTime)

grabInfo();

function grabInfo() {
    let hash = window.location.hash.substr(1);
    let param = new URLSearchParams(atob(hash))

    ep_title = param.get("ep_title");
    pod_title = param.get("pod_title");
    ep_img = param.get("ep_img");
	audio_url = param.get("audio_url");
    ep_duration = param.get("ep_duration")
    disp_img = param.get("disp_img") == "true" ? true : false;

    document.getElementById("player").style.setProperty("--bar-color", param.get("bar_color"))
    document.getElementById("player").style.setProperty("--control-color", param.get("control_color"))

    initPlayer();
}

function initPlayer() {
    document.getElementById("eptitle").innerHTML = ep_title;
    document.getElementById("podtitle").innerHTML = pod_title + ` <a href="${audio_url}" class="download_link" alt="Télécharger" target="_blank"><i class="fas fa-download"></i></a>`;
    document.getElementById("epimg").src = ep_img;
    document.getElementById("audiosound").src = audio_url;
    
    if (!disp_img) {
        document.getElementById("left").style.display = "none";
    }

	duration.innerHTML = ep_duration;
}

function playAudio() {
    if (playbutton.classList.contains("fa-play-circle")) {
		player.play()
		playbutton.className = "fas fa-pause-circle"
    } else {
		player.pause()
		playbutton.className = "fas fa-play-circle"
	}

	playbutton.addEventListener('click', playAudio);
}

function updateTime() {
    timeText = document.getElementById("audio-time");
    currentTime = convertHMS(player.currentTime)
    timeText.innerHTML = currentTime.heure + ":" + currentTime.minute + ":" + currentTime.seconde;


    duration = document.getElementById("audio-duration");
    durationObj = convertHMS(player.duration)
    duration.innerHTML = durationObj.heure + ":" + durationObj.minute + ":" + durationObj.seconde;

    progress=document.getElementById("prog");

    progress.style = "width:" + Math.trunc((player.currentTime/player.duration)*10000)/100 + "%;"
}

function changeTime(event) {
    if (player.readyState == 4) {
		var percent = event.offsetX / this.offsetWidth;
		player.currentTime = percent * player.duration;
	} else {
		player.play().then(() => {
			player.pause()
			var percent = event.offsetX / this.offsetWidth;
			player.currentTime = percent * player.duration;
		})
	}

}

function convertHMS(pSec) {
    nbSec = pSec;
    sortie = {};
    sortie.heure = Math.trunc(nbSec/3600);
    if (sortie.heure < 10) {sortie.heure = "0"+sortie.heure}

    nbSec = nbSec%3600;
    sortie.minute = Math.trunc(nbSec/60);
    if (sortie.minute < 10) {sortie.minute = "0"+sortie.minute}

    nbSec = nbSec%60;
    sortie.seconde = Math.trunc(nbSec);
    if (sortie.seconde < 10) {sortie.seconde = "0"+sortie.seconde}

    return sortie
}

function jumpTime(event) {
    if (player.readyState == 4) {
		if (event.target.attributes["sens"].value == "+") {
			player.currentTime = player.currentTime + 10
		} else {
			player.currentTime = player.currentTime - 10
		}
	} else {
		player.play().then(() => {
			player.pause()
		})

		if (event.target.attributes["sens"].value == "+") {
			player.currentTime = player.currentTime + 10
		} else {
			player.currentTime = player.currentTime - 10
		}
	}

}

function addZero(val) {
    if (Math.trunc(val) != val) {
    return "" + val;
    } else {
    return "" + val + ".0"
    }
}