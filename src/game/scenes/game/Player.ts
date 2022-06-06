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
   * Управление стрелочками и пробелом
   */
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  /**
   * Ускорение мыши наверх
   */
  accelerationY = -3500;

  /**
   * Скорость мыши
   */
  mouseSpeed = 200;

  /**
   * На сколько мышь ускоряется спустя время
   */
  // TODO 20
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
   * Время действия кофе, ms
   */
  coffeeTime = 5000;

  /**
   * Время перерыва
   */
  breakTime = 10000;

  preUpdate(t: number, dt: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    switch (this.playerState) {
      case PlayerState.Running: {
        // Если нажат пробел
        if (this.cursors.space?.isDown && !this.isFalling) {
          body.setAccelerationY(this.accelerationY);
          this.toggleJetpack(true);

          // Анимация полета
          this.player.play(ASSETS.player.animations.fly, true);
        } else {
          body.setAccelerationY(0);
          this.toggleJetpack(false);

          if (body.blocked.down) {
            // Дефолтная анимация бега
            this.player.play(ASSETS.player.animations.run, true);
            this.isFalling = false;
          } else {
            // Анимация падения
            this.player.play(ASSETS.player.animations.fall, true);
            this.isFalling = true;
          }
        }

        // Пока мышь бежит - ускоряем ее
        this.speedUpPlayerByTime(t);

        break;
      }

      case PlayerState.Killed: {
        body.velocity.x *= 0.99;

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
    // Мышь
    this.player = scene.add
      .sprite(0, 0, ASSETS.player.key)
      .setOrigin(0.5, 1)
      .play(ASSETS.player.animations.run);

    // Добавляет объект к контейнеру
    this.add(this.player);

    // Сопоставляем физическое тело мыши и спрайт
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Коэффициенты честно подобраны рандомно, никакой логики
    body.setSize(this.player.width * 0.7, this.player.height * 0.8);
    body.setOffset(-this.player.width * 0.45, -this.player.height * 0.95);

    // Даем мыши скорость
    body.setVelocityX(this.mouseSpeed);
  }

  /**
   * Добавляет огонь из жёпы
   * @param scene
   */
  initFlames(scene: Phaser.Scene): void {
    this.flames = scene.add
      .sprite(-22, -11, ASSETS.player.key)
      .play(ASSETS.player.animations.flamesOn);
    this.add(this.flames);
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

  /**
   * Убивает мышь.
   */
  kill() {
    if (this.playerState !== PlayerState.Running) {
      return;
    }

    this.playerState = PlayerState.Killed;

    this.player.play(ASSETS.player.animations.death);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAccelerationY(0);
    body.setVelocityX(1000);
    this.toggleJetpack(false);
  }

  /**
   * Ускоряет мышь спустя какое-то время
   */
  speedUpPlayerByTime(time: number): void {
    if (this.mouseSpeed === 0) {
      return;
    }
    const body = this.body as Phaser.Physics.Arcade.Body;

    const currentSecond = Math.ceil(time / 1000);

    if (currentSecond - this.seconds >= this.deltaSeconds) {
      this.seconds = currentSecond;

      this.mouseSpeed += this.deltaSpeed;
      body.setVelocityX(this.mouseSpeed);
    }
  }

  /**
   * Замедляет мышь на время
   */
  slowdownMouseByCoffee(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    const prevSpeed = this.mouseSpeed;

    this.mouseSpeed = prevSpeed * 0.5;
    body.setVelocityX(this.mouseSpeed);

    setTimeout(() => {
      this.mouseSpeed = prevSpeed;
      body.setVelocityX(this.mouseSpeed);
    }, this.coffeeTime);
  }

  stopMouseByBreak(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    const prevSpeed = this.mouseSpeed;

    this.mouseSpeed = 0;
    body.setVelocityX(this.mouseSpeed);

    setTimeout(() => {
      this.mouseSpeed = prevSpeed;
      body.setVelocityX(this.mouseSpeed);
    }, this.breakTime);
  }
}
