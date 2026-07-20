import UploadDocument from "@/components/uploadcomponent"

export default function Dashboard(){
    return(
        <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Dashboard</h2>
            <div className="mt-4">
                <UploadDocument />
            </div>
        </div>
    )
}