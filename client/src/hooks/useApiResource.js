import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../services/api.js";

export const useApiResource = (path) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(path);
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [path]);
  useEffect(() => { load(); }, [load]);
  return { items, loading, load, setItems };
};
