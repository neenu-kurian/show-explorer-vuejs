import type { Image } from "./show";

export type CastMember = {
  person: {
    readonly id: number;
    name: string;
    image: Image | null;
  };
  character: {
    readonly id: number;
    name?: string;
  };
};
