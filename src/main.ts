// 在webpack项目中引入css文件必须安装相应的loader
import "./main.css";

import popup from "./components/popup/popup";
import video from "./components/video/video";
let listItem = document.querySelectorAll("#list li");

listItem.forEach((item) => {
  item.addEventListener("click", function () {
    let url = this.dataset.url;
    let title = this.dataset.title;
    popup({
      width: "880px",
      height: "556px",
      title,
      pos: "center",
      mask: false,
      content(elem) {
        video({
          url,
          elem,
          autoplay: true,
        });
      },
    });
  });
});
