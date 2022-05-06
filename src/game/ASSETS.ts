/**
 * key - идентификатор;
 * imageUrl - путь до картинки из папки public;
 * dataFileUrl - путь до json-a со спрайтами;
 * animations - объект с ключами анимаций;
 */
const ASSETS = {
  bg: {
    key: "bg",
    // imageUrl: "/game/house/bg/bg_repeat_340x640.png",
    imageUrl: "/game/office/bg.png",
  },
  mouse: {
    key: "mouse",
    imageUrl: "/game/mouse/mouse.png",
    dataFileUrl: "/game/mouse/mouse.json",
    animations: {
      run: "animationMouseRun",
      flamesOn: "animationMouseFlamesOn",
      fly: "animationMouseFly",
      fall: "animationMouseFall",
      death: "death",
    },
  },
  mousehole: {
    key: "mousehole",
    imageUrl: "/game/house/objects/object_mousehole.png",
  },
  bookcase_1: {
    key: "bookcase_1",
    imageUrl: "/game/house/objects/object_bookcase1.png",
  },
  bookcase_2: {
    key: "bookcase_2",
    imageUrl: "/game/house/objects/object_bookcase2.png",
  },
  window_1: {
    key: "window_1",
    imageUrl: "/game/house/objects/object_window1.png",
  },
  window_2: {
    key: "window_2",
    imageUrl: "/game/house/objects/object_window2.png",
  },
  laserEnd: {
    key: "laserEnd",
    imageUrl: "/game/house/objects/object_laser_end.png",
  },
  laserMiddle: {
    key: "laserMiddle",
    imageUrl: "/game/house/objects/object_laser.png",
  },
  coin: {
    key: "coin",
    imageUrl: "/game/house/items/object_coin.png",
  },
};

export default ASSETS;
