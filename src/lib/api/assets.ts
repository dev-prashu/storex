import axios from "axios";

export const getAssets = async () => {
  try {
    const res = await axios.get("/api/assets");
    return res.data.assets;
  } catch (error) {
    throw new Error(`Unable to fetch users ${error}`);
  }
};
