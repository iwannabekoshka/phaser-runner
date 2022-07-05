import * as Phaser from "phaser";
import { SCENES } from "../SCENES";
import ASSETS from "../../ASSETS";
import { IGameEdgesCoordinates } from "../../interfaces/IGameEdgesCoordinates";
import Player, { PlayerState } from "./Player";
import BitmapText = Phaser.GameObjects.BitmapText;

const overlapEntities = [
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
  {
    name: ASSETS.coin.key,
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
   * Бафф перерыв
   */
  buffBreak!: Phaser.Physics.Arcade.Sprite;
  /**
   * Бафф неуязвимость
   */
  buffPvs!: Phaser.Physics.Arcade.Sprite;
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
  scoreLabel!: BitmapText;
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

  // TODO тестовый спрайтовый бафф
  buffDonutTest!: Phaser.Physics.Arcade.Sprite;
  // TODO тестовый битмап текст
  testLabel!: BitmapText;

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
    this.drawInvincibilityLabel();
    this.drawMentorLabel();

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
    this.score += 50;

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
      .bitmapText(
        10,
        10,
        ASSETS.fontPribambasBlack.key,
        `СЧЕТ: ${this.score}. МУЛЬТИ: Х${this.salaryMultiplier}`,
        36
      )
      .setScrollFactor(0);

    this.testLabel = this.add.bitmapText(
      300,
      0,
      ASSETS.fontPribambasBlack.key,
      "МАМА Я ПРИБАМБАС",
      36
    );
    this.add.bitmapText(
      300,
      40,
      ASSETS.fontDoubleShadowed.key,
      "1234567890",
      48
    );
  }

  /**
   * Обновляет счет
   */
  updateScoreLabel(): void {
    this.scoreLabel.text = `СЧЕТ: ${this.score}. МУЛЬТИ: x${this.salaryMultiplier}`;
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
      const body = debuff.body as Phaser.Physics.Arcade.Body;
      body.setCircle(body.width * 0.5);
      body.enable = true;
      // Не нашел, как задизейблить гравитацию, так что просто
      // даем ускорение в обратную сторону
      body.setAccelerationY(-1800);

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

  spawnBuff2(buff: string) {
    const { leftEdge, rightEdge } = this.getGameEdgesCoordinates();
    // @ts-ignore
    const { xFrom, xTo } = overlapEntities.find((e) => e.name === buff);

    // @ts-ignore
    const buffBody = this[buff].body as Phaser.Physics.Arcade.Body;

    const x = Phaser.Math.Between(
      rightEdge + this.scale.width * xFrom,
      rightEdge + this.scale.width * xTo
    );
    const y = Phaser.Math.Between(
      buffBody.height,
      this.scale.height - this.worldBoundBottom - buffBody.height * 3
    );

    //@ts-ignore
    this[buff].x = x;
    //@ts-ignore
    this[buff].y = y;

    buffBody.updateFromGameObject();

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
        this.spawnBuff(buff);
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
  }

  /**
   * Хэндлер сбора пончика
   */
  async handleBreakCollect() {
    this.playBuffAnimationAndRespawn(ASSETS.buffBreak.key);

    this.player.isInvincible = true;
    this.updateInvincibilityLabel();
    this.salary = 2;
    this.player.setDonutAnimation(true);
    this.player.isDonut = true;

    this.player.stopPlayerByBreak().then(() => {
      this.player.isInvincible = false;
      this.updateInvincibilityLabel();
      this.salary = 1;
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
    this.player.toggleShield(true);

    this.updateInvincibilityLabel();

    setTimeout(() => {
      this.player.setPvsShieldBlinking();
    }, 7000);
    setTimeout(() => {
      this.player.isInvincible = false;
      this.player.toggleShield(false);

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
   * Хэндлер сбора ментора
   */
  handleMentorCollect(): void {
    this.isMentor = true;
    this.playBuffAnimationAndRespawn(ASSETS.buffMentor.key);

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
