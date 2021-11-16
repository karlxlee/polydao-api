export default async function countEventsDaily(items) {
  let tx = [];
  let counter = {};

  for (let i in items) {
    let entry = items[i];
    tx.push([Date.parse(entry.block_signed_at), entry.tx_hash]);

    let dateString = new Date(entry.block_signed_at)
      .toISOString()
      .split("T")[0];
    if (dateString in counter) {
      counter[dateString] += 1;
    } else {
      counter[dateString] = 1;
    }
  }

  const count = Object.keys(counter).map((key) => [
    new Date(key).getTime(),
    counter[key],
  ]);
  return { tx, count };
}
