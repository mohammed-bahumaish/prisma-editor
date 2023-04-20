export const Preview = () => {
  return (
    <div className="flex justify-center pt-12 lg:pt-16">
      <figure>
        <a
          href="/schema/store"
          className="hidden rounded-lg border-[20px] border-neutral-100 bg-neutral-900 shadow-[0px_-24px_300px_0px_rgba(22,163,148,0.15)] transition hover:shadow-[0px_-24px_150px_0px_rgba(22,163,148,0.3)] dark:block dark:border-neutral-900"
          title="Click to try it out"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            width="1200px"
            poster="https://assets.trpc.io/www/v10/v10-dark-landscape.png"
          >
            <source src={`/videos/Preview-Dark.mp4`} type="video/mp4" />
            You need a browser that supports HTML5 video to view this video.
          </video>
        </a>
      </figure>

      <figure>
        <a
          href="/schema/store"
          className="block rounded-lg border-[20px] border-neutral-100 bg-neutral-900 shadow-[0px_-24px_300px_0px_rgba(22,163,148,0.15)] transition hover:shadow-[0px_-24px_150px_0px_rgba(22,163,148,0.3)] dark:hidden dark:border-neutral-900 md:block"
          title="Click to try it out"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            width="1200px"
            poster="https://assets.trpc.io/www/v10/v10-dark-landscape.png"
          >
            <source src={`/videos/Preview-Light.mp4`} type="video/mp4" />
            You need a browser that supports HTML5 video to view this video.
          </video>
        </a>
      </figure>
    </div>
  );
};
