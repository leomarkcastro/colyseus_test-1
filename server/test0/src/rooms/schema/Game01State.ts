import { Schema, MapSchema, type } from "@colyseus/schema";

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
  direction: string = "down";

  @type("string")
  color: string = "#000000";
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}
