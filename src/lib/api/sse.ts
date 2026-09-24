export interface SseEvent {
  event: string;
  data: string;
}

export async function* readSse(res: Response): AsyncGenerator<SseEvent> {
  if (!res.body) {
    throw new Error("Response body missing for stream request");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const rawEvents = buffer.split("\n\n");
      buffer = rawEvents.pop() ?? "";

      for (const rawEvent of rawEvents) {
        let event = "message";
        let data = "";
        for (const line of rawEvent.split("\n")) {
          if (line.startsWith("event:")) {
            event = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            data += line.slice(5).trim();
          }
        }
        if (data) yield { event, data };
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}
