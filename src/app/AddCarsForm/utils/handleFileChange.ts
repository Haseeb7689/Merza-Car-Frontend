import React from "react";
import { toast } from "sonner";
import { FormType } from "./../schema/listingFormSchema";
import { UseFormSetValue, UseFormTrigger } from "react-hook-form";

export default function handleFileChange(
  e: React.ChangeEvent<HTMLInputElement>,
  previousFiles: File[],
  setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  limit: number,
  type: keyof FormType,
  setValue?: UseFormSetValue<FormType>,
  trigger?: UseFormTrigger<FormType>
) {
  const files = e.target.files;
  if (!files) return;

  const newFiles = Array.from(files);

  if (type === "attachments") {
    const invalid = newFiles.filter((file) => file.type.startsWith("image/"));
    if (invalid.length > 0) {
      toast.error("Images are not allowed in attachments.");
      return;
    }
  }

  const combined = [...previousFiles, ...newFiles];

  if (combined.length > limit) {
    toast.error(`You can only upload upto ${limit} ${type} images/files`);
    return;
  }
  setFiles(combined);
  setCount(combined.length);

  if (setValue) {
    setValue(type, combined);
  }

  if (trigger) {
    trigger(type);
  }
  e.target.value = "";
}
