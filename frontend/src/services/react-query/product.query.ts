import { useQuery } from "@tanstack/react-query";

/* 
  useQuery를 이용한 hook들은 뒤에 _q를 붙여 식별해준다.
*/
const QUERY_KEY = {
  product: "product",
  productListAdm: "productListAdm",
  productCount: "productCount",
};

// 캐싱 :: 전체 상품 목록
/* export const useFetchProductAll = () => {
  const myAxios = useProduct_a();
  const { data, isLoading } = useQuery(
    [QUERY_KEY.product],
    () => myAxios.getProductAll(),
    {
      staleTime: 10000,
    }
  );
  return {
    product: data,
    product_isLoading: isLoading,
  };
}; */