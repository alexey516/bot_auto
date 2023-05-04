

const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
// Введите здесь токен вашего бота, который вы получили от BotFather
const token = '5823237773:AAHmYML533N-ipLxDcvbsp63z-lKUYqkNio';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });
let chatId;
let testNumber;
let username;
//------------------------------------------------------------------
bot.on('message', (msg) => {
  // Проверяем, была ли уже отправлена команда "/start"
  if (msg.text !== '/start' && !msg.startCommandSent) {
    // Отправляем сообщение с предложением команды "старт"
    bot.sendMessage(msg.chat.id, 'Привет! Нажмите на /start, чтобы начать или /clear что бы отчистить чат.');
    // Устанавливаем флаг, что сообщение уже было отправлено
    msg.startCommandSent = true;
  }
});

//------------------------------------------------------------------
//Обработка моианды старт
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  username = msg.from.username;
  const keyboard = { inline_keyboard: [[{ text: 'Тестирование', callback_data: 'button1' }, { text: 'Результаты', callback_data: 'button2' }, { text: 'Контакты', callback_data: 'button3' }], [{ text: 'Запись к инструктору', callback_data: 'button4' }]] };
  bot.sendMessage(chatId, 'Выберите одну из кнопок:', {
    reply_markup: keyboard
  });


});

//------------------------------------------------------------------
//Обработка моианды удалить
bot.onText(/\/clear/, (msg) => {
  for (let i = 0; i < 101; i++) {
    bot.deleteMessage(msg.chat.id, msg.message_id - i).catch(er => { return })
    //if there isn't any messages to delete bot simply return
  }
})



//------------------------------------------------------------------

bot.on('callback_query', (query,) => {
  chatId = query.message.chat.id;
  let data = query.data;

  if (data === 'button1') {
    //Вывод вариантов билетов
    const keyboardd = {
      inline_keyboard: [
        [{ text: '1', callback_data: 'test_1' }, { text: '2', callback_data: 'test_2' }, { text: '3', callback_data: 'test_3' }, { text: '4', callback_data: 'test_4' }, { text: '5', callback_data: 'test_5' },],
        [{ text: '6', callback_data: 'test_6' }, { text: '7', callback_data: 'test_7' }, { text: '8', callback_data: 'test_8' }, { text: '9', callback_data: 'test_9' }, { text: '10', callback_data: 'test_10' },],
        [{ text: '11', callback_data: 'test_11' }, { text: '12', callback_data: 'test_12' }, { text: '13', callback_data: 'test_13' }, { text: '14', callback_data: 'test_14' }, { text: '15', callback_data: 'test_15' },],
        [{ text: '16', callback_data: 'test_16' }, { text: '17', callback_data: 'test_17' }, { text: '18', callback_data: 'test_18' }, { text: '19', callback_data: 'test_19' }, { text: '20', callback_data: 'test_20' },],
        [{ text: '21', callback_data: 'test_21' }, { text: '22', callback_data: 'test_22' }, { text: '23', callback_data: 'test_23' }, { text: '24', callback_data: 'test_24' }, { text: '25', callback_data: 'test_25' },],
        [{ text: '26', callback_data: 'test_26' }, { text: '27', callback_data: 'test_27' }, { text: '28', callback_data: 'test_28' }, { text: '29', callback_data: 'test_29' }, { text: '30', callback_data: 'test_30' },],
        [{ text: '31', callback_data: 'test_31' }, { text: '32', callback_data: 'test_32' }, { text: '33', callback_data: 'test_33' }, { text: '34', callback_data: 'test_34' }, { text: '35', callback_data: 'test_35' },],
        [{ text: '36', callback_data: 'test_36' }, { text: '37', callback_data: 'test_37' }, { text: '38', callback_data: 'test_38' }, { text: '39', callback_data: 'test_39' }, { text: '40', callback_data: 'test_40' },],
      ],
    };
    bot.sendMessage(chatId, 'Выберите номер теста:', {
      reply_markup: keyboardd
    });
  } else if (data === 'button2') {
    //Вывод результатов
    const rawData = fs.readFileSync('data.json');
    let dattoa;
    dattoa = JSON.parse(rawData);
    if (dattoa[username]) {
      // выполнить действия, если массив существует и не пустой
      //нерешенные билеты
      const targetProps = [];
      for (let i = 1; i <= 40; i++) { let key = `q${i}`; if (key in dattoa[username] && dattoa[username][key] == 0 || !(key in dattoa[username])) { targetProps.push(key); } }
      const arrWithoutQ = targetProps.map(str => str.substring(1));
      //начаты но не решены
      const targetNe = [];
      for (let i = 1; i <= 40; i++) { let key = `q${i}`; if (key in dattoa[username] && dattoa[username][key] > 0) { targetNe.push(key); } }
      const arrWithoutNe = targetNe.map(str => str.substring(1));
      //решенные билеты
      const targetRe = [];
      for (let i = 1; i <= 40; i++) { let key = `q${i}`; if (key in dattoa[username] && dattoa[username][key] == 20) { targetRe.push(key); } }
      const arrWithoutRe = targetRe.map(str => str.substring(1));
      //итого баллов
      let sum = 0;
      for (let prop in dattoa[username]) { sum += dattoa[username][prop]; }

      bot.sendMessage(chatId, `Вы решили ${sum} из 800 вопросов верно\nБилеты не были решины: ${arrWithoutQ}\nБилеты начаты но не решены: ${arrWithoutNe}\nРешенные билеты: ${arrWithoutRe}`);
    } else {
      // выполнить действия, если массив не существует или пустой
      bot.sendMessage(chatId, `Вы пока не решали билеты. Нажмите /start, чтобы начать`);
    }

  } else if (data === 'button3') {
    let rawData = fs.readFileSync('data.json');
    let datyta = JSON.parse(rawData);
    let insrtructir = datyta[username].instr;
    let messageText;
    //Вывод контактов
    if (!insrtructir || insrtructir == 0) {
      messageText = `Инструктор пока не назначен`;
    } else {
      let tel = datyta.datainstructor[insrtructir].tel;
      let fio = datyta.datainstructor[insrtructir].fio;
      messageText = `Истуктор ${fio}. Номер телефона инструктора ${tel}`;
    }
    bot.sendMessage(chatId, `Номер телефона автошколы: +79220022340\nАдреса: Ул. Гагарина 23Б,Ул. Курчатова 5В,Пр. Ленина 29\n${messageText}`);

  } else if (data.startsWith('test_')) {
    testNumber = data.substr(5);
    test(chatId);
  } else if (data === 'button4') {
    //Вывод контактов
    const [dayString, weekdayString] = new Date(Date.now()).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' }).split(', ');
    const [dayString1, weekdayString1] = new Date(Date.now() + 86400000).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' }).split(', ');
    const [dayString2, weekdayString2] = new Date(Date.now() + 2 * 86400000).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' }).split(', ');
    const [dayString3, weekdayString3] = new Date(Date.now() + 3 * 86400000).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' }).split(', ');
    const [dayString4, weekdayString4] = new Date(Date.now() + 4 * 86400000).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' }).split(', ');
    const [dayString5, weekdayString5] = new Date(Date.now() + 5 * 86400000).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' }).split(', ');
    const [dayString6, weekdayString6] = new Date(Date.now() + 6 * 86400000).toLocaleString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' }).split(', ');


    const keyboard = { inline_keyboard: [[{ text: `${weekdayString}, ${dayString}`, callback_data: `${weekdayString}_${dayString}_weekdata` }], [{ text: `${weekdayString1}, ${dayString1}`, callback_data: `${weekdayString1}_${dayString1}_weekdata` }], [{ text: `${weekdayString2}, ${dayString2}`, callback_data: `${weekdayString2}_${dayString2}_weekdata` }], [{ text: `${weekdayString3}, ${dayString3}`, callback_data: `${weekdayString3}_${dayString3}_weekdata` }], [{ text: `${weekdayString4}, ${dayString4}`, callback_data: `${weekdayString4}_${dayString4}_weekdata` }], [{ text: `${weekdayString5}, ${dayString5}`, callback_data: `${weekdayString5}_${dayString5}_weekdata` }], [{ text: `${weekdayString6}, ${dayString6}`, callback_data: `${weekdayString6}_${dayString6}_weekdata` }],] };

    bot.sendMessage(chatId, 'Выберите дату:', { reply_markup: keyboard });

  }

  let data2 = query.data.split('_');
  let week = data2[0];
  let ayString = data2[1];
  let dayS6 = data2[2];
  let userna;
  //Обработка нажатия на день записи
  if (dayS6 === 'weekdata') {
    if (ayString === 'воскресенье') {
      bot.sendMessage(chatId, `Воскресенье нужно отдыхать`);
    } else {
      if (!username) { userna = `Нажмите /start, чтобы начать.` } else {
        let rawData = fs.readFileSync('data.json');

        let datyta = JSON.parse(rawData);

        if (!datyta[username] || datyta[username] == 0) { bot.sendMessage(chatId, `Пока вас нет в базе дынных.`); } else {

          if (!datyta[username].instr || datyta[username].instr == 0) {
            datyta[username].instr = 0;
            fs.writeFileSync('data.json', JSON.stringify(datyta, null, 2));
            userna = 'Пока не назначен инстуктор';
            bot.sendMessage(chatId, `${userna}`);
          } else {
            let unhret = datyta[username].instr;

            if (!datyta[unhret]) {
              datyta[unhret] = datyta[unhret] || {};
              fs.writeFileSync('data.json', JSON.stringify(datyta, null, 2));
            }
            if (!datyta[unhret][week]) {
              datyta[unhret][week] = datyta[unhret][week] || {};
              datyta[unhret][week] = [{ n1: "Свободен", n2: "Свободен", n3: "Свободен", n4: "Свободен", n5: "Свободен", n6: "Свободен", n7: "Свободен", n8: "Свободен" }];
              fs.writeFileSync('data.json', JSON.stringify(datyta, null, 2));
            }

            const keyboard = {
              inline_keyboard: [
                [{ text: `08:00-09:30 ${datyta[unhret][week][0].n1}`, callback_data: `n1_${datyta[unhret][week][0].n1}_${unhret}_${week}_zapis_08:00-09:30` }],
                [{ text: `09:30-11:00 ${datyta[unhret][week][0].n2}`, callback_data: `n2_${datyta[unhret][week][0].n2}_${unhret}_${week}_zapis_09:30-11:00` }],
                [{ text: `11:00-12:30 ${datyta[unhret][week][0].n3}`, callback_data: `n3_${datyta[unhret][week][0].n3}_${unhret}_${week}_zapis_11:00-12:30` }],
                [{ text: `12:30-14:00 ${datyta[unhret][week][0].n4}`, callback_data: `n4_${datyta[unhret][week][0].n4}_${unhret}_${week}_zapis_12:30-14:00` }],
                [{ text: `14:00-15:30 ${datyta[unhret][week][0].n5}`, callback_data: `n5_${datyta[unhret][week][0].n5}_${unhret}_${week}_zapis_14:00-15:30` }],
                [{ text: `15:30-17:00 ${datyta[unhret][week][0].n6}`, callback_data: `n6_${datyta[unhret][week][0].n6}_${unhret}_${week}_zapis_15:30-17:00` }],
                [{ text: `17:00-18:30 ${datyta[unhret][week][0].n7}`, callback_data: `n7_${datyta[unhret][week][0].n7}_${unhret}_${week}_zapis_17:00-18:30` }],
                [{ text: `18:30-20:00 ${datyta[unhret][week][0].n8}`, callback_data: `n8_${datyta[unhret][week][0].n8}_${unhret}_${week}_zapis_18:30-20:00` }],
              ]
            };
            bot.sendMessage(chatId, `Запись на ${week}. Выберите время \nНажмите на /start, чтобы начать заново или /clear что бы отчистить чат.`, { reply_markup: keyboard });

          }
        }
      }
    }
  }

  //------------------------------------------------------------------
  //запись на время
  let zapis = query.data.split('_');
  let zapis0 = zapis[0];
  let zapis1 = zapis[1];
  let zapis2 = zapis[2];
  let zapis3 = zapis[3];
  let zapis4 = zapis[4];
  let zapis5 = zapis[5];
  if (zapis4 === 'zapis') {

    if (zapis1 == 'Свободен') {
      let rawData = fs.readFileSync('data.json');
      let datyta = JSON.parse(rawData);
      datyta[zapis2][zapis3][0][zapis0] = username;
      let tel = datyta.datainstructor[zapis2].tel;
      let fio = datyta.datainstructor[zapis2].fio;
      fs.writeFileSync('data.json', JSON.stringify(datyta, null, 2));
      bot.sendMessage(chatId, `Вы успешно записались. Дата ${zapis3}. Время ${zapis5}\n Истуктор ${fio}. Номер телефона инструктора ${tel} \n Нажмите на /start, чтобы открыть меню или /clear что бы отчистить чат`);

    } else {
      bot.sendMessage(chatId, `Время занято, выберите другое.`);
    }

  }
})
//------------------------------------------------------------------
//Вывод вопроса с вариантами ответов
function test(chatId, voprosNew) {
  const jsonContent = fs.readFileSync('tickets/' + testNumber + '.json');
  const datau = JSON.parse(jsonContent);
  let voprosIndex;

  if (!voprosNew) { voprosIndex = 0; } else { voprosIndex = voprosNew; }

  const question = datau[voprosIndex];
  const answers = question.answers;

  const sendAnswer = (index) => {
    if (index >= answers.length) { return; }
    const answer = answers[index];
    const answerText = answer.answer_text;

    const inlineKeyboard = { inline_keyboard: [[{ text: `Ответ ${index + 1}`, callback_data: JSON.stringify({ buttonId: answer.is_correct, vopros: voprosIndex, calkFn: 'getion' }) }]] };
    bot.sendMessage(chatId, answerText, { reply_markup: inlineKeyboard }).then(() => { sendAnswer(index + 1); }).catch((err) => { console.log(err); });
  };

  bot.sendMessage(chatId, `Билет № ${testNumber}\n${question.title}\n${question.question}`).then(() => {
    if (question.image == 'http://prava74.ru/images/no_image.jpg' || question.image == 'http://prava74.ru/images/A_B/no_image.jpg') { bot.sendMessage(chatId, 'Изображение отсутствует'); sendAnswer(0); } else { bot.sendPhoto(chatId, `${question.image}`, {}).then(() => { sendAnswer(0); }).catch((err) => { console.log(err); }); };

  }).catch((err) => { console.log(err); });
}
//------------------------------------------------------------------


bot.on('callback_query', function (callbackQuery) {
  let data = JSON.parse(callbackQuery.data);

  //------------------------------------------------------------------
  //Обработка нажатия на дату
  if (data.callbackFn === 'dataget') {
    bot.sendMessage(chatId, `Правильных ответов ${week}\n Нажмите /start, чтобы начать ${day}.`);
  }
  //------------------------------------------------------------------
  //Вывод нового вопроса из теста
  if (data.callbackFn === 'getNextQuestion') {
    let voprosNew = data.vopros;
    test(chatId, voprosNew);
  }
  //------------------------------------------------------------------
  //подсчет правильных ответов в конце теста
  if (data.callbackFn === 'getResults') {
    let nomerbidleta = data.nomerbileta;
    const rawData = fs.readFileSync('data.json');
    let datyta;
    datyta = JSON.parse(rawData);
    let guty = datyta[username][nomerbidleta];
    bot.sendMessage(chatId, `Правильных ответов ${guty}\nНажмите /start, чтобы начать или /clear что бы отчистить чат..`);
  }

  //------------------------------------------------------------------
  //при нажатии на вариант ответа
  if (data.calkFn === 'getion') {
    let buttonId = data.buttonId; //правильный ли ответ
    let voprosIndex = data.vopros; // номер вопроса
    let voprosNew = voprosIndex + 1;  //номер след вопроса
    const jsonContent = fs.readFileSync('tickets/' + testNumber + '.json');
    const datau = JSON.parse(jsonContent);
    const nomerbileta = 'q' + testNumber;
    // чтение содержимого файла
    const rawData = fs.readFileSync('data.json');
    let datta;
    datta = JSON.parse(rawData);

    if (!datta[username]) {
      datta[username] = {};
      if (buttonId == true) { datta[username][nomerbileta] = 1; } else { datta[username][nomerbileta] = 0; }
    } else {
      if (voprosIndex == 0) { datta[username][nomerbileta] = 0; }
      let rezult = datta[username][nomerbileta];
      if (buttonId == true) { let tery = rezult + 1; datta[username][nomerbileta] = tery; }
    }

    fs.writeFileSync('data.json', JSON.stringify(datta, null, 2));

    const inlineKeyboard = { inline_keyboard: [[{ text: `Следующий вопрос`, callback_data: JSON.stringify({ vopros: voprosNew, callbackFn: 'getNextQuestion' }) }]] };
    // Если да, создаем объект с кнопкой "Готово"
    if (voprosIndex === 19) { inlineKeyboard.inline_keyboard = [[{ text: 'Готово', callback_data: JSON.stringify({ nomerbileta: nomerbileta, callbackFn: 'getResults' }) }]]; }
    bot.sendMessage(chatId, `${datau[voprosIndex].correct_answer}\n${datau[voprosIndex].answer_tip}`, { reply_markup: inlineKeyboard });
  }

});
//------------------------------------------------------------------


/*

cd C:\Users\1\Desktop\vk.sort
node bot.js

*/