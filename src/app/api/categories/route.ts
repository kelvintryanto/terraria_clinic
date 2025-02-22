import { createCategory, getAllCategories } from "@/app/models/category";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getAllCategories();

    return NextResponse.json(result);
  } catch (error) {
    console.log("Error on fetching categories", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createCategory(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log("Error on creating categories", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
