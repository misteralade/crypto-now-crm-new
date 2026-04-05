import { createFileRoute } from "@tanstack/react-router";
import KycSessions from "../../../pages/KycSessions";

export const Route = createFileRoute("/dashboard/kyc-sessions/")({
  component: KycSessions,
});
