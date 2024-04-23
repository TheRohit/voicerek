export const getAudioBuffer = async (
  response: ReadableStream<Uint8Array>,
): Promise<ArrayBuffer> => {
  const reader = response.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => new Uint8Array([...acc, ...chunk]),
    new Uint8Array(),
  );

  return dataArray.buffer;
};

export const playAudio = async (audioOutput: ReadableStream<Uint8Array>) => {
  const buffer = await getAudioBuffer(audioOutput);
  const blob = new Blob([buffer], { type: "audio/mp3" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await audio.play();
};
