import { Pokemon } from './types';

export const POKEMON_DATA: Pokemon[] = [
  {
    id: 1,
    name: "皮卡丘",
    type: ["电"],
    hp: 100,
    maxHp: 100,
    moves: [
      { name: "十万伏特", type: "电" },
      { name: "电光一闪", type: "一般" },
      { name: "铁尾", type: "钢" },
      { name: "电球", type: "电" }
    ],
    spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png",
    color: "bg-yellow-500"
  },
  {
    id: 2,
    name: "喷火龙",
    type: ["火", "飞行"],
    hp: 120,
    maxHp: 120,
    moves: [
      { name: "喷射火焰", type: "火" },
      { name: "空气斩", type: "飞行" },
      { name: "龙爪", type: "龙" },
      { name: "火焰漩涡", type: "火" }
    ],
    spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png",
    color: "bg-orange-500"
  },
  {
    id: 3,
    name: "水箭龟",
    type: ["水"],
    hp: 130,
    maxHp: 130,
    moves: [
      { name: "水炮", type: "水" },
      { name: "高速旋转", type: "一般" },
      { name: "咬碎", type: "恶" },
      { name: "冰冻光束", type: "冰" }
    ],
    spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/9.png",
    color: "bg-blue-500"
  },
  {
    id: 4,
    name: "妙蛙花",
    type: ["草", "毒"],
    hp: 125,
    maxHp: 125,
    moves: [
      { name: "飞叶风暴", type: "草" },
      { name: "污泥炸弹", type: "毒" },
      { name: "地震", type: "地面" },
      { name: "催眠粉", type: "草" }
    ],
    spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png",
    color: "bg-green-600"
  },
  {
    id: 5,
    name: "耿鬼",
    type: ["幽灵", "毒"],
    hp: 90,
    maxHp: 90,
    moves: [
      { name: "暗影球", type: "幽灵" },
      { name: "污泥波", type: "毒" },
      { name: "催眠术", type: "超能力" },
      { name: "食梦", type: "超能力" }
    ],
    spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/94.png",
    color: "bg-purple-600"
  },
  {
    id: 6,
    name: "超梦",
    type: ["超能力"],
    hp: 110,
    maxHp: 110,
    moves: [
      { name: "精神击破", type: "超能力" },
      { name: "波导弹", type: "格斗" },
      { name: "冰冻光束", type: "冰" },
      { name: "自我再生", type: "一般" }
    ],
    spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
    spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/150.png",
    color: "bg-pink-500"
  }
];
