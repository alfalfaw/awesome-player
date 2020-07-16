let styles = require("./video.css");

interface Ivideo {
  url: string;
  elem: string | Element;
  width?: string;
  height?: string;
  autoplay?: boolean;
}
// 不同组件可能由不同开发人员完成，定义统一的组件接口有利于后期维护
interface Icomponent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}
function video(options: Ivideo) {
  return new Video(options);
}

class Video implements Icomponent {
  tempContainer: HTMLElement;
  constructor(private settings: Ivideo) {
    this.settings = Object.assign(
      {
        width: "100%",
        height: "100%",
        autoplay: false,
      },
      settings
    );
    this.init();
  }

  init() {
    this.template();
    this.handle();
  }

  template() {
    this.tempContainer = document.createElement("div");
    this.tempContainer.className = styles.video;
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.innerHTML = `
    <video class="${styles["video-content"]}" src="${this.settings.url}"></video>
    <div class="${styles["video-controls"]}">
    <div class="${styles["video-progress"]}">
        <div class="${styles["video-progress-now"]}"></div>
        <div class="${styles["video-progress-suc"]}"></div>
        <div class="${styles["video-progress-bar"]}"></div>
    </div>
    <div class="${styles["video-play"]}">
        <i class="iconfont icon-play"></i>
    </div>
    <div class="${styles["video-time"]}">
        <span>00:00</span> / <span>00:00</span>
    </div>
    <div class="${styles["video-full"]}">
        <i class="iconfont icon-full-screen"></i>
    </div>
    <div class="${styles["video-volume"]}">
        <i class="iconfont icon-output"></i>
        <div class="${styles["video-volprogress"]}">
            <div class="${styles["video-volprogress-now"]}"></div>
            <div class="${styles["video-volprogress-bar"]}"></div>
        </div>
    </div>
    </div>
    `;
    // 判断参数是dom元素还是选择器
    if (typeof this.settings.elem === "object") {
      this.settings.elem.appendChild(this.tempContainer);
    } else {
      document
        .querySelector(this.settings.elem)
        .appendChild(this.tempContainer);
    }
  }
  handle() {
    let videoContent = this.tempContainer.querySelector(
      `.${styles["video-content"]}`
    ) as HTMLVideoElement;
    let videoControls: HTMLDivElement = this.tempContainer.querySelector(
      `.${styles["video-controls"]}`
    );
    let videoPlay = this.tempContainer.querySelector(
      `.${styles["video-controls"]} i`
    );
    let videoTimes = this.tempContainer.querySelectorAll(
      `.${styles["video-time"]} span`
    );
    let timer;
    let videoFull = this.tempContainer.querySelector(
      `.${styles["video-full"]} i`
    );
    let videoProgress: any = this.tempContainer.querySelectorAll(
      `.${styles["video-progress"]} div`
    );
    let videoVolProgress: any = this.tempContainer.querySelectorAll(
      `.${styles["video-volprogress"]} div`
    );

    // 设置音量
    videoContent.volume = 0.5;

    // 自动播放
    if (this.settings.autoplay) {
      timer = setInterval(playing, 1000);
      videoContent.play();
    }
    this.tempContainer.addEventListener("mouseenter", function () {
      videoControls.style.bottom = "0px";
    });
    this.tempContainer.addEventListener("mouseleave", function () {
      videoControls.style.bottom = "-50px";
    });
    // 视频是否加载完毕
    videoContent.addEventListener("canplay", () => {
      videoTimes[1].textContent = formatTime(videoContent.duration);
    });
    // 视频播放事件
    videoContent.addEventListener("play", () => {
      videoPlay.className = "iconfont icon-pause";
      timer = setInterval(playing, 1000);
    });
    // 视频暂停按钮
    videoContent.addEventListener("pause", () => {
      videoPlay.className = "iconfont icon-play";
      clearInterval(timer);
    });

    videoPlay.addEventListener("click", () => {
      if (videoContent.paused) {
        videoContent.play();
      } else {
        videoContent.pause();
      }
    });

    // 拖拽进度条
    videoProgress[2].addEventListener("mousedown", function (e: MouseEvent) {
      let downX = e.pageX;
      let downL = this.offsetLeft;
      document.onmousemove = (e: MouseEvent) => {
        let scale = (e.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        if (scale < 0) {
          scale = 0;
        } else if (scale > 1) {
          scale = 1;
        }

        videoProgress[0].style.width = scale * 100 + "%";
        videoProgress[1].style.width = scale * 100 + "%";
        this.style.left = (scale * 100) % +"%";
        videoContent.currentTime = scale * videoContent.duration;
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
      e.preventDefault;
    });
    // 拖拽音量条
    videoVolProgress[1].addEventListener("mousedown", function (e: MouseEvent) {
      let downX = e.pageX;
      let downL = this.offsetLeft;
      document.onmousemove = (e: MouseEvent) => {
        let scale = (e.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        if (scale < 0) {
          scale = 0;
        } else if (scale > 1) {
          scale = 1;
        }

        videoVolProgress[0].style.width = scale * 100 + "%";

        this.style.left = scale * 100 + "%";
        videoContent.volume = scale;
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
      e.preventDefault;
    });
    // 全屏
    videoFull.addEventListener("click", () => {
      videoContent.requestFullscreen();
    });

    // 播放中
    function playing() {
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime);

      let scale = videoContent.currentTime / videoContent.duration;
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;

      videoProgress[0].style.width = 100 * scale + "%";
      videoProgress[1].style.width = 100 * scaleSuc + "%";
      videoProgress[2].style.left = 100 * scale + "%";
    }
    // 格式化时间
    function formatTime(num: number): string {
      num = Math.round(num);
      let min = Math.floor(num / 60);
      let sec = num % 60;
      return (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
    }
  }
}

export default video;
