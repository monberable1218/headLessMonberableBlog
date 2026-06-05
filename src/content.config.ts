import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';


import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
});

// microCMSのコンテンツローダー
const microCMSLoader = (endpoint: string) => {
  return async () => {
    try {
      console.log(`microCMSから${endpoint}データを取得中...`);
      const response = await client.getAllContents({endpoint});
      console.log(`${response.length}件の${endpoint}を取得しました`);
      return response;

    } catch (error) {
        console.error(`microCMSからの${endpoint}取得に失敗:`, error);
        return [];
    }
  };
};

// ブログのフィールド
const blogMicroCMSDateFields = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
  image: z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    alt: z.string().optional(),
  }),
  category: z.object({
    name: z.string(),
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    revisedAt: z.string(),
  }),
  meta: z.object({
    fieldId: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.object({
      url: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional(),
    }).optional(),
  }),
};

// ブログコレクションの定義
const blogCollection = defineCollection({
  loader: microCMSLoader('blogs'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    ...blogMicroCMSDateFields,
  }),
});


// お知らせのフィールド
const newsMicroCMSDateFields = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
  category: z.object({
    name: z.string(),
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    revisedAt: z.string(),
  }),
  meta: z.object({
    fieldId: z.string(),
    title: z.string(),
    description: z.string(),
  }),
};

// お知らせコレクションの定義
const newsCollection = defineCollection({
  loader: microCMSLoader('news'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    ...newsMicroCMSDateFields,
  }),
});


export const collections = {
  "blog": blogCollection,
  "news": newsCollection,
};