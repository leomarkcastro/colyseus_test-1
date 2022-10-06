import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  angle: number = 0;

  @type("string")
  name: string = "Player";

  @type("number")
  id: number;

  @type("string")
  color: string = "#000000";

  @type({ map: "boolean" })
  keyPuts = new MapSchema<boolean>();

  @type("number")
  lastShot: number = 0;

  @type("boolean")
  canJump: boolean = false;

  @type("number")
  jumpHeight: number = 0.6;

  constructor(name: string, id: number) {
    super();
    this.name = name;
    this.id = id;
  }
}

export class Platform extends Schema {
  @type("string")
  label: string;

  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  width: number = 0;

  @type("number")
  height: number = 0;

  @type("string")
  color: string = "#000000";

  constructor(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super();
    this.label = label;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ map: Platform })
  platform = new MapSchema<Platform>();

  @type("number")
  width: number = 1000;

  @type("number")
  height: number = 1000;

  @type("number")
  shotDelay: number = 250;
}
