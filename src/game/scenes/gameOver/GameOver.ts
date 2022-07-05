import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import BitmapText = Phaser.GameObjects.BitmapText;

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SCENES.end);
  }

  /**
   * Карточка с контентом
   */
  card!: Phaser.GameObjects.Image;

  /**
   * Счет
   */
  score!: number;

  /**
   * Текст счета
   */
  scoreText!: BitmapText;

  /**
   * Кнопка Начать заново
   */
  btnRestart!: Phaser.GameObjects.Image;

  /**
   * Победный (или не очень) единорог
   */
  unicorn!: Phaser.GameObjects.Image;

  /**
   * Текст рядом с единорогом
   */
  unicornText!: Phaser.GameObjects.Image;

  /**
   * Ссылка на лидерборд
   */
  leaderboardLink!: Phaser.GameObjects.Image;

  init(data: any) {
    this.score = data.score;
    // this.score = 12345;
  }

  create() {
    this.drawCard();
    this.drawScore();
    this.drawUnicorn();
    this.drawUnicornText();
    this.drawBtnRestart();
    this.drawLeaderboardLink();
  }

  drawCard() {
    this.card = this.add
      .image(this.scale.width / 2, this.scale.height / 2, ASSETS.deadscreen.key)
      .setOrigin(0.5, 0.5);
  }

  drawScore() {
    this.scoreText = this.add
      .bitmapText(
        this.scale.width / 2 + 10,
        163,
        ASSETS.fontPribambasWhiteShadowed.key,
        `${this.score}`,
        50
      )
      .setOrigin(0.5);
  }

  drawBtnRestart() {
    this.btnRestart = this.add
      .image(this.scale.width / 2, 435, ASSETS.btnAgain.key)
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0.5, 0);
    this.btnRestart.x -= this.btnRestart.width / 2 + 16;

    this.btnRestart.on("pointerdown", () => {
      // Сначала стопим сцены
      this.scene.stop(SCENES.end);

      this.scene.start(SCENES.game);
    });
  }

  drawUnicorn() {
    this.unicorn = this.add
      .image(this.scale.width / 2 + 14, 413, ASSETS.unicornStark.key)
      .setOrigin(0, 1);
  }

  drawUnicornText() {
    this.unicornText = this.add
      .image(315, 221, ASSETS.finalTextRecord.key)
      .setOrigin(0, 0);
  }

  drawLeaderboardLink() {
    this.leaderboardLink = this.add
      .image(this.scale.width / 2, 512, ASSETS.linkToLeaderboard.key)
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0.5, 0);

    this.leaderboardLink.on("pointerdown", () => {
      alert("leaderboard");
    });
  }
}
