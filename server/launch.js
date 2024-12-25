const express = require('express');
const cookieParser = require('cookie-parser');
const QRCode = require('qrcode');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const webpackCompiler = webpack(webpackConfig);
const seeder = require('./scripts/seeder.mjs');

const app = express();

function getSessionId(req) {
  return req.cookies.PROJECT_BASICS__SESSION_ID ?? null;
}

function requireLogin(req, res, next) {
  if (null === getSessionId(req)) {
    res.redirect('/login');
    return;
  }

  next();
}

function requireLogout(req, res, next) {
  if (null !== getSessionId(req)) {
    res.redirect('/home');
    return;
  }

  next();
}

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// middleware

app.use(require('webpack-dev-middleware')(webpackCompiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true }
}));

// Webpack Hot Middleware
app.use(require('webpack-hot-middleware')(webpackCompiler));

// require login
app.use('/home', requireLogin, express.static('views/home'));

// // require logout
app.use('/login', requireLogout, express.static('views/login'));
app.use('/signup', requireLogout, express.static('views/signup'));

// serve static files
app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));
app.use('/', express.static('views'));


app.get('/seed', async (req, res) => {
  await seeder.postMealMasterData(getSessionId(req));
  res.sendStatus(200);
})

app.get('/meals', async (req, res) => {
  const mealsRes = await fetch("http://localhost:9000/meals", {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${getSessionId(req)}`
    }
  });

  res.send(await mealsRes.json());
});

app.post('/meals', async (req, res) => {
  const mealsRes = await fetch('http://localhost:9000/meals', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body),
  });

  console.log(mealsRes.status);
  

  res.sendStatus(mealsRes.status);
});

app.get('/meal-tickets', async (req, res) => {
  const ticketsRes = await fetch('http://localhost:9000/meal-tickets', {
    method: "GET",
    headers: {
    'Authorization': `Bearer ${getSessionId(req)}`
    }
  });
  res.json(await ticketsRes.json());
});

app.post('/meal-tickets', async (req, res) => {
  const ticketsRes = await fetch('http://localhost:9000/meal-tickets', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body),
  });

  res.sendStatus(ticketsRes.status);
});


app.patch('/meal-tickets', async (req, res) => {  
  const ticketsRes = await fetch('http://localhost:9000/meal-tickets', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body),
  });

  res.sendStatus(ticketsRes.status);
});


app.delete('/meal-tickets/:ticketId', async (req, res) => {
  const ticketsRes = await fetch(`http://localhost:9000/meal-tickets/${req.params.ticketId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
  });

  res.sendStatus(ticketsRes.status);
});

app.post('/meal-tickets/buy', async (req, res) => {
  const buyRes = await fetch('http://localhost:9000/meal-tickets/buy', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body),
  });

  res.sendStatus(buyRes.status);
});




// api
app.post('/logout', async (req, res) => {
  res.clearCookie('PROJECT_BASICS__SESSION_ID');  // HACK: サーバー側でcookie削除できていない

  const signoutRes = await fetch("http://localhost:9000/signout",{
    method: "POST",
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${getSessionId(req)}`
    }
  });

  if (200 !== signoutRes.status) {
    res.sendStatus(signoutRes.status);
    return;
  }

  res.sendStatus(200);
});

app.post('/sessioncheck', async (req, res) => {
  res.json({
    "isLoggedIn": null !== getSessionId(req)
  })
});

app.post('/use-ticket/:token', async (req, res) => {
  const token = req.params.token;

  const response = await fetch('http://localhost:9000/meal-tickets/me/use', {
    method: "POST",
    mode: "cors",
    headers:{
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify({
      token
    })
  });

  res.json(await response.json());
});

app.get('/qrcode-gen/:token', async (req, res) => {
  const token = req.params.token;

  const QRbase64 = await new Promise((resolve, reject) => {
    QRCode.toDataURL(`http://localhost:3000/use-ticket/${token}`, function (err, code) {
      if (err) {
        reject(reject);
        return;
      }
      resolve(code);
    });
  });

  res.json({
    "base64-qr-code": QRbase64
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
