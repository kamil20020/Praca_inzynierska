import { Grid, Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { roles } from "../../../keycloak/KeycloakService";
import Opinion from "../../../models/dto/Opinion";
import { RootState } from "../../../redux/store";
import CreateUpdateOpinion from "./CreateUpdateOpinion";
import OpinionView from "./OpinionView";

const opinions1: Opinion[] = [
    {
        id: '1',
        articleId: '2',
        authorDTO: {
            nickname: 'kamil.dywan',
            firstname: 'Kamil',
            surname: 'Dywan',
            email: 'kamil.dywan@mail.com'
        },
        content: "Dobry artykuł",
        rating: 4,
        creationDate: new Date(),
        modificationDate: new Date()
    },
    {
        id: '2',
        articleId: '2',
        authorDTO: {
            nickname: 'adam.nowak',
            firstname: 'Adam',
            surname: 'Nowak',
            email: 'adam.nowak@mail.com'
        },
        content: "Wspaniały artykuł",
        rating: 5,
        creationDate: new Date(),
        modificationDate: new Date()
    },
    {
        id: '3',
        articleId: '2',
        authorDTO: {
            nickname: 'jan.kowalski',
            firstname: 'Jan',
            surname: 'Kowalski',
            email: 'jan.kowalski@mail.com'
        },
        content: "Niezbyt dobry artykuł",
        rating: 3,
        creationDate: new Date(),
        modificationDate: new Date()
    }
]

const Opinions = (props: {articleId: string}) => {

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const [opinions, setOpinions] = React.useState<Opinion[]>([]);
    const [createUpdateOpinion, setCreateUpdateOpinion] = React.useState<boolean>(false);
    const pageSize: number = 6;
    const [page, setPage] = React.useState<number>(0);

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

    return(
        <Grid item xs={6} container direction="column" marginLeft={3} rowSpacing={4}>
            {actualRoles.includes(roles.logged_user.name) &&
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
                            articleId={props.articleId} 
                            onCancel={() => setCreateUpdateOpinion(false)}
                            createOpinion={createOpinion}
                        />
                    }
                </Grid>
            }
            <Grid item container direction="column" spacing={5} marginBottom={5}>
                {opinions1.map((o: Opinion, index: number) => (
                    <OpinionView key={o.id} opinion={o} index={index} editOpinion={editOpinion} removeOpinion={removeOpinion}/>
                ))}
            </Grid>
        </Grid>
    );
}

export default Opinions;