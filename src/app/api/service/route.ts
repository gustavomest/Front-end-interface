import { NextResponse } from "next/server";

const API_BASE_URL = "http://localhost:3001"; // Backend rodando em outra porta

export async function GET(req: Request, { params }: { params: { serviceName: string } }) {
  const response = await fetch(`${API_BASE_URL}/service/${params.serviceName}`);
  const data = await response.json();
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { serviceName: string } }) {
  const { action } = await req.json();
  const response = await fetch(`${API_BASE_URL}/service/${params.serviceName}/${action}`, {
    method: "PUT",
  });
  const data = await response.json();
  return NextResponse.json(data);
}
