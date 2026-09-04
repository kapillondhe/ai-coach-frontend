import { NextRequest, NextResponse } from "next/server";

const PHOENIX_COLLECTOR_ENDPOINT =
  process.env.PHOENIX_COLLECTOR_ENDPOINT ?? "https://app.phoenix.arize.com";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.PHOENIX_API_KEY;
  if (!apiKey) {
    return new NextResponse(null, { status: 204 });
  }

  const body = await request.arrayBuffer();
  const contentType = request.headers.get("content-type") ?? "application/x-protobuf";

  const upstream = await fetch(`${PHOENIX_COLLECTOR_ENDPOINT}/v1/traces`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  return new NextResponse(null, { status: upstream.status });
}
