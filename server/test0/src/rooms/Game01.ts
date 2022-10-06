import { Room, Client, Delayed } from "colyseus";
import { IncomingMessage } from "http";
import { Player, State } from "./schema/Game01State";

export class Game01 extends Room<State> {
  // For this example
  public gameLoop!: Delayed;

  onCreate(options: any) {
    this.setState(new State());

    console.log("room", this.roomId, "created!", options);

    // Called every time this room receives a "move" message
    this.onMessage("changeDirection", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.direction = data.direction;
    });

    // start the clock ticking
    this.clock.start();

    // Set an interval and store a reference to it
    // so that we may clear it later
    this.gameLoop = this.clock.setInterval(() => {
      this.state.players.forEach((player) => {
        if (player.isDead) return;

        switch (player.direction) {
          case "up":
            player.y--;
            if (player.y < 0) player.y = 10;
            break;
          case "down":
            player.y++;
            if (player.y > 10) player.y = 0;
            break;
          case "left":
            player.x--;
            if (player.x < 0) player.x = 10;
            break;
          case "right":
            player.x++;
            if (player.x > 10) player.x = 0;
            break;
        }
      });
    }, 1000 / 30);

    // After 10 seconds clear the timeout;
    // this will *stop and destroy* the timeout completely
    this.clock.setTimeout(() => {
      // this.gameLoop.clear();
    }, 10000);
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
