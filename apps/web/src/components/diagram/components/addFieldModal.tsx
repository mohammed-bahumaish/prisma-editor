import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useRef, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import {
  type addFieldProps,
  createSchemaStore,
} from "~/components/store/schemaStore";

export default function AddFieldModal({
  children,
  model,
}: {
  children: ReactElement;
  model: string;
}) {
  const addDmmfField = createSchemaStore((state) => state.addDmmfField);

  // TODO: add models' names
  const fieldTypes = useMemo(
    () => [
      "String",
      "Int",
      "Boolean",
      "Float",
      "DateTime",
      "Decimal",
      "BigInt",
      "Bytes",
      "JSON",
    ],
    []
  );

  // addDmmfField(data.name, values)

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addFieldProps>();
  const cancelButtonRef = useRef(null);

  const handleAdd = handleSubmit((data) => {
    void addDmmfField(model, data);
    reset();
    setOpen(false);
  });

  // TODO: add default value fields
  return (
    <div className=" flex items-center">
      <button onClick={() => setOpen(true)}>{children}</button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <form onSubmit={handleAdd}>
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
                        Add field to {` `} {model}
                      </Dialog.Title>
                      <div className="flex flex-col gap-4 text-start">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-white"
                          >
                            Field Name
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
                              placeholder="firstName"
                              {...register("name", {
                                required: "Field name is required",
                                pattern: /^[A-Za-z1-9]+$/i,
                              })}
                            />
                          </div>
                          <p className="text-red-500">
                            {errors.name?.type === "required" && (
                              <p role="alert">
                                {errors.name?.message as string}
                              </p>
                            )}
                            {errors.name?.type === "pattern" && (
                              <p role="alert">Invalid</p>
                            )}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="type"
                            className="block text-sm font-medium text-white"
                          >
                            Type
                          </label>
                          <select
                            id="type"
                            className="focus:ring-brand-indigo-1 focus:border-brand-indigo-1 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                            defaultValue={fieldTypes[0]}
                            {...register("type", { required: true })}
                          >
                            {fieldTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <fieldset className="grid grid-cols-12 gap-2">
                            <div className="relative col-span-3 flex items-start">
                              <div className="flex h-5 items-center ">
                                <input
                                  id="isRequired"
                                  aria-describedby="comments-description"
                                  type="checkbox"
                                  className="focus:ring-brand-indigo-1 text-brand-indigo-1 h-4 w-4 cursor-pointer rounded border-gray-300"
                                  {...register("isRequired")}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="isRequired"
                                  className="cursor-pointer font-medium text-white"
                                >
                                  Required
                                </label>
                              </div>
                            </div>
                            <div className="relative col-span-3 flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="isUnique"
                                  aria-describedby="comments-description"
                                  type="checkbox"
                                  className="focus:ring-brand-indigo-1 text-brand-indigo-1 h-4 w-4 cursor-pointer rounded border-gray-300"
                                  {...register("isUnique")}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="isUnique"
                                  className="cursor-pointer font-medium text-white"
                                >
                                  Unique
                                </label>
                              </div>
                            </div>
                            <div className="relative col-span-3 flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="isList"
                                  aria-describedby="comments-description"
                                  type="checkbox"
                                  className="focus:ring-brand-indigo-1 text-brand-indigo-1 h-4 w-4 cursor-pointer rounded border-gray-300"
                                  {...register("isList")}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="isList"
                                  className="cursor-pointer font-medium text-white"
                                >
                                  List
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="bg-brand-indigo-1 hover:bg-brand-indigo-1 focus:ring-brand-indigo-1 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="focus:ring-brand-indigo-1 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </form>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
