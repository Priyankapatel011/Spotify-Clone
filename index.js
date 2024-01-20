let currentSong = new Audio();
let songs;

function secToMinSec(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "00 : 00";
    }

    const minutes = Math.floor(seconds / 60);
    // const remainingSeconds = seconds - minutes*60;
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes} : ${formattedSeconds}`;

}


async function getSongs() {
    let a = await fetch('http://127.0.0.1:3000/SPOTIFY-PROJECT%F0%9F%98%80/songs/');
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let at = div.getElementsByTagName("a");  // array of anchor tags
    
    let songs = [];
    for (let index = 0; index < at.length; index++) {
        const element = at[index]; // <a href="">
        if(element.href.endsWith(".mp3")){
            // songs.push(element.href);
            songs.push(element.href.split("/songs/")[1])
        }
    }
    // console.log(songs);
    return songs;

}

const playMusic = (track, pause = false) => {  // by default
    
    currentSong.src = "songs/" + track;
    // currentSong.play();

    if(!pause){
        currentSong.play();
        player.src = "pause.svg";
    }


    let songinfo = document.querySelector(".songinfo");
    songinfo.innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    // if (!currentSong.paused) {
    //     currentSong.pause();
    //     currentSong.currentTime = 0;
    // }

    // let audio = new Audio("/songs/" + track);
    // console.log(audio);
    // audio.play().then(() => {
    //     console.log("Audio is playing:", audio.src);
    // })
    // .catch((error) => {
    //     console.error("Error playing audio:", error);
    // });
}


async function main() {

    //get the list of all the songs
    songs = await getSongs();
    // console.log(songs);
    
    playMusic(songs[0], true);
    
    //show all the songs in the playlist
    let songList = document.querySelector(".song-list");
    let ul = songList.getElementsByTagName("ul")[0];
    
    for (const song of songs) {
        // ul.innerHTML = ul.innerHTML + song;
        // ul.innerHTML = ul.innerHTML + `<li> ${song} </li>`;
        //if 20% --> remove
        // ul.innerHTML = ul.innerHTML + `<li> ${song.replaceAll("%", " ")} </li>`

        ul.innerHTML = ul.innerHTML + `<li> 
                                            <img src="music.svg" alt="music" class="invert">
                                            <div class="info">
                                                <div class="info">${song.replaceAll("%", "-")}</div>
                                                <div class="info">XYZW</div>
                                            </div>
                                            <div class="playnow">
                                                <span>Play now</span>
                                                <img src="playnow.svg" alt="play" class="invert">
                                            </div>
                                    </li>`
    }

    //play our first song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime); 
    // });


    //attach an event listener to each song
    li = songList.getElementsByTagName("li");
    Array.from(li).forEach(e => {
        // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());

        
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

    //attach an event listener to play the player

    player.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index);

        if(currentSong.paused){
            currentSong.play();
            player.src = "pause.svg";
        }
        else{
            currentSong.pause();
            player.src = "player.svg";
        }
    })


    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secToMinSec(currentSong.currentTime)} / ${secToMinSec(currentSong.duration)}`;

        //seekbar change
        document.querySelector(".circle").style.left = (currentSong.currentTime /currentSong.duration) * 100 + "%";
    })


    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e.target.getBoundingClientRect().width, e.offsetX);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //add an event listener for cross
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })


    // add event listener to prev
    prev.addEventListener("click", () => {
        currentSong.pause();

        // console.log("Prev Clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index-1 >= 0){
            console.log(songs, (index-1)%(songs.length));
        }
        else{
            //index-1 < 0
            console.log(songs, songs.length-1);
        }

        if((index-1) >= 0){
            playMusic(songs[index - 1]);
        }
        else{
            // curr song is at first
            playMusic(songs[songs.length - 1]);
        }


    })

    // add event listener to next
    next.addEventListener("click", () => {
        currentSong.pause();

        // console.log("next Clicked");
        // console.log(currentSong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, (index+1)%(songs.length));

        if((index+1) < songs.length){
            playMusic(songs[index + 1]);
        }
        else{
            // curr song is at last
            playMusic(songs[0]);
        }

    })
}

main();