export const Preview = () => {
  return (
    <div className="flex justify-center px-2 pt-12  lg:pt-16">
      <figure>
        <a
          href="/schema/store"
          className="hidden rounded-lg border-4  border-neutral-100 bg-neutral-900 shadow-[0px_-24px_300px_0px_rgba(69,105,194,0.3)] transition hover:shadow-[0px_-24px_150px_0px_rgba(69,105,194,0.5)] dark:block dark:border-neutral-900 md:border-[10px]"
          title="Click to try it out"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            width="1200px"
            poster="/images/poster-dark.png"
          >
            <source src={`/videos/Preview-Dark.mp4`} type="video/mp4" />
            You need a browser that supports HTML5 video to view this video.
          </video>
        </a>
      </figure>

      <figure>
        <a
          href="/schema/store"
          className="block rounded-lg border-4  border-neutral-100 bg-neutral-900 shadow-[0px_-24px_300px_0px_rgba(69,105,194,0.3)] transition hover:shadow-[0px_-24px_150px_0px_rgba(69,105,194,0.5)] dark:hidden dark:border-neutral-900 md:block md:border-[10px]"
          title="Click to try it out"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            width="1200px"
            poster="/images/poster-light.png"
          >
            <source src={`/videos/Preview-Light.mp4`} type="video/mp4" />
            You need a browser that supports HTML5 video to view this video.
          </video>
        </a>
      </figure>
    </div>
  );
};
