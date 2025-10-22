// 全局变量
let selectedAvatar = null;
let matchedPairs = 0;
let totalPossiblePairs = 0;
const userMap = new Map(); // 存储用户信息和对应的消息ID
const messageMap = new Map(); // 存储消息ID和DOM元素
let networkSpeedInterval = null;
const usedMessageTemplates = new Set(); // 存储已使用的消息模板，避免重复
let statusChangeInterval = null; // 用户状态变化的定时器
let timeUpdateInterval = null; // 时间更新的定时器

// 头像图标集合（复古风格字符图标）
const avatarIcons = ['$', '€', '£', '¥', '₿', '©', '®', '§', '¶', '¤', 
                    '#', '@', '%', '&', '*', '+', '×', '÷', '=', '≠',
                    '<', '>', '?', '!', '¡', '¿', '¢', '₤', '₹', '₩',
                    '⌂', '⌘', '⌥', '⌫', '⌦', '⇧', '⇨', '⇩', '⇦', '⇪',
                    '♠', '♥', '♦', '♣', '☺', '☹', '☻', '◄', '►', '▼',
                    '▲', '●', '◯', '■', '□', '▢', '▣', '▤', '▥', '▦',
                    '⊕', '⊖', '⊗', '⊘', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞',
                    '┌', '┬', '┐', '├', '┼', '┤', '└', '┴', '┘', '│',
                     '╳', '╋', '║', '═', '╬', '╩', '╦',
                    ];

// 用户名前缀和后缀
const usernamePrefixes=['追风','追梦','流星','闪电','烈火','寒冰','孤狼','雄鹰','阿明','阿芳','阿杰','阿丽','小帅','小美','小胖','小雅','侠客','浪子','红颜','知己','痞子','酷哥','辣妹','甜心','清风','明月','白云','蓝天','星辰','大海'];
const usernameSuffixes=['66','88','99','95','98','00','123','321','哥','姐','仔','妹','佬','婆','娃','宝','一号','二号','三号','四号','五号','达人','新手','过客','常客','老友','新人'];

// 必须保证有人发送的消息模版
const mandatoryMessageTemplates = [
    '有朋友关注游戏圈新闻吗，感觉这些游戏和我们币圈联系非常紧密啊，大家一定要注意',
    '开心消消乐太好玩了吧，连接起来消除的那瞬间爽翻了',
    '今天办公室的空调又坏了，热得要命',
    '我家亲戚生了个双胞胎宝宝，干啥都要两份，笑死了'
]

// 多样化的聊天消息模板
const chatTemplates = [
    // 货币交易相关
    '我看好欧元，近期可能会反弹。',
    '日元汇率波动太大，建议谨慎操作。',
    '黄金价格突破1800美元，这是买入信号吗？',
    '央行降息政策对我们的交易策略有什么影响？',
    '我刚建了一个欧元/美元的多头仓位，目标1.12。',
    '非农数据即将公布，市场波动可能加剧。',
    '技术分析显示英镑可能形成头肩顶形态。',
    '有谁在做交叉货币对交易吗？分享一下经验。',
    '通胀数据超预期，美联储可能加快加息步伐。',
    '比特币突破40000美元，加密货币市场沸腾了！',
    '瑞士法郎为什么总是在避险情绪升温时升值？',
    '有人关注过新兴市场货币吗？风险与机遇并存。',
    '量化交易策略在当前市场环境下表现如何？',
    
    // 生活吐槽
    '昨晚熬夜分析数据，现在眼睛都快睁不开了...',
    '中午点的外卖居然迟到了30分钟，饿死我了！',
    '周末想出去放松一下，有什么好地方推荐吗？',
    '最近压力有点大，交易总是亏多赚少...',
    '今天路上堵车堵了一个小时，差点迟到',
    '刚刚看了个搞笑视频，笑到肚子痛',
    '有人在追最近的热门电视剧吗？剧情太精彩了！',
    '昨晚做了个奇怪的梦，梦见自己在炒虚拟货币暴富了',
    '天气越来越热了，真怀念冬天的温度',
    '昨天买的股票又跌了，什么时候才能回本啊',
    '同事推荐了一个健身APP，有人用过吗？效果怎么样？',
    '最近在学做咖啡，手冲咖啡真的好难掌握火候！',
    '听说附近开了家新的奶茶店，下次一起去试试？',
    '家里的猫总是在我工作的时候跳到键盘上，太调皮了！',
    
    // 表情和其他
    '大家好！新人报道，请多指教！',
    '今天心情不错，希望交易也能顺利！',
    '刚刚喝了杯咖啡，感觉精神多了',
    '有人知道哪里有好吃的午餐推荐吗？',
    '周末计划去爬山，有没有一起的？',
    '刚刚看到一个有趣的市场分析报告，分享给大家',
    '最近在学习编程，感觉好难啊...',
    '今天的交易量怎么这么低？市场很平静',
    '有人在用新的交易软件吗？体验如何？',
    '刚刚电脑突然死机，差点丢失重要数据！',
    '今天穿了新衣服来上班，感觉整个人都精神了',
    '有没有人喜欢下班后去健身房的？可以一起啊！',
    '最近读了一本关于投资心理学的书，受益匪浅。',
    '昨天去看了新上映的电影，特效做得真不错！',
    '有人知道如何提高交易纪律吗？总是控制不住自己的手...',
    
    // 新增多样化内容
    '早上好啊各位！今天又是充满机会的一天！',
    '刚刚用了一个新的交易指标，效果还不错！',
    '下班了下班了！终于可以放松一下了',
    '有人研究过波浪理论吗？感觉好复杂啊',
    '今天股市大跌，大家的仓位怎么样？',
    '刚刚在咖啡店遇到了一个也是做交易的朋友，聊得很投机！',
    '周末准备去钓鱼，有没有钓友推荐好的地点？',
    '最近在学日语，为了更好地研究日本市场',
    '有人玩区块链游戏吗？感觉挺有意思的',
    '今天做了一笔完美的交易，心情舒畅！',
    '刚刚看到一只超可爱的小狗，忍不住拍了照片',
    '有没有人推荐一些好的财经类书籍？',
    '最近在学习瑜伽，用来缓解交易压力效果不错！',
    '今天的午餐是自制的健康沙拉，感觉整个人都轻盈了',
    '有人知道如何在交易中保持良好的心态吗？求分享！',
    '刚刚学会了一个Excel的新函数，效率提升不少！',
    '周末想组织一次线下交易经验分享会，有人参加吗？',
    '今天天气真好，适合出去走走，放松心情！',
    '有人在交易中使用过AI辅助决策吗？效果如何？',
    '刚刚泡了一杯好茶，慢慢品着分析市场走势...'
];

// 初始化函数
function init() {
    generateUserAvatars();
    generateChatMessages();
    setupEventListeners();
    
    // 初始化并设置时间显示定时器
    updateDisplayTime();
    timeUpdateInterval = setInterval(updateDisplayTime, 60000); // 每分钟更新一次

    // 初始化进度条
    updateProgressBar();
}

// 生成用户头像
function generateUserAvatars() {
    const userAvatarsContainer = document.getElementById('user-avatars');
    const avatarCount = 80; // 16行5列
    
    // 创建头像分布 - 确保每种头像成对出现，便于连连看配对
    const avatarDistribution = [];
    const pairsCount = Math.floor(avatarCount / 2);
    
    // 确保使用多样化的图标，每种图标最多出现2-3对
    const maxPairsPerIcon = 3;
    const minPairsPerIcon = 2;
    
    // 打乱图标顺序，增加随机性
    const shuffledIcons = [...avatarIcons].sort(() => Math.random() - 0.5);
    
    // 为每种图标分配对数，确保每种图标最多出现maxPairsPerIcon次
    let totalPairsAdded = 0;
    let iconIndex = 0;
    
    while (totalPairsAdded < pairsCount) {
        // 每种图标选择随机的对数（2-3对）
        const pairCount = Math.min(
            minPairsPerIcon + Math.floor(Math.random() * (maxPairsPerIcon - minPairsPerIcon + 1)),
            Math.floor((pairsCount - totalPairsAdded) / 1) // 确保不会超过剩余需要的对数
        );
        
        // 每对添加两个相同的图标
        for (let j = 0; j < pairCount; j++) {
            const icon = shuffledIcons[iconIndex % shuffledIcons.length];
            avatarDistribution.push(icon);
            avatarDistribution.push(icon);
        }
        
        totalPairsAdded += pairCount;
        iconIndex++;
    }
    
    // 确保正好是80个头像
    while (avatarDistribution.length < avatarCount) {
        // 如果有剩余位置，从已使用的图标中随机选择
        const randomIndex = Math.floor(Math.random() * shuffledIcons.length);
        avatarDistribution.push(shuffledIcons[randomIndex]);
    }
    
    // 如果超过80个，移除多余的
    while (avatarDistribution.length > avatarCount) {
        avatarDistribution.pop();
    }
    
    // 使用增强的打乱算法，确保有解
    smartShuffleArray(avatarDistribution);
    
    // 计算可能的配对数
    const iconCounts = {};
    avatarDistribution.forEach(icon => {
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
    });
    
    Object.values(iconCounts).forEach(count => {
        totalPossiblePairs += Math.floor(count / 2);
    });
    
    // 创建头像元素
    for (let i = 0; i < avatarCount; i++) {
        const avatarIcon = avatarDistribution[i];
        const userId = `user_${i}`;
        const username = generateUsername();
        const userLevel = Math.floor(Math.random() * 10) + 1;
        const joinTime = generateJoinTime();
        
        const userInfo = {
            id: userId,
            username: username,
            icon: avatarIcon,
            level: userLevel,
            joinTime: joinTime,
            messages: [],
            online: Math.random() > 0.6 // 随机在线状态（约60%在线）
        };
        
        userMap.set(userId, userInfo);
        
        const avatarElement = document.createElement('div');
        avatarElement.className = 'user-avatar';
        avatarElement.dataset.userId = userId;
        avatarElement.dataset.icon = avatarIcon;
        
        // 设置在线状态
        if (!userInfo.online) {
            avatarElement.classList.add('offline');
        }
        
        // 创建悬停提示
        const tooltip = document.createElement('div');
        tooltip.className = 'user-tooltip';
        tooltip.innerHTML = `
            <div>用户名: ${username}</div>
            <div>等级: ${userLevel}</div>
            <div>加入时间: ${joinTime}</div>
            <div>状态: ${userInfo.online ? '在线' : '离线'}</div>
        `;
        
        avatarElement.textContent = avatarIcon;
        // 设置网格坐标属性
        avatarElement.dataset.row = Math.floor(i / 5);
        avatarElement.dataset.col = i % 5;
        avatarElement.appendChild(tooltip);
        userAvatarsContainer.appendChild(avatarElement);
    }
}

// 生成用户名
function generateUsername() {
    const prefix = usernamePrefixes[Math.floor(Math.random() * usernamePrefixes.length)];
    const suffix = usernameSuffixes[Math.floor(Math.random() * usernameSuffixes.length)];
    const numbers = Math.floor(Math.random() * 3) + 1;
    if (numbers === 1) {
        return `${prefix}${suffix}`;
    }
    return `${prefix}${suffix}${numbers}`;
}

// 生成加入时间
function generateJoinTime() {
    const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${hour}:${minute}`;
}

// 生成聊天消息
function generateChatMessages() {
    const chatMessagesContainer = document.getElementById('chat-messages');
    const messageCount = 40;

    // 从用户中选择一些来发送消息
    const activeUsers = Array.from(userMap.values()).sort(() => Math.random() - 0.5).slice(0, 20);

    // 生成按顺序递增的时间（从10:00开始，每次递增1-5分钟）
    let currentHour = 10;
    let currentMinute = 0;

    // 生成消息并按时间排序
    const messages = [];

    // 重置已使用的消息模板集合
    usedMessageTemplates.clear();

    // 优先使用 mandatoryMessageTemplates（确保全部使用完毕，但随机顺序）
    const mandatoryShuffled = [...mandatoryMessageTemplates].sort(() => Math.random() - 0.5);
    let generated = 0;

    // 先把 mandatory 模板全部尽可能地分配到消息中
    for (let i = 0; i < mandatoryShuffled.length && generated < messageCount; i++) {
        const template = mandatoryShuffled[i];
        usedMessageTemplates.add(template);
        const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        const messageId = `msg_${generated}`;

        // 时间递增
        currentMinute += Math.floor(Math.random() * 5) + 1;
        if (currentMinute >= 60) {
            currentHour++;
            currentMinute -= 60;
        }

        const time = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

        messages.push({ user, template, messageId, time, timestamp: currentHour * 60 + currentMinute });
        generated++;
    }

    // 剩余位置使用 chatTemplates（尽量不重复，若模板不够则允许重复）
    const remainingToGenerate = messageCount - generated;
    const chatPool = [...chatTemplates];
    // 先打乱 chatTemplates
    chatPool.sort(() => Math.random() - 0.5);

    for (let i = 0; i < remainingToGenerate; i++) {
        let template = null;

        // 优先选择未使用过的 chatTemplates
        const unusedChat = chatPool.filter(t => !usedMessageTemplates.has(t));
        if (unusedChat.length > 0) {
            template = unusedChat[Math.floor(Math.random() * unusedChat.length)];
            usedMessageTemplates.add(template);
        } else {
            // 当所有模板都用过后，允许重复选择
            template = chatPool[Math.floor(Math.random() * chatPool.length)];
        }

        const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        const messageId = `msg_${generated}`;

        // 时间递增
        currentMinute += Math.floor(Math.random() * 5) + 1;
        if (currentMinute >= 60) {
            currentHour++;
            currentMinute -= 60;
        }

        const time = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

        messages.push({ user, template, messageId, time, timestamp: currentHour * 60 + currentMinute });
        generated++;
    }
    
    // 按时间排序消息
    messages.sort((a, b) => a.timestamp - b.timestamp);
    
    // 创建DOM元素
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.dataset.userId = msg.user.id;
        messageElement.dataset.messageId = msg.messageId;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${msg.user.icon}</div>
                <span class="message-username">${msg.user.username}</span>
                <span class="message-time">${msg.time}</span>
            </div>
            <div class="message-content">${msg.template}</div>
        `;
        
        chatMessagesContainer.appendChild(messageElement);
        
        // 记录消息
        msg.user.messages.push(msg.messageId);
        messageMap.set(msg.messageId, messageElement);
    });
}

// 设置事件监听器
function setupEventListeners() {
    const userAvatars = document.querySelectorAll('.user-avatar');
    
    userAvatars.forEach(avatar => {
        avatar.addEventListener('click', handleAvatarClick);
    });
}

// 获取头像位置坐标
function getAvatarPosition(avatar) {
    // 检查用户是否在线，如果不在线则返回null
    const userId = avatar.dataset.userId;
    const userInfo = userMap.get(userId);
    if (!userInfo || !userInfo.online) {
        return null;
    }
    // 使用 data-row/data-col 精确获取坐标
    const row = Number(avatar.dataset.row);
    const col = Number(avatar.dataset.col);
    return { row, col };
}

// 检查两点之间是否可以用不超过两次转折的路径连接
function canConnectWithTwoBends(pos1, pos2) {
    // 如果任一位置为null（用户离线），则无法连接
    if (!pos1 || !pos2) {
        return false;
    }
    
    // 直接连接（同一行或同一列）
    if (pos1.row === pos2.row || pos1.col === pos2.col) {
        return isPathClear(pos1, pos2);
    }
    
    // Helper: 判断某个格子是否可通过（即不被在线且未匹配的头像阻挡）
    function isCellPassable(row, col) {
        const cols = 5;
        // 越界视为可通过（允许绕过边界）
        if (row < 0 || col < 0) return true;
        const totalAvatars = document.querySelectorAll('.user-avatar').length;
        if (row * cols + col >= totalAvatars) return true;
        const avatar = document.querySelector(`.user-avatar[data-row="${row}"][data-col="${col}"]`);
        if (!avatar) return true;
        // 如果是端点之一，总是允许
        if ((row === pos1.row && col === pos1.col) || (row === pos2.row && col === pos2.col)) {
            return true;
        }
        const userId = avatar.dataset.userId;
        const userInfo = userMap.get(userId);
        // 在线且未匹配视为障碍
        if (userInfo && userInfo.online && !avatar.classList.contains('matched')) {
            return false;
        }
        return true;
    }

    // 一次转折 - 两种可能的路径（角落位置必须可通过）
    const corner1 = { row: pos1.row, col: pos2.col };
    const corner2 = { row: pos2.row, col: pos1.col };

    const path1Clear = isCellPassable(corner1.row, corner1.col) && isPathClear(pos1, corner1) && isPathClear(corner1, pos2);
    const path2Clear = isCellPassable(corner2.row, corner2.col) && isPathClear(pos1, corner2) && isPathClear(corner2, pos2);
    if (path1Clear || path2Clear) return true;

    // 两次转折：标准方法——按行和按列扫描两角路径
    const cols = 5;
    const totalAvatars = document.querySelectorAll('.user-avatar').length;
    const rows = Math.ceil(totalAvatars / cols);

    // 按行扫描：找两个角 (r,pos1.col) 和 (r,pos2.col)
    for (let r = 0; r < rows; r++) {
        const cornerA = { row: r, col: pos1.col };
        const cornerB = { row: r, col: pos2.col };

        if (isCellPassable(cornerA.row, cornerA.col) && isCellPassable(cornerB.row, cornerB.col)) {
            if (isPathClear(pos1, cornerA) && isPathClear(cornerA, cornerB) && isPathClear(cornerB, pos2)) {
                return true;
            }
        }
    }

    // 按列扫描：找两个角 (pos1.row,c) 和 (pos2.row,c)
    for (let c = 0; c < cols; c++) {
        const cornerA = { row: pos1.row, col: c };
        const cornerB = { row: pos2.row, col: c };

        if (isCellPassable(cornerA.row, cornerA.col) && isCellPassable(cornerB.row, cornerB.col)) {
            if (isPathClear(pos1, cornerA) && isPathClear(cornerA, cornerB) && isPathClear(cornerB, pos2)) {
                return true;
            }
        }
    }

    return false;
}

// 检查路径是否畅通（离线用户不视为障碍物）
function isPathClear(pos1, pos2) {
    // 如果是同一位置，路径当然畅通
    if (pos1.row === pos2.row && pos1.col === pos2.col) {
        return true;
    }
    
    // 获取所有头像
    const avatars = document.querySelectorAll('.user-avatar');
    
    // 处理水平路径（同一行）
    if (pos1.row === pos2.row) {
        const minCol = Math.min(pos1.col, pos2.col);
        const maxCol = Math.max(pos1.col, pos2.col);
        
        // 检查两个点之间（不包括端点）是否有在线且未匹配的头像
        for (let col = minCol + 1; col < maxCol; col++) {
            const avatar = document.querySelector(`.user-avatar[data-row="${pos1.row}"][data-col="${col}"]`);
            if (!avatar) continue;
            const userId = avatar.dataset.userId;
            const userInfo = userMap.get(userId);
            if (userInfo && userInfo.online && !avatar.classList.contains('matched')) {
                return false; // 路径被阻挡
            }
        }
        return true;
    }
    
    // 处理垂直路径（同一列）
    if (pos1.col === pos2.col) {
        const minRow = Math.min(pos1.row, pos2.row);
        const maxRow = Math.max(pos1.row, pos2.row);
        
        // 检查两个点之间（不包括端点）是否有在线且未匹配的头像
        for (let row = minRow + 1; row < maxRow; row++) {
            const avatar = document.querySelector(`.user-avatar[data-row="${row}"][data-col="${pos1.col}"]`);
            if (!avatar) continue;
            const userId = avatar.dataset.userId;
            const userInfo = userMap.get(userId);
            if (userInfo && userInfo.online && !avatar.classList.contains('matched')) {
                return false; // 路径被阻挡
            }
        }
        return true;
    }
    
    // 对于对角线，我们在canConnectWithTwoBends函数中处理
    return false;
}

// 处理头像点击
function handleAvatarClick(event) {
    const clickedAvatar = event.currentTarget;
    
    // 检查用户是否在线
    const userId = clickedAvatar.dataset.userId;
    const userInfo = userMap.get(userId);
    if (!userInfo || !userInfo.online) {
        return;
    }
    
    // 如果已经匹配或选中，忽略
    if (clickedAvatar.classList.contains('matched') || clickedAvatar.classList.contains('selected')) {
        return;
    }
    
    // 第一次选择
    if (!selectedAvatar) {
        selectedAvatar = clickedAvatar;
        clickedAvatar.style.borderColor = '#ff00ff';
        clickedAvatar.style.backgroundColor = '#000080';
        clickedAvatar.classList.add('selected');
        return;
    }
    
    // 第二次选择，先显示选中状态
    clickedAvatar.style.borderColor = '#ff00ff';
    clickedAvatar.style.backgroundColor = '#000080';
    clickedAvatar.classList.add('selected');
    
    // 检查图标是否匹配
    const isMatch = clickedAvatar.dataset.icon === selectedAvatar.dataset.icon;
    
    // 检查是否可以连接（最多两次转折）
    const pos1 = getAvatarPosition(selectedAvatar);
    const pos2 = getAvatarPosition(clickedAvatar);
    const canConnect = canConnectWithTwoBends(pos1, pos2);
    
    // 延迟处理，让用户看到第二个选中状态
    setTimeout(() => {
        if (isMatch && canConnect) {
            // 匹配成功
            matchedPairs++;
            
            // 消除两个头像
            selectedAvatar.classList.add('matched');
            clickedAvatar.classList.add('matched');
            
            // 消除相关聊天消息
            const user1Id = selectedAvatar.dataset.userId;
            const user2Id = clickedAvatar.dataset.userId;
            
            [user1Id, user2Id].forEach(userId => {
                if (userMap.has(userId)) {
                    const user = userMap.get(userId);
                    user.messages.forEach(messageId => {
                        if (messageMap.has(messageId)) {
                            const messageElement = messageMap.get(messageId);
                            messageElement.style.opacity = '0';
                            setTimeout(() => {
                                if (messageElement.parentNode) {
                                    messageElement.parentNode.removeChild(messageElement);
                                }
                            }, 300);
                            messageMap.delete(messageId);
                        }
                    });
                    userMap.delete(userId);
                }
            });
            
            // 检查是否所有配对都已完成
            if (matchedPairs >= totalPossiblePairs) {
                setTimeout(showSystemMessage, 500);
            }
            // 更新进度条
            updateProgressBar();

            // 匹配成功后：取消两个头像的选中并清空 selectedAvatar
            clickedAvatar.style.borderColor = '';
            clickedAvatar.style.backgroundColor = '';
            clickedAvatar.classList.remove('selected');

            selectedAvatar.style.borderColor = '';
            selectedAvatar.style.backgroundColor = '';
            selectedAvatar.classList.remove('selected');

            selectedAvatar = null;
        } else {
            // 不匹配：保留第二个为选中态，取消第一个的选中态，并将 selectedAvatar 指向第二个
            if (selectedAvatar) {
                selectedAvatar.style.borderColor = '';
                selectedAvatar.style.backgroundColor = '';
                selectedAvatar.classList.remove('selected');
            }
            // 已经给 clickedAvatar 添加了选中样式，保持它为选中，并将其作为新的 selectedAvatar
            selectedAvatar = clickedAvatar;
        }
    }, 300);
}

// 更新显示时间，同步分钟部分
function updateDisplayTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeElement = document.querySelector('.chat-time');
    if (timeElement) {
        // 如果 chat-time 含有日期部分（以空格分隔），保留日期并更新时间；否则直接替换为当前完整时间
        const currentText = timeElement.textContent || '';
        const parts = currentText.split(' ');
        const datePart = parts.length > 1 ? parts[0] : '';
        timeElement.textContent = datePart ? `${datePart} ${hours}:${minutes}` : `${hours}:${minutes}`;
    }
}

// 返回当前格式化时间字符串 HH:MM
function formatCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 更新底部进度条显示，基于 matchedPairs / totalPossiblePairs
function updateProgressBar() {
    const container = document.getElementById('progress-container');
    const bar = document.getElementById('progress-bar');
    if (!container || !bar) return;

    // 保护性检查：避免除以零
    const total = totalPossiblePairs || 1;
    let percent = Math.min(100, Math.round((matchedPairs / total) * 100));

    // 如果已经完成全部配对，确保为100%
    if (matchedPairs >= totalPossiblePairs) percent = 100;

    bar.style.width = `${percent}%`;
}

// 显示系统消息并跳转
function showSystemMessage() {
    const noiseOverlay = document.getElementById('noise-overlay');
    const systemMessage = document.getElementById('system-message');
    
    noiseOverlay.classList.remove('hidden');
    systemMessage.classList.remove('hidden');
    
    // 2秒后跳转
    setTimeout(() => {
        window.location.href = 'https://www.example.com'; // 替换为目标网页
    }, 2000);
}

// 增强版打乱数组顺序，确保连连看有解
function smartShuffleArray(array) {
    // 先进行基本打乱
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    
    // 检查并确保有解
    // 这里采用一种简化的策略：确保相同图标的配对不会被完全包围
    // 对于10x5的网格，我们确保每行每列至少有一个配对可以直接连接
    ensureSolvable(array);
}

// 确保数组中的连连看布局有解
function ensureSolvable(array) {
    // 记录每种图标的位置
    const iconPositions = {};
    for (let i = 0; i < array.length; i++) {
        const icon = array[i];
        if (!iconPositions[icon]) {
            iconPositions[icon] = [];
        }
        iconPositions[icon].push(i);
    }
    
    // 检查是否有配对的图标无法连接，如果有，则进行调整
    Object.values(iconPositions).forEach(positions => {
        for (let i = 0; i < positions.length; i += 2) {
            if (positions[i+1] !== undefined) {
                const pos1 = { row: Math.floor(positions[i] / 5), col: positions[i] % 5 };
                const pos2 = { row: Math.floor(positions[i+1] / 5), col: positions[i+1] % 5 };
                
                // 如果无法连接，则调整位置
                if (!canConnectWithTwoBends(pos1, pos2)) {
                    // 简单策略：与边界附近的图标交换位置
                    for (let j = 0; j < array.length; j++) {
                        const edgeRow = j < 5 || j >= array.length - 5;
                        const edgeCol = j % 5 === 0 || j % 5 === 4;
                        
                        if (edgeRow || edgeCol) {
                            // 交换位置
                            [array[positions[i+1]], array[j]] = [array[j], array[positions[i+1]]];
                            // 更新位置信息
                            positions[i+1] = j;
                            break;
                        }
                    }
                }
            }
        }
    });
}

// 测试网速并显示（纯随机模拟，不断波动）
function testNetworkSpeed() {
    // 定义多种网速范围，增加多样性
    const speedRanges = [
        { min: 100, max: 512, unit: 'Kbps', weight: 0.2 },   // 低速
        { min: 512, max: 1024, unit: 'Kbps', weight: 0.3 },  // 中低速
        { min: 1, max: 5, unit: 'Mbps', weight: 0.3 },       // 中速
        { min: 5, max: 20, unit: 'Mbps', weight: 0.15 },     // 高速
        { min: 20, max: 100, unit: 'Mbps', weight: 0.05 }    // 超高速
    ];
    
    // 根据权重随机选择网速范围
    let totalWeight = 0;
    const weights = [];
    for (const range of speedRanges) {
        totalWeight += range.weight;
        weights.push(totalWeight);
    }
    
    const randomWeight = Math.random() * totalWeight;
    let selectedRange;
    for (let i = 0; i < weights.length; i++) {
        if (randomWeight <= weights[i]) {
            selectedRange = speedRanges[i];
            break;
        }
    }
    
    // 生成随机网速值
    const speedValue = (Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min).toFixed(selectedRange.unit === 'Mbps' ? 1 : 0);
    
    // 模拟网速波动，让数值看起来更真实
    let displayedValue = speedValue;
    const fluctuation = Math.random() * 10 - 5; // -5% 到 +5% 的波动
    if (Math.random() > 0.5 && fluctuation > -3) { // 避免波动过大
        const valueNum = parseFloat(speedValue);
        displayedValue = (valueNum * (1 + fluctuation/100)).toFixed(selectedRange.unit === 'Mbps' ? 1 : 0);
    }
    
    // 更新显示
    document.getElementById('network-speed').textContent = `网速: ${displayedValue} ${selectedRange.unit}`;
}

// 更新在线用户数量显示
function updateOnlineCount() {
    const onlineCount = Array.from(userMap.values()).filter(user => user.online).length;
    const onlineCountElement = document.getElementById('online-count');
    if (onlineCountElement) {
        onlineCountElement.textContent = onlineCount;
    }
}

// 更新用户状态：基于剩余未匹配头像数量动态调整在线概率，避免游戏在剩余组合时被卡住
function updateUserStatuses() {
    // 参数：基础在线概率与提升策略
    const baseProb = 0.7; // 基准 70%
    const minRemainingForMax = 2; // 当剩余头像非常少时（最小为2个）应接近100%
    const boostThreshold = 20; // 当剩余头像 <= 20 时开始提升在线概率

    // 计算剩余未匹配的头像数量（DOM 视图为准）
    const unmatchedAvatars = Array.from(document.querySelectorAll('.user-avatar:not(.matched)'));
    const remaining = unmatchedAvatars.length;

    // 根据剩余数量计算在线概率（在 [baseProb, 0.99] 之间线性插值）
    let onlineProb = baseProb;
    if (remaining <= boostThreshold) {
        // 将 remaining 映射到 [minRemainingForMax, boostThreshold]
        const clamped = Math.max(minRemainingForMax, Math.min(boostThreshold, remaining));
        // t 从 0（clamped == minRemainingForMax）到 1（clamped == boostThreshold）
        const t = (clamped - minRemainingForMax) / Math.max(1, (boostThreshold - minRemainingForMax));
        // 插值：当 t = 1 -> 无提升；当 t = 0 -> 最大提升
        const maxProb = 0.99;
        onlineProb = Math.min(maxProb, baseProb + (maxProb - baseProb) * (1 - t));
    }

    // 根据计算出的 onlineProb 为每位用户设置在线状态
    const allUsers = Array.from(userMap.values());
    allUsers.forEach(user => {
        // 若用户已在 userMap 中，这表示该用户尚未被完全移除（未匹配或未清理消息）
        const willBeOnline = Math.random() < onlineProb;
        user.online = willBeOnline;

        // 更新 DOM 元素的类与 tooltip（如果在 DOM 中存在）
        const avatarElement = document.querySelector(`.user-avatar[data-user-id="${user.id}"]`);
        if (avatarElement) {
            if (user.online) {
                avatarElement.classList.remove('offline');
            } else {
                avatarElement.classList.add('offline');
            }

            // 直接重建 tooltip 内容，避免替换文本不准确的问题
            const tooltip = avatarElement.querySelector('.user-tooltip');
            if (tooltip) {
                tooltip.innerHTML = `\n                    <div>用户名: ${user.username}</div>\n                    <div>等级: ${user.level}</div>\n                    <div>加入时间: ${user.joinTime}</div>\n                    <div>状态: ${user.online ? '在线' : '离线'}</div>\n                `;
            }
        }
    });

    // 更新在线用户数量显示
    updateOnlineCount();

    // （可选）在控制台打印当前策略以便调试
    // console.debug(`updateUserStatuses: remaining=${remaining}, onlineProb=${(onlineProb*100).toFixed(1)}%`);
}

// 启动用户状态监控
function startUserStatusMonitoring() {
    if (statusChangeInterval) {
        clearInterval(statusChangeInterval);
    }
    
    // 每10-20秒随机切换用户状态
    function changeStatusWithRandomInterval() {
        updateUserStatuses();
        // 设置下一次执行的随机时间间隔（10-20秒）
        const nextInterval = Math.floor(Math.random() * 10000) + 10000;
        statusChangeInterval = setTimeout(changeStatusWithRandomInterval, nextInterval);
    }
    
    // 立即执行一次
    updateUserStatuses();
    // 设置第一次间隔
    const initialInterval = Math.floor(Math.random() * 10000) + 10000;
    statusChangeInterval = setTimeout(changeStatusWithRandomInterval, initialInterval);
}

// 定期测试网速（增加波动频率）
function startNetworkSpeedMonitoring() {
    testNetworkSpeed(); // 立即测试一次
    // 每2-5秒随机测试一次，增加波动感
    function scheduleNextTest() {
        const interval = Math.random() * 3000 + 2000; // 2-5秒随机间隔
        networkSpeedInterval = setTimeout(() => {
            testNetworkSpeed();
            scheduleNextTest();
        }, interval);
    }
    scheduleNextTest();
}

// 停止网速监控
function stopNetworkSpeedMonitoring() {
    if (networkSpeedInterval) {
        clearInterval(networkSpeedInterval);
        networkSpeedInterval = null;
    }
}

// 添加复古打字效果
function addTypewriterEffect() {
    const chatHeader = document.querySelector('.chat-header h2');
    const originalText = chatHeader.textContent;
    chatHeader.textContent = '';
    
    let index = 0;
    function typeCharacter() {
        if (index < originalText.length) {
            chatHeader.textContent += originalText[index];
            index++;
            setTimeout(typeCharacter, Math.random() * 50 + 20);
        }
    }
    
    setTimeout(typeCharacter, 1000);
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    init();
    addTypewriterEffect();
    startNetworkSpeedMonitoring(); // 启动网速监控
    startUserStatusMonitoring(); // 启动用户状态监控
    updateOnlineCount(); // 初始更新在线用户数量
    
    // 添加一些复古的闪烁效果
    setInterval(() => {
        const elements = document.querySelectorAll('*');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        const originalOpacity = randomElement.style.opacity;
        randomElement.style.opacity = '0.8';
        setTimeout(() => {
            randomElement.style.opacity = originalOpacity;
        }, 50);
    }, 2000);
    
    // 页面卸载时清理所有定时器
    window.addEventListener('beforeunload', () => {
        stopNetworkSpeedMonitoring();
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
        }
        if (statusChangeInterval) {
            clearInterval(statusChangeInterval);
        }
    });
});