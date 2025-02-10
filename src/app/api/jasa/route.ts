import { createJasaAntar, readJasaAntarByLoginId } from "@/app/models/jasa";

export const POST = async (request: Request) => {
  const body = await request.json();

  await createJasaAntar(body);
  //   console.log(body);

  return Response.json({
    statusCode: 200,
    message: "Success",
  });
};

export const GET = async (request: Request) => {
  const clientId = request.headers.get("rg-user-id");
  // const clientId = "Ini siapa ya hardcode dlu aja";
  if (!clientId) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }

  await readJasaAntarByLoginId(clientId);
  //   console.log(body);

  return Response.json({
    statusCode: 200,
    message: "Success",
  });
};
