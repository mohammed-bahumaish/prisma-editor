import clsx from "clsx";
import { shallow } from "zustand/shallow";
import { useSchemaStore } from "../store/schemaStore";
import { Icons } from "../ui/icons";
import PrismaEditor from "./prismaEditor";
import SqlEditor from "./sqlEditor";

const CodeEditor = () => {
  const {
    setOpenTab,
    openTab,
    isParseDmmfLoading,
    isParseSchemaLoading,
    isSqlLoading,
  } = useSchemaStore()(
    (state) => ({
      openTab: state.openTab,
      setOpenTab: state.setOpenTab,
      isParseDmmfLoading: state.isParseDmmfLoading,
      isParseSchemaLoading: state.isParseSchemaLoading,
      isSqlLoading: state.isSqlLoading,
    }),
    shallow
  );

  const tab = {
    prisma: <PrismaEditor key="prisma" />,
    sql: <SqlEditor key="sql" />,
  };

  return (
    <div className="h-[calc(100%-36px)] w-full">
      <div className="flex bg-slate-100 text-sm text-gray-100 transition-colors duration-200 dark:bg-slate-800">
        <button
          className={clsx(
            "flex h-full cursor-pointer items-center gap-2 px-4 py-2 transition-colors duration-200",
            openTab === "prisma"
              ? "bg-slate-500 dark:bg-[#1e1e1e]"
              : "bg-slate-400 dark:bg-[#2d2d2d]"
          )}
          onClick={() => {
            setOpenTab("prisma");
          }}
          title="Show Prisma Schema"
        >
          {isParseSchemaLoading || isParseDmmfLoading ? (
            <Icons.spinner />
          ) : (
            <Icons.prisma />
          )}
          <span>prisma.schema</span>
        </button>
        <button
          className={clsx(
            "flex h-full cursor-pointer items-center gap-2 px-4 py-2 transition-colors duration-200",
            openTab === "sql"
              ? "bg-slate-500 dark:bg-[#1e1e1e]"
              : "bg-slate-400 dark:bg-[#2d2d2d]"
          )}
          onClick={() => setOpenTab("sql")}
          title="Show SQL definitions"
        >
          {isSqlLoading ? <Icons.spinner /> : <Icons.database />}
          <span>tables.sql</span>
        </button>
      </div>
      {tab[openTab]}
    </div>
  );
};

export default CodeEditor;
