import axios from "@/lib/axios";

export type TravelField = {
  id: number;
  travel_country_id: number;
  label: string;
  name: string;
  type: "text" | "email" | "phone" | "date" | "select" | "file" | "textarea";
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
};

export type TravelCountry = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  is_active: boolean;
  fields: TravelField[];
};

export const fieldTypeLabels: Record<TravelField["type"], string> = {
  text: "نص",
  email: "بريد إلكتروني",
  phone: "هاتف",
  date: "تاريخ",
  select: "اختيار",
  file: "ملف",
  textarea: "نص طويل",
};

export const getAdminTravelCountries = async () => {
  const res = await axios.get("/admin/travel-countries");
  return res.data.countries as TravelCountry[];
};

export const createTravelCountry = async (data: {
  name: string;
  image?: string;
  is_active?: boolean;
}) => {
  const res = await axios.post("/admin/travel-countries", data);
  return res.data;
};

export const addTravelField = async ({
  countryId,
  data,
}: {
  countryId: number;
  data: {
    label: string;
    name: string;
    type: TravelField["type"];
    options?: string[] | null;
    is_required?: boolean;
    sort_order?: number;
  };
}) => {
  const res = await axios.post(
    `/admin/travel-countries/${countryId}/fields`,
    data
  );

  return res.data;
};

export const deleteTravelField = async (fieldId: number) => {
  const res = await axios.delete(`/admin/travel-form-fields/${fieldId}`);
  return res.data;
};