const $e = require('../lib/main.js');
const View = require('./snake_view');

$e(()=>{
    const rootEl = $e('.grid');
      $e(".restart").on("click", () => {
       $e(".score").html(0);
       new View(rootEl);
    });
  new View(rootEl);
});
