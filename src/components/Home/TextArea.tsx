import type { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface TextAreaProps {
  setMessage: Dispatch<SetStateAction<string>>;
  message: string;
  handleSend: () => void;
}

const TextArea = ({ setMessage, message, handleSend }: TextAreaProps) => {
  return (
    <div className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => {
          const input = e.target.value;
          setMessage(input);
        }}
      />
      <Button onClick={handleSend}>Send</Button>
    </div>
  );
};

export default TextArea;
