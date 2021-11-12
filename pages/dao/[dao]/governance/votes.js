import config from "@/dao.json";
import v1BaseUrl from "@/utils/v1BaseUrl";

export default function Votes(props) {
  return JSON.stringify(props);
}

export async function getStaticProps({ params }) {
  const endpoint =
    "/1/events/address/" +
    config[params.dao]["governance"]["votes"] +
    "/?starting-block=12115107&ending-block=12240004";
  console.log(endpoint);
  const res = await fetch(v1BaseUrl(endpoint)).then((r) => r.json());
  if (res.error) {
    return { props: { error: res.error_message } };
  } else {
    const lastUpdated = res.data.updated_at;
    const items = res.data.items;
    const count = items.filter(function (i) {
      return i.decoded.name == "VoteCast";
    }).length;
    return { props: { lastUpdated, items, count }, revalidate: 60 };
  }
}

export async function getStaticPaths() {
  return {
    paths: [...Object.keys(config).map((i) => ({ params: { dao: i } }))],
    fallback: true,
  };
}
