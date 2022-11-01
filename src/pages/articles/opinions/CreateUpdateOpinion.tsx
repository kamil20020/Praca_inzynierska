import { Grid } from "@mui/material"
import Opinion from "../../../models/dto/Opinion"

export interface CreateUpdateOpinionProps {
    articleId: string,
    index?: number,
    opinion?: Opinion,
    onCancel: () => void,
    createOpinion?: (opinion: Opinion) => void,
    editOpinion?: (opinion: Opinion, index: number) => void
}

const CreateUpdateOpinion = (props: CreateUpdateOpinionProps) => {
    return (
        <Grid item container direction="column">
            
            
        </Grid>
    )
}

export default CreateUpdateOpinion;