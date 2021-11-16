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

  let firstDate = Object.keys(counter)[0];
  let lastDate = Object.keys(counter)[Object.keys(counter).length - 1];

  let getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };
  let dayList = getDaysArray(new Date(firstDate), new Date(lastDate));
  for (let i in dayList) {
    let dateString = dayList[i].toISOString().split("T")[0];
    if (dateString in counter) {
    } else {
      counter[dateString] = 0;
    }
  }

  const count = Object.keys(counter).map((key) => [
    new Date(key).getTime(),
    counter[key],
  ]);
  return { tx, count };
}
