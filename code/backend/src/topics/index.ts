import type Aedes from "aedes";
import { handleJoin } from "./join";
import { handleLeave } from "./leave";

export const registerTopics = (broker: Aedes) => {
  handleJoin(broker);
  handleLeave(broker);
};
