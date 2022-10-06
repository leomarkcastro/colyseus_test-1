import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("string")
  name: string = "Player";

  @type("boolean")
  isDead: boolean = false;

  @type("string")
  color: string = "#000000";

  @type({ map: "boolean" })
  keyPuts = new MapSchema<boolean>();

  @type("number")
  lastShot: number = 0;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

// An abstract bullet  object, demonstrating a potential 2D world position
export class Bullet extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("string")
  shooter: string = "Player";

  @type("string")
  name: string = "Player-bulletid";

  @type("string")
  color: string = "#000000";

  @type("number")
  direction: number = 0;

  constructor(
    x: number,
    y: number,
    shooter: string,
    id: string,
    direction: number
  ) {
    super();
    this.shooter = shooter;
    this.name = shooter + "-" + id;
    this.x = x;
    this.y = y;
    this.direction = direction;
  }
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type([Bullet])
  bullets = new ArraySchema<Bullet>();

  @type("number")
  width: number = 50;

  @type("number")
  height: number = 50;

  @type("number")
  shotDelay: number = 250;
}
