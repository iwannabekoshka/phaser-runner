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

    // Монетка 50
    this.load.atlas(
      ASSETS.coin.key,
      ASSETS.coin.imageUrl,
      ASSETS.coin.dataFileUrl
    );
    // Монетка x2
    this.load.atlas(
      ASSETS.buffX2.key,
      ASSETS.buffX2.imageUrl,
      ASSETS.buffX2.dataFileUrl
    );
    // Pvs
    this.load.atlas(
      ASSETS.buffPvs.key,
      ASSETS.buffPvs.imageUrl,
      ASSETS.buffPvs.dataFileUrl
    );
    // Mentor
    this.load.atlas(
      ASSETS.buffMentor.key,
      ASSETS.buffMentor.imageUrl,
      ASSETS.buffMentor.dataFileUrl
    );
    // Пончик
    this.load.atlas(
      ASSETS.buffBreak.key,
      ASSETS.buffBreak.imageUrl,
      ASSETS.buffBreak.dataFileUrl
    );
    // Щит ПВС
    this.load.atlas(
      ASSETS.playerPvsShield.key,
      ASSETS.playerPvsShield.imageUrl,
      ASSETS.playerPvsShield.dataFileUrl
    );

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

    // Элементы интерфейса
    // Лого игры в меню
    this.load.image(ASSETS.menuLogo.key, ASSETS.menuLogo.imageUrl);
    // Фон меню
    this.load.image(ASSETS.menuBg.key, ASSETS.menuBg.imageUrl);
    // Кнопка Start
    this.load.image(ASSETS.btnStart.key, ASSETS.btnStart.imageUrl);
    // Кнопка таблицы лидеров
    this.load.image(ASSETS.btnLeaderboard.key, ASSETS.btnLeaderboard.imageUrl);
    // Кнопка звука
    this.load.image(ASSETS.btnMute.key, ASSETS.btnMute.imageUrl);
    // Кнопка туториала
    this.load.image(ASSETS.btnInfo.key, ASSETS.btnInfo.imageUrl);
    // Кнопка фуллскрина
    this.load.image(ASSETS.btnFullscreen.key, ASSETS.btnFullscreen.imageUrl);
    // Кнопка заново
    this.load.image(ASSETS.btnAgain.key, ASSETS.btnAgain.imageUrl);
    // Кнопка заново
    this.load.image(ASSETS.btnBack.key, ASSETS.btnBack.imageUrl);
    // Кнопка Подписаться
    this.load.image(ASSETS.btnSubscribe.key, ASSETS.btnSubscribe.imageUrl);
    // Кубок
    this.load.image(ASSETS.cup.key, ASSETS.cup.imageUrl);
    // Туториал 1
    this.load.image(ASSETS.tutorial_1.key, ASSETS.tutorial_1.imageUrl);
    // Туториал 2
    this.load.image(ASSETS.tutorial_2.key, ASSETS.tutorial_2.imageUrl);
    // Таблица лидеров
    this.load.image(ASSETS.leaderboard.key, ASSETS.leaderboard.imageUrl);
    // Таблица лидеров
    this.load.image(ASSETS.deadscreen.key, ASSETS.deadscreen.imageUrl);
    // Победный единорог как Тони Старк
    this.load.image(ASSETS.unicornStark.key, ASSETS.unicornStark.imageUrl);
    // Текст в конце, когда побил рекорд
    this.load.image(
      ASSETS.finalTextRecord.key,
      ASSETS.finalTextRecord.imageUrl
    );
    // Ссылка на лидерборд
    this.load.image(
      ASSETS.linkToLeaderboard.key,
      ASSETS.linkToLeaderboard.imageUrl
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
    this.createAnimationPlayerPvsShield();
    this.createAnimationPlayerPvsShieldBlink();
    this.createAnimationPlayerDonut();

    // Анимации баффов
    this.createAnimationBuffBreakIdle();
    this.createAnimationBuffBreakPop();
    this.createAnimationBuffCoinIdle();
    this.createAnimationBuffCoinPop();
    this.createAnimationBuffX2Idle();
    this.createAnimationBuffX2Pop();
    this.createAnimationBuffPvsIdle();
    this.createAnimationBuffPvsPop();
    this.createAnimationBuffMentorIdle();
    this.createAnimationBuffMentorPop();

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

  createAnimationPlayerDonut(): void {
    this.anims.create({
      key: ASSETS.player.animations.donut,
      frames: [
        { key: ASSETS.player.key, frame: "donut_run_1.png" },
        { key: ASSETS.player.key, frame: "donut_run_2.png" },
        { key: ASSETS.player.key, frame: "donut_run_3.png" },
        { key: ASSETS.player.key, frame: "donut_run_4.png" },
        { key: ASSETS.player.key, frame: "donut_run_5.png" },
        { key: ASSETS.player.key, frame: "donut_run_6.png" },
        { key: ASSETS.player.key, frame: "donut_run_7.png" },
        { key: ASSETS.player.key, frame: "donut_run_8.png" },
        { key: ASSETS.player.key, frame: "donut_run_9.png" },
        { key: ASSETS.player.key, frame: "donut_run_10.png" },
        { key: ASSETS.player.key, frame: "donut_run_11.png" },
        { key: ASSETS.player.key, frame: "donut_run_12.png" },
        { key: ASSETS.player.key, frame: "donut_run_13.png" },
        { key: ASSETS.player.key, frame: "donut_run_14.png" },
        { key: ASSETS.player.key, frame: "donut_run_15.png" },
        { key: ASSETS.player.key, frame: "donut_run_16.png" },
        { key: ASSETS.player.key, frame: "donut_run_17.png" },
        { key: ASSETS.player.key, frame: "donut_run_18.png" },
        { key: ASSETS.player.key, frame: "donut_run_19.png" },
        { key: ASSETS.player.key, frame: "donut_run_20.png" },
        { key: ASSETS.player.key, frame: "donut_run_21.png" },
        { key: ASSETS.player.key, frame: "donut_run_22.png" },
        { key: ASSETS.player.key, frame: "donut_run_23.png" },
        { key: ASSETS.player.key, frame: "donut_run_24.png" },
        { key: ASSETS.player.key, frame: "donut_run_25.png" },
        { key: ASSETS.player.key, frame: "donut_run_26.png" },
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

  /**
   * Создает анимацию висящего пончика
   */
  createAnimationBuffBreakIdle() {
    this.anims.create({
      key: ASSETS.buffBreak.animations.idle,
      frames: [{ key: ASSETS.buffBreak.key, frame: "bubble-01.png" }],
      frameRate: 10,
      repeat: 0,
    });
  }
  /**
   * Создает анимацию лопания пончика
   */
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

  /**
   * Создает анимацию висящей монеты
   */
  createAnimationBuffCoinIdle() {
    this.anims.create({
      key: ASSETS.coin.animations.idle,
      frames: [{ key: ASSETS.coin.key, frame: "coin-50-01.png" }],
      frameRate: 10,
      repeat: 0,
    });
  }
  /**
   * Создает анимацию лопания монеты
   */
  createAnimationBuffCoinPop() {
    this.anims.create({
      key: ASSETS.coin.animations.pop,
      frames: [
        { key: ASSETS.coin.key, frame: "coin-50-02.png" },
        { key: ASSETS.coin.key, frame: "coin-50-03.png" },
        { key: ASSETS.coin.key, frame: "coin-50-04.png" },
        { key: ASSETS.coin.key, frame: "coin-50-05.png" },
      ],
      frameRate: 12,
      repeat: 0,
    });
  }

  /**
   * Создает анимацию висящей монеты x2
   */
  createAnimationBuffX2Idle() {
    this.anims.create({
      key: ASSETS.buffX2.animations.idle,
      frames: [{ key: ASSETS.buffX2.key, frame: "coin-x2-01.png" }],
      frameRate: 10,
      repeat: 0,
    });
  }
  /**
   * Создает анимацию лопания монеты x2
   */
  createAnimationBuffX2Pop() {
    this.anims.create({
      key: ASSETS.buffX2.animations.pop,
      frames: [
        { key: ASSETS.buffX2.key, frame: "coin-x2-02.png" },
        { key: ASSETS.buffX2.key, frame: "coin-x2-03.png" },
        { key: ASSETS.buffX2.key, frame: "coin-x2-04.png" },
        { key: ASSETS.buffX2.key, frame: "coin-x2-05.png" },
      ],
      frameRate: 12,
      repeat: 0,
    });
  }

  /**
   * Создает анимацию висящей Pvs
   */
  createAnimationBuffPvsIdle() {
    this.anims.create({
      key: ASSETS.buffPvs.animations.idle,
      frames: [{ key: ASSETS.buffPvs.key, frame: "PVS-30.png" }],
      frameRate: 10,
      repeat: 0,
    });
  }
  /**
   * Создает анимацию лопания Pvs
   */
  createAnimationBuffPvsPop() {
    this.anims.create({
      key: ASSETS.buffPvs.animations.pop,
      frames: [
        { key: ASSETS.buffPvs.key, frame: "PVS-31.png" },
        { key: ASSETS.buffPvs.key, frame: "PVS-32.png" },
        { key: ASSETS.buffPvs.key, frame: "PVS-33.png" },
        { key: ASSETS.buffPvs.key, frame: "PVS-34.png" },
      ],
      frameRate: 12,
      repeat: 0,
    });
  }

  /**
   * Создает анимацию висящего ментора
   */
  createAnimationBuffMentorIdle() {
    this.anims.create({
      key: ASSETS.buffMentor.animations.idle,
      frames: [{ key: ASSETS.buffMentor.key, frame: "mentor-01.png" }],
      frameRate: 10,
      repeat: 0,
    });
  }
  /**
   * Создает анимацию лопания ментора
   */
  createAnimationBuffMentorPop() {
    this.anims.create({
      key: ASSETS.buffMentor.animations.pop,
      frames: [
        { key: ASSETS.buffMentor.key, frame: "mentor-02.png" },
        { key: ASSETS.buffMentor.key, frame: "mentor-03.png" },
        { key: ASSETS.buffMentor.key, frame: "mentor-04.png" },
        { key: ASSETS.buffMentor.key, frame: "mentor-05.png" },
      ],
      frameRate: 12,
      repeat: 0,
    });
  }

  createAnimationPlayerPvsShield() {
    this.anims.create({
      key: ASSETS.playerPvsShield.animations.bubble,
      frames: [
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-01.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-02.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-03.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-04.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-05.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-06.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-07.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-08.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-09.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_2-10.png" },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }

  createAnimationPlayerPvsShieldBlink() {
    this.anims.create({
      key: ASSETS.playerPvsShield.animations.blink,
      frames: [
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-01.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-02.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-03.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-04.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-05.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-06.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-07.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-08.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-09.png" },
        { key: ASSETS.playerPvsShield.key, frame: "hero_bubble_ending-10.png" },
      ],
      frameRate: 6,
      repeat: -1,
    });
  }
}
