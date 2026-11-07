import type { Guide } from './types'

export const GUIDES_ATOMIC_ZH: Record<string, Guide> = {
  'orbital-1s': {
    lesson: [
      {
        title: '形状从量子数来',
        body: 'n=1、l=0：没有角向结构，波函数只随 r 变化。三个量子数里，l=0 直接宣判了"球对称"。',
        anchor: 'nucleus',
      },
      {
        title: '等值面是什么',
        body: '显示的是 |ψ| 等于某个约定值的曲面。阈值是约定而非物理：拖动阈值滑块，球会收缩或膨胀。',
        anchor: 'bohrRadius',
      },
      {
        title: '最概然半径',
        body: '径向概率 P(r) 的峰在 r=a₀。注意区分：概率密度最大在核处，而"找到电子"的概率最大在 a₀。',
      },
    ],
    quiz: [
      {
        question: '1s 轨道的波节数目是？',
        options: ['0 个', '1 个', '2 个'],
        answer: 0,
        explain: '波节数 = n−l−1 = 0。基态没有波节，波函数处处同号。',
      },
      {
        question: '1s 电子"最可能被找到"的半径是？',
        options: ['核处（r=0）', '玻尔半径 a₀', '无穷远'],
        answer: 1,
        explain: '概率密度在核处最大，但要乘球壳体积：P(r)=4πr²|ψ|² 的峰在 a₀。',
      },
    ],
  },
  'orbital-2s': {
    lesson: [
      {
        title: '多了一个径向节',
        body: 'n=2 而 l=0：角向仍无结构，但径向函数 R(r) 出现一个零点。波节数公式 n−l−1=1，落在 r=2a₀。',
        anchor: 'nodeShell',
      },
      {
        title: '内外反相的双层',
        body: '金色波节球把空间分成两半：内球一个相位（琥珀）、外层相反相位（青）。透明度调低可以看清内层。',
        anchor: 'nucleus',
      },
      {
        title: '概率双峰',
        body: '2s 的径向概率有小内峰和大外峰，外峰约 5.2 a₀。n 越大，电子平均住得越远。',
        anchor: 'outerPeak',
      },
    ],
    quiz: [
      {
        question: '2s 轨道的波节是什么形状？',
        options: ['平面', '球面', '锥面'],
        answer: 1,
        explain: 'l=0 无角向节点，径向节点是同心球面（r=2a₀）。',
      },
      {
        question: '2s 与 2p 谁的能量低（自由氢原子中）',
        options: ['2s 低', '2p 低', '一样高'],
        answer: 2,
        explain: '氢原子能级只依赖 n：2s 与 2p 简并。多电子原子中才因钻穿效应分高低。',
      },
    ],
  },
  'orbital-2p': {
    lesson: [
      {
        title: '哑铃的来历',
        body: 'l=1 带来一个角向波节：ψ 在一个平面上恒为零。平面两侧各成一"瓣"，形状自然成哑铃。',
        anchor: 'nodeCenter',
      },
      {
        title: '两瓣相位相反',
        body: '琥珀瓣 ψ>0、青瓣 ψ<0。相位符号对概率无影响，但决定了轨道叠加时的干涉方式--化学键的方向性由此而来。',
        anchor: 'lobeTop',
      },
      {
        title: '三兄弟互相垂直',
        body: '切到"三方向同看"：pz 沿 z 轴、px、py 沿 x、y 轴，三组哑铃正交叠放。它们能量相同（简并），只是取向不同。',
        anchor: 'lobeBottom',
      },
    ],
    quiz: [
      {
        question: '三个 p 轨道的波节面相互垂直吗？',
        options: ['是，两两垂直', '否，互相平行', '没有固定关系'],
        answer: 0,
        explain: 'pz、px、py 的波节面分别是 z=0、x=0、y=0 平面，两两垂直。',
      },
      {
        question: 'pz 轨道的波节面是？',
        options: ['z=0 平面', 'x=0 平面', '半径 2a₀ 的球面'],
        answer: 0,
        explain: 'pz ∝ z：z=0 处恒为零，正是两瓣之间的"切面"。',
      },
    ],
  },
  'orbital-3d-xy': {
    lesson: [
      {
        title: '切四刀出四瓣',
        body: '两个互相垂直的平面波节（x=0 与 y=0）把空间切成四份，每份一瓣。瓣沿 45° 对角线伸展，不贴坐标轴。',
        anchor: 'nodePlaneX',
      },
      {
        title: '相位交替',
        body: '绕 z 轴转一圈，相位正负交替四次：对角同相、相邻反相。dxy 的下标 xy 正说明它∝x·y。',
        anchor: 'lobeQuadrant',
      },
      {
        title: '五重简并的家族',
        body: 'd 家族共 5 个轨道（dxy、dyz、dxz、dx²−y²、dz²），自由原子中能量相同。晶体场中按取向分组劈裂（eg/t₂g）。',
      },
    ],
    quiz: [
      {
        question: 'dxy 轨道有几个波节面？',
        options: ['1 个', '2 个', '3 个'],
        answer: 1,
        explain: 'l−|m|=0 个锥形节 + |m|=2 个平面节，共两个垂直平面。',
      },
      {
        question: 'dxy 四个瓣的相位关系是？',
        options: ['全部同相', '相邻瓣反相、对角瓣同相', '随机分布'],
        answer: 1,
        explain: '绕轴一周符号变化四次：正-负-正-负交替。',
      },
    ],
  },
  'orbital-3d-z2': {
    lesson: [
      {
        title: '长得最不像的 d 轨道',
        body: 'dz² 是 d 家族里的"异类"：沿 z 轴两个瓣 + 赤道一圈环带。其余四个 d 轨道都是四叶形，只有它例外。',
        anchor: 'lobeTop',
      },
      {
        title: '环带来自哪一项',
        body: '球谐函数 (3cos²θ−1)：在 θ=90°（赤道）它取 −1，在两极取 +2。正负区之间夹着两个锥形波节。',
        anchor: 'ringBand',
      },
      {
        title: '环与瓣反相',
        body: '赤道环带与两极的瓣相位相反（青与琥珀）。它不是"环+瓣"的拼装，而是一个整体的数学解。',
        anchor: 'lobeTop',
      },
    ],
    quiz: [
      {
        question: 'dz² 的波节面是什么形状？',
        options: ['两个平面', '两个锥面', '一个球面'],
        answer: 1,
        explain: 'cos²θ=1/3 给出两个以 z 轴为轴的锥面（θ≈54.7°、125.3°）。',
      },
      {
        question: 'dz² 赤道环带与两瓣的相位关系？',
        options: ['相同', '相反', '部分相同'],
        answer: 1,
        explain: '(3cos²θ−1) 在赤道为负、在两极为正：环带与瓣反相。',
      },
    ],
  },
  'electron-cloud-1s': {
    lesson: [
      {
        title: '雾即概率',
        body: '每个点是 |ψ|² 的一次虚拟抽样。雾越浓，在那里找到电子的概率密度越大--这是对"电子云"最字面的翻译。',
        anchor: 'nucleus',
      },
      {
        title: '玻尔的轨道 vs 量子的雾',
        body: '金色球壳标出 r=a₀。玻尔想象电子贴着壳跑圈；量子力学只保证"在这附近最容易找到它"。',
        anchor: 'bohrShell',
      },
      {
        title: '没有边界',
        body: '雾只是越远越稀，从不真正消失。把"原子半径"定义为 90% 概率球，得到 r≈2.66 a₀。',
        anchor: 'cloudEdge',
      },
    ],
    quiz: [
      {
        question: '电子云的"浓淡"代表什么？',
        options: ['电子的速度', '找到电子的概率密度', '电子的电量'],
        answer: 1,
        explain: '点密度 ∝ |ψ|²，即位置测量的概率密度。',
      },
      {
        question: '1s 电子云在哪个半径附近最"厚"？',
        options: ['核处', '玻尔半径 a₀ 附近', '均匀分布'],
        answer: 1,
        explain: '密度峰值在核处，但乘上体积因子后视觉最厚的环带在 a₀ 附近。',
      },
    ],
  },
  'radial-distribution': {
    lesson: [
      {
        title: '为什么要乘 r²',
        body: '薄球壳的体积是 4πr²·dr：半径越大、同厚度壳装得越多。P(r)=4πr²|ψ|² 因此"外移"了峰位。',
        anchor: 'origin',
      },
      {
        title: '1s 的单峰',
        body: '金色曲线从零升起，在 a₀ 达峰后指数衰减。拖动滑块：高亮壳层滑过曲线，读数实时显示该处的 r 与 P(r)。',
        anchor: 'peak1s',
      },
      {
        title: '2s 的双峰与壳层',
        body: '青色曲线先小后大，中间被波节压低。化学家说的"壳层"，就是这些概率峰的位置。',
        anchor: 'peak2s',
      },
    ],
    quiz: [
      {
        question: '1s 的 P(r) 峰在哪个半径？',
        options: ['r=0', 'r=a₀', 'r=2a₀'],
        answer: 1,
        explain: 'r²e^(−2r) 的极值在 r=1（玻尔半径）。',
      },
      {
        question: 'P(r) 与 |ψ|² 的差别是什么？',
        options: ['没有差别', 'P(r) 多乘了体积因子 4πr²', 'P(r) 是 |ψ|² 的两倍'],
        answer: 1,
        explain: '球壳体积随 r² 增长，把峰位从核处推到 a₀。',
      },
    ],
  },
  'bohr-model': {
    lesson: [
      {
        title: '分立的轨道',
        body: '玻尔假设角动量只能取 nℏ 的整数倍：轨道半径 rₙ=0.529n² Å。电子在这些圆上"稳定运行"，不辐射能量。',
        anchor: 'level-1',
      },
      {
        title: '能级公式',
        body: 'Eₙ=−13.6/n² eV。n 越大能量越高（越接近 0）；n→∞ 时电子挣脱束缚--电离。',
        anchor: 'level-3',
      },
      {
        title: '点击轨道看跃迁',
        body: '点击任意轨道环：电子沿弧线跳层，向内跳发射光子（金色射线）、向外跳吸收。提示条显示能量差 ΔE。',
        anchor: 'photonPath',
      },
      {
        title: '半经典的遗产',
        body: '玻尔模型"轨道"的说法已被量子力学取代，但能级公式与跃迁思想完全保留--它是通往量子力学的桥。',
      },
    ],
    quiz: [
      {
        question: 'n=2 轨道的能量是？',
        options: ['−13.6 eV', '−6.8 eV', '−3.4 eV'],
        answer: 2,
        explain: 'E₂=−13.6/4=−3.4 eV。',
      },
      {
        question: '电子从 n=2 跳到 n=1 发射的光子能量是？',
        options: ['3.4 eV', '10.2 eV', '13.6 eV'],
        answer: 1,
        explain: 'ΔE=|E₁−E₂|=13.6×(1−1/4)=10.2 eV，即莱曼 α。',
      },
    ],
  },
  'shell-structure': {
    lesson: [
      {
        title: '一层一层往外填',
        body: '多电子原子按主量子数分层：K(n=1) 最多 2 个、L(n=2) 最多 8 个。泡利原理定死了每层的容量 2n²。',
        anchor: 'shell-k',
      },
      {
        title: '钠的三层',
        body: 'K 层 2 个、L 层 8 个先后填满，像洋葱一样把核裹紧。这 10 个电子合称"原子实"。',
        anchor: 'shell-l',
      },
      {
        title: '孤独的价电子',
        body: '第 11 个电子落在 M 层，离核最远、束缚最松。它一被夺走，钠就变成 Na⁺--钠的化学全是这一个电子的故事。',
        anchor: 'valenceElectron',
      },
    ],
    quiz: [
      {
        question: '钠有几个价电子？',
        options: ['1 个', '2 个', '8 个'],
        answer: 0,
        explain: 'Na 排布 1s²2s²2p⁶3s¹：最外层（M）只有 1 个 3s 电子。',
      },
      {
        question: 'M 层（n=3）理论上最多容纳几个电子？',
        options: ['8 个', '18 个', '32 个'],
        answer: 1,
        explain: '容量 2n²=2×9=18（3s²3p⁶3d¹⁰）。',
      },
    ],
  },
  'hydrogen-levels': {
    lesson: [
      {
        title: '一张越挤越密的梯',
        body: 'Eₙ=−13.6/n²：从 −13.6 eV 的基态往上，台阶间距按 1/n² 收窄，n→∞ 时并成连续（电离阈）。',
        anchor: 'level-1',
      },
      {
        title: '箭头即谱线',
        body: '每条跃迁箭头的长度正比于光子能量。落到 n=1 的是紫外（莱曼系），落到 n=2 的落在可见区（巴尔末系）。',
        anchor: 'balmer-alpha',
      },
      {
        title: 'Hα 的红',
        body: '3→2 跃迁 1.89 eV，波长 656.3 nm--氢光谱中最红的线。你在霓虹里看到的氢红光就是它。',
        anchor: 'level-2',
      },
    ],
    quiz: [
      {
        question: '巴尔末系的跃迁都落到哪个能级？',
        options: ['n=1', 'n=2', 'n=3'],
        answer: 1,
        explain: '落到 n=2 的跃迁落在可见光区，组成巴尔末系。',
      },
      {
        question: 'Hα 线（3→2）的波长约是？',
        options: ['121.6 nm', '486.1 nm', '656.3 nm'],
        answer: 2,
        explain: '1.89 eV 对应 656.3 nm 的红光；486.1 nm 是 Hβ（4→2）。',
      },
    ],
  },
  'fine-splitting': {
    lesson: [
      {
        title: '自旋是个小磁铁',
        body: '电子有自旋磁矩。绕核运动时，在电子看来核在转圈--产生一个磁场。小磁铁在磁场里顺着或逆着，能量不同。',
        anchor: 'level2pThree',
      },
      {
        title: '一条能级劈成两条',
        body: '2p 劈裂为 ₂p₁/₂（低）与 ₂p₃/₂（高），对应 j=l±½。劈裂量正比于 α²，约为基态能量的十万分之几。',
        anchor: 'level2pHalf',
      },
      {
        title: '孪生的黄线',
        body: '钠的价电子从劈裂双层落回基态，发出 589.0 与 589.6 nm 两条黄线（D 双线）。图中间距放大了近千倍。',
        anchor: 'dLinePair',
      },
    ],
    quiz: [
      {
        question: '钠 D 双线的成因是？',
        options: ['两种同位素', '自旋-轨道耦合导致的能级劈裂', '多普勒展宽'],
        answer: 1,
        explain: '自旋与轨道磁场的相互作用把 3p 劈成双层，跃迁出双线。',
      },
      {
        question: '自旋-轨道劈裂随原子序数 Z 如何变化？',
        options: ['随 Z⁴ 快速增大', '与 Z 无关', '随 Z 减小'],
        answer: 0,
        explain: '劈裂 ∝ Z⁴：重原子的精细结构显著得多。',
      },
    ],
  },
}
