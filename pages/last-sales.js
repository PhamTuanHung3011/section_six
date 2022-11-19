import { useEffect, useState } from "react";
import useSWR, { SWRConfig } from "swr";

function LastSalesPage(props) {
  const [sales, setSales] = useState(props.sales);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    "https://react-demo-one-b733d-default-rtdb.asia-southeast1.firebasedatabase.app/sales.json",
    fetcher
  );
  console.log("====>data: " + data);

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);

  if (error) return "An error has occurred";
  if (!data || !sales) return "Loading...";

  return (
    <ul>
      {sales.map((item) => (
        <li key={item.id}>
          {item.username} - {item.volume}
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const response = await fetch(
    "https://react-demo-one-b733d-default-rtdb.asia-southeast1.firebasedatabase.app/sales.json"
  );
  const data = await response.json();
  const transformedSales = [];

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }

  return { props: { sales: transformedSales }, revalidate: 10 };
}

export default LastSalesPage;
