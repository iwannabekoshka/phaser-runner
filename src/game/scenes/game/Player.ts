import * as Phaser from "phaser";
import ASSETS from "../../ASSETS";

export enum PlayerState {
  Running,
  Killed,
  Dead,
}

export default class Player extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Добавляем физику мыши в сцену
    scene.physics.add.existing(this);

    this.initFlames(scene);
    this.initPlayer(scene);
    this.initPvsShield(scene);
    this.initCursors(scene);

    this.toggleJetpack(false);
  }

  /**
   * Мышь
   */
  player!: Phaser.GameObjects.Sprite;

  /**
   * Состояние мыши
   */
  playerState = PlayerState.Running;

  /**
   * Неуязвима ли мышь
   */
  isInvincible = false;

  isFalling = false;

  /**
   * Огни из жёпы
   */
  flames!: Phaser.GameObjects.Sprite;

  /**
   * Щит пвс
   */
  pvsShield!: Phaser.GameObjects.Sprite;

  /**
   * Управление стрелочками и пробелом
   */
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  /**
   * Ускорение мыши наверх
   */
  accelerationY = -4000;

  /**
   * Скорость игрока
   */
  // TODO: 200
  playerSpeed = 300;

  /**
   * На сколько мышь ускоряется спустя время
   */
  // TODO: 20
  deltaSpeed = 20;

  /**
   * Секунды для постепенного увеличения скорости
   */
  seconds = 0;

  /**
   * Время в секундах, спустя которое происходит ускорение
   */
  deltaSeconds = 5;

  /**
   * Время перерыва
   */
  breakTime = 5000;

  isDonut = false;

  preUpdate(t: number, dt: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    switch (this.playerState) {
      case PlayerState.Running: {
        // Если нажат пробел
        if (
          (this.cursors.space?.isDown ||
            this.scene.input.activePointer.isDown) &&
          !this.isFalling
        ) {
          if (body.y === 0) {
            this.isFalling = true;
            break;
          }

          if (body.blocked.down) {
            body.setVelocityY(-400);
          }

          // TODO убрать после дебага
          // body.setVelocityX(500);

          body.setAccelerationY(this.accelerationY);
          this.toggleJetpack(true);

          // Анимация полета
          if (!this.isDonut) {
            this.player.play(ASSETS.player.animations.fly, true);
          }

          // Если не летим вверх
        } else {
          // TODO убрать после дебага
          // body.setVelocityX(0);
          body.setAccelerationY(0);
          this.toggleJetpack(false);

          // Если стоим на земле
          if (body.blocked.down) {
            // Дефолтная анимация бега
            if (!this.isDonut) {
              this.player.play(ASSETS.player.animations.run, true);
            }
            this.isFalling = false;
          } else {
            // Анимация падения
            if (!this.isDonut) {
              this.player.play(ASSETS.player.animations.fall, true);
            }
            this.isFalling = true;
          }
        }

        // Пока мышь бежит - ускоряем ее
        this.speedUpPlayerByTime(t);

        break;
      }

      case PlayerState.Killed: {
        body.velocity.x *= 0.99;
        body.velocity.x -= 5;

        if (body.velocity.x <= 5) {
          this.playerState = PlayerState.Dead;
        }

        break;
      }

      case PlayerState.Dead: {
        body.setVelocity(0, 0);

        break;
      }
    }
  }

  /**
   * Добавляет мышь
   * @param scene
   */
  initPlayer(scene: Phaser.Scene): void {
    const scale = 0.5;
    // Мышь
    this.player = scene.add
      .sprite(0, 0, ASSETS.player.key)
      .setOrigin(0.5, 1)
      .play(ASSETS.player.animations.run)
      .setScale(scale)
      .setDepth(1000);

    // Добавляет объект к контейнеру
    this.add(this.player);

    // Сопоставляем физическое тело игрока и спрайт
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Коэффициенты честно подобраны рандомно, никакой логики
    body.setSize(this.player.width * 0.35, this.player.height * 0.4);
    body.setOffset(
      (-this.player.width * scale) / 2 + 20,
      -this.player.height * scale + 20
    );

    // Даем мыши скорость
    body.setVelocityX(this.playerSpeed);
  }

  /**
   * Добавляет огонь из жёпы
   * @param scene
   */
  initFlames(scene: Phaser.Scene): void {
    this.flames = scene.add
      .sprite(-31, -15, ASSETS.player.key)
      .play(ASSETS.player.animations.flamesOn)
      .setScale(0.5)
      .setVisible(true);
    this.add(this.flames);
  }

  initPvsShield(scene: Phaser.Scene): void {
    this.pvsShield = scene.add
      .sprite(5, -100, ASSETS.playerPvsShield.key)
      .play(ASSETS.playerPvsShield.animations.bubble)
      .setScale(0.85)
      .setOrigin(0.5)
      .setVisible(false);
    this.add(this.pvsShield);
  }

  setPvsShieldBlinking(isBlinking = true) {
    if (isBlinking) {
      this.pvsShield.play(ASSETS.playerPvsShield.animations.blink);
    } else {
      this.pvsShield.play(ASSETS.playerPvsShield.animations.bubble);
    }
  }

  setDonutAnimation(isDonut: boolean) {
    if (isDonut) {
      this.player.play(ASSETS.player.animations.donut);
    }
  }

  /**
   * Инициализирует управление
   * @param scene
   */
  initCursors(scene: Phaser.Scene): void {
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  /**
   * Включает джетпак
   * @param enabled
   */
  toggleJetpack(enabled: boolean): void {
    this.flames.setVisible(enabled);
  }

  toggleShield(enabled: boolean) {
    this.pvsShield.setVisible(enabled);
  }

  /**
   * Убивает мышь.
   */
  kill() {
    // DEMO: убрать после дебага
    return;

    if (this.playerState !== PlayerState.Running) {
      return;
    }

    this.playerState = PlayerState.Killed;

    this.player.play(ASSETS.player.animations.death);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(1000);
    body.setAccelerationY(0);
    this.toggleJetpack(false);
  }

  /**
   * Ускоряет мышь спустя какое-то время
   */
  speedUpPlayerByTime(time: number): void {
    //TODO убрать после дебага
    // return;

    if (this.playerSpeed === 0) {
      return;
    }
    const body = this.body as Phaser.Physics.Arcade.Body;

    const currentSecond = Math.ceil(time / 1000);

    if (currentSecond - this.seconds >= this.deltaSeconds) {
      this.seconds = currentSecond;

      this.playerSpeed += this.deltaSpeed;
      body.setVelocityX(this.playerSpeed);
    }
  }

  stopPlayerByBreak() {
    const body = this.body as Phaser.Physics.Arcade.Body;

    const prevSpeed = this.playerSpeed;

    this.playerSpeed = 0;
    body.setVelocityX(this.playerSpeed);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.playerSpeed = prevSpeed;
        body.setVelocityX(this.playerSpeed);

        resolve(() => true);
      }, this.breakTime);
    });
  }
}
