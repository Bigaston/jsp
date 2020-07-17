const CORS_PROXY = "https://cors.bigaston.dev/"
const WIDGET_HOST = "https://jsp.bigaston.dev/w/v1/w.html";

let ep_title;
let pod_title;
let ep_img;
let audio_url;
let ep_duration;

let ep_tab = [];
let select_ep = document.getElementById('episode')
let result = document.getElementById("result")

function fetchFeed() {
    let parser = new RSSParser();

    parser.parseURL(CORS_PROXY + document.getElementById("rss_url").value, function(err, feed) {
        if (err) throw err;

        let feed_img = feed.image.url;

        select_ep.innerHTML = "";
        pod_title = feed.title;

        feed.items.forEach((entry, index) => {
			if (entry.enclosure == undefined) return;

            let ep_obj = {
                title: entry.title,
                audio_url: entry.enclosure.url,
				img: entry.itunes.image != undefined ? entry.itunes.image : feed_img,
				duration: entry.itunes.duration
            }

            let option = document.createElement("option");
            option.text = ep_obj.title;
            option.value = index;
            select_ep.add(option);

            ep_tab.push(ep_obj);
        })

        document.getElementById("div_episode").style.display = "block";
    })
}

function generatePlayer() {
    let selected_ep = ep_tab[select_ep.value];

    ep_title = selected_ep.title;
    audio_url = selected_ep.audio_url;
	ep_img = selected_ep.img;
	ep_duration = selected_ep.duration;

    let param = new URLSearchParams();
    param.append("ep_title", ep_title);
    param.append("pod_title", pod_title);
    param.append("ep_img", ep_img);
	param.append("audio_url", audio_url);
    param.append("ep_duration", ep_duration);
    param.append("bar_color", document.getElementById("bar_color").value)
	param.append("control_color", document.getElementById("control_color").value)
	
    let encoded = btoa(param.toString());

    let widget = `<iframe width="100%" height="120" src="${WIDGET_HOST}#${encoded}" style="border: none;"></iframe>`

    document.getElementById("div_result").style.display = "block";

    result.value = widget;
    document.getElementById("display").innerHTML = widget;
}

document.getElementById("result").addEventListener("click", (e) => {
    result.select();
    document.execCommand('copy');

    Toastify({
        text: "Widget copié dans votre presse papier!",
        duration: 1500, 
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: 'center',
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
})
