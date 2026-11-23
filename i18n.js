/*
 * Sayt interfeysi yozuvlari (tugmalar, sarlavhalar, xabarlar) — 5 tilda.
 * Taklifnoma matnining o‘zi config.js da. «Ўзбекча» lotin matndan avtomatik o‘giriladi (toCyrl).
 * {nom} — o‘rniga qiymat qo‘yiladigan joy.
 */
(() => {
  'use strict';

  /* ---------- O‘zbek lotin → kirill ---------- */
  // Lotin harflari, brendlar, havolalar va {o‘rinbosarlar} o‘girilmaydi.
  const KEEP = /(<[^>]+>|\{[^}]+\}|https?:\/\/\S+|YouTube|Google Maps|Google|Yandex|ﷺ)/;
  const WORDS = { noyabr: 'ноябрь', yanvar: 'январь', fevral: 'февраль', aprel: 'апрель', iyun: 'июнь', iyul: 'июль', sentabr: 'сентябрь', oktabr: 'октябрь', dekabr: 'декабрь' };
  const PAIRS = [['o‘', 'ў'], ['oʻ', 'ў'], ["o'", 'ў'], ['g‘', 'ғ'], ['gʻ', 'ғ'], ["g'", 'ғ'], ['sh', 'ш'], ['ch', 'ч'], ['yo', 'ё'], ['yu', 'ю'], ['ya', 'я']];
  const ONE = { a: 'а', b: 'б', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', x: 'х', y: 'й', z: 'з', c: 'ц', w: 'в' };
  const isLetter = ch => /[a-zа-яёўғқҳ]/i.test(ch);
  const APOS = /[‘ʻ']/;
  function cyrWord(w) {
    const low = w.toLowerCase();
    if (WORDS[low]) return w === w.toUpperCase() ? WORDS[low].toUpperCase() : (w[0] === w[0].toUpperCase() ? WORDS[low][0].toUpperCase() + WORDS[low].slice(1) : WORDS[low]);
    let out = '';
    for (let i = 0; i < w.length;) {
      const ch = w[i], l = ch.toLowerCase(), isUp = ch !== l;
      const twoL = w.slice(i, i + 2).toLowerCase();
      if (i === 0 && twoL === 'ye') { out += isUp ? 'Е' : 'е'; i += 2; continue; }
      // «yo‘» — bu y + o‘ (йў), «yo» emas
      const pair = PAIRS.find(p => p[0] === twoL && !(twoL === 'yo' && APOS.test(w[i + 2] || '')));
      if (pair) { out += isUp ? pair[1].toUpperCase() : pair[1]; i += 2; continue; }
      if (l === 'e' && i === 0) { out += isUp ? 'Э' : 'э'; i++; continue; }
      if ((ch === '’' || ch === "'") && i > 0 && isLetter(w[i - 1]) && i + 1 < w.length && isLetter(w[i + 1])) { out += 'ъ'; i++; continue; }
      out += ONE[l] ? (ch !== l ? ONE[l].toUpperCase() : ONE[l]) : ch;
      i++;
    }
    return out;
  }
  function toCyrl(text) {
    return String(text).split(KEEP).map((part, i) => (i % 2 ? part : part.replace(/[A-Za-zʻ‘’']+/g, m => cyrWord(m)))).join('');
  }
  // Obyekt/massivni chuqur o‘girish; `skip` dagi kalitlar (masalan arabcha) tegilmaydi
  function deepCyrl(v, skip = []) {
    if (typeof v === 'string') return toCyrl(v);
    if (Array.isArray(v)) return v.map(x => deepCyrl(x, skip));
    if (v && typeof v === 'object') {
      const o = {};
      for (const k of Object.keys(v)) o[k] = skip.includes(k) || typeof v[k] === 'function' ? v[k] : deepCyrl(v[k], skip);
      return o;
    }
    return v;
  }

  const uz = {
    lang_name: 'O‘zbekcha', lang_code: 'UZ', html_lang: 'uz', map_lang: 'uz_UZ',
    doc_title: 'Jasurbek va Nargizaxonning nikoh to‘yiga taklifnoma',
    skip: 'Taklifnomaga o‘tish',
    lang_aria: 'Tilni tanlash',
    gate_kicker: 'NIKOH TO‘YIGA TAKLIFNOMA',
    gate_title: 'Assalomu alaykum,<br><em>aziz mehmonimiz</em>',
    gate_hint: 'Sizga atalgan taklifni ochish uchun tanlang',
    aria_top: 'Taklifnoma boshiga', where: 'Manzil', aria_where: 'Manzil va yo‘l',
    time_at: 'SOAT {t}', where_btn: 'Yo‘lni ko‘rish', scroll_cue: 'Taklifni o‘qing', aria_down: 'Pastga',
    invite_kicker: 'OTA-ONA TILIDAN', ayah_kicker: 'QUR’ONI KARIMDAN',
    hadiths_kicker: 'OILA HAQIDA · SAHIH MANBALARDAN',
    hadiths_title: 'Payg‘ambarimiz <span class="saw" lang="ar">ﷺ</span> <em>o‘gitlari</em>',
    hadith_n: '{n} · SAHIH HADIS',
    program_kicker: 'SIZ UCHUN DASTUR', program_title: 'Marosim <em>tartibi</em>',
    count_kicker: 'MUBORAK KUNGACHA', u_d: 'kun', u_h: 'soat', u_m: 'daqiqa', u_s: 'soniya',
    count_wait: '{date}, soat {t} da kutamiz', count_live: 'Marosim boshlandi — xush kelibsiz!', count_done: 'Tashrifingiz va duolaringiz uchun rahmat!',
    venue_kicker: 'SIZNI SHU YERDA KUTAMIZ', venue_when: '{date} · soat {t}',
    route_lead: 'Bir bosishda — turgan joyingizdan <b>«{name}»</b> gacha yo‘l:',
    route_yandex: 'Yo‘lni ko‘rsatish · Yandex', route_google: 'Yo‘lni ko‘rsatish · Google Maps',
    copy_addr: 'Manzilni nusxalash', coords: 'Koordinata:', map_loading: 'Xarita yuklanmoqda…', map_title: '«{name}» xaritada',
    landmark: 'Mo‘ljal: {x}', copy_text: '«{name}», {address}\nKoordinata: {coords}\nXarita: {url}',
    copied: 'Manzil nusxalandi — taksi haydovchisiga yuborishingiz mumkin', copy_prompt: 'Manzilni nusxalang:',
    dua_kicker: 'NIKOH TABRIGI · SUNNAT DUO', dua_title: 'Nikoh duosi',
    share: 'Taklifnomani ulashish', ics: 'Kalendarga saqlash', call: 'Qo‘ng‘iroq qilish',
    share_title: 'Nikoh to‘yiga taklifnoma',
    share_text: '{parents} sizni {groom}ning nikoh to‘yiga taklif qiladi. {date}, «{venue}», {address}. {event} — soat {time}.',
    share_copied: 'Taklifnoma havolasi nusxalandi', share_prompt: 'Havolani nusxalang:',
    ics_summary: '{groom}ning nikoh to‘yi · {event}', ics_desc: '{parents} taklifi. {event} — soat {time}. Xarita: {url}',
    music_kicker_men: 'TAKLIFNOMA OHANGI', music_kicker_women: 'NASHID',
    music_note_men: 'Musiqa YouTube pleyeri orqali ijro etiladi.',
    music_note_women: 'Nashid YouTube pleyeri orqali ijro etiladi. Butun ekranda ko‘rish uchun pleyer burchagidagi tugmani bosing.',
    music_file: 'Musiqa sayt serverga joylanganda ishlaydi.', music_err: 'Bu ohangni sahifa ichida ijro etib bo‘lmadi.',
    yt_err: 'YouTube yuklanmadi.', yt_link: 'YouTube’da tinglash ↗',
    sound_on: 'Musiqani yoqish', sound_off: 'Musiqani to‘xtatish', press_play: 'Pleyerdagi ▶ tugmasini bosing',
    foot_small: 'Ezgu niyatlar va xayrli duolar ila',
    dlg_kicker: 'TIL VA DASTUR', dlg_title: 'Sizga mos taklif', close: 'Yopish',
    months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    weekdays: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'],
    date_hero: '{d}-{m} {y} · {w}', date_long: '{d}-{m}, {w}'
  };

  const cyrl = Object.assign(deepCyrl(uz), {
    lang_name: 'Ўзбекча', lang_code: 'ЎЗ', html_lang: 'uz-Cyrl', map_lang: 'uz_UZ',
    months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    yt_link: 'YouTube’да тинглаш ↗'
  });

  const ru = {
    lang_name: 'Русский', lang_code: 'RU', html_lang: 'ru', map_lang: 'ru_RU',
    doc_title: 'Приглашение на свадьбу Жасурбека и Наргизахон',
    skip: 'Перейти к приглашению',
    lang_aria: 'Выбор языка',
    gate_kicker: 'ПРИГЛАШЕНИЕ НА СВАДЬБУ',
    gate_title: 'Ассаляму алейкум,<br><em>дорогой гость</em>',
    gate_hint: 'Выберите, чтобы открыть ваше приглашение',
    aria_top: 'В начало', where: 'Адрес', aria_where: 'Адрес и маршрут',
    time_at: 'В {t}', where_btn: 'Маршрут', scroll_cue: 'Читать приглашение', aria_down: 'Вниз',
    invite_kicker: 'ОТ РОДИТЕЛЕЙ', ayah_kicker: 'ИЗ СВЯЩЕННОГО КОРАНА',
    hadiths_kicker: 'О СЕМЬЕ · ИЗ ДОСТОВЕРНЫХ ИСТОЧНИКОВ',
    hadiths_title: 'Наставления Пророка <span class="saw" lang="ar">ﷺ</span>',
    hadith_n: '{n} · ДОСТОВЕРНЫЙ ХАДИС',
    program_kicker: 'ПРОГРАММА ДЛЯ ВАС', program_title: 'Порядок <em>торжества</em>',
    count_kicker: 'ДО БЛАГОСЛОВЕННОГО ДНЯ', u_d: 'дней', u_h: 'часов', u_m: 'минут', u_s: 'секунд',
    count_wait: 'Ждём вас {date} в {t}', count_live: 'Торжество началось — добро пожаловать!', count_done: 'Спасибо за ваш визит и ваши молитвы!',
    venue_kicker: 'ЖДЁМ ВАС ЗДЕСЬ', venue_when: '{date} · в {t}',
    route_lead: 'Одно нажатие — и маршрут от вашего места до <b>«{name}»</b>:',
    route_yandex: 'Маршрут · Яндекс', route_google: 'Маршрут · Google Maps',
    copy_addr: 'Скопировать адрес', coords: 'Координаты:', map_loading: 'Загрузка карты…', map_title: '«{name}» на карте',
    landmark: 'Ориентир: {x}', copy_text: '«{name}», {address}\nКоординаты: {coords}\nКарта: {url}',
    copied: 'Адрес скопирован — можно отправить таксисту', copy_prompt: 'Скопируйте адрес:',
    dua_kicker: 'ПОЗДРАВЛЕНИЕ С БРАКОМ · СУННА-ДУА', dua_title: 'Дуа для молодожёнов',
    share: 'Поделиться приглашением', ics: 'Сохранить в календарь', call: 'Позвонить',
    share_title: 'Приглашение на свадьбу',
    share_text: '{parents} приглашает вас на свадьбу {groom}. {date}, «{venue}», {address}. {event} — в {time}.',
    share_copied: 'Ссылка на приглашение скопирована', share_prompt: 'Скопируйте ссылку:',
    ics_summary: 'Свадьба {groom} · {event}', ics_desc: 'Приглашение: {parents}. {event} — в {time}. Карта: {url}',
    music_kicker_men: 'МЕЛОДИЯ ПРИГЛАШЕНИЯ', music_kicker_women: 'НАШИД',
    music_note_men: 'Музыка воспроизводится через плеер YouTube.',
    music_note_women: 'Нашид воспроизводится через плеер YouTube. Для полноэкранного просмотра нажмите кнопку в углу плеера.',
    music_file: 'Музыка работает, когда сайт размещён на сервере.', music_err: 'Не удалось воспроизвести мелодию на странице.',
    yt_err: 'YouTube не загрузился.', yt_link: 'Слушать на YouTube ↗',
    sound_on: 'Включить музыку', sound_off: 'Выключить музыку', press_play: 'Нажмите ▶ в плеере',
    foot_small: 'С добрыми намерениями и благими молитвами',
    dlg_kicker: 'ЯЗЫК И ПРОГРАММА', dlg_title: 'Ваше приглашение', close: 'Закрыть',
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    date_hero: '{d} {m} {y} · {w}', date_long: '{d} {m}, {w}'
  };

  window.I18N = { order: ['uz', 'cyrl', 'ru'], ui: { uz, cyrl, ru }, toCyrl, deepCyrl };
})();
