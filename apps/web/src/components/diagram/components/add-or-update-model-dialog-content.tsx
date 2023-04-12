import { useState } from "react";
import { useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const AddOrUpdateModelDialogContent = ({
  model,
  onAdded,
}: {
  model?: string;
  onAdded: () => void;
}) => {
  const [oldName] = useState(model);

  const { addDmmfModel } = createSchemaStore(
    (state) => ({
      addDmmfModel: state.addDmmfModel,
    }),
    shallow
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ model: string }>({
    defaultValues: {
      model: model || "",
    },
  });

  const handleAdd = handleSubmit((data) => {
    void addDmmfModel(data.model, oldName);
    if (!oldName) reset();
    onAdded();
  });
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {model ? `Update ${model} model` : `Add a model`}
        </DialogTitle>

        <form onSubmit={handleAdd}>
          <div className="flex flex-col gap-4 text-start">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Model Name
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  className="focus:ring-brand-indigo-1 focus:border-brand-indigo-1 block w-full rounded-md border-gray-300 pl-10 sm:text-sm"
                  placeholder="User"
                  {...register("model", {
                    required: "Name field is required",
                    pattern: /^[A-Za-z1-9]+$/i,
                  })}
                />
              </div>
              <p className="text-red-500">
                {errors.model?.type === "required" && (
                  <p role="alert">{errors.model?.message as string}</p>
                )}
                {errors.model?.type === "pattern" && (
                  <p role="alert">Invalid</p>
                )}
              </p>
            </div>
          </div>

          <Button type="submit" className="mt-5 w-full">
            {model ? "Update" : "Add"}
          </Button>
        </form>
      </DialogHeader>
    </DialogContent>
  );
};

export default AddOrUpdateModelDialogContent;
