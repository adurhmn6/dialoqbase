import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import DashboardLayout from "./Layout";
import NewBot from "./routes/new/bot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BotLayout from "./Layout/BotLayout";
import BotEmbedRoot from "./routes/bot/embed";
import BotPreviewRoot from "./routes/bot/playground";
import BotDSRoot from "./routes/bot/ds";
import BotSettingsRoot from "./routes/bot/settings";
import LoginRoot from "./routes/login/root";
import { AuthProvider } from "./context/AuthContext";
import SettingsRoot from "./routes/settings/root";
import BotIntegrationRoot from "./routes/bot/integrations";
import BotAppearanceRoot from "./routes/bot/appearance";
import { ConfigProvider, theme } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import BotPlaygroundLayout from "./Layout/BotPlaygroundLayout";
import BotConversationsRoot from "./routes/bot/conversations";
import RegisterRoot from "./routes/register";
import { QueryBoundaries } from "./components/Common/QueryBoundaries";
import SettingsApplicationRoot from "./routes/settings/application";
import SettingsTeamsRoot from "./routes/settings/teams";
import BotIntegrationAPIRoot from "./routes/bot/api";
import SettingsModelRoot from "./routes/settings/model";
import { useDarkMode } from "./hooks/useDarkmode";
import CreditLayout from "./Layout/CreditLayout";
import CreditRoot from "./routes/credit";
import NewAgent from "./routes/new/agent";
import AgentPreview from "./routes/agent/preview";
import SessionScreen from "./routes/session/attend";

const router = createBrowserRouter([
  {
    element: (
      <DashboardLayout>
        <Root />
      </DashboardLayout>
    ),
    path: "/",
  },
  {
    element: (
      <DashboardLayout>
        <NewBot />
      </DashboardLayout>
    ),
    path: "/new/bot",
  },
  {
    element: (
      <DashboardLayout>
        <NewAgent />
      </DashboardLayout>
    ),
    path: "/new/agent",
  },
  {
    path: "/credit",
    element: (
      <CreditLayout>
        <CreditRoot />
      </CreditLayout>
    ),
  },

  {
    path: "/bot/:id/embed",
    element: (
      <BotLayout>
        <BotEmbedRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id",
    element: (
      <BotLayout>
        <BotPreviewRoot />
      </BotLayout>
    ),
  },
  {
    path: "/agent/:id",
    element: (
      <DashboardLayout>
        <AgentPreview />
      </DashboardLayout>
    ),
  },
  {
    path: "/session/:id",
    element: <SessionScreen />,
  },
  {
    path: "/bot/:id/playground/:history_id",
    element: (
      <BotLayout>
        <BotPreviewRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/conversations",
    element: (
      <BotPlaygroundLayout>
        <BotConversationsRoot />
      </BotPlaygroundLayout>
    ),
  },
  {
    path: "/bot/:id/conversations/:type/:conversation_id",
    element: (
      <BotPlaygroundLayout>
        <BotConversationsRoot />
      </BotPlaygroundLayout>
    ),
  },
  {
    path: "/bot/:id/data-sources",
    element: (
      <BotLayout>
        <BotDSRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/settings",
    element: (
      <BotLayout>
        <BotSettingsRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/integrations",
    element: (
      <BotLayout>
        <BotIntegrationRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/integrations/api",
    element: (
      <BotLayout>
        <BotIntegrationAPIRoot />
      </BotLayout>
    ),
  },
  {
    path: "/bot/:id/appearance",
    element: (
      <BotLayout>
        <BotAppearanceRoot />
      </BotLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginRoot />,
  },
  {
    path: "/settings",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/settings/application",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsApplicationRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/settings/teams",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsTeamsRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/settings/model",
    element: (
      <DashboardLayout>
        <QueryBoundaries>
          <SettingsModelRoot />
        </QueryBoundaries>
      </DashboardLayout>
    ),
  },
  {
    path: "/register",
    element: <RegisterRoot />,
  },
]);
const queryClient = new QueryClient({});

export default function App() {
  const { mode } = useDarkMode();
  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider hashPriority="high">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AuthProvider>
      </StyleProvider>
    </ConfigProvider>
  );
}
