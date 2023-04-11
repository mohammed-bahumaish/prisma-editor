import { useState, type ReactElement } from "react";
import { shallow } from "zustand/shallow";
import { createSchemaStore } from "~/components/store/schemaStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import AddEnumFieldForm from "./add-enum-field-form";

const AddOrUpdateEnumFieldDialog = ({
  children,
  model,
  field,
}: {
  children: ReactElement;
  model: string;
  field?: string;
}) => {
  const { addEnumField, removeEnumField, updateEnumField } = createSchemaStore(
    (state) => ({
      removeEnumField: state.removeEnumField,
      addEnumField: state.addEnumField,
      updateEnumField: state.updateEnumField,
      dmmf: state.dmmf,
    }),
    shallow
  );

  const [open, setOpen] = useState(false);

  const handleAdd = ({ fieldName }: { fieldName: string }) => {
    if (field) {
      void updateEnumField(model, fieldName, field);
    } else void addEnumField(model, fieldName);
    setOpen(false);
  };

  const handleRemove = () => {
    if (field) void removeEnumField(model, field);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {field ? `Update ${field} in ${model}` : `Add field to ${model}`}
          </DialogTitle>
          <AddEnumFieldForm
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            initialName={field}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrUpdateEnumFieldDialog;
