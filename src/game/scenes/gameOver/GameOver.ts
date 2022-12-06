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
   * Количество очков чтоб получить триал
   */
  scoreForWin = 1000;

  /**
   * Кнопка Начать заново
   */
  btnRestart!: Phaser.GameObjects.Image;

  /**
   * Кнопка Получить приз
   */
  btnPrize!: Phaser.GameObjects.Image;

  /**
   * Победный (или не очень) единорог
   */
  unicorn!: Phaser.GameObjects.Image;

  /**
   * Текст рядом с единорогом
   */
  unicornText!: Phaser.GameObjects.Text;

  /**
   * Ссылка на лидерборд
   */
  leaderboardLink!: Phaser.GameObjects.Image;

  init(data: any) {
    this.score = data.score;
  }

  create() {
    this.drawCard();
    this.drawScore();
    this.drawUnicorn();
    this.drawUnicornText();
    this.drawBtnRestart();
    this.drawBtnGetPrize();
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

    let x;

    if (this.score >= this.scoreForWin) {
      x = this.scale.width / 2 - this.btnRestart.width / 2 - 15;
    } else {
      x = this.scale.width / 2;
    }

    this.btnRestart.x = x;

    this.btnRestart.on("pointerdown", () => {
      // Сначала стопим сцены
      this.scene.stop(SCENES.end);

      this.scene.start(SCENES.game);
    });
  }

  drawBtnGetPrize() {
    if (this.score < this.scoreForWin) {
      return;
    }

    this.btnPrize = this.add
      .image(this.scale.width / 2, 435, ASSETS.btnPrize.key)
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0.5, 0);

    let x;

    x = this.scale.width / 2 + this.btnPrize.width / 2 + 15;

    this.btnPrize.x = x;

    this.btnPrize.on("pointerdown", () => {
      window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    });
  }

  drawUnicorn() {
    let unicornAssetKey;

    if (this.score >= this.scoreForWin) {
      unicornAssetKey = ASSETS.unicornStark.key;
    } else {
      unicornAssetKey = ASSETS.unicornMeh.key;
    }

    this.unicorn = this.add
      .image(this.scale.width / 2, 413, unicornAssetKey)
      .setOrigin(0, 1);
  }

  drawUnicornText() {
    let text;

    if (this.score >= this.scoreForWin) {
      text = `
      Ого! 
      Вот это результат!
      Скорее забирай 
      свои 30 дней
      бесплатного 
      пользования PVS-Studio!`;
    } else {
      text = `
      Увы! Немного не хватило 
      до подарка. 
      Попробуй еще раз, 
      у тебя точно 
      получится набрать 
      ${this.scoreForWin} очков в игре!`;
    }

    this.unicornText = this.add.text(280, 175, text, {
      fontFamily: "lifeisstrangeru",
      fontSize: "28px",
    });
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
