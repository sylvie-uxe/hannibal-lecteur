import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/blog",
        defaultItem: () => ({
          pubDatetime: new Date(),
          tags: [],
        }),
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              return `${values?.title
                // Need to handle the French characters
                ?.replace(/[^a-zA-Z0-9àâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]/g, '')
                .toLowerCase()
                // But don't want them in the filename, URL or slug
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-')
                }`
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            label: "Draft",
            name: "draft",
            type: "boolean",
          },
          {
            label: "Description",
            name: "description",
            type: "string",
            required: true,
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            list: true,
          },
          {
            label: "Published Datetime",
            name: "pubDatetime",
            type: "datetime",
            required: true,
          },
          {
            label: "Modified Datetime",
            name: "modDatetime",
            type: "datetime",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ['fra'],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },
});
