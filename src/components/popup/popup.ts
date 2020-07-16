let styles = require("./popup.css");
// import styles from "./popup.css";
// 利用接口来规范参数，带?表示参数可选
interface Ipopup {
  width?: string;
  height?: string;
  title?: string;
  pos?: string;
  mask?: boolean;
  // content 是一个回调函数类型
  content?: (content: Element) => void;
}

function popup(options?: Ipopup) {
  return new Popup(options);
}

// 不同组件可能由不同开发人员完成，定义统一的组件接口有利于后期维护
interface Icomponent {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

class Popup implements Icomponent {
  tempContainer: HTMLElement;
  mask: HTMLElement;
  // private 修饰符可以将构造函数参数声明为私有属性，无需在构造函数外单独声明就可以直接在类方法中获取
  constructor(private settings: Ipopup) {
    this.settings = Object.assign(
      {
        width: "100%",
        height: "100%",
        title: "",
        pos: "center",
        mask: true,
        content: function () {},
      },
      settings
    );
    console.log(this.settings);
    this.init();
  }
  //   初始化
  init() {
    this.template();
    this.settings.mask && this.createMask();
    this.handle();
    this.contentCallback();
  }
  //   创建模板
  template() {
    this.tempContainer = document.createElement("div");
    this.tempContainer.className = styles.popup;

    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.innerHTML = `

    <div class="${styles["popup-title"]}">
    <h3>${this.settings.title}</h3>
    <i class="iconfont icon-close"></i>
    </div>
    <div class="${styles["popup-content"]}"></div>
    `;
    document.body.appendChild(this.tempContainer);

    if (this.settings.pos === "left") {
      this.tempContainer.style.left = "0px";
      this.tempContainer.style.top =
        window.innerHeight - this.tempContainer.offsetHeight + "px";
    } else if (this.settings.pos === "right") {
      this.tempContainer.style.right = "0px";
      this.tempContainer.style.top =
        window.innerHeight - this.tempContainer.offsetHeight + "px";
    } else {
      this.tempContainer.style.cssText +=
        "top:50%;left:50%;transform:translate(-50%,-50%)";
      // const leftPos = (window.innerWidth - this.tempContainer.offsetWidth) / 2;
      // const topPos = (window.innerHeight - this.tempContainer.offsetHeight) / 2;
      // this.tempContainer.style.left = (leftPos > 0 ? leftPos : 0) + "px";

      // this.tempContainer.style.top = (topPos > 0 ? topPos : 0) + "px";
    }
  }
  //   事件操作
  handle() {
    let popupClose = this.tempContainer.querySelector(
      `.${styles["popup-title"]} i`
    );
    popupClose.addEventListener("click", () => {
      // 这里使用了箭头函数，注意this指向
      document.body.removeChild(this.tempContainer);
      this.settings.mask && document.body.removeChild(this.mask);
    });
  }

  // 创建遮罩层
  createMask() {
    this.mask = document.createElement("div");
    this.mask.className = styles.mask;
    this.mask.style.width = document.body.offsetWidth + "px";
    this.mask.style.height = document.body.offsetHeight + "px";
    document.body.appendChild(this.mask);
  }

  // 内容回调函数
  contentCallback() {
    let popupContent = this.tempContainer.querySelector(
      `.${styles["popup-content"]}`
    );

    this.settings.content(popupContent);
  }
}

export default popup;
