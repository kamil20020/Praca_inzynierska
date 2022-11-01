import { Button, FormControl, FormHelperText, Grid, TextField } from "@mui/material";
import React from "react";  
import { useSelector, useDispatch } from "react-redux";
import Comment from "../../../models/dto/Comment";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice";
import { RootState } from "../../../redux/store";
import CommentAPIService, { CreateComment, UpdateComment } from "../../../services/CommentAPIService";
import FormValidator from "../../../services/FormValidator";

export interface CreateUpdateCommentProps {
    articleId: string,
    parentCommentId: string | null,
    index?: number,
    comment?: Comment,
    onCancel: () => void,
    createSubComment?: (comment: Comment) => void,
    editSubComment?: (comment: Comment, index: number) => void
}

const CreateUpdateComment = (props: CreateUpdateCommentProps) => {

    const isUpdating: boolean = props.comment !== undefined

    const userId = useSelector((state: RootState) => state.user).user.id as number
    const [content, setContent] = React.useState<string>(!isUpdating ? '' : props.comment!.content);
    const [contentError, setContentError] = React.useState<string>('')
    const dispatch = useDispatch()

    const validateForm = () => {

        if(!FormValidator.checkIfIsRequired(content)){
            setContentError(FormValidator.requiredMessage)
            return false;
        }

        return true;
    }

    const handleSaveComment = () => {

        if(!validateForm())
            return;

        if(isUpdating){

            const updateComment: UpdateComment = {
                content: content
            }

            CommentAPIService.updateCommentById(props.comment!.id, updateComment)
            .then((response) => {
                dispatch(setNotificationMessage("Komentarz został zaktualizowany"))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                props.editSubComment!(response.data, props.index as number)
                props.onCancel()
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.response.data))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            })
        }
        else{
            const createComment: CreateComment = {
                articleId: props.articleId,
                authorId: userId,
                content: content
            }
    
            if(props.parentCommentId != null){
                createComment.parentCommentId = props.parentCommentId
            }
    
            CommentAPIService.createComment(createComment)
            .then((response) => {
                dispatch(setNotificationMessage("Komentarz został dodany"))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                props.createSubComment!(response.data)
                props.onCancel()
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.response.data))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            })
        }
    }

    const handleChangeContent = (newContent: string) => {

        setContent(newContent)
        setContentError('')
    }

    return (
        <Grid item container justifyContent="center">
            <FormControl fullWidth={true}>
                <TextField
                    multiline
                    id="firstname"
                    placeholder="Tekst komentarza"
                    color="secondary"
                    rows={2}
                    value={content}
                    error={contentError != ''}
                    onChange={(event: any) => handleChangeContent(event.target.value)}
                    InputLabelProps={{
                        style: { color: contentError !== '' ? 'red' : '#5CA8EE' },
                    }}
                />
                <FormHelperText error>{contentError + ' '}</FormHelperText>
            </FormControl>
            <Grid item container justifyContent="center" spacing={2}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSaveComment}
                    >
                        Zapisz
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={props.onCancel}
                    >
                        Anuluj
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CreateUpdateComment;