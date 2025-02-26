import {
  createDiagnose,
  Diagnose,
  getAllDiagnoses,
} from "@/app/models/diagnose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const diagnoses = await getAllDiagnoses();
    return NextResponse.json(diagnoses);
  } catch (error: unknown) {
    console.error("Failed to fetch diagnoses", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnoses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body, "body di route");

    const result = await createDiagnose(body as Diagnose);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to fetch diagnoses", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnoses" },
      { status: 500 }
    );
  }
}
