import Fuse from "fuse.js";

type Adventure = {
    name: string;
    length: number;
    ascent: number;
    descent: number;
    profile: number[];
};

type Entry = {
    name: string;
    alias?: string[];
    description?: string;
    value: (adventure: Adventure) => string;
    action?: (adventure: Adventure) => void;
}

type EntryKeys = "name" | "alias" | "description";

const list = [
    {
        name: "Name",
        alias: ["Title"],
        value: (adventure: Adventure) => {
            return adventure.name;
        }
    },
    {
        name: "Length",
        alias: ["Size", "Distance"],
        value: (adventure: Adventure) => {
            return adventure.length.toFixed(0) + "m";
        }
    },
    {
        name: "Ascent",
        alias: ["Elevation gain"],
        value: (adventure: Adventure) => {
            return adventure.ascent.toFixed(0) + "m";
        }
    },
    {
        name: "Lowest point",
        value: (adventure: Adventure) => {
            const lowestPoint = Math.min.apply(null, adventure.profile)
            return lowestPoint.toFixed(0) + "m";
        }
    },
    {
        name: "Show adventure",
        alias: ["Fly to", "focus"],
        value: (adventure: Adventure) => {
            const lowestPoint = Math.min.apply(null, adventure.profile)
            return lowestPoint.toFixed(0);
        }
    }
] as Entry[];

const options = {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "name", "alias", "description"
    ] as EntryKeys[]
};

const searchQuery = "Distance";
const fuse = new Fuse(list, options);
const results = (fuse.search(searchQuery) as any[]) as { item: Entry, matches: any[] }[];
const adventure = {
    name: "Day 4 - TMB Intégral. Les Chapieux to Courmayeur",
    length: 20908,
    ascent: 1086,
    descent: 965
} as Adventure;

console.log("Searching properties of: " + adventure.name);
console.log("Search query: " + searchQuery);
console.log("Found results: " + results.length);
console.group("Top match:");
if (results.length) {
    const item = results[0].item;
    const match = results[0].matches[0];
    console.log("Property: " + item.name);
    item.description && console.log(item.description);
    console.log("Matched by: " + match.value + " in Entry." + match.key + (match.key == "alias" ? ("[" + match.arrayIndex + "]") : ""));
    console.log("Value: " + item.value(adventure));
}
console.groupEnd();