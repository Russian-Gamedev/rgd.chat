export type Collections = {
  user: User;
  patron: Patron;
};

export type Patron = {
  amount: number;
  user: User;
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  banner: string | null;
  banner_alt: string | null;
  banner_color: string;
};
