import config from "@/dao.json";
import v1BaseUrl from "@/utils/v1BaseUrl";

export default function Power(props) {
  return JSON.stringify(props);
}

export async function getStaticProps({ params }) {
  let startingBlock;
  const blockHeight = await fetch(
    v1BaseUrl(
      "/1/block_v2/" +
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() +
        "/" +
        new Date(Date.now()).toISOString() +
        "/?"
    )
  ).then((r) => r.json());
  if (blockHeight.error) {
    return { props: { error: blockHeight.error_message } };
  } else {
    startingBlock = blockHeight.data.items[0].height;
  }
  const endpoint =
    "/1/events/topics/" +
    config[params.dao]["governance"]["delegations"] +
    "/?page-size=1000&starting-block=" +
    startingBlock +
    "&ending-block=latest&sender-address=" +
    config[params.dao]["governance"]["token"]["contract"];
  const res = await fetch(v1BaseUrl(endpoint)).then((r) => r.json());
  if (res.error) {
    return { props: { error: res.error_message } };
  } else {
    const items = res.data.items;
    let balances = {};
    for (let i in items) {
      let entry = items[i];
      let address = entry.decoded.params[0].value;
      let balance = entry.decoded.params[2].value / 10 ** 18;
      let ts = entry.block_signed_at;
      if (balances[address] && new Date(ts) > new Date(balances[address].ts)) {
        balances[address] = { ts: ts, power: balance };
      } else if (!balances[address]) {
        balances[address] = { ts: ts, power: balance };
      } else {
        // pass
      }
    }
    let rankedBalances = Object.keys(balances).map((key) => [
      key,
      balances[key].ts,
      balances[key].power,
    ]);

    return {
      props: {
        lastUpdated: res.data.updated_at,
        power: rankedBalances.sort(function (a, b) {
          return b[2] - a[2];
        }),
        // tx: calculate.tx,
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
