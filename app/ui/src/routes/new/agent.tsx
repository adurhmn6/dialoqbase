import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, notification } from "antd";
import axios from "axios";
import { AgentForm } from "../../components/Common/AgentForm";

export default function NewAgent() {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const client = useQueryClient();
  const onSubmit = async (values: any) => {
    console.log({ values });
    const response = await api.post("/agent", {
      ...values,
    });
    console.log({ data: response.data });
    client.invalidateQueries(["fetchCredits"]);
    return response.data;
  };
  const { mutateAsync: createAgent, isLoading } = useMutation(onSubmit, {
    onSuccess: (data: any) => {
      navigate(`/`);
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
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create a new agent
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 border sm:rounded-lg sm:px-10 dark:bg-black dark:border-gray-800">
            {/* <BotForm
              showEmbeddingAndModels={true}
              createBot={createBot}
              isLoading={isLoading}
              setSelectedSource={setSelectedSource}
              form={form}
            /> */}
            <AgentForm
              createAgent={createAgent}
              isLoading={isLoading}
              form={form}
            />
          </div>
        </div>
      </div>
    </>
  );
}
