import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import { IGameEdgesCoordinates } from "../../interfaces/IGameEdgesCoordinates";
import Player, { PlayerState } from "./Player";
import Laser from "./Laser";

const overlapEntities = [
  {
    name: ASSETS.buffCoffee.key,
    xFrom: 0,
    xTo: 1,
  },
  {
    name: ASSETS.buffX2.key,
    xFrom: 0,
    xTo: 1,
  },
  {
    name: ASSETS.buffBreak.key,
    xFrom: 0,
    xTo: 1,
  },
  {
    name: ASSETS.buffPvs.key,
    xFrom: 0,
    xTo: 1,
  },
  {
    name: ASSETS.buffMentor.key,
    xFrom: 0,
    xTo: 1,
  },
];

export default class Game extends Phaser.Scene {
  constructor() {
    super(SCENES.game);
  }

  /**
   * Главный герой
   */
  player!: Player;
  /**
   * Задний фон
   */
  background!: Phaser.GameObjects.TileSprite;
  /**
   * Группа монеток
   */
  coins!: Phaser.Physics.Arcade.StaticGroup;
  /**
   * Группа неприятностей
   */
  debuffs!: Phaser.Physics.Arcade.StaticGroup;
  /**
   * Бафф кофе
   */
  buffCoffee!: Phaser.GameObjects.Image;
  /**
   * Бафф x2
   */
  buffX2!: Phaser.GameObjects.Image;
  /**
   * Бафф перерыв
   */
  buffBreak!: Phaser.GameObjects.Image;
  /**
   * Бафф неуязвимость
   */
  buffPvs!: Phaser.GameObjects.Image;
  /**
   * Текст неуязвимости
   */
  invincibilityLabel!: Phaser.GameObjects.Text;
  /**
   * Бафф ментор
   */
  buffMentor!: Phaser.GameObjects.Image;
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
   * Отступ камеры
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
  /** Минимальное расстояние между ништяками */
  overlapMargin = 2;

  // Тут можно задавать дефолтные значения
  init() {
    // Обнуляем счет в начале игры
    this.score = 0;
    this.salaryMultiplier = 1;

    this.coins = this.physics.add.staticGroup();
    this.debuffs = this.physics.add.staticGroup();
  }

  // Создание всего и вся
  create() {
    this.setWorldBounds();

    this.drawBackground();

    // this.spawnCoins();
    this.spawnDebuffs();
    this.initBuffs();

    this.drawPlayer();

    this.drawScoreLabel();
    this.drawInvincibilityLabel();
    this.drawMentorLabel();

    this.setCamera();

    //region Collisions
    // Взаимодействие мыши и неприятностей
    // this.physics.add.overlap(
    //   this.player,
    //   this.debuffs,
    //   //@ts-ignore
    //   this.handleMouseCrash,
    //   undefined,
    //   true
    // );
    // // Взаимодействие мыши и монеток
    // this.physics.add.overlap(
    //   this.player,
    //   this.coins,
    //   this.handleCoinCollect,
    //   undefined,
    //   this
    // );
    // // Взаимодействие мыши и кофе
    // this.physics.add.overlap(
    //   this.player,
    //   this.coffee,
    //   this.handleCoffeeCollect,
    //   undefined,
    //   this
    // );
    // // Взаимодействие мыши и X2
    // this.physics.add.overlap(
    //   this.player,
    //   this.x2,
    //   this.handleX2Collect,
    //   undefined,
    //   this
    // );
    // // Взаимодействие мыши и перерыва
    // this.physics.add.overlap(
    //   this.player,
    //   this.break,
    //   this.handleBreakCollect,
    //   undefined,
    //   this
    // );
    // // Взаимодействие мыши и неуязвимости
    // this.physics.add.overlap(
    //   this.player,
    //   this.invincibility,
    //   this.handleInvincibilityCollect,
    //   undefined,
    //   this
    // );
    // // Взаимодействие мыши и ментора
    // this.physics.add.overlap(
    //   this.player,
    //   this.mentor,
    //   this.handleMentorCollect,
    //   undefined,
    //   this
    // );
    //endregion Collisions

    // Респавн монеток
    // this.time.addEvent({
    //   delay: 5000,
    //   loop: true,
    //   callback: this.spawnCoins,
    //   callbackScope: this,
    // });
    // Респавн неприятностей
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: this.spawnDebuffs,
      callbackScope: this,
    });
    // Начисление зп каждую секунду
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.updateScoreByTime,
      callbackScope: this,
    });
  }

  // Отрабатывает на каждый тик
  update(time: number, delta: number) {
    if (this.isMentor) {
      this.despawnDebuffs();
    }

    this.moveBackground();
    // this.despawnCoinOffScreen();
    this.despawnDebuffOffScreen();
    this.respawnBuffs();

    // Мышь умерла - пошли на конечную сцену
    if (this.player.playerState === PlayerState.Dead) {
      this.scene.run(SCENES.end, { score: this.score });
    }
  }

  /**
   * Рисует фон
   */
  drawBackground(): void {
    const bgSprite = this.add.tileSprite(0, 0, 0, 0, ASSETS.bg.key);

    const scaleY = this.cameras.main.height / bgSprite.height;

    this.background = bgSprite
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setScale(scaleY);
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
    if (this.player.playerState === PlayerState.Running) {
      this.score += this.salary * this.salaryMultiplier;
      this.updateScoreLabel();
    }
  }

  /**
   * Спавнит неприятности
   */
  spawnDebuffs(): void {
    if (this.isMentor) return;

    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    // Стартовая координата спавна неприятности
    let x = rightEdge + 100;

    // Рандомное количество дебаффов
    const numDebuffs = Phaser.Math.Between(1, 4);

    const debuffsAssets = [
      "debuffBug",
      "debuffDeadline",
      "debuffDebt",
      "debuffDeploy",
      "debuffTestFailed",
    ];

    const debuffScale = 0.75;

    for (let i = 0; i < numDebuffs; i++) {
      const randomAssetIndex = Math.floor(Math.random() * debuffsAssets.length);
      const randomAssetKey = debuffsAssets[randomAssetIndex];

      const debuff = this.debuffs
        .get(
          x,
          this.scale.height - this.worldBoundBottom,
          // @ts-ignore
          ASSETS[randomAssetKey].key
        )
        .setScale(debuffScale) as Phaser.Physics.Arcade.Sprite;

      // Тк центр неприятности в центре, сдвигаем ее повыше чтоб как бы стояла на полу
      debuff.y -= (debuff.height * debuffScale) / 2;

      // make sure coin is active and visible
      debuff.setVisible(true);
      debuff.setActive(true);

      // enable and adjust physics body to be a circle
      const body = debuff.body as Phaser.Physics.Arcade.StaticBody;
      body.setCircle(body.width * 0.5);
      body.enable = true;

      body.updateFromGameObject();

      // move x a random amount
      x += debuff.width * Phaser.Math.Between(3, 5);
    }
  }

  /**
   * Уничтожает неприятность, если она за экраном
   */
  despawnDebuffOffScreen() {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    this.debuffs.children.each((child) => {
      const debuff = child as Phaser.Physics.Arcade.Sprite;
      if (debuff.x + debuff.width / 2 < leftEdge) {
        this.debuffs.remove(child);

        // Когда все неприятности уйдут с экрана, спавним их снова
        const debuffsOnScreenCount = this.debuffs.children.getArray().length;
        if (debuffsOnScreenCount === 0 && !this.isMentor) {
          this.spawnDebuffs();
        }
      }
    });
  }

  /**
   * Уничтожает неприятности при подборе ментора
   */
  despawnDebuffs() {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    this.debuffs.children.each((child) => {
      const debuff = child as Phaser.Physics.Arcade.Sprite;
      debuff.x = leftEdge - 100;
    });
  }

  /**
   * Рисует Мышь
   */
  drawPlayer(): void {
    // Спрайт мыши
    this.player = new Player(
      this,
      this.scale.width / 4,
      this.scale.height - this.worldBoundBottom
    );
    this.add.existing(this.player);

    // Столкновение мыши с границами мира
    //@ts-ignore
    this.player.body.setCollideWorldBounds(true);
  }

  /**
   * Столкновение с неприятностями
   */
  handleMouseCrash(
    mouse: Player,
    debuffs: Phaser.GameObjects.GameObject
  ): void {
    if (mouse.isInvincible) return;

    mouse.kill();
  }

  /**
   * Создает объект баффа
   *
   * @param buff - имя объекта
   * @param key - идентификатор баффа
   */
  initBuff(buff: string) {
    // @ts-ignore
    const { xFrom, xTo } = overlapEntities.find((e) => e.name === buff);

    // @ts-ignore
    this[buff] = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width * xFrom, this.scale.width * xTo),
        this.scale.height / 2,
        buff
      )
      .setScale(0.5);

    // @ts-ignore
    const buffBody = this[buff] as Phaser.Physics.Arcade.StaticBody;
    buffBody.setCircle(buffBody.width * 0.25);
    buffBody.setOffset(buffBody.width / 2, buffBody.height / 2);

    this.spawnBuff(buff);
  }

  /**
   * Перемещает бафф, респавнит его
   *
   * @param buff - имя объекта
   */
  spawnBuff(buff: string) {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    // @ts-ignore
    const { xFrom, xTo } = overlapEntities.find((e) => e.name === buff);

    // @ts-ignore
    const buffBody = this[buff].body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * xFrom,
      rightEdge + this.scale.width * xTo
    );
    const y = Phaser.Math.Between(
      buffBody.height / 2,
      this.scale.height - this.worldBoundBottom - buffBody.height / 2 - 100
    );

    //@ts-ignore
    this[buff].x = x;
    //@ts-ignore
    this[buff].y = y;

    buffBody.updateFromGameObject();

    this.preventOverlap(buff);
  }

  /**
   * Если заспавненный бафф пересекает другой бафф, переспавнивает его
   *
   * @param buff
   */
  preventOverlap(buff: string) {
    overlapEntities.forEach((entity) => {
      const entityName = entity.name;

      // @ts-ignore
      if (buff === entityName || !this[buff] || !this[entityName]) return;
      // @ts-ignore
      const boundsA = this[buff].getBounds();
      // @ts-ignore
      const boundsB = this[entityName].getBounds();
      const overlap = Phaser.Geom.Intersects.RectangleToRectangle(
        boundsA,
        boundsB
      );

      if (overlap) {
        this.spawnBuff(buff);
      }
    });
  }

  /**
   * Респавнит бафф, если он вышел за пределы видимости
   *
   * @param buff - имя объекта
   */
  respawnBuff(buff: string) {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    // @ts-ignore
    if (this[buff].x + this[buff].width < leftEdge) {
      this.spawnBuff(buff);
    }
  }

  /**
   * Создает все баффы
   */
  initBuffs() {
    this.initBuff(ASSETS.buffCoffee.key);
    this.initBuff(ASSETS.buffX2.key);
    this.initBuff(ASSETS.buffBreak.key);
    this.initBuff(ASSETS.buffPvs.key);
    this.initBuff(ASSETS.buffMentor.key);
  }

  /**
   * Проверяет не скрылись ли баффы с экрана и если да то перемещает их вперед
   */
  respawnBuffs() {
    this.respawnBuff(ASSETS.buffCoffee.key);
    this.respawnBuff(ASSETS.buffX2.key);
    this.respawnBuff(ASSETS.buffBreak.key);
    this.respawnBuff(ASSETS.buffPvs.key);
    this.respawnBuff(ASSETS.buffMentor.key);
  }

  /**
   * Инициализация кофе
   */
  initCoffee(): void {
    this.buffCoffee = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width * 2, this.scale.width * 6),
        this.scale.height / 2,
        ASSETS.buffCoffee.key
      )
      .setScale(0.5);
    const coffeeBody = this.buffCoffee.body as Phaser.Physics.Arcade.StaticBody;
    coffeeBody.setCircle(coffeeBody.width * 0.25);
    coffeeBody.setOffset(coffeeBody.width / 2, coffeeBody.height / 2);
  }

  /**
   * Спавнит кофе в рандомной точке
   */
  spawnCoffee(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const coffeeBody = this.buffCoffee.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 0,
      rightEdge + this.scale.width * 1
    );
    const y = Phaser.Math.Between(
      coffeeBody.height / 2,
      this.scale.height - this.worldBoundBottom - coffeeBody.height / 2
    );

    this.buffCoffee.x = x;
    this.buffCoffee.y = y;

    coffeeBody.updateFromGameObject();
  }

  /**
   * Респавнит кофе, если оно вылезло за экран
   */
  respawnCoffee(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.buffCoffee?.x + this.buffCoffee?.width < leftEdge) {
      this.spawnCoffee();
    }
  }

  /**
   * Хэндлер сбора кофе
   */
  handleCoffeeCollect(): void {
    this.player.slowdownPlayerByCoffee();
    this.spawnCoffee();
  }

  /**
   * Инициализация x2
   */
  initX2(): void {
    this.buffX2 = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width * 4, this.scale.width * 8),
        this.scale.height / 2,
        ASSETS.buffX2.key
      )
      .setScale(0.5);
    const x2Body = this.buffX2.body as Phaser.Physics.Arcade.StaticBody;
    x2Body.setCircle(x2Body.width * 0.25);
    x2Body.setOffset(x2Body.width / 2, x2Body.height / 2);
  }

  /**
   * Спавнит x2 в рандомной точке
   */
  spawnX2(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const x2Body = this.buffX2.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 4,
      rightEdge + this.scale.width * 8
    );
    const y = Phaser.Math.Between(
      x2Body.height / 2,
      this.scale.height - this.worldBoundBottom - x2Body.height / 2
    );

    this.buffX2.x = x;
    this.buffX2.y = y;

    x2Body.updateFromGameObject();
  }

  /**
   * Респавнит x2, если оно вылезло за экран
   */
  respawnX2(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.buffX2?.x + this.buffX2?.width < leftEdge) {
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
    this.buffBreak = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width * 2, this.scale.width * 6),
        this.scale.height / 2,
        ASSETS.buffBreak.key
      )
      .setScale(0.5);
    const breakBody = this.buffBreak.body as Phaser.Physics.Arcade.StaticBody;
    breakBody.setCircle(breakBody.width * 0.25);
    breakBody.setOffset(breakBody.width / 2, breakBody.height / 2);
  }

  /**
   * Спавнит перерыв в рандомной точке
   */
  spawnBreak(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const breakBody = this.buffBreak.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 2,
      rightEdge + this.scale.width * 6
    );
    const y = Phaser.Math.Between(
      breakBody.height / 2,
      this.scale.height - this.worldBoundBottom - breakBody.height / 2
    );

    this.buffBreak.x = x;
    this.buffBreak.y = y;

    breakBody.updateFromGameObject();
  }

  /**
   * Респавнит x2, если оно вылезло за экран
   */
  respawnBreak(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.buffBreak?.x + this.buffBreak?.width < leftEdge) {
      this.spawnBreak();
    }
  }

  /**
   * Хэндлер сбора x2
   */
  handleBreakCollect(): void {
    this.player.stopMouseByBreak();
    this.spawnBreak();
  }

  /**
   * Инициализация неуязвимости
   */
  initInvincibility(): void {
    this.buffPvs = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width * 4, this.scale.width * 12),
        this.scale.height / 2,
        ASSETS.buffPvs.key
      )
      .setScale(0.5);
    const invincibilityBody = this.buffPvs
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

    const invincibilityBody = this.buffPvs
      .body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 4,
      rightEdge + this.scale.width * 12
    );
    const y = Phaser.Math.Between(
      invincibilityBody.height,
      this.scale.height - this.worldBoundBottom - invincibilityBody.height
    );

    this.buffPvs.x = x;
    this.buffPvs.y = y;

    invincibilityBody.updateFromGameObject();
  }

  /**
   * Респавнит неуязвимость, если оно вылезло за экран
   */
  respawnInvincibility(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.buffPvs?.x + this.buffPvs?.width < leftEdge) {
      this.spawnInvincibility();
    }
  }

  /**
   * Хэндлер сбора неуязвимости
   */
  handleInvincibilityCollect(): void {
    this.spawnInvincibility();
    this.player.isInvincible = true;

    this.updateInvincibilityLabel();

    setTimeout(() => {
      this.player.isInvincible = false;

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
    const text = this.player.isInvincible ? "Неуязвимость!" : "";
    this.invincibilityLabel.text = text;
  }

  /**
   * Инициализация ментора
   */
  initMentor(): void {
    this.buffMentor = this.physics.add
      .staticImage(
        Phaser.Math.Between(this.scale.width * 8, this.scale.width * 12),
        this.scale.height / 2,
        ASSETS.buffMentor.key
      )
      .setScale(0.5);
    const mentorBody = this.buffMentor.body as Phaser.Physics.Arcade.StaticBody;
    mentorBody.setCircle(mentorBody.width * 0.25);
    mentorBody.setOffset(mentorBody.width / 2, mentorBody.height / 2);
  }

  /**
   * Спавнит ментора в рандомной точке
   */
  spawnMentor(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();

    const mentorBody = this.buffMentor.body as Phaser.Physics.Arcade.StaticBody;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * 8,
      rightEdge + this.scale.width * 12
    );
    const y = Phaser.Math.Between(
      mentorBody.height,
      this.scale.height - this.worldBoundBottom - mentorBody.height
    );

    this.buffMentor.x = x;
    this.buffMentor.y = y;

    mentorBody.updateFromGameObject();
  }

  /**
   * Респавнит ментора, если оно вылезло за экран
   */
  respawnMentor(): void {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    if (this.buffMentor?.x + this.buffMentor?.width < leftEdge) {
      this.spawnMentor();
    }
  }

  /**
   * Хэндлер сбора ментора
   */
  handleMentorCollect(): void {
    this.isMentor = true;
    this.spawnMentor();

    this.updateMentorLabel();

    setTimeout(() => {
      this.isMentor = false;

      this.updateMentorLabel();
      this.spawnDebuffs();
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
    this.cameras.main.startFollow(this.player);
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
   * Возвращает координаты левого и правого края экрана игры
   * @return IGameEdgesCoordinates - координаты левого и правого края игры
   */
  getGameEdgesCoordinates(): IGameEdgesCoordinates {
    return {
      leftEdge: this.cameras.main.scrollX,
      rightEdge: this.cameras.main.scrollX + this.scale.width,
    };
  }
}
