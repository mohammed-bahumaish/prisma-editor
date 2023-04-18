import { useState } from "react";
import { shallow } from "zustand/shallow";
import {
  useSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type ModelNodeData } from "../util/types";
import AddModelFieldForm from "./add-model-field-form";

const AddOrUpdateModelFieldDialogContent = ({
  model,
  field,
  onAdded,
}: {
  model: string;
  field?: ModelNodeData["columns"][0];
  onAdded: () => void;
}) => {
  const [oldName] = useState(field?.name);
  const { addDmmfField, updateDmmfField } = useSchemaStore()(
    (state) => ({
      addDmmfField: state.addDmmfField,
      updateDmmfField: state.updateDmmfField,
      dmmf: state.dmmf,
    }),
    shallow
  );

  const handleAdd = (data: addFieldProps) => {
    if (oldName) {
      void updateDmmfField(model, oldName, data);
    } else void addDmmfField(model, data);
    onAdded();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {field ? `Update ${field.name} in ${model}` : `Add field to ${model}`}
        </DialogTitle>

        <AddModelFieldForm
          handleAdd={handleAdd}
          initialValues={field}
          model={model}
        />
      </DialogHeader>
    </DialogContent>
  );
};

export default AddOrUpdateModelFieldDialogContent;
