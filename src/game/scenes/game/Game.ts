import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import { IGameEdgesCoordinates } from "../../interfaces/IGameEdgesCoordinates";
import Mouse from "./Mouse";
import Laser from "./Laser";
import { log } from "util";

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
   * Отступ от низа игры
   */
  worldBoundBottom = 30;

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

  // Тут можно задавать дефолтные значения
  init() {
    // Обнуляем счет в начале игры
    this.score = 0;

    this.coins = this.physics.add.staticGroup();
  }

  // Создание всего и вся
  create() {
    console.log("game");

    this.setWorldBounds();

    // Отрисовка фона и объектов на нем
    // Порядок означает z-index: раньше вызов - дальше объект
    this.drawBackground();

    this.spawnCoins();

    this.drawMouse();
    this.drawLaser();

    this.drawScoreLabel();

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
  }

  // Отрабатывает на каждый тик
  update(time: number, delta: number) {
    this.moveBackground();
    this.despawnCoinOffScreen();
    this.respawnLaser();

    this.mouseGoHomeAfterTime(12, 55);

    if (this.mouse.mouseState === 2) {
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
    const numCoins = Phaser.Math.Between(1, 20);

    for (let i = 0; i < numCoins; i++) {
      const coin = this.coins.get(
        x,
        Phaser.Math.Between(100, this.scale.height - 100),
        ASSETS.coin.key
      ) as Phaser.Physics.Arcade.Sprite;

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
    this.score += 1;

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
      .text(10, 10, `Score: ${this.score}`)
      .setScrollFactor(0);
  }

  /**
   * Обновляет счет
   */
  updateScoreLabel(): void {
    this.scoreLabel.text = `Score: ${this.score}`;
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
    mouse.kill();
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
