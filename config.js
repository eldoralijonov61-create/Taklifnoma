/*
 * Taklifnoma ma’lumotlari.
 * Yuqori qism — tilga bog‘liq bo‘lmagan ma’lumot (sana, vaqt, musiqa, xarita, arabcha matnlar).
 * `text` — har bir tildagi matn: uz (lotin), ru. «Ўзбекча» uz matndan avtomatik o‘giriladi;
 * kerak bo‘lsa `text.cyrl` ga faqat farq qiladigan qismini yozing.
 * Hadislarning arabcha matni sunnah.com dan, oyat quran.com dan (2026-10-19). Tarjimalar — ma’no tarjimasi;
 * **...** — qalin yozuv.
 */
window.INVITATION = {
  date: "2026-11-29",            // YYYY-MM-DD
  tz: "+05:00",                  // O‘zbekiston vaqti
  phone: "",                     // masalan "+998901234567" — bo‘sh bo‘lsa tugma ko‘rinmaydi
  defaultLang: "uz",

  venue: {
    // Mijoz yuborgan Google Maps nuqtasi
    coords: "40.500898, 71.173111",
    mapUrl: "https://maps.app.goo.gl/sYW4N4DRnKU2G6h28",
    routeUrl: "https://yandex.uz/maps/?rtext=~40.500898%2C71.173111&rtt=auto",
    googleUrl: "https://www.google.com/maps/dir/?api=1&destination=40.500898%2C71.173111&travelmode=driving",
    // Shahar ko‘chalari ko‘rinadigan masshtab (z=16) va katta qizil belgi
    mapEmbed: "https://yandex.uz/map-widget/v1/?ll=71.173111%2C40.500898&z=16&pt=71.173111%2C40.500898%2Cpm2rdl"
  },
  quran: {
    arabic: "وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    url: "https://quran.com/30/21"
  },
  dua: {
    arabic: "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    url: "https://sunnah.com/abudawud:2130"
  },
  men: {
    time: "08:00",
    music: {
      file: "",                  // o‘z MP3 faylingiz bo‘lsa: "assets/music/erkaklar.mp3"
      youtubeId: "MucnQ-DKih4",
      volume: 80
    },
    hadiths: [
      { arabic: "خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ، وَأَنَا خَيْرُكُمْ لأَهْلِي", url: "https://sunnah.com/tirmidhi:3895" },
      { arabic: "اسْتَوْصُوا بِالنِّسَاءِ خَيْرًا", url: "https://sunnah.com/bukhari:5186" }
    ],
    story: {
      quoteArabic: "إِنَّ لِرَبِّكَ عَلَيْكَ حَقًّا، وَلِنَفْسِكَ عَلَيْكَ حَقًّا، وَلأَهْلِكَ عَلَيْكَ حَقًّا، فَأَعْطِ كُلَّ ذِي حَقٍّ حَقَّهُ",
      url: "https://sunnah.com/bukhari:1968"
    }
  },
  women: {
    time: "12:00",
    music: {
      file: "",                  // o‘z MP3 faylingiz bo‘lsa: "assets/music/ayollar.mp3"
      youtubeId: "OoP_GZIAajM",
      volume: 80
    },
    hadiths: [
      { arabic: "الدُّنْيَا مَتَاعٌ، وَخَيْرُ مَتَاعِ الدُّنْيَا الْمَرْأَةُ الصَّالِحَةُ", url: "https://sunnah.com/muslim:715k" },
      { arabic: "وَالْمَرْأَةُ رَاعِيَةٌ فِي بَيْتِ زَوْجِهَا وَمَسْئُولَةٌ عَنْ رَعِيَّتِهَا", url: "https://sunnah.com/bukhari:893" }
    ],
    story: {
      quoteArabic: "كَلاَّ وَاللَّهِ مَا يُخْزِيكَ اللَّهُ أَبَدًا، إِنَّكَ لَتَصِلُ الرَّحِمَ، وَتَحْمِلُ الْكَلَّ، وَتَكْسِبُ الْمَعْدُومَ، وَتَقْرِي الضَّيْفَ، وَتُعِينُ عَلَى نَوَائِبِ الْحَقِّ",
      url: "https://sunnah.com/bukhari:3"
    }
  },

  text: {
    /* ================= O‘ZBEKCHA (LOTIN) ================= */
    uz: {
      groom: "Jasurbek Nematov va Nargizaxon",
      hero: { lead: "Farzandlarimiz", name: "JASURBEK VA NARGIZAXONNING", names: ["JASURBEK", "NARGIZAXONNING"], and: "va", title: "nikoh ayyomiga marhamat!", verse: ["Bu kunning fayzi — diydoringiz,", "eng aziz to‘yonasi — duolaringiz."] },
      parents: "Nematovlar oilasi",
      signOff: "Hurmat va ehtirom ila,",
      venue: {
        name: "Oqsaroy", city: "Bag‘dod tumani",
        address: "Farg‘ona viloyati, Bag‘dod tumani, «Oqsaroy» tantanalar saroyi",
        landmark: ""             // mo‘ljal bo‘lsa yozing
      },
      quran: {
        meaning: "Sizlar orom topishingiz uchun o‘zlaringizdan juftlar yaratib, o‘rtangizda muhabbat va mehr-shafqat paydo qilgani ham Uning alomatlaridandir. Albatta, bunda tafakkur qiladigan qavm uchun alomatlar bor.",
        source: "Rum surasi, 21-oyat"
      },
      dua: {
        translit: "Bārakallāhu laka va bāraka ‘alayka va jama‘a baynakumā fī xoyr",
        text: "Alloh senga baraka bersin, ustingga barakasini yog‘dirsin va ikkovingizni yaxshilikda jamlasin.",
        source: "Imom Abu Dovud, 2130 · Imom Termiziy, 1091 · sahih"
      },
      men: {
        short: "Erkaklar", label: "Erkaklar uchun", event: "Xatmi Qur’on",
        greeting: "Assalomu alaykum, muhtaram azizlar!",
        invitation: [
          "29-noyabr kuni «Oqsaroy»da bo‘ladigan **Jasurbek Nematov va Nargizaxonning nikoh to‘yiga** taklif etamiz. Kuyov tomoni va kelin tomonining xatmi Qur’oni **08:00** da boshlanadi.",
          "Ushbu saodatli kunda quvonchimizga sherik, farzandlarimizning baxt-u iqboliga duogo‘y bo‘ling."
        ],
        hadiths: [
          { theme: "Eng yaxshingiz", text: "Sizlarning eng yaxshingiz — o‘z ahliga eng yaxshi bo‘lganingizdir. Men esa ahlimga eng yaxshi bo‘lganingizman.", narrator: "Oisha onamiz (r.a.) rivoyati", source: "Imom Termiziy, 3895 · sahih" },
          { theme: "Payg‘ambar vasiyati", text: "Ayollarga yaxshilik qilish haqidagi vasiyatimni qabul qilinglar.", narrator: "Abu Hurayra (r.a.) rivoyati", source: "Imom Buxoriy, 5186 · Imom Muslim, 1468" }
        ],
        story: {
          kicker: "Ibratli rivoyat", title: "Salmon va Abu Dardo",
          beats: ["Salmon Forsiy birodari Abu Dardoning uyiga bordi. Ummu Dardo: «Birodaringizning dunyoga ehtiyoji yo‘q», — dedi. Abu Dardo ro‘zador edi, kechasi esa namozga turmoqchi bo‘ldi. Salmon uni taomga, so‘ng uyquga ko‘ndirdi, saharda ikkalasi birga namoz o‘qishdi va Salmon dedi:"],
          quote: "Robbingning sendagi haqqi bor, nafsingning sendagi haqqi bor, ahlingning ham sendagi haqqi bor. Har bir haq egasiga haqqini ber.",
          ending: "Payg‘ambarimiz ﷺ: «Salmon rost aytdi», — dedilar.",
          source: "Imom Buxoriy, 1968"
        },
        program: [
          { time: "08:00", title: "Kuyov tomoni", text: "Erkaklar uchun xatmi Qur’on" },
          { time: "08:00", title: "Kelin tomoni", text: "Xatmi Qur’on" }
        ],
        programNote: "Xatmi Qur’on har ikki tomonda soat 08:00 da boshlanadi.",
        closingTitle: ["Dasturxonimizga", "marhamat!"],
        closing: "Ushbu muborak tongda sizni intizorlik bilan kutamiz.",
        musicTitle: "«Anta nurulloh fajran» — nashid"
      },
      women: {
        short: "Ayollar", label: "Ayollar uchun", event: "Ayollar davrasi (kuyov tomoni)",
        choiceSummary: "Kelin tomoni 10:00 · Kuyov tomoni 12:00",
        greeting: "Muhtarama onaxonlar, aziz opa-singillar!",
        invitation: [
          "29-noyabr kuni «Oqsaroy»da bo‘ladigan **Jasurbek Nematov va Nargizaxonning nikoh to‘yiga** taklif etamiz. Ayollar davrasi kelin tomonida **10:00** da, kuyov tomonida **12:00** da boshlanadi. **Kelin tushdi 13:00** da bo‘ladi.",
          "Ushbu saodatli kunda quvonchimizga sherik, farzandlarimizning baxt-u iqboliga duogo‘y bo‘ling."
        ],
        hadiths: [
          { theme: "Dunyoning eng go‘zal ne’mati", text: "Dunyo — bir ne’matdir. Dunyo ne’matlarining eng yaxshisi esa solih ayoldir.", narrator: "Abdulloh ibn Amr (r.a.) rivoyati", source: "Imom Muslim, 1467" },
          { theme: "Uyning bekasi", text: "Ayol erining uyida boshqaruvchidir va qo‘l ostidagilar uchun mas’uldir.", narrator: "Abdulloh ibn Umar (r.a.) rivoyati", source: "Imom Buxoriy, 893" }
        ],
        story: {
          kicker: "Ibratli rivoyat", title: "Xadicha onamizning sadoqati",
          beats: ["Ilk vahiydan so‘ng Payg‘ambarimiz ﷺ xavotir bilan uyga qaytib: «O‘zimdan xavotirdaman», — dedilar. Xadicha onamiz u zotga suyanch bo‘lib, shunday dedilar:"],
          quote: "Yo‘q, Allohga qasamki, Alloh sizni hech qachon xor qilmaydi! Siz qarindoshlik rishtalarini bog‘laysiz, ojizning yukini ko‘tarasiz, yo‘qsilga topib berasiz, mehmonni izzatlaysiz va haq yo‘lidagi musibatlarda yordam berasiz.",
          ending: "So‘ng u zotni Varaqa ibn Navfal huzuriga olib bordilar — og‘ir lahzada so‘z bilan ham, amal bilan ham yonlarida bo‘ldilar.",
          source: "Imom Buxoriy, 3"
        },
        program: [
          { time: "10:00", title: "Kelin tomoni", text: "Ayollar davrasi" },
          { time: "12:00", title: "Kuyov tomoni", text: "Ayollar davrasi" },
          { time: "13:00", title: "Kelin tushdi", text: "Kelinni kutib olish" }
        ],
        programNote: "Iltimos, o‘zingiz taklif etilgan tomon vaqtiga qarab tashrif buyuring.",
        closingTitle: ["Davramizga", "marhamat!"],
        closing: "Quvonchli kunimizda sizni intizorlik bilan kutamiz.",
        musicTitle: "To‘y nashidi — Muhammad al-Muqit"
      }
    },

    /* ================= ЎЗБЕКЧА (КИРИЛЛ) — faqat avtomatik o‘girishdan farqlar ================= */
    cyrl: {
      dua: { translit: "Бāрокаллоҳу лака ва бāрока ъалайка ва жамаъа байнакумā фий хойр" }
    },

    /* ================= РУССКИЙ ================= */
    ru: {
      groom: "Жасурбека Нематова и Наргизахон",
      groomNom: "Жасурбек и Наргизахон",           // pastki yozuv uchun (bosh kelishik)
      hero: { lead: "Свадьба наших детей", name: "ЖАСУРБЕКА И НАРГИЗАХОН", names: ["ЖАСУРБЕКА", "НАРГИЗАХОН"], and: "и", title: "добро пожаловать!", verse: ["Благодать этого дня — ваше присутствие,", "самый дорогой подарок — ваши молитвы."] },
      parents: "Семья Нематовых",
      signOff: "С уважением и почтением,",
      venue: {
        name: "Оксарой", city: "Багдадский район",
        address: "Ферганская область, Багдадский район, дворец торжеств «Оксарой»",
        landmark: ""
      },
      quran: {
        meaning: "Среди Его знамений — то, что Он сотворил из вас самих жен для вас, чтобы вы находили в них успокоение, и установил между вами любовь и милосердие. Воистину, в этом — знамения для людей размышляющих.",
        source: "Сура «Ар-Рум», аят 21"
      },
      dua: {
        translit: "Баракаллаху лака ва барака ‘алайка ва джама‘а байнакума фи хайр",
        text: "Да благословит тебя Аллах, да ниспошлёт Он тебе благодать и да соединит вас во благе.",
        source: "Абу Дауд, 2130 · ат-Тирмизи, 1091 · сахих"
      },
      men: {
        short: "Мужчины", label: "Для мужчин", event: "Хатм Корана",
        greeting: "Ассаляму алейкум, уважаемые!",
        invitation: [
          "Приглашаем вас на **свадьбу Жасурбека Нематова и Наргизахон** 29 ноября в зале «Оксарой». Хатм Корана со стороны жениха и со стороны невесты начнётся в **08:00**.",
          "Разделите нашу радость в этот счастливый день и помолитесь за счастье наших детей."
        ],
        hadiths: [
          { theme: "Лучший из вас", text: "Лучший из вас — тот, кто лучше всех к своей семье, а я лучший из вас к своей семье.", narrator: "Передала Аиша (да будет доволен ею Аллах)", source: "ат-Тирмизи, 3895 · сахих" },
          { theme: "Завет Пророка", text: "Завещаю вам: относитесь к женщинам хорошо.", narrator: "Передал Абу Хурайра (да будет доволен им Аллах)", source: "аль-Бухари, 5186 · Муслим, 1468" }
        ],
        story: {
          kicker: "Поучительная история", title: "Салман и Абу ад-Дарда",
          beats: ["Салман аль-Фариси навестил своего брата по вере Абу ад-Дарду. Умм ад-Дарда сказала: «Твоему брату нет дела до этого мира». Абу ад-Дарда постился, а ночью хотел встать на молитву. Салман уговорил его поесть, затем поспать; перед рассветом они вместе помолились, и Салман сказал:"],
          quote: "У твоего Господа есть право на тебя, у твоей души есть право на тебя и у твоей семьи есть право на тебя. Отдавай же каждому имеющему право его право.",
          ending: "Пророк ﷺ сказал: «Салман сказал правду».",
          source: "аль-Бухари, 1968"
        },
        program: [
          { time: "08:00", title: "Сторона жениха", text: "Хатм Корана для мужчин" },
          { time: "08:00", title: "Сторона невесты", text: "Хатм Корана" }
        ],
        programNote: "Хатм Корана с обеих сторон начнётся в 08:00.",
        closingTitle: ["К нашему дастархану —", "добро пожаловать!"],
        closing: "С нетерпением ждём вас в это благословенное утро.",
        musicTitle: "«Анта нуруллахи фаджран» — нашид"
      },
      women: {
        short: "Женщины", label: "Для женщин", event: "Женское торжество (сторона жениха)",
        choiceSummary: "Сторона невесты 10:00 · Сторона жениха 12:00",
        greeting: "Уважаемые мамы, дорогие сёстры!",
        invitation: [
          "Приглашаем вас на **свадьбу Жасурбека Нематова и Наргизахон** 29 ноября в зале «Оксарой». Женское торжество со стороны невесты начнётся в **10:00**, со стороны жениха — в **12:00**. Встреча невесты — в **13:00**.",
          "Разделите нашу радость в этот счастливый день и помолитесь за счастье наших детей."
        ],
        hadiths: [
          { theme: "Лучшее благо этого мира", text: "Этот мир — благо для пользования, а лучшее из благ этого мира — праведная женщина.", narrator: "Передал Абдуллах ибн Амр (да будет доволен им Аллах)", source: "Муслим, 1467" },
          { theme: "Хозяйка дома", text: "Женщина — пастырь в доме своего мужа и отвечает за вверенное ей.", narrator: "Передал Ибн Умар (да будет доволен им Аллах)", source: "аль-Бухари, 893" }
        ],
        story: {
          kicker: "Поучительная история", title: "Верность Хадиджи",
          beats: ["После первого откровения Пророк ﷺ вернулся домой встревоженным и сказал: «Я боюсь за себя». Хадиджа стала ему опорой и сказала:"],
          quote: "Нет, клянусь Аллахом, Аллах никогда не опозорит тебя! Ты поддерживаешь родственные связи, несёшь бремя слабых, даёшь неимущим, оказываешь гостеприимство и помогаешь в бедах на пути истины.",
          ending: "Затем она отвела его к Вараке ибн Науфалю — в трудную минуту она была рядом и словом, и делом.",
          source: "аль-Бухари, 3"
        },
        program: [
          { time: "10:00", title: "Сторона невесты", text: "Женское торжество" },
          { time: "12:00", title: "Сторона жениха", text: "Женское торжество" },
          { time: "13:00", title: "Встреча невесты", text: "Церемония встречи невесты" }
        ],
        programNote: "Пожалуйста, приходите ко времени, указанному для вашей стороны.",
        closingTitle: ["В наш круг —", "добро пожаловать!"],
        closing: "С нетерпением ждём вас в наш радостный день.",
        musicTitle: "Свадебный нашид — Мухаммад аль-Мукит"
      }
    }
  }
};
