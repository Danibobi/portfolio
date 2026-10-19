export interface RecordPhoto {
  src: string;
  alt: string;
  objectPosition?: string;
}

export type RecordCoverMedia =
  | { type: "image"; image: RecordPhoto }
  | { type: "collage"; images: RecordPhoto[]; featuredIndex?: number }
  | { type: "video"; src: string; poster: string; caption: string };

export interface RecordItem {
  id: string;
  archiveNumber: string;
  artist: string;
  title: string;
  displayTitle: string;
  period: string;
  description: string;
  highlights: string[];
  backgroundColor: string;
  backgroundText: string;
  vinylImage: string;
  coverMedia: RecordCoverMedia;
  accentColor: string;
  audioSrc?: string;
  linkLabel?: string;
  linkUrl?: string;
}

export const records: RecordItem[] = [
  {
    id: "school",
    archiveNumber: "01",
    artist: "Österreichische Schule Budapest",
    title: "School & Leadership",
    displayTitle: "SCHOOL & LEADERSHIP",
    period: "Budapest · 2024–2025",
    description:
      "Academic focus paired with student leadership—building communities, taking responsibility, and learning how to turn ideas into organized action.",
    highlights: [
      "4.0 GPA · 94 average",
      "President of the Finance Club",
      "Class President · 2024/25",
    ],
    backgroundColor: "#174f91",
    backgroundText: "ÖSB\nBUD",
    vinylImage: "/records/school-blue.svg",
    coverMedia: {
      type: "image",
      image: {
        src: "/media/records/school/business-club.webp",
        alt: "Business Society Pitch Day poster",
        objectPosition: "center",
      },
    },
    accentColor: "#efc84a",
  },
  {
    id: "internships",
    archiveNumber: "02",
    artist: "ImagiLab × Concorde",
    title: "Internships",
    displayTitle: "INTERNSHIPS",
    period: "Budapest · 2025",
    description:
      "Two very different operating environments—AI automation and finance—connected by research, analysis, and a bias toward useful execution.",
    highlights: [
      "ImagiLab · AI Automation & Research Intern",
      "Helped develop an AI course and automate outreach",
      "Summer 2025 · three-month internship",
      "Concorde Hedge Fund · Finance Intern",
      "Investment research and analysis",
    ],
    backgroundColor: "#bb4d2f",
    backgroundText: "AI\nFIN",
    vinylImage: "/records/internships-orange.svg",
    coverMedia: {
      type: "image",
      image: {
        src: "/media/records/internships/internship.webp",
        alt: "Daniel heading to his internship",
        objectPosition: "center 38%",
      },
    },
    accentColor: "#ffd36a",
  },
  {
    id: "assist-exchange",
    archiveNumber: "03",
    artist: "ASSIST × Indian Springs",
    title: "Exchange Year",
    displayTitle: "EXCHANGE YEAR",
    period: "United States",
    description:
      "A selective international exchange year built around cultural immersion, adapting quickly, and contributing to a new school community.",
    highlights: [
      "Selected for the competitive ASSIST U.S. exchange program",
      "Studied at Indian Springs School",
      "Varsity soccer",
    ],
    backgroundColor: "#99333b",
    backgroundText: "US\nYEAR",
    vinylImage: "/records/exchange-red.svg",
    coverMedia: {
      type: "collage",
      images: [
        {
          src: "/media/records/exchange/assist-group.webp",
          alt: "ASSIST exchange students together at the airport",
          objectPosition: "center",
        },
        {
          src: "/media/records/exchange/auburn-game.webp",
          alt: "Auburn football game during the exchange year",
          objectPosition: "center 65%",
        },
        {
          src: "/media/records/exchange/pickleball.webp",
          alt: "Pickleball court and paddle during the exchange year",
          objectPosition: "center",
        },
      ],
      featuredIndex: 0,
    },
    accentColor: "#f0e3ae",
  },
  {
    id: "side-projects",
    archiveNumber: "04",
    artist: "Built Outside the Classroom",
    title: "Side Projects",
    displayTitle: "SIDE PROJECTS",
    period: "Experiments · Communities · Markets",
    description:
      "A portfolio of attempts: some became communities, some generated revenue, some did not find traction—and every one sharpened my judgment as a builder.",
    highlights: [
      "Founder & President of Founders Circle · 50+ members",
      "Sneaker reselling business · $10K+ revenue",
      "Luna University · 500+ beta users and three Hungarian schools signed",
      "Global Shapers member · contributing to an active community project",
      "Trading agent and investing · 75%+ average yearly return across four consecutive years",
    ],
    backgroundColor: "#26715b",
    backgroundText: "BUILD\n04",
    vinylImage: "/records/projects-green.svg",
    coverMedia: {
      type: "collage",
      images: [
        {
          src: "/media/records/side-projects/founders-circle.webp",
          alt: "Daniel holding the Founders Circle launch poster",
          objectPosition: "center 35%",
        },
        {
          src: "/media/records/side-projects/sneakers.webp",
          alt: "Daniel with a sneaker from his resale business",
          objectPosition: "center 30%",
        },
        {
          src: "/media/records/side-projects/luna.webp",
          alt: "The Luna team after a project presentation",
          objectPosition: "center",
        },
      ],
      featuredIndex: 0,
    },
    accentColor: "#dcf06d",
    linkLabel: "VIEW LUNA",
    linkUrl: "https://luna-university.net",
  },
  {
    id: "cyrcle",
    archiveNumber: "05",
    artist: "Current Project",
    title: "Cyrcle",
    displayTitle: "CYRCLE",
    period: "Now building",
    description:
      "A learning product for UGC creators—teaching content creation and speaking skills that help creators communicate better and grow revenue.",
    highlights: [
      "Content creation education for UGC creators",
      "Speaking training designed for clearer, higher-converting delivery",
      "Focused on turning communication skills into creator revenue",
    ],
    backgroundColor: "#214fc6",
    backgroundText: "CYR\nCLE",
    vinylImage: "/records/cyrcle-king-blue.svg",
    coverMedia: {
      type: "video",
      src: "/media/cyrcle-teaser-v8.mp4",
      poster: "/covers/cyrcle.svg",
      caption: "CYRCLE · DEMO FILM",
    },
    accentColor: "#f4e45e",
  },
  {
    id: "podcast",
    archiveNumber: "06",
    artist: "Conversations & Mentors",
    title: "Podcast",
    displayTitle: "THE PODCAST",
    period: "30+ episodes",
    description:
      "A completed chapter that taught me how to ask better questions, tell stories, and build relationships through long-form conversations.",
    highlights: [
      "Produced more than 30 episodes",
      "Reached 10K+ people across platforms",
      "Built a network of 20+ mentors",
      "Shut the show down after completing its run",
    ],
    backgroundColor: "#0a8582",
    backgroundText: "30+\nEP",
    vinylImage: "/records/podcast-teal.svg",
    coverMedia: {
      type: "collage",
      images: [
        { src: "/media/records/podcast/podcast-01.webp", alt: "Podcast recording with the Giggle team", objectPosition: "center 48%" },
        { src: "/media/records/podcast/podcast-02.webp", alt: "Podcast guest portrait in front of red artwork", objectPosition: "center 38%" },
        { src: "/media/records/podcast/podcast-03.webp", alt: "Podcast guest at Engame Academy", objectPosition: "center 58%" },
        { src: "/media/records/podcast/podcast-04.webp", alt: "Podcast conversation recorded on stage", objectPosition: "center" },
        { src: "/media/records/podcast/podcast-05.webp", alt: "Wide view of a live podcast recording", objectPosition: "center" },
        { src: "/media/records/podcast/podcast-06.webp", alt: "Outdoor podcast recording with a guest", objectPosition: "center 58%" },
        { src: "/media/records/podcast/podcast-07.webp", alt: "Podcast guest portrait at the recording table", objectPosition: "center 40%" },
        { src: "/media/records/podcast/podcast-08.webp", alt: "Podcast selfie beside a studio microphone", objectPosition: "center 38%" },
        { src: "/media/records/podcast/podcast-09.webp", alt: "Podcast guest portrait beside red artwork", objectPosition: "center 40%" },
        { src: "/media/records/podcast/podcast-10.webp", alt: "Podcast recording in a studio with a green wall", objectPosition: "center" },
      ],
      featuredIndex: 0,
    },
    accentColor: "#f1d6bd",
  },
  {
    id: "hackathons",
    archiveNumber: "07",
    artist: "Build Under Pressure",
    title: "Hackathons",
    displayTitle: "HACKATHONS",
    period: "Four finalist finishes",
    description:
      "Short timelines, unfamiliar teams, and public demos—the environments where decisive prototyping and clear storytelling matter most.",
    highlights: [
      "1st place · AI Budapest Hackathon",
      "2nd place · PwC Hackathon",
      "2nd place · Econverse × Engame Startup Challenge",
      "Finalist · EdisonKids × Samsung",
    ],
    backgroundColor: "#d1ad28",
    backgroundText: "1ST\n07",
    vinylImage: "/records/hackathons-yellow.svg",
    coverMedia: {
      type: "collage",
      images: [
        {
          src: "/media/records/hackathons/ai-budapest.webp",
          alt: "Daniel receiving first place at the AI Budapest Hackathon",
          objectPosition: "center",
        },
        {
          src: "/media/records/hackathons/pwc-hackathon.webp",
          alt: "Daniel and teammates receiving second place at the PwC AI Hackathon",
          objectPosition: "center 55%",
        },
      ],
      featuredIndex: 0,
    },
    accentColor: "#1c2320",
  },
];

export function getRecordLeadImage(record: RecordItem) {
  if (record.coverMedia.type === "image") return record.coverMedia.image.src;
  if (record.coverMedia.type === "collage") {
    return record.coverMedia.images[record.coverMedia.featuredIndex ?? 0]?.src;
  }
  return record.coverMedia.poster;
}

export const recordImageSources = records.map((record) => record.vinylImage);
