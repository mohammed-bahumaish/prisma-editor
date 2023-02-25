import { useForm } from "react-hook-form";
import { Fragment, useRef, useState, ReactElement, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function AddFieldModal({
  children,
  onAdd,
  model,
}: {
  children: ReactElement;
  onAdd: (values: any) => void;
  model: string;
}) {
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

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const cancelButtonRef = useRef(null);

  // TODO: add default value fields
  return (
    <div className=" flex items-center">
      <button onClick={() => setOpen(true)}>{children}</button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <form
            onSubmit={handleSubmit((data) => {
              onAdd(data);
              reset();
              setOpen(false);
            })}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-brand-dark blu bg-opacity-75 transition-opacity backdrop-blur-sm" />
              </Transition.Child>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
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
                <div className="inline-block align-bottom bg-brand-darker rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-white"
                      >
                        Add field to {` `} {model}
                      </Dialog.Title>
                      <div className="gap-4 flex flex-col text-start">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-white"
                          >
                            Field Name
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
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
                              className="focus:ring-brand-indigo-1 focus:border-brand-indigo-1 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              placeholder="fieldName"
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
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-indigo-1 focus:border-brand-indigo-1 sm:text-sm rounded-md"
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
                            <div className="relative flex items-start col-span-3">
                              <div className="flex items-center h-5">
                                <input
                                  id="required"
                                  aria-describedby="comments-description"
                                  type="checkbox"
                                  className="focus:ring-brand-indigo-1 h-4 w-4 text-brand-indigo-1 border-gray-300 rounded"
                                  {...register("isRequired")}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="required"
                                  className="font-medium text-white"
                                >
                                  Required
                                </label>
                              </div>
                            </div>
                            <div className="relative flex items-start col-span-3">
                              <div className="flex items-center h-5">
                                <input
                                  id="unique"
                                  aria-describedby="comments-description"
                                  type="checkbox"
                                  className="focus:ring-brand-indigo-1 h-4 w-4 text-brand-indigo-1 border-gray-300 rounded"
                                  {...register("isUnique")}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="unique"
                                  className="font-medium text-white"
                                >
                                  Unique
                                </label>
                              </div>
                            </div>
                            <div className="relative flex items-start col-span-3">
                              <div className="flex items-center h-5">
                                <input
                                  id="list"
                                  aria-describedby="comments-description"
                                  type="checkbox"
                                  className="focus:ring-brand-indigo-1 h-4 w-4 text-brand-indigo-1 border-gray-300 rounded"
                                  {...register("isList")}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="list"
                                  className="font-medium text-white"
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
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-indigo-1 text-base font-medium text-white hover:bg-brand-indigo-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-indigo-1 sm:col-start-2 sm:text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-indigo-1 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>{" "}
          </form>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
