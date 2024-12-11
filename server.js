const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
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
  res.clearCookie('PROJECT_BASICS__SESSION_ID');
  
  // const signoutRes = await fetch("http://localhost:9000/signout",{
  //   method: "POST",
  //   mode: 'cors',
  //   credentials: 'include',
  // });
  
  // console.log(signoutRes.status);
  // console.log(signoutRes.headers);
  // console.log(signoutRes.body);
  // console.log((await signoutRes.text()));

  // if (200 !== signoutRes.status) {
  //   res.sendStatus(signoutRes.status);
  //   return;
  // }
  res.sendStatus(200);
});

app.post('/sessioncheck', async (req, res) => {
  res.json({
    "isLoggedIn": null !== getSessionId(req)
  })
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
