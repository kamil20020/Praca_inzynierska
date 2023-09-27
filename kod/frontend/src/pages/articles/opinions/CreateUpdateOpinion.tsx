import { ArticleOutlined } from "@mui/icons-material"
import { Button, FormControl, FormHelperText, Grid, Rating, RatingProps, TextField, Typography } from "@mui/material"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import CustomAvatar from "../../../components/common/CustomAvatar"
import Opinion from "../../../models/dto/Opinion"
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice"
import { RootState } from "../../../redux/store"
import FormValidator from "../../../services/FormValidator"
import OpinionAPIService, { CreateOpinion, UpdateOpinion } from "../../../services/OpinionAPIService"

export interface CreateUpdateOpinionProps {
    articleId: string,
    opinion?: Opinion,
    onCancel: () => void,
    createOpinion?: (opinion: Opinion) => void,
    editOpinion?: (opinion: Opinion) => void
}

interface FormProps {
    rating: number,
    content: string
}

const CreateUpdateOpinion = (props: CreateUpdateOpinionProps) => {

    const opinion = props.opinion

    const isUpdating: boolean = props.opinion !== undefined
    const loggedUserData = useSelector((state: RootState) => state.user).user
    const [form, setForm] = React.useState<FormProps>({
        rating: opinion ? opinion.rating : 0,
        content: opinion ? opinion.content : ''
    })
    const [error, setError] = React.useState<{rating: string, content: string}>({
        rating: '',
        content: ''
    })

    const dispatch = useDispatch()

    const validateForm = () => {

        let success = true

        let newError = {...error}

        if(!FormValidator.checkIfIsRequired(form.content)){
            newError.content = FormValidator.requiredMessage
            success = false;
        }

        if(form.rating == 0){
            newError.rating = FormValidator.requiredMessage
            success = false;
        }

        setError(newError)

        return success;
    }

    const handleSubmit = () => {

        if(!validateForm())
            return;

        if(isUpdating){

            const updateOpinion: UpdateOpinion = {
                rating: form.rating,
                content: form.content
            }

            OpinionAPIService.updateById(opinion?.id as string, updateOpinion)
            .then((response) => {
                dispatch(setNotificationMessage("Opinia została zaktualizowana"))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                props.editOpinion!(response.data)
                props.onCancel()
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.response.data))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            })
        }
        else{
            const createOpinion: CreateOpinion = {
                authorId: loggedUserData.id,
                articleId: props.articleId,
                rating: form.rating,
                content: form.content
            }

            OpinionAPIService.create(createOpinion)
            .then((response) => {
                dispatch(setNotificationMessage("Opinia została dodana"))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                props.createOpinion!(response.data)
                props.onCancel()
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.response.data))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            })
        }
    }

    return (
        <Grid item container>
            <Grid item marginBottom={1.5}>
                <Rating 
                    size="large" 
                    max={5} 
                    value={form.rating} 
                    precision={1} 
                    sx={{opacity: 1}}
                    onChange={(event: any, value: number | null) => {
                        setForm({...form, rating: value as number})
                        setError({...error, rating: ''})
                    }}
                />
                <FormHelperText error>{error.rating + ' '}</FormHelperText>
            </Grid>
            <FormControl fullWidth={true}>
                <TextField
                    multiline
                    id="firstname"
                    placeholder="Uzasadnienie oceny"
                    color="secondary"
                    rows={2}
                    value={form.content}
                    error={error.content !== ''}
                    onChange={(event: any) => {
                        setForm({...form, content: event.target.value})
                        setError({...error, content: ''})
                    }}
                    InputLabelProps={{
                        style: { color: error.content !== '' ? 'red' : '#5CA8EE'},
                    }}
                />
                <FormHelperText error>{error.content + ' '}</FormHelperText>
            </FormControl>
            <Grid item container justifyContent="center" spacing={2}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
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
    )
}

export default CreateUpdateOpinion;