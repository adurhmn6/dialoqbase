import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React, { useState } from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { Cooking } from "../../components/Common/Cooking";
import AgentInfo from "../../components/Agent/AgentInfo";
import AgentSessions from "../../components/Agent/AgentSessions";
import { useAuth } from "../../context/AuthContext";
import SessionCollect from "../../components/Session/SessionCollect";
import SessionAttend from "../../components/Session/SessionAttend";
// import { PreviewIframe } from "../../components/Bot/Preview/PreviewIFrame";

export default function SessionScreen() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"collect" | "attend">("collect");
  // const { data, status } = useQuery(["getAgentById", param.id], async () => {
  //   const response = await api.get(`/agent/${param.id}`);
  //   return response.data as {
  //     id: string;
  //     user_id: number;
  //     name: string;
  //     initMsg: string;
  //     prompt: string;
  //     createdAt: string;
  //     sessions: any[];
  //   };
  // });

  const { isLogged } = useAuth();

  React.useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  return (
    <>
      {stage === "collect" && (
        <div className="flex justify-center p-3 gap-8">
          <SessionCollect startSession={() => setStage("attend")} />
        </div>
      )}
      {stage === "attend" && (
        <div className="flex justify-center p-3 gap-8">
          <SessionAttend />
        </div>
      )}
    </>
  );
}
