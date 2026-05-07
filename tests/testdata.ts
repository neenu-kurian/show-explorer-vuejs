import type { CastMember } from "@/types/cast";
import type { SortOption } from "@/types/components";
import type { Result } from "@/types/result";
import type { ShowSearchResult } from "@/types/search";
import type { CategorizedShows, Show } from "@/types/show";

export const showsByCategory: Result<CategorizedShows> = {
  ok: true,
  data: {
    Music: [
      {
        id: 8,
        name: "Glee",
        genres: ["Drama", "Music", "Romance"],
        status: "Ended",
        rating: { average: 6.7 },
        image: {
          original: "https://static.tvmaze.com/uploads/images/original_untouched/0/73.jpg",
        },
        runtime: 60,
        premiered: "2009-05-19",
        summary:
          "<p><b>Glee </b>is a musical comedy about a group of ambitious and talented young adults in search of strength, acceptance and, ultimately, their voice.</p>",
      },
      {
        id: 53,
        name: "Nashville",
        genres: ["Drama", "Music", "Romance"],
        status: "Ended",
        rating: { average: 7.4 },
        image: {
          original: "https://static.tvmaze.com/uploads/images/original_untouched/89/224913.jpg",
        },
        runtime: 60,
        premiered: "2012-10-10",
        summary:
          "<p><b>Nashville</b> is set against the backdrop of the city's music scene and follows Rayna Jaymes and Juliette Barnes. Both women face personal and professional challenges as they navigate their paths as artists and individuals. Surrounding them, and often complicating their lives, are their family, friends and, in some cases, lovers, as well as the up-and-coming performers and songwriters trying to get ahead in the business. Music City can mean so many things to different people. In Nashville, musicians and songwriters are at the heart of the storm driven by their own ambitions. Some are fueled by their creativity and passion for fame. Others struggle to cope with the pressures of success and are doing everything in their power to stay on top.</p>",
      },
    ],
  },
};

export const rawData: Show[] = [
  {
    id: 8,
    name: "Glee",
    genres: ["Drama", "Music", "Romance"],
    status: "Ended",
    rating: { average: 6.7 },
    image: {
      original: "https://static.tvmaze.com/uploads/images/original_untouched/0/73.jpg",
    },
    runtime: 60,
    premiered: "2009-05-19",
    summary:
      "<p><b>Glee </b>is a musical comedy about a group of ambitious and talented young adults in search of strength, acceptance and, ultimately, their voice.</p>",
  },
  {
    id: 53,
    name: "Nashville",
    genres: ["Drama", "Music", "Romance"],
    status: "Ended",
    rating: { average: 7.4 },
    image: {
      original: "https://static.tvmaze.com/uploads/images/original_untouched/89/224913.jpg",
    },
    runtime: 60,
    premiered: "2012-10-10",
    summary:
      "<p><b>Nashville</b> is set against the backdrop of the city's music scene and follows Rayna Jaymes and Juliette Barnes. Both women face personal and professional challenges as they navigate their paths as artists and individuals. Surrounding them, and often complicating their lives, are their family, friends and, in some cases, lovers, as well as the up-and-coming performers and songwriters trying to get ahead in the business. Music City can mean so many things to different people. In Nashville, musicians and songwriters are at the heart of the storm driven by their own ambitions. Some are fueled by their creativity and passion for fame. Others struggle to cope with the pressures of success and are doing everything in their power to stay on top.</p>",
  },
];

export const showDetails = {
  id: 42,
  name: "The Wire",
  genres: ["Drama", "Crime"],
  status: "Ended",
  runtime: 43,
  premiered: "",
  rating: { average: 8.9 },
  image: {
    medium: "https://static.tvmaze.com/uploads/images/medium_portrait/504/1260189.jpg",
    original: "https://static.tvmaze.com/uploads/images/original_untouched/504/1260189.jpg",
  },
  summary:
    "<p>The first season of <b>The Wire</b> (2002) concentrated on the often-futile efforts of police to infiltrate a West Baltimore drug ring headed by Avon Barksdale and his lieutenant, Stringer Bell. In Seasons Two and Three, as the Barksdale investigation escalated, new storylines involving pressures on the working class and the city's political leadership were introduced. Season Four focused on the stories of several young boys in the public school system, struggling with problems at home and the lure of the corner - set against the rise of a new drug empire in West Baltimore and a new Mayor in City Hall. The fifth and final season of <i>The Wire</i> centers on the media's role in addressing - or failing to address - the fundamental political, economic and social realities depicted over the course of the series, while also resolving storylines of the numerous characters woven throughout the narrative arc of the show.</p>",
};

export const CastMemberProp = {
  person: {
    id: 20082,
    url: "https://www.tvmaze.com/people/20082/sonja-sohn",
    name: "Sonja Sohn",
    image: {
      medium: "https://static.tvmaze.com/uploads/images/medium_portrait/4/10304.jpg",
      original: "https://static.tvmaze.com/uploads/images/original_untouched/4/10304.jpg",
    },
  },
  character: {
    id: 48965,
    url: "https://www.tvmaze.com/characters/48965/the-wire-det-shakima-kima-greggs",
    name: 'Det. Shakima "Kima" Greggs',
  },
};

export const sortOptions: SortOption[] = [
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
];

export const shows = showsByCategory.data.Music || [];

export const searchResults = [
  {
    score: 0.6826869,
    show: {
      id: 65703,
      name: "Fukumen D",
      genres: ["Drama"],
      status: "Ended",
      runtime: 60,
      premiered: null,
      rating: { average: null },
      image: {
        medium: "https://static.tvmaze.com/uploads/images/medium_portrait/434/1086485.jpg",
        original: "https://static.tvmaze.com/uploads/images/original_untouched/434/1086485.jpg",
      },
      summary: null,
    },
  },
  {
    score: 0.667128,
    show: {
      id: 3153,
      name: "Mr. D",
      genres: ["Comedy"],
      status: "Ended",
      runtime: null,
      premiered: null,
      rating: { average: 4.2 },
      image: {
        medium: "https://static.tvmaze.com/uploads/images/medium_portrait/17/43209.jpg",
        original: "https://static.tvmaze.com/uploads/images/original_untouched/17/43209.jpg",
      },
      summary:
        "<p><b>Mr. D</b> is a story about a charming, under-qualified teacher trying to fake his way through a teaching job, just like he often fakes his way through life.</p>",
    },
  },
];

export const mockShow: Show = {
  id: 179,
  name: "The Wire",
  genres: ["Drama", "Crime"],
  status: "Ended",
  runtime: 43,
  premiered: "2002-06-02",
  rating: { average: 8.9 },
  image: {
    medium: "https://example.com/medium.jpg",
    original: "https://example.com/original.jpg",
  },
  summary: "<p>Test summary</p>",
};

export const mockShows: Show[] = [
  {
    id: 1,
    name: "Show A",
    genres: ["Drama"],
    status: "Running",
    runtime: 60,
    premiered: "2020-01-01",
    rating: { average: 8.0 },
    image: null,
    summary: null,
  },
  {
    id: 2,
    name: "Show B",
    genres: ["Drama"],
    status: "Ended",
    runtime: 30,
    premiered: "2019-01-01",
    rating: { average: 6.0 },
    image: null,
    summary: null,
  },
];

export const mockResults: Result<ShowSearchResult[]> = {
  ok: true,
  data: [
    {
      score: 1,
      show: {
        id: 1,
        name: "Test",
        genres: [],
        status: "Running",
        runtime: 30,
        premiered: null,
        rating: { average: 7 },
        image: null,
        summary: null,
      },
    },
  ],
};

export const mockCast: CastMember[] = [
  {
    person: { id: 1, name: "Actor", image: null },
    character: { id: 10, name: "Character" },
  },
];
