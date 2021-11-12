import config from "@/dao.json";
import v1BaseUrl from "@/utils/v1BaseUrl";

export default function Holdings(props) {
  return JSON.stringify(props);
}

export async function getStaticProps({ params }) {
  const endpoint =
    "/1/address/" +
    config[params.dao]["governance"]["token"]["holdings"] +
    "/portfolio_v2/?";
  const res = await fetch(v1BaseUrl(endpoint)).then((r) => r.json());
  if (res.error) {
    return { props: { error: res.error_message } };
  } else {
    const lastUpdated = res.updated_at;
    const items = res.items;
    const holdingsData = items.filter(function (i) {
      return (
        i.contract_address.toLowerCase() ==
        config[params.dao]["governance"]["token"]["contract"].toLowerCase()
      );
    })[0].holdings;
    let holdings = [];
    for (let i in holdingsData) {
      let entry = holdingsData[i];
      let average =
        (entry.open.quote +
          entry.high.quote +
          entry.low.quote +
          entry.close.quote) /
        4;
      holdings.push([Date.parse(entry.timestamp), average]);
    }
    return { props: { lastUpdated, holdings }, revalidate: 60 };
  }
}

export async function getStaticPaths() {
  return {
    paths: [...Object.keys(config).map((i) => ({ params: { dao: i } }))],
    fallback: true,
  };
}
