import { Grid, Button } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { roles } from "../../../keycloak/KeycloakService";
import Article from "../../../models/dto/Article";
import Opinion from "../../../models/dto/Opinion";
import { RootState } from "../../../redux/store";
import OpinionAPIService from "../../../services/OpinionAPIService";
import CreateUpdateOpinion from "./CreateUpdateOpinion";
import OpinionView from "./OpinionView";

const Opinions = (props: {article: Article}) => {

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const userId = useSelector((state: RootState) => state.user).user.id as number

    const [opinions, setOpinions] = React.useState<Opinion[]>([]);
    const [createUpdateOpinion, setCreateUpdateOpinion] = React.useState<boolean>(false);

    const pageSize: number = 6;
    const [page, setPage] = React.useState<number>(0);

    const [canCreate, setCanCreate] = React.useState<boolean | null>(userId == null ? false : null)

    useEffect(() => {
        OpinionAPIService.getAllByArticleId(props.article.id, userId)
        .then((response) => {
            setOpinions(response.data)

            if(!userId){
                return;
            }
            
            OpinionAPIService.existsByAuthorId(userId)
            .then((response) => {
                setCanCreate(!response.data)
            })
            .catch((error) => {
                console.log(error)
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    const createOpinion = (opinion: Opinion) => {
        setOpinions([opinion, ...opinions])
    }

    const editOpinion = (opinion: Opinion, index: number) => {
        let updatedOpinions = [...opinions]
        updatedOpinions[index] = opinion
        setOpinions(updatedOpinions)
    }

    const removeOpinion = (index: number) => {
        let updatedOpinions: Opinion[] = [...opinions]
        updatedOpinions.splice(index, 1)
        setOpinions(updatedOpinions)
    }

    if(canCreate == null){
        <div>Ładowanie...</div>
    }

    console.log(actualRoles.includes(roles.logged_user.name), canCreate, userId != props.article.authorDTO.id)

    return(
        <Grid item xs={6} container direction="column" marginLeft={3} rowSpacing={4}>
            {(actualRoles.includes(roles.logged_user.name) && opinions.filter(o => o.author.id == userId).length == 0 && userId != props.article.authorDTO.id) &&
                <Grid item>
                    {!createUpdateOpinion ? 
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setCreateUpdateOpinion(true)}
                        >
                            Dodaj opinię
                        </Button>
                        : <CreateUpdateOpinion 
                            articleId={props.article.id} 
                            onCancel={() => setCreateUpdateOpinion(false)}
                            createOpinion={createOpinion}
                        />
                    }
                </Grid>
            }
            <Grid item container direction="column" spacing={5} marginBottom={5}>
                {opinions.map((o: Opinion, index: number) => (
                    <OpinionView key={o.id} opinion={o} index={index} editOpinion={editOpinion} removeOpinion={removeOpinion}/>
                ))}
            </Grid>
        </Grid>
    );
}

export default Opinions;