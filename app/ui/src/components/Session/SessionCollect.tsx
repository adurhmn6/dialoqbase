import dateFormat from "dateformat";
import { SessionCollectForm } from "../Common/SessionCollectForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Form, notification } from "antd";
import { useStoreMessage } from "../../store";

type Props = {
  startSession: () => void;
};

export default function SessionCollect({ startSession }: Props) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setSessionData } = useStoreMessage();
  const onSubmit = async (values: any) => {
    console.log({ values });
    // const response = await api.post("/agent/session", {
    //   ...values,
    // });
    // console.log({ data: response.data });
    setSessionData({ ...values, sessionId: "response.data" });
    return "response.data";
  };
  const { mutateAsync: createSession, isLoading } = useMutation(onSubmit, {
    onSuccess: (data: any) => {
      startSession();
    },
    onError: (e) => {
      console.log(e);
      if (axios.isAxiosError(e)) {
        const message =
          e.response?.data?.message ||
          e?.response?.data?.error ||
          "Something went wrong.";
        notification.error({
          message: "Error",
          description: message,
        });
        return;
      }

      notification.error({
        message: "Error",
        description: "Something went wrong.",
      });
    },
  });

  return (
    <>
      {/* <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        
      </div> */}
      <div className="flex items-center justify-center w-screen h-screen gap-5 flex-col">
        <div className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center px-3">
          <img
            className="h-8 w-auto"
            src="https://www.bilic.io/favicon.ico"
            alt="Dialoqbase"
          />
          <span className="ml-1 text-xl font-bold">Agents Bilic</span>
        </div>
        <SessionCollectForm
          isLoading={isLoading}
          form={form}
          onSubmit={createSession}
        />
      </div>
    </>
  );
}
