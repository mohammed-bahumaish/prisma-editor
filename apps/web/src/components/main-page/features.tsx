import React, { type FC } from "react";
import { Icons } from "../ui/icons";

const features = [
  {
    title: "Real-time visualization",
    description:
      "See your database structures in real-time as you create, modify and maintain them!",
    icon: <Icons.arrowLeftRight className="h-6 w-6" />,
    color: "bg-brand-indigo-2 text-white",
  },
  {
    title: "Direct schema editing",
    description: "Edit your Prisma Schema directly from the graph!",
    icon: <Icons.mouseClick className="h-6 w-6" />,
    color: "bg-brand-teal-2 text-white",
  },
  {
    title: "Share your schema.",
    description: "Share your schema with a link and collaborate!",
    icon: <Icons.share className="h-6 w-6" />,
    color: "bg-brand-light text-white",
  },
  {
    title: "User-friendly interface",
    description: "Intuitive interface for easy schema editing and management!",
    icon: <Icons.happy className="h-6 w-6" />,
    color: "bg-brand-blue text-white",
  },
  {
    title: "SQL generation",
    description: "Automatically generate SQL code for your schema!",
    icon: <Icons.database className="h-6 w-6" />,
    color: "bg-red-800 text-white",
  },
  {
    title: "OpenAI integration",
    description:
      "Use natural language prompts to generate boilerplate schema code with the power of OpenAI's natural language processing API!",
    icon: <Icons.gpt className="h-6 w-6" />,
    color: "bg-brand-darker text-white",
  },
];

export const Features: FC = () => {
  return (
    <section className="container mx-auto max-w-5xl space-y-28 px-6 py-32  ">
      <div className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-3">
        {features.map((feature) => {
          return (
            <div key={feature.title}>
              <div
                className={`${feature.color} mb-3 grid h-12 w-12 place-items-center rounded-xl`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold md:text-xl">{feature.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 md:text-base">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
