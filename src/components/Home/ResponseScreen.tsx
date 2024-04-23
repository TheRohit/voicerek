interface ResponseScreenProps {
  response: string;
}

const ResponseScreen = ({ response }: ResponseScreenProps) => {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center rounded-lg border-2 border-slate-200 p-5">
      <div className="text-center text-8xl">{response}</div>
    </div>
  );
};

export default ResponseScreen;
