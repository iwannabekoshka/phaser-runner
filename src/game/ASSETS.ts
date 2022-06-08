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
    imageUrl: "/game/office/buffs/donut.png",
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
};

export default ASSETS;
