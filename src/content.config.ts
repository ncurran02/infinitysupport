import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const team = defineCollection({
    loader: glob({pattern: '**/*.md', base: './src/content/team'}),
    schema: z.object({
        name: z.string(),
        title: z.string(),
        image: z.string(),
        orderId: z.number(),
    }),
});

export const collections = {
    team,
}