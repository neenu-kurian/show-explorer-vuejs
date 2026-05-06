import type { CastMember } from "./cast";
import type { Result } from "./result";
import type { Show } from "./show";

export type ShowEntry = {
  show: Result<Show>;
  cast: Result<CastMember[]> | null;
};
