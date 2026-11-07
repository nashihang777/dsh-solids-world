import type { Guide } from './types'

export const GUIDES_SYMMETRY_ZH: Record<string, Guide> = {
  'sym-rotation': {
    lesson: [
      {
        title: '先猜：转多少度能对齐？',
        body: '盯着纹样猜一猜：绕这根轴至少转多少度，它会与原来重合？想好再点击轴标记验证。',
        anchor: 'element-0',
      },
      {
        title: '验证：点击播放旋转',
        body: '点击轴标记：模型旋转 360°/n，动画结束闪光对齐。轴次越高，每次点击转的角度越小。',
        anchor: 'element-0',
      },
      {
        title: '连击 n 次回原位',
        body: '连续点击同一根轴 n 次：累计转满 360°，模型回到出发点。盯住一个角顶，看它兜一圈回原点。',
        anchor: 'cubeCorner',
      },
    ],
    quiz: [
      {
        question: '4 次轴的最小旋转角是？',
        options: ['45°', '90°', '180°'],
        answer: 1,
        explain: '360°/4 = 90°。',
      },
      {
        question: '晶体里为什么找不到 5 次轴？',
        options: ['五边形无法铺满空间', '旋转 72° 能量太高', '量子数不允许'],
        answer: 0,
        explain: '周期平移与五重旋转不相容：五边形拼不出填满空间的格子（准晶放弃周期性才实现五重对称）。',
      },
    ],
  },
  'sym-mirror': {
    lesson: [
      {
        title: '先猜：镜子在哪？',
        body: '找出那个能让纹样"对折重合"的平面。先在心里指出来，再点击镜面标记验证。',
        anchor: 'element-0',
      },
      {
        title: '点击翻面',
        body: '点击镜面标记：模型穿过镜面翻到另一侧，动画结束闪光对齐。像与物到镜面严格等距。',
        anchor: 'element-0',
      },
      {
        title: '翻两次等于没翻',
        body: '再点一次：σ²=E，模型回到原位。镜面和反演一样都是 2 阶操作，连击两次互相抵消。',
        anchor: 'cubeCorner',
      },
    ],
    quiz: [
      {
        question: '镜面反射连做几次回到原状？',
        options: ['1 次', '2 次', '4 次'],
        answer: 1,
        explain: 'σ²=E：两次连续反射互相抵消。',
      },
      {
        question: '平面镜真正颠倒的是哪个方向？',
        options: ['上下', '左右', '垂直于镜面的前后'],
        answer: 2,
        explain: '镜子翻转的只是垂直于镜面的方向；"左右颠倒"是观察者自己的错觉。',
      },
    ],
  },
  'sym-inversion': {
    lesson: [
      {
        title: '先猜：中心在哪？',
        body: '找出那样一个点：每个角顶穿过它都能撞上对面等距的角顶。先指出来，再点击中心标记验证。',
        anchor: 'cubeCorner',
      },
      {
        title: '点击反演',
        body: '点击中心标记：所有点 r→−r，动画结束闪光对齐。体对角的两个角顶互换位置。',
        anchor: 'element-0',
      },
      {
        title: '反演的隐藏身份',
        body: '反演 = 绕轴转 180°＋垂直镜面反射。点群里只要 C2 与垂直它的镜面同时到场，反演中心就必然在场。',
        anchor: 'element-0',
      },
    ],
    quiz: [
      {
        question: '反演操作把位置矢量 r 变成？',
        options: ['2r', '−r', 'r/2'],
        answer: 1,
        explain: '每个点穿过中心到对面等距处：r→−r。',
      },
      {
        question: '反演连做几次回到原位？',
        options: ['2 次', '3 次', '6 次'],
        answer: 0,
        explain: 'i²=E，反演是 2 阶操作。',
      },
    ],
  },
  'sym-translation-glide': {
    lesson: [
      {
        title: '先猜：脚印的规律',
        body: '看脚印纹样：左脚与右脚是什么关系？先猜"一步"到底等于什么操作，再点击镜面验证。',
        anchor: 'footprint',
      },
      {
        title: '滑移 = 反射＋半步',
        body: '点击镜面或箭头：播放"脚印"滑移动画--先反射、再滑半周期，左右脚交错前进。',
        anchor: 'mirrorPlane',
      },
      {
        title: '连击两次 = 纯平移',
        body: '再点一次：反射抵消、半周期×2 凑成整周期，脚印落到下一个周期上--g²=平移。',
        anchor: 'halfPeriod',
      },
      {
        title: '平移才是发动机',
        body: '点击箭头连击两次：两个半周期凑成一个整周期，脚印稳稳落在下一格，等于一次纯平移。空间群的"无限复制"全由平移驱动，点群里却没有它的位置。',
        anchor: 'translationArrow',
      },
    ],
    quiz: [
      {
        question: '滑移操作等于？',
        options: ['纯平移半周期', '镜面反射＋半周期平移', '旋转 180°＋平移'],
        answer: 1,
        explain: '先关于滑移面反射，再沿面内方向平移半个周期。',
      },
      {
        question: '滑移连做两次等于？',
        options: ['回到原位', '一次纯平移', '一次镜面反射'],
        answer: 1,
        explain: '反射做两次抵消，半周期平移做两次凑成整周期：g²=t。',
      },
    ],
  },
  'pointgroup-2m': {
    lesson: [
      {
        title: '先猜：几样对称元素？',
        body: '别急着看答案：这个纹样里藏着一根旋转轴、一个镜面和一个反演中心。先在心里数一数，再逐一点击揭示。',
        anchor: 'cubeCorner',
      },
      {
        title: '线索一：2 次轴',
        body: '点击轴标记：模型转 180° 后闪光对齐。这就是记号开头的"2"，单斜晶系唯一的方向特权。',
        anchor: 'element-0',
      },
      {
        title: '线索二：水平镜面',
        body: '点击镜面标记：模型上下翻面、闪光对齐。它垂直于 2 次轴--记号里的"/m"说的就是这层关系。',
        anchor: 'element-1',
      },
      {
        title: '线索三：附赠的反演',
        body: '点击反演中心：每点 r→−r。C2 与垂直镜面的乘积恰好是反演--第三个元素不请自来。',
        anchor: 'element-2',
      },
    ],
    quiz: [
      {
        question: '2/m 点群共包含几个群元？',
        options: ['3 个', '4 个', '6 个'],
        answer: 1,
        explain: 'E、C2、i、σh 各一个，群阶 4。',
      },
      {
        question: '记号"2/m"里的斜杠表示？',
        options: ['镜面包含 2 次轴', '镜面垂直于 2 次轴', '两个独立方向'],
        answer: 1,
        explain: '斜杠意为"垂直于"：镜面 m 与 2 次轴互相垂直。',
      },
    ],
  },
  'pointgroup-4mmm': {
    lesson: [
      {
        title: '先猜：主轴是几次？',
        body: '盯着纹样沿竖直方向转：转到 90° 就对齐一次。先猜主轴轴次，再点击主轴标记验证--闪光出现在 90°，说明是 4 次轴。',
        anchor: 'element-0',
      },
      {
        title: '赤道面里的 2 次轴',
        body: '点击任意水平 2 次轴：绕它转 180° 闪光对齐。这样的轴共 4 根，彼此相隔 45°。',
        anchor: 'element-2',
      },
      {
        title: '一层套一层的镜面',
        body: '先点水平镜面（上下对折），再点竖直镜面（左右对折）：1＋4 个镜面把主轴层层包裹。',
        anchor: 'element-5',
      },
      {
        title: '收尾：反演中心',
        body: '点击反演标记：每点穿过中心到对面。4 次轴与全部镜面拼出的正是四方晶系的最高对称 4/mmm，群阶 16。',
        anchor: 'inversion',
      },
    ],
    quiz: [
      {
        question: '绕 4 次主轴至少转多少度纹样重合？',
        options: ['45°', '90°', '180°'],
        answer: 1,
        explain: '360°/4 = 90°。',
      },
      {
        question: '4/mmm 点群共有几个镜面？',
        options: ['4 个', '5 个', '9 个'],
        answer: 1,
        explain: '1 个水平镜面＋4 个竖直镜面，共 5 个。',
      },
    ],
  },
  'pointgroup-6mmm': {
    lesson: [
      {
        title: '先猜：主轴是几次？',
        body: '绕竖直轴慢慢转：每 60° 就对齐一次。先猜轴次再点击主轴验证--闪光出现在 60°，说明是 6 次轴。',
        anchor: 'element-0',
      },
      {
        title: '赤道里的 6 根 2 次轴',
        body: '点击任意水平 2 次轴：转 180° 闪光对齐。六根轴每 30° 一根，像钟面上的六根指针。',
        anchor: 'element-2',
      },
      {
        title: '七面镜子',
        body: '先点水平镜面，再点竖直镜面：1＋6 个镜面把纹样围成一座"镜厅"。',
        anchor: 'element-7',
      },
      {
        title: '收尾：反演与总数',
        body: '点击反演中心完成清单：1 根 6 次轴、6 根 2 次轴、7 个镜面、1 个反演--群阶 24，六方的顶配。',
        anchor: 'inversion',
      },
    ],
    quiz: [
      {
        question: '绕 6 次主轴至少转多少度纹样重合？',
        options: ['30°', '60°', '90°'],
        answer: 1,
        explain: '360°/6 = 60°。',
      },
      {
        question: '6/mmm 点群共有几根 2 次轴？',
        options: ['3 根', '6 根', '12 根'],
        answer: 1,
        explain: '6 根 2 次轴都在垂直于主轴的平面内，彼此相隔 30°。',
      },
    ],
  },
  'pointgroup-432': {
    lesson: [
      {
        title: '先猜：它有多少根轴？',
        body: '这个纹样只有旋转、没有反射。先数一数能闪光的轴：穿面心的、穿体对角的、过棱中点的，各有几根？',
        anchor: 'cubeCorner',
      },
      {
        title: '骨架：3 根 4 次轴',
        body: '点击任一穿面心的轴：转 90° 闪光对齐。x、y、z 三根互相垂直，是立方对称的骨架。',
        anchor: 'element-0',
      },
      {
        title: '体对角线上的 3 次轴',
        body: '点击体对角轴：转 120° 闪光对齐。四条体对角线各自藏着这根轴，正是它把立方体拧出"转角对称"。',
        anchor: 'element-3',
      },
      {
        title: '收尾：2 次轴与手性',
        body: '点击过对棱中点的轴：转 180° 对齐。清单里只有轴、没有镜子--432 是手性点群。',
        anchor: 'element-7',
      },
    ],
    quiz: [
      {
        question: '立方体有几根 3 次轴？',
        options: ['3 根', '4 根', '6 根'],
        answer: 1,
        explain: '四条体对角线各一根，共 4 根。',
      },
      {
        question: '432 为什么是手性点群？',
        options: ['轴的数目太多', '没有镜面也没有反演', '群阶 24 是偶数'],
        answer: 1,
        explain: '不含任何"翻手"操作（镜面、反演、像转轴）的群才可能是手性的。',
      },
    ],
  },
  'pointgroup-43m': {
    lesson: [
      {
        title: '先猜：四面体的对称',
        body: '纹样里藏着一个正四面体。先猜它有哪些对称元素：几次轴？几面镜子？有没有对称中心？',
        anchor: 'cubeCorner',
      },
      {
        title: '奇怪的 -4 轴',
        body: '点击棱方向轴：只转 90° 对不上，"转 90° 再翻面"才闪光--这是像转轴 -4，不是普通 4 次轴。',
        anchor: 'element-0',
      },
      {
        title: '体对角线上仍是 3 次',
        body: '点击体对角轴：转 120° 闪光对齐。这 4 根 C3 是它与 432 共享的骨架。',
        anchor: 'element-5',
      },
      {
        title: '收尾：有镜无心',
        body: '点击镜面对折闪光，却找不到反演中心。正是这个"缺心"，让闪锌矿有了极性方向与压电性。',
        anchor: 'element-10',
      },
    ],
    quiz: [
      {
        question: '-43m 点群的对称中心在哪？',
        options: ['立方体中心', '四面体内部', '不存在'],
        answer: 2,
        explain: 'Td 不含反演：物与"穿过中心的像"并不重合。',
      },
      {
        question: '闪锌矿 ZnS 的点群是？',
        options: ['m-3m', '432', '-43m'],
        answer: 2,
        explain: '闪锌矿空间群 F-43m，点群 -43m；金刚石才对应 m-3m。',
      },
    ],
  },
  'pointgroup-m3m': {
    lesson: [
      {
        title: '先猜：几根轴、几面镜？',
        body: '立方纹样是点群世界的"顶配"。先猜轴和镜面的总数，再逐一揭示：13 根轴、9 面镜子、1 个中心。',
        anchor: 'cubeCorner',
      },
      {
        title: '轴的三档：4、3、2',
        body: '依次点击 4 次轴（转 90°）、3 次轴（转 120°）、2 次轴（转 180°）：三档旋转各自闪光对齐，合计 13 根轴。',
        anchor: 'element-0',
      },
      {
        title: '九面镜子',
        body: '先点 {100} 坐标面镜面，再点 {110} 对角镜面：3＋6 个对折动作层层叠加。',
        anchor: 'element-13',
      },
      {
        title: '收尾：中心一点',
        body: '点击反演中心：每点穿过到对面。48 个群元全部到位，NaCl 与 Cu 就住在这座对称皇宫里。',
        anchor: 'inversion',
      },
    ],
    quiz: [
      {
        question: '立方体有几根 4 次轴？',
        options: ['3 根', '4 根', '6 根'],
        answer: 0,
        explain: '沿 x、y、z 各一根，共 3 根。',
      },
      {
        question: 'm-3m 的群阶是多少？',
        options: ['24', '48', '96'],
        answer: 1,
        explain: '纯旋转部分即 432（群阶 24），再乘上"带不带反演"的因子 2，共 48。',
      },
    ],
  },
  'sg-intro': {
    lesson: [
      {
        title: '先猜：两个格子差在哪？',
        body: '左右两个格子的点群完全相同，空间群却不一样。先找出它们的差别，再点击揭示：答案藏在格子的"心"里。',
        anchor: 'leftCell',
      },
      {
        title: '线索：中心的母题',
        body: '点击中心母题：它不是随手放的装饰，而是顶点母题平移 (½,½,½) 的副本。这就是 I 体心。',
        anchor: 'centeringMotif',
      },
      {
        title: '平移把图案织成布',
        body: '点击平移箭头：整套图案滑动一个周期后与自身重合。点群管"单朵花"，平移管"整幅壁纸"。',
        anchor: 'translationVector',
      },
      {
        title: '合起来：230 种',
        body: '点击右格收尾：32 个点群、14 种格子，加上心化、滑移与螺旋的组合，共拼出 230 个空间群。同一个点群能摊开成好几个。',
        anchor: 'rightCell',
      },
    ],
    quiz: [
      {
        question: '空间群与点群的根本差别是？',
        options: ['空间群多了平移操作', '空间群群阶一定更大', '空间群只用于立方晶系'],
        answer: 0,
        explain: '平移（含心化、滑移、螺旋）是空间群独有的成分。',
      },
      {
        question: '晶体学空间群共有多少个？',
        options: ['32 个', '14 个', '230 个'],
        answer: 2,
        explain: '32 是点群数、14 是 Bravais 格子数，230 才是空间群总数。',
      },
    ],
  },
}
