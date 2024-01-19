import { Form, FormInstance, Input } from "antd";

type Props = {
  onSubmit: (values: any) => void;
  isLoading: boolean;
  form: FormInstance<any>;
};

export const SessionCollectForm = ({ isLoading, form, onSubmit }: Props) => {
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="space-y-6"
        initialValues={{
          "init-msg": "Good day, how are you doing?",
        }}
      >
        <div className="sm:overflow-hidden ">
          <div className="space-y-6 border-t border rounded-t-md  bg-white px-4 py-5 sm:p-6 dark:bg-black dark:border-gray-800">
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              <Input size="large" type="text" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
              ]}
            >
              <Input
                size="large"
                type="email"
                className="mt-1 block w-full border-gray-300 rounded-md  focus:ring-green-500 focus:border-indigo-500 sm:text-sm"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone",
                },
              ]}
            >
              <Input
                size="large"
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md  focus:ring-green-500 focus:border-indigo-500 sm:text-sm"
              />
            </Form.Item>
          </div>
          <div className="bg-gray-50 border-x border-b rounded-b-md rounded-x-md px-4 py-3 text-right sm:px-6 dark:bg-[#141414] dark:border-gray-800">
            <button
              disabled={isLoading}
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white  hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLoading ? "Starting..." : "Start Session"}
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};
