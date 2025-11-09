import dynamic from "next/dynamic";

const WordOfTheDay = dynamic(() => import("@/components/WordOfTheDay"), {
  ssr: false,
});

export default function Page() {
  return <WordOfTheDay />;
}