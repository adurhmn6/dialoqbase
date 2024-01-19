import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../services/api";
import { notification } from "antd";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const defaultCredit = 1;

export default function CreditRoot() {
  const [creditPack, setCreditPack] = useState(defaultCredit);
  const [searchParams] = useSearchParams();
  const handledRedirect = useRef(false);

  useEffect(() => {
    if (searchParams.get("purchase_success") && !handledRedirect.current) {
      notification.success({ message: "Credit Purchase Success" });
      handledRedirect.current = true;
    }
    if (searchParams.get("purchase_canceled") && !handledRedirect.current) {
      notification.error({ message: "Credit Purchase Failed" });
      handledRedirect.current = true;
    }
  }, [searchParams]);

  const onCheckout = async () => {
    const data = await api.get(`/credit/checkout?quantity=${creditPack}`);
    return data.data as { redirect: string };
  };

  const { mutate: checkoutMutation, isLoading } = useMutation(onCheckout, {
    onSettled: (data) => {
      window.location.replace(data!.redirect);
    },
    onError: (error) => {
      // is axios
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        notification.error({
          message: "Error",
          description: message,
          placement: "bottomRight",
        });
        return;
      }

      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  // <QueryBoundaries>
  return (
    <div className="relative md:ml-14 p-4 flex flex-col gap-8">
      <div className="bg-white p-3 rounded-md shadow-sm hover:shadow-lg transition-shadow">
        <h1 className="font-bold text-lg mb-3">What are Credits?</h1>
        <p className="text-slate-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div className="bg-white p-5 rounded-md shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center w-max mx-auto">
        <h1 className="font-bold text-2xl mb-5">Buy Credits</h1>
        <div className="max-w-[350px]">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Credit Pack Count:
          </label>
          <input
            defaultValue={defaultCredit}
            type="number"
            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 px-3"
            onChange={(e) => setCreditPack(Number(e.target?.value))}
          />
          <p className="mt-4 text-sm font-light text-slate-500">
            1 Pack containes 1000 credits and costs $0.2
          </p>
          <button
            disabled={creditPack < 0 || isLoading}
            onClick={() => {
              // console.log("checkout outside");
              checkoutMutation();
            }}
            className="mt-4 flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-400"
          >
            Buy {creditPack * 1000} credits for ${(0.2 * creditPack).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
  {
    /* </QueryBoundaries> */
  }
}
