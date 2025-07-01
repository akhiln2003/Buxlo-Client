import React from "react";
import { Button } from "./button";

 export const PageNation = ({
  pageNationData,
  fetchUserData,
  setpageNationData
}: {
  pageNationData: { pageNum: number; totalPages: number };
  fetchUserData:(page: number , select?:string , searchData?:string) => Promise<void>;
  setpageNationData:React.Dispatch<React.SetStateAction<{ pageNum: number; totalPages: number }>>;
}) => {
  return (
<div
  className={`${
    pageNationData.totalPages > 1
      ? "w-2/12 min-h-full max-h-full flex justify-between items-center rounded-s bg-zinc-200 dark:bg-zinc-800 p-1"
      : "w-2/12 min-h-full max-h-full flex justify-center items-center rounded-s bg-zinc-200 dark:bg-zinc-800 p-1"
  }`}
>
      {/* Prev Button */}
      {pageNationData.pageNum > 1 && (
        <Button
          className="p-[0.5rem] bg-zinc-600 dark:bg-zinc-200 rounded-sm"
          onClick={() => {
            setpageNationData((prev) => ({
              ...prev,
              pageNum: prev.pageNum - 1,
            }));
            fetchUserData(pageNationData.pageNum - 1);
          }}
        >
          Prev
        </Button>
      )}

      {/* Page Numbers */}
      {Array.from({ length: 3 }, (_, i) => {
        const page =
          Math.max(
            1,
            Math.min(
              pageNationData.totalPages - 2, // Ensures last pages are visible
              pageNationData.pageNum - 1
            )
          ) + i;

        return page <= pageNationData.totalPages ? (
          <h3
            key={page}
            className={`px-2 cursor-pointer ${
              page === pageNationData.pageNum ? "font-bold text-blue-500" : ""
            }`}
            onClick={() => {
              setpageNationData((prev) => ({
                ...prev,
                pageNum: page,
              }));
              fetchUserData(page);
            }}
          >
            {page}
          </h3>
        ) : null;
      })}

      {/* Next Button */}
      {pageNationData.pageNum < pageNationData.totalPages && (
        <Button
          className="p-[0.5rem] bg-zinc-600 dark:bg-zinc-200 rounded-sm"
          onClick={() => {
            setpageNationData((prev) => ({
              ...prev,
              pageNum: prev.pageNum + 1,
            }));
            fetchUserData(pageNationData.pageNum + 1);
          }}
        >
          Next
        </Button>
      )}
    </div>
  );
};

