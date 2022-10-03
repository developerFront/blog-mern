import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

//Подключение к базе данных MongoDB
mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.juzvmnt.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB ok!'))
  .catch((error) => console.log('DB error', error));

//создаем приложение app.(web-server)
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
  console.log('Server ok! : port 4444');
});

// --------- Начало ---------

app.post('/auth/register', (req, res) => {});
