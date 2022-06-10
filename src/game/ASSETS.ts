/**
 * key - идентификатор;
 * imageUrl - путь до картинки из папки public;
 * dataFileUrl - путь до json-a со спрайтами;
 * animations - объект с ключами анимаций;
 */
const ASSETS = {
  bg: {
    key: "bg",
    imageUrl: "/game/office/background_new.png",
  },
  player: {
    key: "player",
    imageUrl: "/game/player/player.png",
    dataFileUrl: "/game/player/player.json",
    animations: {
      run: "animationPlayerRun",
      flamesOn: "animationPlayerFlamesOn",
      fly: "animationPlayerFly",
      fall: "animationPlayerFall",
      death: "death",
    },
  },
  coin: {
    key: "coin",
    imageUrl: "/game/office/buffs/plus_money.png",
  },
  buffCoffee: {
    key: "buffCoffee",
    imageUrl: "/game/office/buffs/coffee.png",
  },
  buffX2: {
    key: "buffX2",
    imageUrl: "/game/office/buffs/x2.png",
  },
  buffBreak: {
    key: "buffBreak",
    imageUrl: "/game/office/buffs/donut/donut2.png",
    dataFileUrl: "/game/office/buffs/donut/donut2.json",
    animations: {
      idle: "animationBuffBreakIdle",
      pop: "animationBuffBreakPop",
    },
  },
  buffPvs: {
    key: "buffPvs",
    imageUrl: "/game/office/buffs/pvs.png",
  },
  buffMentor: {
    key: "buffMentor",
    imageUrl: "/game/office/buffs/mentor.png",
  },
  debuffBug: {
    key: "debuffBug",
    imageUrl: "/game/office/debuffs/bug.png",
  },
  debuffDeadline: {
    key: "debuffDeadline",
    imageUrl: "/game/office/debuffs/deadline.png",
  },
  debuffDebt: {
    key: "debuffDebt",
    imageUrl: "/game/office/debuffs/debt.png",
  },
  debuffDeploy: {
    key: "debuffDeploy",
    imageUrl: "/game/office/debuffs/deploy.png",
  },
  debuffTestFailed: {
    key: "debuffTestFailed",
    imageUrl: "/game/office/debuffs/test_failed.png",
  },
  fontArcade: {
    key: "fontArcade",
    imageUrl: "/game/fonts/arcade/arcade.png",
    dataFileUrl: "/game/fonts/arcade/arcade.xml",
  },
  fontDoubleShadowed: {
    key: "fontDoubleShadowed",
    imageUrl: "/game/fonts/double_shadowed/double_shadowed_2.png",
    dataFileUrl: "/game/fonts/double_shadowed/double_shadowed_2.xml",
  },
  fontLifeIsStrangeDark: {
    key: "fontLifeIsStrangeDark",
    imageUrl: "/game/fonts/lifeisstrange_dark/lifeisstrange_dark.png",
    dataFileUrl: "/game/fonts/lifeisstrange_dark/lifeisstrange_dark.xml",
  },
  fontPribambasWhiteShadowed: {
    key: "fontPribambasWhiteShadowed",
    imageUrl:
      "/game/fonts/pribambas_white_shadowed/pribambas_white_shadowed.png",
    dataFileUrl:
      "/game/fonts/pribambas_white_shadowed/pribambas_white_shadowed.xml",
  },
  fontPribambasBlack: {
    key: "fontPribambasBlack",
    imageUrl: "/game/fonts/pribambas_black/pribambas_black.png",
    dataFileUrl: "/game/fonts/pribambas_black/pribambas_black.xml",
  },
};

export default ASSETS;
