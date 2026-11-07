import type { Guide } from './types'

export const GUIDES_CRYSTAL2_ZH: Record<string, Guide> = {
  zincblende: {
    lesson: [
      {
        title: '金刚石的替身',
        body: 'Zn 排成 fcc 亚格子，S 亚格子沿体对角线错开 (¼,¼,¼)--把金刚石的两套碳亚格子分别换成 Zn 和 S，就得到闪锌矿。',
        anchor: 'zn-site',
      },
      {
        title: '四面体配位 4:4',
        body: '每个 Zn 与 4 个 S 成正四面体（2.34 Å），每个 S 也被 4 个 Zn 包围：两套亚格子地位完全对等。',
        anchor: 'zn-s-bond',
      },
      {
        title: '面心原子的邻居',
        body: '面心原子与顶角原子同属一套亚格子，但它的 4 个最近邻全在另一套亚格子里--换个原子重数一遍，四面体配位处处成立。',
        anchor: 'face-atom',
      },
      {
        title: '半导体的祖宅',
        body: 'GaAs、InSb、CdTe、立方 SiC 全都照抄这套几何：两种原子各带一套 fcc，四面体键天然给出 sp³ 型方向性成键。',
        anchor: 's-site',
      },
    ],
    quiz: [
      {
        question: '闪锌矿结构中，S 亚格子相对 Zn 亚格子的平移是？',
        options: ['(¼,¼,¼)', '(½,½,½)', '(½,½,0)'],
        answer: 0,
        explain: '沿体对角线错开 1/4，正是四面体键的指向；(½,½,0) 是面心平移，(½,½,½) 得到的是另一类结构。',
      },
      {
        question: '闪锌矿每个惯用胞含多少个原子？',
        options: ['4', '8', '12'],
        answer: 1,
        explain: 'fcc 格点贡献 4 个 Zn，错位基元再贡献 4 个 S，共 8 个。',
      },
    ],
  },
  wurtzite: {
    lesson: [
      {
        title: '六方版金刚石',
        body: '两套六方亚格子沿 c 轴错开：Zn 一套、S 一套，内参量 u = 0.375 定下错开的高度；每个原子仍是 4 配位正四面体。',
        anchor: 'zn-site',
      },
      {
        title: '与闪锌矿只差堆垛',
        body: '四面体框架完全一样（Zn–S 2.34 Å），差别只在密排层层序：立方 …ABCABC… 变六方 …ABAB…。',
        anchor: 'zn-s-bond',
      },
      {
        title: '极性 c 轴',
        body: '沿 c 轴 Zn 层与 S 层交替出现，正负电荷中心不重合--GaN 的压电极化、异质界面电荷都源于这条极轴。',
        anchor: 'c-axis',
      },
      {
        title: '小而紧凑的原胞',
        body: '六方原胞只装 4 个原子（Zn×2 + S×2），而闪锌矿惯用胞要装 8 个--原胞大小是堆垛方式的账面体现。',
        anchor: 's-site',
      },
    ],
    quiz: [
      {
        question: '纤锌矿与闪锌矿的根本差别是？',
        options: ['配位数不同', '四面体层的堆垛序不同', '化学键类型不同'],
        answer: 1,
        explain: '两者同为 4:4 四面体配位、键长同为 2.34 Å，差别只在层序：ABAB（六方）对 ABCABC（立方）。',
      },
      {
        question: '纤锌矿 ZnS 每个六方原胞含几个原子？',
        options: ['2', '4', '8'],
        answer: 1,
        explain: 'Zn×2 + S×2 = 4；8 个是闪锌矿惯用胞的数目。',
      },
    ],
  },
  graphite: {
    lesson: [
      {
        title: '层内：蜂巢与 sp²',
        body: '每层是一个六角蜂巢：碳 3 配位、层内 C–C 1.42 Å。每个碳剩 1 个 π 电子在层间巡游，沿层导电全靠它们。',
        anchor: 'in-plane-bond',
      },
      {
        title: '层间：AB 堆垛',
        body: 'B 层相对 A 层水平错开：一半原子正对下层原子、一半落在六角环中心上方。c = 6.71 Å 装下两层，每胞共 4 个原子。',
        anchor: 'layer-b',
      },
      {
        title: '强键与弱键的反差',
        body: '层内 1.42 Å 共价键对层间 3.35 Å 范德华：沿层易滑动（润滑），垂直层向电子难跳跃--各向异性的几何根源。',
        anchor: 'interlayer',
      },
      {
        title: '环心空位',
        body: '六角环中心是层间最高对称的空位：嵌入锂、钾等客体时优先占据这里，把层撑开、间距翻倍，蜂巢本身不变。',
        anchor: 'hollow-site',
      },
    ],
    quiz: [
      {
        question: '石墨的层内 C–C 键长与层间距约为？',
        options: ['1.42 Å 与 3.35 Å', '1.54 Å 与 2.46 Å', '3.35 Å 与 6.71 Å'],
        answer: 0,
        explain: '层内 sp² 键 1.42 Å（比金刚石 1.545 Å 短），层间范德华 3.35 Å。',
      },
      {
        question: '石墨（Bernal 型）沿 c 轴的堆垛顺序是？',
        options: ['ABCABC', 'ABAB', '完全随机'],
        answer: 1,
        explain: 'Bernal 石墨按 ABAB 堆垛；ABCABC 是菱方石墨，完全随机是无序碳。',
      },
    ],
  },
  'cu-fcc': {
    lesson: [
      {
        title: '密排的账本',
        body: '面心立方是最密的两种堆法之一（堆积率 74%）：8 个顶角各计 1/8、6 个面心各计 1，每胞净 4 个原子。',
        anchor: 'corner-atom',
      },
      {
        title: '12 个最近邻',
        body: '每个原子被 12 个最近邻围住：同层 6 个 + 上下层各 3 个，距离 2.55 Å（= a/√2）。金属键无方向性，只求最密。',
        anchor: 'nn-pair',
      },
      {
        title: 'ABC 堆垛与密排面',
        body: '沿 (111) 法线看，密排层按 A、B、C 轮转：第三层不回到 A 正上方--这是 fcc 与 hcp 的分水岭。',
        anchor: 'close-packed-plane',
      },
      {
        title: '面心的分量',
        body: '顶角原子更像记账技巧，真正撑起密堆的是面心原子：抽掉面心就退回简单立方，配位数从 12 跌到 6。',
        anchor: 'face-atom',
      },
    ],
    quiz: [
      {
        question: 'fcc 铜每个原子的最近邻数目是？',
        options: ['8', '10', '12'],
        answer: 2,
        explain: '密堆积的标志：12 配位 = 同层 6 个 + 上下层各 3 个。',
      },
      {
        question: 'fcc 密排面的堆垛顺序是？',
        options: ['ABAB', 'ABCABC', 'AABB'],
        answer: 1,
        explain: '第三层错开到 C 位、第四层才回到 A；ABAB 对应 hcp（如镁）。',
      },
    ],
  },
  'fe-bcc': {
    lesson: [
      {
        title: '先数原子',
        body: '8 个顶角各计 1/8 + 体心 1 个 = 每胞 2 个。注意与 CsCl 的区别：这里顶点与体心是同种原子，(½,½,½) 平移后格子不变。',
        anchor: 'corner-atom',
      },
      {
        title: '8 + 6 的配位',
        body: '最近邻 8 个全沿体对角线（2.48 Å = √3·a/2）；沿晶棱还有 6 个次近邻、恰为 a = 2.87 Å，只远 15%--bcc 的"8 配位"带着 6 个近卫。',
        anchor: 'nn-pair',
      },
      {
        title: '对角线是骨架',
        body: '每条体对角线上顶角—体心—顶角等距串联；认准 4 条对角线方向，每个原子的 8 个最近邻就数完了。',
        anchor: 'diagonal',
      },
      {
        title: '松一点的堆积',
        body: '堆积率 68% < 74%：bcc 不如 fcc/hcp 密，但空隙通道多、扩散快--铁磁性 α-Fe 的磁矩耦合也住在这套几何里。',
        anchor: 'body-atom',
      },
    ],
    quiz: [
      {
        question: 'α-Fe 中每个原子的最近邻数目是？',
        options: ['6', '8', '12'],
        answer: 1,
        explain: '8 个最近邻沿体对角线；另有 6 个稍远的次近邻沿晶棱（配位写作 8+6）。',
      },
      {
        question: 'bcc 与 fcc 的堆积率分别约为？',
        options: ['68% 与 74%', '74% 与 68%', '两者都是 74%'],
        answer: 0,
        explain: 'bcc 68%，fcc 与 hcp 是密堆积极限 74%。',
      },
    ],
  },
  'mg-hcp': {
    lesson: [
      {
        title: '两层一循环',
        body: '密排层 A 之后，第二层原子坐进 A 层的凹坑；第三层回到 A 正上方--ABAB 循环，这就是六方密堆积。',
        anchor: 'a-site',
      },
      {
        title: '两类空位，只选一种',
        body: 'A 层的凹坑分 B 位与 C 位两套：hcp 永远用同一套，fcc 则两套轮换。差别只在"第三层放哪"，配位数同为 12、堆积率同为 74%。',
        anchor: 'hollow-site',
      },
      {
        title: 'c 轴上的黄金比例',
        body: '两层密排面叠成 c = 5.21 Å，c/a = 1.624 几乎贴合理想刚球值 √(8/3) ≈ 1.633--镁因此被当作最标准的 hcp 金属。',
        anchor: 'c-axis',
      },
      {
        title: '清点 12 个最近邻',
        body: '同层 6 个 + 上层 3 个 + 下层 3 个；理想 hcp 里这 12 个距离都等于 a = 3.21 Å。',
        anchor: 'nn-pair',
      },
    ],
    quiz: [
      {
        question: 'hcp 镁的密排层堆垛顺序是？',
        options: ['ABCABC', 'ABAB', 'AABB'],
        answer: 1,
        explain: '六方密堆积第三层回到 A 正上方；ABCABC 属于 fcc（如铜）。',
      },
      {
        question: '理想 hcp 的 c/a 约为？',
        options: ['1.33', '1.63', '1.86'],
        answer: 1,
        explain: '刚球模型给出 √(8/3) ≈ 1.633；镁的实测值 1.624 非常接近。',
      },
    ],
  },
  perovskite: {
    lesson: [
      {
        title: '三套座位一个胞',
        body: '简单立方格子挂五原子基元：Sr 在顶角、Ti 在体心、O 在面心。三种原子各占一套高对称座位，互相把对方锁在正中。',
        anchor: 'sr-site',
      },
      {
        title: '面心的 O 是关节',
        body: '3 个 O 位于面心，沿棱方向把相邻八面体的角顶连起来--O 就是八面体共享的那个"角"。',
        anchor: 'o-site',
      },
      {
        title: 'TiO₆ 八面体框架',
        body: '每个 Ti 被面心的 6 个 O 围成 TiO₆ 八面体，八面体共顶角连成三维框架。功能全在 Ti 位：畸变一点，性质巨变（BaTiO₃ 的铁电性即源于此）。',
        anchor: 'octahedron',
      },
      {
        title: '键长由格子定死',
        body: 'Ti–O 1.95 Å 恰是体心到面心的 a/2：立方钙钛矿里键长不能单独伸缩，要畸变就得整个框架一起动。',
        anchor: 'ti-o-bond',
      },
    ],
    quiz: [
      {
        question: '立方钙钛矿 SrTiO₃ 中 Ti–O 键长约为？',
        options: ['a/4', 'a/2', 'a'],
        answer: 1,
        explain: 'Ti 在体心、O 在面心，键长 = a/2 = 3.905 Å / 2 ≈ 1.95 Å。',
      },
      {
        question: '钙钛矿的 TiO₆ 八面体以什么方式连接？',
        options: ['只共顶角', '沿 c 轴共棱', '共面相连'],
        answer: 0,
        explain: '八面体通过面心 O 共享角顶连成三维框架；沿 c 共棱成链的是金红石。',
      },
    ],
  },
  rutile: {
    lesson: [
      {
        title: '先看 Ti 的格子',
        body: 'Ti 排成体心四方格子：顶角一套 + 体心一套（相对平移 (½,½,½)），O 再把两套 Ti 缝在一起。',
        anchor: 'body-ti',
      },
      {
        title: '八面体串成链',
        body: '每个 Ti 有 6 个 O（TiO₆）；沿 c 轴八面体与上下邻居共享一对棱、笔直串成链--链向是金红石最"硬"的方向。',
        anchor: 'octahedra-chain',
      },
      {
        title: '两套键长',
        body: 'Ti–O 不等长：四条 1.94 Å + 两条 1.98 Å。八面体绕 c 轴稍转一格，就把 6 条键劈成两组。',
        anchor: 'ti-o-bond',
      },
      {
        title: 'O 是三向铰链',
        body: '每个 O 只配 3 个 Ti（同链 1 + 邻链 2），把几条八面体链的几何咬合在一起--Ti 6 配位与 O 3 配位就此对上账。',
        anchor: 'o-site',
      },
    ],
    quiz: [
      {
        question: '金红石中 TiO₆ 八面体沿 c 轴如何连接？',
        options: ['共顶角', '共棱', '共面'],
        answer: 1,
        explain: '沿 c 轴共棱成链，链与链之间才共顶角--与钙钛矿的全共顶角框架不同。',
      },
      {
        question: '金红石 TiO₂ 每个惯用胞含几个原子？',
        options: ['4', '6', '8'],
        answer: 1,
        explain: '2 Ti + 4 O = 6。',
      },
    ],
  },
  fluorite: {
    lesson: [
      {
        title: 'fcc 打底',
        body: 'Ca²⁺ 排成面心立方（顶点 + 面心，每胞 4 个），与 NaCl 的 Cl、闪锌矿的 Zn 同一套几何--差别全在往空隙里填什么。',
        anchor: 'ca-site',
      },
      {
        title: '四面体位全满',
        body: 'fcc 的四面体空隙数是原子数的两倍：4 个 Ca 配 8 个空位，F⁻ 恰好全部占满（Ca 配位 8、F 配位 4）。',
        anchor: 'f-tetrahedral',
      },
      {
        title: '8 配位的小立方',
        body: '每个 Ca 正坐在 8 个 F 围成的小立方体中心（Ca–F 2.37 Å）；反过来每个 F 被 4 个 Ca 围成正四面体。',
        anchor: 'ca-f-bond',
      },
      {
        title: '填隙程度的谱系',
        body: '同一套 fcc 亚格子：八面体位全满是 NaCl、四面体位填一半是闪锌矿、四面体位全满就是萤石--原型之间只隔一个"填多少"。',
        anchor: 'fcc-sublattice',
      },
    ],
    quiz: [
      {
        question: '萤石结构中 Ca 的配位数是？',
        options: ['4', '6', '8'],
        answer: 2,
        explain: 'Ca 被 8 个 F 围成小立方体；反过来 F 被 4 个 Ca 围成四面体（8 : 4）。',
      },
      {
        question: '反萤石结构（如 Na₂O）与萤石的差别是？',
        options: ['正负离子位置互换', '四面体空隙只填一半', '布拉维格子不同'],
        answer: 0,
        explain: '负离子改占 fcc 格点、正离子填满四面体位--配位关系对调成 4 : 8。',
      },
    ],
  },
}
