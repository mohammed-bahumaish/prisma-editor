import { Dialog, Transition } from "@headlessui/react";
import { Fragment, memo, useState, type ReactElement } from "react";
import { shallow } from "zustand/shallow";
import { TextInputField } from "~/components/inputFields";
import { createSchemaStore } from "~/components/store/schemaStore";

const AddOrUpdateEnumModal = ({
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
  const [newField, setNewField] = useState(field || "");

  const handleAdd = () => {
    if (field) {
      void updateEnumField(model, newField, field);
    } else void addEnumField(model, newField);
    setOpen(false);
  };

  const handleRemove = () => {
    if (field) void removeEnumField(model, field);
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
                        ? `Update ${field} in ${model}`
                        : `Add field to ${model}`}
                    </Dialog.Title>

                    <div className="text-start">
                      <TextInputField
                        label="Enum name"
                        name="enum"
                        value={newField}
                        onChange={(e) => setNewField(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleAdd()}
                      className="bg-brand-indigo-1 hover:bg-brand-indigo-1 focus:ring-brand-indigo-1 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    >
                      {field ? "Update" : "Add"}
                    </button>
                    {field ? (
                      <button
                        type="button"
                        className="focus:ring-brand-red-1 mt-3 inline-flex w-full justify-center rounded-md border border-gray-800 bg-red-700 px-4 py-2 text-base font-medium text-gray-100 shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => handleRemove()}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="focus:ring-brand-indigo-1 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                    )}
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

export default memo(AddOrUpdateEnumModal);
