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
    imageUrl: "/game/office/buffs/coin/coin.png",
    dataFileUrl: "/game/office/buffs/coin/coin.json",
    animations: {
      idle: "animationBuffCoinIdle",
      pop: "animationBuffCoinPop",
    },
  },
  buffX2: {
    key: "buffX2",
    imageUrl: "/game/office/buffs/x2/x2.png",
    dataFileUrl: "/game/office/buffs/x2/x2.json",
    animations: {
      idle: "animationBuffX2Idle",
      pop: "animationBuffX2Pop",
    },
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
    imageUrl: "/game/office/buffs/pvs/pvs.png",
    dataFileUrl: "/game/office/buffs/pvs/pvs.json",
    animations: {
      idle: "animationBuffPvsIdle",
      pop: "animationBuffPvsPop",
    },
  },
  buffMentor: {
    key: "buffMentor",
    imageUrl: "/game/office/buffs/mentor/mentor.png",
    dataFileUrl: "/game/office/buffs/mentor/mentor.json",
    animations: {
      idle: "animationBuffMentorIdle",
      pop: "animationBuffMentorPop",
    },
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
  menuLogo: {
    key: "menuLogo",
    imageUrl: "/game/interface/game-logo.png",
  },
  menuBg: {
    key: "menuBg",
    imageUrl: "/game/interface/menu-bg.png",
  },
  btnStart: {
    key: "btnStart",
    imageUrl: "/game/interface/btn-start.png",
  },
  btnLeaderboard: {
    key: "btnLeaderboard",
    imageUrl: "/game/interface/btn-leaderboard.png",
  },
  btnMute: {
    key: "btnMute",
    imageUrl: "/game/interface/btn-mute.png",
  },
  btnInfo: {
    key: "btnInfo",
    imageUrl: "/game/interface/btn-info.png",
  },
  btnFullscreen: {
    key: "btnFullscreen",
    imageUrl: "/game/interface/btn-fullscreen.png",
  },
  cup: {
    key: "cup",
    imageUrl: "/game/interface/cup.png",
  },
  tutorial_1: {
    key: "tutorial_1",
    imageUrl: "/game/interface/tutorial/tutorial-1.png",
  },
  tutorial_2: {
    key: "tutorial_2",
    imageUrl: "/game/interface/tutorial/tutorial-2.png",
  },
  leaderboard: {
    key: "leaderboard",
    imageUrl: "/game/interface/leaderboard/leaderboard.png",
  },
  btnAgain: {
    key: "btnAgain",
    imageUrl: "/game/interface/btn-again.png",
  },
  btnSubscribe: {
    key: "btnSubscribe",
    imageUrl: "/game/interface/btn-subscribe.png",
  },
  deadscreen: {
    key: "deadscreen",
    imageUrl: "/game/interface/deadscreen/dead-screen.svg",
  },
};

export default ASSETS;
