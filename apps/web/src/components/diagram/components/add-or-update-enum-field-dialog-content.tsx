import { shallow } from "zustand/shallow";
import { useSchemaStore } from "~/components/store/schemaStore";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import AddEnumFieldForm from "./add-enum-field-form";

const AddOrUpdateEnumFieldDialogContent = ({
  model,
  field,
  onAdded,
}: {
  model: string;
  field?: string;
  onAdded: () => void;
}) => {
  const { addEnumField, updateEnumField } = useSchemaStore()(
    (state) => ({
      addEnumField: state.addEnumField,
      updateEnumField: state.updateEnumField,
      dmmf: state.dmmf,
    }),
    shallow
  );

  const handleAdd = ({ fieldName }: { fieldName: string }) => {
    if (field) {
      void updateEnumField(model, fieldName, field);
    } else void addEnumField(model, fieldName);
    onAdded();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {field ? `Update ${field} in ${model}` : `Add field to ${model}`}
        </DialogTitle>
        <AddEnumFieldForm handleAdd={handleAdd} initialName={field} />
      </DialogHeader>
    </DialogContent>
  );
};

export default AddOrUpdateEnumFieldDialogContent;
