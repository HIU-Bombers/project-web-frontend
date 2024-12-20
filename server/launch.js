const express = require('express');
const cookieParser = require('cookie-parser');
const QRCode = require('qrcode');
const app = express();

function getSessionId(req) {
  return req.cookies.PROJECT_BASICS__SESSION_ID ?? null;
}

function getBearerHeader(req) {
  return {
    'Authorization': `Bearer ${getSessionId(req)}`
  };
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

function getBearerHeader(req) {
  return {
    'Authorization': `Bearer ${getSessionId(req)}`
  };
}

app.use(cookieParser());

// middleware
// require login
app.use('/home', requireLogin, express.static('views/home'));

// // require logout
app.use('/login', requireLogout, express.static('views/login'));
app.use('/signup', requireLogout, express.static('views/signup'));

// serve static files
app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));
app.use('/', express.static('views'));

// api
app.post('/logout', async (req, res) => {
  const signoutRes = await fetch("http://localhost:9000/signout",{
    method: "POST",
    mode: 'cors',
    credentials: 'include',
    headers: getBearerHeader(req)
  });

  if (200 !== signoutRes.status) {
    res.sendStatus(signoutRes.status);
    return;
  }

  res.clearCookie('PROJECT_BASICS__SESSION_ID');  // HACK: サーバー側でcookie削除できていない
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
    headers: getBearerHeader(req),
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
