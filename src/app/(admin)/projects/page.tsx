import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectList from "@/components/project/ProjectList";

export default function ProjectPages() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Project Management" />
            <ProjectList/>
        </div>
    )
}