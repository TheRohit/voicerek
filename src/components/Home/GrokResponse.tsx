import { FC, useEffect } from "react";

interface GrokResponseProps {
  isFinal: boolean | undefined;
  caption: string | null;
  sendMessage: (message: string) => void;
}

const GrokResponse: FC<GrokResponseProps> = ({
  isFinal,
  caption,
  sendMessage,
}) => {
  return <div></div>;
};

export default GrokResponse;
