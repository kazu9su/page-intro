'use strict';

var avatars = {
  glottis: 'http://homepage.ntlworld.com/stureek/images/glottis03.jpg',
  manny: 'http://kprojekt.net/wp-content/uploads/manny.jpg',
  sal: 'http://homepage.ntlworld.com/stureek/images/sal01.jpg'
};

page.base('/profile');
page('/', index);

page('/user/*', displayIndexAfter(5000));
page('/user/:name', load);
page('/user/:name', show);
page('*', notfound);
page();

document.querySelector('#cycle').onclick = function(e) {
  var i = 0;
  var names = Object.keys(avatars);
  setInterval(function() {
    var name = names[i++ % names.length];
    page('/users/' + name);
  }, 1500);
};

function text(str) {
  document.querySelector('p').textContent = str;
}

function displayIndexAfter(ms) {
  var id;
  return function(ctx, next) {
    id && clearTimeout(id);

    if ('/' != ctx.path) {
      id = setTimeout(function() {
        page('/');
      }, ms);
    }
    next();
  }
}

function index() {
  text('Click a user below to load their avatar');
  document.querySelector('img')
    .style.display = 'none';
}

function load(ctx, next) {
  ctx.avatar = avatars[ctx.params.name];
  next();
}

function show(ctx) {
  var img = document.querySelector('img');
  img.src = ctx.avatar;
  img.style.display = 'block';
  text('Showing ' + ctx.params.name);
}

function notfound() {
  document.querySelector('p')
    .textContent = 'not found';
}
