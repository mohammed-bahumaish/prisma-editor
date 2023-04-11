import { useState, type ReactNode } from "react";
import { shallow } from "zustand/shallow";
import {
  createSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type ModelNodeData } from "../util/types";
import AddModelFieldForm from "./add-model-field-form";

const AddOrUpdateModelFieldDialog = ({
  model,
  field,
  children,
}: {
  model: string;
  field?: ModelNodeData["columns"][0];
  children: ReactNode;
}) => {
  const [oldName] = useState(field?.name);
  const { addDmmfField, removeDmmfField, updateDmmfField } = createSchemaStore(
    (state) => ({
      removeDmmfField: state.removeDmmfField,
      addDmmfField: state.addDmmfField,
      updateDmmfField: state.updateDmmfField,
      dmmf: state.dmmf,
    }),
    shallow
  );

  const [open, setOpen] = useState(false);

  const handleAdd = (data: addFieldProps) => {
    if (oldName) {
      void updateDmmfField(model, oldName, data);
    } else void addDmmfField(model, data);
    setOpen(false);
  };

  const handleRemove = () => {
    if (field?.name) void removeDmmfField(model, field.name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {field
              ? `Update ${field.name} in ${model}`
              : `Add field to ${model}`}
          </DialogTitle>

          <AddModelFieldForm
            handleAdd={handleAdd}
            initialValues={field}
            handleRemove={handleRemove}
            model={model}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrUpdateModelFieldDialog;
