import express from 'express';
import jwt from 'jsonwebtoken';

//создаем приложение app.
const app = express();

//use() - настроить промежуточное программное обеспечение
//научить приложение понимать JSON
app.use(express.json());

//Функция listen используется сервером, чтобы информировать ОС,
//что он ожидает ("слушает") запросы связи на данном сокете(4444) + Колбэк-функция на ошибку.
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK. Listening on port 4444');
});

//Обрабатываем get-запрос на главную страницу, где
//req(request - запрос от клиента), res(response - ответ клиенту)
app.get('/', function (req, res) {
  res.send('Hello World');
});

// --------- Начало ---------

app.post('/auth/login', (req, res) => {
  console.log(req.body);

  //Создаем токен с помощью метода sign(), и говорим что будем шифровать
  //email, password, fullName с помощью спец. ключа (secret123)
  const token = jwt.sign(
    {
      email: req.body.email,
      password: req.body.password,
      fullName: 'Вася Пупкин',
    },
    'secret123'
  );
  //этот ответ вернеться пользователю
  res.json({
    success: true,
    token: token,
  });
});
