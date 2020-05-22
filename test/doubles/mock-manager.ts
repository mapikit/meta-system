import { EventManager, BroadcastsRecorder } from "birbs";

export const mockManager = () : EventManager => new EventManager(new BroadcastsRecorder);
