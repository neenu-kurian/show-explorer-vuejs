import { z } from "zod";

export const ImageSchema = z.object({
  medium: z.string().optional(),
  original: z.string().optional(),
});

export const ShowDtoSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  genres: z
    .array(z.string().nullable().catch(null))
    .transform((items) => items.filter((item): item is string => item !== null))
    .catch([]),
  status: z.string().catch("Unknown"),
  runtime: z.number().nullable().catch(null),
  premiered: z.string().nullable().catch(null),
  rating: z.object({ average: z.number().nullable().catch(null) }).catch({ average: null }),
  image: ImageSchema.nullable().catch(null),
  summary: z.string().nullable().catch(null),
});

export const ShowListDtoSchema = z
  .array(ShowDtoSchema.nullable().catch(null))
  .transform((items) =>
    items.filter((item): item is z.infer<typeof ShowDtoSchema> => item !== null),
  );

export const CastMemberDtoSchema = z.object({
  person: z.object({
    id: z.number(),
    name: z.string(),
    image: ImageSchema.nullable().catch(null),
  }),
  character: z.object({
    id: z.number(),
    name: z.string().optional(),
  }),
});

export const CastListDtoSchema = z
  .array(CastMemberDtoSchema.nullable().catch(null))
  .transform((items) =>
    items.filter((item): item is z.infer<typeof CastMemberDtoSchema> => item !== null),
  );

export const SearchResultDtoSchema = z.object({
  score: z.number().catch(0),
  show: ShowDtoSchema,
});

export const SearchResultListDtoSchema = z
  .array(SearchResultDtoSchema.nullable().catch(null))
  .transform((items) =>
    items.filter((item): item is z.infer<typeof SearchResultDtoSchema> => item !== null),
  );
