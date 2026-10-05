import { notFound } from "next/navigation";
import SupplierPage from "@/app/supplier/[name]/page";
export default async function LocalizedSupplier({params}:{params:Promise<{lang:string;name:string}>}){const{lang,name}=await params;if(lang!=="en"&&lang!=="es")notFound();return <SupplierPage params={{name}} lang={lang}/>}
