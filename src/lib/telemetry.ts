import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";

let initialized = false;

export function initTelemetry(): void {
  if (initialized) return;
  initialized = true;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const backendOrigin = backendUrl
    ? new URL(backendUrl).origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    : undefined;

  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({ "service.name": "ai-coach-frontend" }),
    spanProcessors: [
      new BatchSpanProcessor(new OTLPTraceExporter({ url: "/api/traces" })),
    ],
  });

  provider.register();

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: backendOrigin
          ? [new RegExp(`^${backendOrigin}`)]
          : [],
      }),
    ],
  });
}
