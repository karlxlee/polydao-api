import config from "@/dao.json";
import v1BaseUrl from "@/utils/v1BaseUrl";

export default function Votes(props) {
  return JSON.stringify(props);
}

export async function getStaticProps({ params }) {
  const endpoint =
    "/1/events/topics/" +
    config[params.dao]["governance"]["votes"] +
    "/?ending-block=latest";
  const res = await fetch(v1BaseUrl(endpoint)).then((r) => r.json());
  if (res.error) {
    return { props: { error: res.error_message } };
  } else {
    const lastUpdated = res.data.updated_at;
    const items = res.data.items;
    let votes = [];
    for (let i in items) {
      let entry = items[i];
      votes.push([Date.parse(entry.block_signed_at), entry.tx_hash]);
    }
    return { props: { lastUpdated, votes }, revalidate: 60 };
  }
}

export async function getStaticPaths() {
  return {
    paths: [...Object.keys(config).map((i) => ({ params: { dao: i } }))],
    fallback: true,
  };
}
