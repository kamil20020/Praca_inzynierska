import { Button, FormControl, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormElement from "../../components/common/FormElement";
import SelectTechnologyCategory from "../../components/common/SelectTechnologyCategory";
import Article from "../../models/dto/Article";
import { Technology } from "../../models/dto/Technology";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import { RootState } from "../../redux/store";
import ArticleAPIService, { CreateArticle, UpdateArticle } from "../../services/ArticleAPIService";
import FormValidator from "../../services/FormValidator";
import TechnologyAPIService from "../../services/TechnologyAPIService";

interface FormProps {
    title: string,
    content: string,
    selectedTechnologyCategoryId?: number,
    selectedTechnologyId: number
}

interface ErrorProps {
    title: string,
    content: string,
    selectedTechnologyId: string
}

const CreateUpdateArticle = () => {

    const articleId = useParams().articleId as string

    const authorId = useSelector((state: RootState) => state.user.user).id as number
    const [availableTechnologies, setAvailableTechnologies] = React.useState<Technology[]>([]);
    const [form, setForm] = React.useState<FormProps>({
        title: '',
        content: '',
        selectedTechnologyCategoryId: -1,
        selectedTechnologyId: -1
    })
    const [errors, setErrors] = React.useState<ErrorProps>({
        title: '',
        content: '',
        selectedTechnologyId: ''
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isUpdatingArticle = () => (
        articleId !== 'null'
    )

    useEffect(() => {
        if(!isUpdatingArticle())
            return;

        ArticleAPIService.getById(articleId as string)
        .then((response) => {
            const article: Article = response.data
            setForm({
                title: article.title,
                content: article.content,
                selectedTechnologyCategoryId: article.technologyDTO.technologyCategoryDTO.id,
                selectedTechnologyId: article.technologyDTO.id
            })
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
            navigate("../")
        })
    }, [])

    useEffect(() => {
        if(form.selectedTechnologyCategoryId == -1){
            TechnologyAPIService.getAll()
            .then((response) => {
                setAvailableTechnologies(response.data)
            })
        }
        else{
            TechnologyAPIService.getAllByTechnologyCategoryId(form.selectedTechnologyCategoryId as number)
            .then((response) => {
                setAvailableTechnologies(response.data)
            })
        }
    }, [form.selectedTechnologyCategoryId])

    const validateForm = () => {

        let success = true

        let newErrorsState = {...errors}

        if(!FormValidator.checkIfIsRequired(form.title)){
            newErrorsState.title = FormValidator.requiredMessage
            success = false
        }

        if(!FormValidator.checkIfIsRequired(form.selectedTechnologyId == -1 ? '' : 'a')){
            newErrorsState.selectedTechnologyId = FormValidator.requiredMessage
            success = false
        }

        if(!FormValidator.checkIfIsRequired(form.content)){
            newErrorsState.content = FormValidator.requiredMessage
            success = false
        }

        setErrors(newErrorsState)

        return success
    }

    const onFieldChange = (field: string, event: any) => {
        setForm({...form, [field]: event.target.value})
        setErrors({...errors, [field]: ''})
    }

    const handleSave = () => {

        if(!validateForm())
            return

        const newArticle: CreateArticle = {
            title: form.title,
            authorId: authorId,
            technologyId: form.selectedTechnologyId,
            content: form.content
        }

        if(!isUpdatingArticle()){

            ArticleAPIService.createArticle(newArticle)
            .then((response) => {
                dispatch(setNotificationMessage("Pomyślnie utworzono artykuł"))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                navigate(`../details/${response.data.id}`)
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.response.data))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            })
        }
        else{

            ArticleAPIService.updateArticleById(articleId, newArticle)
            .then((response) => {
                dispatch(setNotificationMessage("Pomyślnie zaktualizowano artykuł"))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                navigate(`../details/${response.data.id}`)
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.response.data))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
                console.log(error)
            })
        }
    }

    return (
        <Grid item xs={12} container alignItems="start" justifyContent="center">
            <Grid item xs={12} container justifyContent="center" sx={{marginTop: 7}}>
                <Typography textAlign="center" variant="h4" sx={{marginRight: 5}}>
                    {isUpdatingArticle() ? "Aktualizowanie artykułu" : "Tworzenie artykułu"}
                </Typography>
            </Grid>
            <Grid item xs={11} container justifyContent="center">
                <Grid item xs={4} container justifyContent="stretch" spacing={4} marginTop={3} marginBottom={4}>
                    <Grid item xs={12} container>
                        <Grid item xs={6} marginTop={1.6}>
                            <Typography textAlign="start" variant="h6">
                                Tytuł
                            </Typography>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <FormControl fullWidth>
                                <OutlinedInput
                                    id="title" 
                                    color="secondary"
                                    value={form.title}
                                    error={errors.title != ''}
                                    onChange={(event: any) => onFieldChange('title', event)} 
                                />
                                <FormHelperText error>{errors.title + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <SelectTechnologyCategory 
                        technologyCategoryId={form.selectedTechnologyCategoryId} 
                        onSelect={(id: number) => setForm({...form, selectedTechnologyCategoryId: id})}
                    />
                    <Grid item xs={12} container marginTop={3}>
                        <Grid item xs={6} marginTop={1.6}>
                            <Typography textAlign="start" variant="h6">Technologia</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="select-technology-label"
                                    id="select-technology"
                                    value={form.selectedTechnologyId !== -1 ? form.selectedTechnologyId.toString() : ''}
                                    error={errors.selectedTechnologyId != ''}
                                    color="secondary"
                                    onChange={(event: SelectChangeEvent) => onFieldChange('selectedTechnologyId', event)}
                                >
                                    {availableTechnologies.map((t: Technology, index: number) => (
                                        <MenuItem key={index} value={t.id}>{t.name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText error>{errors.selectedTechnologyId + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <Editor
                            init={{
                                menubar: true,
                                height: 800,
                                plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                                'searchreplace', 'fullscreen', 'insertdatetime', 'media', 'table', 'help',
                                'codesample'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help | codesample',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                codesample_languages: [
                                    {text: 'C', value: 'c' },
                                    {text: 'C#', value: 'csharp' },
                                    {text: 'C++', value: 'cpp' },
                                    {text: 'CSS', value: 'css' },
                                    {text: 'F#', value: 'fsharp' },
                                    {text: 'Java', value: 'java'},
                                    {text: 'HTML/XML', value: 'markup'},
                                    {text: 'JavaScript', value: 'javascript' },
                                    {text: 'Json', value: 'json' },
                                    {text: 'LESS', value: 'less' },
                                    {text: 'PHP', value: 'php'},
                                    {text: 'Python', value: 'python'},
                                    {text: 'Ruby', value: 'ruby'},
                                    {text: 'SASS', value: 'scss' },
                                    {text: 'SQL', value: 'sql' },
                                    {text: 'TypeScript', value: 'typescript' }
                                ],
                            }}
                            value={form.content}
                            onEditorChange={(content: string) => setForm({...form, content: content})}
                        />
                        <FormHelperText error>{errors.content + ' '}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item marginTop={4} marginBottom={3}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{marginRight: 4}}
                        onClick={handleSave}
                    >
                        Zapisz
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`../details/${articleId}`)}
                    >
                        Anuluj
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CreateUpdateArticle;