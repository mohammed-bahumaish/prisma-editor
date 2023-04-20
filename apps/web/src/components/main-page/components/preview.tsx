/* eslint-disable @next/next/no-img-element */

export const Preview = () => {
  return (
    <div className="flex justify-center px-2 pt-12  lg:pt-16">
      <a
        href="/schema/store"
        className="hidden rounded-lg border-4  border-neutral-100 bg-neutral-900 shadow-[0px_-24px_300px_0px_rgba(69,105,194,0.3)] transition hover:shadow-[0px_-24px_150px_0px_rgba(69,105,194,0.5)] dark:block dark:border-neutral-900 md:border-[10px]"
        title="Click to try it out"
      >
        <img
          src="/images/preview-dark.webp"
          alt="preview"
          className="h-auto w-[800px]"
        />
      </a>

      <a
        href="/schema/store"
        className="block rounded-lg border-4  border-neutral-100 bg-neutral-900 shadow-[0px_-24px_300px_0px_rgba(69,105,194,0.3)] transition hover:shadow-[0px_-24px_150px_0px_rgba(69,105,194,0.5)] dark:hidden dark:border-neutral-900 md:block md:border-[10px]"
        title="Click to try it out"
      >
        <img
          src="/images/preview-light.webp"
          alt="preview"
          className="h-auto w-[800px]"
        />
      </a>
    </div>
  );
};
