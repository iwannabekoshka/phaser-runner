import * as Phaser from "phaser";
import { SCENES } from "../SCENES";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SCENES.end);
  }

  /**
   * Конечный текст
   */
  text!: Phaser.GameObjects.Text;

  /**
   * Счет
   */
  score!: number;

  /**
   * Текст счета
   */
  scoreText!: Phaser.GameObjects.Text;

  init(data: any) {
    this.score = data.score;
  }

  create() {
    this.drawText();
    this.handleSpace();
  }

  /**
   * Рисует текст lol u died
   */
  drawText(): void {
    this.text = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "LOL u DIED", {
        fontSize: "32px",
        color: "red",
        backgroundColor: "black",
        padding: {
          left: 15,
          right: 15,
          top: 15,
          bottom: 15,
        },
      })
      .setOrigin(0.5);

    this.scoreText = this.add
      .text(
        this.scale.width / 2,
        this.text.y + this.text.height + 20,
        `Score: ${this.score}`,
        {
          fontSize: "32px",
          color: "red",
          backgroundColor: "black",
          padding: {
            left: 15,
            right: 15,
            top: 15,
            bottom: 15,
          },
        }
      )
      .setOrigin(0.5);
  }

  handleSpace(): void {
    this.input.keyboard.once("keydown-SPACE", () => {
      // Сначала стопим сцены
      this.scene.stop(SCENES.end);
      this.scene.stop(SCENES.game);

      // Потом запускаем игру
      this.scene.start(SCENES.game);
    });
  }
}
