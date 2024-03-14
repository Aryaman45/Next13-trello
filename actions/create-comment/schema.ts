import { z } from "zod";

export const CreateComment = z.object({
    cardId: z.string(),
    comment: z.string({

    }).min(3, {
        message: "Comment is too short",
    }),

});
