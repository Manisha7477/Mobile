import * as signalR from "@microsoft/signalr"

export function createSignalRConnection(hubRoute: string) {
  // Remove trailing "/api" from API base
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "")

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in .env")
  }

  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}${hubRoute}`, {
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()
}
