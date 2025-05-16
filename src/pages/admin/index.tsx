
import { SiteHeader } from "@/components/admin/site-header"
import Layout from "./layout"

import data from "./data.json"

export default function Page() {
  return (
    <>
      <Layout>
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="w-full flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards /> */}
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}