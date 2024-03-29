import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import { createButtonWithGradient } from "../utils/createButtonWithGradient";
import game from "../../game";
import {
  API_LEADBOARD,
  LOCAL_STORAGE_SCORE,
  LOCAL_STORAGE_TUTORIAL_COMPLETED,
} from "../../CONSTS";
import axios from "axios";

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

export default class Menu extends Phaser.Scene {
  constructor() {
    super(SCENES.menu);
  }

  /**
   * Это соотношение моей ширины
   * и ширины макета
   */
  assetsScale = 1;
  /**
   * Отступ сверху
   */
  offsetScreenY = 60 * this.assetsScale;
  /**
   * Отступ слева и справа
   */
  offsetScreenX = 60 * this.assetsScale;

  /**
   * Endless coding yopt
   */
  logoText!: Phaser.GameObjects.Image;

  /**
   * Фон меню
   */
  bg!: Phaser.GameObjects.Image;

  /**
   * Кнопка Start
   */
  btnStart!: Phaser.GameObjects.Image;
  /**
   * Отступ снизу
   */
  offsetBtnStart = 15 * this.assetsScale;
  /**
   * Кнопка таблицы лидеров
   */
  btnLeaderboard!: Phaser.GameObjects.Image;
  /**
   * Кнопка назад
   */
  btnBack!: Phaser.GameObjects.Image;
  /**
   * Кнопка звука
   */
  btnMute!: Phaser.GameObjects.Image;
  /**
   * Кнопка туториала
   */
  btnInfo!: Phaser.GameObjects.Image;
  /**
   * Кнопка фуллскрина
   */
  btnFullscreen!: Phaser.GameObjects.Image;

  isFullscreen = false;

  lastFullscreenClickTime = 0;
  fullscreenClickDelay = 200;

  /**
   * Кубок
   */
  cup!: Phaser.GameObjects.Image;

  /**
   * Highscore
   */
  highscoreText!: Phaser.GameObjects.Text;

  /**
   * Туториал
   */
  tutorial!: Phaser.GameObjects.Image;

  /**
   * Таблица лидеров
   */
  leaderboard!: Phaser.GameObjects.Image;

  /**
   * Таблица лидеров: колонка порядковых номеров
   */
  leaderboardColNum!: Phaser.GameObjects.Text;

  /**
   * Таблица лидеров: колонка имен
   */
  leaderboardColName!: Phaser.GameObjects.Text;

  /**
   * Таблица лидеров: колонка счета
   */
  leaderboardColRecord!: Phaser.GameObjects.Text;

  /**
   * Кнопка Подписаться
   */
  btnSubscribe!: Phaser.GameObjects.Image;

  // Тут можно задавать дефолтные значения
  init() {}

  // Загрузка Ассетов
  preload() {}

  // Создание всего и вся
  async create() {
    // На мобилках тач евенты два раза отрабатывают без этого
    if (game.device.input.touch) {
      game.input.mouse.enabled = false;
    }

    window.addEventListener("orientationchange", (event) => {
      // Небольшой хак, чтобы поресайзить игру туда-сюда, иначе она сама не подстраивается
      document.querySelector("#canvas-container")?.classList.toggle("w-100");
      setTimeout(
        () =>
          document
            .querySelector("#canvas-container")
            ?.classList.toggle("w-100"),
        30
      );
    });

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      game.input.touch.capture = false;
    }

    this.drawBg();
    this.drawLogoText();
    this.drawBtnStart();
    this.drawBtnLeaderboard();
    // this.drawBtnMute();
    this.drawBtnInfo();

    await this.drawLeaderboard();

    if (
      /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ) {
      this.drawBtnFullscreen();
    }

    this.drawHighScore();
    // this.drawBtnSubscribe();
    this.drawBtnBack();
  }

  // Отрабатывает на каждый тик
  update() {}

  /**
   * Рисует фон
   */
  drawBg() {
    this.bg = this.add
      .image(this.scale.width / 2, 0, ASSETS.menuBg.key)
      .setOrigin(0.5, 0);

    const scaleX = this.cameras.main.width / this.bg.width;
    this.bg.setScale(scaleX);
  }

  /**
   * Рисует надпись Endless coding
   */
  drawLogoText() {
    this.logoText = this.add
      .image(this.scale.width / 2, this.offsetScreenY, ASSETS.menuLogo.key)
      .setScale(1)
      .setOrigin(0.5, 0);
  }

  /**
   * Рисует кнопку Start
   */
  drawBtnStart() {
    this.btnStart = this.add
      .image(
        this.scale.width / 2,
        this.offsetScreenY * 2 + this.logoText.height * this.assetsScale,
        ASSETS.btnStart.key
      )
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0.5, 0)
      .setScale(this.assetsScale);

    this.btnStart.on("pointerdown", () => {
      if (localStorage.getItem(LOCAL_STORAGE_TUTORIAL_COMPLETED)) {
        this.scene.start(SCENES.game);
      } else {
        this.drawTutorial();
      }
    });
  }

  /**
   * Рисует кнопку таблицы лидеров
   */
  drawBtnLeaderboard() {
    this.btnLeaderboard = this.add
      .image(
        this.scale.width / 2,
        this.offsetScreenY * 2 +
          this.logoText.height * this.assetsScale +
          this.btnStart.height * this.assetsScale +
          this.offsetBtnStart,
        ASSETS.btnLeaderboard.key
      )
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0.5, 0)
      .setScale(this.assetsScale);

    this.btnLeaderboard.on("pointerdown", async () => {
      this.bg.setDepth(1);
      this.leaderboard.setDepth(2);
      this.leaderboardColNum.setDepth(3);
      this.leaderboardColName.setDepth(3);
      this.leaderboardColRecord.setDepth(3);
      this.btnBack.setDepth(3);
    });
  }

  drawBtnSubscribe() {
    this.btnSubscribe = this.add
      .image(
        this.scale.width / 2 + 15,
        this.leaderboard.y +
          (this.leaderboard.height * this.assetsScale) / 2 -
          this.btnLeaderboard.height -
          10,
        ASSETS.btnSubscribe.key
      )
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0, 0.5)
      .setScale(this.assetsScale)
      .setDepth(-1);
  }

  drawBtnBack() {
    this.btnBack = this.add
      .image(
        this.scale.width / 2 - 15,
        this.leaderboard.y +
          (this.leaderboard.height * this.assetsScale) / 2 -
          this.btnLeaderboard.height -
          10,
        ASSETS.btnBackToMenu.key
      )
      .setInteractive({ cursor: "pointer" })
      .setOrigin(1, 0.5)
      .setScale(this.assetsScale)
      .setDepth(-1);

    this.btnBack.on("pointerdown", () => {
      this.bg.setDepth(-1);
      this.leaderboard.setDepth(-10);
      this.leaderboardColNum.setDepth(-10);
      this.leaderboardColName.setDepth(-10);
      this.leaderboardColRecord.setDepth(-10);
      // this.btnSubscribe.setDepth(-10);
      this.btnBack.setDepth(-10);
    });
  }

  /**
   * Рисует кнопку звука
   */
  drawBtnMute() {
    this.btnMute = this.add
      .image(this.offsetScreenX, this.offsetScreenY, ASSETS.btnMute.key)
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0, 0)
      .setScale(this.assetsScale);

    this.btnMute.on("pointerdown", () => {
      alert("Звук");
    });
  }

  /**
   * Рисует кнопку туториала
   */
  drawBtnInfo() {
    this.btnInfo = this.add
      .image(this.offsetScreenX, this.offsetScreenY, ASSETS.btnInfo.key)
      .setInteractive({ cursor: "pointer" })
      .setOrigin(0, 0)
      .setScale(this.assetsScale);

    this.btnInfo.on("pointerdown", () => {
      this.drawTutorial();
    });
  }

  /**
   * Рисует кнопку фуллскрина
   */
  drawBtnFullscreen() {
    this.btnFullscreen = this.add
      .image(
        this.scale.width - this.offsetScreenX,
        this.offsetScreenY,
        ASSETS.btnFullscreen.key
      )
      .setInteractive({ cursor: "pointer" })
      .setOrigin(1, 0)
      .setScale(this.assetsScale);

    this.btnFullscreen.on("pointerup", () => {
      console.log("fullsrn");

      if (
        this.lastFullscreenClickTime >=
        Date.now() - this.fullscreenClickDelay
      ) {
        return;
      }
      this.lastFullscreenClickTime = Date.now();

      this.scale.toggleFullscreen();

      // document
      //   .querySelector("#canvas-container")!
      //   .classList.toggle("fullscreen");

      return;

      const aspectRatio = window.innerHeight / window.innerWidth;
      const deviceClass = aspectRatio > 0.51 ? "short" : "long";

      const canvas = document.querySelector("#canvas-container")!;
      canvas.classList.toggle("fullscreen");
      canvas.classList.toggle(deviceClass);

      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          // @ts-ignore
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          // @ts-ignore
          document.webkitExitFullscreen();
          // @ts-ignore
        } else if (document.msExitFullscreen) {
          /* IE11 */
          // @ts-ignore
          document.msExitFullscreen();
        }
      } else {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
          // @ts-ignore
        } else if (document.documentElement.webkitRequestFullscreen) {
          /* Safari */
          // @ts-ignore
          document.documentElement.webkitRequestFullscreen();
          // @ts-ignore
        } else if (document.documentElement.msRequestFullscreen) {
          /* IE11 */
          // @ts-ignore
          document.documentElement.msRequestFullscreen();
        }
      }
    });
  }

  drawHighScore() {
    const highscore = localStorage.getItem(LOCAL_STORAGE_SCORE) || 0;

    if (highscore === 0) {
      return;
    }

    this.highscoreText = this.add
      .text(
        this.scale.width - 75,
        this.scale.height - this.offsetScreenY - 30,
        `${highscore}`,
        {
          fontFamily: "Luckiest Guy",
          color: "black",
          fontSize: "42px",
        }
      )
      .setOrigin(1, 0.5);

    this.cup = this.add
      .image(
        this.highscoreText.x - this.highscoreText.width - 100,
        this.scale.height - this.offsetScreenY - 30,
        ASSETS.cup.key
      )
      .setOrigin(0, 0.5)
      .setScale(this.assetsScale)
      .setInteractive({ cursor: "pointer" });

    this.cup.on("pointerup", () => {
      this.bg.setDepth(1);
      this.leaderboard.setDepth(2);
      this.leaderboardColNum.setDepth(3);
      this.leaderboardColName.setDepth(3);
      this.leaderboardColRecord.setDepth(3);
      this.btnBack.setDepth(3);
    });
  }

  /**
   * Рисует фон
   */
  drawTutorial() {
    this.tutorial = this.add
      .image(this.scale.width / 2, 0, ASSETS.tutorial_1.key)
      .setOrigin(0.5, 0)
      .setDepth(1)
      .setInteractive();

    const scaleX = this.cameras.main.width / this.tutorial.width;
    this.tutorial.setScale(scaleX);

    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spaceBar.on("down", () => {
      this.tutorial.setTexture(ASSETS.tutorial_2.key);

      spaceBar.on("down", () => {
        localStorage.setItem(LOCAL_STORAGE_TUTORIAL_COMPLETED, "true");
        this.goGameScene();
      });
    });
    this.tutorial.on("pointerdown", () => {
      this.tutorial.setTexture(ASSETS.tutorial_2.key);

      this.tutorial.on("pointerdown", () => {
        localStorage.setItem(LOCAL_STORAGE_TUTORIAL_COMPLETED, "true");
        this.goGameScene();
      });
    });
  }

  /**
   * Рисует таблицу лидеров
   */
  async drawLeaderboard() {
    this.leaderboard = this.add
      .image(
        this.scale.width / 2,
        this.scale.height / 2,
        ASSETS.leaderboard.key
      )
      .setOrigin(0.5, 0.5)
      .setDepth(-1)
      .setInteractive()
      .setScale(this.assetsScale);

    let colNum = "";
    let colName = "";
    let colRecord = "";
    const offsetTop = 200;
    const fontSize = "18px";
    const lineSpacing = 2;

    const response = await axios.get(API_LEADBOARD);
    const records = response.data as {
      username: string;
      score: number;
      position: number;
    }[];

    records.forEach((record, index) => {
      if ((index + 1).toString().length === 1) {
        colNum += `0${index + 1}.\n`;
      } else {
        colNum += `${index + 1}.\n`;
      }

      colName += `${record.username}\n`;

      colRecord += `$${record.score}\n`;
    });

    this.leaderboardColNum = this.add
      .text(330, offsetTop, colNum, {
        fontFamily: "lifeisstrangeru",
        color: "white",
        fontSize,
      })
      .setDepth(-1)
      .setOrigin(0.5, 0);
    this.leaderboardColNum.setLineSpacing(lineSpacing);

    this.leaderboardColName = this.add
      .text(
        this.leaderboardColNum.x + this.leaderboardColNum.width / 2 + 70,
        offsetTop,
        colName,
        {
          fontFamily: "lifeisstrangeru",
          color: "white",
          fontSize,
        }
      )
      .setDepth(-1)
      .setOrigin(0.5, 0);
    this.leaderboardColName.setLineSpacing(lineSpacing);

    this.leaderboardColRecord = this.add
      .text(330 + 100 + 314, offsetTop, colRecord, {
        fontFamily: "lifeisstrangeru",
        color: "white",
        fontSize,
      })
      .setDepth(-1)
      .setOrigin(0.5, 0);
    this.leaderboardColRecord.setLineSpacing(lineSpacing);
  }

  handleKeyboard(): void {
    // this.handleSpacebar();
  }

  handleSpacebar(): void {
    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    spaceBar.on("down", () => this.goGameScene());
  }

  goGameScene(): void {
    this.scene.start(SCENES.game);
  }
}
