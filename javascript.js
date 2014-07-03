
var app = new Firebase('https://blinding-fire-2928.firebaseio.com');

scoreboard = [];
app.child('scores').on('value', function(snapshot) {
  scoreboard = JSON.parse( snapshot.val() );
  var array = JSON.parse(snapshot.val());
  array = _(array).sortBy(function(a) {
    return -a.score;
  });
  array = _(array).filter(function(score) {
    return score.score < 100;
  });
  array = _(array).filter(function(score) {
    return !(/cheat/i.test(score.name));
  });
  var str = '<ul>';
  array.forEach(function(score) {
    str += '<li>' + score.score + ': ' + score.name + '</li>';
  })
  str += '</ul>';
  document.getElementById('scoreboard').innerHTML = str
});



el = document.getElementById('content');
var run = function() {
  var started = false;
  var done = false;
  var ct = 0;
  var timeout = false;
  $(document).keydown(function(e) {
    if( e.which === 220 && $(e.target).is('input') ) {
      $(e.target).blur();
    }
  });
  $(document).keyup(function(e) { 
    if (done) {
      el.innerHTML = 'You played, typing "\\" ' + ct + ' times in 5 seconds. That\'s like ' + (ct*12) + ' times per minute. Tell people about this. <button type="button" id="restart">Restart</button>';
      $("#restart").click(function() {
        document.location.href = '/';
      });
      return;
    }
    if (!started) {
      if(e.which === 220) {
         el.innerHTML = 'You are now playing. Type "\\" often.';
        started = true
        timeout = setTimeout(function(e) {
          started = false;
          done = true;
          scoreboard.push({
            name: document.getElementById('name').value,
            score: ct
          })
          app.set({ scores: JSON.stringify( scoreboard) });
        }, 5000);
      } 
    } else {
      if(e.which === 220) {
        if( ct > 100) {
          clearTimeout( timeout );
          el.innerHTML = "DON'T CHEAT";
        }
        ct++;
      } 
    }
  });
}
run()

el.innerHTML = 'Press "\\" to begin.';