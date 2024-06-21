import { LiveClient } from "@deepgram/sdk";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { Microphone } from "../Microphone";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TextAreaProps {
  setMessage: Dispatch<SetStateAction<string>>;
  message: string;
  handleSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  connection: LiveClient | null;
}

const TextArea = ({
  setMessage,
  message,
  handleSend,
  isLoading,
  isListening,
  connection,
}: TextAreaProps) => {
  const isDisabled = message === "" || isLoading;

  return (
    <div className="flex gap-2">
      <Input
        placeholder="What's in your mind?"
        value={message}
        onChange={(e) => {
          const input = e.target.value;
          setMessage(input);
        }}
      />
      <Button type="submit" disabled={isDisabled} onClick={handleSend}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send
      </Button>
      <Microphone isListening={isListening} connection={connection} />
    </div>
  );
};

export default TextArea;
