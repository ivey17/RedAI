import { Post, Album } from './types';

import { MOCK_POSTS } from './mockData';

export { MOCK_POSTS };

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'a1',
    title: '我的北欧家具灵感',
    count: 24,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOVjlTjvQvOZ8JMLLkxJ8DSBFWoxzJBALqIzz2NjSS-u6Tkv8x2C-niynqquPewWoSE9eRFg0frsMBaffaJZMANYRsMjKXrn-bsxQs_bHqPlNftt_1W3b1d47BpmSA9IQw7sH0AoTJvO3KZ2f-EXyXK06vlzigdQiRlBiURh8G6NNHDaXOeFavvrQoW0LZAemuaDSsG52LRLp-ACfh0LByRP1cMxF-cAKbjYE26VcYixZkCtoTOAgyuMaHBB3a3yUBbjema8qdrWI',
    posts: [MOCK_POSTS[1], MOCK_POSTS[2], MOCK_POSTS[0]]
  },
  {
    id: 'a2',
    title: '2024 春夏穿搭趋势',
    count: 12,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8oZG3BvhDGe-GByT1k18f-dprW4AGFyw5shNqPIdV5k8LucpaqcSAQCrvmnlwEPVS1z2BytfLY1GncZKZCrOCXQYclZVUq-FNXIji4e02u1ZmPRDX7YKPwkgR5_RCnS48y-tb1124DQ7o4G1t7FOWUcBZVPJH8TMQj_MlAteVEod2U-9DzS10Pt2ZWO8Q34cHpbG5Y-WbCgZkcIJJVQfPsso-uustWgnku5DdGyEdW_cQE8T_vBqv5opQW-7vUTuF816vd6wLhZ0',
    posts: [MOCK_POSTS[0], MOCK_POSTS[3]]
  },
  {
    id: 'a3',
    title: '健康减脂餐食谱',
    count: 56,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTz7tpI_WClSL0Ab4h00qNoCvGW63iYj07_JBSfGGNS_BX-ikjuuVHZSsCvemf4JWFNUVZ8By82hyBXWe-I237Swms7o-6a8FkP-s0gcPoqO6N0jXfrJIKxkZgmqaHu7KkjBdOpBTCN_9Yp2AhqN67pp1BURme0fFlCcUe_khBn_F95owimG3BfunEIFwriYOOD3erlUhvvs1UYvpj1FgE-2lQYn33O7ggnN51-yerwkjDbLDFeCQG_7bt1-fZICWdnh_dqVIZwSA',
    posts: [MOCK_POSTS[2], MOCK_POSTS[1]]
  }
];
