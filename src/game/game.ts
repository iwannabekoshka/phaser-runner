import * as Phaser from "phaser";
import Menu from "./scenes/menu/Menu";
import Game from "./scenes/game/Game";
import Preloader from "./scenes/preloader/Preloader";
import GameOver from "./scenes/gameOver/GameOver";

export default new Phaser.Game({
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: <HTMLDivElement>document.querySelector("#canvas-container"),
    fullscreenTarget: <HTMLDivElement>(
      document.querySelector("#canvas-container")
    ),
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1110,
    height: 624,
  },
  canvas: <HTMLCanvasElement>document.querySelector("#game"),
  dom: {
    createContainer: true,
  },
  scene: [Preloader, Menu, Game, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1600 },
      // TODO: не заливать на прод
      // debug: true,
    },
  },
});
