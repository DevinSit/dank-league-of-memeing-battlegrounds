import {useEffect, useState} from "react";
import useSWR, {SWRConfiguration, SWRResponse} from "swr";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useFetch = (url: string, options: RequestInit) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url, options);
                const json = await res.json();

                setResponse(json);
            } catch (e: any) {
                setError(e);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {response, error};
};

const useCustomSWR = <D, E = any>(address: string, args?: SWRConfiguration): SWRResponse<D, E> => {
    return useSWR<D, E>(address, fetcher, args);
};

export default useCustomSWR;
