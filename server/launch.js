const express = require('express');
const cookieParser = require('cookie-parser');
const QRCode = require('qrcode');
const seeder = require('./scripts/seeder.mjs');
const { printTicket } = require('./print');

const app = express();

function getSessionId(req) {
  console.log(req.cookies?.PROJECT_BASICS__SESSION_ID ?? "none cookie");
  
  return req.cookies?.PROJECT_BASICS__SESSION_ID ?? null;
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

async function requireAdmin(req, res, next) {
  const checkRes = await fetch('http://backend:9000/meal-tickets/497f6eca-6276-4993-bfeb-53cbbbba6f08', {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${getSessionId(req)}`
    },
  });

  if (checkRes.status !== 404) {
    res.redirect('/home');
    return;
  }

  next();
}

app.post('/sessioncheck', async (req, res) => {
  res.json({
    "isLoggedIn": Boolean(req.headers.cookie)
  })
});

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(async (err, req, res, next) => {
  console.error(err.stack);

  await fetch("/logout",{
    method: "POST",
    credentials: "include"
  });

  res.redirect('/home');
});

// require login
app.use('/home', requireLogin, express.static('views/home'));

// // require logout
app.use('/login', requireLogout, express.static('views/login'));
app.use('/signup', requireLogout, express.static('views/signup'));

app.use('/admin/tickets', requireAdmin, express.static('views/admin/tickets'));
app.use('/admin/meals', requireAdmin, express.static('views/admin/meals'));

// serve static files
app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));
app.use('/', express.static('views'));

app.get('/', async (req, res) => {
  res.redirect("/home");
});

app.get('/test', async (req, res) => {
  res.json({a: getSessionId(req)});
});

app.get('/seed', async (req, res) => {
  await seeder.seedMealsMaster(getSessionId(req));
  res.sendStatus(200);
})

app.get('/meals', async (req, res) => {
  const mealsRes = await fetch("http://backend:9000/meals", {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${getSessionId(req)}`
    }
  });

  res.json(await mealsRes.json());
});

app.delete('/meals/:mealId', async (req, res) => {
  const mealsRes = await fetch(`http://backend:9000/meals/${req.params.mealId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${getSessionId(req)}`
    }
  });  

  res.sendStatus(mealsRes.status);
});

app.post('/meals', async (req, res) => {
  const mealsRes = await fetch('http://backend:9000/meals', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body),
  });  

  res.sendStatus(mealsRes.status);
});

app.patch('/meals/:mealId', async (req, res) => {
  const mealsRes = await fetch(`http://backend:9000/meals/${req.params.mealId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body),
  });

  mealsRes.text().then(e => console.log(e));

  res.sendStatus(mealsRes.status);
});

app.get('/meal-tickets', async (req, res) => {
  const ticketsRes = await fetch('http://backend:9000/meal-tickets', {
    method: "GET",
    headers: {
    'Authorization': `Bearer ${getSessionId(req)}`
    }
  });

  console.log(ticketsRes);


  res.json(await ticketsRes.json());
});

app.post('/meal-tickets', async (req, res) => {
  const ticketsRes = await fetch('http://backend:9000/meal-tickets', {
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


app.patch('/meal-tickets/:ticketId', async (req, res) => {  
  const ticketsRes = await fetch(`http://backend:9000/meal-tickets/${req.params.ticketId}`, {
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
  const ticketsRes = await fetch(`http://backend:9000/meal-tickets/${req.params.ticketId}`, {
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
  const buyRes = await fetch('http://backend:9000/meal-tickets/buy', {
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

app.delete('/meal-tickets/buy', async (req, res) => {  
  const buyRes = await fetch('http://backend:9000/meal-tickets/buy', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body),
  });

  res.sendStatus(buyRes.status);
});

app.get('/meal-tickets/me', async (req, res) => {  
  const meRes = await fetch('http://backend:9000/meal-tickets/me', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${getSessionId(req)}`
    },
  });
  const ticketsJson = await meRes.json();


  const tickets = await Promise.all(ticketsJson.map(async ticket => {
    console.log(ticket.meal_ticket.meal_id);
    
    const mealRes = await fetch(`http://backend:9000/meals/${ticket.meal_ticket.meal_id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${getSessionId(req)}`
      },
    });
    const mealJson = await mealRes.json();
    console.log(ticket);

    return {
      id: ticket.id,
      name: mealJson.name,
      price: ticket.meal_ticket.price
    };
  }));

  res.json(tickets);
});



// api
app.post('/logout', async (req, res) => {
  res.clearCookie('PROJECT_BASICS__SESSION_ID', {
    domain: '.a-shinagawa.com',
    path: '/',
    sameSite: 'None',   // ブラウザによっては 'None' と大文字にしないとダメな場合あり
    secure: true,       // https
    httpOnly: true
  });
  

  // const signoutRes = await fetch("http://backend:9000/signout",{
  //   method: "POST",
  //   mode: 'cors',
  //   credentials: 'include',
  //   headers: {
  //     'Authorization': `Bearer ${getSessionId(req)}`
  //   }
  // });

  // if (200 !== signoutRes.status) {
  //   res.sendStatus(signoutRes.status);
  //   return;
  // }

  res.sendStatus(200);
});

app.post('/use-ticket', async (req, res) => {
  const tokenRes = await fetch('http://backend:9000/meal-tickets/me', {
    method: "POST",
    mode: "cors",
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify(req.body)
  });  
  const t = await tokenRes.text();
  const token = JSON.parse(t).token;

  if (!token) {
    console.log(t);
    res.sendStatus(400);
    return;
  }
  console.log("使用トークン", token);
  
  const b64qr = await new Promise((resolve, reject) => {
    QRCode.toDataURL(`http://localhost/use-ticket/${token}`, function (err, code) {
      if (err) {
        reject(reject);
        return;
      }
      resolve(code);
    });
  });

  res.json({
    b64qr,
    token,
  });
});

app.get('/use-ticket/:token', async (req, res) => {
  const token = req.params.token;

  const useRes = await fetch('http://backend:9000/meal-tickets/me/use', {
    method: "POST",
    mode: "cors",
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify({
      token
    })
  });

  const useResJson = await useRes.json();
  console.log(useResJson);
  
  try {

    useResJson.forEach(ticket => {
      printTicket(new Date().toLocaleDateString('ja-JP'), ticket.meal.name ?? "ERR", ticket.price ?? "470");
    });

  } catch (e) {
    console.log("印刷に失敗しました");
    console.log(e);
    res.sendStatus(400);
    return;
  }

  res.json(useResJson);
});

app.delete('/use-ticket/:token', async (req, res) => {
  const token = req.params.token;

  const response = await fetch('http://backend:9000/meal-tickets/me', {
    method: "DELETE",
    mode: "cors",
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSessionId(req)}`
    },
    body: JSON.stringify({
      token
    })
  });

  console.log("delete token", response);
  
  res.sendStatus(response.status);
});

app.post('/users', async (req, res) => {
  const usersRes = await fetch('http://backend:9000/users', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });  

  res.sendStatus(usersRes.status);
});

app.post('/signin', async (req, res) => {
  const signinRes = await fetch('http://backend:9000/signin', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const setCookies = [];
  for (const [key, value] of signinRes.headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') {
      setCookies.push(value);
    }
  }

  if (setCookies.length > 0) {
    res.setHeader('Set-Cookie', setCookies);
  }

  res.sendStatus(signinRes.status);
});


app.listen(80, () => {
  console.log('Server is running on port 80');
});
