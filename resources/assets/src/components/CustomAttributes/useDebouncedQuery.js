import { useEffect, useState } from "react";
import { useFetch } from "../../api/api";

export default function useDebouncedQuery(endpoint, params, onMissingQuery) {
  const [init, setInit] = useState(true);

  const key = endpoint ? ["get", endpoint, JSON.stringify(params)] : null;

  const { data, revalidate, loading } = useFetch(key, {
    initialData: { data: [] },
  });

  const items = data?.data || [];
  //*
  useEffect(() => {
    if (items.length > 0 && params?.set) {
      onMissingQuery(items);
    }
  }, [items]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (init && items.length > 0) return;
      revalidate();
      setInit(false);
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [endpoint, params]);

  return { items, loading };
}

/*
add key 'set': [*ids] to params obj to fetch missing items
*/
