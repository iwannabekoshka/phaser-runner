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

    // Игрок
    this.load.atlas(
      ASSETS.player.key,
      ASSETS.player.imageUrl,
      ASSETS.player.dataFileUrl
    );

    // Пикапы
    this.load.image(ASSETS.coin.key, ASSETS.coin.imageUrl);

    // Баффы
    this.load.image(ASSETS.buffCoffee.key, ASSETS.buffCoffee.imageUrl);
    this.load.image(ASSETS.buffX2.key, ASSETS.buffX2.imageUrl);
    // this.load.image(ASSETS.buffBreak.key, ASSETS.buffBreak.imageUrl);
    // Пончик
    this.load.atlas(
      ASSETS.buffBreak.key,
      ASSETS.buffBreak.imageUrl,
      ASSETS.buffBreak.dataFileUrl
    );
    this.load.image(ASSETS.buffPvs.key, ASSETS.buffPvs.imageUrl);
    this.load.image(ASSETS.buffMentor.key, ASSETS.buffMentor.imageUrl);

    // Неприятности
    this.load.image(ASSETS.debuffBug.key, ASSETS.debuffBug.imageUrl);
    this.load.image(ASSETS.debuffDeadline.key, ASSETS.debuffDeadline.imageUrl);
    this.load.image(ASSETS.debuffDebt.key, ASSETS.debuffDebt.imageUrl);
    this.load.image(ASSETS.debuffDeploy.key, ASSETS.debuffDeploy.imageUrl);
    this.load.image(
      ASSETS.debuffTestFailed.key,
      ASSETS.debuffTestFailed.imageUrl
    );

    // Шрифты
    // Arcade
    this.load.bitmapFont(
      ASSETS.fontArcade.key,
      ASSETS.fontArcade.imageUrl,
      ASSETS.fontArcade.dataFileUrl
    );
    // Life Is Strange Dark
    this.load.bitmapFont(
      ASSETS.fontLifeIsStrangeDark.key,
      ASSETS.fontLifeIsStrangeDark.imageUrl,
      ASSETS.fontLifeIsStrangeDark.dataFileUrl
    );
    // Pribambas White Shadowed
    this.load.bitmapFont(
      ASSETS.fontPribambasWhiteShadowed.key,
      ASSETS.fontPribambasWhiteShadowed.imageUrl,
      ASSETS.fontPribambasWhiteShadowed.dataFileUrl
    );
    // Pribambas Black
    this.load.bitmapFont(
      ASSETS.fontPribambasBlack.key,
      ASSETS.fontPribambasBlack.imageUrl,
      ASSETS.fontPribambasBlack.dataFileUrl
    );
    // Double Shadowed
    this.load.bitmapFont(
      ASSETS.fontDoubleShadowed.key,
      ASSETS.fontDoubleShadowed.imageUrl,
      ASSETS.fontDoubleShadowed.dataFileUrl
    );
  }

  create() {
    console.log("preloader");

    // Анимации игрока
    this.createAnimationPlayerRun();
    this.createAnimationFlames();
    this.createAnimationPlayerFly();
    this.createAnimationPlayerFall();
    this.createAnimationPlayerDeath();

    // Анимации баффов
    this.createAnimationBuffBreakIdle();
    this.createAnimationBuffBreakPop();

    // После загрузки ассетов идем в меню
    this.scene.start(SCENES.menu);
  }

  /**
   * Создает анимацию бега мыши
   */
  createAnimationPlayerRun(): void {
    this.anims.create({
      key: ASSETS.player.animations.run,
      frames: [
        { key: ASSETS.player.key, frame: "anim_run_1.png" },
        { key: ASSETS.player.key, frame: "anim_run_2.png" },
        { key: ASSETS.player.key, frame: "anim_run_3.png" },
        { key: ASSETS.player.key, frame: "anim_run_4.png" },
        { key: ASSETS.player.key, frame: "anim_run_5.png" },
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
      key: ASSETS.player.animations.flamesOn,
      frames: [
        { key: ASSETS.player.key, frame: "anim_fire_1.png" },
        { key: ASSETS.player.key, frame: "anim_fire_2.png" },
      ],
      frameRate: 10,
      repeat: -1, // infinity
    });
  }

  /**
   * Создает анимацию полета мыши
   */
  createAnimationPlayerFly(): void {
    this.anims.create({
      key: ASSETS.player.animations.fly,
      frames: [
        { key: ASSETS.player.key, frame: "anim_up_1.png" },
        { key: ASSETS.player.key, frame: "anim_up_2.png" },
      ],
      frameRate: 10,
      repeat: -1, // infinity
    });
  }

  /**
   * Создает анимацию падения мыши
   * и моего морального духа
   */
  createAnimationPlayerFall(): void {
    this.anims.create({
      key: ASSETS.player.animations.fall,
      frames: [
        { key: ASSETS.player.key, frame: "anim_down_1.png" },
        { key: ASSETS.player.key, frame: "anim_down_2.png" },
      ],
      frameRate: 10,
      repeat: -1, // infinity
    });
  }

  /**
   * Создаёт анимацию смерти
   */
  createAnimationPlayerDeath(): void {
    this.anims.create({
      key: ASSETS.player.animations.death,
      frames: [{ key: ASSETS.player.key, frame: "anim_dead.png" }],
      frameRate: 10,
      repeat: 0,
    });
  }

  createAnimationBuffBreakIdle() {
    this.anims.create({
      key: ASSETS.buffBreak.animations.idle,
      frames: [{ key: ASSETS.buffBreak.key, frame: "bubble-01.png" }],
      frameRate: 10,
      repeat: 0,
    });
  }
  createAnimationBuffBreakPop() {
    this.anims.create({
      key: ASSETS.buffBreak.animations.pop,
      frames: [
        { key: ASSETS.buffBreak.key, frame: "bubble-02.png" },
        { key: ASSETS.buffBreak.key, frame: "bubble-03.png" },
        { key: ASSETS.buffBreak.key, frame: "bubble-04.png" },
        { key: ASSETS.buffBreak.key, frame: "bubble-05.png" },
      ],
      frameRate: 12,
      repeat: 0,
    });
  }
}
