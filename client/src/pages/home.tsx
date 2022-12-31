import { useGetProfileQuery } from "../services/auth";

export default function Home () {
  const { data } = useGetProfileQuery();

  return (
    <div className="container p-4">
      <h1>{data?.data?.name}</h1>
      <p>{data?.data?.email}</p>
    </div>
  );
}
