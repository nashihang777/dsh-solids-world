import type { Guide } from './types'

export const GUIDES_BRAVAIS_ZH: Record<string, Guide> = {
  'cubic-p': {
    lesson: [
      {
        title: '为什么叫"简单"',
        body: '格点只出现在 8 个顶角，一个不多——"P"就是 Primitive（原始）的意思。每个顶角被 8 个相邻单胞分享，8×1/8 恰好凑成 1 个格点。',
        anchor: 'corner',
      },
      {
        title: '最松的堆法',
        body: '沿棱方向才是最近邻，距离就是 a。每个格点只有 6 个贴身邻居（上下前后左右），是三维格子里最低的配位数——所以自然界几乎不用它堆金属。',
        anchor: 'aAxis',
      },
      {
        title: '立方的资格',
        body: '三条轴等长、两两垂直：绕任何一条轴转 90°，格子都回到自己。这种"完全平等"太苛刻，元素里只有 α-钋满足得了它。',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: '简单立方每个单胞含几个格点？',
        options: ['1 个', '2 个', '4 个'],
        answer: 0,
        explain: '8 个顶角各被 8 个单胞分享：8×1/8 = 1。',
      },
      {
        question: '简单立方的配位数（最近邻个数）是？',
        options: ['4', '6', '8'],
        answer: 1,
        explain: '沿三条晶轴的正、负方向各一个，共 6 个。',
      },
    ],
  },
  'cubic-i': {
    lesson: [
      {
        title: '心化是什么',
        body: '在惯用胞里"额外加点"就叫心化。体心立方在 8 个顶角之外、正中央再放一个格点——格子密度直接翻倍，但晶胞形状一点没变。',
        anchor: 'bodyCenter',
      },
      {
        title: '最近邻搬家了',
        body: '加点之后，体对角线方向的距离（√3a/2 ≈ 0.866a）比棱更短。最近邻从棱上的 6 个换成体对角线上的 8 个——心化改变了"谁挨着谁"。',
        anchor: 'corner',
      },
      {
        title: '金属为什么偏爱它',
        body: '8 个近邻方向让原子在高温下也能高效堆挤：铁在 912℃ 以上、铬和钨在全部温区都选 bcc。绕 c 轴的四重对称仍在，立方身份未丢。',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: '体心立方的最近邻有几个？',
        options: ['6 个', '8 个', '12 个'],
        answer: 1,
        explain: '从任一格点出发，8 条体对角线方向各有一个等距邻居（√3a/2）。',
      },
      {
        question: '体心立方每胞的格点数是？',
        options: ['1', '2', '4'],
        answer: 1,
        explain: '顶角 8×1/8 = 1，加体心 1 个，共 2 个。',
      },
    ],
  },
  'cubic-f': {
    lesson: [
      {
        title: '面心加在哪',
        body: '六个面的正中央各补一个格点。每个面心被上下两个单胞平分：6×1/2 = 3，加上顶角凑出的 1 个，每胞共 4 个格点。',
        anchor: 'faceCenter',
      },
      {
        title: '为什么最密',
        body: '面对角线的一半（a/√2 ≈ 0.707a）比棱更短，每个格点沿面对角线数出 12 个等距近邻——这是三维能达到的最高配位数，密堆积的签名。',
        anchor: 'corner',
      },
      {
        title: '账本与原胞',
        body: '4 个格点说明惯用胞"装多了"：真正的原胞是斜置的小菱方体，体积只有它的 1/4。惯用胞是为了照顾立方对称才保留的大包装。',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: '面心立方的配位数是？',
        options: ['8', '12', '14'],
        answer: 1,
        explain: '12 个最近邻沿面对角线方向，是三维格子的最高配位数。',
      },
      {
        question: '面心立方每胞格点数是？',
        options: ['2', '3', '4'],
        answer: 2,
        explain: '8×1/8 + 6×1/2 = 4 个。',
      },
    ],
  },
  'tetragonal-p': {
    lesson: [
      {
        title: '从立方到四方',
        body: '抓住立方的一条轴往外拉、其余不动：底面还是正方形，盒子变高了。a=b 的身份保住，c 从此独立——这就是四方。',
        anchor: 'cAxis',
      },
      {
        title: '只剩一条四次轴',
        body: '拉长之后，原来三条等价的四次轴只剩沿 c 的一条还在。"四方"的对称底气，全押在这一根轴上。',
        anchor: 'aAxis',
      },
      {
        title: '少见但讲道理',
        body: '简单四方的结构在自然界少见，它主要是教学模型；不过理解了它，体心四方（白锡的家）就是顺手的事。',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: '四方晶系的轴长关系是？',
        options: ['a=b=c', 'a=b≠c', 'a≠b≠c'],
        answer: 1,
        explain: '底面仍是正方形（a=b），c 独立不等。',
      },
      {
        question: '把简单立方沿一条轴拉长，得到的是？',
        options: ['仍是立方', '简单四方', '简单正交'],
        answer: 1,
        explain: 'a=b≠c 且夹角全 90°，正是四方 P；若连 a=b 也破坏才降为正交。',
      },
    ],
  },
  'tetragonal-i': {
    lesson: [
      {
        title: '四方盒子加体心',
        body: '在简单四方的基础上往正中央补一个格点：继承"底面正方形"，多出一个心点。每胞 2 个格点，原胞体积减半。',
        anchor: 'bodyCenter',
      },
      {
        title: 'c/a 是个开关',
        body: '体心到顶角的距离由 c/a 决定。c/a=√2 时它恰好等于 a，这时格子可以整体改写成面心立方——fcc 与 bct 之间只隔一个轴比。',
        anchor: 'cAxis',
      },
      {
        title: '马氏体的故事',
        body: '钢淬火时，碳挤进 bcc 铁的间隙把 c 轴顶起来，格子变成体心四方——硬度飙升的秘密，就藏在这条被拉长的轴上。',
        anchor: 'aAxis',
      },
    ],
    quiz: [
      {
        question: '体心四方的格点位于？',
        options: ['仅顶角', '顶角 + 体心', '顶角 + 面心'],
        answer: 1,
        explain: 'I 心化：8 顶角 + 1 体心，每胞 2 个格点。',
      },
      {
        question: '体心四方与面心立方等价的临界 c/a 是？',
        options: ['1', '√2', '2'],
        answer: 1,
        explain: 'c/a=√2 时体心到顶角的距离恰等于 a，格子可改写为 fcc。',
      },
    ],
  },
  'ortho-p': {
    lesson: [
      {
        title: '三轴各走各路',
        body: '四方的 a=b 一旦也被打破，三条轴长度互不相同。盒子还是"正"的（全是直角），但三个方向再也不可互换。',
        anchor: 'aAxis',
      },
      {
        title: '对称只剩对折',
        body: '绕每条轴转 180° 格子才复原——像把盒子沿三个方向各对折一次。四方那条 90° 的四次轴，在正交系里已经消失。',
        anchor: 'bAxis',
      },
      {
        title: '常见的一族',
        body: '直角盒子朴素又百搭：文石、渗碳体（Fe₃C）以及大量有机晶体都住这里。"正交"名号虽低调，住户一点不少。',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: '正交晶系的轴长关系是？',
        options: ['a=b≠c', 'a=b=c', 'a≠b≠c'],
        answer: 2,
        explain: '三轴互不相等，但三个夹角都是 90°。',
      },
      {
        question: '简单正交每胞几个格点？',
        options: ['1', '2', '4'],
        answer: 0,
        explain: '仅 8 个顶角：8×1/8 = 1。',
      },
    ],
  },
  'ortho-c': {
    lesson: [
      {
        title: '底心加在哪',
        body: '在垂直 c 轴的那一对面的中心各放一个格点：顶面一个、底面一个，各被两胞平分。加上顶角的 1 个，每胞 2 个格点。',
        anchor: 'baseCenter',
      },
      {
        title: 'C 指的是那对面',
        body: '晶体学里 C 心专指垂直 c 轴的 ab 面心化。α-铀、α-镓、黑磷都用它——心化让它们的原胞体积减半。',
        anchor: 'cAxis',
      },
      {
        title: '和 P 的血缘',
        body: '换一套更斜的基矢，底心正交可以改写成体积减半的 P 格子。它被单列为独立成员，只是因为标准设定里更直观。',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: '底心正交的"底心"加在哪个面？',
        options: ['垂直 a 轴的面', '垂直 c 轴的面', '全部六个面'],
        answer: 1,
        explain: 'C 心专指垂直 c 轴的那一对 ab 面的中心。',
      },
      {
        question: '底心正交每胞格点数是？',
        options: ['1', '2', '4'],
        answer: 1,
        explain: '8×1/8 + 2×1/2 = 2。',
      },
    ],
  },
  'ortho-i': {
    lesson: [
      {
        title: '鞋盒的正中央',
        body: '心化不挑盒子：任何"直角盒子"都可以往正中央补一个格点。体心正交因此存在，每胞 2 个格点、原胞减半。',
        anchor: 'bodyCenter',
      },
      {
        title: '对称走下坡',
        body: '立方 I 里体心到 8 个顶角等距；正交 I 里 a≠b≠c，这 8 条线分成长短两组。对称越低，"特殊"就越少。',
        anchor: 'corner',
      },
      {
        title: '补全组合表',
        body: '正交系共有 P/C/I/F 四种心化——体心这份在自然界少见（高压硅有 Imma 相），但"晶系 × 心化"的乘法表不能缺它。',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: '体心正交每胞格点数是？',
        options: ['1', '2', '4'],
        answer: 1,
        explain: '顶角 8×1/8 = 1，加体心 1 个，共 2。',
      },
      {
        question: '体心正交中，体心到 8 个顶角的距离？',
        options: ['全部相等', '分成长短两组', '全部不同'],
        answer: 1,
        explain: 'a≠b≠c 让 8 条体对角线分成等长的两组（各 4 条）。',
      },
    ],
  },
  'ortho-f': {
    lesson: [
      {
        title: '六面全加',
        body: '六个面心都补上格点：每胞 4 个，和面心立方同一个账本。不同的是盒子本身——三轴长度互不相等。',
        anchor: 'faceCenter',
      },
      {
        title: '面对角线不再等价',
        body: '立方 F 里 12 条面对角线全等；正交 F 中三种面形状不同，最近邻只落在最短的那条面对角线上。',
        anchor: 'aAxis',
      },
      {
        title: 'α-硫的家',
        body: '斜方硫（α-S）是面心正交的实例：S₈ 环按 F 排布。对称低于立方，但心化的几何逻辑完全一致。',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: '面心正交每胞几个格点？',
        options: ['2', '3', '4'],
        answer: 2,
        explain: '8×1/8 + 6×1/2 = 4。',
      },
      {
        question: '面心正交与面心立方的本质差别是？',
        options: ['格点位置规则不同', '三轴不再等长', '每胞格点数不同'],
        answer: 1,
        explain: '账本相同（每胞 4 个格点），差别在于正交系 a≠b≠c。',
      },
    ],
  },
  'monoclinic-p': {
    lesson: [
      {
        title: '被推歪的盒子',
        body: '把正交盒子朝一边轻轻一推：a 与 c 之间的夹角 β 不再是直角（本图 110°）。"单斜"＝只往一个方向斜。',
        anchor: 'cAxis',
      },
      {
        title: 'b 轴是顶梁柱',
        body: '只有 b 轴还同时垂直于另外两条轴。绕 b 转 180° 是单斜格子剩下的主要对称——"唯一轴"的约定由此而来。',
        anchor: 'bAxis',
      },
      {
        title: '有机晶体的常态',
        body: '分子大而形状不规则，堆起来稍一歪斜就掉进单斜。萘、蔗糖等大量有机晶体都是单斜 P 的住户。',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: '标准设定下单斜晶系哪个角可以不是 90°？',
        options: ['α', 'β', 'γ'],
        answer: 1,
        explain: '约定 α=γ=90°，只允许 β（a 与 c 的夹角）偏离直角。',
      },
      {
        question: '单斜晶系的唯一轴（2 重轴）是？',
        options: ['a', 'b', 'c'],
        answer: 1,
        explain: 'b 轴同时垂直于 a 和 c，2 重旋转沿 b 进行。',
      },
    ],
  },
  'monoclinic-c': {
    lesson: [
      {
        title: '歪盒子也能心化',
        body: '在单斜盒子的顶、底面中心各加一个格点。盒子虽歪，每个底心仍被两胞平分——心化规则不挑形状。',
        anchor: 'baseCenter',
      },
      {
        title: '石膏的家',
        body: '石膏（CaSO₄·2H₂O）的空间群是 C2/c：C 心就是它的骨架之一。歪盒子 + 底心，是许多含水盐类的标准住法。',
        anchor: 'corner',
      },
      {
        title: '与 P 的换算',
        body: '换一套基矢，底心单斜可以改写成体积减半的单斜 P。保留 C 设定，是为了让石膏这类结构在标准坐标里更好读。',
        anchor: 'bAxis',
      },
    ],
    quiz: [
      {
        question: '底心单斜每胞格点数是？',
        options: ['1', '2', '3'],
        answer: 1,
        explain: '8×1/8 + 2×1/2 = 2。',
      },
      {
        question: '石膏（CaSO₄·2H₂O）属于哪种布拉维格子？',
        options: ['简单单斜 P', '底心单斜 C', '面心正交 F'],
        answer: 1,
        explain: '石膏空间群为 C2/c，以 C 心单斜为骨架。',
      },
    ],
  },
  'triclinic-p': {
    lesson: [
      {
        title: '对称的谷底',
        body: '三个角全都不是直角（本图 75°/95°/85°）、三轴不等长。除了平移本身，格子拿不出任何旋转对称。',
        anchor: 'corner',
      },
      {
        title: '为什么无心化',
        body: '往三斜格子里加任何心点，都能换一套基矢改写成更小的 P 格子。所以 14 种布拉维格子里，三斜只占 P 一格。',
        anchor: 'aAxis',
      },
      {
        title: '蓝晶石住这',
        body: '蓝晶石（Al₂SiO₅）、五水硫酸铜都是三斜 P。低对称让晶面角各不相同，识别它们要靠光学而不是外形。',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: '三斜晶系有几个夹角通常不是 90°？',
        options: ['1 个', '2 个', '3 个'],
        answer: 2,
        explain: 'α、β、γ 一般全部偏离 90°。',
      },
      {
        question: '为什么三斜只有 P、没有 C/I/F？',
        options: ['对称不允许心化', '心化总可换基矢变回 P', '三斜晶体不存在'],
        answer: 1,
        explain: '三斜没有任何对称约束，任何心点都能被新基矢吸收，不产生新格子。',
      },
    ],
  },
  'rhombohedral-r': {
    lesson: [
      {
        title: '被捏过的立方',
        body: '抓住立方体的体对角线两端，均匀往里一捏：三轴仍然等长，但夹角全变成同一个非 90° 的角（本图 75°）。',
        anchor: 'aAxis',
      },
      {
        title: 'R 的两副面孔',
        body: '菱方胞本身是原胞——8 个顶角恰好 1 个格点；可一旦改用六方坐标描述，格点散成 (⅔,⅓,⅓) 等三处，"R 心"由此得名。',
        anchor: 'corner',
      },
      {
        title: '方解石与铋',
        body: '方解石（CaCO₃）、铋、砷、锑都是三方 R。沿体对角线方向的三重旋转，是这个家族保住的最高对称。',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: '菱方格子三轴的关系是？',
        options: ['等长且全直角', '等长但夹角≠90°', '不等长'],
        answer: 1,
        explain: 'a=b=c，但任意两轴夹角是同一个非 90° 的角。',
      },
      {
        question: '用六方坐标描述三方 R 格子时，六方胞含几个格点？',
        options: ['1', '2', '3'],
        answer: 2,
        explain: '六方描述下 R 心给出 3 个格点；菱方描述本身是 1 个格点的原胞。',
      },
    ],
  },
  'hexagonal-p': {
    lesson: [
      {
        title: '120° 的底面',
        body: '六方格子的底面不是正方形，而是 γ=120° 的菱形——两副这样的菱形拼出蜂巢般的密网。橙色线框就是内嵌的原胞。',
        anchor: 'cAxis',
      },
      {
        title: '棱柱与原胞',
        body: '六方棱柱是三倍大的"方便胞"：一个棱柱正好装 3 个菱形原胞。数一数顶角与中心的格点，就能数出这 3 来。',
        anchor: 'hexPoint',
      },
      {
        title: '石墨与镁的家',
        body: '把原子放到六方格点上、再配一个 (⅓,⅔,½) 的伙伴，就得到镁的 hcp 结构；石墨则在这套骨架上玩层状花样。',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: '六方晶系底面的 γ 角是？',
        options: ['90°', '120°', '60°'],
        answer: 1,
        explain: 'a=b、γ=120° 的菱形底面，铺出三角网。',
      },
      {
        question: '一个六方棱柱装得下几个原胞？',
        options: ['1', '2', '3'],
        answer: 2,
        explain: '棱柱体积是 γ=120° 菱形原胞的 3 倍，含 3 个格点。',
      },
    ],
  },
}
