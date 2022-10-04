import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';

//Подключение к базе данных MongoDB
mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.juzvmnt.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB ok!'))
  .catch((error) => console.log('DB error', error));
//------------------------------------------------------------------
//создаем приложение app.(web-server)
const app = express();
//------------------------------------------------------------------
//use() - настроить промежуточное программное обеспечение
//научить приложение понимать JSON
app.use(express.json());
//------------------------------------------------------------------
//Функция listen используется сервером, чтобы информировать ОС,
//что он ожидает ("слушает") запросы связи на данном сокете(4444) + Колбэк-функция на ошибку.
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server ok! : port 4444');
});
//------------------------------------------------------------------
/*
С помощью маршрутизации(Routing) описываются ответы Node.js приложения на запросы, поступающие с 
клиентской стороны или другого сервера (в случае, если реализуется API) на конкретный URL.
*/

//* РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ *
app.post('/auth/register', registerValidation, async (req, res) => {
  //Используем блок try-catch чтоб не сломать приложение
  try {
    //validationResult(req) - извлекает ошибки проверки из запроса и делает их
    //доступными в Result объекте.
    const errors = validationResult(req);
    //IsEmpty возвращает значение Истина, если переменная не инициализирована или явно
    //имеет значение пусто; в противном случае возвращается false.
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const password = req.body.password;
    //await допускаеться только в асинхронных функциях, поэтому колбек делаем async. (async (req, res) => {})
    const salt = await bcrypt.genSalt(10); //алгоритм шифрования
    const hash = await bcrypt.hash(password, salt); // шифруем

    // Подгатавливаем документ на создание пользователя(структуру)
    const doc = UserModel({
      fullName: req.body.fullName,
      passwordHash: hash,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    });

    //Создаем пользователя
    const user = await doc.save();

    //После создания пользователя создаем токен с помощью метода sign(), и говорим что будем шифровать
    //_id user с помощью спец. ключа (secret123) и сроком дейстия 30 дней(expiresIn: '30d')
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    // Реструктуризация на основе не всех данных user, а толко его объекта _doc
    const { passwordHash, ...userDate } = user._doc;
    // Возвращает данные о пользователе(без passwordHash) + токен
    res.json({
      ...userDate,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
});

//* АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ *
app.post('/auth/login', (req, res) => {
  try {
  } catch (err) {}
});
