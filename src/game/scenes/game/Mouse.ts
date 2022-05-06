import * as Phaser from "phaser";
import ASSETS from "../../ASSETS";

export enum MouseState {
  Running,
  Stopped,
  Killed,
  Dead,
}

export default class Mouse extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Добавляем физику мыши в сцену
    scene.physics.add.existing(this);

    this.initFlames(scene);
    this.initMouse(scene);
    this.initCursors(scene);

    this.toggleJetpack(false);
  }

  /**
   * Мышь
   */
  mouse!: Phaser.GameObjects.Sprite;

  /**
   * Состояние мыши
   */
  mouseState = MouseState.Running;

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
  accelerationY = -3000;

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

    switch (this.mouseState) {
      case MouseState.Running: {
        // Если нажат пробел
        if (this.cursors.space?.isDown) {
          body.setAccelerationY(this.accelerationY);
          this.toggleJetpack(true);

          // Анимация полета
          this.mouse.play(ASSETS.mouse.animations.fly, true);
        } else {
          body.setAccelerationY(0);
          this.toggleJetpack(false);

          if (body.blocked.down) {
            // Дефолтная анимация бега
            this.mouse.play(ASSETS.mouse.animations.run, true);
          } else {
            // Анимация падения
            this.mouse.play(ASSETS.mouse.animations.fall, true);
          }
        }

        // Пока мышь бежит - ускоряем ее
        this.speedUpMouseByTime(t);

        break;
      }

      case MouseState.Killed: {
        body.velocity.x *= 0.99;

        if (body.velocity.x <= 5) {
          this.mouseState = MouseState.Dead;
        }

        break;
      }

      case MouseState.Dead: {
        body.setVelocity(0, 0);

        break;
      }
    }
  }

  /**
   * Добавляет мышь
   * @param scene
   */
  initMouse(scene: Phaser.Scene): void {
    // Мышь
    this.mouse = scene.add
      .sprite(0, 0, ASSETS.mouse.key)
      .setOrigin(0.5, 1)
      .play(ASSETS.mouse.animations.run);

    // Добавляет объект к контейнеру
    this.add(this.mouse);

    // Сопоставляем физическое тело мыши и спрайт
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Коэффициенты честно подобраны рандомно, никакой логики
    body.setSize(this.mouse.width * 0.7, this.mouse.height * 0.8);
    body.setOffset(-this.mouse.width * 0.45, -this.mouse.height * 0.95);

    // Даем мыши скорость
    body.setVelocityX(this.mouseSpeed);
  }

  /**
   * Добавляет огонь из жёпы
   * @param scene
   */
  initFlames(scene: Phaser.Scene): void {
    this.flames = scene.add
      .sprite(-63, -17, ASSETS.mouse.key)
      .play(ASSETS.mouse.animations.flamesOn);
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
    if (this.mouseState !== MouseState.Running) {
      return;
    }

    this.mouseState = MouseState.Killed;

    this.mouse.play(ASSETS.mouse.animations.death);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAccelerationY(0);
    body.setVelocityX(1000);
    this.toggleJetpack(false);
  }

  /**
   * Ускоряет мышь спустя какое-то время
   */
  speedUpMouseByTime(time: number): void {
    if (this.mouseState === MouseState.Stopped) {
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

    this.mouseState = MouseState.Stopped;

    setTimeout(() => {
      this.mouseSpeed = prevSpeed;
      body.setVelocityX(this.mouseSpeed);

      this.mouseState = MouseState.Running;
    }, this.breakTime);
  }
}
