"use client";
import { useEffect, useRef, memo } from "react";

interface StarBackgroundProps {
  className?: string;
}

class Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  deltaAlpha: number;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.ctx.canvas.width;
    this.y = Math.random() * this.ctx.canvas.height;
    this.radius = Math.random() * 1.5;
    this.color = ["#ffffff", "#ffe9c4", "#d4fbff"][
      Math.floor(Math.random() * 3)
    ];
    this.alpha = Math.random();
    this.deltaAlpha = 0.002 + Math.random() * 0.02;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    this.ctx.fill();
  }

  update() {
    this.alpha += this.deltaAlpha;
    if (this.alpha > 1 || this.alpha < 0) {
      this.deltaAlpha *= -1;
    }
  }
}

class Trail {
  x: number;
  y: number;
  alpha: number;
  radius: number;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.alpha = 1;
    this.radius = Math.random() * 6 + 1; // 拖影大小
  }

  update() {
    this.alpha -= 0.02; // 逐渐消失
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    this.ctx.fill();
  }
}

class Heart {
  x: number;
  y: number;
  size: number;
  alpha: number;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = 15;
    this.alpha = 1;
  }

  update() {
    this.alpha -= 0.02; // 逐渐透明
    this.size += 0.5; // 缩放效果
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.scale(this.size / 15, this.size / 15);
    this.ctx.globalAlpha = this.alpha;

    this.ctx.fillStyle = "rgba(255, 0, 100, 1)";
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(-10, -10, -15, 5, 0, 15);
    this.ctx.bezierCurveTo(15, 5, 10, -10, 0, 0);
    this.ctx.fill();
    this.ctx.restore();
  }
}

const StarBackground = ({ className }: StarBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const trails = useRef<Trail[]>([]);
  const hearts = useRef<Heart[]>([]);
  const animationFrameId = useRef<number>();

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 初始化星星
    stars.current = Array.from({ length: 600 }, () => new Star(ctx));

    // 窗口尺寸处理
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.current.forEach((star) => star.reset());
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // 鼠标事件处理
    const handleMouseMove = (e: MouseEvent) => {
      trails.current.push(new Trail(ctx, e.clientX, e.clientY));
      // 限制拖影数量，避免性能问题
      if (trails.current.length > 50) {
        trails.current.shift();
      }
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    const handleClick = (e: MouseEvent) => {
      hearts.current.push(new Heart(ctx, e.clientX, e.clientY - 20));
    };
    canvas.addEventListener("click", handleClick);

    // 动画循环
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新星星
      stars.current.forEach((star) => {
        star.update();
        star.draw();
      });

      // 更新拖影
      trails.current.forEach((trail, index) => {
        trail.update();
        trail.draw();
        if (trail.alpha <= 0) {
          trails.current.splice(index, 1);
        }
      });

      hearts.current.forEach((heart, index) => {
        heart.update();
        heart.draw();
        if (heart.alpha <= 0) {
          hearts.current.splice(index, 1);
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  };

  useEffect(initCanvas, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 -z-0 ${className}`}
    />
  );
};

export default memo(StarBackground);
