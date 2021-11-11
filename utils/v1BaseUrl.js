export default function v1BaseUrl(endpoint) {
  return (
    "https://api.covalenthq.com/v1" +
    endpoint +
    "&key=" +
    process.env.COVALENT_KEY
  );
}
