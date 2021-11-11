import data from "../../../../dao.json";
const sampleConfigData = [
  {
    id: 1,
    first_name: "Petronia",
    last_name: "DelaField",
    email: "pdelafield0@state.gov",
    gender: "Female",
    ip_address: "200.86.172.105",
  },
  {
    id: 2,
    first_name: "Kendall",
    last_name: "Shilladay",
    email: "kshilladay1@who.int",
    gender: "Male",
    ip_address: "53.26.234.195",
  },
  {
    id: 3,
    first_name: "Shelia",
    last_name: "Jenoure",
    email: "sjenoure2@acquirethisname.com",
    gender: "Female",
    ip_address: "105.195.252.114",
  },
  {
    id: 4,
    first_name: "Cherida",
    last_name: "Cronkshaw",
    email: "ccronkshaw3@telegraph.co.uk",
    gender: "Female",
    ip_address: "59.49.88.149",
  },
  {
    id: 5,
    first_name: "Bibby",
    last_name: "Betham",
    email: "bbetham4@sitemeter.com",
    gender: "Female",
    ip_address: "38.115.1.6",
  },
];

function Votes(props) {
  return JSON.stringify(sampleConfigData);
}

export async function getStaticProps(context) {
  return { props: {} }; // it never reaches here but required as getInitialProps need to return object.
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { dao: "1" } }, { params: { dao: "2" } }],
    fallback: true, // See the "fallback" section below
  };
}

export default Votes;
