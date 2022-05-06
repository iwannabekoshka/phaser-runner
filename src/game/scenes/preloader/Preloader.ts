import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SCENES.preloader);
  }

  preload() {
    // Background
    this.load.image(ASSETS.bg.key, ASSETS.bg.imageUrl);

    //Mouse
    this.load.atlas(
      ASSETS.mouse.key,
      ASSETS.mouse.imageUrl,
      ASSETS.mouse.dataFileUrl
    );

    // Объекты на фоне
    this.load.image(ASSETS.mousehole.key, ASSETS.mousehole.imageUrl);
    this.load.image(ASSETS.bookcase_1.key, ASSETS.bookcase_1.imageUrl);
    this.load.image(ASSETS.bookcase_2.key, ASSETS.bookcase_2.imageUrl);
    this.load.image(ASSETS.window_1.key, ASSETS.window_1.imageUrl);
    this.load.image(ASSETS.window_2.key, ASSETS.window_2.imageUrl);

    // Лазеры
    this.load.image(ASSETS.laserEnd.key, ASSETS.laserEnd.imageUrl);
    this.load.image(ASSETS.laserMiddle.key, ASSETS.laserMiddle.imageUrl);

    // Пикапы
    this.load.image(ASSETS.coin.key, ASSETS.coin.imageUrl);
  }

  create() {
    console.log("preloader");

    // Анимации
    this.createAnimationMouseRun();
    this.createAnimationFlames();
    this.createAnimationMouseFly();
    this.createAnimationMouseFall();
    this.createAnimationMouseDeath();

    // После загрузки ассетов идем в меню
    this.scene.start(SCENES.menu);
  }

  /**
   * Создает анимацию бега мыши
   */
  createAnimationMouseRun(): void {
    this.anims.create({
      key: ASSETS.mouse.animations.run,
      frames: [
        { key: ASSETS.mouse.key, frame: "rocketmouse_run01.png" },
        { key: ASSETS.mouse.key, frame: "rocketmouse_run02.png" },
        { key: ASSETS.mouse.key, frame: "rocketmouse_run03.png" },
        { key: ASSETS.mouse.key, frame: "rocketmouse_run04.png" },
      ],
      frameRate: 10,
      repeat: -1, // infinity
    });
  }

  /**
   * Создает анимацию огня из ранца
   */
  createAnimationFlames(): void {
    this.anims.create({
      key: ASSETS.mouse.animations.flamesOn,
      frames: [
        { key: ASSETS.mouse.key, frame: "flame1.png" },
        { key: ASSETS.mouse.key, frame: "flame2.png" },
      ],
      frameRate: 10,
      repeat: -1, // infinity
    });
  }

  /**
   * Создает анимацию полета мыши
   */
  createAnimationMouseFly(): void {
    this.anims.create({
      key: ASSETS.mouse.animations.fly,
      frames: [{ key: ASSETS.mouse.key, frame: "rocketmouse_fly01.png" }],
      frameRate: 10,
      repeat: -1, // infinity
    });
  }

  /**
   * Создает анимацию падения мыши
   * и моего морального духа
   */
  createAnimationMouseFall(): void {
    this.anims.create({
      key: ASSETS.mouse.animations.fall,
      frames: [{ key: ASSETS.mouse.key, frame: "rocketmouse_fall01.png" }],
      frameRate: 10,
      repeat: -1, // infinity
    });
  }

  /**
   * Создаёт анимацию смерти
   */
  createAnimationMouseDeath(): void {
    this.anims.create({
      key: ASSETS.mouse.animations.death,
      frames: [
        { key: ASSETS.mouse.key, frame: "rocketmouse_dead01.png" },
        { key: ASSETS.mouse.key, frame: "rocketmouse_dead02.png" },
      ],
      frameRate: 10,
      repeat: 0,
    });
  }
}
