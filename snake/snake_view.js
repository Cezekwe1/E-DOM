const Board = require('./board.js');
const $e = require('../lib/main.js');

class View {
  constructor($el){
    this.$el = $el;
    this.board = new Board(20);
    this.setupGrid();
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );

    $e(window).on("keydown", this.handleKeyEvent.bind(this));
  }

  render() {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
    $e('.score').html(this.board.snake.score);
  }



  updateClasses(coords, className) {
    $e(`.${className}`).removeClass(className);

    coords.forEach( coord => {
      const flatCoord = (coord.x * 20) + coord.y;
      if (this.$li) {
        this.$li.eq(flatCoord).addClass(className);
      }
    });
  }

  handleKeyEvent(event) {
    if (View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    }
  }

  setupGrid() {
    let html = "";

    for (let i = 0; i < this.board.dim; i++){
      html += "<ul>";
      for (let j = 0; j < this.board.dim; j++){
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = $e('li');
  }

  step() {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    }else {
      $e('.apple').removeClass("apple");
      $e('.score').append("<p>GAME OVER</p>");
      window.clearInterval(this.intervalId);
    }
  }
}

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W"
};

View.STEP_MILLIS = 100;

module.exports = View;
