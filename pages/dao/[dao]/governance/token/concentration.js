import config from "@/dao.json";
import v1BaseUrl from "@/utils/v1BaseUrl";

export default function Concentration(props) {
  return JSON.stringify(props);
}

export async function getStaticProps({ params }) {
  const endpoint =
    "/1/tokens/" +
    config[params.dao]["governance"]["token"]["contract"] +
    "/token_holders/?";
  const res = await fetch(v1BaseUrl(endpoint)).then((r) => r.json());
  if (res.error) {
    return { props: { error: res.error_message } };
  } else {
    const lastUpdated = res.updated_at;
    const items = res.items;
    let concentration = [];
    for (let i in items) {
      let entry = items[i];
      concentration.push([
        entry.address,
        entry.balance / 10 ** entry.contract_decimals,
      ]);
    }
    return { props: { lastUpdated, concentration }, revalidate: 60 };
  }
}

export async function getStaticPaths() {
  return {
    paths: [...Object.keys(config).map((i) => ({ params: { dao: i } }))],
    fallback: true,
  };
}
