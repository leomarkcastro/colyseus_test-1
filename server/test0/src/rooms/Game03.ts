import { Room, Client, Delayed } from "colyseus";
import { Platform, Player, State } from "./schema/Game03State";
import Matter from "matter-js";

let Engine = Matter.Engine,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

export class Game03 extends Room<State> {
  // For this example
  public gameLoop!: Delayed;
  public engine: Matter.Engine;
  public runner: Matter.Runner;
  public composite: Matter.Composite;

  ground: Matter.Body;

  onCreate(options: any) {
    this.setState(new State());

    console.log("room", this.roomId, "created!", options);

    // Called every time this room receives a "move" message
    this.onMessage("keyPut", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.keyPuts.set(data.key, data.value);
    });

    this.maxClients = 5;

    this.engine = Engine.create({
      gravity: { x: 0, y: 3 },
    });

    // run the engine
    this.runner = Runner.create({
      delta: 1000 / 60,
    });
    Runner.run(this.runner, this.engine);

    this.start();

    // start game Loop
    this.setSimulationInterval(
      (deltaTime) => this.update(deltaTime),
      1000 / 60
    );

    Matter.Events.on(this.engine, "collisionStart", (event) => {
      for (let i = 0; i < event.pairs.length; i++) {
        let pair = event.pairs[i];
        let playerA = this.state.players.get(pair.bodyA.label.split("_")[1]);
        if (playerA) {
          playerA.canJump = true;
        }
        let playerB = this.state.players.get(pair.bodyB.label.split("_")[1]);
        if (playerB) {
          playerB.canJump = true;
        }
      }
    });
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player(client.sessionId, 0));
    let boxA = Bodies.rectangle(400, 200, 80, 80, {
      label: `obj_${client.sessionId}`,
    });

    Composite.add(this.engine.world, [boxA]);
  }

  gameActions = {
    addWall: (
      name: string,
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const _rx = x + width / 2;
      const _ry = y + height / 2;
      let newObject = Bodies.rectangle(_rx, _ry, width, height, {
        isStatic: true,
        label: name,
      });

      const { min, max } = newObject.bounds;

      this.state.platform.set(
        newObject.label,
        new Platform(
          newObject.label,
          min.x,
          min.y,
          max.x - min.x,
          max.y - min.y
        )
      );
      Composite.add(this.engine.world, [newObject]);

      return newObject;
    },
  };

  start() {
    this.gameActions.addWall(
      "ground",
      0,
      this.state.height - 20,
      this.state.width,
      20
    );

    this.gameActions.addWall("wallLeft", 0, 0, 20, this.state.height);
    this.gameActions.addWall(
      "wallRight",
      this.state.width - 20,
      0,
      20,
      this.state.height
    );
  }

  update(deltaTime: number) {
    let bodies = Composite.allBodies(this.engine.world);
    for (let i = 0; i < bodies.length; i += 1) {
      let body = bodies[i];
      let player = this.state.players.get(body.label.split("_")[1]);
      if (player) {
        player.angle = body.angle;
        player.x = body.position.x;
        player.y = body.position.y;

        let jumpVel = 0;
        if (player.keyPuts.get(" ") && player.canJump) {
          jumpVel = -player.jumpHeight;
          player.canJump = false;
        }
        Matter.Body.applyForce(body, body.position, {
          x: player.keyPuts.get("d")
            ? 0.02
            : player.keyPuts.get("a")
            ? -0.02
            : 0,
          y: jumpVel,
        });
        // Matter.Body.setAngle(body, angle);
        // Matter.Body.setVelocity(body, {
        //   x: Math.cos(angle) * 5,
        //   y: Math.sin(angle) * 5,
        // });
      }
    }
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    Composite.remove(
      this.engine.world,
      Composite.allBodies(this.engine.world).find(
        (body) => body.label.split("_")[1] === client.sessionId
      )
    );
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
