import { BSON } from "mongodb-stitch-browser-sdk";

export default [
  {
    _id: new BSON.ObjectId("5ad84b81b8b998278f773c1b"),
    name: "MyChat",
    owner_id: "2ad84b81q8bf98278f773c1q",
    administrators: ["2ad84b81q8bf98278f773c1q"],
    members: [
      "2ad84b81q8bf98278f773c1q",
      "40391024481629829197",
      "20391029481029849124",
    ],
    messages: [
      {
        ts: 1557351231922,
        from: { id: "40391024481629829197", name: "Jack Example" },
        text: "Wanna meet up with Tim at 8 for dinner?",
      },
      {
        ts: 1557355239361,
        from: { id: "20391029481029849124", name: "Jessica Real" },
        text: "Yeah that works for me!",
      },
      {
        ts: 1557355245967,
        from: { id: "20391029481029849124", name: "Jessica Real" },
        text:
          "What restaurant should we go to? There's a place in the LES that I've wanted to try for a while.",
      },
      {
        ts: 1557355249520,
        from: { id: "40391024481629829197", name: "Jack Example" },
        text: "What kind of food?",
      },
      {
        ts: 1557355255359,
        from: { id: "20391029481029849124", name: "Jessica Real" },
        text: "Mediterranean! Merguez 😍😍😍",
      },
      {
        ts: 1557355259651,
        from: { id: "40391024481629829197", name: "Jack Example" },
        text: "Sounds great lets do it!",
      },
    ],
    isArchived: false,
    isPublic: true,
  },
  {
    _id: new BSON.ObjectId("3af84b81b8b998278f773c1c"),
    name: "Cool Kids Only",
    owner_id: "2ad84b81q8bf93272f773c1q",
    administrators: ["2ad84b81q8bf93272f773c1q"],
    members: [
      "2ad84b81q8bf93272f773c1q",
      "2ad83b81q8bf93272f7732fq",
      "3ad84b81qdbfs3272f773c1f",
      "40384524481629829663",
      "14408029481029889124",
    ],
    messages: [
      {
        ts: 1557351231922,
        from: { id: "40384524481629829663", name: "Janie Grey" },
        text: "Wanna meet up with Tim at 8 for dinner?",
      },
      {
        ts: 9877355239361,
        from: { id: "14408029481029889124", name: "Tom Yorkshire" },
        text: "Yeah that works for me!",
      },
    ],
    isArchived: false,
    isPublic: true,
  },
];
