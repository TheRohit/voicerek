import type { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface TextAreaProps {
  setMessage: Dispatch<SetStateAction<string>>;
  message: string;
  handleSend: () => void;
  isLoading: boolean;
}

const TextArea = ({
  setMessage,
  message,
  handleSend,
  isLoading,
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
    </div>
  );
};

export default TextArea;
