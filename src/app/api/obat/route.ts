import { createObat, getObat } from "@/app/models/obat";

export const POST = async (request: Request) => {
  const body = await request.json();
  //   console.log(body, "ini di api");
  //   const clientId = request.headers.get("rg-user-id");
  //   const clientId = "Ini siapa ya hardcode dlu aja";
  //   if (!clientId) {
  //     return new Response(JSON.stringify({ error: "Invalid request" }), {
  //       status: 400,
  //     });
  //   }

  await createObat(body);
  return Response.json({
    status: 201,
    message: "Success Create Obat",
  });
};

export const GET = async () => {
  const data = await getObat();
  // get smua obat
  return Response.json({
    status: 200,
    data,
  });
};
