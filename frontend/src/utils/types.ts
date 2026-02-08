export type PictureItem = {
  file: File;
  url: string;
};

export type ChatItem = {
  id: number;
  name: string;
  image: string;
  status: string;
  messages: { from: string; message: string }[];
};
