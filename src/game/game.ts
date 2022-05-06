import * as Phaser from "phaser";
import Menu from "./scenes/menu/Menu";
import Game from "./scenes/game/Game";
import Preloader from "./scenes/preloader/Preloader";
import GameOver from "./scenes/gameOver/GameOver";

export default new Phaser.Game({
  type: Phaser.CANVAS,
  width: 800,
  height: 640,
  canvas: <HTMLCanvasElement>document.querySelector("#game"),
  scene: [Preloader, Menu, Game, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1800 },
      debug: true,
    },
  },
});
