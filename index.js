
    const game = document.getElementById("game");
    const over = document.getElementById("over");
    const final = document.getElementById("final");
    const scoreEl = document.getElementById("score");
    const SIZE = 20;

    let snake, food, dir, nextDir, score, speed, loop;

    function rand() {
      return Math.floor(Math.random() * SIZE);
    }

    function genFood() {
      let f;
      do {
        f = { x: rand(), y: rand() };
      } while (snake.some(s => s.x === f.x && s.y === f.y));
      return f;
    }

    function draw() {
      game.querySelectorAll(".snake, .food").forEach(e => e.remove());
      snake.forEach((s, i) => {
        const el = document.createElement("div");
        el.style.gridColumnStart = s.x + 1;
        el.style.gridRowStart = s.y + 1;
        el.className = "snake" + (i === 0 ? " head" : "");
        game.appendChild(el);
      });
      const f = document.createElement("div");
      f.style.gridColumnStart = food.x + 1;
      f.style.gridRowStart = food.y + 1;
      f.className = "food";
      game.appendChild(f);
    }

    function move() {
      const head = { ...snake[0] };
      dir = nextDir;
      if (dir === "up") head.y--;
      if (dir === "down") head.y++;
      if (dir === "left") head.x--;
      if (dir === "right") head.x++;
      if (
        head.x < 0 || head.y < 0 ||
        head.x >= SIZE || head.y >= SIZE ||
        snake.some(s => s.x === head.x && s.y === head.y)
      ) return gameOver();
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = genFood();
        if (score % 50 === 0 && speed > 50) {
          speed -= 10;
          clearInterval(loop);
          loop = setInterval(tick, speed);
        }
      } else snake.pop();
      scoreEl.textContent = "Score: " + score;
      draw();
    }

    function tick() { move(); }

    function gameOver() {
      clearInterval(loop);
      over.classList.add("show");
      final.textContent = "Score: " + score;
    }

    function start() {
      snake = [{ x: 10, y: 10 }];
      food = genFood();
      dir = nextDir = "right";
      score = 0;
      speed = 150;
      over.classList.remove("show");
      scoreEl.textContent = "Score: 0";
      draw();
      clearInterval(loop);
      loop = setInterval(tick, speed);
    }

    document.addEventListener("keydown", e => {
      const d = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[e.key];
      if (d) {
        if (
          (d === "up" && dir !== "down") ||
          (d === "down" && dir !== "up") ||
          (d === "left" && dir !== "right") ||
          (d === "right" && dir !== "left")
        ) nextDir = d;
      }
    });

    start();
  
