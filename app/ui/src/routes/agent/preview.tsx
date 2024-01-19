import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { Cooking } from "../../components/Common/Cooking";
import AgentInfo from "../../components/Agent/AgentInfo";
import AgentSessions from "../../components/Agent/AgentSessions";
import { useAuth } from "../../context/AuthContext";
// import { PreviewIframe } from "../../components/Bot/Preview/PreviewIFrame";

export default function AgentPreview() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, status } = useQuery(["getAgentById", param.id], async () => {
    const response = await api.get(`/agent/${param.id}`);
    return response.data as {
      id: string;
      user_id: number;
      name: string;
      initMsg: string;
      prompt: string;
      createdAt: string;
      sessions: any[];
    };
  });

  const { isLogged } = useAuth();

  React.useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  React.useEffect(() => {
    if (status === "error") {
      navigate("/");
    }
  }, [status]);

  return (
    <>
      {status === "loading" && (
        <div className="mx-auto my-3 w-full max-w-7xl">
          <SkeletonLoading />
        </div>
      )}
      {status === "success" && !data && <Cooking />}
      {status === "success" && data && (
        <div className="flex justify-center p-3 gap-8">
          <AgentInfo info={data} />
          <AgentSessions sessions={data.sessions} />
        </div>
      )}
    </>
  );
}
