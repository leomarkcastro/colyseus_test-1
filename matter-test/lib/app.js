import Matter from "matter-js";

export function app() {
  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  // create an engine
  let engine = Engine.create();

  // create two boxes and a ground
  let boxA = Bodies.rectangle(400, 200, 80, 80);
  let boxB = Bodies.rectangle(450, 50, 80, 80);
  let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  // add all of the bodies to the world
  Composite.add(engine.world, [boxA, boxB, ground]);

  // create a renderer
  // let render = Render.create({
  //   element: document.body,
  //   engine: engine,
  // });
  // run the renderer
  // Render.run(render);

  let canvas = document.createElement("canvas"),
    context = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  document.body.appendChild(canvas);

  (function render() {
    let bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render);

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    for (let i = 0; i < bodies.length; i += 1) {
      let vertices = bodies[i].vertices;

      context.moveTo(vertices[0].x, vertices[0].y);

      for (let j = 1; j < vertices.length; j += 1) {
        context.lineTo(vertices[j].x, vertices[j].y);
      }

      context.lineTo(vertices[0].x, vertices[0].y);
    }

    context.lineWidth = 1;
    context.strokeStyle = "#999";
    context.stroke();
    console.log(bodies);
  })();

  // create runner
  let runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);
}
