import { Fragment } from "react";
import path from "path";
import promises from "fs/promises";

export default function ProductDetailPage(props) {
  const { loadedProduct } = props;

  return (
    <Fragment>
      <h1> {loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backen.json");
  const jsonData = await promises.readFile(filePath);
  const data = JSON.parse(jsonData.toString());
  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.productId;
  const data = await getData();
  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }
  return {
    props: {
      loadedProduct: product,
    },
  };
}

export async function getStaticPaths() {
  const data = await getData();
  const ids = data.products.map((product) => product.id);
  const pathWithParams = ids.map((id) => ({ params: { productId: id } }));

  return {
    paths: pathWithParams,
    fallback: false,
  };
}
