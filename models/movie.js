const mongoose = require('mongoose');

// const { ObjectId } = mongoose.Schema.Types;
// напишите код здесь
const movieSchema = new mongoose.Schema({
  country: { //  страна создания фильма. Обязательное поле-строка.
    type: String,
    required: true,
    unique: true,
  },
  director: { // режиссёр фильма. Обязательное поле-строка.
    type: String,
    required: true,
    unique: true,
  },
  duration: { // длительность фильма. Обязательное поле-число.
    type: Number,
    required: true,
    unique: true,
  },
  year: { // год выпуска фильма. Обязательное поле-строка.
    type: String,
    required: true,
    unique: true,
  },
  description: { // описание фильма. Обязательное поле-строка.
    type: String,
    required: true,
    unique: true,
  },
  image: { // ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
    type: String,
    required: true,
    validate: {
      validator: (avatar) => /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(avatar),
    },
  },
  trailer: { // ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
    type: String,
    required: true,
    validate: {
      validator: (avatar) => /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(avatar),
    },
  },
  thumbnail: { // миниатюрное изображение постера к фильму. Обязательное поле-строка.
    // Запишите её URL-адресом.
    type: String,
    required: true,
    validate: {
      validator: (avatar) => /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(avatar),
    },
  },
  owner: { //  _id пользователя, который сохранил фильм. Обязательное поле.
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: { // TODO надо, возможно учитывать в создании, что он бертся из MoviesExplorer
  // id фильма, который содержится в ответе сервиса MoviesExplorer.
  // Обязательное поле в формате number.
    type: Number,
    required: true,
    unique: true,
  },
  nameRU: { // название фильма на русском языке. Обязательное поле-строка.
    type: String,
    required: true,
    unique: true,
  },
  nameEN: { // название фильма на английском языке. Обязательное поле-строка.
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
