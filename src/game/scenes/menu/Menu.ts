import * as Phaser from "phaser";
import { SCENES } from "../SCENES";

export default class Menu extends Phaser.Scene {
  constructor() {
    super(SCENES.menu);
  }

  greetingsText: Phaser.GameObjects.Text | undefined;

  // Тут можно задавать дефолтные значения
  init() {}

  // Загрузка Ассетов
  preload() {}

  // Создание всего и вся
  create() {
    console.log("menu");

    // Text
    this.drawGreetings();

    //Events
    this.handleKeyboard();

    //TODO убрать переход на сцену игры
    this.goGameScene(this);
  }

  // Отрабатывает на каждый тик
  update() {}

  drawGreetings(): void {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.greetingsText = this.add
      .text(gameWidth / 2, gameHeight / 2, "Press Spacebar to start")
      .setOrigin(0.5);
  }

  handleKeyboard(): void {
    this.handleSpacebar();
  }

  handleSpacebar(): void {
    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    spaceBar.on("down", () => this.goGameScene(this));
  }

  goGameScene(ctx: Phaser.Scene): void {
    ctx.scene.start(SCENES.game);
  }
}
