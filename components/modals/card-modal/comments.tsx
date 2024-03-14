"use client";

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";

import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
// import { db } from "@/lib/db"
import { Prisma, Comment, PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";
import { createComment } from "@/actions/create-comment";



interface CommentsProps {
  cardId: string,
  data: Comment[]
};

export const Comments = ({data, cardId}: CommentsProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);



const { execute, fieldErrors } = useAction(createComment, {
  onSuccess: (result) => {
    console.log("1")
    queryClient.invalidateQueries({
      queryKey: ["comment", result.cardId],
    });
    queryClient.invalidateQueries({
      queryKey: ["card-logs", result.cardId]
    });
    toast.success(`Comment "${result.comment}" Created`);
    disableEditing();
  },
  onError: (error) => {
    console.log("2")
    toast.error(error);
  },
  onComplete: () => {
    console.log("3");
  }
});

const boardId = params.boardId as string;
const onSubmit = (formData: FormData) => {
  const comment = formData.get("text") as string;

  execute({
    comment,
    cardId: cardId
  })

}


  return (
    // <div className="flex items-start gap-x-3 w-full">
    //   <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
    //   <div className="w-full">
    //     <p className="font-semibold text-neutral-700 mb-2">
    //       Comments
    //     </p>  
    //     {isEditing ? (
    //        <form
    //        action={onSubmit}
    //        ref={formRef}
    //       onError={() => console.log(fieldErrors)}
           
    //        className="space-y-2"
    //      >
    //        <textarea
    //          id="text"
    //          name="text"
    //          className="w-full mt-2"
    //          placeholder="Add a more detailed description"
             
    //          ref={textareaRef}
    //        />
    //        <div className="flex items-center gap-x-2">
    //          <FormSubmit>
    //            Save
    //          </FormSubmit>
    //          <Button
    //            type="button"
    //            onClick={disableEditing}
    //            size="sm"
    //            variant="ghost"
    //          >
    //            Cancel
    //          </Button>
    //        </div>
    //      </form>

    //     ) : (
    //       <div
    //         onClick={enableEditing}
    //         role="button"
    //         className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
    //       >
    //         {"Add a more detailed description..."}
    //       </div>
    //     )}
    //     {/* <ol className="mt-2 space-y-4">
    //       {items.map((item) => (
    //         <p>{item.comment}</p>
    //       ))}
    //     </ol> */}
    //   </div>
    // </div>


    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">
          Comment
        </p>
        {isEditing ? (
          <form
            action={onSubmit}
            ref={formRef}
            className="space-y-2"
          >
            <FormTextarea
              id="text"
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              
              errors={fieldErrors}
              ref={textareaRef}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>
                Save
              </FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {"Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Comments.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};


