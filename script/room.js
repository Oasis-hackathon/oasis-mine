let popular_datas;

$.ajax({
    url: '/chart',
    success: function (data) {
        console.log(data);
        
        popular_datas = data;

        const tab_popular = document.getElementById("tab_popular");
        const tab_reservation = document.getElementById("tab_reservation");
        let videoStatus = false;
        
        let listEl = document.getElementById('popular_list'),
            fragment = document.createDocumentFragment();
        
        for (let i = 0; i < popular_datas.length; i++) {
            data = popular_datas[i];
            let itemEl = getListItem(data.chartrank, data.title, data.artist);
            let reserveEl = document.getElementById('reserve_list'),
                reserveFragment = document.createDocumentFragment();
        
            (function (title, artist, dataIdx) {
                itemEl.addEventListener("click", function () {
        
                    let reserveItem = getReserveItem(title, artist, dataIdx);
        
                    reserveFragment.appendChild(reserveItem);
                    reserveEl.appendChild(reserveFragment);
        
                    if (reserveEl) {
                        const reservedItems = document.getElementsByClassName('cancel_btn');
                        for (let i = 0; i < reservedItems.length; i++) {
                            let title = ''
                            reservedItems[parseInt(i)].addEventListener('click', function () {
                                const li = event.target.closest('li');
                                console.log(li);
                                title = li.getElementsByClassName('title')[0];
                                console.log(title);
        
                                reserveEl.removeChild(li);        
                            });
        
                        }
                    }
        
                    alert('[ ' + title + " ] 곡이 예약되었습니다.");
        
                });
        
        
        
            })(data.title, data.artist, i);
        
            fragment.appendChild(itemEl);
        
            tab_reservation.style.display = "none";
        }
        listEl.appendChild(fragment);
        

    }
})

function getListItem(rank, title, artist) {
    let el = document.createElement('li'),
        itemStr = "<div class='btn_area'>"
            + "<button class='reserve_btn'>+</button>"
            + "</div>"
            + "<div class='popular_data'>"
            + "<div class='rank'>" + rank + "위</div>"
            + "<div class='title'>" + title + "</div>"
            + "<div class='artist'>" + artist + "</div>"
            + "</div>";

    el.innerHTML = itemStr;
    el.className = 'popular_item';

    return el;
}

function getReserveItem(title, artist, dataIdx) {

    let el = document.createElement('li'),
        itemStr = "<div class='reserve_data'>"
            + "<div class='title'>" + title + "</div>"
            + "<div class='artist'>" + artist + "</div>"
            + "</div>"
            + "<div class='reserve_btn_area'>"
            + "<button class='play_btn' onclick='startVideo(" + dataIdx + ")'>▷</button>"
            + "<button class='cancel_btn'>✕</button>"
            + "</div>";

    el.innerHTML = itemStr;
    el.className = 'reserve_item';

    return el;
}

function startVideo(dataIdx) {
    let reserveEl = document.getElementById('reserve_list'),
        video = document.getElementById('video');
    let btn = document.getElementById('pauseBtn');
    let infoImg = document.getElementById('info_img');
    infoImg.style.display = 'none';
    video.src = popular_datas[dataIdx].link;
    video.play();
    btn.src = "/src/pauseBtn.png";
    videoStatus = true;

    const li = event.target.closest('li');
    reserveEl.removeChild(li);
}

function pauseVideo() {
    let video = document.getElementById('video');
    let btn = document.getElementById('pauseBtn');

    if (videoStatus) {
        video.pause();
        btn.src = "/src/playBtn.png";
        videoStatus = false;
    } else {
        video.play();
        btn.src = "/src/pauseBtn.png";
        videoStatus = true;
    }

}

function stopVideo() {
    let video = document.getElementById('video');
    videoStatus = false;
    video.src = "";

    // 이미지 노래를 시작해주세요
    let infoImg = document.getElementById('info_img');
    infoImg.style.display = 'inherit';
}

function exitVideo() {
    let confirmFlag = confirm("노래방 진짜 나갈꼬야?ㅇ.ㅠ!!");
    if (confirmFlag) {
        location.replace('/bye');
    }

}

function addOn(clicked_id) {
    const clicked_item = document.getElementById(clicked_id);

    if (clicked_id == "chart_popular") {
        const chart_reservation = document.getElementById("chart_reservation");
        chart_reservation.classList.remove("on");
        tab_popular.style.display = "flex";
        tab_reservation.style.display = "none";
        tab_popular.classList.add("current");
        tab_reservation.classList.remove("current");
    }
    else {
        const chart_popular = document.getElementById("chart_popular");
        chart_popular.classList.remove("on");
        tab_popular.style.display = "none";
        tab_reservation.style.display = "flex";
        tab_popular.classList.remove("current");
        tab_reservation.classList.add("current");
    }
    clicked_item.classList.add("on");
};

function clapSound() {
    let audio = document.getElementById("clap_audio");
    audio.play();
}
