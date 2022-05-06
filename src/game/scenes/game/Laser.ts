import * as Phaser from "phaser";
import ASSETS from "../../ASSETS";

export default class Laser extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.initLaser(scene);
  }

  /**
   * Верхняя часть лазера
   */
  laserTop!: Phaser.GameObjects.Image;
  /**
   * Средняя часть лазера
   */
  laserBottom!: Phaser.GameObjects.Image;
  /**
   * Нижняя часть лазера
   */
  laserMiddle!: Phaser.GameObjects.Image;

  initLaser(scene: Phaser.Scene) {
    this.laserTop = scene.add
      .image(0, 0, ASSETS.laserEnd.key)
      .setOrigin(0.5, 0);

    this.laserMiddle = scene.add
      .image(
        0,
        this.laserTop.y + this.laserTop.displayHeight,
        ASSETS.laserMiddle.key
      )
      .setOrigin(0.5, 0);

    this.laserMiddle.setDisplaySize(this.laserMiddle.width, 200);

    this.laserBottom = scene.add
      .image(
        0,
        this.laserMiddle.y + this.laserMiddle.displayHeight,
        ASSETS.laserEnd.key
      )
      .setOrigin(0.5, 0)
      .setFlipY(true);

    this.add(this.laserTop);
    this.add(this.laserMiddle);
    this.add(this.laserBottom);

    // Лазер статичен - то есть не двигается
    scene.physics.add.existing(this, true);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    const width = this.laserTop.displayWidth * 0.8;
    const height =
      this.laserTop.displayHeight +
      this.laserMiddle.displayHeight +
      this.laserBottom.displayHeight * 0.8;

    // Делаем границы тела лазера
    body.setSize(width * 0.9, height * 0.96);
    body.setOffset(-width * 0.45, 0);

    body.position.x = this.x + body.offset.x;
    body.position.y = this.y + 15;
  }
}
