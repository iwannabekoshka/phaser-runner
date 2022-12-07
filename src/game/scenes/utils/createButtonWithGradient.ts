/**
 *
 * @param context сцена
 * @param x - верхний левый угол X
 * @param y - верхний левый угол Y
 * @param height высота
 * @param width ширина
 * @param color1 цвет начала градиента
 * @param color2 цвет конца градиента
 * @param radius скругление кнопки
 * @returns
 */
export function createButtonWithGradient(
  context: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  color1: string,
  color2: string,
  radius = 0,
  text = "",
  strokeThickness = 3,
  strokeColor = 0x000000
) {
  const textureKey = `${x}-${y}-${width}-${height}-${color1}-${color2}-${radius}`;
  const texture = context.textures.createCanvas(textureKey, width, height);
  // Left to right gradient
  const gradient = texture.context.createLinearGradient(0, 0, width, 0);

  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  texture.context.fillStyle = gradient;
  texture.context.fillRect(0, 0, width, height);

  texture.refresh();

  const mask = context.make
    .graphics({})
    .fillRoundedRect(x, y, width, height, radius)
    .createGeometryMask();

  const roundedButton = context.add
    .image(x, y, textureKey)
    .setOrigin(0)
    .setMask(mask);

  // Добавляем обводку
  const strokeGraphics = context.add.graphics();
  strokeGraphics.lineStyle(strokeThickness, strokeColor, 0.5);
  strokeGraphics.strokeRoundedRect(
    x + strokeThickness / 2,
    y + strokeThickness / 2,
    width - strokeThickness,
    height - strokeThickness,
    radius
  );

  // Добавляем текст
  context.add
    .text(x + width / 2, y + height / 2, text, {
      fontFamily: "Pribambas",
      color: "white",
      // stroke: "white",
      // strokeThickness: 2,
      fontSize: "40px",
    })
    .setOrigin(0.5);

  return roundedButton;
}
