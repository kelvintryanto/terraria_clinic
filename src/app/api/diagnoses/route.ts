import {
  CreateDiagnose,
  createDiagnose,
  getAllDiagnoses,
  getDiagnosesByDate,
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
    const data = await request.json();

    /**
     * di post ini bikin DXNumber dan DX datenya
     *
     */
    // Get current date components
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    /**
     * getDiagnosesByDate dibutuhkan untuk memuat diagnose number
     * buat di model diagnose
     */
    const todayDiagnoses = await getDiagnosesByDate(now);

    // Get invoices for today to determine the sequence number
    const sequenceNumber = String(todayDiagnoses.length + 1).padStart(2, "0");

    // Generate diagnose number
    const diagnoseNo = `DX/${year}/${month}/${day}/${sequenceNumber}`;

    /**
     * buat variabel baru untuk mendefinisikan createDiagnose
     * tanpa _id dan createdAt dan updatedAt
     */
    const diagnoseData = {
      dxNumber: diagnoseNo,
      dxDate: now.toISOString(),
      ...data,
    };

    const result = await createDiagnose(diagnoseData as CreateDiagnose);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to fetch diagnoses", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnoses" },
      { status: 500 }
    );
  }
}
