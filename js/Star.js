// --- 流星和表情的配置 ---
const meteorEmojis = ['⭐', '✨', '💫', '🌟', '🌠', '☄️','🎈','🎁','🎀','✉','🌈', '💖', '🎆', '🎇', '🌌'];

// --- 页面加载时初始化星空背景 ---
// 使用 window.onload 确保在所有资源（包括图片）加载完毕后执行
window.onload = function() {
    // 检查一下星空容器是否存在，避免报错
    const starsContainer = document.getElementById('starsBackground');
    if (starsContainer) {
        initStarBackground();
        // 添加持续的、零散的流星效果
        setInterval(() => {
            if (Math.random() > 0.4) {
                createMeteor();
            }
            if (Math.random() > 0.5) {
                createEmojiMeteor();
            }
        }, 1500);
    } else {
        console.error('错误：找不到 id 为 "starsBackground" 的元素！');
    }
};

/**
 * 创建一阵密集的流星雨（可以手动调用，比如点击按钮时触发）
 */
function createMeteorShower() {
    // 创建普通流星
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createMeteor();
        }, i * 300);
    }

    // 创建表情流星
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createEmojiMeteor();
        }, i * 200);
    }
}

/**
 * 创建单个普通流星
 */
function createMeteor() {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';

    // 随机起始位置（屏幕上方）
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight * 0.5;

    // 随机结束位置（屏幕下方）
    const endX = startX + (Math.random() * 400 - 200);
    const endY = window.innerHeight + 100;

    // 计算角度
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    meteor.style.left = startX + 'px';
    meteor.style.top = startY + 'px';

    meteor.innerHTML = `
                <div class="meteor-body"></div>
                <div class="meteor-tail" style="transform: rotate(${angle}deg);"></div>
            `;

    document.body.appendChild(meteor);

    // 动画
    let progress = 0;
    const speed = 5 + Math.random() * 5;
    const animationInterval = setInterval(() => {
        progress += speed;

        const currentX = startX + (endX - startX) * (progress / 100);
        const currentY = startY + (endY - startY) * (progress / 100);

        meteor.style.left = currentX + 'px';
        meteor.style.top = currentY + 'px';

        if (progress >= 100) {
            clearInterval(animationInterval);
            meteor.remove();
        }
    }, 20);
}

/**
 * 创建单个表情流星
 */
function createEmojiMeteor() {
    const emoji = document.createElement('div');
    emoji.className = 'emoji-meteor';
    emoji.textContent = meteorEmojis[Math.floor(Math.random() * meteorEmojis.length)];

    // 随机起始位置（屏幕上方）
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight * 0.3;

    // 随机结束位置（屏幕下方）
    const endX = startX + (Math.random() * 600 - 300);
    const endY = window.innerHeight + 100;

    // 计算移动距离和旋转角度
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const rotation = Math.random() * 360 - 180;

    // 设置CSS变量
    emoji.style.setProperty('--end-x', distanceX + 'px');
    emoji.style.setProperty('--end-y', distanceY + 'px');
    emoji.style.setProperty('--rotation', rotation + 'deg');

    // 设置初始位置和动画时间
    emoji.style.left = startX + 'px';
    emoji.style.top = startY + 'px';
    emoji.style.animationDuration = (2 + Math.random() * 2) + 's';

    document.body.appendChild(emoji);

    // 动画结束后移除
    setTimeout(() => {
        emoji.remove();
    }, 4000);
}

/**
 * 初始化星空背景
 */
function initStarBackground() {
    const starsContainer = document.getElementById('starsBackground');
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // 随机大小
        const size = Math.random() * 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // 随机位置
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // 随机动画延迟
        star.style.animationDelay = Math.random() * 3 + 's';

        starsContainer.appendChild(star);
    }
}
