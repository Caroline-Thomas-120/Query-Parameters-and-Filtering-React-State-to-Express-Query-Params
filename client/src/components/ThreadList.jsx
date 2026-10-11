
import { useState } from "react";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import { getThreads } from "../services/threads.service";
import SearchBar from "./SearchBar.jsx";
import SortDropdown from "./SortDropdown.jsx";
import { useDebounce } from "../hooks/useDebounce";

export default function ThreadList() {
  // 1. Store the search text and sort order
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // 2. Wait until the user pauses typing for 300ms
  const debouncedSearch = useDebounce(search, 300);

  // 3. Fetch threads using the current filters
  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      "threads",
      { search: debouncedSearch, sort },
    ],
    queryFn: ({ queryKey }) => getThreads(queryKey[1]),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <div className="filters">
        {/* 4. Connect the search box to React state */}
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        {/* 5. Connect the sort dropdown to React state */}
        <SortDropdown
          value={sort}
          onChange={setSort}
        />
      </div>

      {isError && (
        <p className="err">Error: {error.message}</p>
      )}

      {isPending ? (
        <p>Loading threads…</p>
      ) : (
        <ul className="threads">
          {data.map((t) => (
            <li className="card" key={t.id}>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
