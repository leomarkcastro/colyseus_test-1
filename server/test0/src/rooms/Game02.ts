import { Room, Client, Delayed } from "colyseus";
import { Bullet, Player, State } from "./schema/Game02State";

function uuidv4() {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const keyAngle = {
  i: Math.PI * 1.5,
  j: Math.PI,
  k: Math.PI * 0.5,
  l: 0,
};

type keyAngleEnum = "i" | "j" | "k" | "l";

export class Game02 extends Room<State> {
  // For this example
  public gameLoop!: Delayed;

  gameChecks = {
    checkShotDelay: (player: Player, button: keyAngleEnum) => {
      if (
        player.keyPuts.get(button) &&
        this.clock.currentTime - player.lastShot > this.state.shotDelay
      ) {
        player.lastShot = this.clock.currentTime;
        this.state.bullets.push(
          new Bullet(
            player.x,
            player.y,
            player.name,
            uuidv4(),
            keyAngle[button]
          )
        );
      }
    },
  };

  onCreate(options: any) {
    this.setState(new State());

    console.log("room", this.roomId, "created!", options);

    // Called every time this room receives a "move" message
    this.onMessage("keyPut", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.keyPuts.set(data.key, data.value);
    });

    this.maxClients = 2;

    // start game Loop
    this.setSimulationInterval(
      (deltaTime) => this.update(deltaTime),
      1000 / 30
    );
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player(client.sessionId));
  }

  update(deltaTime: number) {
    this.state.players.forEach((player) => {
      if (player.isDead) return;
      player.x += player.keyPuts.get("d") ? 1 : 0;
      player.x -= player.keyPuts.get("a") ? 1 : 0;
      player.y += player.keyPuts.get("s") ? 1 : 0;
      player.y -= player.keyPuts.get("w") ? 1 : 0;

      if (player.y < 0) player.y = this.state.width - 1;
      if (player.y >= this.state.width) player.y = 0;
      if (player.x < 0) player.x = this.state.height - 1;
      if (player.x >= this.state.height) player.x = 0;

      this.gameChecks.checkShotDelay(player, "i");
      this.gameChecks.checkShotDelay(player, "j");
      this.gameChecks.checkShotDelay(player, "k");
      this.gameChecks.checkShotDelay(player, "l");
    });

    this.state.bullets.forEach((bullet) => {
      bullet.x += Math.cos(bullet.direction);
      bullet.y += Math.sin(bullet.direction);

      if (
        bullet.x < 0 ||
        bullet.x >= this.state.width ||
        bullet.y < 0 ||
        bullet.y >= this.state.height
      ) {
        this.state.bullets.splice(this.state.bullets.indexOf(bullet), 1);
      }
    });
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
