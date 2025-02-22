import { createCategory, deleteCategory, getAllCategories } from "@/app/models/category";
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

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const result = await deleteCategory(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Category not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
