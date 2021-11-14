import config from "@/dao.json";
import v1BaseUrl from "@/utils/v1BaseUrl";
import countEventsDaily from "@/utils/countEventsDaily";

export default function Votes(props) {
  return JSON.stringify(props);
}

export async function getStaticProps({ params }) {
  const endpoint =
    "/1/events/topics/" +
    config[params.dao]["governance"]["proposals"] +
    "/?ending-block=latest&sender-address=" +
    config[params.dao]["governance"]["module"];
  const res = await fetch(v1BaseUrl(endpoint)).then((r) => r.json());
  if (res.error) {
    return { props: { error: res.error_message } };
  } else {
    const calculate = await countEventsDaily(res.data.items);
    return {
      props: {
        lastUpdated: res.data.updated_at,
        count: calculate.count,
        tx: calculate.tx,
      },
      revalidate: 60,
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [...Object.keys(config).map((i) => ({ params: { dao: i } }))],
    fallback: true,
  };
}
