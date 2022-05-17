import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import { IGameEdgesCoordinates } from "../../interfaces/IGameEdgesCoordinates";
import Mouse, { MouseState } from "./Mouse";
import Laser from "./Laser";

export default class Game extends Phaser.Scene {
  constructor() {
    super(SCENES.game);
  }

  /**
   * Главный герой - мышь
   */
  mouse!: Mouse;

  /**
   * Задний фон
   */
  background!: Phaser.GameObjects.TileSprite;

  /**
   * Лазер
   */
  laser!: Laser;

  /**
   * Группа монеток
   */
  coins!: Phaser.Physics.Arcade.StaticGroup;

  /**
   * Бафф кофе
   */
  coffee!: Phaser.GameObjects.Image;

  /**
   * Бафф x2
   */
  x2!: Phaser.GameObjects.Image;

  /**
   * Бафф перерыв
   */
  break!: Phaser.GameObjects.Image;

  /**
   * Бафф неуязвимость
   */
  invincibility!: Phaser.GameObjects.Image;

  /**
   * Текст неуязвимости
   */
  invincibilityLabel!: Phaser.GameObjects.Text;

  /**
   * Бафф ментор
   */
  mentor!: Phaser.GameObjects.Image;

  /**
   * Флаг есть ли бафф ментора
   */
  isMentor = false;

  /**
   * Текст ментора
   */
  mentorLabel!: Phaser.GameObjects.Text;

  /**
   * Отступ от низа игры
   */
  worldBoundBottom = 50;

  /**
   * Отступ камеры от мыши
   */
  cameraFollowOffset = new Phaser.Math.Vector2(-200, 0);

  /**
   * Счет
   */
  score = 0;

  /**
   * Текст счета
   */
  scoreLabel!: Phaser.GameObjects.Text;

  /**
   * Секунды для начисления очков
   */
  seconds = 0;

  /**
   * Количество очков в секунду
   */
  salary = 1;

  /**
   * Множитель очков в секунду
   */
  salaryMultiplier = 1;

  // Тут можно задавать дефолтные значения
  init() {
    // Обнуляем счет в начале игры
    this.score = 0;
    this.salaryMultiplier = 1;

    this.coins = this.physics.add.staticGroup();
  }

  // Создание всего и вся
  create() {
    console.log("game");

    this.setWorldBounds();

    this.drawBackground();

    this.spawnCoins();
    this.initCoffee();
    this.initX2();
    this.initBreak();
    this.initInvincibility();
    this.initMentor();

    this.drawMouse();
    this.drawLaser();

    this.drawScoreLabel();
    this.drawInvincibilityLabel();
    this.drawMentorLabel();

    this.setCamera();

    // Взаимодействие мыши и лазера
    this.physics.add.overlap(
      this.laser,
      this.mouse,
      //@ts-ignore
      this.handleLaserCrash,
      undefined,
      true
    );
    // Взаимодействие мыши и монеток
    this.physics.add.overlap(
      this.mouse,
      this.coins,
      this.handleCoinCollect,
      undefined,
      this
    );
    // Респавн монеток
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: this.spawnCoins,
      callbackScope: this,
    });

    // Начисление зп каждую секунду
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.updateScoreByTime,
      callbackScope: this,
    });

    // Взаимодействие мыши и кофе
    this.physics.add.overlap(
      this.mouse,
      this.coffee,
      this.handleCoffeeCollect,
      undefined,
      this
    );
    // Взаимодействие мыши и X2
    this.physics.add.overlap(
      this.mouse,
      this.x2,
      this.handleX2Collect,
      undefined,
      this
    );
    // Взаимодействие мыши и перерыва
    this.physics.add.overlap(
      this.mouse,
      this.break,
      this.handleBreakCollect,
      undefined,
      this
    );
    // Взаимодействие мыши и неуязвимости
    this.physics.add.overlap(
      this.mouse,
      this.invincibility,
      this.handleInvincibilityCollect,
      undefined,
      this
    );
    // Взаимодействие мыши и ментора
    this.physics.add.overlap(
      this.mouse,
      this.mentor,
      this.handleMentorCollect,
      undefined,
      this
    );
  }

  // Отрабатывает на каждый тик
  update(time: number, delta: number) {
    this.moveBackground();
    this.despawnCoinOffScreen();
    // this.respawnCoffee();
    // this.respawnX2();
    this.respawnBreak();
    // this.respawnInvincibility();
    // this.respawnMentor();
    this.respawnLaser();

    this.mouseGoHomeAfterTime(17, 55);

    // Мышь умерла - пошли на конечную сцену
    if (this.mouse.mouseState === MouseState.Dead) {
      this.scene.run(SCENES.end, { score: this.score });
    }
  }

  /**
   * Мышка уходит из игры после установленного времени
   * @param hours
   * @param minutes
   * @param seconds
   */
  mouseGoHomeAfterTime(hours = 0, minutes = 0, seconds = 0) {
    const now = new Date();
    const _hours = now.getHours();
    const _minutes = now.getMinutes();
    const _seconds = now.getSeconds();

    if (_hours >= hours && _minutes >= minutes && _seconds >= seconds) {
      this.cameras.main.stopFollow();
    }
  }

  /**
   * Рисует фон
   */
  drawBackground(): void {
    this.background = this.add
      .tileSprite(
        0,
        0,
        this.scale.width * 2,
        this.scale.height * 2,
        ASSETS.bg.key
      )
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setScale(0.5);
  }

  /**
   * Двигает фон, как будто есть движение, со скоростью камеры
   */
  moveBackground(): void {
    this.background.setTilePosition(this.cameras.main.scrollX);
  }

  /**
   * Спавнит монетки
   */
  spawnCoins(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    // Стартовая координата спавна монеток
    let x = rightEdge + 100;

    // Рандомное количество монеток
    const numCoins = Phaser.Math.Between(1, 10);

    for (let i = 0; i < numCoins; i++) {
      const coin = this.coins
        .get(
          x,
          Phaser.Math.Between(100, this.scale.height - 100),
          ASSETS.coin.key
        )
        .setScale(0.25) as Phaser.Physics.Arcade.Sprite;

      // make sure coin is active and visible
      coin.setVisible(true);
      coin.setActive(true);

      // enable and adjust physics body to be a circle
      const body = coin.body as Phaser.Physics.Arcade.StaticBody;
      body.setCircle(body.width * 0.5);
      body.enable = true;

      body.updateFromGameObject();

      // move x a random amount
      x += coin.width * 1.5;
    }
  }

  /**
   * Собирание монеток
   */
  handleCoinCollect(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ): void {
    const coin = obj2 as Phaser.Physics.Arcade.Sprite;

    // При подборе монетки уничтожаем ее
    this.coins.killAndHide(coin);
    this.coins.remove(coin);

    // Увеличиваем счет
    this.score += 50;

    this.updateScoreLabel();
  }

  /**
   * Уничтожает монетку, если она за экраном
   */
  despawnCoinOffScreen() {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    this.coins.children.each((child) => {
      const coin = child as Phaser.Physics.Arcade.Sprite;
      if (coin.x + coin.width / 2 < leftEdge) {
        this.coins.remove(child);
      }
    });
  }

  /**
   * Рисует счет
   */
  drawScoreLabel(): void {
    this.scoreLabel = this.add
      .text(10, 10, `Score: ${this.score}. Multi: x${this.salaryMultiplier}`)
      .setScrollFactor(0);
  }

  /**
   * Обновляет счет
   */
  updateScoreLabel(): void {
    this.scoreLabel.text = `Score: ${this.score}. Multi: x${this.salaryMultiplier}`;
  }

  /**
   * Обновляет счет со временем
   */
  updateScoreByTime(): void {
    if (this.mouse.mouseState === MouseState.Running) {
      this.score += this.salary * this.salaryMultiplier;
      this.updateScoreLabel();
    }
  }

  /**
   * Рисует Мышь
   */
  drawMouse(): void {
    // Спрайт мыши
    this.mouse = new Mouse(
      this,
      this.scale.width / 4,
      this.scale.height - this.worldBoundBottom
    );
    this.add.existing(this.mouse);

    // Столкновение мыши с границами мира
    //@ts-ignore
    this.mouse.body.setCollideWorldBounds(true);
  }

  /**
   * Рисует лазер
   */
  drawLaser(): void {
    // Спрайт лазера
    this.laser = new Laser(
      this,
      this.scale.width - 200,
      this.scale.height / 2 - 100
    );
    this.add.existing(this.laser);
  }

  respawnLaser(): void {
    if (this.isMentor) return;

    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const body = this.laser.body as Phaser.Physics.Arcade.StaticBody;

    if (this.laser.x + body.width / 2 < leftEdge) {
      this.laser.x = Phaser.Math.Between(
        rightEdge + body.width / 2,
        rightEdge + 100
      );
      this.laser.y = Phaser.Math.Between(10, 300);

      body.position.x = this.laser.x + body.offset.x;
      body.position.y = this.laser.y + 15;
    }
  }

  /**
   * Столкновение с лазером
   */
  handleLaserCrash(laser: Laser, mouse: Mouse): void {
    if (mouse.isInvincible) return;

    mouse.kill();
  }

  /**
   * Инициализация кофе
   */
  initCoffee(): void {
    this.coffee = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width, this.scale.width * 2),
        this.scale.height / 2,
        ASSETS.buffCoffee.key
      )
      .setScale(0.5);
    const coffeeBody = this.coffee.body as Phaser.Physics.Arcade.StaticBody;
    coffeeBody.setCircle(coffeeBody.width * 0.25);
    coffeeBody.setOffset(coffeeBody.width / 2, coffeeBody.height / 2);
  }

  /**
   * Спавнит кофе в рандомной точке
   */
  spawnCoffee(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const coffeeBody = this.coffee.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 2,
      rightEdge + this.scale.width * 6
    );
    const y = Phaser.Math.Between(0, this.scale.height - this.worldBoundBottom);

    this.coffee.x = x;
    this.coffee.y = y;

    coffeeBody.updateFromGameObject();
  }

  /**
   * Респавнит кофе, если оно вылезло за экран
   */
  respawnCoffee(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.coffee.x + this.coffee.width < leftEdge) {
      this.spawnCoffee();
    }
  }

  /**
   * Хэндлер сбора кофе
   */
  handleCoffeeCollect(): void {
    this.mouse.slowdownMouseByCoffee();
    this.spawnCoffee();
  }

  /**
   * Инициализация x2
   */
  initX2(): void {
    this.x2 = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width, this.scale.width * 2),
        this.scale.height / 2,
        ASSETS.buffX2.key
      )
      .setScale(0.5);
    const x2Body = this.x2.body as Phaser.Physics.Arcade.StaticBody;
    x2Body.setCircle(x2Body.width * 0.25);
    x2Body.setOffset(x2Body.width / 2, x2Body.height / 2);
  }

  /**
   * Спавнит x2 в рандомной точке
   */
  spawnX2(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const x2Body = this.x2.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 2,
      rightEdge + this.scale.width * 6
    );
    const y = Phaser.Math.Between(0, this.scale.height - this.worldBoundBottom);

    this.x2.x = x;
    this.x2.y = y;

    x2Body.updateFromGameObject();
  }

  /**
   * Респавнит x2, если оно вылезло за экран
   */
  respawnX2(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.x2.x + this.x2.width < leftEdge) {
      this.spawnX2();
    }
  }

  /**
   * Хэндлер сбора x2
   */
  handleX2Collect(): void {
    this.salaryMultiplier *= 2;

    this.spawnX2();
    this.updateScoreLabel();
  }

  /**
   * Инициализация перерыва
   */
  initBreak(): void {
    this.break = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width * 2, this.scale.width * 6),
        this.scale.height / 2,
        ASSETS.buffBreak.key
      )
      .setScale(0.5);
    const breakBody = this.break.body as Phaser.Physics.Arcade.StaticBody;
    breakBody.setCircle(breakBody.width * 0.25);
    breakBody.setOffset(breakBody.width / 2, breakBody.height / 2);
  }

  /**
   * Спавнит перерыв в рандомной точке
   */
  spawnBreak(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const breakBody = this.break.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 2,
      rightEdge + this.scale.width * 6
    );
    const y = Phaser.Math.Between(0, this.scale.height - this.worldBoundBottom);

    this.break.x = x;
    this.break.y = y;

    breakBody.updateFromGameObject();
  }

  /**
   * Респавнит x2, если оно вылезло за экран
   */
  respawnBreak(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.break.x + this.break.width < leftEdge) {
      this.spawnBreak();
    }
  }

  /**
   * Хэндлер сбора x2
   */
  handleBreakCollect(): void {
    this.mouse.stopMouseByBreak();
    this.spawnBreak();
  }

  /**
   * Инициализация неуязвимости
   */
  initInvincibility(): void {
    this.invincibility = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width, this.scale.width * 2),
        this.scale.height / 2,
        ASSETS.buffPvs.key
      )
      .setScale(0.5);
    const invincibilityBody = this.invincibility
      .body as Phaser.Physics.Arcade.StaticBody;
    invincibilityBody.setCircle(invincibilityBody.width * 0.25);
    invincibilityBody.setOffset(
      invincibilityBody.width / 2,
      invincibilityBody.height / 2
    );
  }

  /**
   * Спавнит неуязвимость в рандомной точке
   */
  spawnInvincibility(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const invincibilityBody = this.invincibility
      .body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 2,
      rightEdge + this.scale.width * 6
    );
    const y = Phaser.Math.Between(0, this.scale.height - this.worldBoundBottom);

    this.invincibility.x = x;
    this.invincibility.y = y;

    invincibilityBody.updateFromGameObject();
  }

  /**
   * Респавнит неуязвимость, если оно вылезло за экран
   */
  respawnInvincibility(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.invincibility.x + this.invincibility.width < leftEdge) {
      this.spawnInvincibility();
    }
  }

  /**
   * Хэндлер сбора неуязвимости
   */
  handleInvincibilityCollect(): void {
    this.spawnInvincibility();
    this.mouse.isInvincible = true;

    this.updateInvincibilityLabel();

    setTimeout(() => {
      this.mouse.isInvincible = false;

      this.updateInvincibilityLabel();
    }, 10000);
  }

  /**
   * Пишет неуязвим ли ты
   */
  drawInvincibilityLabel(): void {
    this.invincibilityLabel = this.add.text(300, 10, "").setScrollFactor(0);
  }

  /**
   * Обновляет сообщения об неуязвимости
   */
  updateInvincibilityLabel(): void {
    const text = this.mouse.isInvincible ? "Неуязвимость!" : "";
    this.invincibilityLabel.text = text;
  }

  /**
   * Инициализация кофе
   */
  initMentor(): void {
    this.mentor = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width, this.scale.width * 2),
        this.scale.height / 2,
        ASSETS.buffMentor.key
      )
      .setScale(0.5);
    const mentorBody = this.mentor.body as Phaser.Physics.Arcade.StaticBody;
    mentorBody.setCircle(mentorBody.width * 0.25);
    mentorBody.setOffset(mentorBody.width / 2, mentorBody.height / 2);
  }

  /**
   * Спавнит ментора в рандомной точке
   */
  spawnMentor(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const mentorBody = this.mentor.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 2,
      rightEdge + this.scale.width * 6
    );
    const y = Phaser.Math.Between(0, this.scale.height - this.worldBoundBottom);

    this.mentor.x = x;
    this.mentor.y = y;

    mentorBody.updateFromGameObject();
  }

  /**
   * Респавнит кофе, если оно вылезло за экран
   */
  respawnMentor(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.mentor.x + this.mentor.width < leftEdge) {
      this.spawnMentor();
    }
  }

  /**
   * Хэндлер сбора кофе
   */
  handleMentorCollect(): void {
    this.isMentor = true;
    this.spawnMentor();

    this.updateMentorLabel();

    setTimeout(() => {
      this.isMentor = false;

      this.updateMentorLabel();
    }, 10000);
  }

  /**
   * Пишет под ментором ли ты
   */
  drawMentorLabel(): void {
    this.mentorLabel = this.add.text(400, 10, "").setScrollFactor(0);
  }

  /**
   * Обновляет сообщения о менторе
   */
  updateMentorLabel(): void {
    const text = this.isMentor ? "Ментор спаси!" : "";
    this.mentorLabel.text = text;
  }

  /**
   * Устанавливает границы мира
   */
  setWorldBounds(): void {
    this.physics.world.setBounds(
      0,
      0,
      // Раннер бесконечный, длина мира соответствующая
      Number.MAX_SAFE_INTEGER,
      // Небольшое расстояние от низа, чтобы бежать посередине пола
      this.scale.height - this.worldBoundBottom
    );
  }

  /**
   * Камера движется за мышью
   */
  setCamera(): void {
    this.cameras.main.startFollow(this.mouse);
    this.cameras.main.followOffset = this.cameraFollowOffset;
    // Не дает камере покинуть пределы экрана
    this.cameras.main.setBounds(
      0,
      0,
      Number.MAX_SAFE_INTEGER,
      this.scale.height
    );
  }

  /**
   * Возвращает координаты левого и правого края игры
   * @return IGameEdgesCoordinates - координаты левого и правого края игры
   */
  getGameEdgesCoordinates(): IGameEdgesCoordinates {
    return {
      leftEdge: this.cameras.main.scrollX,
      rightEdge: this.cameras.main.scrollX + this.scale.width,
    };
  }
}
