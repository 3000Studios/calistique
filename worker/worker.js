export default {

async fetch(request, env) {

return new Response(
JSON.stringify({status:"AI system online"}),
{ headers: { "content-type":"application/json"} }
)

}

}
