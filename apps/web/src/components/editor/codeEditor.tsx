import clsx from "clsx";
import { createSchemaStore } from "../store/schemaStore";
import PrismaEditor from "./prismaEditor";
import SqlEditor from "./sqlEditor";

const CodeEditor = () => {
  const { setOpenTab, openTab } = createSchemaStore((state) => ({
    openTab: state.openTab,
    setOpenTab: state.setOpenTab,
  }));

  const tab = {
    prisma: <PrismaEditor />,
    sql: <SqlEditor />,
  };

  return (
    <div className="h-full w-full">
      <div className="flex bg-gray-700/30 text-sm text-gray-100">
        <button
          className={clsx(
            "flex h-full cursor-pointer items-center gap-2 py-2 px-4",
            openTab === "prisma" ? "bg-[#1e1e1e]" : "bg-[#2d2d2d]"
          )}
          onClick={() => {
            setOpenTab("prisma");
          }}
          title="Show Prisma Schema"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M802.474667 762.197333L409.173333 875.52c-12.032 3.456-23.552-6.656-21.034666-18.474667L528.64 201.429333c2.645333-12.245333 20.053333-14.208 25.514667-2.816l260.181333 538.24a18.176 18.176 0 0 1-11.861333 25.301334z m67.413333-26.709333L568.704 112.213333a48.384 48.384 0 0 0-41.173333-26.88 48.170667 48.170667 0 0 0-43.989334 22.272L156.8 623.189333c-10.154667 16.042667-9.941333 35.84 0.554667 51.754667l159.701333 241.024c9.514667 14.378667 26.026667 22.698667 43.136 22.698667 4.864 0 9.770667-0.682667 14.549333-2.048l463.573334-133.546667c14.208-4.138667 25.813333-13.909333 31.914666-26.88 6.058667-12.970667 5.973333-27.818667-0.298666-40.746667z"
              fill="#00BFA5"
            />
          </svg>
          <span>prisma.schema</span>
        </button>
        <button
          className={clsx(
            "flex h-full cursor-pointer items-center gap-2 py-2 px-4",
            openTab === "sql" ? "bg-[#1e1e1e]" : "bg-[#2d2d2d]"
          )}
          onClick={() => setOpenTab("sql")}
          title="Show SQL definitions"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.562,15.256A21.159,21.159,0,0,0,16,16.449a21.159,21.159,0,0,0,7.438-1.194c1.864-.727,2.525-1.535,2.525-2V9.7a10.357,10.357,0,0,1-2.084,1.076A22.293,22.293,0,0,1,16,12.078a22.36,22.36,0,0,1-7.879-1.3A10.28,10.28,0,0,1,6.037,9.7v3.55C6.037,13.724,6.7,14.528,8.562,15.256Z"
              fill="#ffda44"
            />
            <path
              d="M8.562,21.961a15.611,15.611,0,0,0,2.6.741A24.9,24.9,0,0,0,16,23.155a24.9,24.9,0,0,0,4.838-.452,15.614,15.614,0,0,0,2.6-.741c1.864-.727,2.525-1.535,2.525-2v-3.39a10.706,10.706,0,0,1-1.692.825A23.49,23.49,0,0,1,16,18.74a23.49,23.49,0,0,1-8.271-1.348,10.829,10.829,0,0,1-1.692-.825V19.96C6.037,20.426,6.7,21.231,8.562,21.961Z"
              fill="#ffda44"
            />
            <path
              d="M16,30c5.5,0,9.963-1.744,9.963-3.894V23.269a10.5,10.5,0,0,1-1.535.762l-.157.063A23.487,23.487,0,0,1,16,25.445a23.422,23.422,0,0,1-8.271-1.351c-.054-.02-.106-.043-.157-.063a10.5,10.5,0,0,1-1.535-.762v2.837C6.037,28.256,10.5,30,16,30Z"
              fill="#ffda44"
            />
            <ellipse cx="16" cy="5.894" rx="9.963" ry="3.894" fill="#ffda44" />
          </svg>
          <span>tables.sql</span>
        </button>
      </div>
      {tab[openTab]}
    </div>
  );
};

export default CodeEditor;
