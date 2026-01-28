
import { StyleCategory, TariffType } from './types';

export const TELEGRAM_BOT_TOKEN = '8097424623:AAGF9MMoHk5NKE-4Md93YcdtJ4oHTBb8aqg'; 
export const SUPER_ADMIN_ID = 1123829252; 
export const ADMIN_CHAT_ID = String(SUPER_ADMIN_ID); 

export const VSPYSHKA_AVATARS = {
  thinking: 'https://i.postimg.cc/vTxz6CzW/Задумчивая.png',
  neutral: 'https://i.postimg.cc/7hJVTjV1/Легкая_улыбка.png',
  professional: 'https://i.postimg.cc/vTxz6Czr/Легкая_улыбка_с_фотоаппаратом.png',
  winking: 'https://i.postimg.cc/d3ZBTg6c/Подмигивает.png',
  happy: 'https://i.postimg.cc/2yLwBgwF/Радуется.png',
  celebrating: 'https://i.postimg.cc/gr9Ky4ST/Радуется_с_фотоаппаратом.png',
  serious: 'https://i.postimg.cc/YjcxN8ny/Смотрит_серьезно.png',
  eureka: 'https://i.postimg.cc/14xK0MCk/Эврика.png',
};

export const QUIZ_QUESTIONS = {
  purpose: {
    question: "Где будешь использовать свои новые фото? ✨",
    options: [
      { id: 'social', label: '📱 Для соцсетей и блога', weight: TariffType.PRO },
      { id: 'self', label: '💖 Для себя (личный архив)', weight: TariffType.STANDARD },
      { id: 'portfolio', label: '💼 Проф. портфолио', weight: TariffType.PRO },
      { id: 'art', label: '🎭 Творческий эксперимент', weight: TariffType.VIP },
    ]
  },
  vibe: {
    question: "Какая эстетика тебе сейчас ближе? 🎨",
    options: [
      { id: 'real', label: '📸 Максимальный реализм', category: '🔹 Реалистичные и фотографические стили' },
      { id: 'magic', label: '✨ Сказочно и фэнтезийно', category: '🔹 Фантазийные и стилизованные стили' },
      { id: 'artistic', label: '🖼️ Художественный арт', category: '🔹 Художественные стили' },
      { id: 'vintage', label: '🎞️ Винтажная классика', category: '🔹 Винтажные и ретро стили' },
    ]
  },
  volume: {
    question: "Насколько масштабное преображение ты хочешь? 🚀",
    options: [
      { id: 'few', label: '👌 3 точных образа', weight: TariffType.STANDARD },
      { id: 'middle', label: '🔥 6 разных граней', weight: TariffType.PRO },
      { id: 'max', label: '👑 Полный спектр (12+)', weight: TariffType.VIP },
    ]
  }
};

export const TARIFFS = [
  {
    type: TariffType.STANDARD,
    price: '5.000₽',
    stylesLimit: 3,
    photos: 30,
    features: ['3 образа на выбор', '30 готовых фото']
  },
  {
    type: TariffType.PRO,
    price: '7.000₽',
    stylesLimit: 6,
    photos: 60,
    features: ['6 образов на выбор', '60 готовых фото', 'Рекомендовано']
  },
  {
    type: TariffType.VIP,
    price: '9.500₽ + 🎁',
    stylesLimit: 12,
    photos: 120,
    features: ['12 образов на выбор', '120 готовых фото', 'Приоритетная обработка']
  }
];

export const STYLE_CATEGORIES: StyleCategory[] = [
  {
    title: '🔹 Реалистичные и фотографические стили',
    description: 'Максимально естественные кадры, как фото на камеру',
    items: [
      { 
        id: 'real_photo', 
        name: 'Real Photo (Реалистичное фото)', 
        description: 'Фотостиль с выбором настроения: естественно, кинематографично или минималистично.',
        images: [
          'https://i.postimg.cc/6QqnztJd/1.1._Real_Photo_1.png',
          'https://i.postimg.cc/J4KsFvQR/1.1._Real_Photo_2.png',
          'https://i.postimg.cc/jdYyH3zS/1.1._Real_Photo_3.png'
        ]
      },
      { 
        id: 'fashion', 
        name: 'Fashion (Фэшн / Модный)', 
        description: 'Стиль обложек модных журналов',
        images: [
          'https://i.postimg.cc/JzgQNgy3/1.2._Fishion_1.png',
          'https://i.postimg.cc/jS9hH9WH/1.2._Fishion_2.png',
          'https://i.postimg.cc/zGMkCMLS/1.2._Fishion_3.png'
        ]
      },
      { 
        id: 'luxury', 
        name: 'Luxury (Роскошь / Премиум)', 
        description: 'Дорогие интерьеры, атмосфера премиум',
        images: [
          'https://i.postimg.cc/HnRLZQbP/1.3._Luxury_1.png',
          'https://i.postimg.cc/WzC4WM0H/1.3._Luxury_2.png',
          'https://i.postimg.cc/d3p0H8GH/1.3._Luxury_3.png'
        ]
      },
      { 
        id: 'studio', 
        name: 'Studio Portrait (Студийный портрет)', 
        description: 'Классический студийный свет',
        images: [
          'https://i.postimg.cc/cLmvZ8WG/1.4._Studio_Portpaite_1.png',
          'https://i.postimg.cc/wjH1SQC9/1.4._Studio_Portpaite_2.png',
          'https://i.postimg.cc/4x5YZhGT/1.4._Studio_Portpaite_3.png'
        ]
      },
      { 
        id: 'bw', 
        name: 'Black & White (Черно-белый)', 
        description: 'Глубокий черно-белый контраст',
        images: [
          'https://i.postimg.cc/bwCq308n/1.5._Black&White_1.png',
          'https://i.postimg.cc/mgXT83Rw/1.5._Black&White_2.png',
          'https://i.postimg.cc/7Zsqm1DN/1.5._Black&White_3.png'
        ]
      }
    ]
  },
  {
    title: '🔹 Винтажные и ретро стили',
    description: 'Эстетика прошлых эпох и стилизации под ретро',
    items: [
      { 
        id: 'retro', 
        name: 'Retro (Ретро)', 
        description: 'Яркие 70-80-е года',
        images: [
          'https://i.postimg.cc/xCXZ5Qdv/2.1._Retro_1.png',
          'https://i.postimg.cc/G24fKRpJ/2.1._Retro_2.png',
          'https://i.postimg.cc/ZRWQHmqL/2.1._Retro_3.png'
        ]
      },
      { 
        id: 'vintage', 
        name: 'Vintage (Винтажный)', 
        description: 'Эстетика начала XX века',
        images: [
          'https://i.postimg.cc/Bt9pDhNz/2.2._Vintage_1.png',
          'https://i.postimg.cc/23RGvHTJ/2.2._Vintage_2.png',
          'https://i.postimg.cc/QVGm56S2/2.2._Vintage_3.png'
        ]
      },
      { 
        id: 'artdeco', 
        name: 'Art Deco (Арт-деко)', 
        description: 'Роскошь и геометрия 20-х',
        images: [
          'https://i.postimg.cc/NFTVW2n5/2.3._Art_Deco_1.png',
          'https://i.postimg.cc/50DT7Ssx/2.3._Art_Deco_2.png',
          'https://i.postimg.cc/pT34GJsx/2.3._Art_Deco_3.png'
        ]
      },
      { 
        id: 'neonoir', 
        name: 'Neo Noir (Нео-нуар)', 
        description: 'Мрачная эстетика ночного города',
        images: [
          'https://i.postimg.cc/3JwYcYj6/2.4._Neo_Noir_1.png',
          'https://i.postimg.cc/sD2sNsPt/2.4._Neo_Noir_3.png',
          'https://i.postimg.cc/DyznMnQ9/2.4._Neo_Noir_3.png'
        ]
      }
    ]
  },
  {
    title: '🔹 Художественные стили',
    description: 'Картины, иллюстрации и арт-обработка',
    items: [
      { 
        id: 'watercolor', 
        name: 'Watercolor (Акварель)', 
        description: 'Нежные акварельные переливы',
        images: [
          'https://i.postimg.cc/SRQvTQ9N/3.1._Акварель_1.png',
          'https://i.postimg.cc/cC1b913W/3.1._Акварель_2.png',
          'https://i.postimg.cc/5y9R79z9/3.1._Акварель_3.png'
        ]
      },
      { 
        id: 'oil', 
        name: 'Oil Painting (Масляная живопись)', 
        description: 'Текстурные мазки масляной краской',
        images: [
          'https://i.postimg.cc/5t4pM4gk/3.2._Маслом_1.png',
          'https://i.postimg.cc/HLY3CYzN/3.2._Маслом_2.png',
          'https://i.postimg.cc/VNf4cfgV/3.2._Маслом_3.png'
        ]
      },
      { 
        id: 'sketch', 
        name: 'Sketch / Pencil (Скетч / Карандаш)', 
        description: 'Карандашный набросок',
        images: [
          'https://i.postimg.cc/9M3kH54T/3.3._Скетч_1.png',
          'https://i.postimg.cc/nz8Wfbs6/3.3._Скетч_2.png',
          'https://i.postimg.cc/d1MfcP7C/3.3._Скетч_3.png'
        ]
      },
      { 
        id: 'manga', 
        name: 'Comic / Manga (Комикс / Манга)', 
        description: 'Стилизация под графические романы',
        images: [
          'https://i.postimg.cc/Vvjj2pxR/3.4._Комик.Манга_1.png',
          'https://i.postimg.cc/7hv3swWQ/3.4._Комик.Манга_2.png',
          'https://i.postimg.cc/1Xppb2kK/3.4._Комик.Манга_3.png'
        ]
      },
      { 
        id: 'surrealism', 
        name: 'Surrealism (Сюрреализм)', 
        description: 'Сюрреалистичные, сказочные образы',
        images: [
          'https://i.postimg.cc/CLzP6x5K/3.5._Сюрреализм_1.png',
          'https://i.postimg.cc/PrP3F5Jr/3.5._Сюрреализм_2.png',
          'https://i.postimg.cc/YqhnyC00/3.5._Сюрреализм_3.png'
        ]
      }
    ]
  },
  {
    title: '🔹 Фантазийные и стилизованные стили',
    description: 'Фэнтези, футуризм и необычные стилизации',
    items: [
      { 
        id: 'fantasy', 
        name: 'Fantasy (Фэнтези)', 
        description: 'Эльфы, магия и рыцари',
        images: [
          'https://i.postimg.cc/QNFsc51G/4.1._Fantasy_1.png',
          'https://i.postimg.cc/wx1HDJLK/4.1._Fantasy_2.png',
          'https://i.postimg.cc/Wpdj0rgv/4.1._Fantasy_3.png'
        ]
      },
      { 
        id: 'scifi', 
        name: 'Sci-Fi (Научная фантастика)', 
        description: 'Технологии будущего',
        images: [
          'https://i.postimg.cc/x88dz4YQ/4.2._Sci-Fi_1.png',
          'https://i.postimg.cc/0j4yd02K/4.2._Sci-Fi_2.png',
          'https://i.postimg.cc/BbbvKVsJ/4.2._Sci-Fi_3.png'
        ]
      },
      { 
        id: 'cyberpunk', 
        name: 'Cyberpunk (Киберпанк)', 
        description: 'Неон и высокие технологии',
        images: [
          'https://i.postimg.cc/VNFGS7D9/4.3._Киберпанк_1.png',
          'https://i.postimg.cc/0NCW6tcw/4.3._Киберпанк_2.png',
          'https://i.postimg.cc/MGYPcsdD/4.3._Киберпанк_3.png'
        ]
      },
      { 
        id: 'steampunk', 
        name: 'Steampunk (Стимпанк)', 
        description: 'Эстетика паровых машин и викторианства',
        images: [
          'https://i.postimg.cc/ZKHKYZhG/4.4._Стимпанк_1.png',
          'https://i.postimg.cc/9FbFXVjs/4.4._Стимпанк_2.png',
          'https://i.postimg.cc/Dy6yfFKt/4.4._Стимпанк_3.png'
        ]
      }
    ]
  },
  {
    title: '🔹 Тематика и окружающая среда',
    description: 'Локации, атмосфера, сюжетные миры',
    items: [
      { 
        id: 'city', 
        name: 'City (Городской)', 
        description: 'Уличные кадры, мегаполис, стиль большого города',
        images: [
          'https://i.postimg.cc/BZyxCgnJ/5.1._Городской_1.png',
          'https://i.postimg.cc/rybS9Jw8/5.1._Городской_2.png',
          'https://i.postimg.cc/jq9zhXSt/5.1._Городской_3.png'
        ]
      },
      { 
        id: 'nature', 
        name: 'Nature (Природа)', 
        description: 'Лес, горы, поле, природный свет',
        images: [
          'https://i.postimg.cc/J4LjghZk/5.2._Природа_1.png',
          'https://i.postimg.cc/fTNYFbmd/5.2._Природа_2.png',
          'https://i.postimg.cc/W4k3TGP0/5.2._Природа_3.png'
        ]
      },
      { 
        id: 'beach', 
        name: 'Beach (Пляжный)', 
        description: 'Летняя атмосфера, солнце, песок и вода',
        images: [
          'https://i.postimg.cc/XvmCgNnv/5.3._Пляж_1.png',
          'https://i.postimg.cc/SK3MGQms/5.3._Пляж_2.png',
          'https://i.postimg.cc/g0nhRLbR/5.3._Пляж_3.png'
        ]
      }
    ]
  },
  {
    title: '🔹 Культурные и этнические стили',
    description: 'Стилизации под традиции, национальные мотивы и образы',
    items: [
      { 
        id: 'slavic', 
        name: 'Slavic (Славянский)', 
        description: 'Славянская эстетика, фольклорные мотивы',
        images: [
          'https://i.postimg.cc/Gtq3qzkL/6.1._Славянский_1.png',
          'https://i.postimg.cc/sxwfwKpD/6.1._Славянский_2.png',
          'https://i.postimg.cc/6qY6Yzd6/6.1._Славянский_3.png'
        ]
      },
      { 
        id: 'asian', 
        name: 'Asian (Азиатский)', 
        description: 'Вдохновение восточными образами и культурой',
        images: [
          'https://i.postimg.cc/hvyg9vBt/6.2._Азия_1.png',
          'https://i.postimg.cc/cC9ZQCS4/6.2._Азия_2.png',
          'https://i.postimg.cc/hvyg9vBG/6.2._Азия_3.png'
        ]
      },
      { 
        id: 'afro', 
        name: 'Afro (Афро)', 
        description: 'Этнические мотивы, природная фактура и стиль',
        images: [
          'https://i.postimg.cc/ZYVTk7dJ/6.3._Афро_1.png',
          'https://i.postimg.cc/Y2bpcnWr/6.3._Афро_2.png',
          'https://i.postimg.cc/qBjkfb34/6.3._Афро_3.png'
        ]
      },
      { 
        id: 'morocco', 
        name: 'Morocco - Arabic (Морокко)', 
        description: 'Роскошные арабские узоры, магия восточных сказок и пустыни',
        images: [
          'https://i.postimg.cc/7YRwh599/6.4._Морокко_1.png',
          'https://i.postimg.cc/bN5prZgR/6.4._Морокко_2.png',
          'https://i.postimg.cc/65Ptq8c0/6.4._Морокко_3.png'
        ]
      },
      { 
        id: 'india', 
        name: 'India (Индия)', 
        description: 'Яркие сари, традиционные украшения и богатое культурное наследие',
        images: [
          'https://i.postimg.cc/9M1jh0zx/6.5._Индия_1.png',
          'https://i.postimg.cc/8c5gPGrH/6.5._Индия_2.png',
          'https://i.postimg.cc/rmgLkszg/6.5._Индия_3.png'
        ]
      },
      { id: 'custom_ethnic', name: 'Свой этнический стиль', description: 'Опишите ваш уникальный культурный образ' }
    ]
  }
];

export const GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxJKWld6b8djtoy3WPGG30rFnCu-S3tLBzXkYA42kQab_tbJRlAPOw3PIBKLCDIbDzAjA/exec';
