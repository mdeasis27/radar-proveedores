import { notFound } from "next/navigation";
import HistoryPage from "@/app/history/page";
export default async function LocalizedHistory({params}:{params:Promise<{lang:string}>}){const{lang}=await params;if(lang!=="en"&&lang!=="es")notFound();return <HistoryPage lang={lang}/>}
