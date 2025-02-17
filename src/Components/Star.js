import React, { Component } from "react";

class Star extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.timeoutList = [];
  }

  componentDidMount() {
    this.drawStar();
  }

  componentWillUnmount() {
    // 清理定时器
    for (const timeoutName of this.timeoutList) {
      clearTimeout(timeoutName);
    }
  }

  drawStar() {
    const colours = ["#ffff00", "#66ffff", "#3399ff", "#99ff00", "#ff9900"];
    const arr = [];
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d");

    // 调整画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.onresize = resizeCanvas;

    // 绘制五角星
    const star = (x, y, r, l, rot) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72 - rot) * Math.PI) / 180) * r + x,
          -Math.sin(((18 + i * 72 - rot) * Math.PI) / 180) * r + y
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72 - rot) * Math.PI) / 180) * l + x,
          -Math.sin(((54 + i * 72 - rot) * Math.PI) / 180) * l + y
        );
      }
      ctx.closePath();
    };

    // 更新动画
    const update = () => {
      for (let i = 0; i < arr.length; i++) {
        arr[i].x += arr[i].dx;
        arr[i].y += arr[i].dy;
        arr[i].rot += arr[i].td;
        arr[i].r -= 0.015;
        if (arr[i].r < 0) {
          arr.splice(i, 1);
        }
      }
    };

    // 绘制星星
    const draw = () => {
      for (let i = 0; i < arr.length; i++) {
        const temp = arr[i];
        star(temp.x, temp.y, temp.r, temp.r * 3, temp.rot);
        ctx.fillStyle = temp.color;
        ctx.strokeStyle = temp.color;
        ctx.lineWidth = 0.1;
        ctx.lineJoin = "round";
        ctx.fill();
        ctx.stroke();
      }
    };

    // 添加星星
    const addStars = (e) => {
      arr.push({
        x: e.clientX,
        y: e.clientY,
        r: Math.random() * 0.5 + 1.5,
        td: Math.random() * 4 - 2,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 1 + 1,
        rot: Math.random() * 90 + 90,
        color: colours[Math.floor(Math.random() * colours.length)],
      });
    };

    // 鼠标移动事件
    window.addEventListener("mousemove", (e) => {
      addStars(e);
      for (let index = 0; index < 200; index++) {
        if (index === 0 && this.timeoutList.length > 0) {
          for (const timeoutName of this.timeoutList) {
            clearTimeout(timeoutName);
          }
        }
        this.timeoutList[index] = setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          draw();
          update();
        }, index * 20);
      }
    });
  }

  render() {
    return <canvas ref={this.canvas} style={{ position: "fixed", zIndex: 1000, top: 0, left: 0, pointerEvents: "none" }} />;
  }
}

export default Star;
