import { useState } from "react";

export function useSearch<Value>(
  values: Value[],
  callbackFn: (value: Value) => any
) {
  const [search, setSearch] = useState<string>("");

  const [searchedValues, setSearchedValues] = useState<Value[]>([...values]);

  function handleSearch() {
    if (!search) return setSearchedValues([...values]);

    const filteredValues = filterValues();

    setSearchedValues(filteredValues);
  }

  function filterValues(): Value[] {
    return values.filter(callbackFn);
  }

  return { values: searchedValues, handleSearch, search, setSearch };
}
