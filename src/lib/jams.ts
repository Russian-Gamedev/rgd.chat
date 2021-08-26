import type { Jam } from "./types";

export function href(jam: Jam): string {
  return `/jam/${jam.id}`
}

export const jams: Jam[] = [
  {
    id: 'wizard-jam',
    title: 'Wizard Jam — Тема: Вжух и ты петух',
    teaser:
      'У админов наступила ностальгия новогодних джемов, ведь 2020 мы пропустили, пусть вьюга станет нашим путеводом!',
    thumbnail: 'https://xshxhmntnugvfztasqwt.supabase.in/storage/v1/object/public/images/placeholder-banner.jpg',
    thumbnailAlt: 'Анонс джема зимнего сезона 2020–21 года'
  },
  {
    id: 'army-jam',
    title: 'Армейский джем — Тема: Война это искуство',
    teaser:
      'Беларус, локальный мем, и просто ненавистник тумбочек - Даня. В честь его отхода в армию этот джем!',
    thumbnail: 'https://img.youtube.com/vi/oklfZebbDsU/maxresdefault.jpg',
    thumbnailAlt: 'Анонс джема осеннего сезона 2020 года'
  },
  {
    id: 'letniy-jam-2020',
    title: 'Летний Джем 2020 — Тема: Сам себе враг',
    teaser:
      'Привыкшие к новой реальности и даже уже немного отдохнувшие админы решили, что расслаблятся рано и пора ебошить джем!',
    thumbnail: 'https://img.youtube.com/vi/imZXyNb1UIM/maxresdefault.jpg',
    thumbnailAlt: 'Анонс джема летного сезона 2020 года'
  },
  {
    id: 'karantin-jam',
    title: 'Карантин Джем — Тема: Все вверх дном',
    teaser:
      'Внезапно ёбанул карантин и кризис, но гд\'шники не стали унывать и стартанули новый перевёрнутый джем!',
    thumbnail: 'https://img.youtube.com/vi/lcv0BvLuMdE/maxresdefault.jpg',
    thumbnailAlt: 'Анонс джема весеннего сезона 2020 года'
  },
  {
    id: 'kojima-jam',
    title: 'KOJIMA-ДЖЕМ — Тема: HIDEOKOJIMA GAME',
    teaser:
      'Админы копили с обедов, воровали, попрошайничали на конфэ джиди (э фэйерли комьюнити оф гейм девелопмент) и всё-таки накопили на джем!',
    thumbnail: 'https://img.youtube.com/vi/f5w1S53cvQU/maxresdefault.jpg',
    thumbnailAlt: 'Анонс джема осеннего сезона 2019 года'
  }
];
