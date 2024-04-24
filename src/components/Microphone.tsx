import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useQueue } from "@uidotdev/usehooks";
import { LiveClient } from "@deepgram/sdk";

interface MicrophoneProps {
  isListening: boolean;
  connection: LiveClient | null;
}

export const Microphone = ({ isListening, connection }: MicrophoneProps) => {
  const [microphone, setMicrophone] = useState<MediaRecorder | null>();
  const [userMedia, setUserMedia] = useState<MediaStream | null>();
  const [micOpen, setMicOpen] = useState(false);
  const { add, remove, first, size, queue } = useQueue<any>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleMicrophone = useCallback(async () => {
    if (microphone && userMedia) {
      setUserMedia(null);
      setMicrophone(null);

      microphone.stop();
    } else {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const microphone = new MediaRecorder(userMedia);
      microphone.start(500);

      microphone.onstart = () => {
        setMicOpen(true);
      };

      microphone.onstop = () => {
        setMicOpen(false);
      };

      microphone.ondataavailable = (e) => {
        add(e.data);
      };

      setUserMedia(userMedia);
      setMicrophone(microphone);
    }
  }, [add, microphone, userMedia]);

  useEffect(() => {
    if (size > 0 && !isProcessing) {
      setIsProcessing(true);

      if (isListening) {
        const blob = first;
        connection?.send(blob as Blob);
        remove();
      }

      const waiting = setTimeout(() => {
        clearTimeout(waiting);
        setIsProcessing(false);
      }, 250);
    }
  }, [connection, queue, remove, first, size, isProcessing, isListening]);

  return (
    <Button variant={"outline"} onClick={() => toggleMicrophone()}>
      {micOpen ? "Listening" : "Speak"}
    </Button>
  );
};
