import { axiosClient } from "../config/axiosClient";

export const getCryptoPrices = async () => {
  const res = await axiosClient.get("/simple/price", {
    params: {
      ids: "bitcoin,ethereum,dogecoin",
      vs_currencies: "usd",
    },
  });
  return res.data;
};

export const getCryptoNews = async (page: number, pageSize: number) => {
  const res = await axiosClient.get("/news", {
    params: {
      page,
      pageSize
    },
  });
  return res.data;
};