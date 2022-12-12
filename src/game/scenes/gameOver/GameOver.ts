import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import BitmapText = Phaser.GameObjects.BitmapText;
import { LOCAL_STORAGE_SCORE, LOCAL_STORAGE_USERNAME } from "../../CONSTS";

// DEMO:
const RECORDS = [
  {
    name: "User",
    record: "1234567890",
  },
  {
    name: "UsernameUserUser",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
  {
    name: "Username",
    record: "1234567890",
  },
];

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SCENES.end);
  }

  thisScene = this;

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
  scoreText!: Phaser.GameObjects.Text;

  /**
   * Количество очков чтоб получить триал
   */
  scoreForWin = 100;

  /**
   * Ссылка на триал
   */
  urlForWinner = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

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

  /**
   * Картинка с синим фоном и надписью Работник месяца
   */
  leaderboard!: Phaser.GameObjects.Image;

  /**
   * Никнейм юзера
   */
  username!: string | null;

  /**
   * Форма с инпут никнейма юзера
   */
  form!: Phaser.GameObjects.DOMElement;

  /**
   * Текст над формой
   */
  formText!: Phaser.GameObjects.Text;

  /**
   * Кнопка Скипнуть ввод никнейма
   */
  btnSkipUsername!: Phaser.GameObjects.Image;

  /**
   * Кнопка Сохранить никнейм
   */
  btnSaveUsername!: Phaser.GameObjects.Image;

  preload() {
    const folder = import.meta.env.DEV ? "public" : "";
    this.load.html("input-text", `${folder}/input-text.html`);
  }

  init(data: any) {
    this.username = localStorage.getItem(LOCAL_STORAGE_USERNAME);
    this.score = data.score;

    const prevHighScore = localStorage.getItem(LOCAL_STORAGE_SCORE) || 0;

    if (this.score > prevHighScore) {
      localStorage.setItem(LOCAL_STORAGE_SCORE, this.score.toString());
    }
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
    // Shadow
    this.add
      .text(this.scale.width / 2 + 10, 160, `${this.score}`, {
        fontFamily: "Pribambas",
        fontSize: "50px",
        color: "#677AA0",
      })
      .setOrigin(0.5)
      .setAlpha(0.65);

    this.scoreText = this.add
      .text(this.scale.width / 2 + 10, 158, `${this.score}`, {
        fontFamily: "Pribambas",
        fontSize: "50px",
      })
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

    this.btnRestart.on("pointerup", () => {
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

    this.btnPrize.on("pointerup", () => {
      window.open(this.urlForWinner, "_blank")?.focus();
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
      $${this.scoreForWin} в игре!`;
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

    this.leaderboardLink.on("pointerup", () => {
      this.unicorn.setDepth(-10).setAlpha(0);
      this.unicornText.setDepth(-10).setAlpha(0);
      this.leaderboardLink.setDepth(-10).setAlpha(0);

      if (this.username) {
        this.drawLeaderboard();
      } else {
        this.drawUsernameForm();
      }
    });
  }

  drawUsernameForm() {
    this.btnRestart.setDepth(-10).setAlpha(0);
    this.btnRestart.disableInteractive();

    this.form = this.add
      .dom(this.scale.width / 2, 340)
      .createFromCache("input-text")
      .setOrigin(0.5);
    // @ts-ignore
    this.form.node
      .getElementsByTagName("form")[0]
      .addEventListener("submit", (e) => {
        this.submitUsernameFormHandler(e);
      });

    const text = `Сохраним твой результат? Чтобы все \n знали кто такой молодец`;
    this.formText = this.add
      .text(
        this.scale.width / 2,
        this.form.y - this.form.height / 2 - 30,
        text,
        {
          fontFamily: "lifeisstrangeru",
          fontSize: "28px",
          color: "white",
          align: "center",
        }
      )
      .setOrigin(0.5, 1);

    this.btnSkipUsername = this.add
      .image(412, 435, ASSETS.btnSkipUsername.key)
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0.5, 0);
    this.btnSkipUsername.on("pointerup", () => {
      this.removeForm();
      this.drawLeaderboard();
      setTimeout(() => this.btnRestart.setInteractive(), 100);
    });

    this.btnSaveUsername = this.add
      .image(698, 435, ASSETS.btnSaveUsername.key)
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0.5, 0);
    this.btnSaveUsername.on("pointerup", () => {
      this.submitUsernameFormHandler();
    });
  }

  removeForm() {
    this.form.setDepth(-10).setAlpha(0);
    this.formText.setDepth(-10).setAlpha(0);
    this.btnSkipUsername.setDepth(-10).setAlpha(0);
    this.btnSaveUsername.setDepth(-10).setAlpha(0);
  }

  submitUsernameFormHandler(e?: SubmitEvent) {
    let username;

    if (e) {
      e.preventDefault();

      // @ts-ignore
      username = e.target.querySelector("input").value;
    } else {
      username = this.form.node.getElementsByTagName("input")[0].value;
    }

    if (username.trim().length < 3 || username.trim().length > 15) {
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_USERNAME, username);
    this.thisScene.removeForm();
    this.thisScene.drawLeaderboard();
    this.btnRestart.setInteractive();
  }

  /**
   * Рисует таблицу лидеров
   */
  drawLeaderboard() {
    this.btnRestart.setDepth(10).setAlpha(1);

    this.leaderboard = this.add
      .image(
        this.scale.width / 2,
        this.scale.height / 2 - 40,
        ASSETS.leaderboardFinalScreen.key
      )
      .setOrigin(0.5, 0.5)
      .setInteractive();

    let colNum = "";
    let colName = "";
    let colRecord = "";

    const offsetTop = 190;
    const fontSize = "18px";
    const lineSpacing = 2;

    RECORDS.forEach((record, index) => {
      if ((index + 1).toString().length === 1) {
        colNum += `0${index + 1}.\n`;
      } else {
        colNum += `${index + 1}.\n`;
      }

      colName += `${record.name}\n`;

      colRecord += `$${record.record}\n`;
    });

    const leaderboardColNum = this.add
      .text(330, offsetTop, colNum, {
        fontFamily: "lifeisstrangeru",
        color: "white",
        fontSize,
      })
      .setOrigin(0.5, 0);
    leaderboardColNum.setLineSpacing(lineSpacing);

    const leaderboardColName = this.add
      .text(330 + 100, offsetTop, colName, {
        fontFamily: "lifeisstrangeru",
        color: "white",
        fontSize,
      })
      .setOrigin(0.5, 0);
    leaderboardColName.setLineSpacing(lineSpacing);

    const leaderboardColRecord = this.add
      .text(330 + 100 + 314, offsetTop, colRecord, {
        fontFamily: "lifeisstrangeru",
        color: "white",
        fontSize,
      })
      .setOrigin(0.5, 0);
    leaderboardColRecord.setLineSpacing(lineSpacing);
  }
}
