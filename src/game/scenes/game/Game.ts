import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import { IGameEdgesCoordinates } from "../../interfaces/IGameEdgesCoordinates";
import Player, { PlayerState } from "./Player";

const overlapEntities = [
  {
    name: ASSETS.buffX2.key,
    xFrom: 12,
    xTo: 13,
  },
  {
    name: ASSETS.buffBreak.key,
    xFrom: 5,
    xTo: 15,
  },
  {
    name: ASSETS.buffPvs.key,
    xFrom: 7,
    xTo: 8,
  },
  {
    name: ASSETS.buffMentor.key,
    xFrom: 10,
    xTo: 12,
  },
  {
    name: ASSETS.coin.key,
    xFrom: 0,
    xTo: 0.1,
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
  coin!: Phaser.Physics.Arcade.Sprite;
  /**
   * Группа неприятностей
   */
  debuffs!: Phaser.Physics.Arcade.Group;
  /**
   * Бафф x2
   */
  buffX2!: Phaser.Physics.Arcade.Sprite;
  /**
   * Текст при подборе баффа x2
   */
  buffX2PickupText!: Phaser.GameObjects.Text;
  /**
   * Таймер текста при подборе баффа x2
   */
  buffX2PickupTextTimeout!: ReturnType<typeof setTimeout>;
  /**
   * Бафф перерыв
   */
  buffBreak!: Phaser.Physics.Arcade.Sprite;
  /**
   * Бафф неуязвимость
   */
  buffPvs!: Phaser.Physics.Arcade.Sprite;
  /**
   * Таймер баффа неуязвимости
   */
  buffPvsTimeout!: ReturnType<typeof setTimeout>;
  /**
   * Таймер баффа неуязвимости (мерцания)
   */
  buffPvsBlinkingTimeout!: ReturnType<typeof setTimeout>;
  /**
   * Текст неуязвимости
   */
  invincibilityLabel!: Phaser.GameObjects.Text;
  /**
   * Бафф ментор
   */
  buffMentor!: Phaser.Physics.Arcade.Sprite;
  /**
   * Флаг есть ли бафф ментора
   */
  isMentor = false;
  /**
   * Картинка ментора когда подобран
   */
  mentorIndicator!: Phaser.GameObjects.Sprite;
  /**
   * Таймер баффа ментора
   */
  buffMentorTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {}, 0);
  /**
   * Отступ от верха игры
   */
  worldBoundTop = 50;
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
  /**
   * Текст множителя
   */
  salaryMultiplierLabel!: Phaser.GameObjects.Text;
  /** Минимальное расстояние между ништяками */
  overlapMargin = 2;

  // Тут можно задавать дефолтные значения
  init() {
    // Обнуляем счет в начале игры
    this.score = 0;
    this.salaryMultiplier = 1;

    this.debuffs = this.physics.add.group();
  }

  // Создание всего и вся
  create() {
    this.setWorldBounds();

    this.drawBackground();

    this.spawnDebuffs();
    this.initBuffs();

    this.drawPlayer();

    this.drawScoreLabel();
    this.drawScoreMultiplierLabel();
    this.drawInvincibilityLabel();
    this.drawMentorIndicator();
    this.drawX2PickupText();

    this.setCamera();

    //region Collisions
    // Взаимодействие мыши и неприятностей
    this.physics.add.overlap(
      this.player,
      this.debuffs,
      //@ts-ignore
      this.handleMouseCrash,
      undefined,
      true
    );
    // Взаимодействие мыши и монеток
    this.physics.add.overlap(
      this.player,
      this.coin,
      this.handleCoinCollect,
      undefined,
      this
    );
    // Взаимодействие мыши и X2
    this.physics.add.overlap(
      this.player,
      this.buffX2,
      this.handleX2Collect,
      undefined,
      this
    );
    // Взаимодействие мыши и перерыва
    this.physics.add.overlap(
      this.player,
      this.buffBreak,
      this.handleBreakCollect,
      undefined,
      this
    );
    // Взаимодействие мыши и неуязвимости
    this.physics.add.overlap(
      this.player,
      this.buffPvs,
      this.handleInvincibilityCollect,
      undefined,
      this
    );
    // Взаимодействие мыши и ментора
    this.physics.add.overlap(
      this.player,
      this.buffMentor,
      this.handleMentorCollect,
      undefined,
      this
    );
    //endregion Collisions

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
    this.despawnDebuffOffScreen();
    this.respawnBuffs();

    // Мышь умерла - пошли на конечную сцену
    if (this.player.playerState === PlayerState.Dead) {
      this.scene.pause(SCENES.game);
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
   * Собирание монеток
   */
  handleCoinCollect(): void {
    this.playBuffAnimationAndRespawn(ASSETS.coin.key);

    // Увеличиваем счет
    this.score += 50 * this.salaryMultiplier;

    this.updateScoreLabel();
  }

  playBuffAnimationAndRespawn(buff: string) {
    // @ts-ignore
    const body = this[buff].body;

    // @ts-ignore
    this[buff].play(ASSETS[buff].animations.pop);
    body.checkCollision.none = true;

    setTimeout(() => {
      this.spawnBuff2(buff);
      // @ts-ignore
      this[buff].play(ASSETS[buff].animations.idle);
      body.checkCollision.none = false;
    }, 1000);
  }

  /**
   * Рисует счет
   */
  drawScoreLabel(): void {
    this.scoreLabel = this.add
      .text(50, 35, `${this.score}`, {
        fontFamily: "Pribambas",
        fontSize: "72px",
        color: "#00a6ff",
        stroke: "black",
        strokeThickness: 3,
      })
      .setScrollFactor(0);
  }

  /**
   * Рисует текст множителя зп
   */
  drawScoreMultiplierLabel(): void {
    const FZ = 36;
    this.salaryMultiplierLabel = this.add
      .text(
        this.scoreLabel.width + 60,
        this.scoreLabel.y + this.scoreLabel.height / 2 - FZ / 2,
        `Х${this.salaryMultiplier}`,
        {
          fontFamily: "Pribambas",
          fontSize: `${FZ}px`,
          color: "#000",
        }
      )
      .setScrollFactor(0);
  }

  /**
   * Обновляет счет
   */
  updateScoreLabel(): void {
    this.scoreLabel.text = `${this.score}`;

    this.updateScoreMultiplierLabel();
  }

  /**
   * Обновляет текст множителя зп
   */
  updateScoreMultiplierLabel(): void {
    this.salaryMultiplierLabel.x = this.scoreLabel.width + 60;
    this.salaryMultiplierLabel.text = `Х${this.salaryMultiplier}`;
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
    const numDebuffs = Phaser.Math.Between(2, 8);
    // DEMO:
    // const numDebuffs = 1000;

    const debuffsAssets = [
      {
        key: "debuffBugDancing",
        scale: 0.3,
        bodyScale: 0.6,
        animation: "animationDebuffBugIdle",
      },
      {
        key: "debuffDeadline",
        scale: 0.75,
        bodyScale: 0.75,
      },
      {
        key: "debuffDebt",
        scale: 1,
        bodyScale: 0.8,
      },
      {
        key: "debuffDeploy",
        scale: 1,
        bodyScale: 0.9,
      },
      {
        key: "debuffTestFailed",
        scale: 1,
        bodyScale: 0.7,
      },
    ];

    for (let i = 0; i < numDebuffs; i++) {
      const randomAssetIndex = Math.floor(Math.random() * debuffsAssets.length);
      const randomAsset = debuffsAssets[randomAssetIndex];

      const debuff = this.debuffs
        .get(
          x,
          this.scale.height - this.worldBoundBottom,
          // @ts-ignore
          ASSETS[randomAsset.key].key
        )
        .setScale(randomAsset.scale)
        .setOrigin(0.5, 1) as Phaser.Physics.Arcade.Sprite;

      if (randomAsset.animation) {
        // @ts-ignore
        debuff.play(ASSETS[randomAsset.key].animations.idle);
      }

      debuff.setY(this.scale.height - this.worldBoundBottom);

      // make sure coin is active and visible
      debuff.setVisible(true);
      debuff.setActive(true);

      // enable and adjust physics body to be a circle
      const body = debuff.body as Phaser.Physics.Arcade.Body;
      body.setSize(
        body.width * randomAsset.bodyScale,
        body.height * randomAsset.bodyScale
      );
      body.allowGravity = false;
      body.enable = true;

      // body.updateFromGameObject();
      body.reset(x, this.scale.height - this.worldBoundBottom);
      body.updateBounds();

      // move x a random amount
      x += debuff.width * Phaser.Math.Between(6, 7);
      // DEMO:
      // x += debuff.width + 10;
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

    // Игрок выше баффов
    this.player.setDepth(1000);
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

  initBuff2(buff: string) {
    // @ts-ignore
    this[buff] = this.physics.add
      .sprite(0, 100, buff)
      .setOrigin(0.5, 0.5)
      //@ts-ignore
      .play(ASSETS[buff].animations.idle)
      .setScale(0.5)
      .setDepth(0);
    //@ts-ignore
    const body = this[buff].body as Phaser.Physics.Arcade.Body;
    body
      .setCircle(body.width * 0.5)
      .setOffset(0, 0)
      .setAllowGravity(false);

    this.spawnBuff2(buff);
  }

  spawnBuff2(buff: string, specificCoords?: { x: number; y: number }) {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    // @ts-ignore
    const { xFrom, xTo } = overlapEntities.find((e) => e.name === buff);

    // @ts-ignore
    const buffBody = this[buff].body as Phaser.Physics.Arcade.Body;

    let x;
    let y;

    if (!specificCoords) {
      x = Phaser.Math.Between(
        rightEdge + this.scale.width * xFrom,
        rightEdge + this.scale.width * xTo
      );
      y = Phaser.Math.Between(
        buffBody.height / 2 + this.worldBoundTop,
        this.scale.height - buffBody.height / 2 - this.worldBoundBottom
      );
    } else {
      x = specificCoords.x;
      y = specificCoords.y;
    }

    //@ts-ignore
    this[buff].x = x;
    //@ts-ignore
    this[buff].y = y;

    buffBody.reset(x, y);

    this.preventBuffOverlap(buff);
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

    this.preventBuffOverlap(buff);
  }

  /**
   * Если заспавненный бафф пересекает другой бафф, переспавнивает его
   *
   * @param buff
   */
  preventBuffOverlap(buff: string) {
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
        // @ts-ignore
        this.spawnBuff2(buff, { x: this[buff].x + 50, y: this[buff].y });
        // this.spawnBuff2(buff, { x: this[entityName].x + 10, y: this[buff].y });
      }
    });
  }

  respawnBuff2(buff: string) {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    // @ts-ignore
    if (this[buff].x + this[buff].width < leftEdge) {
      this.spawnBuff2(buff);
    }
  }

  /**
   * Создает все баффы
   */
  initBuffs() {
    this.initBuff2(ASSETS.coin.key);
    this.initBuff2(ASSETS.buffX2.key);
    this.initBuff2(ASSETS.buffBreak.key);
    this.initBuff2(ASSETS.buffPvs.key);
    this.initBuff2(ASSETS.buffMentor.key);
  }

  /**
   * Проверяет не скрылись ли баффы с экрана и если да то перемещает их вперед
   */
  respawnBuffs() {
    this.respawnBuff2(ASSETS.coin.key);
    this.respawnBuff2(ASSETS.buffX2.key);
    this.respawnBuff2(ASSETS.buffBreak.key);
    this.respawnBuff2(ASSETS.buffPvs.key);
    this.respawnBuff2(ASSETS.buffMentor.key);
  }

  /**
   * Хэндлер сбора x2
   */
  handleX2Collect(): void {
    this.salaryMultiplier *= 2;

    this.playBuffAnimationAndRespawn(ASSETS.buffX2.key);
    this.updateScoreLabel();
    this.buffX2PickupText.setAlpha(1);

    clearTimeout(this.buffX2PickupTextTimeout);
    this.buffX2PickupTextTimeout = setTimeout(() => {
      this.buffX2PickupText.setAlpha(0);
    }, 3000);
  }

  /**
   * Рисует текст при подборе X2
   */
  drawX2PickupText(): void {
    this.buffX2PickupText = this.add
      .text(
        this.scale.width / 2,
        this.salaryMultiplierLabel.y +
          this.salaryMultiplierLabel.height / 2 +
          2,
        "ТЫ ПОЛУЧИЛ ПОВЫШЕНИЕ!",
        {
          fontFamily: "lifeisstrangeru",
          fontSize: "28px",
        }
      )
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setScrollFactor(0);
  }
  /**
   * Хэндлер сбора пончика
   */
  async handleBreakCollect() {
    this.playBuffAnimationAndRespawn(ASSETS.buffBreak.key);

    const oldSalary = this.salary;

    this.player.isInvincible = true;
    this.salary *= 2;
    this.player.setDonutAnimation(true);
    this.player.isDonut = true;
    this.score += 50 * this.salaryMultiplier;

    this.player.stopPlayerByBreak().then(() => {
      this.player.isInvincible = false;
      this.salary = oldSalary;
      this.player.isDonut = false;
    });

    this.despawnDebuffs();
  }

  /**
   * Хэндлер сбора неуязвимости
   */
  handleInvincibilityCollect(): void {
    this.playBuffAnimationAndRespawn(ASSETS.buffPvs.key);
    this.player.isInvincible = true;

    // Ресетим состояние щита при подборе
    this.player.setPvsShieldBlinking(false);
    clearTimeout(this.buffPvsTimeout);
    clearTimeout(this.buffPvsBlinkingTimeout);
    this.player.toggleShield(true);

    this.buffPvsBlinkingTimeout = setTimeout(() => {
      this.player.setPvsShieldBlinking();
    }, 7000);
    this.buffPvsTimeout = setTimeout(() => {
      this.player.isInvincible = false;
      this.player.setPvsShieldBlinking(false);
      this.player.toggleShield(false);
    }, 10000);
  }

  /**
   * Пишет неуязвим ли ты
   */
  drawInvincibilityLabel(): void {
    this.invincibilityLabel = this.add.text(300, 10, "").setScrollFactor(0);
  }

  /**
   * Хэндлер сбора ментора
   */
  handleMentorCollect(): void {
    this.isMentor = true;
    this.playBuffAnimationAndRespawn(ASSETS.buffMentor.key);

    this.updateMentorLabel();

    clearTimeout(this.buffMentorTimeout);

    this.buffMentorTimeout = setTimeout(() => {
      this.isMentor = false;

      this.updateMentorLabel();
      this.spawnDebuffs();
    }, 10000);
  }

  /**
   * Пишет под ментором ли ты
   */
  drawMentorIndicator(): void {
    this.mentorIndicator = this.add
      .sprite(this.scale.width - 20, 0, ASSETS.mentorIndicator.key)
      .setOrigin(1, 0)
      .setScale(0.6)
      .setAlpha(0)
      .setScrollFactor(0);
  }

  /**
   * Обновляет сообщения о менторе
   */
  updateMentorLabel(): void {
    this.mentorIndicator.alpha = this.isMentor ? 1 : 0;
    this.mentorIndicator.play(ASSETS.mentorIndicator.animations.idle);
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
