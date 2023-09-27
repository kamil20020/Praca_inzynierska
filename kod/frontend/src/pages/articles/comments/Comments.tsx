import { Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import Comment from "../../../models/dto/Comment";
import CommentView from "./CommentView";
import CreateUpdateComment from "./CreateUpdateComment";
import { useSelector } from "react-redux";
import { roles } from "../../../keycloak/KeycloakService";
import { RootState } from "../../../redux/store";
import ArticleAPIService from "../../../services/ArticleAPIService";

const Comments = (props: {articleId: string}) => {

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const [parentComments, setParentComments] = React.useState<Comment[]>([]);
    const [createUpdateComment, setCreateUpdateComment] = React.useState<boolean>(false);
    const pageSize: number = 6;
    const [page, setPage] = React.useState<number>(0);

    useEffect(() => {
        ArticleAPIService.getParentComments(props.articleId, {size: pageSize, page: page})
        .then((response) => {
            setParentComments(response.data.content)
        })
    }, [])

    const createSubComment = (comment: Comment) => {
        setParentComments([comment, ...parentComments])
    }

    const editSubComment = (comment: Comment, index: number) => {
        let updatedComments: Comment[] = [...parentComments]
        updatedComments[index] = comment
        setParentComments(updatedComments)
    }

    const removeSubComment = (index: number) => {
        let updatedComments: Comment[] = [...parentComments]
        updatedComments.splice(index, 1)
        setParentComments(updatedComments)
    }

    return(
        <Grid item xs={6} container direction="column" marginLeft={3} rowSpacing={4}>
            {actualRoles.includes(roles.logged_user.name) &&
                <Grid item>
                    {!createUpdateComment ? 
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setCreateUpdateComment(true)}
                        >
                            Dodaj komentarz
                        </Button>
                        : <CreateUpdateComment 
                            articleId={props.articleId} 
                            parentCommentId={null} 
                            onCancel={() => setCreateUpdateComment(false)}
                            createSubComment={createSubComment}
                        />
                    }
                </Grid>
            }
            <Grid item container direction="column" spacing={5} marginBottom={5}>
                {parentComments.map((c: Comment, index: number) => (
                    <CommentView key={c.id} comment={c} index={index} editSubComment={editSubComment} removeSubComment={removeSubComment}/>
                ))}
            </Grid>
        </Grid>
    );
}

export default Comments;