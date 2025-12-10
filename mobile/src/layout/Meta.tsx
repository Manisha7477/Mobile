import { NextSeo } from "next-seo"
import Head from "next/head"
import { MetaData, AppConfig } from "@/utils/AppConfig"
import { useRouter } from "next/router"
interface IMetaProps {}

const Meta: React.FunctionComponent<IMetaProps> = ({}) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <link rel="icon" href="/image.png" />
      </Head>
      <NextSeo
        title={MetaData.title}
        description={MetaData.description}
        openGraph={{
          title: MetaData.title,
          description: MetaData.description,
          site_name: AppConfig.siteName,
        }}
      />
    </>
  )
}

export default Meta
