import { Dialog, Transition } from "@headlessui/react";
import { Fragment, memo, useState, type ReactElement } from "react";
import {
  createSchemaStore,
  type addFieldProps,
} from "~/components/store/schemaStore";
import { type ModelNodeData } from "../util/types";
import AddFieldForm from "./addFieldForm";

const AddOrUpdateFieldModal = ({
  children,
  model,
  field,
}: {
  children: ReactElement;
  model: string;
  field?: ModelNodeData["columns"][0];
}) => {
  const [oldName] = useState(field?.name);
  const { addDmmfField, removeDmmfField, updateDmmfField } = createSchemaStore(
    (state) => ({
      removeDmmfField: state.removeDmmfField,
      addDmmfField: state.addDmmfField,
      updateDmmfField: state.updateDmmfField,
      dmmf: state.dmmf,
    })
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
  };

  return (
    <div className=" flex items-center">
      <button onClick={() => setOpen(true)}>{children}</button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="bg-brand-dark blu fixed inset-0 bg-opacity-75 backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="bg-brand-darker inline-block transform overflow-hidden rounded-lg px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white"
                    >
                      {field
                        ? `Update ${field.name} in ${model}`
                        : `Add field to ${model}`}
                    </Dialog.Title>

                    <AddFieldForm
                      handleAdd={handleAdd}
                      initialValues={field}
                      handleRemove={handleRemove}
                      setOpen={setOpen}
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default memo(AddOrUpdateFieldModal);
