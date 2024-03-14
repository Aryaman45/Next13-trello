"use server"

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

interface CreateCommentsProps {
  id: string;
  comment: string;
  createdAt:Date;
  updatedAt:Date
};

export async function createcomment(data : CreateCommentsProps) {
    try {
        const { id, comment} = data

        // Create a new comment in the database
        const result = await db.comment.create({
            data: {
                comment: comment,
            }
        });

        // Create an audit log for the newly created comment
        await createAuditLog({
            entityId: result.id,
            entityTitle: result.comment,
            entityType: ENTITY_TYPE.COMMENT, // Assuming you have an entity type for comments
            action: ACTION.CREATE,
        });

        return result; // Return the newly created comment
    } catch (error) {
        console.error("Failed to create comment:", error);
        throw new Error("Failed to create comment.");
    }
}
