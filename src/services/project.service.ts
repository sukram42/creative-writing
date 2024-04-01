import { supabase } from "../app/supabaseClient"

export const getChaptersByProject = async (project_id: string)=> {
    let { data: chapters, error } = await supabase
        .from('chapters')
        .select('chapter_id')
        .eq('project', project_id)

        if (error){
            throw new ProjectNotFound(project_id, error)
        }

    return chapters
}


class ProjectNotFound extends Error {
  constructor(project_id: string, error: any) {
    super(`The project with the id ${project_id} could not be found`);
    console.log('Error', error)
    this.name = "ProjectNotFound";
  }
}