// js/fireworks.js (性能优化版)

(function initFireworks() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFireworks);
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    document.body.appendChild(canvas);

    // 霓虹色系
    const vibrantColors = [
        '#FF0055', '#00FF88', '#00D9FF', '#FFCC00', '#FF00FF', '#FF6600', '#00FFCC', '#FF0099'
    ];

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015; // ⚡ 稍快一点消失，减少总粒子数
            this.gravity = 0.04;
            this.size = Math.random() * 2 + 1.5;
        }

        update() {
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;

            // ⚡ 光晕稍微小一点，提升性能
            ctx.shadowBlur = 7;
            ctx.shadowColor = this.color;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Firework {
        constructor() {
            this.x = Math.random() * width;
            this.y = height;
            this.targetY = Math.random() * (height * 0.4) + 50;
            this.speed = Math.random() * 2 + 10;
            this.color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
            this.exploded = false;
            this.particles = [];
            // ⚡ 粒子数量从 80-160 降到 50-100
            this.particleCount = Math.floor(Math.random() * 50) + 50;
        }

        // 其他方法保持不变
        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.explode();
                }
            } else {
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    this.particles[i].update();
                    if (this.particles[i].alpha <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
            }
        }

        explode() {
            this.exploded = true;
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push(new Particle(this.x, this.y, this.color));
            }
        }

        draw() {
            if (!this.exploded) {
                ctx.save();
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                this.particles.forEach(p => p.draw());
            }
        }
    }

    const fireworks = [];

    function loop() {
        requestAnimationFrame(loop);

        // ⚡ 拖尾清除稍微快一点，减少渲染压力
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'lighter';

        // ⚡ 触发频率从 0.04 降到 0.02-0.03
        if (Math.random() < 0.02) {
            fireworks.push(new Firework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
                fireworks.splice(i, 1);
            }
        }
    }

    loop();
})();
