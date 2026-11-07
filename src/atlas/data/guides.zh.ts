import type { Guide } from './types'

export const GUIDES_ZH: Record<string, Guide> = {
  nacl: {
    lesson: [
      {
        title: '两套穿插的格子',
        body: '把 Na⁺ 与 Cl⁻ 分别看待：各自都构成一套完整的面心立方格子，两套格子沿晶棱平移半个周期后互相穿过对方。',
        anchor: 'na-site',
      },
      {
        title: '八面体空隙全满',
        body: '从 Na⁺ 亚格子看，Cl⁻ 恰好填满了全部八面体空隙--fcc 的八面体空隙数等于格点数，所以配位数是 6。',
        anchor: 'cl-site',
      },
      {
        title: '最近邻的静电账',
        body: '每个 Na⁺ 与 6 个 Cl⁻ 相距 2.82 Å，静吸引强于同号排斥，晶格因此稳定。',
        anchor: 'na-cl-bond',
      },
      {
        title: '为什么解理面是 (001)',
        body: '沿 (001) 面掰开时，断开的是 Na⁺ 层与 Cl⁻ 层之间的静电作用，比断开层内同号离子的排斥面容易得多。',
      },
    ],
    quiz: [
      {
        question: 'NaCl 结构中，Cl⁻ 相对 Na⁺ 亚格子占据的位置是？',
        options: ['全部四面体空隙', '全部八面体空隙', '一半八面体空隙'],
        answer: 1,
        explain: 'fcc 的八面体空隙数等于格点数，恰好被 Cl⁻ 全部占据，因此配位数为 6。',
      },
      {
        question: '每个 Na⁺ 的最近邻 Cl⁻ 数目是？',
        options: ['4', '6', '8'],
        answer: 1,
        explain: '正八面体配位，最近邻 6 个。',
      },
    ],
  },
  diamond: {
    lesson: [
      {
        title: 'fcc + 双原子基元',
        body: '金刚石结构的布拉维格子是 fcc，但每个格点挂两个原子：一个在格点上，一个在体对角线 1/4 处。',
        anchor: 'c-atom',
      },
      {
        title: '体对角线错位',
        body: '第二个原子沿 (¼,¼,¼) 方向错开，形成了向内收缩的第二套穿插格子，两套格子的原子严格交替。',
        anchor: 'inner-c',
      },
      {
        title: '正四面体配位',
        body: '每个碳原子与 4 个最近邻成正四面体，键角 109.47°，正是 sp³ 杂化的方向。',
        anchor: 'c-c-bond',
      },
    ],
    quiz: [
      {
        question: '金刚石结构中，基元第二个原子相对 fcc 格点的平移是？',
        options: ['(½,½,0)', '(¼,¼,¼)', '(½,½,½)'],
        answer: 1,
        explain: '沿体对角线 1/4 处；(½,½,0) 是面心平移，会退回同一套格子。',
      },
      {
        question: '金刚石结构每个惯用胞包含几个原子？',
        options: ['4', '8', '12'],
        answer: 1,
        explain: 'fcc 格点贡献 4 个 + 基元第二原子贡献 4 个，共 8 个。',
      },
    ],
  },
  cscl: {
    lesson: [
      {
        title: '两套穿插的简单立方',
        body: '把两种离子分开看：Cs⁺ 一套简单立方，Cl⁻ 一套简单立方，后者整体平移到前者的体心。',
        anchor: 'cs-site',
      },
      {
        title: '体心处的 Cl⁻',
        body: '从 Cs⁺ 格子看，Cl⁻ 恰好填在立方体空隙（体心）处；简单立方的空隙数等于格点数。',
        anchor: 'cl-site',
      },
      {
        title: '8 配位的体对角线',
        body: '最近邻方向全部沿体对角线，每个离子周围 8 个异号离子构成一个立方体。',
        anchor: 'cs-cl-bond',
      },
      {
        title: '它不是体心立方',
        body: 'BCC 是"同种格点 + 体心平移"的布拉维格子；CsCl 是简单布拉维格子 + 双原子基元。判据：平移后离子是否相同。',
      },
    ],
    quiz: [
      {
        question: 'CsCl 结构的布拉维格子类型是？',
        options: ['体心立方 BCC', '简单立方', '面心立方 FCC'],
        answer: 1,
        explain: '两种离子各自构成简单立方格子；BCC 指单一格点集合的体心平移，不能描述两种离子的穿插。',
      },
      {
        question: 'CsCl 中每个离子的最近邻异号离子数是？',
        options: ['6', '8', '12'],
        answer: 1,
        explain: '沿体对角线方向共 8 个。',
      },
    ],
  },
}
