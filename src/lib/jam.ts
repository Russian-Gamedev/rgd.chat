export type Jam = {
  id: string;
  title: string;
  teaser: string;
  date: string;
  budget: number;
  thumbnail: string;
  thumbnailAlt: string;
}

export function href(jam: Jam): string {
  return `/jam/${jam.id}`
}